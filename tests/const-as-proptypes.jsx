import React from 'react';
import PropTypes from 'prop-types';

const buttonPropTypes = {
  buttonSize: PropTypes.oneOf(['sm', 'md', 'lg'])
};

export default function Button({ buttonSize }) {
  return (
    <button>Test {buttonSize}</button>
  );
}

Button.propTypes = buttonPropTypes;
