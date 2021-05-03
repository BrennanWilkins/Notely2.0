const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/user');
const Note = require('../models/note');
const bcryptjs = require('bcryptjs');
const { validate } = require('../middleware/validate');
const { param } = require('express-validator');

router.get('/',
  auth,
  async (req, res) => {
    try {
      const user = await User.findById(req.userID).populate({
        path: 'notes',
        populate: {
          path: 'collaborators',
          select: 'username email -_id'
        }
      }).lean();
      if (!user) { throw 'No user found'; }

      res.status(200).json({
        notes: user.notes,
        pinnedNotes: user.pinnedNotes,
        invites: user.invites,
        email: user.email,
        username: user.username
      });
    } catch (err) {
      res.sendStatus(500);
    }
  }
);

// delete users account
router.delete('/:pass',
  validate([param('pass').notEmpty()]),
  auth,
  async (req, res) => {
    try {
      const user = await User.findById(req.userID).select('password notes').lean();
      if (!user) { throw 'user not found'; }

      const isCorrectPass = await bcryptjs.compare(req.params.pass, user.password);
      if (!isCorrectPass) {
        return res.status(400).json({ msg: 'Incorrect password.' });
      }

      // delete user, delete user's notes if only collaborator,
      // & remove user if note has other collaborator
      await Promise.all([
        User.deleteOne({ _id: user._id }),
        Note.deleteMany({ _id: { $in: user.notes }, collaborators: { $size: 1 } }),
        Note.updateMany(
          { _id: { $in: user.notes }, 'collaborators.1': { $exists: true } },
          { $pull: { collaborators: user._id } }
        )
      ]);

      res.sendStatus(200);
    } catch (err) {
      res.sendStatus(500);
    }
  }
);

module.exports = router;
