import * as actionTypes from './actionTypes';

export const toggleSideNav = () => ({ type: actionTypes.TOGGLE_SIDE_NAV });

export const toggleFullscreen = () => ({ type: actionTypes.TOGGLE_FULLSCREEN });

export const setListShown = bool => ({ type: actionTypes.SET_LIST_SHOWN, bool });

export const setSortType = sortType => ({ type: actionTypes.SET_SORT_TYPE, sortType });

export const toggleDarkMode = () => ({ type: actionTypes.TOGGLE_DARK_MODE });

export const setNoteMargins = size => ({ type: actionTypes.SET_NOTE_MARGINS, size });

export const setNoteFontSize = size => ({ type: actionTypes.SET_NOTE_FONT_SIZE, size });

export const setNoteListDisplay = size => ({ type: actionTypes.SET_NOTE_LIST_DISPLAY, size });
