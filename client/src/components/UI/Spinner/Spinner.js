import React from 'react';
import './Spinner.css';
import { logo, spinCircle } from '../icons';

const Spinner = () => (
  <div className="Spinner">
    <div className="Spinner__logo">{logo}</div>
    <div className="Spinner__circle">{spinCircle}</div>
  </div>
);

export default Spinner;
