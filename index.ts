import * as fs from 'fs';
import * as babylon from 'babylon';

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
    process.stdout.write(generate(options.name, stdinCode.join('')));
  });
}

export function generateFromFile(name: string, path: string): string {
  return generate(name, fs.readFileSync(path).toString());
}

export function generate(name: string, code: string): string {
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
  const writer: Writer = new Writer();
  writer.declareModule(name, () => {
    writer.import('* as React', 'react');
    writer.nl();
    walk(ast.program, {
      'ExportDefaultDeclaration': (node: any) => {
        let classname: string;
        let propTypes: any = false;
        walk(node, {
          'ClassDeclaration': (node: any) => {
            classname = node.id.name;
            walk(node.body, {
              'ClassProperty': (node: any) => {
                if (node.key.name == 'propTypes') {
                  propTypes = {};
                  walk(node.value, {
                    'ObjectProperty': (node: any) => {
                      propTypes[node.key.name] = getTypeFromPropType(node.value);
                    }
                  });
                }
              }
            });
            writer.props(classname, propTypes);
            writer.nl();
          }
        });
        writer.exportDefault(() => {
          writer.class(classname, !!propTypes);
        });
      }
    });
  });
  return writer.toString();
}

function walk(node: any, handlers: any): void {
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

function isNode(obj: any): boolean {
  return obj && typeof obj.type != 'undefined' && typeof obj.loc != 'undefined';
}

function getReactPropTypeFromExpression(node: any): any {
  if (node.type == 'MemberExpression' && node.object.type == 'MemberExpression'
      && node.object.object.name == 'React' && node.object.property.name == 'PropTypes') {
    return node.property;
  } else if (node.type == 'CallExpression') {
    if (getReactPropTypeFromExpression(node.callee).name == 'arrayOf') {
      return {
        name: 'array',
        arrayType: getReactPropTypeFromExpression(node.arguments[0])
      };
    }
  }
  return 'undefined';
}

function isRequiredPropType(node: any): any {
  const isRequired: boolean = node.type == 'MemberExpression' && node.property.name == 'isRequired';
  return {
    isRequired,
    type: getReactPropTypeFromExpression(isRequired ? node.object : node)
  };
}

interface IProperty {
  type: string;
  optional: boolean;
}

export function getTypeFromPropType(node: any): IProperty {
  const result: any = {
    type: 'any',
    optional: true
  };
  if (isNode(node)) {
    const {isRequired, type}: any = isRequiredPropType(node);
    result.optional = !isRequired;
    switch (type.name) {
      case 'any':
        result.type = 'any';
        break;
      case 'array':
        let arrayType: any = type.arrayType || {name: 'any'};
        result.type = arrayType.name + '[]';
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
    }
  }
  return result;
}

export class Writer {

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
    this.code += Writer.NL;
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

  public props(name: string, props: any, fn?: () => void): void {
    this.interface(`${name}Props`, () => {
      this.prop('key', 'any', true);
      Object.keys(props).forEach((propName: any) => {
        const prop: IProperty = props[propName];
        this.prop(propName, prop.type, prop.optional);
      });
    });
    if (fn) {
      fn();
    }
  }

  public prop(name: string, type: string, optional: boolean, fn?: () => void): void {
    this.indent();
    this.code += `${name}${optional ? '?' : ''}: ${type};`;
    this.nl();
    if (fn) {
      fn();
    }
  }

  public interface(name: string, fn: () => void): void {
    this.indent();
    this.code += `interface ${name} {`;
    this.nl();
    this.indentLevel++;
    fn();
    this.indentLevel--;
    this.indent();
    this.code += '}';
    this.nl();
  }

  public exportDefault(fn: () => void): void {
    this.indent();
    this.code += 'export default ';
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
