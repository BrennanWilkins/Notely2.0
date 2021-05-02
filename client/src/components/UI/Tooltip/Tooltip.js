import React from 'react';
import './Tooltip.css';
import PropTypes from 'prop-types';

const Tooltip = ({ position, children }) => (
  <div className={`Tooltip Tooltip--${position}`}>
    {children}
  </div>
);

Tooltip.propTypes = {
  position: PropTypes.oneOf(['down', 'right']).isRequired,
  children: PropTypes.any.isRequired
};

export default Tooltip;
