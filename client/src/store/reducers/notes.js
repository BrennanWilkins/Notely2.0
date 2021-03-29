import * as actionTypes from '../actions/actionTypes';

const initialState = {
  notesByID: {},
  noteIDs: [],
  trashIDs: [],
  pinnedNotes: [],
  currentNoteID: null,
  trashShown: false,
  changesSaved: true
};

const reducer = (state  = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN: return login(state, action);
    case actionTypes.CREATE_NOTE: return createNote(state, action);
    case actionTypes.UPDATE_NOTE: return updateNote(state, action);
    case actionTypes.TRASH_NOTE: return trashNote(state, action);
    case actionTypes.RESTORE_NOTE: return restoreNote(state, action);
    case actionTypes.DELETE_NOTE: return deleteNote(state, action);
    case actionTypes.SHOW_NOTE: return { ...state, currentNoteID: action.noteID };
    case actionTypes.SET_SHOW_TRASH: return setShowTrash(state, action);
    case actionTypes.PIN_NOTE: return pinNote(state, action);
    case actionTypes.UNPIN_NOTE: return unpinNote(state, action);
    case actionTypes.SET_STATUS: return setStatus(state, action);
    case actionTypes.LOGOUT: return initialState;
    default: return state;
  }
};

const login = (state, { payload: { notes, pinnedNotes }}) => {
  const notesByID = {};
  const noteIDs = [];
  const trashIDs = [];

  for (let note of notes) {
    const { _id: noteID, isTrash, __v, ...rest } = note;
    const newNote = { noteID, ...rest };
    if (isTrash) {
      trashIDs.push(noteID);
    } else {
      noteIDs.push(noteID);
    }
    notesByID[noteID] = newNote;
  }

  return {
    ...state,
    notesByID,
    trashIDs,
    noteIDs,
    pinnedNotes,
    currentNoteID: noteIDs[0] || null
  };
};

const createNote = (state, { payload: { note } }) => {
  const newNote = {
    noteID: note._id,
    body: note.body,
    isPublished: false,
    collaborators: note.collaborators,
    tags: [],
    nanoID: '',
    createdAt: note.createdAt,
    updatedAt: note.updatedAt
  };
  return {
    ...state,
    noteIDs: [note._id, ...state.noteIDs],
    notesByID: { [note._id]: newNote, ...state.notesByID },
    currentNoteID: note._id,
    changesSaved: true
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
  const currentNoteID = (
    (!state.currentNoteID && state.trashShown) ? noteID :
    state.currentNoteID !== noteID ? state.currentNoteID :
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
    changesSaved: currentNoteID !== state.currentNoteID ? true : state.changesSaved
  };
};

const setShowTrash = (state, action) => {
  if (action.bool === state.trashShown) { return state; }
  return {
    ...state,
    trashShown: action.bool,
    currentNoteID: (action.bool ? state.trashIDs[0] : state.noteIDs[0]) || null,
    changesSaved: true
  };
};

const restoreNote = (state, { payload: { noteID } }) => {
  const trashIDs = state.trashIDs.filter(id => id !== noteID);
  const currentNoteID = (
    (!state.currentNoteID && !state.trashShown) ? noteID :
    state.currentNoteID !== noteID ? state.currentNoteID :
    trashIDs[0] || null
  );

  return {
    ...state,
    trashIDs,
    noteIDs: [noteID, ...state.noteIDs],
    notesByID: {
      ...state.notesByID,
      [noteID]: { ...state.notesByID[noteID], updatedAt: String(new Date()) }
    },
    currentNoteID,
    changesSaved: currentNoteID !== state.currentNoteID ? true : state.changesSaved
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

export default reducer;
