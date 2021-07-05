const { check } = require('express-validator');

const ideaValidators = () => {
  return [
    check('title')
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 10, max: 100 })
      .withMessage('Title must be in between 10 to 50 characters long')
      .trim(),

    check(
      'description',
      'Description must be less than 20000 characters'
    ).isLength({ max: 20000 }),

    check('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(['public', 'private'])
      .withMessage('Status must public or private'),

    check('tags')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Idea must have at least one tag'),
  ];
};

module.exports = ideaValidators;
