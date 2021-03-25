import React, { useEffect } from 'react';
import './NotelyContainer.css';
import PropTypes from 'prop-types';
import SideNav from '../SideNav/SideNav';
import NoteList from '../NoteList/NoteList';
import NoteContainer from '../NoteContainer/NoteContainer';
import { toggleSideNav, toggleFullscreen } from '../../store/actions';
import { connect } from 'react-redux';
import isHotkey from 'is-hotkey';

const NotelyContainer = props => {
  useEffect(() => {
    const shortcutHandler = e => {
      // ctrl + shift + m opens side nav
      if (isHotkey('ctrl+shift+m', e)) {
        e.preventDefault();
        props.toggleSideNav();
      }
      // ctrl + shift + f toggles fullscreen
      if (isHotkey('ctrl+shift+f', e)) {
        e.preventDefault();
        props.toggleFullscreen();
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
    </div>
  );
};

NotelyContainer.propTypes = {
  toggleSideNav: PropTypes.func.isRequired,
  toggleFullscreen: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  toggleSideNav: () => dispatch(toggleSideNav()),
  toggleFullscreen: () => dispatch(toggleFullscreen())
});

export default connect(null, mapDispatchToProps)(NotelyContainer);
