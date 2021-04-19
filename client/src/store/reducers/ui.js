import * as actionTypes from '../actions/actionTypes';
import { marginValues, fontValues } from '../../utils/displayOptions';

const initialState = {
  sideNavShown: window.innerWidth > 900,
  isFullscreen: false,
  listShown: true,
  sortType: 'Modified Newest',
  darkMode: false,
  noteMargins: 'Normal',
  noteFontSize: 'Normal',
  noteListDisplay: 'Normal'
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN: return login(state, action);
    case actionTypes.TOGGLE_SIDE_NAV: return { ...state, sideNavShown: !state.sideNavShown };
    case actionTypes.TOGGLE_FULLSCREEN: return { ...state, isFullscreen: !state.isFullscreen };
    case actionTypes.SET_LIST_SHOWN: return { ...state, listShown: action.bool };
    case actionTypes.SHOW_NOTE: return showNote(state);
    case actionTypes.SET_SORT_TYPE: return setSortType(state, action);
    case actionTypes.TOGGLE_DARK_MODE: return toggleDarkMode(state);
    case actionTypes.LOGOUT: return logout();
    case actionTypes.SET_NOTE_MARGINS: return setNoteMargins(state, action);
    case actionTypes.SET_NOTE_FONT_SIZE: return setNoteFontSize(state, action);
    case actionTypes.SET_NOTE_LIST_DISPLAY: return setNoteListDisplay(state, action);
    default: return state;
  }
};

const login = (state, { payload: { email } }) => {
  const prevUser = localStorage['email'];
  if (!prevUser || prevUser !== email) {
    localStorage['email'] = email;
  }

  // if different user logging in then remove previous user's settings
  if (prevUser && prevUser !== email) {
    localStorage.removeItem('sortType');
    localStorage.removeItem('theme');
    localStorage.removeItem('margin');
    localStorage.removeItem('fontSize');
    localStorage.removeItem('listDisplay');
    return state;
  }

  const newState = {
    ...state,
    sortType: localStorage['sortType'] || 'Modified Newest',
    darkMode: localStorage['theme'] === 'dark' ? true : false,
    noteMargins: localStorage['margin'] || 'Normal',
    noteFontSize: localStorage['fontSize'] || 'Normal',
    noteListDisplay: localStorage['listDisplay'] || 'Normal'
  };

  if (newState.darkMode) {
    document.body.classList.add('dark');
  }
  document.documentElement.style.setProperty('--noteFontSize', fontValues[newState.noteFontSize]);
  document.documentElement.style.setProperty('--noteMargins', marginValues[newState.noteMargins]);
  return newState;
};

const showNote = state => {
  return window.innerWidth <= 750 ?
  { ...state, listShown: false } :
  state;
};

const setSortType = (state, { sortType }) => {
  if (state.sortType === sortType) { return state; }
  localStorage['sortType'] = sortType;
  return { ...state, sortType };
};

const toggleDarkMode = state => {
  const darkMode = !state.darkMode;
  localStorage['theme'] = darkMode ? 'dark' : 'light';
  document.body.classList.toggle('dark');
  return { ...state, darkMode };
};

const logout = () => {
  document.body.classList.remove('dark');
  document.documentElement.style.setProperty('--noteFontSize', '16px');
  document.documentElement.style.setProperty('--noteMargins', '10px');
  return initialState;
};

const setNoteMargins = (state, { size }) => {
  if (size === state.noteMargins) { return; }
  localStorage['margin'] = size;
  document.documentElement.style.setProperty('--noteMargins', marginValues[size]);
  return {
    ...state,
    noteMargins: size
  };
};

const setNoteFontSize = (state, { size }) => {
  if (size === state.noteFontSize) { return; }
  localStorage['fontSize'] = size;
  document.documentElement.style.setProperty('--noteFontSize', fontValues[size]);
  return {
    ...state,
    noteFontSize: size
  };
};

const setNoteListDisplay = (state, { size }) => {
  if (size === state.noteListDisplay) { return; }
  localStorage['listDisplay'] = size;
  return {
    ...state,
    noteListDisplay: size
  };
};

export default reducer;
