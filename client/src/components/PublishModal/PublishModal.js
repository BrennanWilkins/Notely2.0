import React from 'react';
import './PublishModal.css';
import PropTypes from 'prop-types';
import ModalContainer from '../UI/ModalContainer/ModalContainer';

const PublishModal = props => {
  return (
    <ModalContainer close={props.close} title="Publish">
      <p className="PublishModal__info">
        Publishing a note will create a public link that will allow anyone with
        your note's link to view your note in a read-only mode.
      </p>
      <button className="Btn BlueBtn PublishModal__pubBtn">
        Create a public link
      </button>
    </ModalContainer>
  );
};

PublishModal.propTypes = {
  close: PropTypes.func.isRequired
};

export default PublishModal;
