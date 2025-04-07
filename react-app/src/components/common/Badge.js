import React from 'react';
import PropTypes from 'prop-types';

const Badge = ({ text, className }) => {
  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${className}`}
    >
      {text}
    </span>
  );
};

Badge.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Badge.defaultProps = {
  className: 'bg-gray-200 text-gray-800',
};

export default Badge;