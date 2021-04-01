const Note = require('../models/note');
const User = require('../models/user');

const parseData = (socket, data, options) => {
  const payload = JSON.parse(data);
  if (!socket.userNotes[payload.noteID]) { throw 'Unauthorized'; }
  if (!options) { return payload; }
  if (options.body && (!payload.body || !Array.isArray(payload.body))) {
    throw 'Invalid body';
  }
  if (options.tag && (!payload.tag || typeof payload.tag !== 'string'
      || payload.tag.length > 100)) {
    throw 'Invalid tag';
  }
  return payload;
};

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
    const { noteID, body } = parseData(socket, data, { body: true });

    const note = await Note.findByIdAndUpdate(noteID, { body });
    if (!note) { throw 'Invalid noteID'; }
    socket.to(noteID).emit('put/note', data);
    socket.emit('put/note finished');
  } catch (err) {
    socket.emit('note error', 'There was an error while updating your note.');
  }
};

const trashNote = async (socket, data) => {
  try {
    const { noteID } = parseData(socket, data);

    const note = await Note.findByIdAndUpdate(noteID, { isTrash: true });
    if (!note) { throw 'Invalid noteID'; }
    socket.to(noteID).emit('put/note/trash', data);
  } catch (err) {
    socket.emit('note error', 'There was an error while sending your note to trash.');
  }
};

const restoreNote = async (socket, data) => {
  try {
    const { noteID } = parseData(socket, data);

    const note = await Note.findByIdAndUpdate(noteID, { isTrash: false });
    if (!note) { throw 'Invalid noteID'; }
    socket.to(noteID).emit('put/note/restore', data);
  } catch (err) {
    socket.emit('note error', 'There was an error while restoring your note.');
  }
};

const deleteNote = async (socket, data) => {
  try {
    const { noteID } = parseData(socket, data);

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

const pinNote = async (socket, data) => {
  try {
    const { noteID } = parseData(socket, data);

    const user = await User.findById(socket.userID);
    if (!user) { throw 'No user found'; }
    if (user.pinnedNotes.includes(noteID)) { return; }
    user.pinnedNotes.unshift(noteID);

    await user.save();
  } catch (err) {
    socket.emit('note error', 'There was an error while pinning your note.');
  }
};

const unpinNote = async (socket, data) => {
  try {
    const { noteID } = parseData(socket, data);

    await User.findByIdAndUpdate(socket.userID, { $pull: { pinnedNotes: noteID } });
  } catch (err) {
    socket.emit('note error', 'There was an error while unpinning your note.');
  }
};

const createTag = async (socket, data) => {
  try {
    const { noteID, tag } = parseData(socket, data, { tag: true });

    const note = await Note.findById(noteID);
    if (note.tags.includes(tag)) { return; }
    note.tags.push(tag);

    await note.save();
    socket.to(noteID).emit('post/note/tag', data);
  } catch (err) {
    socket.emit('note error', 'There was an error while creating your tag.');
  }
};

const removeTag = async (socket, data) => {
  try {
    const { noteID, tag } = parseData(socket, data, { tag: true });

    await Note.findByIdAndUpdate(noteID, { $pull: { tags: tag } });
    socket.to(noteID).emit('delete/note/tag', data);
  } catch (err) {
    socket.emit('note error', 'There was an error while removing the tag.');
  }
};

module.exports = {
  'post/note' : createNote,
  'put/note' : updateNote,
  'put/note/trash' : trashNote,
  'put/note/restore' : restoreNote,
  'delete/note' : deleteNote,
  'put/note/pin': pinNote,
  'put/note/unpin': unpinNote,
  'post/note/tag': createTag,
  'delete/note/tag': removeTag
};
