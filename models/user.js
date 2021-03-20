const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  invites: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
  pinnedNotes: [String],
  recoverPassID: String,
  signupID: String
});

module.exports = mongoose.model('User', UserSchema);
