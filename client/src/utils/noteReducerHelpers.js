import { serializeToText } from './slateHelpers';

const sortHandler = (a, b, sortType) => {
  if (a.pinIdx !== -1 && b.pinIdx !== -1) {
    return b.pinIdx - a.pinIdx;
  }
  if (b.pinIdx !== -1 && a.pinIdx === -1) { return 1; }
  if (a.pinIdx !== -1 && b.pinIdx === -1) { return -1; }

  switch (sortType) {
    case 'Created Newest': return b.createdAt - a.createdAt;
    case 'Created Oldest': return a.createdAt - b.createdAt;
    case 'Modified Newest': return b.updatedAt - a.updatedAt;
    case 'Modified Oldest': return a.updatedAt - b.updatedAt;
    case 'AtoZ': return a.text.localeCompare(b.text);
    case 'ZtoA': return b.text.localeCompare(a.text);
    default: return 0;
  }
};

const getText = (sortType, body, searchQuery) => (
  // text not necessary if not sorting by alph/searching
  (!!searchQuery || sortType === 'AtoZ' || sortType === 'ZtoA') ?
  serializeToText(body) :
  ''
);

export const filterAndSortNoteIDs = (
  noteIDs,
  notesByID,
  pinnedNotes,
  sortType,
  trashShown,
  searchQuery,
  shownTag
) => {
  return noteIDs.map(noteID => {
    const { updatedAt, createdAt, body, tags } = notesByID[noteID];

    if (shownTag && !tags.includes(shownTag)) {
      return null;
    }

    const text = getText(sortType, body, searchQuery);

    if (searchQuery && !text.includes(searchQuery)) {
      return null;
    }

    return {
      noteID,
      updatedAt: new Date(updatedAt),
      createdAt: new Date(createdAt),
      pinIdx: trashShown ? -1 : pinnedNotes.indexOf(noteID),
      text
    };
  })
  .filter(Boolean)
  .sort((a, b) => sortHandler(a, b, sortType))
  .map(note => note.noteID);
};

export const resortByPinned = (filteredNoteIDs, trashShown, pinnedNotes, noteID) => {
  if (trashShown || !filteredNoteIDs.includes(noteID)) {
    return filteredNoteIDs;
  }

  // resort filtered notes due to pinned note order
  return filteredNoteIDs.map(noteID => ({
    noteID,
    pinIdx: pinnedNotes.indexOf(noteID)
  }))
  .sort(sortHandler)
  .map(note => note.noteID);
};

export const shouldResortByModified = (noteID, noteIDs, sortType) => {
  // dont need to resort if not sorting by modified or if note not present
  return (sortType === 'Modified Newest' || sortType === 'Modified Oldest')
  && noteIDs.includes(noteID);
}

export const resortByModified = (
  notesByID,
  filteredNoteIDs,
  pinnedNotes,
  sortType,
  trashShown
) => {
  return filteredNoteIDs.map(noteID => ({
    noteID,
    updatedAt: new Date(notesByID[noteID].updatedAt),
    pinIdx: trashShown ? -1 : pinnedNotes.indexOf(noteID)
  }))
  .sort((a,b) => sortHandler(a, b, sortType))
  .map(note => note.noteID);
};

export const resortBodyUpdate = (
  noteID,
  filteredNoteIDs,
  noteIDs,
  notesByID,
  pinnedNotes,
  sortType,
  trashShown,
  searchQuery,
  shownTag
) => {
  let sortedIDs = filteredNoteIDs;

  let isPresent = noteIDs.includes(noteID);
  if (shownTag) {
    isPresent = isPresent && notesByID[noteID].tags.includes(shownTag);
  }

  if (
    isPresent
    && !searchQuery
    && (sortType === 'Modified Newest' || sortType === 'Modified Oldest')
  ) {
    sortedIDs = resortByModified(
      notesByID,
      filteredNoteIDs,
      pinnedNotes,
      sortType,
      trashShown
    );
  } else if (
    (searchQuery && isPresent)
    || (isPresent && (sortType === 'AtoZ' || sortType === 'ZtoA'))
  ) {
    sortedIDs = filterAndSortNoteIDs(
      noteIDs,
      notesByID,
      pinnedNotes,
      sortType,
      trashShown,
      searchQuery,
      shownTag
    );
  }

  return sortedIDs;
};

export const resortNotes = (
  noteIDs,
  notesByID,
  pinnedNotes,
  sortType,
  trashShown
) => {
  return noteIDs.map(noteID => {
    const { updatedAt, createdAt, body } = notesByID[noteID];

    return {
      noteID,
      updatedAt: new Date(updatedAt),
      createdAt: new Date(createdAt),
      pinIdx: trashShown ? -1 : pinnedNotes.indexOf(noteID),
      text: getText(sortType, body)
    };
  })
  .sort((a, b) => sortHandler(a,b,sortType))
  .map(note => note.noteID);
};
