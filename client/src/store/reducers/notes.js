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
  }
};

const reducer = (state  = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN: return login(state, action);
    case actionTypes.CREATE_NOTE: return createNote(state, action);
    case actionTypes.UPDATE_NOTE: return updateNote(state, action);
    case actionTypes.SHOW_NOTE: return showNote(state, action);
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
    currentNote: notesAllIDs.length ? notesByID[notesAllIDs[0]] : state.currentNote
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
  notes: {
    byID: {
      ...state.notes.byID,
      [action.payload.noteID]: {
        ...state.notes.byID[action.payload.noteID],
        body: action.payload.body
      }
    },
    allIDs: state.notes.allIDs
  },
  currentNote: {
    ...state.currentNote,
    body: action.payload.body
  }
});

const showNote = (state, action) => ({
  ...state,
  currentNote: { ...state.notes.byID[action.noteID] }
});

export default reducer;
