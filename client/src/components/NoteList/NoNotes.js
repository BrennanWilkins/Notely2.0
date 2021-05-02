import React from 'react';
import './NoteList.css';
import PropTypes from 'prop-types';
import { tagIcon, trashIcon, searchIcon } from '../UI/icons';
import { connect } from 'react-redux';
import { createNote } from '../../store/actions';

const NoNotes = ({ searchQuery, shownTag, trashShown, createNote }) => (
  <div className="NoteList__noNotes">
    {
      (!!searchQuery && shownTag) ?
        <>
          {searchIcon}
          <div className="NoteList__noNotesText">
            No search results found for
            <div>{searchQuery}</div>
            for notes tagged
            <div>{shownTag}</div>
          </div>
        </>
      : !!searchQuery ?
        <>
          {searchIcon}
          <div className="NoteList__noNotesText">
            No search results found for
            <div>{searchQuery}</div>
          </div>
        </>
      : shownTag ?
        <>
          {tagIcon}
          <div className="NoteList__noNotesText">
            No notes tagged
            <div>{shownTag}</div>
          </div>
        </>
      : trashShown ?
        <>
          {trashIcon}
          Your trash is empty.
        </>
      :
        <>
          No notes
          <div className="NoteList__noNotesBtn" onClick={createNote}>
            Create a new note
          </div>
        </>
    }
  </div>
);

NoNotes.propTypes = {
  searchQuery: PropTypes.string,
  shownTag: PropTypes.string,
  trashShown: PropTypes.bool.isRequired,
  createNote: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  shownTag: state.notes.shownTag,
  searchQuery: state.notes.searchQuery,
  trashShown: state.notes.trashShown
});

const mapDispatchToProps = dispatch => ({
  createNote: () => dispatch(createNote())
});

export default connect(mapStateToProps, mapDispatchToProps)(NoNotes);
