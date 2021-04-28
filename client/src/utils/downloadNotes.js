import store from '../store';
import { serializeToText } from './slateHelpers';
import { formatDate } from './formatDate';

const convertNote = (string, note) => {
  const body = serializeToText(note.body, '\n');
  let str = `Created at ${formatDate(note.createdAt)}\n`;
  str += `Last modified ${formatDate(note.updatedAt)}\n\n`;
  str += `${body}\n`;
  return str;
};

const download = (str, fileName) => {
  const element = document.createElement("a");
  const file = new Blob([str], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = fileName;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const downloadCurrNote = () => {
  const state = store.getState();
  const note = state.notes.notesByID[state.notes.currentNoteID];
  const str = convertNote('', note);
  download(str, 'notely-note.txt');
};

export const downloadNotes = () => {
  const state = store.getState();
  const noteIDs = state.notes.noteIDs;
  let str = '--------------------------------------------------------\n\n';
  for (let noteID of noteIDs) {
    const note = state.notes.notesByID[noteID];
    str += convertNote(str, note);
    str += '\n--------------------------------------------------------\n\n';
  }
  download(str, 'my-notes.txt');
};
