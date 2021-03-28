import React from 'react';
import './NoteList.css';
import PropTypes from 'prop-types';
import { plusIcon, sortIcon, pinIcon } from '../UI/icons';
import Tooltip from '../UI/Tooltip/Tooltip';
import { connect } from 'react-redux';
import { createNote, showNote, pinNote, unpinNote } from '../../store/actions';
import { Node } from 'slate';

const serialize = nodes => {
  let title = (nodes && nodes.length) ? Node.string(nodes[0]) || 'New Note' : 'New Note';
  let txt = (nodes && nodes.length > 1) ? nodes.slice(1).map(n => Node.string(n)).join('\n') : '';

  return (
    <>
      <div>{title}</div>
      {txt}
    </>
  );
};

const NoteList = props => {
  const pinHandler = (isPinned, noteID) => {
    isPinned ? props.unpinNote(noteID) : props.pinNote(noteID);
  };

  return (
    <div className={`NoteList ${props.listShown ? 'NoteList--show' : 'NoteList--hide'}`}>
      <div className="NoteList__header">
        <div className="NoteList__title">
          <button className="NoteList__sortBtn">
            {sortIcon}
            <Tooltip position="down">Sort Notes</Tooltip>
          </button>
          {props.trashShown ? 'Trash' : 'All Notes'}
          <button className="NoteList__addBtn" disabled={props.trashShown} onClick={props.createNote}>
            {plusIcon}
            <Tooltip position="down">New Note<div>Ctrl+Shift+N</div></Tooltip>
          </button>
        </div>
      </div>
      <div className="NoteList__notes">
        {props.shownNotes.allIDs.length ?
          props.shownNotes.allIDs.slice().sort((a,b) => (
            props.pinnedNotes.indexOf(b) - props.pinnedNotes.indexOf(a)
          )).map(noteID => {
            const note = props.shownNotes.byID[noteID];
            const isPinned = props.trashShown ? false : props.pinnedNotes.includes(noteID);
            return (
              <div
                key={noteID}
                className={`NoteList__note ${props.currentNoteID === noteID ? 'NoteList__note--active' : ''}`}
                onClick={() => props.showNote(noteID)}
              >
                {!props.trashShown &&
                  <span
                    className={`NoteList__pin ${isPinned ? 'NoteList__pin--hl' : ''}`}
                    onClick={() => pinHandler(isPinned, noteID)}
                  >
                    {pinIcon}
                  </span>
                }
                {serialize(note.body)}
              </div>
            );
          })
          :
          <div className="NoteList__noNotes">
            {props.trashShown ? 'Your trash is empty.' : 'No notes'}
            {!props.trashShown && <div onClick={props.createNote}>Create a new note</div>}
          </div>
        }
      </div>
    </div>
  );
};

NoteList.propTypes = {
  shownNotes: PropTypes.shape({
    allIDs: PropTypes.array.isRequired,
    byID: PropTypes.object.isRequired
  }).isRequired,
  currentNoteID: PropTypes.string,
  trashShown: PropTypes.bool.isRequired,
  showNote: PropTypes.func.isRequired,
  createNote: PropTypes.func.isRequired,
  listShown: PropTypes.bool.isRequired,
  pinnedNotes: PropTypes.array.isRequired,
  pinNote: PropTypes.func.isRequired,
  unpinNote: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  shownNotes: state.notes.trashShown ? state.notes.trash : state.notes.notes,
  currentNoteID: state.notes.currentNoteID,
  trashShown: state.notes.trashShown,
  listShown: state.ui.listShown,
  pinnedNotes: state.notes.pinnedNotes
});

const mapDispatchToProps = dispatch => ({
  createNote: () => dispatch(createNote()),
  showNote: noteID => dispatch(showNote(noteID)),
  pinNote: noteID => dispatch(pinNote(noteID)),
  unpinNote: noteID => dispatch(unpinNote(noteID))
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteList);
