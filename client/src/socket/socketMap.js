import * as actionTypes from '../store/actions/actionTypes';

const socketMap = {
  'put/note' : actionTypes.UPDATE_NOTE,
  'put/note/trash' : actionTypes.TRASH_NOTE,
  'put/note/restore' : actionTypes.RESTORE_NOTE,
  'delete/note' : actionTypes.DELETE_NOTE
};

export default socketMap;
