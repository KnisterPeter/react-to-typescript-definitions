import { assert } from 'chai';
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
    assert.deepEqual(getTypeFromPropType(ast, instanceOfResolver), {type: 'any', optional: true});
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
    assert.deepEqual(getTypeFromPropType(ast, instanceOfResolver), {type: 'any[]', optional: true});
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
    assert.deepEqual(getTypeFromPropType(ast, instanceOfResolver), {type: 'boolean', optional: true});
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
    assert.deepEqual(getTypeFromPropType(ast, instanceOfResolver), {type: '(...args: any[]) => any', optional: true});
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
    assert.deepEqual(getTypeFromPropType(ast, instanceOfResolver), {type: 'number', optional: true});
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
    assert.deepEqual(getTypeFromPropType(ast, instanceOfResolver), {type: 'Object', optional: true});
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
    assert.deepEqual(getTypeFromPropType(ast, instanceOfResolver), {type: 'string', optional: true});
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
    assert.deepEqual(getTypeFromPropType(ast, instanceOfResolver), {type: 'React.ReactNode', optional: true});
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
    assert.deepEqual(getTypeFromPropType(ast, instanceOfResolver), {type: 'React.ReactElement<any>', optional: true});
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
    assert.equal(result.optional, true);
    assert.isUndefined(result.importType);
    assert.isUndefined(result.importPath);
  });
});
