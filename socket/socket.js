const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const Note = require('../models/note');
const noteRoutes = require('./noteRoutes');

const initSocket = server => {
  const io = socketIO(server, { cors: true });

  io.use((socket, next) => {
    // verify token & set socket.userID
    if (!socket.handshake.query || !socket.handshake.query.token) {
      return next(new Error('Unauthorized'));
    }
    jwt.verify(socket.handshake.query.token, process.env.AUTH_KEY, (err, decoded) => {
      if (err) { return next(new Error('Unauthorized')); }
      socket.userID = decoded.userID;
      next();
    });
  }).use(async (socket, next) => {
    // find all user's notes & set as obj on socket
    try {
      const notes = await Note.find({ collaborators: socket.userID });
      if (!notes) { throw 'No notes found'; }

      const userNotes = notes.reduce((obj, curr) => ({ ...obj, [curr._id]: true }), {});
      socket.userNotes = userNotes;
      next();
    } catch (err) { next(new Error('join error')); }
  }).on('connection', socket => {
    // auto join user to all of his note's rooms & add event handlers
    for (let noteID in socket.userNotes) {
      socket.join(noteID);
    }
    for (let route in noteRoutes) {
      socket.on(route, data => noteRoutes[route](socket, data));
    }

    socket.on('leave note', noteID => {
      socket.leave(noteID);
      delete socket.userNotes[noteID];
    });
  });
};

module.exports = initSocket;
