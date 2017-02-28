import { IPropTypes, ExportType } from './deprecated';

export class Generator {

  private static NL = '\n';

  private indentLevel = 0;

  private code = '';

  private indent(): void {
    let result = '';
    const n = this.indentLevel;
    for (let i = 0; i < n; i++) {
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
    if (exportType === ExportType.default) {
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
