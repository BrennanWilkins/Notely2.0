const Note = require('../models/note');
const User = require('../models/user');

const createNote = async (socket, data) => {
  try {
    const { body } = JSON.parse(data);
    const note = new Note({
      body,
      tags: [],
      collaborators: [socket.userID],
      nanoID: '',
      isPublished: false,
      isTrash: false
    });

    const user = await User.findById(socket.userID);
    user.notes.unshift(note._id);

    await Promise.all([
      note.save(),
      user.save()
    ]);

    socket.emit('post/note', note._id);
  } catch (err) {
    socket.emit('note error', 'Your note could not be created.');
  }
};

const updateNote = async (socket, data) => {
  try {
    const { noteID, body } = JSON.parse(data);
    if (noteID !== socket.noteID) { throw 'Invalid noteID'; }
    const note = await Note.findByIdAndUpdate(noteID, { body });
    if (!note) { throw 'Invalid noteID'; }
    socket.to(noteID).emit('put/note', data);
  } catch (err) {
    socket.emit('note error', 'There was an error while updating your note.');
  }
};

const trashNote = async (socket, data) => {
  try {
    const { noteID } = JSON.parse(data);
    if (noteID !== socket.noteID) { throw 'Invalid noteID'; }
    const note = await Note.findByIdAndUpdate(noteID, { isTrash: true });
    if (!note) { throw 'Invalid noteID'; }
    socket.to(noteID).emit('put/note/trash', data);
  } catch (err) {
    socket.emit('note error', 'There was an error while sending your note to trash.');
  }
};

const restoreNote = async (socket, data) => {
  try {
    const { noteID } = JSON.parse(data);
    if (noteID !== socket.noteID) { throw 'Invalid noteID'; }
    const note = await Note.findByIdAndUpdate(noteID, { isTrash: false });
    if (!note) { throw 'Invalid noteID'; }
    socket.to(noteID).emit('put/note/restore', data);
  } catch (err) {
    socket.emit('note error', 'There was an error while restoring your note.');
  }
};

const deleteNote = async (socket, data) => {
  try {
    const { noteID } = JSON.parse(data);
    if (noteID !== socket.noteID) { throw 'Invalid noteID'; }
    const note = await Note.findByIdAndDelete(noteID);
    if (!note) { throw 'Invalid noteID'; }
    socket.to(noteID).emit('delete/note', data);
  } catch (err) {
    socket.emit('note error', 'There was an error while deleting your note.');
  }
};

module.exports = {
  createNote,
  updateNote,
  trashNote,
  deleteNote,
  restoreNote
};
