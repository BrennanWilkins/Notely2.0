import * as actionTypes from '../actions/actionTypes';

const initialState = {
  sideNavShown: window.innerWidth > 900,
  isFullscreen: false,
  listShown: true
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_SIDE_NAV: return { ...state, sideNavShown: !state.sideNavShown };
    case actionTypes.TOGGLE_FULLSCREEN: return { ...state, isFullscreen: !state.isFullscreen };
    case actionTypes.SET_LIST_SHOWN: return { ...state, listShown: action.bool };
    case actionTypes.SHOW_NOTE: return window.innerWidth <= 750 ? { ...state, listShown: false } : state;
    case actionTypes.LOGOUT: return initialState;
    default: return state;
  }
};

export default reducer;
