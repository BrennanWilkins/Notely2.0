import * as actionTypes from '../actions/actionTypes';

const initialState = {
  sideNavShown: window.innerWidth > 900,
  isFullscreen: false,
  listShown: true,
  sortType: localStorage['sortType'] || 'Modified Newest',
  darkMode: localStorage['theme'] === 'dark' ? true : false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_SIDE_NAV: return { ...state, sideNavShown: !state.sideNavShown };
    case actionTypes.TOGGLE_FULLSCREEN: return { ...state, isFullscreen: !state.isFullscreen };
    case actionTypes.SET_LIST_SHOWN: return { ...state, listShown: action.bool };
    case actionTypes.SHOW_NOTE: return window.innerWidth <= 750 ? { ...state, listShown: false } : state;
    case actionTypes.SET_SORT_TYPE: return setSortType(state, action);
    case actionTypes.TOGGLE_DARK_MODE: return toggleDarkMode(state);
    case actionTypes.LOGOUT: return logout();
    default: return state;
  }
};

const setSortType = (state, { sortType }) => {
  if (state.sortType === sortType) { return state; }
  localStorage['sortType'] = sortType;
  return { ...state, sortType };
};

const toggleDarkMode = state => {
  localStorage['theme'] = state.darkMode ? 'light' : 'dark';
  return { ...state, darkMode: !state.darkMode };
};

const logout = () => {
  localStorage.removeItem('sortType');
  localStorage.removeItem('theme');
  return initialState;
};

export default reducer;
