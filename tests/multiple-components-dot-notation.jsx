import * as React from 'react';

const Component = ({ optionalAny }) => <div />;
Component.propTypes = {
  optionalAny: React.PropTypes.any,
};

const ComponentX = () => <div />;

ComponentX.propTypes = {
  optionalString: React.PropTypes.string,
};

Component.OtherComponent = ComponentX

export default Component;
