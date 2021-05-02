import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { instance as axios } from '../../axios';
import { logo } from '../UI/icons';
import Spinner from '../UI/Spinner/Spinner';
import './AuthPages.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../store/actions';
import { getTokenParam } from '../../utils/authValidation';

const FinishSignupPage = ({ login }) => {
  const history = useHistory();
  const [msg, setMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const signupID = getTokenParam(history.location.search);
    if (!signupID) {
      return history.push('/');
    }
    axios.get(`/auth/finishSignup/${signupID}`).then(res => {
      setIsLoading(false);
      login(res.data);
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

FinishSignupPage.propTypes = {
  login: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  login: payload => dispatch(login(payload))
});

export default connect(null, mapDispatchToProps)(FinishSignupPage);
