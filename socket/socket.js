const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const Note = require('../models/note');
const noteRoutes = require('./noteRoutes');
const randomColor = require('randomcolor');

const initSocket = server => {
  const io = socketIO(server, { cors: true });

  io.use((socket, next) => {
    // verify token & set socket.userID
    if (!socket.handshake.query || !socket.handshake.query.token) {
      return next(new Error('Unauthorized'));
    }
    jwt.verify(socket.handshake.query.token, process.env.AUTH_KEY, (err, decoded) => {
      if (err || !decoded.userID || !decoded.username) { return next(new Error('Unauthorized')); }
      socket.userID = decoded.userID;
      socket.username = decoded.username;
      next();
    });
  }).use(async (socket, next) => {
    // find all user's notes & set as obj on socket
    try {
      const notes = await Note.find({ collaborators: socket.userID }).select('_id').lean();
      if (!notes) { throw 'No notes found'; }

      socket.userNotes = notes.reduce((obj, curr) => ({ ...obj, [curr._id]: true }), {});
      next();
    } catch (err) { next(new Error('join error')); }
  }).on('connection', socket => {
    socket.userColor = randomColor({ luminosity: 'light' });
    socket.activeNoteID = null;

    // auto join user to all of their note's rooms
    for (let noteID in socket.userNotes) {
      socket.join(noteID);

      // notify other users that user is online
      socket.to(noteID).emit('user online', {
        username: socket.username,
        color: socket.userColor
      });
    }

    // retrieve active users when client is active on a note
    socket.on('get connected users', noteID => {
      if (!socket.userNotes[noteID] || noteID === socket.activeNoteID) { return; }
      const room = io.sockets.adapter.rooms.get(noteID);
      if (!room) { return; }
      const users = [...room].map(socketID => {
        const user = io.sockets.sockets.get(socketID);
        return {
          username: user.username,
          color: user.userColor,
          noteID: user.activeNoteID === noteID ? user.activeNoteID : null
        };
      });
      socket.emit('receive connected users', users);

      // if user is switching notes tell users in old note they are inactive
      if (socket.activeNoteID) {
        socket.to(socket.activeNoteID).emit('user inactive', { username: socket.username });
      }
      socket.activeNoteID = noteID;
      socket.to(noteID).emit('user active', { username: socket.username, noteID });
    });

    socket.on('send inactive', noteID => {
      if (!socket.userNotes[noteID] || noteID !== socket.activeNoteID) { return; }
      socket.activeNoteID = null;
      socket.to(noteID).emit('user inactive', { username: socket.username });
    });

    socket.on('disconnect', () => {
      for (let noteID in socket.userNotes) {
        // notify other users that user is offline
        socket.to(noteID).emit('user offline', { username: socket.username });
      }
    });

    // add event handlers for note routes
    for (let route in noteRoutes) {
      if (route === 'post/note/invite') {
        // give io to send invite handler to check if invitee connected to send invite
        socket.on(route, data => noteRoutes[route](socket, data, io));
      } else {
        socket.on(route, data => noteRoutes[route](socket, data));
      }
    }

    // send note body update to other collaborators but dont update body in DB
    socket.on('put/note', data => {
      const { noteID, body } = data;
      if (!noteID || !body || !socket.userNotes[noteID]) { return; }
      socket.to(noteID).emit('put/note', data);
    });

    socket.on('send ops: put/note', data => {
      if (!data.noteID || !data.ops || !data.ops.length) { return; }
      socket.to(data.noteID).emit('send ops: put/note', data);
    });

    socket.on('leave note', noteID => {
      socket.leave(noteID);
      delete socket.userNotes[noteID];
    });
  });
};

module.exports = initSocket;
