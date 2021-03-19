import React from 'react';
import classes from './Spinner.module.css';
import { logo, spinCircle } from '../icons';

const Spinner = () => (
  <div className={classes.Spinner}>
    <div className={classes.Logo}>{logo}</div>
    <div className={classes.Circle}>{spinCircle}</div>
  </div>
);

export default Spinner;
