import * as React from 'react';
import Message from './path/to/Message';

export class Component extends React.Component {

	render() {
		return (
			<div />
		);
	}
}
Component.propTypes = {
	/**
	 * This is a jsdoc comment for optionalAny.
	 */
	optionalAny: React.PropTypes.any,
	optionalArray: React.PropTypes.array,
	optionalBool: React.PropTypes.bool,
	optionalFunc: React.PropTypes.func,
	optionalNumber: React.PropTypes.number,
	optionalObject: React.PropTypes.object,
	optionalString: React.PropTypes.string,
	optionalNode: React.PropTypes.node,
	optionalElement: React.PropTypes.element,
	optionalMessage: React.PropTypes.instanceOf(Message),
	optionalEnum: React.PropTypes.oneOf(['News', 'Photos', 1, 2]),
	optionalUnion: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number
	]),
	optionalArrayOf: React.PropTypes.arrayOf(React.PropTypes.number),
	//optionalObjectOf: React.PropTypes.objectOf(React.PropTypes.number),
	optionalObjectWithShape: React.PropTypes.shape({
		color: React.PropTypes.string,
		fontSize: React.PropTypes.number
	}),
	requiredFunc: React.PropTypes.func.isRequired,
	requiredAny: React.PropTypes.any.isRequired,
	requiredUnion: React.PropTypes.oneOfType([
		React.PropTypes.func,
		React.PropTypes.bool
	]).isRequired,
	requiredArrayOf: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
	requiredArrayOfObjectsWithShape: React.PropTypes.arrayOf(React.PropTypes.shape({
		color: React.PropTypes.string,
		fontSize: React.PropTypes.number
	})).isRequired,
	deeplyNested: React.PropTypes.arrayOf(React.PropTypes.shape({
		arrayInDeeplyNested: React.PropTypes.arrayOf(React.PropTypes.shape({
			foo: React.PropTypes.number
		}))
	})).isRequired,
	requiredSymbol: React.PropTypes.symbol.isRequired,
};
