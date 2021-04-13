export const selectIsCollab = state => (
  !state.notes.currentNoteID ? false :
  state.notes.notesByID[state.notes.currentNoteID].collaborators.length > 1
);

export const selectNoteIsPinned = state => (
  (!state.notes.currentNoteID || state.notes.trashShown) ? false :
  state.notes.pinnedNotes.includes(state.notes.currentNoteID)
);

export const selectCurrNoteIDs = state => (
  state.notes.shownTag ? state.notes.filteredNoteIDs :
  state.notes.trashShown ? state.notes.trashIDs :
  state.notes.noteIDs
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
