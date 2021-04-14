import axios from 'axios';
import { logout } from './store/actions';
import store from './store';

export const baseURL = process.env.NODE_ENV === 'development' ?
'http://localhost:4000':
'https://notely-app.herokuapp.com';

export const instance = axios.create({ baseURL: baseURL + '/api' });

export const setToken = token => {
  instance.defaults.headers.common['x-auth-token'] = token;
  localStorage['token'] = token;
};

export const removeToken = () => {
  delete instance.defaults.headers.common['x-auth-token'];
  localStorage.removeItem('token');
};

instance.interceptors.response.use(res => res, err => {
  if (err?.response?.status === 401) { store.dispatch(logout()); }
  return Promise.reject(err);
});
