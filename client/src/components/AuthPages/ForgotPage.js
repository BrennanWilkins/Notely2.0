import React, { useState } from 'react';
import AuthContainer from './AuthContainer';
import { Link } from 'react-router-dom';
import { isEmail } from '../../utils/authValidation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);

  const submitHandler = e => {
    e.preventDefault();
    if (!isEmail(email)) {
      setMsg('Please enter a valid email.');
      return setShowMsg(true);
    }
  };

  return (
    <AuthContainer title="Forgot my password">
      <form onSubmit={submitHandler} className="AuthPages__form">
        <input className="AuthPages__input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <div className={showMsg ? 'AuthPages__msg--show' : 'AuthPages__msg--hide'}>{msg}</div>
        <button type="Submit" className="AuthPages__submitBtn">Send link</button>
      </form>
      <div className="AuthPages__link"><Link to="/login">Back to login</Link></div>
    </AuthContainer>
  );
};

export default LoginPage;
