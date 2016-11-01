import {Component, PropTypes} from 'react';
import Message from './path/to/Message';

export default class Component extends Component {

	static propTypes = {
		/**
		 * This is a jsdoc comment for optionalAny.
		 */
		optionalAny: PropTypes.any,
		optionalArray: PropTypes.array,
		optionalBool: PropTypes.bool,
		optionalFunc: PropTypes.func,
		optionalNumber: PropTypes.number,
		optionalObject: PropTypes.object,
		optionalString: PropTypes.string,
		optionalNode: PropTypes.node,
		optionalElement: PropTypes.element,
		optionalMessage: PropTypes.instanceOf(Message),
		//optionalEnum: PropTypes.oneOf(['News', 'Photos']),
		optionalUnion: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		optionalArrayOf: PropTypes.arrayOf(PropTypes.number),
		//optionalObjectOf: PropTypes.objectOf(PropTypes.number),
		//optionalObjectWithShape: PropTypes.shape({
		//	color: PropTypes.string,
		//	fontSize: PropTypes.number
		//}),
		requiredFunc: PropTypes.func.isRequired,
		requiredAny: PropTypes.any.isRequired,
		requiredUnion: PropTypes.oneOfType([
			PropTypes.array,
			PropTypes.bool
		]).isRequired,
		requiredArrayOf: PropTypes.arrayOf(PropTypes.string).isRequired,
	};

	render() {
		return (
			<div />
		);
	}
}
