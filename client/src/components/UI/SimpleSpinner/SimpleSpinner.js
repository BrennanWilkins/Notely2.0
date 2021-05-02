import React from 'react';
import './SimpleSpinner.css';

const SimpleSpinner = ({ className }) => (
  <div className={`SimpleSpinner ${className || ''}`} />
);

export default SimpleSpinner;
