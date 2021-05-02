import * as actionTypes from '../actions/actionTypes';
import {
  filterAndSortNoteIDs,
  resortByPinned,
  resortByModified,
  resortBodyUpdate,
  shouldResortByModified,
  resortNotes
} from '../../utils/noteReducerHelpers';

const initialState = {
  notesByID: {},
  noteIDs: [],
  trashIDs: [],
  pinnedNotes: [],
  currentNoteID: null,
  trashShown: false,
  changesSaved: true,
  allTags: [],
  filteredNoteIDs: [],
  shownTag: null,
  collabsByName: {},
  searchQuery: '',
  sortType: 'Modified Newest',
};

const reducer = (state  = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGOUT: return initialState;
    case actionTypes.LOGIN: return login(state, action);
    case actionTypes.CREATE_NOTE: return createNote(state, action);
    case actionTypes.UPDATE_NOTE: return updateNote(state, action);
    case actionTypes.TRASH_NOTE: return trashNote(state, action);
    case actionTypes.RESTORE_NOTE: return restoreNote(state, action);
    case actionTypes.DELETE_NOTE: return deleteNote(state, action);
    case actionTypes.SHOW_NOTE: return showNote(state, action);
    case actionTypes.SET_SHOW_TRASH: return setShowTrash(state, action);
    case actionTypes.PIN_NOTE: return pinNote(state, action);
    case actionTypes.UNPIN_NOTE: return unpinNote(state, action);
    case actionTypes.SET_STATUS: return setStatus(state, action);
    case actionTypes.CREATE_TAG: return createTag(state, action);
    case actionTypes.REMOVE_TAG: return removeTag(state, action);
    case actionTypes.SHOW_NOTES_BY_TAG: return showNotesByTag(state, action);
    case actionTypes.ACCEPT_INVITE: return acceptInvite(state, action);
    case actionTypes.ADD_COLLABORATOR: return addCollaborator(state, action);
    case actionTypes.SET_CONNECTED_USERS: return setConnectedUsers(state, action);
    case actionTypes.SET_ACTIVE_USERS: return setActiveUsers(state, action);
    case actionTypes.SET_USER_ONLINE: return setUserOnline(state, action);
    case actionTypes.SET_USER_OFFLINE: return setUserOffline(state, action);
    case actionTypes.SET_USER_ACTIVE: return setUserActive(state, action);
    case actionTypes.SET_USER_INACTIVE: return setUserInactive(state, action);
    case actionTypes.SET_SEARCH_QUERY: return setSearchQuery(state, action);
    case actionTypes.PUBLISH_NOTE: return publishNote(state, action);
    case actionTypes.UNPUBLISH_NOTE: return unpublishNote(state, action);
    case actionTypes.EMPTY_TRASH: return emptyTrash(state, action);
    case actionTypes.REFRESH_NOTES: return refreshNotes(state, action);
    case actionTypes.SET_SORT_TYPE: return setSortType(state, action);
    default: return state;
  }
};

const login = (state, { payload: { notes, pinnedNotes, email }}) => {
  const notesByID = {};
  const noteIDs = [];
  const trashIDs = [];
  const allTags = [];
  const collabsByName = {};

  for (let note of notes) {
    const { _id: noteID, isTrash, __v, collaborators, ...rest } = note;
    const newNote = {
      ...rest,
      noteID,
      collaborators: collaborators.map(user => user.username)
    };
    if (isTrash) {
      trashIDs.push(noteID);
    } else {
      noteIDs.push(noteID);
    }
    note.tags.length && allTags.push(...note.tags);
    notesByID[noteID] = newNote;
    collaborators.forEach(user => {
      if (!collabsByName[user.username]) {
        collabsByName[user.username] = {
          ...user,
          color: null,
          isActive: false,
          isOnline: false
        };
      }
    });
  }

  const sortType = (
    localStorage['email'] === email ?
    localStorage['sortType'] :
    'Modified Newest'
  );

  const filteredNoteIDs = filterAndSortNoteIDs(
    noteIDs,
    notesByID,
    pinnedNotes,
    sortType
  );

  return {
    ...state,
    notesByID,
    trashIDs,
    noteIDs,
    pinnedNotes,
    currentNoteID: filteredNoteIDs[0] || null,
    allTags: [...new Set(allTags)],
    collabsByName,
    filteredNoteIDs,
    sortType
  };
};

const createNote = (state, { payload: { note, username } }) => {
  const newNote = {
    noteID: note._id,
    body: note.body,
    collaborators: [username],
    tags: [],
    publishID: null,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt
  };

  const noteIDs = [note._id, ...state.noteIDs];
  const notesByID = { [note._id]: newNote, ...state.notesByID };

  return {
    ...state,
    noteIDs,
    notesByID,
    currentNoteID: note._id,
    changesSaved: true,
    shownTag: null,
    filteredNoteIDs: filterAndSortNoteIDs(
      noteIDs,
      notesByID,
      state.pinnedNotes,
      state.sortType
    ),
    searchQuery: '',
    trashShown: false
  };
};

const updateNote = (state, { payload: { noteID, body } }) => {
  const notesByID = {
    ...state.notesByID,
    [noteID]: {
      ...state.notesByID[noteID],
      body,
      updatedAt: String(new Date())
    }
  };

  const filteredNoteIDs = resortBodyUpdate(
    noteID,
    state.filteredNoteIDs,
    state.trashShown ? state.trashIDs : state.noteIDs,
    notesByID,
    state.pinnedNotes,
    state.sortType,
    state.trashShown,
    state.searchQuery,
    state.shownTag
  );

  return {
    ...state,
    notesByID,
    filteredNoteIDs
  };
};

const trashNote = (state, { payload: { noteID } }) => {
  const noteIDs = state.noteIDs.filter(id => id !== noteID);
  const trashIDs = [noteID, ...state.trashIDs];

  const notesByID = {
    ...state.notesByID,
    [noteID]: {
      ...state.notesByID[noteID],
      updatedAt: String(new Date())
    }
  };

  const filteredNoteIDs = filterAndSortNoteIDs(
    state.trashShown ? trashIDs : noteIDs,
    notesByID,
    state.pinnedNotes,
    state.sortType,
    state.trashShown,
    state.searchQuery,
    state.shownTag
  );

  const currentNoteID = (
    (state.currentNoteID && state.currentNoteID !== noteID) ? state.currentNoteID :
    filteredNoteIDs[0]
  );

  return {
    ...state,
    notesByID,
    noteIDs,
    trashIDs,
    currentNoteID,
    changesSaved: currentNoteID !== state.currentNoteID ? true : state.changesSaved,
    filteredNoteIDs
  };
};

const setShowTrash = (state, { bool }) => {
  if (bool === state.trashShown && !state.shownTag) { return state; }

  const filteredNoteIDs = filterAndSortNoteIDs(
    bool ? state.trashIDs : state.noteIDs,
    state.notesByID,
    state.pinnedNotes,
    state.sortType,
    bool,
    '',
    null
  );

  return {
    ...state,
    trashShown: bool,
    currentNoteID: filteredNoteIDs[0] || null,
    changesSaved: true,
    shownTag: null,
    filteredNoteIDs,
    searchQuery: ''
  };
};

const restoreNote = (state, { payload: { noteID } }) => {
  const trashIDs = state.trashIDs.filter(id => id !== noteID);
  const noteIDs = [noteID, ...state.noteIDs];

  const notesByID = {
    ...state.notesByID,
    [noteID]: {
      ...state.notesByID[noteID],
      updatedAt: String(new Date())
    }
  };

  const filteredNoteIDs = filterAndSortNoteIDs(
    state.trashShown ? trashIDs : noteIDs,
    notesByID,
    state.pinnedNotes,
    state.sortType,
    state.trashShown,
    state.searchQuery,
    state.shownTag
  );

  const currentNoteID = (
    (state.currentNoteID && state.currentNoteID !== noteID) ? state.currentNoteID :
    filteredNoteIDs[0] || null
  );

  return {
    ...state,
    trashIDs,
    noteIDs,
    notesByID,
    currentNoteID,
    changesSaved: currentNoteID !== state.currentNoteID ? true : state.changesSaved,
    filteredNoteIDs
  };
};

const deleteNote = (state, { payload: { noteID } }) => {
  const notesByID = { ...state.notesByID };
  delete notesByID[noteID];
  const trashIDs = state.trashIDs.filter(id => id !== noteID);

  let filteredNoteIDs = state.filteredNoteIDs;
  if (state.trashShown) {
    filteredNoteIDs = filterAndSortNoteIDs(
      trashIDs,
      notesByID,
      state.pinnedNotes,
      state.sortType,
      state.trashShown,
      state.searchQuery,
      state.shownTag
    );
  }

  const currentNoteID = (
    state.currentNoteID !== noteID ? state.currentNoteID :
    filteredNoteIDs[0] || null
  );

  return {
    ...state,
    trashIDs,
    pinnedNotes:
      state.pinnedNotes.includes(noteID) ?
      state.pinnedNotes.filter(id => id !== noteID) :
      state.pinnedNotes,
    currentNoteID,
    filteredNoteIDs,
    changesSaved: currentNoteID !== state.currentNoteID ? true : state.changesSaved
  };
};

const pinNote = (state, { payload: { noteID } }) => {
  const pinnedNotes = [noteID, ...state.pinnedNotes];

  return {
    ...state,
    pinnedNotes,
    filteredNoteIDs: resortByPinned(
      state.filteredNoteIDs,
      state.trashShown,
      pinnedNotes,
      noteID
    )
  };
};

const unpinNote = (state, { payload: { noteID } }) => {
  const pinnedNotes = state.pinnedNotes.filter(id => id !== noteID);

  return {
    ...state,
    pinnedNotes,
    filteredNoteIDs: resortNotes(
      state.filteredNoteIDs,
      state.notesByID,
      pinnedNotes,
      state.sortType,
      state.trashShown
    )
  };
};

const setStatus = (state, { bool }) => {
  return state.changesSaved === bool ? state : { ...state, changesSaved: bool };
};

const createTag = (state, { payload: { noteID, tag } }) => {
  if (state.notesByID[noteID].tags.includes(tag)) { return state; }

  const notesByID = {
    ...state.notesByID,
    [noteID]: {
      ...state.notesByID[noteID],
      updatedAt: String(new Date()),
      tags: [...state.notesByID[noteID].tags, tag]
    }
  };

  let filteredNoteIDs = state.filteredNoteIDs;
  if (state.shownTag === tag) {
    filteredNoteIDs = filterAndSortNoteIDs(
      state.noteIDs,
      notesByID,
      state.pinnedNotes,
      state.sortType,
      state.trashShown,
      state.searchQuery,
      state.shownTag
    );
  } else if (shouldResortByModified(noteID, state.filteredNotes, state.sortType)) {
    filteredNoteIDs = resortByModified(
      notesByID,
      state.filteredNoteIDs,
      state.pinnedNotes,
      state.sortType,
      state.trashShown
    );
  }

  return {
    ...state,
    notesByID,
    allTags: state.allTags.includes(tag) ? state.allTags : [tag, ...state.allTags],
    filteredNoteIDs
  };
};

const removeTag = (state, { payload: { noteID, tag } }) => {
  const notesByID = {
    ...state.notesByID,
    [noteID]: {
      ...state.notesByID[noteID],
      updatedAt: String(new Date()),
      tags: state.notesByID[noteID].tags.filter(t => t !== tag)
    }
  };

  const shouldDelete = !state.noteIDs.find(id => notesByID[id].tags.includes(tag))
  && !state.trashIDs.find(id => notesByID[id].tags.includes(tag));

  const backToAll = state.shownTag === tag && shouldDelete;

  let filteredNoteIDs = state.filteredNoteIDs;
  if (backToAll) {
    filteredNoteIDs = filterAndSortNoteIDs(
      state.noteIDs,
      notesByID,
      state.pinnedNotes,
      state.sortType
    );
  } else if (state.shownTag === tag) {
    filteredNoteIDs = filterAndSortNoteIDs(
      state.noteIDs,
      notesByID,
      state.pinnedNotes,
      state.sortType,
      false,
      state.searchQuery,
      tag
    );
  } else if (shouldResortByModified(noteID, filteredNoteIDs, state.sortType)) {
    filteredNoteIDs = resortByModified(
      notesByID,
      filteredNoteIDs,
      state.pinnedNotes,
      state.sortType,
      state.trashShown
    );
  }

  return {
    ...state,
    notesByID,
    allTags: shouldDelete ? state.allTags.filter(t => t !== tag) : state.allTags,
    shownTag: backToAll ? null : state.shownTag,
    filteredNoteIDs,
    currentNoteID: (
      (state.shownTag === tag && state.currentNoteID === noteID) ?
      filteredNoteIDs[0] || null :
      state.currentNoteID
    ),
    searchQuery: backToAll ? '' : state.searchQuery
  };
};

const showNote = (state, { noteID }) => ({
  ...state,
  currentNoteID: noteID
});

const showNotesByTag = (state, { tag }) => {
  if (tag === state.shownTag) { return state; }

  const filteredNoteIDs = filterAndSortNoteIDs(
    state.noteIDs,
    state.notesByID,
    state.pinnedNotes,
    state.sortType,
    state.trashShown,
    state.searchQuery,
    tag
  );

  return {
    ...state,
    filteredNoteIDs,
    shownTag: tag,
    trashShown: false,
    currentNoteID: filteredNoteIDs[0] || null
  };
};

const acceptInvite = (state, { payload: { note } }) => {
  const { _id: noteID, isTrash, __v, collaborators, ...rest } = note;
  const newNote = {
    ...rest,
    noteID,
    collaborators: collaborators.map(user => user.username)
  };

  const collabsByName = { ...state.collabsByName };
  collaborators.forEach(user => {
    if (!collabsByName[user.username]) {
      collabsByName[user.username] = {
        ...user,
        color: null,
        isOnline: false,
        isActive: false
      };
    }
  });

  let allTags = state.allTags;
  if (newNote.tags.length) {
    allTags = [...new Set([...newNote.tags, state.allTags])];
  }

  const notesByID = {
    ...state.notesByID,
    [noteID]: newNote
  };

  const noteIDs = [noteID, ...state.noteIDs];

  let filteredNoteIDs = state.filteredNoteIDs;
  if (!state.trashShown && !state.shownTag) {
    filteredNoteIDs = filterAndSortNoteIDs(
      noteIDs,
      notesByID,
      state.pinnedNotes,
      state.sortType,
      state.trashShown,
      state.searchQuery,
      state.shownTag
    );
  }

  return {
    ...state,
    notesByID,
    noteIDs,
    allTags,
    currentNoteID: (
      (!state.currentNoteID && filteredNoteIDs.includes(noteID)) ? noteID :
      state.currentNoteID
    ),
    filteredNoteIDs,
    collabsByName
  };
};

const addCollaborator = (state, { payload: { noteID, email, username } }) => ({
  ...state,
  notesByID: {
    ...state.notesByID,
    [noteID]: {
      ...state.notesByID[noteID],
      collaborators: [...state.notesByID[noteID].collaborators, username]
    }
  },
  collabsByName:
    state.collabsByName[username] ?
    state.collabsByName :
    {
      ...state.collabsByName,
      [username]: {
        username,
        email,
        color: null,
        isActive: false,
        isOnline: false
      }
    }
});

const setConnectedUsers = (state, { payload: users }) => {
  if (!users) { return state; }
  const collabsByName = { ...state.collabsByName };
  for (let username in collabsByName) {
    const color = users[username];
    const user = collabsByName[username];
    collabsByName[username] = (color && !user.isOnline) ? { ...user, isOnline: true, color } : user;
  }

  return {
    ...state,
    collabsByName
  };
};

const setActiveUsers = (state, { payload: users }) => {
  if (!users) { return state; }
  const collabsByName = { ...state.collabsByName };
  for (let username in collabsByName) {
    const color = users[username];
    const user = collabsByName[username];
    collabsByName[username] = (
      color ? { ...user, isActive: true, isOnline: true, color } :
      (!color && user.isActive) ? { ...user, isActive: false } :
      user
    );
  }

  return {
    ...state,
    collabsByName
  };
};

const setUserOnline = (state, { payload: { username, color } }) => {
  const user = state.collabsByName[username];
  if (!user || user.isOnline) { return state; }
  return {
    ...state,
    collabsByName: {
      ...state.collabsByName,
      [username]: {
        ...user,
        isOnline: true,
        color
      }
    }
  };
};

const setUserOffline = (state, { payload: { username } }) => {
  const user = state.collabsByName[username];
  if (!user || !user.isOnline) { return state; }
  return {
    ...state,
    collabsByName: {
      ...state.collabsByName,
      [username]: {
        ...user,
        isOnline: false,
        color: null,
        isActive: false
      }
    }
  };
};

const setUserActive = (state, { payload: { username, color } }) => {
  const user = state.collabsByName[username];
  if (!user || user.isActive) { return state; }
  return {
    ...state,
    collabsByName: {
      ...state.collabsByName,
      [username]: {
        ...user,
        color,
        isActive: true,
        isOnline: true
      }
    }
  };
};

const setUserInactive = (state, { payload: { username, color } }) => {
  const user = state.collabsByName[username];
  if (!user || !user.isActive) { return state; }
  return {
    ...state,
    collabsByName: {
      ...state.collabsByName,
      [username]: {
        ...user,
        color,
        isActive: false
      }
    }
  };
};

const setSearchQuery = (state, { query }) => {
  if (query === state.searchQuery) { return state; }

  const filteredNoteIDs = filterAndSortNoteIDs(
    state.trashShown ? state.trashIDs : state.noteIDs,
    state.notesByID,
    state.pinnedNotes,
    state.sortType,
    state.trashShown,
    query,
    state.shownTag
  );

  return {
    ...state,
    searchQuery: query,
    currentNoteID: filteredNoteIDs[0] || null,
    filteredNoteIDs
  };
};

const publishNote = (state, { payload: { noteID, publishID } }) => ({
  ...state,
  notesByID: {
    ...state.notesByID,
    [noteID]: {
      ...state.notesByID[noteID],
      publishID
    }
  }
});

const unpublishNote = (state, { payload: { noteID } }) => ({
  ...state,
  notesByID: {
    ...state.notesByID,
    [noteID]: {
      ...state.notesByID[noteID],
      publishID: null
    }
  }
});

const emptyTrash = (state, action) => {
  if (!state.trashIDs.length) { return state; }

  const notesByID = { ...state.notesByID };
  state.trashIDs.forEach(noteID => {
    delete notesByID[noteID];
  });

  return {
    ...state,
    trashIDs: [],
    notesByID,
    currentNoteID: null,
    pinnedNotes: state.pinnedNotes.filter(noteID => !state.trashIDs.includes(noteID)),
    changesSaved: true,
    filteredNoteIDs: []
  };
};

const refreshNotes = (state, action) => {
  // check if note bodies are diff due to server disconnect
  const notesByID = { ...state.notesByID };
  let isDiff = false;
  for (let note of action.notes) {
    let n = notesByID[note._id];
    if (note.updatedAt !== n.updatedAt) {
      isDiff = true;
      notesByID[note._id] = { ...n, body: note.body };
    }
  }

  if (!isDiff) { return state; }

  const filteredNoteIDs = filterAndSortNoteIDs(
    state.trashShown ? state.trashIDs : state.noteIDs,
    notesByID,
    state.pinnedNotes,
    state.sortType,
    state.trashShown,
    state.searchQuery,
    state.shownTag
  );

  const currentNoteID = (
    filteredNoteIDs.includes(state.currentNoteID) ? state.currentNoteID :
    filteredNoteIDs[0] || null
  );

  return {
    ...state,
    notesByID,
    filteredNoteIDs,
    currentNoteID
  };
};

const setSortType = (state, { sortType }) => {
  if (state.sortType === sortType) { return state; }

  localStorage['sortType'] = sortType;

  const filteredNoteIDs = resortNotes(
    state.filteredNoteIDs,
    state.notesByID,
    state.pinnedNotes,
    sortType,
    state.trashShown
  );

  return {
    ...state,
    sortType,
    filteredNoteIDs
  };
};

export default reducer;
