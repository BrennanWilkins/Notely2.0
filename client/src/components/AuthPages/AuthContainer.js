import React from 'react';
import './AuthPages.css';
import PropTypes from 'prop-types';
import { logo } from '../UI/icons';

const AuthContainer = props => (
  <div className="AuthContainer">
    <div className="AuthContainer__logo">{logo}</div>
    <h1>{props.title}</h1>
    {props.children}
  </div>
);

AuthContainer.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired
};

export default AuthContainer;
