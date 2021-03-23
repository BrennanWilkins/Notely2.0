import React, { useEffect } from 'react';
import './NotelyContainer.css';
import PropTypes from 'prop-types';
import SideNav from '../SideNav/SideNav';
import NoteList from '../NoteList/NoteList';
import NoteContainer from '../NoteContainer/NoteContainer';
import { toggleSideNav } from '../../store/actions';
import { connect } from 'react-redux';

const NotelyContainer = props => {
  useEffect(() => {
    const shortcutHandler = e => {
      // ctrl + m opens side nav
      if (e.ctrlKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        props.toggleSideNav();
      }
    };

    window.addEventListener('keyup', shortcutHandler);
    return () => window.removeEventListener('keyup', shortcutHandler);
  }, []);

  return (
    <div className="NotelyContainer">
      <SideNav />
      <NoteList />
      <NoteContainer />
    </div>
  );
};

NotelyContainer.propTypes = {
  toggleSideNav: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  toggleSideNav: () => dispatch(toggleSideNav())
});

export default connect(null, mapDispatchToProps)(NotelyContainer);
