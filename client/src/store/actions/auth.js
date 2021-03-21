import * as actionTypes from './actionTypes';
import { instance as axios, removeToken, setToken } from '../../axios';

export const logout = () => {
  removeToken();
  return { type: actionTypes.LOGOUT };
};

export const tryAutoLogin = () => async dispatch => {
  if (!localStorage['token']) { return; }
  try {
    dispatch({ type: actionTypes.AUTO_LOGIN_IS_LOADING });
    axios.defaults.headers.common['x-auth-token'] = localStorage['token'];
    const res = await axios.get('/auth/login');
    dispatch({ type: actionTypes.LOGIN, payload: res.data });
  } catch (err) {
    dispatch(logout());
  }
};

export const login = data => {
  const { token, ...payload } = data;
  setToken(token);
  return { type: actionTypes.LOGIN, payload };
};
