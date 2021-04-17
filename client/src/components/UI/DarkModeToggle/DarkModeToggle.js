import React from 'react';
import './DarkModeToggle.css';
import PropTypes from 'prop-types';
import { sunIcon, moonIcon } from '../icons';
import { connect } from 'react-redux';
import { toggleDarkMode } from '../../../store/actions';

const DarkModeToggle = props => {
  return (
    <div className={`DarkModeToggle ${props.darkMode ? 'DarkModeToggle--dark' : 'DarkModeToggle--light'}`}>
      <div className="DarkModeToggle__sun">{sunIcon}</div>
      <div className="DarkModeToggle__moon">{moonIcon}</div>
      <div className="DarkModeToggle__btn" onClick={props.toggleDarkMode} />
    </div>
  );
};

DarkModeToggle.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  darkMode: state.ui.darkMode
});

const mapDispatchToProps = dispatch => ({
  toggleDarkMode: () => dispatch(toggleDarkMode())
});

export default connect(mapStateToProps, mapDispatchToProps)(DarkModeToggle);
