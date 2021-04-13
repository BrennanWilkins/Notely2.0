import React, { useMemo } from 'react';
import './NoteList.css';
import PropTypes from 'prop-types';
import { pinIcon, tagIcon, trashIcon, searchIcon } from '../UI/icons';
import { connect } from 'react-redux';
import { createNote, showNote, pinNote, unpinNote } from '../../store/actions';
import NoteListHeader from '../NoteListHeader/NoteListHeader';
import { serializeBody } from '../../utils/slateHelpers';
import Highlighter from 'react-highlight-words';

const formatAndSort = (notes, pinnedNotes, notesByID, trashShown, sortType, searchQuery) => {
  let formatted = notes.map(noteID => ({
    noteID,
    isPinned: trashShown ? false : pinnedNotes.includes(noteID),
    ...serializeBody(notesByID[noteID].body, searchQuery)
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

  if (searchQuery) {
    formatted = formatted.filter(note => note.matchesSearch);
  }

  return formatted;
};

const NoteList = props => {
  const pinHandler = (isPinned, noteID) => {
    isPinned ? props.unpinNote(noteID) : props.pinNote(noteID);
  };

  const formattedNotes = useMemo(() => {
    return formatAndSort(props.noteIDs, props.pinnedNotes, props.notesByID, props.trashShown, props.sortType, props.searchQuery);
  }, [props.noteIDs, props.pinnedNotes, props.notesByID, props.trashShown, props.sortType, props.searchQuery]);

  return (
    <div className={`NoteList ${props.listShown ? 'NoteList--show' : 'NoteList--hide'}`}>
      <NoteListHeader
        createNote={props.createNote}
        trashShown={props.trashShown}
        noteCount={formattedNotes.length}
        shownTag={props.shownTag}
      />
      {(!!props.searchQuery.length && !!formattedNotes.length) &&
        <div className="NoteList__searchHeader">
          {searchIcon} Search results for <div>{props.searchQuery}</div>
        </div>
      }
      <div className="NoteList__notes">
        {formattedNotes.length ?
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
              {(props.searchQuery && note.title)  ?
                <>
                  <Highlighter
                    className="NoteList__noteTitle"
                    highlightClassName="NoteList__note--hl"
                    searchWords={[props.searchQuery]}
                    textToHighlight={note.title}
                  />
                  {!!note.txt &&
                    <Highlighter
                      className="NoteList__noteSubTitle"
                      highlightClassName="NoteList__note--hl"
                      searchWords={[props.searchQuery]}
                      textToHighlight={note.txt}
                    />
                  }
                </>
                :
                <>
                  <div className="NoteList__noteTitle">{note.title || 'New Note'}</div>
                  <div className="NoteList__noteSubTitle">{note.txt}</div>
                </>
              }
            </div>
          ))
          :
          <div className="NoteList__noNotes">
            {
              (!!props.searchQuery && props.shownTag) ?
                <>
                  {searchIcon}
                  <div className="NoteList__noNotesText">
                    No search results found for
                    <div>{props.searchQuery}</div>
                    for notes tagged
                    <div>{props.shownTag}</div>
                  </div>
                </>
              : !!props.searchQuery ?
                <>
                  {searchIcon}
                  <div className="NoteList__noNotesText">
                    No search results found for
                    <div>{props.searchQuery}</div>
                  </div>
                </>
              : props.shownTag ?
                <>
                  {tagIcon}
                  <div className="NoteList__noNotesText">
                    No notes tagged
                    <div>{props.shownTag}</div>
                  </div>
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
  shownTag: PropTypes.string,
  searchQuery: PropTypes.string
};

const mapStateToProps = state => ({
  noteIDs: state.notes.shownTag ?
    state.notes.filteredNoteIDs :
    state.notes.trashShown ? state.notes.trashIDs :
    state.notes.noteIDs,
  searchQuery: state.notes.searchQuery,
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
