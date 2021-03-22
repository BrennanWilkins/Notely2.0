import React from 'react';
import './Tooltip.css';
import PropTypes from 'prop-types';

const Tooltip = props => (
  <div className={`Tooltip Tooltip--${props.position} ${props.className || ''}`}>
    {props.children}
  </div>
);

Tooltip.propTypes = {
  position: PropTypes.oneOf(['up', 'down', 'right', 'left']).isRequired,
  className: PropTypes.string
};

export default Tooltip;
