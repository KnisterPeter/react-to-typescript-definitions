import { assert } from 'chai';
import { Writer } from '../index';

describe('The Writer', () => {
  let writer: Writer;
  beforeEach(() => {
    writer = new Writer();
  });
  it('should write a module declaration', () => {
    writer.declareModule('name', () => {
      //
    });
    assert.equal(writer.toString(), "declare module 'name' {\n}\n");
  });
  it('should write an import statement', () => {
    writer.import('decls', 'from');
    assert.equal(writer.toString(), "import decls from 'from';\n");
  });
  it('should write a required property', () => {
    writer.prop('name', 'type', false);
    assert.equal(writer.toString(), 'name: type;\n');
  });
  it('should write an optional property', () => {
    writer.prop('name', 'type', true);
    assert.equal(writer.toString(), 'name?: type;\n');
  });
  it('should write a property interface', () => {
    writer.props('Name', {prop: 'type'});
    assert.equal(writer.toString(), 'interface NameProps {\n\tkey?: any;\n\tprop?: type;\n}\n');
  });
  it('should write a class with props declaration', () => {
    writer.class('Name', true);
    assert.equal(writer.toString(), 'class Name extends React.Component<NameProps, any> {\n}\n');
  });
  it('should write a class without props declaration', () => {
    writer.class('Name', false);
    assert.equal(writer.toString(), 'class Name extends React.Component<any, any> {\n}\n');
  });
});
