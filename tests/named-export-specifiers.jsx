import * as React from 'react';

const Component = ({optionalAny}) => <div />;
Component.propTypes = {
	optionalAny: React.PropTypes.any,
};

const Component2 = () => <div />;

export { Component, Component2 };
