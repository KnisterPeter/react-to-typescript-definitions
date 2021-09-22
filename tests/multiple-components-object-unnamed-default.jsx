import * as React from 'react';

const Component = ({ optionalAny }) => <div />;
Component.propTypes = {
  optionalAny: React.PropTypes.any,
};

export const Component2 = () => <div />;

Component2.propTypes = {
  optionalString: React.PropTypes.string,
};

export default {
  Component,
  Asdf: Component2,
};
