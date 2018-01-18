import React from 'react';
import PropTypes from 'prop-types';

const Component = ({ className, text }) => React.createElement(
  'div',
  { className: className },
  text
);

Component.displayName = 'Component';

Component.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string
};

export { Component as default };
