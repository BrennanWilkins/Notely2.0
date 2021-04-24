import io from 'socket.io-client';
import { instance as axios, baseURL } from '../axios';
import socketMap from './socketMap';
import store from '../store';
import * as actionTypes from '../store/actions/actionTypes';

let socket = null;

export const initSocket = () => {
  const newSocket = io(baseURL, {
    query: { token: axios.defaults.headers.common['x-auth-token'] }
  });

  newSocket.on('connect_error', error => {
    if (error.message === 'Unauthorized' || error.message === 'join error') {
      newSocket.close();
    }
  });

  newSocket.on('disconnect', reason => {
    if (reason === 'io server disconnect') {
      newSocket.connect();
    }
  });

  newSocket.on('note error', notif => {
    store.dispatch({ type: actionTypes.ADD_NOTIF, notif });
    // remove notification after 4 sec
    setTimeout(() => {
      store.dispatch({ type: actionTypes.DELETE_NOTIF, msgID: notif.msgID });
    }, 4500);
  });

  for (let action in socketMap) {
    newSocket.on(action, payload => {
      store.dispatch({ type: socketMap[action], payload });
    });
  }

  newSocket.connect();

  socket = newSocket;

  return new Promise((res, rej) => {
    const rejListener = () => rej();
    newSocket.once('connect_error', rejListener);

    newSocket.once('connect', () => {
      newSocket.off('connect_error', rejListener);
      res();
    });
  });
};

export const sendUpdate = (...args) => {
  if (!socket) { return; }
  socket.emit(...args);
  return socket;
};

export const closeSocket = () => {
  if (!socket) { return; }
  socket.close();
};
