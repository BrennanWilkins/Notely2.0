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

      socket.userNotes = notes.reduce((obj, curr) => ({ ...obj, [String(curr._id)]: true }), {});
      next();
    } catch (err) { next(new Error('join error')); }
  }).on('connection', socket => {
    // check if user already connected on another device/tab/etc
    const connectedUser = [...io.sockets.sockets].find(([_,user]) => user.userID === socket.userID);

    // use same color if already connected
    socket.userColor = (connectedUser && connectedUser[1].userColor) ?
    connectedUser[1].userColor :
    randomColor({ luminosity: 'dark', format: 'rgba', alpha: 1 });

    socket.activeNoteID = null;

    // join user to their own private room to manage multiple connections
    socket.join(`user-${socket.userID}`);

    const connectedUsers = { [socket.username]: socket.userColor };

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
        socket.to(noteID).except(`user-${socket.userID}`).emit('user offline', {
          username: socket.username
        });
      }
    });

    socket.on('leave note', noteID => {
      socket.leave(noteID);
      socket.leave(`editor-${noteID}`);
      delete socket.userNotes[noteID];
    });

    // send note body update to other collaborators but dont update body in DB
    socket.on('put/note', data => {
      const { noteID, body } = data;
      if (!noteID || !body || !socket.userNotes[noteID]) { return; }
      socket.to(noteID).emit('put/note', data);
    });

    // add event handlers for note routes, callback may be provided
    for (let route in noteRoutes) {
      if (route === 'post/note/invite') {
        // give io to send invite handler to check if invitee connected to send invite
        socket.on(route, (...args) => noteRoutes[route](socket, io, ...args));
      } else {
        socket.on(route, (...args) => noteRoutes[route](socket, ...args));
      }
    }

    // separate editor room used for sending editor operations/user activity
    socket.on('join editor', noteID => {
      if (!socket.userNotes[noteID] || noteID === socket.activeNoteID) { return; }
      // if user switching notes tell users in prev editor room they are inactive
      if (socket.activeNoteID) {
        const oldRoomName = `editor-${socket.activeNoteID}`;
        socket.to(oldRoomName).except(`user-${socket.userID}`).emit('user inactive', {
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

      socket.to(roomName).except(`user-${socket.userID}`).emit('user active', {
        username: socket.username,
        color: socket.userColor
      });
    });

    socket.on('leave editor', () => {
      if (!socket.activeNoteID) { return; }
      socket.to(`editor-${socket.activeNoteID}`).except(`user-${socket.userID}`).emit('user inactive', {
        username: socket.username,
        color: socket.userColor
      })
      socket.activeNoteID = null;
    });

    socket.on('send ops', data => {
      const { noteID, ops } = data;
      if (!noteID || !ops || !ops.length || noteID !== socket.activeNoteID) { return; }
      socket.to(`editor-${noteID}`).emit('receive ops', data);
    });

    socket.on('send cursor', data => {
      const { noteID } = data;
      if (!noteID || noteID !== socket.activeNoteID) { return; }

      const cursorData = {
        ...data,
        username: socket.username,
        color: socket.userColor
      };
      socket.to(`editor-${noteID}`).except(`user-${socket.userID}`).emit('receive cursor', cursorData);
    });
  });
};

module.exports = initSocket;
