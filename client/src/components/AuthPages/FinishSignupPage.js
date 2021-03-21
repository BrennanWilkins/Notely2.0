import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { instance as axios } from '../../axios';
import { logo } from '../UI/icons';
import Spinner from '../UI/Spinner/Spinner';
import './AuthPages.css';
import { Link } from 'react-router-dom';

const FinishSignupPage = () => {
  const history = useHistory();
  const [msg, setMsg] = useState('There was an error while finishing your signup.');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!history.location.search || history.location.search.slice(0, 7) !== '?token=') {
      return history.push('/');
    }
    const signupID = history.location.search.slice(7);
    axios.get(`/auth/finishSignup/${signupID}`).then(res => {
      setIsLoading(false);
      history.push('/');
    }).catch(err => {
      setIsLoading(false);
      let errMsg = err?.response?.data?.msg || 'There was an error while finishing your signup.';
      setMsg(errMsg);
    });
  }, []);

  return (
    <div className="AuthContainer AuthContainer--dark">
      {isLoading ?
        <Spinner />
        :
        <>
          <div className="AuthContainer__logo">{logo}</div>
          {!!msg && <div className="SignupSuccess__text">{msg}</div>}
          <div className="AuthPages__link"><Link to="/login">Back to login</Link></div>
        </>
      }
    </div>
  );
};

export default FinishSignupPage;
