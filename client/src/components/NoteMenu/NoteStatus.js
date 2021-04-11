import React from 'react';
import PropTypes from 'prop-types';
import './NoteMenu.css';
import { connect } from 'react-redux';
import { formatDate } from '../../utils/formatDate';
import { arrowRepeatIcon, checkIcon } from '../UI/icons';

const NoteStatus = props => (
  <div className="NoteMenu__info">
    <div className="NoteMenu__date">Last updated {formatDate(props.updatedAt)}</div>
    <div className={`NoteMenu__status ${!props.changesSaved ? 'NoteMenu__status--anim' : ''}`}>
      {
        props.changesSaved ?
        <>{checkIcon}All changes saved</> :
        <>{arrowRepeatIcon}Saving changes</>
      }
    </div>
  </div>
);

NoteStatus.propTypes = {
  updatedAt: PropTypes.string.isRequired,
  changesSaved: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  updatedAt: state.notes.notesByID[state.notes.currentNoteID].updatedAt,
  changesSaved: state.notes.changesSaved
});

export default connect(mapStateToProps)(React.memo(NoteStatus));
