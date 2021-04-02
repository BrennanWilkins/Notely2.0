import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import './ModalContainer.css';
import PropTypes from 'prop-types';
import { CloseBtn } from '../Buttons/Buttons';

const ModalContainer = props => {
  const modalRef = useRef();

  const clickHandler = e => {
    if (modalRef.current.contains(e.target)) { return; }
    props.close();
  };

  return createPortal(
    <div className="ModalContainer" onClick={clickHandler}>
      <div className={`ModalContainer__modal ${props.className || ''}`} ref={modalRef}>
        <div className="ModalContainer__modalTitle">{props.title}</div>
        <CloseBtn onClick={props.close} />
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
