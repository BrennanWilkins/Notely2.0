import * as actionTypes from './actionTypes';
import { sendUpdate } from '../../socket';

export const createNote = () => dispatch => {
  // wait for response w new note
  sendUpdate('post/note', payload => {
    dispatch({ type: actionTypes.CREATE_NOTE, payload });
  });
};

export const updateNote = (noteID, body) => {
  const payload = { noteID, body };
  sendUpdate('put/note', payload);
  return { type: actionTypes.UPDATE_NOTE, payload };
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

export const pinNote = noteID => {
  sendUpdate('put/note/pin', { noteID });
  return { type: actionTypes.PIN_NOTE, payload: { noteID } };
};

export const unpinNote = noteID => {
  sendUpdate('put/note/unpin', { noteID });
  return { type: actionTypes.UNPIN_NOTE, payload: { noteID } };
};

export const createTag = (noteID, tag) => {
  if (tag.length > 100) { return; }
  const payload = { noteID, tag };
  sendUpdate('post/note/tag', payload);
  return { type: actionTypes.CREATE_TAG, payload };
};

export const removeTag = (noteID, tag) => {
  const payload = { noteID, tag };
  sendUpdate('delete/note/tag', payload);
  return { type: actionTypes.REMOVE_TAG, payload };
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

export const rejectInvite = noteID => {
  sendUpdate('put/note/invite/reject', { noteID });
  return { type: actionTypes.REJECT_INVITE, payload: { noteID } };
};

export const setSearchQuery = query => ({ type: actionTypes.SET_SEARCH_QUERY, query });

export const publishNote = payload => ({ type: actionTypes.PUBLISH_NOTE, payload });

export const unpublishNote = noteID => {
  const payload = { noteID };
  sendUpdate('put/note/unpublish', payload);
  return { type: actionTypes.UNPUBLISH_NOTE, payload };
};

export const emptyTrash = () => {
  sendUpdate('put/user/emptyTrash');
  return { type: actionTypes.EMPTY_TRASH };
};

export const refreshNotes = notes => ({ type: actionTypes.REFRESH_NOTES, notes });

export const copyNote = () => (dispatch, getState) => {
  const noteID = getState().notes.currentNoteID;

  sendUpdate('post/note/copy', { noteID }, payload => {
    dispatch({ type: actionTypes.COPY_NOTE, payload });
  });
};

export const removeCollab = payload => ({ type: actionTypes.REMOVE_COLLABORATOR, payload });
