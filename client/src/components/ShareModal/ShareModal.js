import React, { useRef } from 'react';
import './ShareModal.css';
import PropTypes from 'prop-types';
import { CloseBtn } from '../UI/Buttons/Buttons';

const ShareModal = props => {
  const modalRef = useRef();

  const clickHandler = e => {
    if (modalRef.current.contains(e.target)) { return; }
    props.close();
  };

  return (
    <div className="ShareModalContainer" onClick={clickHandler}>
      <div className="ShareModal" ref={modalRef}>
        <div className="ShareModal__title">Share</div>
        <CloseBtn onClick={props.close} />
      </div>
    </div>
  );
};

ShareModal.propTypes = {
  close: PropTypes.func.isRequired
};

export default ShareModal;
