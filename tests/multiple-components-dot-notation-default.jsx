import * as React from 'react';

const Component = ({ optionalAny }) => <div />;
Component.propTypes = {
  optionalAny: React.PropTypes.any,
};

const Component2 = () => <div />;

const Component3 = () => <div />;

Component2.propTypes = {
  optionalString: React.PropTypes.string,
};

Component.OtherComponent = Component2
Component.AnotherComponent = Component3

export default Component;
