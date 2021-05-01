import React, { useMemo } from 'react';
import './NoteList.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectCurrNoteIDs } from '../../store/selectors';
import NoteListHeader from '../NoteListHeader/NoteListHeader';
import { serializeBody } from '../../utils/slateHelpers';
import NoteListNote from '../NoteListNote/NoteListNote';
import NoNotes from './NoNotes';

const formatAndSort = (noteIDs, pinnedNotes, notesByID, trashShown, sortType, searchQuery) => {
  let notes = noteIDs.map(noteID => {
    const { updatedAt, createdAt, body } = notesByID[noteID];

    return {
      noteID,
      updatedAt,
      createdAt,
      isPinned: trashShown ? false : pinnedNotes.includes(noteID),
      ...serializeBody(body)
    };
  });

  if (searchQuery) {
    notes = notes.filter(note => note.text.includes(searchQuery));
  }

  notes.sort((a,b) => {
    if (a.isPinned && b.isPinned) {
      return pinnedNotes.indexOf(b) - pinnedNotes.indexOf(a);
    }
    if (b.isPinned && !a.isPinned) { return 1; }
    if (a.isPinned && !b.isPinned) { return -1; }

    switch (sortType) {
      case 'Created Newest': return new Date(b.createdAt) - new Date(a.createdAt);
      case 'Created Oldest': return new Date(a.createdAt) - new Date(b.createdAt);
      case 'Modified Newest': return new Date(b.updatedAt) - new Date(a.updatedAt);
      case 'Modified Oldest': return new Date(a.updatedAt) - new Date(b.updatedAt);
      case 'AtoZ': return a.text.localeCompare(b.text);
      case 'ZtoA': return b.text.localeCompare(a.text);
      default: return 0;
    }
  });

  return notes.map(({ text, ...note }) => <NoteListNote key={note.noteID} {...note} />);
};

const NoteList = ({ noteIDs, pinnedNotes, notesByID, trashShown, sortType, searchQuery, listShown, isFS }) => {
  const formattedNotes = useMemo(() => {
    return formatAndSort(noteIDs, pinnedNotes, notesByID, trashShown, sortType, searchQuery);
  }, [noteIDs, pinnedNotes, notesByID, trashShown, sortType, searchQuery]);

  return (
    <div className={`
      NoteList
      ${!listShown ? 'NoteList--hideSmall' : ''}
      ${isFS ? 'NoteList--hide' : ''}
    `}>
      <NoteListHeader
        trashShown={trashShown}
        noteCount={formattedNotes.length}
        searchQuery={searchQuery}
      />
      <div className="NoteList__notes">
        {formattedNotes.length ?
          formattedNotes
          :
          <NoNotes
            searchQuery={searchQuery}
            trashShown={trashShown}
          />
        }
      </div>
    </div>
  );
};

NoteList.propTypes = {
  noteIDs: PropTypes.array.isRequired,
  notesByID: PropTypes.object.isRequired,
  trashShown: PropTypes.bool.isRequired,
  listShown: PropTypes.bool.isRequired,
  pinnedNotes: PropTypes.array.isRequired,
  sortType: PropTypes.string.isRequired,
  searchQuery: PropTypes.string,
  isFS: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  noteIDs: selectCurrNoteIDs(state),
  searchQuery: state.notes.searchQuery,
  notesByID: state.notes.notesByID,
  trashShown: state.notes.trashShown,
  listShown: state.ui.listShown,
  pinnedNotes: state.notes.pinnedNotes,
  sortType: state.ui.sortType,
  isFS: state.ui.isFullscreen
});

export default connect(mapStateToProps)(NoteList);
