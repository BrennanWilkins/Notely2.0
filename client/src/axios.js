import axios from 'axios';

export const baseURL = 'http://localhost:4000';

export const instance = axios.create({ baseURL: baseURL + '/api' });

export const setToken = token => {
  instance.defaults.headers.common['x-auth-token'] = token;
  localStorage['token'] = token;
};

export const removeToken = () => {
  delete instance.defaults.headers.common['x-auth-token'];
  localStorage.removeItem('token');
};
