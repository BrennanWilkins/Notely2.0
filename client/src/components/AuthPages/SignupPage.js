import React, { useState, useEffect } from 'react';
import AuthContainer from './AuthContainer';
import { eyeIcon, eyeHideIcon } from '../UI/icons';
import { Link } from 'react-router-dom';
import { validateSignup } from '../../utils/authValidation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [rememberUser, setRememberUser] = useState(false);
  const [msg, setMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);

  useEffect(() => {
    if (showMsg) { setShowMsg(false); }
  }, [email, pass, confirmPass]);

  const submitHandler = e => {
    e.preventDefault();
    const validationMsg = validateSignup(email, pass, confirmPass);
    if (validationMsg) {
      setShowMsg(true);
      return setMsg(validationMsg);
    }
  };

  return (
    <AuthContainer title="Sign up for Notely">
      <form onSubmit={submitHandler} className="AuthPages__form">
        <input className="AuthPages__input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <div className="AuthPages__inputContainer">
          <input type={showPass ? 'text' : 'password'} className="AuthPages__passInput" value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" />
          <div className="AuthPages__eye" onClick={() => setShowPass(show => !show)}>{showPass ? eyeHideIcon : eyeIcon}</div>
        </div>
        <div className="AuthPages__inputContainer">
          <input type={showConfirmPass ? 'text' : 'password'} className="AuthPages__passInput" value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
          placeholder="Confirm Password" />
          <div className="AuthPages__eye" onClick={() => setShowConfirmPass(show => !show)}>{showConfirmPass ? eyeHideIcon : eyeIcon}</div>
        </div>
        <div className={showMsg ? 'AuthPages__msg--show' : 'AuthPages__msg--hide'}>{msg}</div>
        <button type="Submit" className="AuthPages__submitBtn">Sign up</button>
      </form>
      <label className="AuthPages__rememberMe">
        <input type="checkbox" checked={rememberUser} onChange={() => setRememberUser(prev => !prev)} />
        Remember Me
      </label>
      <div className="AuthPages__link">Already have an account? <Link to="/login">Log in</Link></div>
    </AuthContainer>
  );
};

export default LoginPage;
