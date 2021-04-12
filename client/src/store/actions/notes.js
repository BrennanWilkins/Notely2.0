import * as actionTypes from './actionTypes';
import { sendUpdate } from '../../socket';

export const createNote = () => (dispatch, getState) => {
  const socket = sendUpdate('post/note');

  // when creating note wait for response w new note
  socket.on('post/note', note => {
    socket.off('post/note');
    const payload = { note, username: getState().user.username };
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
  if (tag.length > 100) { return; }
  const payload = { noteID, tag };
  sendUpdate('post/note/tag', payload);
  dispatch({ type: actionTypes.CREATE_TAG, payload });
};

export const removeTag = (noteID, tag) => dispatch => {
  const payload = { noteID, tag };
  sendUpdate('delete/note/tag', payload);
  dispatch({ type: actionTypes.REMOVE_TAG, payload });
};

export const showNotesByTag = tag => ({ type: actionTypes.SHOW_NOTES_BY_TAG, tag });

export const acceptInvite = noteID => dispatch => {
  const socket = sendUpdate('put/note/invite/accept', { noteID });

  const removeListeners = () => {
    socket.off('error: put/note/invite/accept');
    socket.off('success: put/note/invite/accept');
  };

  socket.on('error: put/note/invite/accept', () => {
    removeListeners();
    dispatch({ type: actionTypes.REJECT_INVITE, noteID });
  });

  socket.on('success: put/note/invite/accept', note => {
    removeListeners();
    dispatch({ type: actionTypes.ACCEPT_INVITE, note });
  });
};

export const rejectInvite = noteID => dispatch => {
  sendUpdate('put/note/invite/reject', { noteID });
  dispatch({ type: actionTypes.REJECT_INVITE, noteID });
};

export const setSearchQuery = query => ({ type: actionTypes.SET_SEARCH_QUERY, query });
