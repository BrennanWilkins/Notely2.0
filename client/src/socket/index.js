import io from 'socket.io-client';
import { instance as axios, baseURL } from '../axios';
import socketMap from './socketMap';
import store from '../store';
import { addNotif, connectErrNotif, disconnectNotif, reconnectNotif } from '../store/actions';

let socket = null;

export const initSocket = () => {
  const newSocket = io(baseURL, {
    query: { token: axios.defaults.headers.common['x-auth-token'] }
  });

  newSocket.on('connect_error', error => {
    if (error.message === 'Unauthorized' || error.message === 'join error') {
      newSocket.close();
      store.dispatch(connectErrNotif());
    }
  });

  newSocket.on('disconnect', () => {
    store.dispatch(disconnectNotif());
    newSocket.once('connect', () => store.dispatch(reconnectNotif()));
  });

  newSocket.on('note error', notif => store.dispatch(addNotif(notif)));

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
