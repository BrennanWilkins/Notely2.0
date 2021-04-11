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
    socket.userColor = randomColor({ luminosity: 'dark', format: 'rgba', alpha: 1 });
    socket.activeNoteID = null;

    const connectedUsers = {};

    // auto join user to all of their note's rooms
    for (let noteID in socket.userNotes) {
      socket.join(noteID);

      // notify other users that user is online
      socket.to(noteID).emit('user online', {
        username: socket.username,
        color: socket.userColor
      });

      // find connected users in room
      const room = io.sockets.adapter.rooms.get(noteID);
      room.forEach((userSocket, socketID) => {
        const user = io.sockets.sockets.get(socketID);
        if (user && !connectedUsers[user.username]) {
          connectedUsers[user.username] = user.userColor;
        }
      });
    }

    // send all connected users to user
    socket.emit('receive connected users', connectedUsers);

    socket.on('disconnect', () => {
      for (let noteID in socket.userNotes) {
        // notify other users that user is offline
        socket.to(noteID).emit('user offline', { username: socket.username });
      }
    });

    socket.on('leave note', noteID => {
      socket.leave(noteID);
      delete socket.userNotes[noteID];
    });

    // send note body update to other collaborators but dont update body in DB
    socket.on('put/note', data => {
      const { noteID, body } = data;
      if (!noteID || !body || !socket.userNotes[noteID]) { return; }
      socket.to(noteID).emit('put/note', data);
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

    // separate editor room used for sending editor operations/user activity
    socket.on('join editor', noteID => {
      if (!socket.userNotes[noteID] || noteID === socket.activeNoteID) { return; }
      // if user switching notes tell users in prev editor room they are inactive
      if (socket.activeNoteID) {
        const oldRoomName = `editor-${socket.activeNoteID}`;
        socket.to(oldRoomName).emit('user inactive', {
          username: socket.username,
          color: socket.userColor
        });
        socket.leave(oldRoomName);
      }

      const roomName = `editor-${noteID}`;
      socket.join(roomName);
      socket.activeNoteID = noteID;

      // send active users in editor room to user
      const room = io.sockets.adapter.rooms.get(roomName);
      if (!room) { return; }
      const users = {};
      room.forEach((_, socketID) => {
        const user = io.sockets.sockets.get(socketID);
        users[user.username] = user.userColor;
      });
      socket.emit('receive active users', users);

      socket.to(roomName).emit('user active', {
        username: socket.username,
        color: socket.userColor
      });
    });

    socket.on('leave editor', () => {
      if (!socket.activeNoteID) { return; }
      socket.to(`editor-${socket.activeNoteID}`).emit('user inactive', {
        username: socket.username,
        noteID: socket.activeNoteID
      })
      socket.activeNoteID = null;
    });

    socket.on('send ops', data => {
      const { noteID, ops } = data;
      if (!noteID || !ops || !ops.length || noteID !== socket.activeNoteID) { return; }
      socket.to(`editor-${noteID}`).emit('receive ops', data);
    });
  });
};

module.exports = initSocket;
