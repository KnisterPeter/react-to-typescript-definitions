import { assert } from 'chai';
import { Generator, generateFromSource } from '../src/index';

describe('The Generator', () => {
  let generator: Generator;
  beforeEach(() => {
    generator = new Generator();
  });
  it('should write a module declaration', () => {
    generator.declareModule('name', () => {
      //
    });
    assert.equal(generator.toString(), "declare module 'name' {\n}\n");
  });
  it('should write an import statement', () => {
    generator.import('decls', 'from');
    assert.equal(generator.toString(), "import decls from 'from';\n");
  });
  it('should write a required property', () => {
    generator.prop('name', 'type', false);
    assert.equal(generator.toString(), 'name: type;\n');
  });
  it('should write an optional property', () => {
    generator.prop('name', 'type', true);
    assert.equal(generator.toString(), 'name?: type;\n');
  });
  it('should write a property interface', () => {
    generator.props('Name', {prop: {type: 'type', type2: 'any', optional: true}});
    assert.equal(generator.toString(), 'export interface NameProps {\n\tprop?: type;\n}\n');
  });
  it('should write a class with props declaration', () => {
    generator.class('Name', true);
    assert.equal(generator.toString(), 'class Name extends React.Component<NameProps, any> {\n}\n');
  });
  it('should write a class without props declaration', () => {
    generator.class('Name', false);
    assert.equal(generator.toString(), 'class Name extends React.Component<any, any> {\n}\n');
  });
  it('should write an indented block comment', () => {
    generator.comment('* yada\n\t\t\t\tyada\n ');
    assert.equal(generator.toString(), '/** yada\nyada\n */\n');
  });
  it('should write an export default declaration', () => {
    generator.exportDeclaration(0, () => undefined);
    assert.equal(generator.toString(), 'export default ');
  });
  it('should write a named export declaration', () => {
    generator.exportDeclaration(1, () => undefined);
    assert.equal(generator.toString(), 'export ');
  });
});

describe('Generating typings with given custom generator', () => {
  let generator: Generator;

  beforeEach(() => {
    generator = new Generator();
  });

  it('should delare a module if name given', () => {
    let name: string|undefined;
    generator.declareModule = moduleName => {
      name = moduleName;
    };

    const source = `
      export class Test {}
    `;
    generateFromSource('module', source, {generator});

    assert.equal(name, 'module');
  });

  it('should import react', () => {
    let decl: string|undefined;
    let from: string|undefined;
    generator.import = (_decl, _from) => {
      decl = _decl;
      from = _from;
    };

    const source = `
      export class Test {}
    `;
    generateFromSource(null, source, {generator});

    assert.equal(decl, '* as React');
    assert.equal(from, 'react');
  });
});
