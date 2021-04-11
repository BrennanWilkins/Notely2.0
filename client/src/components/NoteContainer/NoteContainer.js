import React from 'react';
import './NoteContainer.css';
import PropTypes from 'prop-types';
import NoteContent from '../NoteContent/NoteContent';
import NoteMenu from '../NoteMenu/NoteMenu';
import NoteTags from '../NoteTags/NoteTags';
import { connect } from 'react-redux';

const NoteContainer = props => (
  <div
    className={`
      NoteContainer
      ${props.isFullscreen ? 'NoteContainer--expanded' : 'NoteContainer--contract'}
      ${props.listShown ? 'NoteContainer--hide' : 'NoteContainer--show'}
    `}
    style={
      !props.isFullscreen ?
      { maxWidth: props.sideNavShown ? 'calc(100% - 541px)' : 'calc(100% - 376px)'}
      : null
    }
  >
    <NoteMenu />
    <NoteContent />
    <NoteTags />
  </div>
);

NoteContainer.propTypes = {
  isFullscreen: PropTypes.bool.isRequired,
  sideNavShown: PropTypes.bool.isRequired,
  listShown: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isFullscreen: state.ui.isFullscreen,
  sideNavShown: state.ui.sideNavShown,
  listShown: state.ui.listShown
});

export default connect(mapStateToProps)(NoteContainer);
