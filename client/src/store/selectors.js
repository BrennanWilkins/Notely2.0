export const selectIsCollab = state => (
  !state.notes.currentNoteID ? false :
  state.notes.notesByID[state.notes.currentNoteID].collaborators.length > 1
);

export const selectNoteIsPinned = (state, noteID) => (
  (!noteID || state.notes.trashShown) ? false :
  state.notes.pinnedNotes.includes(noteID)
);

export const selectCurrCollabs = state => (
  state.notes.currentNoteID ?
  state.notes.notesByID[state.notes.currentNoteID].collaborators
  : []
);

export const selectCurrTags = state => (
  state.notes.currentNoteID ?
  state.notes.notesByID[state.notes.currentNoteID].tags
  : []
);

export const selectCurrBody = state => (
  state.notes.currentNoteID ?
  state.notes.notesByID[state.notes.currentNoteID].body
  : []
);

export const selectCurrUpdatedAt = state => (
  state.notes.notesByID[state.notes.currentNoteID].updatedAt
);

export const selectPublishID = state => (
  state.notes.currentNoteID ?
  state.notes.notesByID[state.notes.currentNoteID].publishID
  : null
);

export const selectUserIsOwner = state => (
  state.notes.currentNoteID ?
  state.notes.notesByID[state.notes.currentNoteID].collaborators[0]
  === state.user.username
  : false
);
