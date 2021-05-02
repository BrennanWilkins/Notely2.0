import React, { useMemo } from 'react';
import './NoteList.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NoteListHeader from '../NoteListHeader/NoteListHeader';
import NoteListNote from '../NoteListNote/NoteListNote';
import NoNotes from './NoNotes';

const NoteList = ({ noteIDs, listShown, isFS }) => {
  const notes = useMemo(() => {
    return noteIDs.map(noteID => <NoteListNote key={noteID} noteID={noteID} />);
  }, [noteIDs]);

  return (
    <div className={`
      NoteList
      ${!listShown ? 'NoteList--hideSmall' : ''}
      ${isFS ? 'NoteList--hide' : ''}
    `}>
      <NoteListHeader />
      <div className="NoteList__notes">
        {notes.length ? notes : <NoNotes />}
      </div>
    </div>
  );
};

NoteList.propTypes = {
  noteIDs: PropTypes.array.isRequired,
  listShown: PropTypes.bool.isRequired,
  isFS: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  listShown: state.ui.listShown,
  isFS: state.ui.isFullscreen,
  noteIDs: state.notes.filteredNoteIDs
});

export default connect(mapStateToProps)(NoteList);
