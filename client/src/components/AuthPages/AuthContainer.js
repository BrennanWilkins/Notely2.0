import React from 'react';
import classes from './AuthPages.module.css';
import PropTypes from 'prop-types';
import { logo } from '../UI/icons';

const AuthContainer = props => (
  <div className={classes.AuthContainer}>
    <div className={classes.Logo}>{logo}</div>
    <h1>{props.title}</h1>
    {props.children}
  </div>
);

AuthContainer.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired
};

export default AuthContainer;
