import * as actionTypes from './actionTypes';
import { sendUpdate } from '../../socket';

export const createNote = () => dispatch => {
  const socket = sendUpdate('post/note');

  // when creating note wait for response w new note
  socket.on('post/note', data => {
    socket.off('post/note');
    const payload = { note: JSON.parse(data) };
    dispatch({ type: actionTypes.CREATE_NOTE, payload });
  });
};

export const updateNote = (noteID, body) => dispatch => {
  const payload = { noteID, body };
  sendUpdate('put/note', payload);
  dispatch({ type: actionTypes.UPDATE_NOTE, payload });
};

export const trashNote = () => (dispatch, getState) => {
  const payload = { noteID: getState().notes.currentNoteID };
  sendUpdate('put/note/trash', payload);
  dispatch({ type: actionTypes.TRASH_NOTE, payload });
};

export const restoreNote = () => (dispatch, getState) => {
  const payload = { noteID: getState().notes.currentNoteID };
  sendUpdate('put/note/restore', payload);
  dispatch({ type: actionTypes.RESTORE_NOTE, payload });
};

export const deleteNote = () => (dispatch, getState) => {
  const payload = { noteID: getState().notes.currentNoteID };
  sendUpdate('delete/note', payload);
  dispatch({ type: actionTypes.DELETE_NOTE, payload });
};

export const showNote = noteID => ({ type: actionTypes.SHOW_NOTE, noteID });

export const setShowTrash = bool => ({ type: actionTypes.SET_SHOW_TRASH, bool });

export const pinNote = noteID => dispatch => {
  sendUpdate('put/note/pin', { noteID });
  dispatch({ type: actionTypes.PIN_NOTE, noteID });
};

export const unpinNote = noteID => dispatch => {
  sendUpdate('put/note/unpin', { noteID });
  dispatch({ type: actionTypes.UNPIN_NOTE, noteID });
};

export const setStatus = bool => ({ type: actionTypes.SET_STATUS, bool });

export const createTag = (noteID, tag) => dispatch => {
  const payload = { noteID, tag };
  dispatch({ type: actionTypes.CREATE_TAG, payload });
};

export const removeTag = (noteID, tag) => dispatch => {
  const payload = { noteID, tag };
  dispatch({ type: actionTypes.REMOVE_TAG, payload });
};
