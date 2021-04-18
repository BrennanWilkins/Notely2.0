import React from 'react';
import './SettingsModal.css';
import PropTypes from 'prop-types';
import ModalContainer from '../UI/ModalContainer/ModalContainer';
import DarkModeToggle from '../UI/DarkModeToggle/DarkModeToggle';

const SettingsModal = props => {
  return (
    <ModalContainer close={props.close} title="Settings">
      <DarkModeToggle />
    </ModalContainer>
  );
};

SettingsModal.propTypes = {
  close: PropTypes.func.isRequired
};

export default SettingsModal;
