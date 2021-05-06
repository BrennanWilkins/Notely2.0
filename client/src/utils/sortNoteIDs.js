import { serializeToText } from './slateHelpers';

const sortNoteIDs = (
  noteIDs,
  notesByID,
  pinnedNotes,
  sortType,
  trashShown,
  searchQuery,
  shownTag
) => {
  let mapped = noteIDs.map(noteID => {
    const { updatedAt, createdAt, body, tags } = notesByID[noteID];

    if (shownTag && !tags.includes(shownTag)) {
      return null;
    }

    // text not necessary if not sorting by alph/searching
    const text = (
      (!!searchQuery || sortType === 'AtoZ' || sortType === 'ZtoA') ?
      serializeToText(body) :
      ''
    );

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
  });

  if (shownTag || searchQuery) {
    mapped = mapped.filter(Boolean);
  }

  mapped.sort((a, b) => {
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
      case 'AtoZ': console.log(1); return a.text.localeCompare(b.text);
      case 'ZtoA': return b.text.localeCompare(a.text);
      default: return 0;
    }
  });

  return mapped.map(note => note.noteID);
};

export default sortNoteIDs;
