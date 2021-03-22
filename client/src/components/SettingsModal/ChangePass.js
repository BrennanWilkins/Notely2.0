import React, { useState } from 'react';
import { instance as axios } from '../../axios';
import { validateChangePass } from '../../utils/authValidation';
import PassInput from '../UI/PassInput/PassInput';

const ChangePass = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

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
          <PassInput value={oldPass} onChange={oldPassHandler} />
        </label>
      </div>
      <div className="SettingsModal__section">
        <label>
          <span>New password</span>
          <PassInput value={newPass} onChange={newPassHandler} />
        </label>
      </div>
      <div className="SettingsModal__section">
        <label>
          <span>Confirm new password</span>
          <PassInput value={confirmPass} onChange={confPassHandler} />
        </label>
      </div>
      <button className="SettingsModal__saveBtn" disabled={isLoading} onClick={changePassHandler}>Save</button>
      <div className={`SettingsModal__msg ${!showMsg ? 'SettingsModal__msg--hide' : ''}`}>{msg}</div>
    </div>
  );
};

export default ChangePass;
