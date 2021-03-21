import * as actionTypes from '../actions/actionTypes';

const initialState = {
  sideNavShown: true
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_SIDE_NAV: return { ...state, sideNavShown: !state.sideNavShown };
    case actionTypes.LOGOUT: return initialState;
    default: return state;
  }
};

export default reducer;
