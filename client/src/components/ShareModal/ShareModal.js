import React, { useState } from 'react';
import './ShareModal.css';
import PropTypes from 'prop-types';
import ModalContainer from '../UI/ModalContainer/ModalContainer';
import { connect } from 'react-redux';
import { useDidUpdate } from '../../utils/customHooks';
import { sendInvite } from '../../socket';

const ShareModal = props => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msg, setMsg] = useState('');
  const [showInviteSuccess, setShowInviteSuccess] = useState(false);

  useDidUpdate(() => {
    props.close();
  }, [props.noteID]);

  const inputHandler = e => {
    setUserInput(e.target.value);
    if (showMsg) { setShowMsg(false); }
    if (showInviteSuccess) { setShowInviteSuccess(false); }
  };

  const msgHandler = errMsg => {
    setShowMsg(true);
    setMsg(errMsg);
    setIsLoading(false);
    setUserInput('');
  };

  const successHandler = () => {
    msgHandler('Your invite was successfully sent.');
    setShowInviteSuccess(true);
  };

  const sendInviteHandler = e => {
    e.preventDefault();
    if (!userInput) { return; }
    setIsLoading(true);
    setShowMsg(false);
    setShowInviteSuccess(false);
    sendInvite(props.noteID, userInput, msgHandler, successHandler);
  };

  return (
    <ModalContainer close={props.close} title="Share">
      <div className="ShareModal__subTitle">
        Add the username or email of another Notely user to collaborate on this note with them.
        Once they receive the invitation, they can choose to accept or decline it.
      </div>
      <form onSubmit={sendInviteHandler} className="ShareModal__form">
        <input
          value={userInput}
          onChange={inputHandler}
          placeholder="Username or email"
        />
        <button type="submit" disabled={isLoading}>Send Invite</button>
      </form>
      <div
        className={`
          ShareModal__msg
          ${showMsg ? 'ShareModal__msg--show' : 'ShareModal__msg--hide'}
          ${showInviteSuccess ? 'ShareModal__msg--success' : ''}
        `}
      >
        {msg}
      </div>
      <div className="ShareModal__collabs">
        <div className="ShareModal__collabsTitle">Collaborators</div>
        {props.collaborators.map(username => {
          const user = props.collabsByName[username];
          return (
            <div key={username} className="ShareModal__collab">
              <div className="ShareModal__user">{username}</div>
              <div className="ShareModal__email">{user.email}</div>
            </div>
          );
        })}
      </div>
    </ModalContainer>
  );
};

ShareModal.propTypes = {
  close: PropTypes.func.isRequired,
  collaborators: PropTypes.array.isRequired,
  noteID: PropTypes.string,
  collabsByName: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  collaborators: state.notes.currentNoteID ? state.notes.notesByID[state.notes.currentNoteID].collaborators : [],
  collabsByName: state.notes.collabsByName,
  noteID: state.notes.currentNoteID
});

export default connect(mapStateToProps)(ShareModal);
