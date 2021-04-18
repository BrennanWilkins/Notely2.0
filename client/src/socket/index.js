import io from 'socket.io-client';
import { instance as axios, baseURL } from '../axios';
import socketMap from './socketMap';
import store from '../store';

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

  for (let action in socketMap) {
    newSocket.on(action, payload => {
      store.dispatch({ type: socketMap[action], payload });
    });
  }

  // leave note room on collaborator deleting a note
  newSocket.on('delete/note', data => {
    const { noteID } = data;
    socket.emit('leave note', noteID);
  });

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

export const getSocket = () => socket;
