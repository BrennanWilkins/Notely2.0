import React from 'react';
import './NoteContainer.css';
import NoteContent from '../NoteContent/NoteContent';
import NoteMenu from '../NoteMenu/NoteMenu';

const NoteContainer = () => {
  return (
    <div className="NoteContainer">
      <NoteMenu />
      <NoteContent />
    </div>
  );
};

export default NoteContainer;
