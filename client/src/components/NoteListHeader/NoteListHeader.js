import React, { useState } from 'react';
import './NoteListHeader.css';
import PropTypes from 'prop-types';
import { plusIcon, sortIcon } from '../UI/icons';
import Tooltip from '../UI/Tooltip/Tooltip';
import SortModal from '../SortModal/SortModal';

const NoteListHeader = props => {
  const [showSortModal, setShowSortModal] = useState(false);

  return (
    <div className="NoteListHeader">
      <div className="NoteListHeader__title">
        <button
          className="NoteListHeader__sortBtn"
          onClick={() => setShowSortModal(true)}
        >
          {sortIcon}
          <Tooltip position="down">Sort Notes</Tooltip>
        </button>
        {props.trashShown ? 'Trash' : 'All Notes'}
        <button
          className="NoteListHeader__addBtn"
          disabled={props.trashShown}
          onClick={props.createNote}
        >
          {plusIcon}
          <Tooltip position="down">
            New Note
            <div>Ctrl+Shift+N</div>
          </Tooltip>
        </button>
      </div>
      <div className="NoteListHeader__count">
        {props.noteCount} {props.noteCount === 1 ? 'Note' : 'Notes'}
      </div>
      {showSortModal && <SortModal close={() => setShowSortModal(false)} />}
    </div>
  );
};

NoteListHeader.propTypes = {
  noteCount: PropTypes.number.isRequired,
  trashShown: PropTypes.bool.isRequired,
  createNote: PropTypes.func.isRequired
};

export default NoteListHeader;
