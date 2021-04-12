import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AuthContainer from './AuthContainer';
import { Link } from 'react-router-dom';
import { validateLogin } from '../../utils/authValidation';
import { instance as axios } from '../../axios';
import { connect } from 'react-redux';
import { login } from '../../store/actions';
import PassInput from '../UI/PassInput/PassInput';

const LoginPage = props => {
  const [loginName, setLoginName] = useState('');
  const [pass, setPass] = useState('');
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
      props.login(res.data);
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
        <PassInput className="AuthPages__passInput" value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" />
        <div className={showMsg ? 'AuthPages__msg--show' : 'AuthPages__msg--hide'}>{msg}</div>
        <button type="Submit" className="Btn BlueBtn AuthPages__submitBtn" disabled={isLoading}>Log in</button>
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

LoginPage.propTypes = {
  login: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  login: payload => dispatch(login(payload))
});

export default connect(null, mapDispatchToProps)(LoginPage);
