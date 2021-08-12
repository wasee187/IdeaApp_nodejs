const { validationResult } = require('express-validator');

const categoryValidator = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.status(400).send({ success: false, message: error.array()[0].msg });
  } else {
    next();
  }
};

module.exports = {
  categoryValidator,
};
