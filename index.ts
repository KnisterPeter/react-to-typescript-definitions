import * as fs from 'fs';
import * as babylon from 'babylon';

export function cli(options: any) {
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

function getTypeFromPropType(node: any): string {
  if (isNode(node)) {
    const isMemberExpression = (node: any): boolean => {
      return node.type == 'MemberExpression';
    };
    const convertMemberExpression = (node: any): string => {
      if (isMemberExpression(node.object)) {
        return convertMemberExpression(node.object) + '.' + node.property.name;
      }
      return node.object.name + '.' + node.property.name;
    };
    if (isMemberExpression(node)) {
      const type: string = convertMemberExpression(node);
      switch (type) {
        case 'React.PropTypes.any':
          return 'any';
        case 'React.PropTypes.array':
          return 'any[]';
        case 'React.PropTypes.bool':
          return 'boolean';
        case 'React.PropTypes.func':
          return '(...args: any[]) => any';
        case 'React.PropTypes.number':
          return 'number';
        case 'React.PropTypes.object':
          return 'Object';
        case 'React.PropTypes.string':
          return 'string';
        case 'React.PropTypes.node':
          return 'React.ReactNode';
        case 'React.PropTypes.element':
          return 'React.ReactElement<any>';
        // - React.PropTypes.instanceOf - Would only be possible if the TS
        //   class is known to the definition file. Probably then all code
        //   is written in TS.
        // - React.PropTypes.oneOf - Currently this could not be expressed
        //   in a typesave manner in TS.
      }
    }
  }
  return 'any';
}

class Writer {

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
      Object.keys(props).forEach((propName: any) => this.prop(propName, props[propName], true));
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
