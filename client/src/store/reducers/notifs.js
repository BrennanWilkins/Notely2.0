import * as actionTypes from '../actions/actionTypes';

const reducer = (state = [], action) => {
  switch (action.type) {
    case actionTypes.ADD_NOTIF: return addNotif(state, action);
    case actionTypes.DELETE_NOTIF: return deleteNotif(state, action);
    case actionTypes.LOGOUT: return [];
    default: return state;
  }
};

const addNotif = (state, action) => [action.notif, ...state];

const deleteNotif = (state, { msgID }) => state.filter(n => n.msgID !== msgID);

export default reducer;
