import * as actionTypes from '../actions/actionTypes';

const initialState = {
  isAuth: false,
  isAutoLoggingIn: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTO_LOGIN_IS_LOADING: return { ...state, isAutoLoggingIn: true };
    case actionTypes.LOGIN: return { ...state, isAuth: true, isAutoLoggingIn: false };
    case actionTypes.LOGOUT: return initialState;
    default: return state;
  }
};

export default reducer;
