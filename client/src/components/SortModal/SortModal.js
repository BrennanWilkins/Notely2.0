import React, { useRef, useEffect } from 'react';
import './SortModal.css';
import PropTypes from 'prop-types';
import { CloseBtn } from '../UI/Buttons/Buttons';
import { useModalToggle } from '../../utils/customHooks';

const SortModal = props => {
  const modalRef = useRef();
  useModalToggle(modalRef, props.close);

  return (
    <div className="SortModal" ref={modalRef}>
      <div className="SortModal__title">
        Sort By
        <CloseBtn className="SortModal__closeBtn" onClick={props.close} />
      </div>
      <div className="SortModal__options">
        <div>Date created (newest first)</div>
        <div>Date created (oldest first)</div>
        <div>Last updated (newest first)</div>
        <div>Last updated (oldest first)</div>
        <div>Alphabetically (A to Z)</div>
        <div>Alphabetically (Z to A)</div>
      </div>
    </div>
  );
};

SortModal.propTypes = {
  close: PropTypes.func.isRequired
};

export default SortModal;
