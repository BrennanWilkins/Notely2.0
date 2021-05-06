import React from 'react';
import './NoteContainer.css';
import PropTypes from 'prop-types';
import NoteContent from '../NoteContent/NoteContent';
import NoteMenu from '../NoteMenu/NoteMenu';
import NoteTags from '../NoteTags/NoteTags';
import { connect } from 'react-redux';

const NoteContainer = ({ isFS, listShown }) => (
  <div
    className={`
      NoteContainer
      ${isFS ? 'NoteContainer--fs' : ''}
      ${listShown ? 'NoteContainer--hide' : ''}
    `}
  >
    <NoteMenu />
    <NoteContent />
    <NoteTags />
  </div>
);

NoteContainer.propTypes = {
  isFS: PropTypes.bool.isRequired,
  listShown: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isFS: state.ui.isFullscreen,
  listShown: state.ui.listShown
});

export default connect(mapStateToProps)(NoteContainer);
