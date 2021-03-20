const { param, body, validationResult } = require('express-validator');

// run all validations, if any errors returns 400 error
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) { return next(); }

    res.sendStatus(400);
  };
};

module.exports = validate;
