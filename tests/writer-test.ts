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
  it('should write a property interface', () => {
    writer.props('Name', {prop: 'type'});
    assert.equal(writer.toString(), 'interface NameProps {\n\tkey?: any;\n\tprop?: type;\n}\n');
  });
});
