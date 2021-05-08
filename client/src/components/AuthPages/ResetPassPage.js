import React, { useState, useEffect } from 'react';
import AuthContainer from './AuthContainer';
import { Link } from 'react-router-dom';
import { validateResetPass, getTokenParam } from '../../utils/authValidation';
import { instance as axios } from '../../axios';
import { useLocation } from 'react-router';
import PassInput from '../UI/PassInput/PassInput';

const ResetPassPage = () => {
  const location = useLocation();
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (showMsg) { setShowMsg(false); }
  }, [newPass, confirmPass]);

  const submitHandler = e => {
    e.preventDefault();
    const recoverPassID = getTokenParam(location.search);
    const validationMsg = validateResetPass(newPass, confirmPass, recoverPassID);
    if (validationMsg) {
      setShowMsg(true);
      return setMsg(validationMsg);
    }
    setIsLoading(true);
    setShowMsg(false);
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
      <form onSubmit={submitHandler} className="Auth__form">
        <PassInput
          className="Auth__passInput"
          value={newPass}
          onChange={e => setNewPass(e.target.value)}
          placeholder="Password"
        />
        <PassInput
          className="Auth__passInput"
          value={confirmPass}
          onChange={e => setConfirmPass(e.target.value)}
          placeholder="Confirm Password"
        />
        <div className={showMsg ? 'Auth__msg--show' : 'Auth__msg--hide'}>
          {msg}
        </div>
        <button
          type="Submit"
          className="Btn BlueBtn Auth__submitBtn"
          disabled={isLoading}
        >
          Reset Password
        </button>
      </form>
      <div className="Auth__link">
        <Link to="/login">Back to login</Link>
      </div>
    </AuthContainer>
  );
};

export default ResetPassPage;
