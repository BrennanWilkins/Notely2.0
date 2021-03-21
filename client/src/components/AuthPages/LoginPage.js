import React, { useState, useEffect } from 'react';
import AuthContainer from './AuthContainer';
import { eyeIcon, eyeHideIcon } from '../UI/icons';
import { Link } from 'react-router-dom';
import { validateLogin } from '../../utils/authValidation';
import { instance as axios } from '../../axios';

const LoginPage = () => {
  const [loginName, setLoginName] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [rememberUser, setRememberUser] = useState(false);
  const [msg, setMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showMsg) { setShowMsg(false); }
  }, [loginName, pass]);

  const submitHandler = e => {
    e.preventDefault();
    const validationMsg = validateLogin(loginName, pass);
    if (validationMsg) {
      setShowMsg(true);
      return setMsg(validationMsg);
    }
    setIsLoading(true);
    setShowMsg(false);
    axios.post('/auth/login', { loginName, pass, rememberUser }).then(res => {
      setIsLoading(false);
    }).catch(err => {
      setIsLoading(false);
      let errMsg = err?.response?.data?.msg || 'There was an error while logging in.';
      setMsg(errMsg);
      setShowMsg(true);
    });
  };

  return (
    <AuthContainer title="Log in to Notely">
      <form onSubmit={submitHandler} className="AuthPages__form">
        <input className="AuthPages__input" value={loginName} onChange={e => setLoginName(e.target.value)} placeholder="Username or email" />
        <div className="AuthPages__inputContainer">
          <input type={showPass ? 'text' : 'password'} className="AuthPages__passInput" value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" />
          <div className="AuthPages__eye" onClick={() => setShowPass(show => !show)}>{showPass ? eyeHideIcon : eyeIcon}</div>
        </div>
        <div className={showMsg ? 'AuthPages__msg--show' : 'AuthPages__msg--hide'}>{msg}</div>
        <button type="Submit" className="AuthPages__submitBtn" disabled={isLoading}>Log in</button>
      </form>
      <label className="AuthPages__rememberMe">
        <input type="checkbox" checked={rememberUser} onChange={() => setRememberUser(prev => !prev)} />
        Remember Me
      </label>
      <div className="AuthPages__link"><Link to="/forgot">Forgot my password</Link></div>
      <div className="AuthPages__link">Don't have an account? <Link to="/signup">Sign up</Link></div>
    </AuthContainer>
  );
};

export default LoginPage;
