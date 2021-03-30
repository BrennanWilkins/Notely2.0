import * as actionTypes from '../actions/actionTypes';

const initialState = {
  sideNavShown: window.innerWidth > 900,
  isFullscreen: false,
  listShown: true,
  sortType: localStorage['sortType'] || 'Modified Newest'
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_SIDE_NAV: return { ...state, sideNavShown: !state.sideNavShown };
    case actionTypes.TOGGLE_FULLSCREEN: return { ...state, isFullscreen: !state.isFullscreen };
    case actionTypes.SET_LIST_SHOWN: return { ...state, listShown: action.bool };
    case actionTypes.SHOW_NOTE: return window.innerWidth <= 750 ? { ...state, listShown: false } : state;
    case actionTypes.SET_SORT_TYPE: return setSortType(state, action);
    case actionTypes.LOGOUT: localStorage.removeItem('sortType'); return initialState;
    default: return state;
  }
};

const setSortType = (state, action) => {
  if (state.sortType === action.sortType) { return state; }
  localStorage['sortType'] = action.sortType;
  return { ...state, sortType: action.sortType };
};

export default reducer;
