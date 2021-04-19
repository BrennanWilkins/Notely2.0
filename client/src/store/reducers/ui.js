import * as actionTypes from '../actions/actionTypes';
import { marginValues, fontValues } from '../../utils/displayOptions';

const initialState = {
  sideNavShown: window.innerWidth > 900,
  isFullscreen: false,
  listShown: true,
  sortType: localStorage['sortType'] || 'Modified Newest',
  darkMode: localStorage['theme'] === 'dark' ? true : false,
  noteMargin: localStorage['margin'] || 'Normal',
  noteFontSize: localStorage['fontSize'] || 'Normal',
  noteListDisplay: localStorage['listDisplay'] || 'Normal'
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN: return login(state);
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

const login = state => {
  if (state.darkMode) {
    document.body.classList.add('dark');
  }
  document.documentElement.style.setProperty('--noteFontSize', fontValues[state.noteFontSize]);
  return state;
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
  localStorage.removeItem('sortType');
  localStorage.removeItem('theme');
  localStorage.removeItem('margin');
  localStorage.removeItem('fontSize');
  localStorage.removeItem('listDisplay');
  document.body.classList.remove('dark');
  document.documentElement.style.setProperty('--noteFontSize', '16px');
  return initialState;
};

const setNoteMargins = (state, { size }) => {
  if (size === state.noteMargin) { return; }
  localStorage['margin'] = size;
  return {
    ...state,
    noteMargin: size
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
