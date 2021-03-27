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
  currentNoteID: null,
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
    case actionTypes.SHOW_NOTE: return { ...state, currentNoteID: action.noteID };
    case actionTypes.SET_SHOW_TRASH: return setShowTrash(state, action);
    case actionTypes.LOGOUT: return initialState;
    default: return state;
  }
};

const login = (state, { payload: { notes, pinnedNotes }}) => {
  const notesByID = {};
  const notesAllIDs = [];
  const trashByID = {};
  const trashAllIDs = [];

  for (let note of notes) {
    const { _id: noteID, isTrash, ...rest } = note;
    const newNote = { noteID, ...rest };
    if (isTrash) {
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
    pinnedNotes,
    currentNoteID: notesAllIDs[0] || null
  };
};

const createNote = (state, { payload: { note } }) => {
  const newNote = {
    noteID: note._id,
    body: note.body,
    isPublished: false,
    collaborators: note.collaborators,
    tags: [],
    nanoID: ''
  };
  return {
    ...state,
    notes: {
      byID: {
        ...state.notes.byID,
        [note._id]: newNote
      },
      allIDs: [
        note._id,
        ...state.notes.allIDs
      ]
    },
    currentNoteID: note._id
  };
};

const updateNote = (state, { payload: { noteID, body } }) => ({
  ...state,
  notes: noteID in state.notes.byID ?
    {
      byID: {
        ...state.notes.byID,
        [noteID]: {
          ...state.notes.byID[noteID],
          body
        }
      },
      allIDs: state.notes.allIDs
    }
    :
    state.notes
  ,
  trash: noteID in state.trash.byID ?
    {
      byID: {
        ...state.trash.byID,
        [noteID]: {
          ...state.trash.byID[noteID],
          body
        }
      },
      allIDs: state.trash.allIDs
    }
    :
    state.trash
});

const trashNote = (state, { payload: { noteID } }) => {
  const notesByID = { ...state.notes.byID };
  const note = { ...notesByID[noteID] };
  delete notesByID[noteID];

  const notesAllIDs = state.notes.allIDs.filter(id => id !== noteID);

  return {
    ...state,
    notes: {
      byID: notesByID,
      allIDs: notesAllIDs
    },
    trash: {
      byID: {
        ...state.trash.byID,
        [noteID]: note
      },
      allIDs: [noteID, ...state.trash.allIDs]
    },
    currentNoteID: (!state.currentNoteID && state.trashShown) ? noteID : state.currentNoteID !== noteID ? state.currentNoteID : notesAllIDs[0] || null
  }
};

const setShowTrash = (state, action) => {
  if (action.bool === state.trashShown) { return state; }
  return {
    ...state,
    trashShown: action.bool,
    currentNoteID: (action.bool ? state.trash.allIDs[0] : state.notes.allIDs[0]) || null
  };
};

const restoreNote = (state, { payload: { noteID } }) => {
  const trashByID = { ...state.trash.byID };
  const note = { ...trashByID[noteID] };
  const trashAllIDs = state.trash.allIDs.filter(id => id !== noteID);
  delete trashByID[noteID];

  return {
    ...state,
    trash: {
      byID: trashByID,
      allIDs: trashAllIDs
    },
    notes: {
      byID: {
        ...state.notes.byID,
        [noteID]: note
      },
      allIDs: [noteID, ...state.notes.allIDs]
    },
    currentNoteID: (!state.currentNoteID && !state.trashShown) ? noteID : state.currentNoteID !== noteID ? state.currentNoteID : trashAllIDs[0] || null
  };
};

const deleteNote = (state, { payload: { noteID } }) => {
  const trashByID = { ...state.trash.byID };
  delete trashByID[noteID];
  const trashAllIDs = state.trash.allIDs.filter(id => id !== noteID);

  return {
    ...state,
    trash: {
      byID: trashByID,
      allIDs: trashAllIDs
    },
    currentNoteID: state.currentNoteID !== noteID ? state.currentNoteID : trashAllIDs[0] || null
  };
};

export default reducer;
