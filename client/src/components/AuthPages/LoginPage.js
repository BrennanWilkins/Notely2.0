import React, { useState } from 'react';
import classes from './AuthPages.module.css';
import AuthContainer from './AuthContainer';
import { eyeIcon, eyeHideIcon } from '../UI/icons';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [rememberUser, setRememberUser] = useState(false);

  const submitHandler = e => {
    e.preventDefault();
  };

  return (
    <AuthContainer title="Log in to Notely">
      <form onSubmit={submitHandler} className={classes.Form}>
        <input className={classes.Input} value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <div className={classes.InputContainer}>
          <input type={showPass ? 'text' : 'password'} className={classes.PassInput} value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" />
          <div className={classes.EyeIcon} onClick={() => setShowPass(show => !show)}>{showPass ? eyeHideIcon : eyeIcon}</div>
        </div>
        <button type="Submit" className={classes.SubmitBtn}>Log in</button>
      </form>
      <label className={classes.RememberMe}>
        <input type="checkbox" checked={rememberUser} onChange={() => setRememberUser(prev => !prev)} />
        Remember Me
      </label>
      <div className={classes.Link}><Link to="/forgot">Forgot my password</Link></div>
      <div className={classes.Link}>Don't have an account? <Link to="/signup">Sign up</Link></div>
    </AuthContainer>
  );
};

export default LoginPage;
