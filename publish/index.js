const Note = require('../models/note');
const serialize = require('./utils/serialize');
const { baseURL } = require('./utils/getHtml');

const publishHandler = async (req, res) => {
  try {
    const publishID = req.params.publishID;
    if (!publishID) { throw Error(); }

    const note = await Note.findOne({ publishID });
    if (!note) { throw Error(); }
    const html = serialize(note.body);
    res.send(html);
  } catch (err) {
    res.redirect(baseURL);
  }
};

module.exports = publishHandler;
