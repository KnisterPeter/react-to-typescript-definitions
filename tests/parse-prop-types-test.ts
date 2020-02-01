// tslint:disable:no-implicit-dependencies
import test from 'ava';

import { getTypeFromPropType } from '../src/analyzer';
import { IProp } from '../src/deprecated';

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

test('The PropType parser should return any on unknown PropTypes', t => {
  const ast: any = {
    type: '',
    loc: {}
  };
  const expected = {
    type: 'any',
    optional: true
  };
  t.deepEqual(getTypeFromPropType(ast, instanceOfResolver), expected);
});
test('The PropType parser should return any[] for generic array prop types', t => {
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
    optional: true
  };
  t.deepEqual(getTypeFromPropType(ast, instanceOfResolver), expected);
});
test('The PropType parser should return boolean for bool prop types', t => {
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
    optional: true
  };
  t.deepEqual(getTypeFromPropType(ast, instanceOfResolver), expected);
});
test('The PropType parser should return a generic function for func prop types', t => {
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
    optional: true
  };
  t.deepEqual(getTypeFromPropType(ast, instanceOfResolver), expected);
});
test('The PropType parser should return a generic required function for func.isRequired prop types', t => {
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
  t.is(result.type, '(...args: any[]) => any');
  t.is(result.optional, false);
});
test('The PropType parser should return number for number prop types', t => {
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
    optional: true
  };
  t.deepEqual(getTypeFromPropType(ast, instanceOfResolver), expected);
});
test('The PropType parser should return Object for object prop types', t => {
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
    optional: true
  };
  t.deepEqual(getTypeFromPropType(ast, instanceOfResolver), expected);
});
test('The PropType parser should return string for string prop types', t => {
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
    optional: true
  };
  t.deepEqual(getTypeFromPropType(ast, instanceOfResolver), expected);
});
test('The PropType parser should return React.ReactNode for node prop types', t => {
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
    optional: true
  };
  t.deepEqual(getTypeFromPropType(ast, instanceOfResolver), expected);
});
test('The PropType parser should return React.ReactElement<any> for element prop types', t => {
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
    optional: true
  };
  t.deepEqual(getTypeFromPropType(ast, instanceOfResolver), expected);
});
test('The PropType parser should return number[] for arrayOf(React.PropTypes.number) prop types', t => {
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
  t.is(result.type, 'number[]');
  t.is(result.optional, true);
});
test(
  'The PropType parser should return number|string for' +
    'oneOfType([React.PropTypes.number, React.PropTypes.string]) prop types',
  t => {
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
    t.is(result.type, 'number|string');
    t.is(result.optional, true);
  }
);
test('The PropType parser should return Message for instanceOf(Message) prop types', t => {
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
  const result: IProp = getTypeFromPropType(ast, (): string => './some/path');
  t.is(result.type, 'Message');
  t.is(result.optional, true);
  t.is(result.importPath, './some/path');
});
test('The PropType parser should return any for unresolved instanceOf(Message) prop types', t => {
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
  t.is(result.type, 'any');
  t.is(result.optional, true);
  t.is(result.importPath, undefined);
});
