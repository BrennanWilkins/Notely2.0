import io from 'socket.io-client';
import { instance as axios, baseURL } from '../axios';
import socketMap from './socketMap';
import store from '../store';
import { addNotif, connectErrNotif, disconnectNotif, reconnectNotif,
  refreshNotes } from '../store/actions';

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

    newSocket.once('connect', () => {
      const noteID = store.getState().notes.currentNoteID;
      if (noteID) {
        // if currently viewing note then need to rejoin editor room
        newSocket.emit('join editor', noteID);
      }

      // on reconnect query notes to prevent any note sync errors
      newSocket.emit('get/user/notes', res => {
        if (res.error || !res.notes) { return; }
        store.dispatch(reconnectNotif());
        store.dispatch(refreshNotes(res.notes));
      });
    });
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
