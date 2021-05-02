import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from './components/UI/Spinner/Spinner';
import { connect } from 'react-redux';
import { tryAutoLogin } from './store/actions';
const LoginPage = lazy(() => import('./components/AuthPages/LoginPage'));
const SignupPage = lazy(() => import('./components/AuthPages/SignupPage'));
const ForgotPage = lazy(() => import('./components/AuthPages/ForgotPage'));
const FinishSignupPage = lazy(() => import('./components/AuthPages/FinishSignupPage'));
const ResetPassPage = lazy(() => import('./components/AuthPages/ResetPassPage'));
const NotelyContainer = lazy(() => import('./components/NotelyContainer/NotelyContainer'));
const HelpPage = lazy(() => import('./components/HelpPage/HelpPage'));

const App = ({ isAutoLoggingIn, isAuth, tryAutoLogin }) => {
  useEffect(() => tryAutoLogin(), []);

  // if trying to auto log in or not auth yet but token in LS then show spinner
  // if user is auth then show notely container
  // if auto log in failed & user not auth & no token then show auth pages
  return (
    <BrowserRouter>
      {
        (isAutoLoggingIn || (!isAuth && localStorage['token'])) ?
          <Spinner />
        :
        isAuth ?
          <Switch>
            <Route exact path="/">
              <Suspense fallback={<Spinner />}><NotelyContainer /></Suspense>
            </Route>
            <Route exact path="/help">
              <Suspense fallback={<Spinner />}><HelpPage isAuth /></Suspense>
            </Route>
            <Redirect to="/" />
          </Switch>
        :
          <Switch>
            <Route exact path="/login">
              <Suspense fallback={<Spinner />}><LoginPage /></Suspense>
            </Route>
            <Route exact path="/signup">
              <Suspense fallback={<Spinner />}><SignupPage /></Suspense>
            </Route>
            <Route path="/finish-signup">
              <Suspense fallback={<Spinner />}><FinishSignupPage /></Suspense>
            </Route>
            <Route exact path="/forgot">
              <Suspense fallback={<Spinner />}><ForgotPage /></Suspense>
            </Route>
            <Route path="/reset-password">
              <Suspense fallback={<Spinner />}><ResetPassPage /></Suspense>
            </Route>
            <Route exact path="/help">
              <Suspense fallback={<Spinner />}><HelpPage isAuth={false} /></Suspense>
            </Route>
            <Redirect to="/login" />
          </Switch>
      }
    </BrowserRouter>
  );
};

App.propTypes = {
  isAutoLoggingIn: PropTypes.bool.isRequired,
  isAuth: PropTypes.bool.isRequired,
  tryAutoLogin: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isAutoLoggingIn: state.auth.isAutoLoggingIn,
  isAuth: state.auth.isAuth
});

const mapDispatchToProps = dispatch => ({
  tryAutoLogin: () => dispatch(tryAutoLogin())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
