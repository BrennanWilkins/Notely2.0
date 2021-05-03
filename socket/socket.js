const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const Note = require('../models/note');
const { noteRoutes, noteRoutesWithSockets } = require('./noteRoutes');
const randomColor = require('randomcolor');

const initSocket = server => {
  const io = socketIO(server, { cors: true });

  io.use((socket, next) => {
    // verify token & set socket.userID
    if (!socket.handshake.query || !socket.handshake.query.token) {
      return next(new Error('Unauthorized'));
    }

    jwt.verify(socket.handshake.query.token, process.env.AUTH_KEY, (err, decoded) => {
      if (err || !decoded.userID || !decoded.username) {
        return next(new Error('Unauthorized'));
      }

      socket.userID = decoded.userID;
      socket.username = decoded.username;
      next();
    });
  }).use(async (socket, next) => {
    // find all user's notes & set as obj on socket
    try {
      const notes = await Note.find({ collaborators: socket.userID }).select('_id').lean();
      if (!notes) { throw 'No notes found'; }

      socket.userNotes = notes.reduce((obj, curr) => ({
        ...obj,
        [String(curr._id)]: true
      }), {});

      next();
    } catch (err) {
      next(new Error('join error'));
    }
  }).on('connection', socket => {
    const { userID, username } = socket;
    const userRoom = `user-${userID}`;

    // check if user already connected on another device/tab/etc
    const connectedUser = [...io.sockets.sockets].find(([_,user]) => user.userID === userID);

    // use same color if already connected
    socket.userColor = (
      (connectedUser && connectedUser[1].userColor) ?
      connectedUser[1].userColor :
      randomColor({
        luminosity: 'dark',
        format: 'rgba',
        alpha: 1
      })
    );

    // data sent for cursor/activity events
    const userData = { username, color: socket.userColor };

    socket.activeNoteID = null;

    // join user to their own private room to manage multiple connections
    socket.join(userRoom);

    const connectedUsers = { [username]: socket.userColor };

    // auto join user to all of their note's rooms
    for (let noteID in socket.userNotes) {
      socket.join(noteID);

      // notify other users that user is online
      socket.to(noteID).emit('user online', userData);

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
      // notify other users that user is offline if all of user's connections offline
      const room = io.sockets.adapter.rooms.get(userRoom);
      if (room) { return; }

      for (let noteID in socket.userNotes) {
        socket.to(noteID).except(userRoom).emit('user offline', { username });
      }
    });

    // send note body update to other collaborators but dont update body in DB
    socket.on('put/note', data => {
      const { noteID, body } = data;
      if (!noteID || !body || !socket.userNotes[noteID]) { return; }
      socket.to(noteID).emit('put/note', data);
    });

    // add event handlers for note routes, callback may be provided
    for (let route in noteRoutes) {
      socket.on(route, (...args) => noteRoutes[route](socket, ...args));
    }
    for (let route in noteRoutesWithSockets) {
      // provide sockets so can send to/update multiple clients
      socket.on(route, (...args) => noteRoutesWithSockets[route](socket, io.sockets, ...args));
    }

    // separate editor room used for sending editor operations/user activity
    socket.on('join editor', noteID => {
      if (!socket.userNotes[noteID] || noteID === socket.activeNoteID) { return; }
      // if user switching notes tell users in prev editor room they are inactive
      if (socket.activeNoteID) {
        const oldRoomName = `editor-${socket.activeNoteID}`;
        socket.to(oldRoomName).except(userRoom).emit('user inactive', userData);
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

      socket.to(roomName).except(userRoom).emit('user active', userData);
    });

    socket.on('leave editor', () => {
      if (!socket.activeNoteID) { return; }

      const room = `editor-${socket.activeNoteID}`;
      socket.leave(room);
      socket.to(room).except(userRoom).emit('user inactive', userData);
      socket.activeNoteID = null;
    });

    socket.on('send ops', data => {
      const { noteID, ops } = data;
      if (!noteID || !ops || !ops.length || noteID !== socket.activeNoteID) {
        return;
      }
      socket.to(`editor-${noteID}`).emit('receive ops', data);
    });

    socket.on('send cursor', data => {
      const { noteID } = data;
      if (!noteID || noteID !== socket.activeNoteID) { return; }

      socket.to(`editor-${noteID}`).except(userRoom).emit('receive cursor', {
        ...data,
        ...userData
      });
    });
  });
};

module.exports = initSocket;
