import React from 'react';
import './NoteContainer.css';
import PropTypes from 'prop-types';
import NoteContent from '../NoteContent/NoteContent';
import NoteMenu from '../NoteMenu/NoteMenu';
import { connect } from 'react-redux';

const NoteContainer = props => {
  return (
    <div className={props.isFullscreen ? 'NoteContainer--expanded' : 'NoteContainer--contract'}>
      <NoteMenu />
      <NoteContent />
    </div>
  );
};

NoteContainer.propTypes = {
  isFullscreen: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isFullscreen: state.ui.isFullscreen
});

export default connect(mapStateToProps)(NoteContainer);
