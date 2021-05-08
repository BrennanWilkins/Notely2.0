import React, { useState, useEffect } from 'react';
import AuthContainer from './AuthContainer';
import { Link } from 'react-router-dom';
import { isEmail } from '../../utils/authValidation';
import { instance as axios } from '../../axios';

const ForgotPage = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showMsg) { setShowMsg(false); }
  }, [email]);

  const submitHandler = e => {
    e.preventDefault();
    if (!isEmail(email)) {
      setMsg('Please enter a valid email.');
      return setShowMsg(true);
    }
    setIsLoading(true);
    setShowMsg(false);
    axios.post('/auth/forgotPass', { email }).then(res => {
      setIsLoading(false);
      setMsg('Please check your email for a link to reset your password.');
      setShowMsg(true);
    }).catch(err => {
      setIsLoading(false);
      let errMsg = err?.response?.data?.msg || 'There was an error while connecting to the server.';
      setMsg(errMsg);
      setShowMsg(true);
    });
  };

  return (
    <AuthContainer title="Forgot my password">
      <form onSubmit={submitHandler} className="Auth__form">
        <input
          className="Auth__input"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        />
        <div className={showMsg ? 'Auth__msg--show' : 'Auth__msg--hide'}>
          {msg}
        </div>
        <button
          type="Submit"
          className="Btn BlueBtn Auth__submitBtn"
          disabled={isLoading}
        >
          Send Link
        </button>
      </form>
      <div className="Auth__link">
        <Link to="/login">Back to login</Link>
      </div>
    </AuthContainer>
  );
};

export default ForgotPage;
