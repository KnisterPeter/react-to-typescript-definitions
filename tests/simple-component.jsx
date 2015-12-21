import * as React from 'react';

export default class SimpleComponent extends React.Component {

	static propTypes = {
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
		//optionalEnum: React.PropTypes.oneOf(['News', 'Photos']),
		optionalUnion: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.number
		]),
		optionalArrayOf: React.PropTypes.arrayOf(React.PropTypes.number),
		//optionalObjectOf: React.PropTypes.objectOf(React.PropTypes.number),
		//optionalObjectWithShape: React.PropTypes.shape({
		//	color: React.PropTypes.string,
		//	fontSize: React.PropTypes.number
		//}),
		requiredFunc: React.PropTypes.func.isRequired,
		requiredAny: React.PropTypes.any.isRequired,
		requiredUnion: React.PropTypes.oneOfType([
			React.PropTypes.array,
			React.PropTypes.bool
		]).isRequired,
		requiredArrayOf: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
	};

	render() {
		return (
			<div />
		);
	}
}
