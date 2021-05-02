import React from 'react';
import './NoteContainer.css';
import PropTypes from 'prop-types';
import NoteContent from '../NoteContent/NoteContent';
import NoteMenu from '../NoteMenu/NoteMenu';
import NoteTags from '../NoteTags/NoteTags';
import { connect } from 'react-redux';

const NoteContainer = ({ isFS, listShown, sideNavShown }) => (
  <div
    className={`
      NoteContainer
      ${isFS ? 'NoteContainer--expanded' : 'NoteContainer--contract'}
      ${listShown ? 'NoteContainer--hide' : ''}
    `}
    style={
      !isFS ?
      { maxWidth: sideNavShown ? 'calc(100% - 541px)' : 'calc(100% - 376px)'}
      : null
    }
  >
    <NoteMenu />
    <NoteContent />
    <NoteTags />
  </div>
);

NoteContainer.propTypes = {
  isFS: PropTypes.bool.isRequired,
  sideNavShown: PropTypes.bool.isRequired,
  listShown: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isFS: state.ui.isFullscreen,
  sideNavShown: state.ui.sideNavShown,
  listShown: state.ui.listShown
});

export default connect(mapStateToProps)(NoteContainer);
