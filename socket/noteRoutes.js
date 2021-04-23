const Note = require('../models/note');
const User = require('../models/user');
const { nanoid } = require('nanoid');

const parseData = (socket, payload, options) => {
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

const errHandler = (socket, msg) => {
  const msgID = nanoid();
  socket.emit('note error', { msgID, msg });
};

const createNote = async (socket, sockets, callback) => {
  try {
    const note = new Note({
      body: [{ type: 'paragraph', children: [{ text: '' }]}],
      tags: [],
      collaborators: [socket.userID],
      publishID: null,
      isTrash: false
    });

    const user = await User.findById(socket.userID);
    user.notes.unshift(note._id);

    await Promise.all([
      note.save(),
      user.save()
    ]);

    const noteID = String(note._id);
    const userRoom = `user-${socket.userID}`;

    // auto join all of user's clients to note room
    const room = sockets.adapter.rooms.get(userRoom);
    room.forEach(socketID => {
      const client = sockets.sockets.get(socketID);
      client.userNotes[noteID] = true;
      client.join(noteID);
    });

    const payload = { note, username: socket.username };
    socket.to(userRoom).emit('post/note', payload);
    callback(payload);
  } catch (err) {
    errHandler(socket, 'Your note could not be created.');
  }
};

const updateNote = async (socket, data, callback) => {
  try {
    const { noteID, body } = parseData(socket, data, { body: true });

    const note = await Note.findByIdAndUpdate(noteID, { body });
    if (!note) { throw 'Invalid noteID'; }
    callback();
  } catch (err) {
    errHandler(socket, 'There was an error while updating your note.');
  }
};

const trashNote = async (socket, data) => {
  try {
    const { noteID } = parseData(socket, data);

    const note = await Note.findByIdAndUpdate(noteID, { isTrash: true });
    if (!note) { throw 'Invalid noteID'; }
    socket.to(noteID).emit('put/note/trash', data);
  } catch (err) {
    errHandler(socket, 'There was an error while sending your note to trash.');
  }
};

const restoreNote = async (socket, data) => {
  try {
    const { noteID } = parseData(socket, data);

    const note = await Note.findByIdAndUpdate(noteID, { isTrash: false });
    if (!note) { throw 'Invalid noteID'; }
    socket.to(noteID).emit('put/note/restore', data);
  } catch (err) {
    errHandler(socket, 'There was an error while restoring your note.');
  }
};

const deleteNote = async (socket, data) => {
  try {
    const { noteID } = parseData(socket, data);

    const [note] = await Promise.all([
      Note.findByIdAndDelete(noteID),
      User.updateMany({ notes: noteID }, { $pull: { notes: noteID, pinnedNotes: noteID } }),
      User.updateMany({ 'invites.noteID': noteID }, { $pull: { invites: { noteID } } })
    ]);
    if (!note) { throw 'Invalid noteID'; }

    socket.to(noteID).emit('delete/note', data);
    socket.leave(noteID);
    socket.leave(`editor-${noteID}`);
    delete socket.userNotes[noteID];
  } catch (err) {
    errHandler(socket, 'There was an error while deleting your note.');
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
    errHandler(socket, 'There was an error while pinning your note.');
  }
};

const unpinNote = async (socket, data) => {
  try {
    const { noteID } = parseData(socket, data);

    await User.findByIdAndUpdate(socket.userID, { $pull: { pinnedNotes: noteID } });
  } catch (err) {
    errHandler(socket, 'There was an error while unpinning your note.');
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
    errHandler(socket, 'There was an error while creating your tag.');
  }
};

const removeTag = async (socket, data) => {
  try {
    const { noteID, tag } = parseData(socket, data, { tag: true });

    await Note.findByIdAndUpdate(noteID, { $pull: { tags: tag } });
    socket.to(noteID).emit('delete/note/tag', data);
  } catch (err) {
    errHandler(socket, 'There was an error while removing the tag.');
  }
};

const sendInvite = async (socket, data, callback) => {
  try {
    const { noteID, username } = parseData(socket, data);
    // if username includes '@' then search for user by email, else by username
    const userQuery = username.includes('@') ? { email: username } : { username };

    const [user, note] = await Promise.all([
      User.findOne(userQuery),
      Note.exists({ _id: noteID, isTrash: false })
    ]);
    if (!user) {
      const errMsg = userQuery.email ? 'No user was found with that email.' :
      'No user was found with that username.';
      return callback({ error: true, errMsg });
    }
    if (!note) { throw 'Invalid noteID'; }

    if (user.notes.includes(noteID)) {
      return callback({ error: true, errMsg: 'That user is already a collaborator on this note.' });
    }

    if (user.invites.find(invite => invite.noteID === noteID)) {
      return callback({ error: true, errMsg: 'You have already invited that user to this note.' });
    }
    const invite = { inviter: socket.username, noteID };
    user.invites.push(invite);
    await user.save();

    socket.to(`user-${String(user._id)}`).emit('new invite', invite);

    callback({ error: false });
  } catch (err) {
    onError({ error: true, errMsg: 'There was an error while sending the note invite.' });
  }
};

const acceptInvite = async (socket, data, callback) => {
  try {
    const { noteID } = data;

    const [user, note] = await Promise.all([
      User.findById(socket.userID),
      Note.findById(noteID)
    ]);
    if (!user && !note) { throw 'Invalid data'; }

    if (!user.invites.find(invite => invite.noteID === noteID)) {
      throw 'Invalid noteID';
    }

    user.invites = user.invites.filter(invite => invite.noteID !== noteID);

    if (!note || note.isTrash) {
      await user.save();
      return callback({ error: true });
    }

    user.notes.push(noteID);
    note.collaborators.push(socket.userID);
    await Promise.all([user.save(), note.save()]);

    await note.populate('collaborators', 'username email -_id').execPopulate();

    socket.userNotes[noteID] = true;
    socket.join(noteID);
    socket.to(noteID).emit('post/note/collaborator', { noteID, email: user.email, username: user.username });
    callback({ error: false, note });
  } catch (err) {
    errHandler(socket, 'There was an error while joining the note.');
  }
};

const rejectInvite = async (socket, data) => {
  try {
    const { noteID } = data;
    await User.updateOne({ _id: socket.userID }, { $pull: { invites: { noteID } } });
  } catch (err) {
    errHandler(socket, 'There was an error while updating your invites.');
  }
};

const previewInvite = async (socket, data, callback) => {
  try {
    const { noteID } = data;

    const [hasInvite, note] = await Promise.all([
      User.exists({ _id: socket.userID, 'invites.noteID': noteID }),
      Note.findById(noteID).select('body').lean()
    ]);
    if (!hasInvite || !note) { throw 'Invalid noteID'; }

    callback({ error: false, body: note.body });
  } catch (err) {
    callback({ error: true });
  }
};

const publishNote = async (socket, data, callback) => {
  try {
    const { noteID } = parseData(socket, data);

    const note = await Note.findById(noteID);
    if (!note) { throw 'Invalid noteID'; }
    if (note.publishID) { throw 'Already published'; }

    let publishID = nanoid(7);
    // verify publishID is unique
    let exists = await Note.exists({ publishID });
    while (exists) {
      publishID = nanoid(7);
      exists = await Note.exists({ publishID });
    }
    note.publishID = publishID;
    await note.save();

    callback({ error: false, publishID });
    socket.to(noteID).emit('put/note/publish', { noteID, publishID });
  } catch (err) {
    callback({ error: true });
  }
};

const unpublishNote = async (socket, data) => {
  try {
    const { noteID } = parseData(socket, data);

    const note = await Note.findByIdAndUpdate(noteID, { publishID: null });
    if (!note) { throw 'Invalid noteID'; }

    socket.to(noteID).emit('put/note/unpublish', { noteID });
  } catch (err) {
    errHandler(socket, 'There was an error while unpublishing your note.');
  }
};

const emptyUserTrash = async (socket, data) => {
  try {
    const user = await User.findById(socket.userID);
    if (!user) { throw 'Unauthorized'; }

    const trashNotes = await Note.find({ _id: { $in: user.notes }, isTrash: true }).select('_id').lean();
    if (!trashNotes || !trashNotes.length) { return; }
    const trashIDs = trashNotes.map(note => String(note._id));

    await Promise.all([
      Note.deleteMany({ _id: { $in: trashIDs } }),
      User.updateMany({ notes: { $in: trashIDs } }, { $pull: { notes: { $in: trashIDs }, pinnedNotes: { $in: trashIDs } } }),
      User.updateMany({ 'invites.noteID': { $in: trashIDs } }, { $pull: { invites: { noteID: { $in: trashIDs } } } })
    ]);

    for (let noteID of trashIDs) {
      socket.to(noteID).emit('delete/note', { noteID });
      socket.leave(noteID);
      socket.leave(`editor-${noteID}`);
      delete socket.userNotes[noteID];
    }

  } catch (err) {
    errHandler(socket, 'There was an error while emptying your trash.');
  }
};

module.exports = {
  'post/note' : createNote,
  'put/note/save' : updateNote,
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
  'get/note/invite': previewInvite,
  'put/note/publish': publishNote,
  'put/note/unpublish': unpublishNote,
  'put/user/emptyTrash': emptyUserTrash
};
