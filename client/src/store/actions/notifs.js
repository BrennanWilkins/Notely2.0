import * as actionTypes from './actionTypes';

export const addNotif = notif => dispatch => {
  dispatch({ type: actionTypes.ADD_NOTIF, notif });
  if (notif.msgID !== 'disconnect') {
    // remove notif after 4 sec
    setTimeout(() => {
      dispatch(deleteNotif(notif.msgID));
    }, 4500);
  }
};

export const deleteNotif = msgID => ({ type: actionTypes.DELETE_NOTIF, msgID });

export const connectErrNotif = () => dispatch => {
  dispatch(addNotif({
    msg: 'There was an error connecting to the server.',
    msgID: 'connect'
  }));
};

export const disconnectNotif = () => dispatch => {
  dispatch(addNotif({
    msg: 'Connection to server lost. Attempting to reestablish...',
    msgID: 'disconnect'
  }));
};

export const reconnectNotif = () => dispatch => {
  dispatch(deleteNotif('disconnect'));
  dispatch(addNotif({
    msg: 'Server connection was reestablished.',
    msgID: 'reconnect'
  }));
};
