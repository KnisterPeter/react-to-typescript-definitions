import * as React from 'react';

export default class SimpleComponent extends React.Component {

	static propTypes = {
		number: React.PropTypes.number,
		string: React.PropTypes.string,
		array: React.PropTypes.array,
		bool: React.PropTypes.bool,
		func: React.PropTypes.func,
		object: React.PropTypes.object
	};

	render() {
		return (
			<div />
		);
	}
}
