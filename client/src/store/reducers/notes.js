import * as actionTypes from '../actions/actionTypes';
import sortNoteIDs from '../../utils/sortNoteIDs';
import { isReverseType, isModSort, isCreateSort } from '../../utils/sortTypes';

const initialState = {
  notesByID: {},
  noteIDs: [],
  trashIDs: [],
  pinnedNotes: [],
  currentNoteID: null,
  trashShown: false,
  allTags: [],
  filteredNoteIDs: [],
  shownTag: null,
  searchQuery: '',
  sortType: 'Modified Newest',
};

const reducer = (state  = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGOUT: return initialState;
    case actionTypes.LOGIN: return login(state, action);
    case actionTypes.CREATE_NOTE: return createNote(state, action);
    case actionTypes.UPDATE_NOTE: return updateNoteBody(state, action);
    case actionTypes.TRASH_NOTE: return trashNote(state, action);
    case actionTypes.RESTORE_NOTE: return restoreNote(state, action);
    case actionTypes.DELETE_NOTE: return deleteNote(state, action);
    case actionTypes.SHOW_NOTE: return showNote(state, action);
    case actionTypes.SET_SHOW_TRASH: return setShowTrash(state, action);
    case actionTypes.PIN_NOTE: return pinNote(state, action);
    case actionTypes.UNPIN_NOTE: return unpinNote(state, action);
    case actionTypes.CREATE_TAG: return createTag(state, action);
    case actionTypes.REMOVE_TAG: return removeTag(state, action);
    case actionTypes.SHOW_NOTES_BY_TAG: return showNotesByTag(state, action);
    case actionTypes.ACCEPT_INVITE: return acceptInvite(state, action);
    case actionTypes.ADD_COLLABORATOR: return addCollaborator(state, action);
    case actionTypes.SET_SEARCH_QUERY: return setSearchQuery(state, action);
    case actionTypes.PUBLISH_NOTE: return publishNote(state, action);
    case actionTypes.UNPUBLISH_NOTE: return unpublishNote(state, action);
    case actionTypes.EMPTY_TRASH: return emptyTrash(state, action);
    case actionTypes.REFRESH_NOTES: return refreshNotes(state, action);
    case actionTypes.SET_SORT_TYPE: return setSortType(state, action);
    case actionTypes.COPY_NOTE: return copyNote(state, action);
    case actionTypes.REMOVE_COLLABORATOR: return removeCollaborator(state, action);
    case actionTypes.REMOVE_SELF_FROM_NOTE: return removeSelfFromNote(state, action);
    default: return state;
  }
};

const login = (state, { payload: { notes, pinnedNotes, email }}) => {
  const notesByID = {};
  const noteIDs = [];
  const trashIDs = [];
  const allTags = [];

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
  }

  const sortType = (
    localStorage['email'] === email ?
    (localStorage['sortType'] || 'Modified Newest') :
    'Modified Newest'
  );

  const filteredNoteIDs = sortNoteIDs(
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
    filteredNoteIDs,
    sortType,
    currentNoteID: filteredNoteIDs[0] || null,
    allTags: [...new Set(allTags)],
  };
};

const createNoteHelper = (state, note, username) => {
  const newNote = {
    noteID: note._id,
    body: note.body,
    collaborators: [username],
    tags: note.tags,
    publishID: null,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt
  };

  const noteIDs = [note._id, ...state.noteIDs];
  const notesByID = { [note._id]: newNote, ...state.notesByID };

  return { noteIDs, notesByID };
};

const createNote = (state, { payload: { note, username } }) => {
  const { noteIDs, notesByID } = createNoteHelper(state, note, username);

  return {
    ...state,
    noteIDs,
    notesByID,
    currentNoteID: note._id,
    shownTag: null,
    filteredNoteIDs: sortNoteIDs(
      noteIDs,
      notesByID,
      state.pinnedNotes,
      state.sortType
    ),
    searchQuery: '',
    trashShown: false
  };
};

const updateNoteBody = (state, { payload: { noteID, body } }) => {
  const notesByID = {
    ...state.notesByID,
    [noteID]: {
      ...state.notesByID[noteID],
      body,
      updatedAt: Date.now()
    }
  };

  let filteredNoteIDs;
  let currIDs = state.trashShown ? state.trashIDs : state.noteIDs;
  if (
      !currIDs.includes(noteID)
      || (state.shownTag && !notesByID[noteID].tags.includes(state.shownTag))
      || (!state.searchQuery && isCreateSort(state.sortType))
  ) {
    // no need to resort if note not present/not searching/sorting by created
    filteredNoteIDs = state.filteredNoteIDs;
  } else if (!state.searchQuery && isModSort(state.sortType)) {
    // if not searching & sorting modified then resort wo doing search/tag checks
    filteredNoteIDs = sortNoteIDs(
      state.filteredNoteIDs,
      notesByID,
      state.pinnedNotes,
      state.sortType,
      state.trashShown
    );
  } else {
    filteredNoteIDs = sortNoteIDs(
      currIDs,
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
      updatedAt: Date.now()
    }
  };

  // if showing note then remove else resort notes
  const filteredNoteIDs = (
    state.filteredNoteIDs.includes(noteID) ?
    state.filteredNoteIDs.filter(id => id !== noteID) :
    filteredNoteIDs = sortNoteIDs(
      state.trashShown ? trashIDs : noteIDs,
      notesByID,
      state.pinnedNotes,
      state.sortType,
      state.trashShown,
      state.searchQuery,
      state.shownTag
    )
  );

  return {
    ...state,
    notesByID,
    noteIDs,
    trashIDs,
    filteredNoteIDs,
    currentNoteID: (
      (state.currentNoteID && state.currentNoteID !== noteID) ?
      state.currentNoteID :
      filteredNoteIDs[0]
    ),
  };
};

const setShowTrash = (state, { bool }) => {
  if (bool === state.trashShown && !state.shownTag) { return state; }

  const filteredNoteIDs = sortNoteIDs(
    bool ? state.trashIDs : state.noteIDs,
    state.notesByID,
    state.pinnedNotes,
    state.sortType,
    bool
  );

  return {
    ...state,
    trashShown: bool,
    currentNoteID: filteredNoteIDs[0] || null,
    shownTag: null,
    searchQuery: '',
    filteredNoteIDs,
  };
};

const restoreNote = (state, { payload: { noteID } }) => {
  const noteIDs = [noteID, ...state.noteIDs];

  const notesByID = {
    ...state.notesByID,
    [noteID]: {
      ...state.notesByID[noteID],
      updatedAt: Date.now()
    }
  };

  const filteredNoteIDs = (
    state.trashShown ?
    state.filteredNoteIDs.filter(id => id !== noteID) :
    (state.shownTag && !notesByID[noteID].tags.includes(state.shownTag)) ?
    state.filteredNoteIDs :
    sortNoteIDs(
      noteIDs,
      notesByID,
      state.pinnedNotes,
      state.sortType,
      state.trashShown,
      state.searchQuery,
      state.shownTag
    )
  );

  return {
    ...state,
    noteIDs,
    notesByID,
    filteredNoteIDs,
    trashIDs: state.trashIDs.filter(id => id !== noteID),
    currentNoteID: (
      (state.currentNoteID && state.currentNoteID !== noteID) ?
      state.currentNoteID :
      filteredNoteIDs[0] || null
    ),
  };
};

const deleteNote = (state, { payload: { noteID } }) => {
  const notesByID = { ...state.notesByID };
  delete notesByID[noteID];

  const filteredNoteIDs = (
    state.filteredNoteIDs.includes(noteID) ?
    state.filteredNoteIDs.filter(id => id !== noteID) :
    state.filteredNoteIDs
  );

  return {
    ...state,
    filteredNoteIDs,
    trashIDs: state.trashIDs.filter(id => id !== noteID),
    pinnedNotes: (
      state.pinnedNotes.includes(noteID) ?
      state.pinnedNotes.filter(id => id !== noteID) :
      state.pinnedNotes
    ),
    currentNoteID: (
      state.currentNoteID !== noteID ?
      state.currentNoteID :
      filteredNoteIDs[0] || null
    ),
  };
};

const pinNote = (state, { payload: { noteID } }) => {
  const pinnedNotes = [noteID, ...state.pinnedNotes];

  return {
    ...state,
    pinnedNotes,
    filteredNoteIDs: (
      (state.trashShown || !state.filteredNoteIDs.includes(noteID)) ?
      state.filteredNoteIDs :
      sortNoteIDs(
        state.filteredNoteIDs,
        state.notesByID,
        pinnedNotes
      )
    )
  };
};

const unpinNote = (state, { payload: { noteID } }) => {
  const pinnedNotes = state.pinnedNotes.filter(id => id !== noteID);

  return {
    ...state,
    pinnedNotes,
    filteredNoteIDs: (
      (state.trashShown || !state.filteredNoteIDs.includes(noteID)) ?
      state.filteredNoteIDs :
      sortNoteIDs(
        state.filteredNoteIDs,
        state.notesByID,
        pinnedNotes,
        state.sortType,
        state.trashShown,
        state.searchQuery,
        state.shownTag
      )
    )
  };
};

const createTag = (state, { payload: { noteID, tag } }) => {
  if (state.notesByID[noteID].tags.includes(tag)) { return state; }

  const notesByID = {
    ...state.notesByID,
    [noteID]: {
      ...state.notesByID[noteID],
      updatedAt: Date.now(),
      tags: [...state.notesByID[noteID].tags, tag]
    }
  };

  return {
    ...state,
    notesByID,
    filteredNoteIDs: (
      (state.shownTag && notesByID[noteID].tags.includes(state.shownTag)) ?
      sortNoteIDs(
        state.trashShown ? state.trashIDs : state.noteIDs,
        notesByID,
        state.pinnedNotes,
        state.sortType,
        state.trashShown,
        state.searchQuery,
        state.shownTag
      ) :
      (state.filteredNoteIDs.includes(noteID) && isModSort(state.sortType)) ?
      sortNoteIDs(
        state.filteredNoteIDs,
        notesByID,
        state.pinnedNotes,
        state.trashShown
      ) :
      state.filteredNoteIDs
    ),
    allTags: (
      state.allTags.includes(tag) ?
      state.allTags :
      [tag, ...state.allTags]
    ),
  };
};

const removeTag = (state, { payload: { noteID, tag } }) => {
  const notesByID = {
    ...state.notesByID,
    [noteID]: {
      ...state.notesByID[noteID],
      updatedAt: Date.now(),
      tags: state.notesByID[noteID].tags.filter(t => t !== tag)
    }
  };

  const shouldDelete = !state.noteIDs.find(id => notesByID[id].tags.includes(tag))
  && !state.trashIDs.find(id => notesByID[id].tags.includes(tag));

  // tag deleted so should go back to all notes
  const backToAll = state.shownTag === tag && shouldDelete;

  let filteredNoteIDs = state.filteredNoteIDs;
  if (backToAll) {
    filteredNoteIDs = sortNoteIDs(
      state.noteIDs,
      notesByID,
      state.pinnedNotes,
      state.sortType
    );
  } else if (state.shownTag === tag) {
    filteredNoteIDs = state.filteredNoteIDs.filter(id => id !== noteID);
  } else if (state.filteredNoteIDs.includes(noteID) && isModSort(state.sortType)) {
    filteredNoteIDs = sortNoteIDs(
      state.filteredNoteIDs,
      notesByID,
      state.pinnedNotes,
      state.sortType,
      state.trashShown
    );
  }

  return {
    ...state,
    notesByID,
    filteredNoteIDs,
    allTags: shouldDelete ? state.allTags.filter(t => t !== tag) : state.allTags,
    shownTag: backToAll ? null : state.shownTag,
    currentNoteID: (
      (state.shownTag === tag && state.currentNoteID === noteID) ?
      filteredNoteIDs[0] || null :
      state.currentNoteID
    ),
    searchQuery: backToAll ? '' : state.searchQuery
  };
};

const showNote = (state, { noteID }) => {
  return state.currentNoteID === noteID ? state
  : { ...state, currentNoteID: noteID };
};

const showNotesByTag = (state, { tag }) => {
  if (tag === state.shownTag) { return state; }

  const filteredNoteIDs = sortNoteIDs(
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

  const notesByID = {
    ...state.notesByID,
    [noteID]: newNote
  };

  const noteIDs = [noteID, ...state.noteIDs];

  const filteredNoteIDs = (
    (state.trashShown || (state.shownTag && !newNote.tags.includes(state.shownTag))) ?
    state.filteredNoteIDs :
    sortNoteIDs(
      noteIDs,
      notesByID,
      state.pinnedNotes,
      state.sortType,
      state.trashShown,
      state.searchQuery,
      state.shownTag
    )
  );

  return {
    ...state,
    notesByID,
    noteIDs,
    filteredNoteIDs,
    allTags: (
      newNote.tags.length ?
      [...new Set([...newNote.tags, state.allTags])] :
      state.allTags
    ),
    currentNoteID: (
      (!state.currentNoteID && filteredNoteIDs.includes(noteID)) ? noteID :
      state.currentNoteID
    ),
  };
};

const addCollaborator = (state, { payload: { noteID, email, username } }) => {
  const notesByID = {
    ...state.notesByID,
    [noteID]: {
      ...state.notesByID[noteID],
      collaborators: [...state.notesByID[noteID].collaborators, username],
      updatedAt: Date.now()
    }
  };

  return {
    ...state,
    notesByID,
    filteredNoteIDs: (
      (state.filteredNoteIDs.includes(noteID) && isModSort(state.sortType)) ?
      sortNoteIDs(
        state.filteredNoteIDs,
        notesByID,
        state.pinnedNotes,
        state.sortType,
        state.trashShown
      ) :
      state.filteredNoteIDs
    ),
  };
};

const setSearchQuery = (state, { query }) => {
  if (query === state.searchQuery) { return state; }

  const filteredNoteIDs = sortNoteIDs(
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
    filteredNoteIDs,
    searchQuery: query,
    currentNoteID: filteredNoteIDs[0] || null,
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
    notesByID,
    trashIDs: [],
    currentNoteID: null,
    pinnedNotes: state.pinnedNotes.filter(id => !state.trashIDs.includes(id)),
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

  const filteredNoteIDs = sortNoteIDs(
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
    filteredNoteIDs,
    currentNoteID: (
      filteredNoteIDs.includes(state.currentNoteID) ? state.currentNoteID :
      filteredNoteIDs[0] || null
    )
  };
};

const setSortType = (state, { sortType }) => {
  if (state.sortType === sortType) { return state; }

  localStorage['sortType'] = sortType;

  return {
    ...state,
    sortType,
    filteredNoteIDs: (
      isReverseType(state.sortType, sortType) ?
      [...state.filteredNoteIDs].reverse() :
      sortNoteIDs(
        state.filteredNoteIDs,
        state.notesByID,
        state.pinnedNotes,
        sortType,
        state.trashShown
      )
    )
  };
};

const copyNote = (state, { payload: { note, username } }) => {
  const { noteIDs, notesByID } = createNoteHelper(state, note, username);

  const filteredNoteIDs = (
    (state.trashShown || (state.shownTag && !note.tags.includes(state.shownTag))) ?
    state.filteredNoteIDs :
    sortNoteIDs(
      noteIDs,
      notesByID,
      state.pinnedNotes,
      state.sortType,
      state.trashShown,
      state.searchQuery,
      state.shownTag
    )
  );

  return {
    ...state,
    noteIDs,
    notesByID,
    filteredNoteIDs,
    currentNoteID: (
      (!state.currentNoteID && filteredNoteIDs.includes(note._id)) ?
      note._id :
      state.currentNoteID
    ),
  };
};

const removeCollaborator = (state, { payload: { noteID, username } }) => {
  const notesByID = {
    ...state.notesByID,
    [noteID]: {
      ...state.notesByID[noteID],
      collaborators: state.notesByID[noteID].collaborators.filter(u => u !== username),
      updatedAt: Date.now()
    }
  };

  const filteredNoteIDs = (
    (state.filteredNoteIDs.includes(noteID) && isModSort(state.sortType)) ?
    sortNoteIDs(
      state.filteredNoteIDs,
      notesByID,
      state.pinnedNotes,
      state.sortType,
      state.trashShown
    ) :
    state.filteredNoteIDs
  );

  return {
    ...state,
    notesByID,
    filteredNoteIDs
  };
};

const removeSelfFromNote = (state, { payload: { noteID } }) => {
  const isTrash = state.trashIDs.includes(noteID);

  const notesByID = { ...state.notesByID };
  delete notesByID[noteID];

  const filteredNoteIDs = (
    !state.filteredNoteIDs.includes(noteID) ?
    state.filteredNoteIDs :
    state.filteredNoteIDs.filter(id => id !== noteID)
  );

  return {
    ...state,
    notesByID,
    filteredNoteIDs,
    noteIDs: (
      !isTrash ?
      state.noteIDs.filter(id => id !== noteID) :
      state.noteIDs
    ),
    trashIDs: (
      isTrash ?
      state.trashIDs.filter(id => id !== noteID) :
      state.trashIDs
    ),
    pinnedNotes: (
      state.pinnedNotes.includes(noteID) ?
      state.pinnedNotes.filter(id => id !== noteID) :
      state.pinnedNotes
    ),
    currentNoteID: (
      state.currentNoteID !== noteID ? state.currentNoteID :
      filteredNoteIDs[0] || null
    ),
  };
};

export default reducer;
