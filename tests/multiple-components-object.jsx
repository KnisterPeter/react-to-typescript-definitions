import * as React from "react";

const Component = ({ optionalAny }) => <div />;
Component.propTypes = {
  optionalAny: React.PropTypes.any,
};

const Component2 = () => <div />;

Component2.propTypes = {
  optionalString: React.PropTypes.string,
};

export const Composed = {
  Component,
  Component2,
};
