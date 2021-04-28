import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import './NoteMenu.css';
import { useModalToggle } from '../../utils/customHooks';
import { downloadCurrNote } from '../../utils/downloadNotes';

const NoteOptions = ({ close }) => {
  const modalRef = useRef();
  useModalToggle(modalRef, close);

  return (
    <div ref={modalRef} className="NoteMenu__optModal">
      <div onClick={() => window.print()}>Print Note</div>
      <div onClick={() => downloadCurrNote()}>Export Note</div>
    </div>
  );
};

NoteOptions.propTypes = {
  close: PropTypes.func.isRequired
};

export default NoteOptions;
