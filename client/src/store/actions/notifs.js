import * as actionTypes from './actionTypes';

export const addNotif = notif => ({ type: actionTypes.ADD_NOTIF, notif });

export const deleteNotif = msgID => ({ type: actionTypes.DELETE_NOTIF, msgID });
