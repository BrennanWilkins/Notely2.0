const jwt = require('jsonwebtoken');

// verify jwt token from user, if valid set user properties to req object
module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) { return res.status(401); }

  jwt.verify(token, config.get('AUTH_KEY'), (err, decoded) => {
    if (err) { return res.status(401); }

    req.userID = decoded.userID;
    req.email = decoded.email;
    req.username = decoded.username;

    next();
  });
};
