import io from 'socket.io-client';
import { instance as axios, baseURL } from './axios';

let socket = null;

export const initSocket = () => {
  if (socket) { return; }
  const newSocket = io(baseURL, {
    query: { token: axios.defaults.headers.common['x-auth-token'] }
  });

  newSocket.on('connect_error', error => {
    if (error.message === 'Unauthorized') {
      newSocket.close();
    }
  });

  newSocket.on('joined', data => {
    console.log('joined:', data);
  });

  newSocket.on('disconnect', reason => {
    if (reason === 'io server disconnect') {
      newSocket.connect();
    }
  });

  socket = newSocket;
};

export const joinNote = noteID => {
  if (!socket) { return; }
  socket.emit('join', noteID);
};

export const sendUpdate = (type, data) => {
  if (!socket) { return; }
  socket.emit(type, JSON.stringify(data));
  return socket;
};

export const connectSocket = () => {
  if (!socket) { return; }
  socket.connect();
};

export const closeSocket = () => {
  if (!socket) { return; }
  socket.close();
};
