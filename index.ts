import * as fs from 'fs';
import * as babylon from 'babylon';

type InstanceOfResolver = (name: string) => string;

export interface IOptions {
  /**
   * Resolves type names to import paths.
   * 
   * @return Path to given name if resolveable, undefined otherwise
   */
  instanceOfResolver?: InstanceOfResolver;
  /**
   * The Generator generating .d.ts code with.
   */
  generator?: Generator;
}

interface IASTNode {
  type: string;
  loc: Object;
  [name: string]: any;
}

export interface IProp {
  type: string;
  optional: boolean;
  importType?: string;
  importPath?: string;
  documentation?: string;
}

export interface IPropTypes {
  [name: string]: IProp;
}

export function cli(options: any): void {
  const stdinCode: string[] = [];
  process.stdin.on('readable', () => {
    const chunk: string|Buffer = process.stdin.read();
    if (chunk !== null) {
      stdinCode.push(chunk.toString());
    } else {
      // No stdin -> let node terminate
      process.stdin.pause();
    }
  });
  process.stdin.on('end', () => {
    if (!options.name) {
      console.error('Failed to specify --name parameter');
      process.exit(1);
    }
    process.stdout.write(generateFromSource(options.name, stdinCode.join('')));
  });
}

export function generateFromFile(name: string, path: string, options?: IOptions): string {
  return generateFromSource(name, fs.readFileSync(path).toString(), options);
}

export function generateFromSource(name: string, code: string, options: IOptions = {}): string {
  const ast: any = babylon.parse(code, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'flow',
      'asyncFunctions',
      'classConstructorCall',
      'doExpressions',
      'trailingFunctionCommas',
      'objectRestSpread',
      'decorators',
      'classProperties',
      'exportExtensions',
      'exponentiationOperator',
      'asyncGenerators',
      'functionSent'
    ]
  });
  return generateFromAst(name, ast, options);
}

const defaultInstanceOfResolver: InstanceOfResolver = (name: string): string => undefined;

export function generateFromAst(name: string, ast: any, options: IOptions = {}): string {
  const {exportType, classname, propTypes}: IParsingResult = parseAst(ast, options.instanceOfResolver);
  const generator: Generator = options.generator || new Generator();
  generator.declareModule(name, () => {
    generator.import('* as React', 'react');
    if (propTypes) {
      Object.keys(propTypes).forEach((propName: string) => {
        const prop: IProp = propTypes[propName];
        if (prop.importPath) {
          generator.import(prop.importType, prop.importPath);
        }
      });
    }
    generator.nl();
    generator.props(classname, propTypes);
    generator.nl();
    generator.exportDeclaration(exportType, () => {
      generator.class(classname, !!propTypes);
    });
  });
  return generator.toString();
}

enum ExportType {
  default,
  named
}

interface IParsingResult {
  exportType: ExportType;
  classname: string;
  propTypes: IPropTypes;
}

function parseAst(ast: any, instanceOfResolver: InstanceOfResolver): IParsingResult {
  let exportType: ExportType;
  let classname: string;
  let propTypes: IPropTypes = {};
  walk(ast.program, {
    'ExportNamedDeclaration': (exportNode: any): void => {
      exportType = ExportType.named;
    },
    'ExportDefaultDeclaration': (exportNode: any): void => {
      exportType = ExportType.default;
    },
    'ClassDeclaration': (classNode: any): void => {
      classname = classNode.id.name;
      walk(classNode.body, {
        'ClassProperty': (attributeNode: any): void => {
          if (attributeNode.key.name == 'propTypes') {
            propTypes = parsePropTypes(attributeNode.value, instanceOfResolver);
          }
        }
      });
    },
    'ExpressionStatement': (expressionNode: any): void => {
      if (expressionNode.expression.type == 'AssignmentExpression'
          && expressionNode.expression.left.type == 'MemberExpression'
          && expressionNode.expression.left.object.name == classname
          && expressionNode.expression.left.property.name == 'propTypes') {
        propTypes = parsePropTypes(expressionNode.expression.right, instanceOfResolver);
      }
    }
  });
  return {
    exportType,
    classname,
    propTypes
  };
}

function parsePropTypes(node: any, instanceOfResolver: InstanceOfResolver): IPropTypes {
  let propTypes: IPropTypes = {};
  walk(node, {
    'ObjectProperty': (propertyNode: any): void => {
      const prop: IProp = getTypeFromPropType(propertyNode.value, instanceOfResolver);
      prop.documentation = getOptionalDocumentation(propertyNode);
      propTypes[propertyNode.key.name] = prop;
    }
  });
  return propTypes;
}

function getOptionalDocumentation(propertyNode: any): string {
  return (((propertyNode.leadingComments || []) as any[])
    .filter((comment: any) => comment.type == 'CommentBlock')[0] || {})
    .value;
}

interface IAstWalkHandlers {
  [type: string]: (node: IASTNode) => void;
}

function walk(node: IASTNode, handlers: IAstWalkHandlers): void {
  if (isNode(node)) {
    if (typeof handlers[node.type] == 'function') {
      handlers[node.type](node);
    }
    Object.keys(node).forEach((childKey: any) => {
      const child: any = node[childKey];
      let children: any[] = child;
      if (!Array.isArray(child)) {
        children = [child];
      }
      children.forEach((child: any) => {
        walk(child, handlers);
      });
    });
  }
}

function isNode(obj: IASTNode): boolean {
  return obj && typeof obj.type != 'undefined' && typeof obj.loc != 'undefined';
}

function getReactPropTypeFromExpression(node: any, instanceOfResolver: InstanceOfResolver): any {
  if (node.type == 'MemberExpression' && node.object.type == 'MemberExpression'
      && node.object.object.name == 'React' && node.object.property.name == 'PropTypes') {
    return node.property;
  } else if (node.type == 'CallExpression') {
    const callType: any = getReactPropTypeFromExpression(node.callee, instanceOfResolver);
    switch (callType.name) {
      case 'instanceOf':
        return {
          name: 'instanceOf',
          type: node.arguments[0].name,
          importPath: instanceOfResolver(node.arguments[0].name)
        };
      case 'arrayOf':
        return {
          name: 'array',
          arrayType: getTypeFromPropType(node.arguments[0], instanceOfResolver).type
        };
      case 'oneOfType':
        return {
          name: 'union',
          types: node.arguments[0].elements.map((element: IASTNode) => {
            return getTypeFromPropType(element, instanceOfResolver).type;
          })
        };
    }
  }
  return 'undefined';
}

function isRequiredPropType(node: any, instanceOfResolver: InstanceOfResolver): any {
  const isRequired: boolean = node.type == 'MemberExpression' && node.property.name == 'isRequired';
  return {
    isRequired,
    type: getReactPropTypeFromExpression(isRequired ? node.object : node, instanceOfResolver)
  };
}

export function getTypeFromPropType(node: IASTNode, instanceOfResolver: InstanceOfResolver = defaultInstanceOfResolver): IProp {
  const result: any = {
    type: 'any',
    optional: true
  };
  if (isNode(node)) {
    const {isRequired, type}: any = isRequiredPropType(node, instanceOfResolver);
    result.optional = !isRequired;
    switch (type.name) {
      case 'any':
        result.type = 'any';
        break;
      case 'array':
        result.type = (type.arrayType || 'any') + '[]';
        break;
      case 'bool':
        result.type = 'boolean';
        break;
      case 'func':
        result.type = '(...args: any[]) => any';
        break;
      case 'number':
        result.type = 'number';
        break;
      case 'object':
        result.type = 'Object';
        break;
      case 'string':
        result.type = 'string';
        break;
      case 'node':
        result.type = 'React.ReactNode';
        break;
      case 'element':
        result.type = 'React.ReactElement<any>';
        break;
      case 'union':
        result.type = type.types.map((unionType: string) => unionType).join('|');
        break;
      case 'instanceOf':
        if (type.importPath) {
          result.type = 'typeof ' + type.type;
          result.importType = type.type;
          result.importPath = type.importPath;
        } else {
          result.type = 'any';
        }
        break;
    }
  }
  return result;
}

export class Generator {

  private static NL: string = '\n';

  private indentLevel: number = 0;

  private code: string = '';

  private indent(): void {
    let result: string = '';
    for (let i: number = 0, n: number = this.indentLevel; i < n; i++) {
      result += '\t';
    }
    this.code += result;
  }

  public nl(): void {
    this.code += Generator.NL;
  }

  public declareModule(name: string, fn: () => void): void {
    this.indent();
    this.code += `declare module '${name}' {`;
    this.nl();
    this.indentLevel++;
    fn();
    this.indentLevel--;
    this.indent();
    this.code += '}';
    this.nl();
  }

  public import(decl: string, from: string, fn?: () => void): void {
    this.indent();
    this.code += `import ${decl} from '${from}';`;
    this.nl();
    if (fn) {
      fn();
    }
  }

  public props(name: string, props: IPropTypes, fn?: () => void): void {
    this.interface(`${name}Props`, () => {
      this.prop('key', 'any', true);
      this.prop('ref', 'any', true);
      Object.keys(props).forEach((propName: any) => {
        const prop: IProp = props[propName];
        this.prop(propName, prop.type, prop.optional, prop.documentation);
      });
    });
    if (fn) {
      fn();
    }
  }

  public prop(name: string, type: string, optional: boolean, documentation?: string): void {
    this.indent();
    if (documentation) {
      this.comment(documentation);
    }
    this.code += `${name}${optional ? '?' : ''}: ${type};`;
    this.nl();
  }

  public comment(comment: string): void {
    this.code += '/*';
    const lines: string[] = (comment || '').replace(/\t/g, '').split(/\n/g);
    lines.forEach((line: string, index: number) => {
      this.code += line;
      if (index < lines.length - 1) {
        this.nl();
        this.indent();
      }
    });
    this.code += '*/';
    this.nl();
    this.indent();
  }

  public interface(name: string, fn: () => void): void {
    this.indent();
    this.code += `export interface ${name} {`;
    this.nl();
    this.indentLevel++;
    fn();
    this.indentLevel--;
    this.indent();
    this.code += '}';
    this.nl();
  }

  public exportDeclaration(exportType: ExportType, fn: () => void): void {
    this.indent();
    this.code += 'export ';
    if (exportType == ExportType.default) {
      this.code += 'default ';
    }
    fn();
  }

  public class(name: string, props: boolean, fn?: () => void): void {
    this.code += `class ${name} extends React.Component<${props ? `${name}Props` : 'any'}, any> {`;
    this.nl();
    this.indentLevel++;
    if (fn) {
      fn();
    }
    this.indentLevel--;
    this.indent();
    this.code += '}';
    this.nl();
  }

  public toString(): string {
    return this.code;
  }

}
