import * as actionTypes from './actionTypes';

export const toggleSideNav = () => ({ type: actionTypes.TOGGLE_SIDE_NAV });

export const toggleFullscreen = () => ({ type: actionTypes.TOGGLE_FULLSCREEN });

export const setListShown = bool => ({ type: actionTypes.SET_LIST_SHOWN, bool });

export const setSortType = sortType => ({ type: actionTypes.SET_SORT_TYPE, sortType });
