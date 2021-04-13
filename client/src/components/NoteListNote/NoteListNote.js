import React from 'react';
import './NoteListNote.css';
import PropTypes from 'prop-types';
import Highlighter from 'react-highlight-words';
import { connect } from 'react-redux';
import { showNote, pinNote, unpinNote } from '../../store/actions';
import { pinIcon } from '../UI/icons';

const NoteListNote = props => {
  const pinHandler = (isPinned, noteID) => {
    isPinned ? props.unpinNote(noteID) : props.pinNote(noteID);
  };

  return (
    <div
      className={`NoteListNote ${props.isCurrent ? 'NoteListNote--active' : ''}`}
      onClick={() => props.showNote(props.noteID)}
    >
      {!props.trashShown &&
        <span
          className={`NoteListNote__pin ${props.isPinned ? 'NoteListNote__pin--hl' : ''}`}
          onClick={() => pinHandler(props.isPinned, props.noteID)}
        >
          {pinIcon}
        </span>
      }
      {(props.searchQuery && props.title) ?
        <>
          <Highlighter
            className="NoteListNote__title"
            highlightClassName="NoteListNote__txt--hl"
            searchWords={[props.searchQuery]}
            textToHighlight={props.title}
          />
          {!!props.txt &&
            <Highlighter
              className="NoteListNote__txt"
              highlightClassName="NoteListNote__txt--hl"
              searchWords={[props.searchQuery]}
              textToHighlight={props.txt}
            />
          }
        </>
        :
        <>
          <div className="NoteListNote__title">
            {props.title || 'New Note'}
          </div>
          <div className="NoteListNote__txt">
            {props.txt}
          </div>
        </>
      }
    </div>
  );
};

NoteListNote.propTypes = {
  searchQuery: PropTypes.string,
  pinNote: PropTypes.func.isRequired,
  unpinNote: PropTypes.func.isRequired,
  showNote: PropTypes.func.isRequired,
  isCurrent: PropTypes.bool.isRequired,
  noteID: PropTypes.string.isRequired,
  isPinned: PropTypes.bool.isRequired,
  txt: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  trashShown: PropTypes.bool.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  searchQuery: state.notes.searchQuery,
  isCurrent: state.notes.currentNoteID === ownProps.noteID,
  trashShown: state.notes.trashShown
});

const mapDispatchToProps = dispatch => ({
  showNote: noteID => dispatch(showNote(noteID)),
  pinNote: noteID => dispatch(pinNote(noteID)),
  unpinNote: noteID => dispatch(unpinNote(noteID))
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteListNote);
