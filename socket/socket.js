const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const Note = require('../models/note');
const noteRoutes = require('./noteRoutes');

const initSocket = server => {
  const io = socketIO(server, { cors: true });

  io.use((socket, next) => {
    if (!socket.handshake.query || !socket.handshake.query.token) {
      return next(new Error('Unauthorized'));
    }
    jwt.verify(socket.handshake.query.token, process.env.AUTH_KEY, (err, decoded) => {
      if (err) { return next(new Error('Unauthorized')); }
      socket.userID = decoded.userID;
      next();
    });
  }).on('connection', socket => {
    socket.on('join', async noteID => {
      try {
        if (noteID === socket.noteID) { return; }
        const note = await Note.findOne({ _id: noteID, collaborators: socket.userID });
        if (!note) { throw 'No note found'; }
        socket.join(noteID);
        socket.noteID = noteID;
        socket.emit('joined', noteID);
      } catch (err) {
        socket.emit('cannot join');
      }
    });

    socket.on('post/note', data => noteRoutes.createNote(socket, data));
    socket.on('put/note', data => noteRoutes.updateNote(socket, data));
    socket.on('put/note/trash', data => noteRoutes.trashNote(socket, data));
    socket.on('put/note/restore', data => noteRoutes.restoreNote(socket, data));
    socket.on('delete/note', data => noteRoutes.deleteNote(socket, data));
  });
};

module.exports = initSocket;
