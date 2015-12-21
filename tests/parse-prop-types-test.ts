import { assert } from 'chai';
import { getTypeFromPropType } from '../index';

describe('The PropType parser', () => {
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
    assert.deepEqual(getTypeFromPropType(ast), {type: 'any', optional: true});
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
    assert.deepEqual(getTypeFromPropType(ast), {type: 'any[]', optional: true});
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
    assert.deepEqual(getTypeFromPropType(ast), {type: 'boolean', optional: true});
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
    assert.deepEqual(getTypeFromPropType(ast), {type: '(...args: any[]) => any', optional: true});
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
    const result: any = getTypeFromPropType(ast);
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
    assert.deepEqual(getTypeFromPropType(ast), {type: 'number', optional: true});
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
    assert.deepEqual(getTypeFromPropType(ast), {type: 'Object', optional: true});
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
    assert.deepEqual(getTypeFromPropType(ast), {type: 'string', optional: true});
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
    assert.deepEqual(getTypeFromPropType(ast), {type: 'React.ReactNode', optional: true});
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
    assert.deepEqual(getTypeFromPropType(ast), {type: 'React.ReactElement<any>', optional: true});
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
    const result: any = getTypeFromPropType(ast);
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
    const result: any = getTypeFromPropType(ast);
    assert.equal(result.type, 'number|string');
    assert.equal(result.optional, true);
  });
});
