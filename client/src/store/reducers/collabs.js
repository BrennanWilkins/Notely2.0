import * as actionTypes from '../actions/actionTypes';

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGOUT: return initialState;
    case actionTypes.LOGIN: return login(state, action);
    case actionTypes.ACCEPT_INVITE: return acceptInvite(state, action);
    case actionTypes.ADD_COLLABORATOR: return addCollaborator(state, action);
    case actionTypes.SET_CONNECTED_USERS: return setConnectedUsers(state, action);
    case actionTypes.SET_ACTIVE_USERS: return setActiveUsers(state, action);
    case actionTypes.SET_USER_ONLINE: return setUserOnline(state, action);
    case actionTypes.SET_USER_OFFLINE: return setUserOffline(state, action);
    case actionTypes.SET_USER_ACTIVE: return setUserActive(state, action);
    case actionTypes.SET_USER_INACTIVE: return setUserInactive(state, action);
    default: return state;
  }
};

const addCollabsHelper = (collabs, note) => {
  const { collaborators } = note;
  collaborators.forEach(user => {
    if (!collabs[user.username]) {
      collabs[user.username] = {
        ...user,
        color: null,
        isActive: false,
        isOnline: false
      };
    }
  });
};

const login = (state, { payload: { notes } }) => {
  const collabs = {};

  for (let note of notes) {
    addCollabsHelper(collabs, note);
  }

  return collabs;
};

const acceptInvite = (state, { payload: { note } }) => {
  const collabs = { ...state };
  addCollabsHelper(collabs, note);
  return collabs;
};

const addCollaborator = (state, { payload: { email, username } }) => {
  return state[username] ? state : {
    ...state,
    [username]: {
      username,
      email,
      color: null,
      isActive: false,
      isOnline: false
    }
  };
};

const setConnectedUsers = (state, { payload: users }) => {
  if (!users) { return state; }
  const collabs = { ...state };

  for (let username in collabs) {
    const color = users[username];
    const user = collabs[username];
    if (!color || user.isOnline) { continue; }
    collabs[username] = {
      ...user,
      isOnline: true,
      color
    };
  }

  return collabs;
};

const setActiveUsers = (state, { payload: users }) => {
  if (!users) { return state; }
  const collabs = { ...state };

  for (let username in collabs) {
    const color = users[username];
    const user = collabs[username];

    collabs[username] = (
      color ? { ...user, isActive: true, isOnline: true, color } :
      user.isActive ? { ...user, isActive: false } :
      user
    );
  }

  return collabs;
};

const setUserOnline = (state, { payload: { username, color } }) => {
  const user = state[username];
  if (!user || user.isOnline) { return state; }

  return {
    ...state,
    [username]: {
      ...user,
      isOnline: true,
      color
    }
  };
};

const setUserOffline = (state, { payload: { username } }) => {
  const user = state[username];
  if (!user || !user.isOnline) { return state; }

  return {
    ...state,
    [username]: {
      ...user,
      isOnline: false,
      color: null,
      isActive: false
    }
  };
};

const setUserActive = (state, { payload: { username, color } }) => {
  const user = state[username];
  if (!user || user.isActive) { return state; }

  return {
    ...state,
    [username]: {
      ...user,
      color,
      isActive: true,
      isOnline: true
    }
  };
};

const setUserInactive = (state, { payload: { username, color } }) => {
  const user = state[username];
  if (!user || !user.isActive) { return state; }

  return {
    ...state,
    [username]: {
      ...user,
      color,
      isActive: false
    }
  };
};

export default reducer;
