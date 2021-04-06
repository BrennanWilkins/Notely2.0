import React, { useMemo } from 'react';
import './NoteList.css';
import PropTypes from 'prop-types';
import { pinIcon, tagIcon, trashIcon } from '../UI/icons';
import { connect } from 'react-redux';
import { createNote, showNote, pinNote, unpinNote } from '../../store/actions';
import { Node } from 'slate';
import NoteListHeader from '../NoteListHeader/NoteListHeader';

const serialize = nodes => {
  let txt, title;
  if (!nodes || !nodes.length) {
    txt = '';
    title = 'New Note';
  } else {
    let arr = nodes.map(n => Node.string(n)).filter(n => n !== '');
    title = arr[0] || 'New Note';
    txt = arr.slice(1) || '';
  }

  let body = (
    <>
      <div>{title}</div>
      {txt}
    </>
  );
  return { title, body };
};

const formatAndSort = (notes, pinnedNotes, notesByID, trashShown, sortType) => {
  return notes.map(noteID => ({
    noteID,
    isPinned: trashShown ? false : pinnedNotes.includes(noteID),
    ...serialize(notesByID[noteID].body)
  })).sort((a,b) => {
    if (a.isPinned && b.isPinned) {
      return pinnedNotes.indexOf(b) - pinnedNotes.indexOf(a);
    }
    if (b.isPinned && !a.isPinned) { return 1; }
    if (a.isPinned && !b.isPinned) { return -1; }

    switch (sortType) {
      case 'Created Newest': return new Date(a.createdAt) - new Date(b.createdAt);
      case 'Created Oldest': return new Date(b.createdAt) - new Date(a.createdAt);
      case 'Modified Newest': return new Date(a.updatedAt) - new Date(b.updatedAt);
      case 'Modified Oldest': return new Date(b.updatedAt) - new Date(a.updatedAt);
      case 'AtoZ': return a.title.localeCompare(b.title);
      case 'ZtoA': return b.title.localeCompare(a.title);
      default: return 0;
    }
  });
};

const NoteList = props => {
  const pinHandler = (isPinned, noteID) => {
    isPinned ? props.unpinNote(noteID) : props.pinNote(noteID);
  };

  const formattedNotes = useMemo(() => {
    return formatAndSort(props.noteIDs, props.pinnedNotes, props.notesByID, props.trashShown, props.sortType);
  }, [props.noteIDs, props.pinnedNotes, props.notesByID, props.trashShown, props.sortType])

  return (
    <div className={`NoteList ${props.listShown ? 'NoteList--show' : 'NoteList--hide'}`}>
      <NoteListHeader
        createNote={props.createNote}
        trashShown={props.trashShown}
        noteCount={props.noteIDs.length}
        shownTag={props.shownTag}
      />
      <div className="NoteList__notes">
        {props.noteIDs.length ?
          formattedNotes.map(note => (
            <div
              key={note.noteID}
              className={`NoteList__note ${props.currentNoteID === note.noteID ? 'NoteList__note--active' : ''}`}
              onClick={() => props.showNote(note.noteID)}
            >
              {!props.trashShown &&
                <span
                  className={`NoteList__pin ${note.isPinned ? 'NoteList__pin--hl' : ''}`}
                  onClick={() => pinHandler(note.isPinned, note.noteID)}
                >
                  {pinIcon}
                </span>
              }
              {note.body}
            </div>
          ))
          :
          <div className="NoteList__noNotes">
            {
              props.shownTag ?
                <>
                  {tagIcon}
                  No notes tagged
                  <div className="NoteList__noNotesTag">{props.shownTag}</div>
                </>
              : props.trashShown ?
                <>
                  {trashIcon}
                  Your trash is empty.
                </>
              :
                <>
                  No notes
                  <div className="NoteList__noNotesBtn" onClick={props.createNote}>
                    Create a new note
                  </div>
                </>
            }
          </div>
        }
      </div>
    </div>
  );
};

NoteList.propTypes = {
  noteIDs: PropTypes.array.isRequired,
  notesByID: PropTypes.object.isRequired,
  currentNoteID: PropTypes.string,
  trashShown: PropTypes.bool.isRequired,
  showNote: PropTypes.func.isRequired,
  createNote: PropTypes.func.isRequired,
  listShown: PropTypes.bool.isRequired,
  pinnedNotes: PropTypes.array.isRequired,
  pinNote: PropTypes.func.isRequired,
  unpinNote: PropTypes.func.isRequired,
  sortType: PropTypes.string.isRequired,
  shownTag: PropTypes.string
};

const mapStateToProps = state => ({
  noteIDs: state.notes.shownTag ?
    state.notes.filteredNoteIDs :
    state.notes.trashShown ? state.notes.trashIDs :
    state.notes.noteIDs,
  notesByID: state.notes.notesByID,
  currentNoteID: state.notes.currentNoteID,
  trashShown: state.notes.trashShown,
  listShown: state.ui.listShown,
  pinnedNotes: state.notes.pinnedNotes,
  sortType: state.ui.sortType,
  shownTag: state.notes.shownTag
});

const mapDispatchToProps = dispatch => ({
  createNote: () => dispatch(createNote()),
  showNote: noteID => dispatch(showNote(noteID)),
  pinNote: noteID => dispatch(pinNote(noteID)),
  unpinNote: noteID => dispatch(unpinNote(noteID))
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteList);
