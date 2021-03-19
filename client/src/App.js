import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Spinner from './components/UI/Spinner/Spinner';
const LoginPage = lazy(() => import('./components/AuthPages/LoginPage'));
const SignupPage = lazy(() => import('./components/AuthPages/SignupPage'));
const ForgotPage = lazy(() => import('./components/AuthPages/ForgotPage'));

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login">
          <Suspense fallback={<Spinner />}><LoginPage /></Suspense>
        </Route>
        <Route exact path="/signup">
          <Suspense fallback={<Spinner />}><SignupPage /></Suspense>
        </Route>
        <Route exact path="/forgot">
          <Suspense fallback={<Spinner />}><ForgotPage /></Suspense>
        </Route>
        <Redirect to="/login" />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
