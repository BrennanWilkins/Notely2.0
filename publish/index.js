const Note = require('../models/note');
const serialize = require('./utils/serialize');

const redirectURL = process.env.NODE_ENV === 'production' ?
'https://notely-app.herokuapp.com' :
'http://localhost:3000';

const publishHandler = async (req, res) => {
  try {
    const publishID = req.params.publishID;
    if (!publishID) { throw Error(); }

    const note = await Note.findOne({ publishID });
    if (!note) { throw Error(); }
    const html = serialize(note.body);
    res.send(html);
  } catch (err) {
    console.log(err);
    res.redirect(redirectURL);
  }
};

module.exports = publishHandler;
