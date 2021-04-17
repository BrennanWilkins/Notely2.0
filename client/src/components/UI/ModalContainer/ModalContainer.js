import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './ModalContainer.css';
import PropTypes from 'prop-types';
import { CloseBtn } from '../Buttons/Buttons';

const ModalContainer = props => {
  const modalRef = useRef();
  const [unmount, setUnmount] = useState(false);

  const closeHandler = () => {
    setUnmount(true);
    setTimeout(() => props.close(), 325);
  };

  const clickHandler = e => {
    if (modalRef.current.contains(e.target)) { return; }
    closeHandler();
  };

  return createPortal(
    <div
      className={`ModalContainer ${unmount ? 'ModalContainer--unmountAnim' : ''}`}
      onClick={clickHandler}
    >
      <div className={`ModalContainer__modal ${props.className || ''}`} ref={modalRef}>
        <div className="ModalContainer__modalTitle">{props.title}</div>
        <CloseBtn onClick={closeHandler} />
        {props.children}
      </div>
    </div>,
    document.getElementById('portal-root')
  );
};

ModalContainer.propTypes = {
  close: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default ModalContainer;
