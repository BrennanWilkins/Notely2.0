import React from 'react';
import './AuthPages.css';
import PropTypes from 'prop-types';
import { logo } from '../UI/icons';

const AuthContainer = ({ title, children, dark, noLogo }) => (
  <div className={`Auth__container ${dark ? 'Auth__container--dark' : ''}`}>
    <div className="Auth__content">
      {!noLogo && <div className="Auth__logo">{logo}</div>}
      {!!title && <h1>{title}</h1>}
      {children}
    </div>
  </div>
);


AuthContainer.propTypes = {
  title: PropTypes.string,
  children: PropTypes.array.isRequired,
  dark: PropTypes.bool,
  noLogo: PropTypes.bool
};

export default AuthContainer;
