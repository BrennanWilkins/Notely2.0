import React, { useState } from 'react';
import { instance as axios } from '../../axios';
import { validateChangePass } from '../../utils/authValidation';
import { eyeIcon, eyeHideIcon } from '../UI/icons';

const ChangePass = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const changePassHandler = () => {
    const validationMsg = validateChangePass(oldPass, newPass, confirmPass);
    if (validationMsg) {
      setMsg(validationMsg);
      return setShowMsg(true);
    }
    setIsLoading(true);
    axios.post('/auth/changePass', { oldPass, newPass }).then(res => {
      setIsLoading(false);
      setShowMsg(true);
      setMsg('Your password was successfully changed.');
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
    }).catch(err => {
      setIsLoading(false);
      const errMsg = err?.response?.data?.msg || 'There was an error while changing your password.';
      setMsg(errMsg);
      setShowMsg(true);
    });
  };

  const oldPassHandler = e => {
    setOldPass(e.target.value);
    setShowMsg(false);
  };

  const newPassHandler = e => {
    setNewPass(e.target.value);
    setShowMsg(false);
  };

  const confPassHandler = e => {
    setConfirmPass(e.target.value);
    setShowMsg(false);
  };

  return (
    <div className="SettingsModal__container">
      <div className="SettingsModal__section">
        <label>
          <span>Old password</span>
          <div className="SettingsModal__input">
            <input type={showOldPass ? 'text' : 'password'} value={oldPass} onChange={oldPassHandler} />
            <div className="SettingsModal__eye" onClick={() => setShowOldPass(show => !show)}>{showOldPass ? eyeHideIcon : eyeIcon}</div>
          </div>
        </label>
      </div>
      <div className="SettingsModal__section">
        <label>
          <span>New password</span>
          <div className="SettingsModal__input">
            <input type={showNewPass ? 'text' : 'password'} value={newPass} onChange={newPassHandler} />
            <div className="SettingsModal__eye" onClick={() => setShowNewPass(show => !show)}>{showNewPass ? eyeHideIcon : eyeIcon}</div>
          </div>
        </label>
      </div>
      <div className="SettingsModal__section">
        <label>
          <span>Confirm new password</span>
          <div className="SettingsModal__input">
            <input type={showConfirmPass ? 'text' : 'password'} value={confirmPass} onChange={confPassHandler} />
            <div className="SettingsModal__eye" onClick={() => setShowConfirmPass(show => !show)}>{showConfirmPass ? eyeHideIcon : eyeIcon}</div>
          </div>
        </label>
      </div>
      <button className="SettingsModal__saveBtn" disabled={isLoading} onClick={changePassHandler}>Save</button>
      <div className={`SettingsModal__msg ${!showMsg ? 'SettingsModal__msg--hide' : ''}`}>{msg}</div>
    </div>
  );
};

export default ChangePass;
