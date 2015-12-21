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
    assert.equal(getTypeFromPropType({}), 'any');
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
    assert.equal(getTypeFromPropType(ast), 'any[]');
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
    assert.equal(getTypeFromPropType(ast), 'boolean');
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
    assert.equal(getTypeFromPropType(ast), '(...args: any[]) => any');
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
    assert.equal(getTypeFromPropType(ast), 'number');
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
    assert.equal(getTypeFromPropType(ast), 'Object');
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
    assert.equal(getTypeFromPropType(ast), 'string');
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
    assert.equal(getTypeFromPropType(ast), 'React.ReactNode');
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
    assert.equal(getTypeFromPropType(ast), 'React.ReactElement<any>');
  });
});
