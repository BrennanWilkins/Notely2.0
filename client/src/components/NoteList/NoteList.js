import React from 'react';
import './NoteList.css';
import { plusIcon, sortIcon } from '../UI/icons';
import Tooltip from '../UI/Tooltip/Tooltip';

const NoteList = () => {
  return (
    <div className="NoteList">
      <div className="NoteList__header">
        <div className="NoteList__title">
          <button className="NoteList__sortBtn">
            {sortIcon}
            <Tooltip position="down">Sort Notes</Tooltip>
          </button>
          All Notes
          <button className="NoteList__addBtn">
            {plusIcon}
            <Tooltip position="down">New Note<div>Ctrl+Shift+N</div></Tooltip>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteList;
