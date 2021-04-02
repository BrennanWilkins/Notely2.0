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
    default: return state;
  }
};

const login = (state, action) => ({
  ...state,
  username: action.payload.username,
  email: action.payload.email,
  invites: action.payload.invites
});

const addNewInvite = (state, action) => ({
  ...state,
  invites: [action.payload, ...state.invites]
});

export default reducer;
