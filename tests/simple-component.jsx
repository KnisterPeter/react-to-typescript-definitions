import * as React from 'react';

export default class SimpleComponent extends React.Component {

	static propTypes = {
		optionalArray: React.PropTypes.array,
		optionalBool: React.PropTypes.bool,
		optionalFunc: React.PropTypes.func,
		optionalNumber: React.PropTypes.number,
		optionalObject: React.PropTypes.object,
		optionalString: React.PropTypes.string,
		optionalNode: React.PropTypes.node,
		optionalElement: React.PropTypes.element,
	};

	render() {
		return (
			<div />
		);
	}
}
