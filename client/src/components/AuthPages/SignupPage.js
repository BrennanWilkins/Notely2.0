import React, { useState, useEffect } from 'react';
import AuthContainer from './AuthContainer';
import { Link } from 'react-router-dom';
import { validateSignup } from '../../utils/authValidation';
import { instance as axios } from '../../axios';
import { logo, mailIcon } from '../UI/icons';
import PassInput from '../UI/PassInput/PassInput';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [rememberUser, setRememberUser] = useState(false);
  const [msg, setMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSignupSuccess, setShowSignupSuccess] = useState(false);

  useEffect(() => {
    if (showMsg) { setShowMsg(false); }
  }, [email, pass, confirmPass, username]);

  const submitHandler = e => {
    e.preventDefault();
    const validationMsg = validateSignup(email, username, pass, confirmPass);
    if (validationMsg) {
      setShowMsg(true);
      return setMsg(validationMsg);
    }
    setIsLoading(true);
    setShowMsg(false);
    axios.post('/auth/signup', { email, username, pass, rememberUser }).then(res => {
      setIsLoading(false);
      setShowSignupSuccess(true);
    }).catch(err => {
      let errMsg = err?.response?.data?.msg || 'There was an error while signing up.';
      setMsg(errMsg);
      setShowMsg(true);
      setIsLoading(false);
    });
  };

  return showSignupSuccess ?
    <div className="AuthContainer AuthContainer--dark">
      <div className="AuthContainer__logo">{logo}</div>
      <div className="SignupSuccess__mailIcon">{mailIcon}</div>
      <div className="SignupSuccess__text">
        Please click on the link sent to your email address to finish signing up.
      </div>
    </div>
  : (
    <AuthContainer title="Sign up for Notely">
      <form onSubmit={submitHandler} className="AuthPages__form">
        <input className="AuthPages__input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
        <input className="AuthPages__input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <PassInput className="AuthPages__passInput" value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" />
        <PassInput className="AuthPages__passInput" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Confirm Password" />
        <div className={showMsg ? 'AuthPages__msg--show' : 'AuthPages__msg--hide'}>{msg}</div>
        <button type="Submit" className="AuthPages__submitBtn" disabled={isLoading}>Sign up</button>
      </form>
      <label className="AuthPages__rememberMe">
        <input type="checkbox" checked={rememberUser} onChange={() => setRememberUser(prev => !prev)} />
        Remember Me
      </label>
      <div className="AuthPages__link">Already have an account? <Link to="/login">Log in</Link></div>
    </AuthContainer>
  );
};

export default SignupPage;
