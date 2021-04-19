import store from '../store';
import { serializeToText } from './slateHelpers';
import { formatDate } from './formatDate';

const convertNotes = () => {
  const state = store.getState();
  const noteIDs = state.notes.noteIDs;
  let string = '--------------------------------------------------------\n\n';
  for (let noteID of noteIDs) {
    const note = state.notes.notesByID[noteID];
    const body = serializeToText(note.body, '\n');
    string += `Created at ${formatDate(note.createdAt)}\n`;
    string += `Last modified ${formatDate(note.updatedAt)}\n\n`;
    string += `${body}\n`;
    string += '\n--------------------------------------------------------\n\n';
  }
  return string;
};

const downloadNotes = () => {
  const string = convertNotes();
  const element = document.createElement("a");
  const file = new Blob([string], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = "my-notes.txt";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export default downloadNotes;
