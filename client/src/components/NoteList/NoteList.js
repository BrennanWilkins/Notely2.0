import React, { useMemo } from 'react';
import './NoteList.css';
import PropTypes from 'prop-types';
import { tagIcon, trashIcon, searchIcon } from '../UI/icons';
import { connect } from 'react-redux';
import { createNote, emptyTrash } from '../../store/actions';
import { selectCurrNoteIDs } from '../../store/selectors';
import NoteListHeader from '../NoteListHeader/NoteListHeader';
import { serializeBody } from '../../utils/slateHelpers';
import NoteListNote from '../NoteListNote/NoteListNote';

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
      {(!props.searchQuery && props.trashShown && !!formattedNotes.length) &&
        <div className="NoteList__emptyTrash" onClick={props.emptyTrash}>
          <div>{trashIcon} Empty Trash</div>
        </div>
      }
      <div className="NoteList__notes">
        {formattedNotes.length ?
          formattedNotes.map(note => <NoteListNote key={note.noteID} {...note} />)
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
  trashShown: PropTypes.bool.isRequired,
  createNote: PropTypes.func.isRequired,
  listShown: PropTypes.bool.isRequired,
  pinnedNotes: PropTypes.array.isRequired,
  sortType: PropTypes.string.isRequired,
  shownTag: PropTypes.string,
  searchQuery: PropTypes.string,
  emptyTrash: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  noteIDs: selectCurrNoteIDs(state),
  searchQuery: state.notes.searchQuery,
  notesByID: state.notes.notesByID,
  trashShown: state.notes.trashShown,
  listShown: state.ui.listShown,
  pinnedNotes: state.notes.pinnedNotes,
  sortType: state.ui.sortType,
  shownTag: state.notes.shownTag
});

const mapDispatchToProps = dispatch => ({
  createNote: () => dispatch(createNote()),
  emptyTrash: () => dispatch(emptyTrash())
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteList);
