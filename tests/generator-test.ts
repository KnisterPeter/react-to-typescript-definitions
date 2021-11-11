// tslint:disable:no-implicit-dependencies
import test from 'ava';

import { Generator } from '../src/generator';
import { generateFromSource } from '../src/index';

function setup(): Generator {
  return new Generator();
}

test('The Generator should write a module declaration', (t) => {
  const generator = setup();
  generator.declareModule('name', () => {
    //
  });
  t.is(generator.toString(), "declare module 'name' {\n}\n");
});
test('The Generator should write an import statement', (t) => {
  const generator = setup();
  generator.import('decls', 'from');
  t.is(generator.toString(), "import decls from 'from';\n");
});
test('The Generator should write a required property', (t) => {
  const generator = setup();
  generator.prop('name', 'type', false);
  t.is(generator.toString(), 'name: type;\n');
});
test('The Generator should write an optional property', (t) => {
  const generator = setup();
  generator.prop('name', 'type', true);
  t.is(generator.toString(), 'name?: type;\n');
});
test('The Generator should write a property interface', (t) => {
  const generator = setup();
  generator.props('Name', { prop: { type: 'type', optional: true } });
  t.is(
    generator.toString(),
    'export interface NameProps {\n\tprop?: type;\n}\n'
  );
});
test('The Generator should write a class with props declaration', (t) => {
  const generator = setup();
  generator.class('Name', true);
  t.is(
    generator.toString(),
    'class Name extends React.Component<NameProps, any> {\n}\n'
  );
});
test('The Generator should write a class without props declaration', (t) => {
  const generator = setup();
  generator.class('Name', false);
  t.is(
    generator.toString(),
    'class Name extends React.Component<any, any> {\n}\n'
  );
});
test('The Generator should write an indented block comment', (t) => {
  const generator = setup();
  generator.comment('* yada\n\t\t\t\tyada\n ');
  t.is(generator.toString(), '/** yada\nyada\n */\n');
});
test('The Generator should write an export default declaration', (t) => {
  const generator = setup();
  generator.exportDeclaration(0, () => undefined);
  t.is(generator.toString(), 'export default ');
});
test('The Generator should write a named export declaration', (t) => {
  const generator = setup();
  generator.exportDeclaration(1, () => undefined);
  t.is(generator.toString(), 'export ');
});

test('Generating typings with given custom generator should delare a module if name given', (t) => {
  const generator = setup();
  let name: string | undefined;
  generator.declareModule = (moduleName) => {
    name = moduleName;
  };

  const source = `
    export class Test {}
  `;
  generateFromSource('module', source, { generator });

  t.is(name, 'module');
});

test('Generating typings with given custom generator should import react', (t) => {
  const generator = setup();
  let decl: string | undefined;
  let from: string | undefined;
  generator.import = (_decl, _from) => {
    decl = _decl;
    from = _from;
  };

  const source = `
    export class Test {}
  `;
  generateFromSource(null, source, { generator });

  t.is(decl, '* as React');
  t.is(from, 'react');
});
