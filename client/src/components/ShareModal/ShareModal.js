import React, { useState, useRef } from 'react';
import './ShareModal.css';
import PropTypes from 'prop-types';
import ModalContainer from '../UI/ModalContainer/ModalContainer';
import { connect } from 'react-redux';
import { useDidUpdate } from '../../utils/customHooks';
import { sendUpdate } from '../../socket';
import { selectCurrCollabs, selectUserIsOwner } from '../../store/selectors';
import { keyIcon } from '../UI/icons';
import { removeCollab } from '../../store/actions';

const ShareModal = ({
  close,
  collabs,
  byName,
  noteID,
  userIsOwner,
  removeCollab
}) => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msg, setMsg] = useState('');
  const [showInviteSuccess, setShowInviteSuccess] = useState(false);
  const removeLoading = useRef(new Set());

  useDidUpdate(() => {
    close();
  }, [noteID]);

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
    if (!userInput || isLoading) { return; }
    setIsLoading(true);
    setShowMsg(false);
    setShowInviteSuccess(false);

    sendUpdate('post/note/invite', { noteID, username: userInput }, res => {
      if (res.error) {
        return msgHandler(res.errMsg);
      }
      successHandler();
    });
  };

  const removeHandler = username => {
    if (removeLoading.current.has(username)) { return; }
    removeLoading.current.add(username);
    const payload = { noteID, username };
    sendUpdate('put/note/removeCollab', payload, success => {
      if (success) {
        removeCollab(payload);
      }
      removeLoading.current.delete(username);
    });
  };

  return (
    <ModalContainer close={close} title="Share">
      <div className="ShareModal__subTitle">
        Add the username or email of another Notely user to collaborate on this note with them.
        Once they receive the invitation, they can choose to accept or decline it.
      </div>
      <form onSubmit={sendInviteHandler} className="ShareModal__form">
        <input
          className="Input"
          value={userInput}
          onChange={inputHandler}
          placeholder="Username or email"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="Btn BlueBtn"
        >
          Send Invite
        </button>
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
        {collabs.map((username, idx) => {
          const { email } = byName[username];
          return (
            <div key={username} className="ShareModal__collab">
              <div>
                <div className="ShareModal__user">{username}</div>
                <div className="ShareModal__email">{email}</div>
              </div>
              {
                idx === 0 ?
                  <div className="ShareModal__owner" title="Note Owner">
                    {keyIcon}
                  </div>
                : userIsOwner ?
                  <button
                    className="Btn ShareModal__removeBtn"
                    onClick={() => removeHandler(username)}
                  >
                    Remove
                  </button>
                : null
              }
            </div>
          );
        })}
      </div>
    </ModalContainer>
  );
};

ShareModal.propTypes = {
  close: PropTypes.func.isRequired,
  collabs: PropTypes.array.isRequired,
  noteID: PropTypes.string,
  byName: PropTypes.object.isRequired,
  userIsOwner: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  collabs: selectCurrCollabs(state),
  byName: state.collabs,
  noteID: state.notes.currentNoteID,
  userIsOwner: selectUserIsOwner(state)
});

export default connect(mapStateToProps, { removeCollab })(ShareModal);
