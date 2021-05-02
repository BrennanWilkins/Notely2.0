import React, { useState } from 'react';
import './NoteListHeader.css';
import PropTypes from 'prop-types';
import { plusIcon, sortIcon, searchIcon, trashIcon } from '../UI/icons';
import Tooltip from '../UI/Tooltip/Tooltip';
import SortModal from '../SortModal/SortModal';
import { connect } from 'react-redux';
import { createNote, emptyTrash } from '../../store/actions';

const NoteListHeader = ({ trashShown, shownTag, noteCount, createNote, searchQuery }) => {
  const [showSortModal, setShowSortModal] = useState(false);

  return (
    <>
      <div className="NoteListHeader">
        <div className="NoteListHeader__title">
          <button
            className="NoteListHeader__sortBtn"
            onClick={e => {
              e.currentTarget.blur();
              setShowSortModal(true);
            }}
          >
            {sortIcon}
            <Tooltip position="down">Sort Notes</Tooltip>
          </button>
          <div className="NoteListHeader__titleText">
            {trashShown ? 'Trash' : shownTag || 'All Notes'}
          </div>
          <button
            className="BlueBtn NoteListHeader__addBtn"
            onClick={createNote}
          >
            {plusIcon}
            <Tooltip position="down">
              New Note
              <div>Alt+Shift+N</div>
            </Tooltip>
          </button>
        </div>
        <div className="NoteListHeader__count">
          {noteCount} {noteCount === 1 ? 'Note' : 'Notes'}
        </div>
        {showSortModal && <SortModal close={() => setShowSortModal(false)} />}
      </div>
      {(!!searchQuery && !!noteCount) &&
        <div className="NoteList__searchHeader">
          {searchIcon} Search results for <div>{searchQuery}</div>
        </div>
      }
      {(!searchQuery && trashShown && !!noteCount) &&
        <div className="NoteList__emptyTrash" onClick={emptyTrash}>
          <div>{trashIcon} Empty Trash</div>
        </div>
      }
    </>
  );
};

NoteListHeader.propTypes = {
  noteCount: PropTypes.number.isRequired,
  trashShown: PropTypes.bool.isRequired,
  createNote: PropTypes.func.isRequired,
  shownTag: PropTypes.string,
  searchQuery: PropTypes.string
};

const mapStateToProps = state => ({
  shownTag: state.notes.shownTag,
  searchQuery: state.notes.searchQuery,
  trashShown: state.notes.trashShown,
  noteCount: state.notes.filteredNoteIDs.length
});

const mapDispatchToProps = dispatch => ({
  createNote: () => dispatch(createNote()),
  emptyTrash: () => dispatch(emptyTrash())
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteListHeader);
