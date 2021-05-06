import * as actionTypes from '../actions/actionTypes';

const initialState = {
  username: '',
  email: '',
  invites: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN: return login(state, action);
    case actionTypes.LOGOUT: return initialState;
    case actionTypes.ADD_NEW_INVITE: return addNewInvite(state, action);
    case actionTypes.REJECT_INVITE: return removeInvite(state, action.payload.noteID);
    case actionTypes.ACCEPT_INVITE: return removeInvite(state, action.payload.note._id);
    default: return state;
  }
};

const login = (state, { payload }) => ({
  ...state,
  username: payload.username,
  email: payload.email,
  invites: payload.invites
});

const addNewInvite = (state, action) => ({
  ...state,
  invites: [action.payload, ...state.invites]
});

const removeInvite = (state, noteID) => ({
  ...state,
  invites: state.invites.filter(invite => invite.noteID !== noteID)
});

export default reducer;
