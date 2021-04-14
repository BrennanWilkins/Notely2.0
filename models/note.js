const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  body: [],
  tags: [String],
  collaborators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  publishID: String,
  isTrash: Boolean
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);
