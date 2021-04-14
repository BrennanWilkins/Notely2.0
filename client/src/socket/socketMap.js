import * as actionTypes from '../store/actions/actionTypes';

const socketMap = {
  'put/note' : actionTypes.UPDATE_NOTE,
  'put/note/trash' : actionTypes.TRASH_NOTE,
  'put/note/restore' : actionTypes.RESTORE_NOTE,
  'delete/note' : actionTypes.DELETE_NOTE,
  'post/note/tag': actionTypes.CREATE_TAG,
  'delete/note/tag': actionTypes.REMOVE_TAG,
  'new invite': actionTypes.ADD_NEW_INVITE,
  'post/note/collaborator': actionTypes.ADD_COLLABORATOR,
  'user online': actionTypes.SET_USER_ONLINE,
  'user offline': actionTypes.SET_USER_OFFLINE,
  'user active': actionTypes.SET_USER_ACTIVE,
  'user inactive': actionTypes.SET_USER_INACTIVE,
  'receive active users': actionTypes.SET_ACTIVE_USERS,
  'receive connected users': actionTypes.SET_CONNECTED_USERS,
  'put/note/publish': actionTypes.PUBLISH_NOTE,
  'put/note/unpublish': actionTypes.UNPUBLISH_NOTE
};

export default socketMap;
