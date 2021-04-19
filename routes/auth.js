const router = require('express').Router();
const User = require('../models/user');
const Note = require('../models/note');
const { body, param } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { validate, passwordRE } = require('../middleware/validate');
const auth = require('../middleware/auth');
const sendMail = require('../utils/sendMail');
const baseURL = require('../utils/baseURL');

const signToken = async (user, expiration) => {
  // create jwt token that expires in given expiration days when logging in
  const jwtPayload = { email: user.email, username: user.username, userID: user._id };
  const token = await jwt.sign(jwtPayload, process.env.AUTH_KEY, { expiresIn: expiration });
  return token;
};

router.post('/signup',
  validate(
    [body('email').isEmail(),
    body('username').isAlphanumeric().isLength({ min: 1, max: 50 }),
    body('pass').matches(passwordRE),
    body('rememberUser').isBoolean()]
  ),
  async (req, res) => {
    try {
      const { email, pass, username, rememberUser } = req.body;

      // check if email exists already
      const emailExists = await User.exists({ email });
      if (emailExists) { return res.status(400).json({ msg: 'That email is already taken.' }); }

      // check if username taken
      const usernameExists = await User.exists({ username });
      if (usernameExists) { return res.status(400).json({ msg: 'That username is already taken.' }); }

      const hashedPassword = await bcryptjs.hash(pass, 10);

      // signup token expires in 8 hrs
      const signupID = await jwt.sign({ email, rememberUser }, process.env.AUTH_KEY, { expiresIn: '8h' });

      const user = new User({
        email,
        username,
        password: hashedPassword,
        invites: [],
        notes: [],
        pinnedNotes: [],
        recoverPassID: null,
        signupID
      });
      await user.save();

      // send link to provided email with hash to finish signup
      const hRef = `${baseURL}/finish-signup?token=${signupID}`;
      await sendMail(
        email,
        'Finish signing up for Notely',
        `
        <h1>Welcome to Notely!</h1>
        <h2>Click on the link below to finish signing up.</h2>
        <p><a href="${hRef}">Sign up</a></p>
        `
      );

      res.sendStatus(200);
    } catch(err) { res.status(500).json({ msg: 'There was an error while signing up.' }); }
  }
);

router.get('/finishSignup/:signupID',
  validate([param('signupID').notEmpty()]),
  (req, res) => {
    const signupID = req.params.signupID;
    jwt.verify(signupID, process.env.AUTH_KEY, async (err, decoded) => {
      try {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            await User.deleteOne({ email: decoded.email, signupID });
            return res.status(400).json({ msg: 'Your signup link has expired. Try signing up again.' });
          }
          throw err;
        }
        const user = await User.findOne({ email: decoded.email });
        if (user.signupID === null) {
          return res.status(400).json({ msg: 'Your account has already been signed up.' });
        }
        user.signupID = null;
        await user.save();

        // if user chose remember me in signup, token expires in 30 days, else 7 days
        const token = await signToken(user, decoded.rememberUser ? '30d' : '7d');

        const firstNote = new Note({
          body: [{ type: 'paragraph', children: [{ text: 'Welcome to Notely!' }]}],
          tags: [],
          collaborators: [user._id],
          publishID: null,
          isTrash: false
        });
        await firstNote.save();

        res.status(200).json({
          token,
          notes: [firstNote],
          pinnedNotes: [],
          invites: [],
          email: user.email,
          username: user.username
        });
      } catch (err) { res.status(500).json({ msg: 'There was an error while finishing your signup.' }); }
    });
  }
);

router.post('/login',
  validate([
    body('loginName').notEmpty(),
    body('pass').notEmpty(),
    body('rememberUser').isBoolean()
  ]),
  async (req, res) => {
    try {
      const { loginName, pass, rememberUser } = req.body;
      // if loginName includes '@' then user logging in with email, else with username
      const userQuery = loginName.includes('@') ? { email: loginName } : { username: loginName };
      const user = await User.findOne(userQuery);

      const errMsg = userQuery.email ? 'Incorrect email or password.' : 'Incorrect username or password.';
      if (!user) {
        return res.status(400).json({ msg: errMsg });
      }

      if (user.signupID) {
        return res.status(400).json({ msg: 'Please click on the link sent to your email to finish signing up.' });
      }

      // verify password
      const isValidPass = await bcryptjs.compare(pass, user.password);
      if (!isValidPass) {
        return res.status(400).json({ msg: errMsg });
      }

      // user logged in so no longer needs password recovery token if was generated
      if (user.recoverPassID) { await User.updateOne({ _id: user._id }, { recoverPassID: null }); }

      const token = await signToken(user, rememberUser ? '30d' : '7d');

      await user.populate({
        path: 'notes',
        populate: {
          path: 'collaborators',
          select: 'username email -_id'
        }
      }).execPopulate();

      res.status(200).json({
        token,
        notes: user.notes,
        pinnedNotes: user.pinnedNotes,
        invites: user.invites,
        email: user.email,
        username: user.username
      });
    } catch (err) { res.status(500).json({ msg: 'There was an error while logging in.' }); }
  }
);

router.post('/resetPass',
  validate([
    body('recoverPassID').notEmpty(),
    body('newPass').matches(passwordRE),
  ]),
  async (req, res) => {
    try {
      const { recoverPassID, newPass } = req.body;
      jwt.verify(recoverPassID, process.env.AUTH_KEY, async (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            const user = await User.updateOne({ email: decoded.email, recoverPassID }, { recoverPassID: null });
            if (!user) { return res.status(400).json({ msg: 'Your recovery link is not valid.' }); }
            return res.status(400).json({ msg: 'Your recovery link has expired.' });
          }
          throw err;
        }
        try {
          const hashedPass = await bcryptjs.hash(newPass, 10);
          await User.updateOne({ email: decoded.email }, { recoverPassID: null, password: hashedPass });
        } catch (err) { throw err; }
      });

      res.sendStatus(200);
    } catch (err) { res.status(500).json({ msg: 'There was an error while changing your password.' }); }
  }
);

router.post('/forgotPass',
  validate([body('email').isEmail()]),
  async (req, res) => {
    try {
      const email = req.body.email;
      const user = await User.findOne({ email });
      if (!user) { return res.status(400).json({ msg: 'No user was found for the provided email.' }); }

      // jwt token expires in 8hr to recover password
      const recoverPassID = await jwt.sign({ email }, process.env.AUTH_KEY, { expiresIn: '8h' });

      user.recoverPassID = recoverPassID;
      await user.save();

      // send email to user with link to reset password
      const hRef = `${baseURL}/reset-password?token=${recoverPassID}`;
      await sendMail(
        email,
        'Reset your Notely password',
        `
        <h2>Please click on the link below to reset your password.</h2>
        <p><a href="${hRef}">Reset password</a></p>
        `
      );

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.post('/changePass',
  auth,
  validate([
    body('oldPass').notEmpty(),
    body('newPass').matches(passwordRE)
  ]),
  async (req, res) => {
    try {
      const { oldPass, newPass } = req.body;
      const user = await User.findById(req.userID);
      if (!user) { throw 'User not found'; }

      // verify correct old pass & new pass not same as old
      const [isValidPass, isSamePass] = await Promise.all([
        bcryptjs.compare(oldPass, user.password),
        bcryptjs.compare(newPass, user.password)
      ]);
      if (!isValidPass) {
        return res.status(400).json({ msg: 'Your old password is not correct.' });
      }
      if (isSamePass) {
        return res.status(400).json({ msg: 'Your new password cannot be the same as your old password.' });
      }

      const hashedPass = await bcryptjs.hash(newPass, 10);
      user.password = hashedPass;
      await user.save();

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

module.exports = router;
