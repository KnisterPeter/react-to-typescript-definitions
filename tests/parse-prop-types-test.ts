import { assert } from 'chai';
import * as dom from 'dts-dom';
import { getTypeFromPropType, IProp } from '../index';

describe('The PropType parser', () => {
  const instanceOfResolver = (): any => undefined;
  const reactPropTypesMemberExpression: any = {
      type: 'MemberExpression',
      object: {
        name: 'React'
      },
      property: {
        name: 'PropTypes'
      }
    };
  it('should return any on unknown PropTypes', () => {
    const ast: any = {
      type: '',
      loc: {}
    };
    const expected = {
      type: 'any',
      type2: 'any',
      optional: true
    };
    assert.deepEqual(getTypeFromPropType(ast, instanceOfResolver), expected);
  });
  it('should return any[] for generic array prop types', () => {
    const ast: any = {
      type: 'MemberExpression',
      loc: {},
      object: reactPropTypesMemberExpression,
      property: {
        name: 'array'
      }
    };
    const expected = {
      type: 'any[]',
      type2: dom.create.array('any'),
      optional: true
    };
    assert.deepEqual(getTypeFromPropType(ast, instanceOfResolver), expected);
  });
  it('should return boolean for bool prop types', () => {
    const ast: any = {
      type: 'MemberExpression',
      loc: {},
      object: reactPropTypesMemberExpression,
      property: {
        name: 'bool'
      }
    };
    const expected = {
      type: 'boolean',
      type2: 'boolean',
      optional: true
    };
    assert.deepEqual(getTypeFromPropType(ast, instanceOfResolver), expected);
  });
  it('should return a generic function for func prop types', () => {
    const ast: any = {
      type: 'MemberExpression',
      loc: {},
      object: reactPropTypesMemberExpression,
      property: {
        name: 'func'
      }
    };
    const expected = {
      type: '(...args: any[]) => any',
      type2: dom.create.functionType([
        dom.create.parameter('args', dom.create.array('any'), dom.ParameterFlags.Rest)], 'any'),
      optional: true
    };
    assert.deepEqual(getTypeFromPropType(ast, instanceOfResolver), expected);
  });
  it('should return a generic required function for func.isRequired prop types', () => {
    const ast: any = {
      type: 'MemberExpression',
      loc: {},
      object: {
        type: 'MemberExpression',
        object: reactPropTypesMemberExpression,
        property: {
          name: 'func'
        }
      },
      property: {
        name: 'isRequired'
      }
    };
    const result: IProp = getTypeFromPropType(ast, instanceOfResolver);
    assert.equal(result.type, '(...args: any[]) => any');
    assert.deepEqual(result.type2,
      dom.create.functionType([dom.create.parameter('args', dom.create.array('any'), dom.ParameterFlags.Rest)], 'any'));
    assert.equal(result.optional, false);
  });
  it('should return number for number prop types', () => {
    const ast: any = {
      type: 'MemberExpression',
      loc: {},
      object: reactPropTypesMemberExpression,
      property: {
        name: 'number'
      }
    };
    const expected = {
      type: 'number',
      type2: 'number',
      optional: true
    };
    assert.deepEqual(getTypeFromPropType(ast, instanceOfResolver), expected);
  });
  it('should return Object for object prop types', () => {
    const ast: any = {
      type: 'MemberExpression',
      loc: {},
      object: reactPropTypesMemberExpression,
      property: {
        name: 'object'
      }
    };
    const expected = {
      type: 'Object',
      type2: dom.create.namedTypeReference('Object'),
      optional: true
    };
    assert.deepEqual(getTypeFromPropType(ast, instanceOfResolver), expected);
  });
  it('should return string for string prop types', () => {
    const ast: any = {
      type: 'MemberExpression',
      loc: {},
      object: reactPropTypesMemberExpression,
      property: {
        name: 'string'
      }
    };
    const expected = {
      type: 'string',
      type2: 'string',
      optional: true
    };
    assert.deepEqual(getTypeFromPropType(ast, instanceOfResolver), expected);
  });
  it('should return React.ReactNode for node prop types', () => {
    const ast: any = {
      type: 'MemberExpression',
      loc: {},
      object: reactPropTypesMemberExpression,
      property: {
        name: 'node'
      }
    };
    const expected = {
      type: 'React.ReactNode',
      type2: dom.create.namedTypeReference('React.ReactNode'),
      optional: true
    };
    assert.deepEqual(getTypeFromPropType(ast, instanceOfResolver), expected);
  });
  it('should return React.ReactElement<any> for element prop types', () => {
    const ast: any = {
      type: 'MemberExpression',
      loc: {},
      object: reactPropTypesMemberExpression,
      property: {
        name: 'element'
      }
    };
    const expected = {
      type: 'React.ReactElement<any>',
      type2: dom.create.namedTypeReference('React.ReactElement<any>'),
      optional: true
    };
    assert.deepEqual(getTypeFromPropType(ast, instanceOfResolver), expected);
  });
  it('should return number[] for arrayOf(React.PropTypes.number) prop types', () => {
    const ast: any = {
      type: 'CallExpression',
      loc: {},
      callee: {
        type: 'MemberExpression',
        loc: {},
        object: reactPropTypesMemberExpression,
        property: {
          name: 'arrayOf'
        }
      },
      arguments: [
        {
          type: 'MemberExpression',
          loc: {},
          object: reactPropTypesMemberExpression,
          property: {
            name: 'number'
          }
        }
      ]
    };
    const result: IProp = getTypeFromPropType(ast, instanceOfResolver);
    assert.equal(result.type, 'number[]');
    assert.deepEqual(result.type2, dom.create.array('number'));
    assert.equal(result.optional, true);
  });
  it('should return number|string for oneOfType([React.PropTypes.number, React.PropTypes.string]) prop types', () => {
    const ast: any = {
      type: 'CallExpression',
      loc: {},
      callee: {
        type: 'MemberExpression',
        loc: {},
        object: reactPropTypesMemberExpression,
        property: {
          name: 'oneOfType'
        }
      },
      arguments: [
        {
          type: 'ArrayExpression',
          loc: {},
          elements: [
            {
              type: 'MemberExpression',
              loc: {},
              object: reactPropTypesMemberExpression,
              property: {
                name: 'number'
              }
            },
            {
              type: 'MemberExpression',
              loc: {},
              object: reactPropTypesMemberExpression,
              property: {
                name: 'string'
              }
            }
          ]
        }
      ]
    };
    const result: IProp = getTypeFromPropType(ast, instanceOfResolver);
    assert.equal(result.type, 'number|string');
    assert.deepEqual(result.type2, dom.create.union(['number', 'string']));
    assert.equal(result.optional, true);
  });
  it('should return typeof Message for instanceOf(Message) prop types', () => {
    const ast: any = {
      type: 'CallExpression',
      loc: {},
      callee: {
        type: 'MemberExpression',
        loc: {},
        object: reactPropTypesMemberExpression,
        property: {
          name: 'instanceOf'
        }
      },
      arguments: [
        {
          type: 'Identifier',
          loc: {},
          name: 'Message'
        }
      ]
    };
    const result: IProp = getTypeFromPropType(ast, (name: string): string => './some/path');
    assert.equal(result.type, 'typeof Message');
    assert.deepEqual(result.type2, dom.create.typeof(dom.create.namedTypeReference('Message')));
    assert.equal(result.optional, true);
    assert.equal(result.importType, 'Message');
    assert.equal(result.importPath, './some/path');
  });
  it('should return any for unresolved instanceOf(Message) prop types', () => {
    const ast: any = {
      type: 'CallExpression',
      loc: {},
      callee: {
        type: 'MemberExpression',
        loc: {},
        object: reactPropTypesMemberExpression,
        property: {
          name: 'instanceOf'
        }
      },
      arguments: [
        {
          type: 'Identifier',
          loc: {},
          name: 'Message'
        }
      ]
    };
    const result: IProp = getTypeFromPropType(ast);
    assert.equal(result.type, 'any');
    assert.equal(result.type2, 'any');
    assert.equal(result.optional, true);
    assert.isUndefined(result.importType);
    assert.isUndefined(result.importPath);
  });
});
