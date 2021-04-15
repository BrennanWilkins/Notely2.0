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

  newSocket.on('note error', errMsg => {
    console.log(errMsg);
  });

  newSocket.on('put/note finished', () => {
    store.dispatch({ type: actionTypes.SET_STATUS, bool: true });
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
};

export const sendUpdate = (type, data) => {
  if (!socket) { return; }
  data ? socket.emit(type, data) : socket.emit(type);
  return socket;
};

export const closeSocket = () => {
  if (!socket) { return; }
  socket.close();
};

export const sendInvite = (noteID, username, errCB, successCB) => {
  const socket = sendUpdate('post/note/invite', { noteID, username });

  const removeListeners = () => {
    socket.off('error: post/note/invite');
    socket.off('success: post/note/invite');
  };

  socket.on('error: post/note/invite', errMsg => {
    removeListeners();
    errCB(errMsg);
  });

  socket.on('success: post/note/invite', () => {
    removeListeners();
    successCB();
  });
};
