import React from 'react';
import './NoteContainer.css';
import PropTypes from 'prop-types';
import NoteContent from '../NoteContent/NoteContent';
import NoteMenu from '../NoteMenu/NoteMenu';
import { connect } from 'react-redux';

const NoteContainer = props => (
  <div
    className={props.isFullscreen ? 'NoteContainer--expanded' : 'NoteContainer--contract'}
    style={{ maxWidth: props.sideNavShown ? 'calc(100% - 571px)' : 'calc(100% - 396px)'}}
  >
    <NoteMenu />
    <NoteContent />
  </div>
);

NoteContainer.propTypes = {
  isFullscreen: PropTypes.bool.isRequired,
  sideNavShown: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isFullscreen: state.ui.isFullscreen,
  sideNavShown: state.ui.sideNavShown
});

export default connect(mapStateToProps)(NoteContainer);
