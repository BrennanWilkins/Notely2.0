import * as actionTypes from '../actions/actionTypes';

const initialState = {
  username: '',
  email: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN: return login(state, action);
    case actionTypes.LOGOUT: return initialState;
    default: return state;
  }
};

const login = (state, action) => ({
  ...state,
  username: action.payload.username,
  email: action.payload.email
});

export default reducer;
