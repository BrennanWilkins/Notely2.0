const router = require('express').Router();
const User = require('../models/user');
const { body, param } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const validate = require('../middleware/validate');
const nodemailer = require('nodemailer');

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
    body('pass').matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#$@!%&*?])[\w\d#$@!%&*?]{8,100}$/),
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
      if (usernameExists) { return res.status(400).json({ msg: 'That username is already taken' }); }

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

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        tls: { rejectUnauthorized: false },
        auth: {
          user: process.env.NOTELY_EMAIL,
          pass: process.env.NOTELY_PASS
        }
      });

      // send link to provided email with hash to finish signup
      const hRef = `http://localhost:3000/finish-signup?token=${signupID}`;
      const mailOptions = {
        from: process.env.NOTELY_EMAIL,
        to: email,
        subject: 'Finish signing up for Notely',
        html: `<h1>Welcome to Notely!</h1><h2>Click on the link below to finish signing up.</h2><p><a href="${hRef}">Sign up</a></p>`
      };
      await transporter.sendMail(mailOptions);

      res.sendStatus(200);
    } catch(err) { res.status(500).json({ msg: 'There was an error while signing up.' }); }
  }
);

router.get('/finishSignup/:signupID',
  validate([param('signupID').notEmpty()]),
  (req, res) => {
    jwt.verify(req.params.signupID, process.env.AUTH_KEY, async (err, decoded) => {
      try {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            await User.deleteOne({ email: decoded.email });
            return res.status(400).json({ msg: 'Your signup link has expired. Try signing up again.' });
          }
          throw err;
        }
        const user = await User.findOneAndUpdate({ email: decoded.email }, { signupID: null });

        // if user chose remember me in signup, token expires in 30 days, else 7 days
        const token = await signToken(user, decoded.rememberMe ? '30d' : '7d');

        res.status(200).json({
          email: user.email,
          username: user.username,
          token
        });
      } catch (err) { res.status(500).json({ msg: 'There was an error while finishing your signup.' }); }
    });
  }
);

module.exports = router;
