const { validationResult } = require('express-validator');
//requiring user model
const User = require('../models/users');
//require async Middleware
const asyncMiddleware = require('../middleware/asyncMiddleware');

//adding user validator
const addUserValidator = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    res.render('auth/register', {
      title: 'Register',
      path: '/auth/register',
      errMsg: error.array()[0].msg,
      userReg: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      },
    });
  } else {
    next();
  }
};

//login user validator
const loginValidator = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.render('auth/login', {
      title: 'Login',
      path: '/auth/login',
      errMsg: error.array()[0].msg,
      user: {
        email: req.body.email,
        password: req.body.password,
      },
    });
  } else {
    next();
  }
};

//update user validator
const updateUserValidator = async (req, res, next) => {
  const error = validationResult(req);
  try {
    const user = await User.findById(req.user._id);
    if (!error.isEmpty()) {
      res.render('users/edit-profile', {
        title: `Edit Profile of ${user.firstName}`,
        errMsg: error.array()[0].msg,
        user: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        },
        path: '/users/me',
      });
    } else {
      next();
    }
  } catch (err) {
    res.render('pages/error', {
      title: 'Error',
    });
  }
};
module.exports = { addUserValidator, loginValidator, updateUserValidator };
