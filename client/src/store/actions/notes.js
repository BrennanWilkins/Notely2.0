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
};

export const updateNote = (noteID, body) => dispatch => {
  sendUpdate('put/note', { noteID, body });
  const payload = { noteID, body };
  dispatch({ type: actionTypes.UPDATE_NOTE, payload });
};

export const trashNote = () => (dispatch, getState) => {
  const noteID = getState().notes.currentNote.noteID;
  sendUpdate('put/note/trash', { noteID });
  dispatch({ type: actionTypes.TRASH_NOTE, noteID });
};

export const restoreNote = () => (dispatch, getState) => {
  const noteID = getState().notes.currentNote.noteID;
  sendUpdate('put/note/restore', { noteID });
  dispatch({ type: actionTypes.RESTORE_NOTE, noteID });
};

export const deleteNote = () => (dispatch, getState) => {
  const noteID = getState().notes.currentNote.noteID;
  sendUpdate('delete/note', { noteID });
  dispatch({ type: actionTypes.DELETE_NOTE, noteID });
};

export const showNote = noteID => ({ type: actionTypes.SHOW_NOTE, noteID });

export const setShowTrash = bool => ({ type: actionTypes.SET_SHOW_TRASH, bool });
