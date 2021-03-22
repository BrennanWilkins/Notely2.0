import React, { useState, useEffect } from 'react';
import AuthContainer from './AuthContainer';
import { Link } from 'react-router-dom';
import { validateResetPass } from '../../utils/authValidation';
import { instance as axios } from '../../axios';
import { useLocation } from 'react-router';
import { eyeIcon, eyeHideIcon } from '../UI/icons';

const ResetPassPage = () => {
  const location = useLocation();
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msg, setMsg] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  useEffect(() => {
    if (showMsg) { setShowMsg(false); }
  }, [newPass, confirmPass]);

  const submitHandler = e => {
    e.preventDefault();
    const validationMsg = validateResetPass(newPass, confirmPass, location.search);
    if (validationMsg) {
      setShowMsg(true);
      return setMsg(validationMsg);
    }
    setIsLoading(true);
    setShowMsg(false);
    const recoverPassID = location.search.slice(7);
    axios.post('/auth/resetPass', { newPass, recoverPassID }).then(res => {
      setIsLoading(false);
      setShowMsg(true);
      setMsg(`Your password was successfully changed. Click on 'Back to login' to login.`);
    }).catch(err => {
      setIsLoading(false);
      let errMsg = err?.response?.data?.msg || 'There was an error while reseting your password.';
      setShowMsg(true);
      setMsg(errMsg);
    });
  };

  return (
    <AuthContainer title="Reset your password">
      <form onSubmit={submitHandler} className="AuthPages__form">
        <div className="AuthPages__inputContainer">
          <input type={showNewPass ? 'text' : 'password'} className="AuthPages__passInput" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Password" />
          <div className="AuthPages__eye" onClick={() => setShowNewPass(show => !show)}>{showNewPass ? eyeHideIcon : eyeIcon}</div>
        </div>
        <div className="AuthPages__inputContainer">
          <input type={showConfirmPass ? 'text' : 'password'} className="AuthPages__passInput" value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
          placeholder="Confirm Password" />
          <div className="AuthPages__eye" onClick={() => setShowConfirmPass(show => !show)}>{showConfirmPass ? eyeHideIcon : eyeIcon}</div>
        </div>
        <div className={showMsg ? 'AuthPages__msg--show' : 'AuthPages__msg--hide'}>{msg}</div>
        <button type="Submit" className="AuthPages__submitBtn" disabled={isLoading}>Reset Password</button>
      </form>
      <div className="AuthPages__link"><Link to="/login">Back to login</Link></div>
    </AuthContainer>
  );
};

export default ResetPassPage;