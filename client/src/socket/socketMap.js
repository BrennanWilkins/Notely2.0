import * as actionTypes from '../store/actions/actionTypes';

const socketMap = {
  'put/note' : actionTypes.UPDATE_NOTE,
  'put/note/trash' : actionTypes.TRASH_NOTE,
  'put/note/restore' : actionTypes.RESTORE_NOTE,
  'delete/note' : actionTypes.DELETE_NOTE,
  'post/note/tag': actionTypes.CREATE_TAG,
  'delete/note/tag': actionTypes.REMOVE_TAG,
  'new invite': actionTypes.ADD_NEW_INVITE,
  'post/note/collaborator': actionTypes.ADD_COLLABORATOR
};

export default socketMap;
