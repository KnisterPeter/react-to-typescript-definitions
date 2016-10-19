import * as fs from 'fs';
import * as babylon from 'babylon';
import * as dom from 'dts-dom';

export interface InstanceOfResolver {
  (name: string): string;
};

export interface IOptions {
  /**
   * Resolves type names to import paths.
   *
   * @return Path to given name if resolveable, undefined otherwise
   */
  instanceOfResolver?: InstanceOfResolver;
  /**
   * The Generator generating .d.ts code with.
   *
   * This option is deprecated with 0.13 and is not supported anymore.
   * any new feature will not work with the deprecated Generator interface.

   * @deprecated
   */
  generator?: Generator;
}

export interface IASTNode {
  type: string;
  loc: Object;
  [name: string]: any;
  value?: any;
  key?: any;
  expression?: any;
  id?: any;
  body?: any;
}

export interface IProp {
  type: string;
  type2: dom.Type;
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
    const chunk = process.stdin.read();
    if (chunk !== null) {
      stdinCode.push(chunk.toString());
    } else {
      // No stdin -> let node terminate
      process.stdin.pause();
    }
  });
  process.stdin.on('end', () => {
    if (options['top-level-module']) {
      process.stdout.write(generateFromSource(null, stdinCode.join('')));
    } else if (options['module-name']) {
      process.stdout.write(generateFromSource(options['module-name'], stdinCode.join('')));
    } else {
      console.error('Failed to specify --module-name or --top-level-module parameter');
      process.exit(1);
    }
  });
}

export function generateFromFile(moduleName: string, path: string, options?: IOptions): string {
  return generateFromSource(moduleName, fs.readFileSync(path).toString(), options);
}

export function generateFromSource(moduleName: string, code: string, options: IOptions = {}): string {
  const ast = babylon.parse(code, {
    sourceType: 'module',
    allowReturnOutsideFunction: true,
    allowImportExportEverywhere: true,
    allowSuperOutsideMethod: true,
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
      'functionBind',
      'functionSent'
    ]
  });
  return generateFromAst(moduleName, ast, options);
}

const defaultInstanceOfResolver: InstanceOfResolver = (name: string): string => undefined;

export function generateFromAst(moduleName: string, ast: any, options: IOptions = {}): string {
  const parsingResult = parseAst(ast, options.instanceOfResolver);
  if (options.generator) {
    return deprecatedGenerator(options.generator, moduleName, parsingResult);
  }

  const {exportType, classname, propTypes} = parsingResult;
  if (moduleName === null) {
    let code = '';

    code += dom.emit(dom.create.importAll('React', 'react'));
    if (propTypes) {
      Object.keys(propTypes).forEach(propName => {
        const prop = propTypes[propName];
        if (prop.importPath) {
          code += dom.emit(dom.create.importDefault(prop.importType, prop.importPath));
        }
      });
    }
    const interf = createReactPropInterface(classname, propTypes);
    code += dom.emit(interf);

    const classDecl = createReactClassDeclaration(classname, propTypes, interf);
    code += dom.emit(classDecl);

    return code;
  } else {
    const m = dom.create.module(moduleName);
    m.members.push(dom.create.importAll('React', 'react'));
    if (propTypes) {
      Object.keys(propTypes).forEach(propName => {
        const prop = propTypes[propName];
        if (prop.importPath) {
          m.members.push(dom.create.importDefault(prop.importType, prop.importPath));
        }
      });
    }
    const interf = createReactPropInterface(classname, propTypes);
    m.members.push(interf);

    const classDecl = createReactClassDeclaration(classname, propTypes, interf);
    m.members.push(classDecl);

    return dom.emit(m, dom.ContextFlags.Module);
  }
}

function createReactPropInterface(classname: string, propTypes: IPropTypes): dom.InterfaceDeclaration {
  const interf = dom.create.interface(`${classname}Props`);
  interf.flags = dom.DeclarationFlags.Export;
  Object.keys(propTypes).forEach(propName => {
    const prop = propTypes[propName];

    const property = dom.create.property(propName, prop.type2,
      prop.optional ? dom.DeclarationFlags.Optional : 0);
    if (prop.documentation) {
      property.jsDocComment = prop.documentation
            .split('\n')
            .map(line => line.trim())
            .map(line => line.replace(/^\*\*?/, ''))
            .map(line => line.trim())
            .filter(trimLines())
            .reverse()
            .filter(trimLines())
            .reverse()
            .join('\n');
    }
    interf.members.push(property);
  });
  return interf;
}

function trimLines(): (line: string) => boolean {
  let characterFound = false;
  return (line: string) => (characterFound = Boolean(line)) && Boolean(line);
}

function createReactClassDeclaration(classname: string, propTypes: IPropTypes,
    interf: dom.InterfaceDeclaration): dom.ClassDeclaration {
  const classDecl = dom.create.class(classname);
  classDecl.baseType = dom.create.interface(`React.Component<${propTypes ? interf.name : 'any'}, any>`);
  classDecl.flags = dom.DeclarationFlags.Export;
  return classDecl;
}

function deprecatedGenerator(generator: Generator, moduleName: string,
    {exportType, classname, propTypes}: IParsingResult): string {
  const generateTypings = () => {
    generator.import('* as React', 'react');
    if (propTypes) {
      Object.keys(propTypes).forEach(propName => {
        const prop = propTypes[propName];
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
  };

  if (moduleName === null) {
    generateTypings();
  } else {
    generator.declareModule(moduleName, generateTypings);
  }
  return generator.toString();
}

export enum ExportType {
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
    'ExportNamedDeclaration': exportNode => {
      exportType = ExportType.named;
    },
    'ExportDefaultDeclaration': exportNode => {
      exportType = ExportType.default;
    },
    'ClassDeclaration': classNode => {
      classname = classNode.id.name;
      walk(classNode.body, {
        'ClassProperty': attributeNode => {
          if (attributeNode.key.name == 'propTypes') {
            propTypes = parsePropTypes(attributeNode.value, instanceOfResolver);
          }
        }
      });
    },
    'ExpressionStatement': expressionNode => {
      if (expressionNode.expression.type == 'AssignmentExpression'
          && expressionNode.expression.left.type == 'MemberExpression'
          && expressionNode.expression.left.property.name == 'propTypes') {
        if (classname === undefined) {
          classname = expressionNode.expression.left.object.name;
        }
        if (expressionNode.expression.left.object.name == classname) {
          propTypes = parsePropTypes(expressionNode.expression.right, instanceOfResolver);
        }
      }
    }
  });
  if (exportType === undefined) {
    walk(ast.program, {
    'ExpressionStatement': expressionNode => {
      if (expressionNode.expression.type == 'AssignmentExpression'
          && expressionNode.expression.left.type == 'MemberExpression'
          && expressionNode.expression.left.object.name == 'exports'
          && expressionNode.expression.left.property.name == 'default') {
        exportType = ExportType.default;
      }
    }
    });
  }
  return {
    exportType,
    classname,
    propTypes
  };
}

function parsePropTypes(node: any, instanceOfResolver: InstanceOfResolver): IPropTypes {
  let propTypes: IPropTypes = {};
  walk(node, {
    'ObjectProperty': propertyNode => {
      const prop: IProp = getTypeFromPropType(propertyNode.value, instanceOfResolver);
      prop.documentation = getOptionalDocumentation(propertyNode);
      propTypes[propertyNode.key.name] = prop;
    }
  });
  return propTypes;
}

function getOptionalDocumentation(propertyNode: any): string {
  return (((propertyNode.leadingComments || []) as any[])
    .filter(comment => comment.type == 'CommentBlock')[0] || {})
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
    Object.keys(node).forEach(childKey => {
      const child = node[childKey];
      let children: any[] = child;
      if (!Array.isArray(child)) {
        children = [child];
      }
      children.forEach(child => {
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
    const callType = getReactPropTypeFromExpression(node.callee, instanceOfResolver);
    switch (callType.name) {
      case 'instanceOf':
        return {
          name: 'instanceOf',
          type: node.arguments[0].name,
          type2: {
            kind: 'name',
            name: node.arguments[0].name
          },
          importPath: instanceOfResolver(node.arguments[0].name)
        };
      case 'arrayOf':
        const arrayType = getTypeFromPropType(node.arguments[0], instanceOfResolver);
        return {
          name: 'array',
          arrayType: arrayType.type,
          arrayType2: arrayType.type2
        };
      case 'oneOfType':
        const unionTypes = node.arguments[0].elements.map((element: IASTNode) =>
          getTypeFromPropType(element, instanceOfResolver));
        return {
          name: 'union',
          types: unionTypes.map((type: any) => type.type),
          types2: unionTypes.map((type: any) => type.type2)
        };
    }
  }
  return 'undefined';
}

function isRequiredPropType(node: any, instanceOfResolver: InstanceOfResolver): any {
  const isRequired = node.type == 'MemberExpression' && node.property.name == 'isRequired';
  return {
    isRequired,
    type: getReactPropTypeFromExpression(isRequired ? node.object : node, instanceOfResolver)
  };
}

/**
 * This is for internal use only
 */
export function getTypeFromPropType(node: IASTNode, instanceOfResolver = defaultInstanceOfResolver): IProp {
  const result: IProp = {
    type: 'any',
    type2: 'any',
    optional: true
  };
  if (isNode(node)) {
    const {isRequired, type} = isRequiredPropType(node, instanceOfResolver);
    result.optional = !isRequired;
    switch (type.name) {
      case 'any':
        result.type = 'any';
        result.type2 = 'any';
        break;
      case 'array':
        result.type = (type.arrayType || 'any') + '[]';
        result.type2 = {
          kind: 'array',
          type: type.arrayType2 || 'any'
        };
        break;
      case 'bool':
        result.type = 'boolean';
        result.type2 = 'boolean';
        break;
      case 'func':
        result.type = '(...args: any[]) => any';
        result.type2 = {
          kind: 'function',
          name: '',
          parameters: [
            {
              kind: 'parameter',
              name: 'args',
              type: {
                kind: 'array',
                type: 'any'
              },
              flags: dom.ParameterFlags.Rest
            }
          ],
          returnType: 'any'
        };
        break;
      case 'number':
        result.type = 'number';
        result.type2 = 'number';
        break;
      case 'object':
        result.type = 'Object';
        result.type2 = {
          kind: 'name',
          name: 'Object'
        };
        break;
      case 'string':
        result.type = 'string';
        result.type2 = 'string';
        break;
      case 'node':
        result.type = 'React.ReactNode';
        result.type2 = {
          kind: 'name',
          name: 'React.ReactNode'
        };
        break;
      case 'element':
        result.type = 'React.ReactElement<any>';
        result.type2 = {
          kind: 'name',
          name: 'React.ReactElement<any>'
        };
        break;
      case 'union':
        result.type = type.types.map((unionType: string) => unionType).join('|');
        result.type2 = {
          kind: 'union',
          members: type.types2
        };
        break;
      case 'instanceOf':
        if (type.importPath) {
          result.type = 'typeof ' + type.type;
          result.type2 = {
            kind: 'typeof',
            type: type.type2
          };
          (result as any).importType = type.type;
          (result as any).importPath = type.importPath;
        } else {
          result.type = 'any';
          result.type2 = 'any';
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
    let result = '';
    for (let i = 0, n = this.indentLevel; i < n; i++) {
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
      Object.keys(props).forEach(propName => {
        const prop = props[propName];
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
    const lines = (comment || '').replace(/\t/g, '').split(/\n/g);
    lines.forEach((line, index) => {
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
