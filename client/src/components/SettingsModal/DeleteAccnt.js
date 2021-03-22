import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { instance as axios } from '../../axios';
import { eyeIcon, eyeHideIcon } from '../UI/icons';

const DeleteAccnt = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  const deleteHandler = () => {
    setIsLoading(true);
    axios.delete('/user/' + pass).then(res => {
      props.logout();
    }).catch(err => {
      setIsLoading(false);
      let errMsg = err?.response?.data?.msg || 'There was an error while deleting your account.';
      setShowMsg(true);
      setMsg(errMsg);
    });
  };

  const passHandler = e => {
    setPass(e.target.value);
    setShowMsg(false);
  };

  return (
    <>
      <p className="SettingsModal__deleteInfo">Deleting your account cannot be undone. All of your notes will be deleted.
      Any notes that are shared with another collaborator will not be deleted. Please enter your password to confirm.</p>
      <div className="SettingsModal__container">
        <div className="SettingsModal__section">
          <div className="SettingsModal__input">
            <input type={showPass ? 'text' : 'password'} value={pass} onChange={passHandler} />
            <div className="SettingsModal__eye" onClick={() => setShowPass(show => !show)}>{showPass ? eyeHideIcon : eyeIcon}</div>
          </div>
        </div>
        <button className="SettingsModal__deleteBtn" disabled={isLoading || !pass} onClick={deleteHandler}>DELETE MY ACCOUNT</button>
        <div className={`SettingsModal__msg ${!showMsg ? 'SettingsModal__msg--hide' : ''}`}>{msg}</div>
      </div>
    </>
  );
};

DeleteAccnt.propTypes = {
  logout: PropTypes.func.isRequired
};

export default DeleteAccnt;
