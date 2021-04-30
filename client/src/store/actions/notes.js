import * as actionTypes from './actionTypes';
import { sendUpdate } from '../../socket';

export const createNote = () => dispatch => {
  // wait for response w new note
  sendUpdate('post/note', payload => {
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

export const showNote = noteID => (dispatch, getState) => {
  if (getState().ui.isFullscreen) { return; }
  dispatch({ type: actionTypes.SHOW_NOTE, noteID });
};

export const setShowTrash = bool => ({ type: actionTypes.SET_SHOW_TRASH, bool });

export const pinNote = noteID => dispatch => {
  sendUpdate('put/note/pin', { noteID });
  dispatch({ type: actionTypes.PIN_NOTE, payload: { noteID } });
};

export const unpinNote = noteID => dispatch => {
  sendUpdate('put/note/unpin', { noteID });
  dispatch({ type: actionTypes.UNPIN_NOTE, payload: { noteID } });
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
  sendUpdate('put/note/invite/accept', { noteID }, res => {
    if (res.error) {
      return dispatch({ type: actionTypes.REJECT_INVITE, noteID });
    }
    dispatch({ type: actionTypes.ACCEPT_INVITE, payload: { note: res.note } });
  });
};

export const rejectInvite = noteID => dispatch => {
  sendUpdate('put/note/invite/reject', { noteID });
  dispatch({ type: actionTypes.REJECT_INVITE, payload: { noteID } });
};

export const setSearchQuery = query => ({ type: actionTypes.SET_SEARCH_QUERY, query });

export const publishNote = payload => ({ type: actionTypes.PUBLISH_NOTE, payload });

export const unpublishNote = noteID => dispatch => {
  const payload = { noteID };
  sendUpdate('put/note/unpublish', payload);
  dispatch({ type: actionTypes.UNPUBLISH_NOTE, payload });
};

export const emptyTrash = () => dispatch => {
  sendUpdate('put/user/emptyTrash');
  dispatch({ type: actionTypes.EMPTY_TRASH });
};

export const refreshNotes = notes => ({ type: actionTypes.REFRESH_NOTES, notes });
