import React, { useEffect } from 'react';
import './NotelyContainer.css';
import PropTypes from 'prop-types';
import SideNav from '../SideNav/SideNav';
import NoteList from '../NoteList/NoteList';
import NoteContainer from '../NoteContainer/NoteContainer';
import Notifications from '../Notifications/Notifications';
import { toggleSideNav, toggleFullscreen, setListShown, createNote } from '../../store/actions';
import { connect } from 'react-redux';
import isHotkey from 'is-hotkey';

const NotelyContainer = ({ toggleSideNav, toggleFS, showList, createNote }) => {
  useEffect(() => {
    const shortcutHandler = e => {
      // alt + shift + m opens side nav
      if (isHotkey('alt+shift+m', e)) {
        e.preventDefault();
        toggleSideNav();
      }
      // alt + shift + f toggles fullscreen
      if (isHotkey('alt+shift+f', e)) {
        e.preventDefault();
        toggleFS();
      }
      // alt + shift + b opens note list on < 750px width screen
      if (window.innerWidth <= 750 && isHotkey('alt+shift+b', e)) {
        e.preventDefault();
        showList();
      }
      // alt + shift + n creates new note
      if (isHotkey('alt+shift+n', e)) {
        e.preventDefault();
        createNote();
      }
    };

    window.addEventListener('keydown', shortcutHandler);
    return () => window.removeEventListener('keydown', shortcutHandler);
  }, []);

  return (
    <div className="NotelyContainer">
      <SideNav />
      <NoteList />
      <NoteContainer />
      <Notifications />
    </div>
  );
};

NotelyContainer.propTypes = {
  toggleSideNav: PropTypes.func.isRequired,
  toggleFS: PropTypes.func.isRequired,
  showList: PropTypes.func.isRequired,
  createNote: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  toggleSideNav: () => dispatch(toggleSideNav()),
  toggleFS: () => dispatch(toggleFullscreen()),
  showList: () => dispatch(setListShown(true)),
  createNote: () => dispatch(createNote())
});

export default connect(null, mapDispatchToProps)(NotelyContainer);
