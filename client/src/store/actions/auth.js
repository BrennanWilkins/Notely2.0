import * as actionTypes from './actionTypes';
import { instance as axios, removeToken, setToken } from '../../axios';
import { closeSocket, initSocket } from '../../socket';

export const logout = () => {
  removeToken();
  closeSocket();
  return { type: actionTypes.LOGOUT };
};

export const tryAutoLogin = () => async dispatch => {
  if (!localStorage['token']) { return; }
  try {
    dispatch({ type: actionTypes.AUTO_LOGIN_IS_LOADING });
    axios.defaults.headers.common['x-auth-token'] = localStorage['token'];
    const res = await axios.get('/user');
    await initSocket();
    dispatch({ type: actionTypes.LOGIN, payload: res.data });
  } catch (err) {
    dispatch(logout());
  }
};

export const login = data => async dispatch => {
  const { token, ...payload } = data;
  setToken(token);
  await initSocket();
  dispatch({ type: actionTypes.LOGIN, payload });
};
