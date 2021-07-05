const { check } = require('express-validator');

const User = require('../models/users');

const userSchemaValidators = () => {
  return [
    check('firstName')
      .notEmpty()
      .withMessage('FirstName is required')
      .trim()
      .isLength({ max: 15 })
      .withMessage('FirstName should be less than 15 characters'),

    check('lastName')
      .notEmpty()
      .withMessage('lastName is required')
      .trim()
      .isLength({ max: 15 })
      .withMessage('lastName should be less than 15 characters'),
    check('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid Email')
      .trim()
      .normalizeEmail(),
    check('email').custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error('Email is already in use');
      } else {
        return true;
      }
    }),
    check('password')
      .notEmpty()
      .withMessage('Password is required')
      .not()
      .isIn(['123456', 'god123', 'password'])
      .withMessage('Do not use a common word or 123456 as the password')
      .isLength({ max: 25, min: 6 })
      .withMessage('Password must have 5 to 15 characters'),
    check('confirmPassword')
      .notEmpty()
      .withMessage('Confirm password is required')
      .custom((confirmPassword, { req }) => {
        if (confirmPassword !== req.body.password) {
          throw new Error('Password must be same');
        } else {
          return true;
        }
      }),
  ];
};

const loginSchemaValidator = () => {
  return [
    check('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid Email'),

    check('password').notEmpty().withMessage('Password is required'),
  ];
};

const updateUserSchemaValidator = () => {
  return [
    check('firstName')
      .notEmpty()
      .withMessage('FirstName is required')
      .trim()
      .isLength({ max: 15 })
      .withMessage('FirstName should be less than 15 characters'),

    check('lastName')
      .notEmpty()
      .withMessage('lastName is required')
      .trim()
      .isLength({ max: 15 })
      .withMessage('lastName should be less than 15 characters'),
  ];
};
module.exports = {
  userSchemaValidators,
  loginSchemaValidator,
  updateUserSchemaValidator,
};
