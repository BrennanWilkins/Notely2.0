const Note = require('../models/note');
const User = require('../models/user');

const noteRoutes = {
  createNote: async (socket, data) => {
    try {
      const { body } = JSON.parse(data);
      const note = new Note({
        body,
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

      socket.emit('post/note', { noteID: note._id });
    } catch (err) {
      socket.emit(`error: 'post/note'`);
    }
  },
  updateNote: async (socket, data) => {
    try {
      const { noteID, body } = JSON.parse(data);
      if (noteID !== socket.noteID) { throw 'Invalid noteID'; }
      await Note.findByIdAndUpdate(noteID, { body });
      socket.to(noteID).emit('put/note', data);
    } catch (err) {
      socket.emit(`error: 'put/note'`);
    }
  }
};

module.exports = noteRoutes;
