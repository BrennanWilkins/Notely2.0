import * as actionTypes from '../actions/actionTypes';

const initialState = {
  notes: {
    byID: {},
    allIDs: []
  },
  trash: {
    byID: {},
    allIDs: []
  },
  pinnedNotes: [],
  currentNote: {
    noteID: null,
    body: [{ type: 'paragraph', children: [{ text: '' }]}]
  },
  trashShown: false
};

const reducer = (state  = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN: return login(state, action);
    case actionTypes.CREATE_NOTE: return createNote(state, action);
    case actionTypes.UPDATE_NOTE: return updateNote(state, action);
    case actionTypes.TRASH_NOTE: return trashNote(state, action);
    case actionTypes.RESTORE_NOTE: return restoreNote(state, action);
    case actionTypes.DELETE_NOTE: return deleteNote(state, action);
    case actionTypes.SHOW_NOTE: return showNote(state, action);
    case actionTypes.SET_SHOW_TRASH: return setShowTrash(state, action);
    default: return state;
  }
};

const login = (state, action) => {
  const notesByID = {};
  const notesAllIDs = [];
  const trashByID = {};
  const trashAllIDs = [];

  for (let note of action.payload.notes) {
    const { _id: noteID, ...rest } = note;
    const newNote = { noteID, ...rest };
    if (note.isTrash) {
      trashByID[noteID] = newNote;
      trashAllIDs.push(noteID);
    } else {
      notesByID[noteID] = newNote;
      notesAllIDs.push(noteID);
    }
  }

  return {
    ...state,
    notes: {
      byID: notesByID,
      allIDs: notesAllIDs
    },
    trash: {
      byID: trashByID,
      allIDs: trashAllIDs
    },
    pinnedNotes: action.payload.pinnedNotes,
    currentNote: notesAllIDs.length ?
      notesByID[notesAllIDs[0]] :
      state.currentNote
  };
};

const createNote = (state, action) => {
  const note = {
    noteID: action.payload.noteID,
    body: action.payload.body,
    isPublished: false,
    collaborators: [action.payload.username],
    tags: [],
    nanoID: ''
  };
  return {
    ...state,
    notes: {
      byID: {
        ...state.notes.byID,
        [action.payload.noteID]: note
      },
      allIDs: [
        action.payload.noteID,
        ...state.notes.allIDs
      ]
    },
    currentNote: note
  };
};

const updateNote = (state, action) => ({
  ...state,
  notes: action.payload.noteID in state.notes.byID ? {
    byID: {
      ...state.notes.byID,
      [action.payload.noteID]: {
        ...state.notes.byID[action.payload.noteID],
        body: action.payload.body
      }
    },
    allIDs: state.notes.allIDs
  } : state.notes,
  trash: action.payload.noteID in state.trash.byID ? {
    byID: {
      ...state.trash.byID,
      [action.payload.noteID]: {
        ...state.trash.byID[action.payload.noteID],
        body: action.payload.body
      }
    },
    allIDs: state.trash.allIDs
  } : state.trash,
  currentNote: action.payload.noteID === state.currentNote.noteID ?
    {
      ...state.currentNote,
      body: action.payload.body
    }
    : state.currentNote
});

const trashNote = (state, action) => {
  const notesByID = { ...state.notes.byID };
  const note = { ...notesByID[action.noteID] };
  delete notesByID[action.noteID];

  const notesAllIDs = state.notes.allIDs.filter(id => id !== action.noteID);

  return {
    ...state,
    notes: {
      byID: notesByID,
      allIDs: notesAllIDs
    },
    trash: {
      byID: {
        ...state.trash.byID,
        [action.noteID]: note
      },
      allIDs: [action.noteID, ...state.trash.allIDs]
    },
    currentNote: state.currentNote.noteID === action.noteID ?
      (state.trashShown ?
        note
        :
        notesAllIDs.length ? { ...notesByID[notesAllIDs[0]] } : { ...initialState.currentNote }
      )
      :
      state.currentNote
  }
};

const showNote = (state, action) => ({
  ...state,
  currentNote: state.trashShown ?
    { ...state.trash.byID[action.noteID] } :
    { ...state.notes.byID[action.noteID] }
});

const setShowTrash = (state, action) => {
  if (action.bool === state.trashShown) { return state; }
  return {
    ...state,
    trashShown: action.bool,
    currentNote: action.bool ?
      (!state.trash.allIDs.length ?
        { ...initialState.currentNote } :
        { ...state.trash.byID[state.trash.allIDs[0]] }
      )
      :
      (!state.notes.allIDs.length ?
        { ...initialState.currentNote } :
        { ...state.notes.byID[state.notes.allIDs[0]] })
  };
};

const restoreNote = (state, action) => {
  const trashByID = { ...state.trash.byID };
  const note = { ...trashByID[action.noteID] };
  const trashAllIDs = state.trash.allIDs.filter(id => id !== action.noteID);
  delete trashByID[action.noteID];

  return {
    ...state,
    trash: {
      byID: trashByID,
      allIDs: trashAllIDs
    },
    notes: {
      byID: {
        ...state.notes.byID,
        [action.noteID]: note
      },
      allIDs: [action.noteID, ...state.notes.allIDs]
    },
    currentNote: state.currentNote.noteID === action.noteID ?
      (trashAllIDs.length ? { ...trashByID[trashAllIDs[0]] } : { ...initialState.currentNote })
      :
      state.currentNote
  };
};

const deleteNote = (state, action) => {
  const trashByID = { ...state.trash.byID };
  delete trashByID[action.noteID];
  const trashAllIDs = state.trash.allIDs.filter(id => id !== action.noteID);

  return {
    ...state,
    trash: {
      byID: trashByID,
      allIDs: trashAllIDs
    },
    currentNote: state.currentNote.noteID === action.noteID ?
      (trashAllIDs.length ? { ...trashByID[trashAllIDs[0]] } : { ...initialState.currentNote })
      :
      state.currentNote
  };
};

export default reducer;
