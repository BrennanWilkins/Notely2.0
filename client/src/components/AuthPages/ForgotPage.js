import React, { useState } from 'react';
import classes from './AuthPages.module.css';
import AuthContainer from './AuthContainer';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');

  const submitHandler = e => {
    e.preventDefault();
  };

  return (
    <AuthContainer title="Forgot my password">
      <form onSubmit={submitHandler} className={classes.Form}>
        <input className={classes.Input} value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <button type="Submit" className={classes.SubmitBtn}>Send link</button>
      </form>
      <div className={classes.Link}><Link to="/login">Back to login</Link></div>
    </AuthContainer>
  );
};

export default LoginPage;
