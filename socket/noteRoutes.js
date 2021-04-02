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
      User.updateMany({ notes: noteID }, { $pull: { notes: noteID, pinnedNotes: noteID } })
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

const sendInvite = async (socket, data, io) => {
  try {
    const { noteID, username } = parseData(socket, data);
    // if username includes '@' then search for user by email, else by username
    const userQuery = username.includes('@') ? { email: username } : { username };

    const user = await User.findOne(userQuery);
    if (!user) {
      const errMsg = userQuery.email ? 'No user was found with that email.' :
      'No user was found with that username.';
      return socket.emit('error: post/note/invite', errMsg);
    }

    if (user.notes.includes(noteID)) {
      return socket.emit('error: post/note/invite', 'That user is already a collaborator on this note.');
    }

    if (user.invites.find(invite => invite.noteID === noteID)) {
      return socket.emit('error: post/note/invite', 'You have already invited that user to this note.');
    }
    const invite = { inviter: socket.username, noteID };
    user.invites.push(invite);
    await user.save();

    const connectedUser = [...io.sockets.sockets].find(([key,val]) => val.userID === String(user._id));
    if (connectedUser) {
      io.to(connectedUser[0]).emit('new invite', JSON.stringify(invite));
    }

    socket.emit('success: post/note/invite');
  } catch (err) {
    socket.emit('note error', 'There was an error while sending the note invite.');
  }
};

const acceptInvite = async (socket, data) => {
  try {
    const { noteID } = JSON.parse(data);

    const [user, note] = await Promise.all([
      User.findById(socket.userID),
      Note.findById(noteID)
    ]);
    if (!user && !note) { throw 'Invalid data'; }

    if (!user.invites.find(invite => invite.noteID === noteID)) {
      throw 'Invalid noteID';
    }

    user.invites = user.invites.filter(invite => invite.noteID !== noteID);

    if (!note) {
      await user.save();
      return socket.emit('error: put/note/invite/accept', 'That note no longer exists.');
    }

    user.notes.push(noteID);
    note.collaborators.push(socket.userID);
    await Promise.all([user.save(), note.save()]);

    await note.populate('collaborators', 'username email -_id').execPopulate();

    socket.userNotes[noteID] = true;
    socket.join(noteID);
    socket.to(noteID).emit('new user', JSON.stringify({ noteID, email: user.email, username: user.username }));
    socket.emit('success: put/note/invite/accept', JSON.stringify(note));
  } catch (err) {
    socket.emit('note error', 'There was an error while joining the note.');
  }
};

const rejectInvite = async (socket, data) => {
  try {
    const { noteID } = JSON.parse(data);
    await User.updateOne({ _id: socket.userID }, { $pull: { invites: { noteID } } });
  } catch (err) {
    socket.emit('note error', 'There was an error while joining the note.');
  }
};

const previewInvite = async (socket, data) => {
  try {
    const { noteID } = JSON.parse(data);

    const [hasInvite, note] = await Promise.all([
      User.exists({ _id: socket.userID, 'invites.noteID': noteID }),
      Note.findById(noteID).select('body -_id').lean()
    ]);
    if (!hasInvite) { throw 'Invalid noteID'; }

    socket.emit('success: get/note/invite', JSON.stringify({ body: note.body }));
  } catch (err) {
    socket.emit('note error', 'There was an error while retrieving the note preview.');
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
  'delete/note/tag': removeTag,
  'post/note/invite': sendInvite,
  'put/note/invite/accept': acceptInvite,
  'put/note/invite/reject': rejectInvite,
  'get/note/invite': previewInvite
};
