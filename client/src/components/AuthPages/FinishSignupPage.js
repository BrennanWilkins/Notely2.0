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
import { searchIsValid } from '../../utils/authValidation';

const FinishSignupPage = props => {
  const history = useHistory();
  const [msg, setMsg] = useState('There was an error while finishing your signup.');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!searchIsValid(history.location.search)) {
      return history.push('/');
    }
    const signupID = history.location.search.slice(7);
    axios.get(`/auth/finishSignup/${signupID}`).then(res => {
      setIsLoading(false);
      props.login(res.data);
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
