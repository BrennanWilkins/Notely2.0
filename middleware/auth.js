const jwt = require('jsonwebtoken');

// verify jwt token from user, if valid set user properties to req object
module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) { return res.status(401); }

  jwt.verify(token, process.env.AUTH_KEY, (err, decoded) => {
    if (err) { return res.status(401); }
    const { userID, email, username } = decoded;
    if (!userID || !email || !username) { return res.status(401); }

    req.userID = userID;
    req.email = email;
    req.username = username;

    next();
  });
};
