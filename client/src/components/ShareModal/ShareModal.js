import React, { useState } from 'react';
import './ShareModal.css';
import PropTypes from 'prop-types';
import ModalContainer from '../UI/ModalContainer/ModalContainer';
import { connect } from 'react-redux';

const ShareModal = props => {
  const [userInput, setUserInput] = useState('');

  const sendInviteHandler = () => {

  };

  return (
    <ModalContainer close={props.close} title="Share">
      <div className="ShareModal__subTitle">
        Add the username or email of another Notely user to collaborate on this note with them.
        The user will receive the invite to collaborate and can then choose to accept or decline the invitation.
      </div>
      <div className="ShareModal__input">
        <input
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          placeholder="Username or email"
        />
        <button onClick={sendInviteHandler}>Send Invite</button>
      </div>
      <div className="ShareModal__collabs">
        {props.collaborators.map(user => (
          <div key={user.email}>
            <div>{user.username}</div>
            <div>{user.email}</div>
          </div>
        ))}
      </div>
    </ModalContainer>
  );
};

ShareModal.propTypes = {
  close: PropTypes.func.isRequired,
  collaborators: PropTypes.array.isRequired,
  noteID: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  collaborators: state.notes.currentNoteID ? state.notes.notesByID[state.notes.currentNoteID].collaborators : [],
  noteID: state.notes.currentNoteID
});

export default connect(mapStateToProps)(ShareModal);
