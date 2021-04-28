import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import './NoteMenu.css';
import { useModalToggle } from '../../utils/customHooks';

const NoteOptions = ({ close }) => {
  const modalRef = useRef();
  useModalToggle(modalRef, close);

  return (
    <div ref={modalRef} className="NoteMenu__optModal">
      <div>Print Note</div>
      <div>Export Note</div>
    </div>
  );
};

NoteOptions.propTypes = {
  close: PropTypes.func.isRequired
};

export default NoteOptions;
