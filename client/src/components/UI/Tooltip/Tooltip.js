import React from 'react';
import './Tooltip.css';
import PropTypes from 'prop-types';

const Tooltip = props => (
  <div className={`Tooltip Tooltip--${props.position}`}>
    {props.children}
  </div>
);

Tooltip.propTypes = {
  position: PropTypes.oneOf(['up', 'down', 'right', 'left']).isRequired
};

export default Tooltip;
