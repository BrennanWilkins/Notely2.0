import React from 'react';
import './ShareModal.css';
import PropTypes from 'prop-types';
import ModalContainer from '../UI/ModalContainer/ModalContainer';

const ShareModal = props => {
  return (
    <ModalContainer close={props.close} title="Share">
    </ModalContainer>
  );
};

ShareModal.propTypes = {
  close: PropTypes.func.isRequired
};

export default ShareModal;
