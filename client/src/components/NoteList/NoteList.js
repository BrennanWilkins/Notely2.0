import React from 'react';
import './NoteList.css';
import PropTypes from 'prop-types';
import { plusIcon, sortIcon } from '../UI/icons';
import Tooltip from '../UI/Tooltip/Tooltip';
import { connect } from 'react-redux';
import { createNote, showNote } from '../../store/actions';
import { Node } from 'slate';

const serialize = nodes => {
  let title = Node.string(nodes[0]) || 'New Note';
  let txt = nodes.slice(1).map(n => Node.string(n)).join('\n');

  return (
    <>
      <div>{title}</div>
      {txt}
    </>
  );
};

const NoteList = props => {
  return (
    <div className="NoteList">
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
        {
          props.trashShown ?
            (props.trash.allIDs.length ?
              props.trash.allIDs.map(noteID => {
                const note = props.trash.byID[noteID];
                return (
                  <div
                    key={noteID}
                    className={`NoteList__note ${props.currentNoteID === noteID ? 'NoteList__note--active' : ''}`}
                    onClick={() => props.showNote(noteID)}
                  >
                    {serialize(note.body)}
                  </div>
                );
              })
              :
              <div className="NoteList__noNotes">
                Your trash is empty.
              </div>
            )
          :
            (props.notes.allIDs.length ?
              props.notes.allIDs.map(noteID => {
                const note = props.notes.byID[noteID];
                return (
                  <div
                    key={noteID}
                    className={`NoteList__note ${props.currentNoteID === noteID ? 'NoteList__note--active' : ''}`}
                    onClick={() => props.showNote(noteID)}
                  >
                    {serialize(note.body)}
                  </div>
                );
              })
              :
              <div className="NoteList__noNotes">
                No notes
                <div onClick={props.createNote}>Create a new note</div>
              </div>
            )
        }
      </div>
    </div>
  );
};

NoteList.propTypes = {
  createNote: PropTypes.func.isRequired,
  notes: PropTypes.shape({
    allIDs: PropTypes.array.isRequired,
    byID: PropTypes.object.isRequired
  }).isRequired,
  showNote: PropTypes.func.isRequired,
  currentNoteID: PropTypes.string
};

const mapStateToProps = state => ({
  notes: state.notes.notes,
  currentNoteID: state.notes.currentNote.noteID,
  trashShown: state.notes.trashShown,
  trash: state.notes.trash
});

const mapDispatchToProps = dispatch => ({
  createNote: () => dispatch(createNote()),
  showNote: noteID => dispatch(showNote(noteID))
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteList);
