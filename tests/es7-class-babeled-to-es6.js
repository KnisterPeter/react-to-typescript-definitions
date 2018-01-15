import { Component, createElement } from 'react';
import { any, array, arrayOf, bool, element, func, instanceOf, node, number, object, oneOf, oneOfType, shape, string, symbol } from 'prop-types';
import Message from './path/to/Message';

class MyComponent extends Component {

  render() {
    return createElement('div', null);
  }
}
MyComponent.propTypes = {
  /**
   * This is a jsdoc comment for optionalAny.
   */
  optionalAny: any,
  optionalArray: array,
  optionalBool: bool,
  optionalFunc: func,
  optionalNumber: number,
  optionalObject: object,
  optionalString: string,
  optionalNode: node,
  optionalElement: element,
  optionalMessage: instanceOf(Message),
  optionalEnum: oneOf(['News', 'Photos', 1, 2]),
  optionalUnion: oneOfType([string, number]),
  optionalArrayOf: arrayOf(number),
  optionalObjectWithShape: shape({
    color: string,
    fontSize: number
  }),
  requiredFunc: func.isRequired,
  requiredAny: any.isRequired,
  requiredUnion: oneOfType([array, bool]).isRequired,
  requiredArrayOf: arrayOf(string).isRequired,
  requiredArrayOfObjectsWithShape: arrayOf(shape({
    color: string,
    fontSize: number
  })).isRequired,
  deeplyNested: arrayOf(shape({
    arrayInDeeplyNested: arrayOf(shape({
      foo: number
    }))
  })).isRequired,
  requiredSymbol: symbol.isRequired
};

export { MyComponent };
