const { check } = require('express-validator');

const commentValidators = () => {
  return [
    check('title')
      .trim()
      .notEmpty()
      .withMessage('Comment title is required')
      .isLength({ max: 100 })
      .withMessage('Comment title must be less than 100 characters'),

    check('text')
      .isLength({ max: 1000 })
      .withMessage('Comment must be with in 1000 characters'),
  ];
};

module.exports = commentValidators;
