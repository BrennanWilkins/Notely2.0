const Note = require('../models/note');
const User = require('../models/user');

const createNote = async (socket, data) => {
  try {
    const note = new Note({
      body: [{ type: 'paragraph', children: [{ text: '' }]}],
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

    // auto join user to note room on creation
    socket.userNotes[note._id] = true;
    socket.join(note._id);
    socket.emit('post/note', JSON.stringify(note));
  } catch (err) {
    socket.emit('note error', 'Your note could not be created.');
  }
};

const updateNote = async (socket, data) => {
  try {
    const { noteID, body } = JSON.parse(data);
    if (!socket.userNotes[noteID]) { throw 'Unauthorized'; }

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
    if (!socket.userNotes[noteID]) { throw 'Unauthorized'; }

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
    if (!socket.userNotes[noteID]) { throw 'Unauthorized'; }

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
    if (!socket.userNotes[noteID]) { throw 'Unauthorized'; }

    const [note] = await Promise.all([
      Note.findByIdAndDelete(noteID),
      User.updateMany({ notes: noteID }, { $pull: { notes: noteID, pinnedNotes: noteID } }),
      User.updateMany({ invites: noteID }, { $pull: { invites: noteID } })
    ]);
    if (!note) { throw 'Invalid noteID'; }

    socket.to(noteID).emit('delete/note', data);
    socket.leave(noteID);
    delete socket.userNotes[noteID];
  } catch (err) {
    socket.emit('note error', 'There was an error while deleting your note.');
  }
};

module.exports = {
  'post/note' : createNote,
  'put/note' : updateNote,
  'put/note/trash' : trashNote,
  'put/note/restore' : restoreNote,
  'delete/note' : deleteNote
};
