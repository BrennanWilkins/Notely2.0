import * as actionTypes from '../actions/actionTypes';
import { serializeToText } from '../../utils/slateHelpers';

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
  searchQuery: ''
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
    default: return state;
  }
};

const login = (state, { payload: { notes, pinnedNotes }}) => {
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

  return {
    ...state,
    notesByID,
    trashIDs,
    noteIDs,
    pinnedNotes,
    currentNoteID: noteIDs[0] || null,
    allTags: [...new Set(allTags)],
    collabsByName
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
  return {
    ...state,
    noteIDs: [note._id, ...state.noteIDs],
    notesByID: { [note._id]: newNote, ...state.notesByID },
    currentNoteID: note._id,
    changesSaved: true,
    shownTag: null,
    filteredNoteIDs: state.filteredNoteIDs.length ? [] : state.filteredNoteIDs,
    searchQuery: '',
    trashShown: false
  };
};

const updateNote = (state, { payload: { noteID, body } }) => ({
  ...state,
  notesByID: {
    ...state.notesByID,
    [noteID]: {
      ...state.notesByID[noteID],
      body,
      updatedAt: String(new Date())
    }
  }
});

const trashNote = (state, { payload: { noteID } }) => {
  const noteIDs = state.noteIDs.filter(id => id !== noteID);
  const filteredNoteIDs = (state.shownTag && state.filteredNoteIDs.includes(noteID)) ?
    state.filteredNoteIDs.filter(id => id !== noteID) :
    state.filteredNoteIDs;

  const currentNoteID = (
    (state.currentNoteID && state.currentNoteID !== noteID) ? state.currentNoteID :
    (state.trashShown && !state.currentNoteID) ? noteID :
    (state.shownTag && filteredNoteIDs.length && state.currentNoteID === noteID) ? filteredNoteIDs[0] :
    noteIDs[0] || null
  );

  return {
    ...state,
    notesByID: {
      ...state.notesByID,
      [noteID]: {
        ...state.notesByID[noteID],
        updatedAt: String(new Date())
      }
    },
    noteIDs,
    trashIDs: [noteID, ...state.trashIDs],
    currentNoteID,
    changesSaved: currentNoteID !== state.currentNoteID ? true : state.changesSaved,
    filteredNoteIDs,
    shownTag: (state.shownTag && filteredNoteIDs.length) ? state.shownTag : null
  };
};

const setShowTrash = (state, action) => {
  if (action.bool === state.trashShown && !state.shownTag) { return state; }
  return {
    ...state,
    trashShown: action.bool,
    currentNoteID: (action.bool ? state.trashIDs[0] : state.noteIDs[0]) || null,
    changesSaved: true,
    shownTag: null,
    filteredNoteIDs: state.filteredNoteIDs.length ? [] : state.filteredNoteIDs,
    searchQuery: ''
  };
};

const restoreNote = (state, { payload: { noteID } }) => {
  const trashIDs = state.trashIDs.filter(id => id !== noteID);

  const hasCurrTag = state.shownTag && state.notesByID[noteID].tags.includes(state.shownTag);

  const currentNoteID = (
    (state.currentNoteID && state.currentNoteID !== noteID) ? state.currentNoteID :
    (!state.currentNoteID && !state.trashShown && !state.shownTag) ? noteID :
    (!state.currentNoteID && state.shownTag && hasCurrTag) ? noteID :
    trashIDs[0] || null
  );

  return {
    ...state,
    trashIDs,
    noteIDs: [noteID, ...state.noteIDs],
    notesByID: {
      ...state.notesByID,
      [noteID]: {
        ...state.notesByID[noteID],
        updatedAt: String(new Date())
      }
    },
    currentNoteID,
    changesSaved: currentNoteID !== state.currentNoteID ? true : state.changesSaved,
    filteredNoteIDs: hasCurrTag ? [noteID, ...state.filteredNoteIDs] : state.filteredNoteIDs
  };
};

const deleteNote = (state, { payload: { noteID } }) => {
  const notesByID = { ...state.notesByID };
  delete notesByID[noteID];
  const trashIDs = state.trashIDs.filter(id => id !== noteID);
  const currentNoteID = (
    state.currentNoteID !== noteID ? state.currentNoteID :
    trashIDs[0] || null
  );

  return {
    ...state,
    trashIDs,
    pinnedNotes:
      state.pinnedNotes.includes(noteID) ?
      state.pinnedNotes.filter(id => id !== noteID) :
      state.pinnedNotes,
    currentNoteID,
    changesSaved: currentNoteID !== state.currentNoteID ? true : state.changesSaved
  };
};

const pinNote = (state, { noteID }) => ({
  ...state,
  pinnedNotes: [noteID, ...state.pinnedNotes]
});

const unpinNote = (state, { noteID }) => ({
  ...state,
  pinnedNotes: state.pinnedNotes.filter(id => id !== noteID)
});

const setStatus = (state, { bool }) => {
  return state.changesSaved === bool ? state : { ...state, changesSaved: bool };
};

const createTag = (state, { payload: { noteID, tag } }) => {
  if (state.notesByID[noteID].tags.includes(tag)) { return state; }
  return {
    ...state,
    notesByID: {
      ...state.notesByID,
      [noteID]: {
        ...state.notesByID[noteID],
        updatedAt: String(new Date()),
        tags: [...state.notesByID[noteID].tags, tag]
      }
    },
    allTags: state.allTags.includes(tag) ? state.allTags : [tag, ...state.allTags]
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

  const shouldKeepTag = state.noteIDs.find(id => notesByID[id].tags.includes(tag))
  || state.trashIDs.find(id => notesByID[id].tags.includes(tag));

  return {
    ...state,
    notesByID,
    allTags: shouldKeepTag ? state.allTags : state.allTags.filter(t => t !== tag),
    shownTag: state.shownTag === tag ? null : state.shownTag
  };
};

const showNote = (state, { noteID }) => {
  if (state.currentNoteID === noteID) { return state; }
  return {
    ...state,
    currentNoteID: noteID
  };
};

const showNotesByTag = (state, { tag }) => {
  if (tag === state.shownTag) { return state; }

  const filteredNoteIDs = state.noteIDs.filter(id => state.notesByID[id].tags.includes(tag));
  return {
    ...state,
    filteredNoteIDs,
    shownTag: tag,
    trashShown: false,
    currentNoteID: filteredNoteIDs[0] || null
  };
};

const acceptInvite = (state, { note }) => {
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

  const hasCurrTag = state.shownTag && newNote.tags.includes(state.shownTag);

  return {
    ...state,
    notesByID: {
      ...state.notesByID,
      [noteID]: newNote
    },
    noteIDs: [noteID, ...state.noteIDs],
    allTags,
    currentNoteID: (!state.noteIDs.length && !state.trashShown) ? noteID : state.currentNoteID,
    filteredNoteIDs: hasCurrTag ? [noteID, ...state.filteredNoteIDs] : state.filteredNoteIDs,
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

  if (!query) {
    return {
      ...state,
      searchQuery: '',
      currentNoteID: (
        state.shownTag ? state.filteredNoteIDs[0] :
        state.trashShown ? state.trashIDs[0] :
        state.noteIDs[0]
      ) || null
    };
  }

  let filteredNoteIDs = (
    state.shownTag ? state.filteredNoteIDs :
    state.trashShown ? state.trashIDs
    : state.noteIDs
  );

  filteredNoteIDs = filteredNoteIDs.filter(id => (
    serializeToText(state.notesByID[id].body).includes(query)
  ));

  return {
    ...state,
    searchQuery: query,
    currentNoteID: filteredNoteIDs[0] || null
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
    changesSaved: true
  };
};

export default reducer;
