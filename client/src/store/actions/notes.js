import * as actionTypes from './actionTypes';
import { sendUpdate } from '../../socket';

export const createNote = () => (dispatch, getState) => {
  const username = getState().user.username;
  // initial body is empty paragraph
  const body = [{ type: 'paragraph', children: [{ text: '' }]}];
  const socket = sendUpdate('post/note', { body });

  socket.on('post/note', noteID => {
    socket.off('post/note');
    const payload = { noteID, body, username };
    dispatch({ type: actionTypes.CREATE_NOTE, payload });
  });

  socket.on('error: post/note', () => {
    socket.off('error: post/note');
    console.log('note not created');
  });
};

export const updateNote = (noteID, body) => dispatch => {
  const socket = sendUpdate('put/note', { noteID, body });
  const payload = { noteID, body };
  dispatch({ type: actionTypes.UPDATE_NOTE, payload });

  socket.on('error: put/note', () => {
    socket.off('error: put/note');
    console.log('note not updated');
  });
};

export const showNote = noteID => ({ type: actionTypes.SHOW_NOTE, noteID });

export const setShowTrash = bool => ({ type: actionTypes.SET_SHOW_TRASH, bool });
