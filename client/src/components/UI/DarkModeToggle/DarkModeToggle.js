import React from 'react';
import './DarkModeToggle.css';
import PropTypes from 'prop-types';
import { sunIcon, moonIcon } from '../icons';
import { connect } from 'react-redux';
import { toggleDarkMode } from '../../../store/actions';

const DarkModeToggle = props => (
  <div className="DarkModeToggle" onClick={props.toggleDarkMode}>
    <div className="DarkModeToggle__sun">{sunIcon}</div>
    <div className="DarkModeToggle__moon">{moonIcon}</div>
    <div className="DarkModeToggle__btn" />
  </div>
);

DarkModeToggle.propTypes = {
  toggleDarkMode: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  toggleDarkMode: () => dispatch(toggleDarkMode())
});

export default connect(null, mapDispatchToProps)(DarkModeToggle);
