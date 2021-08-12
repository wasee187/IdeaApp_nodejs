const express = require('express');
const router = express.Router();

//requiring passport
const passport = require('passport');
//require middleware
const { ensureGuest } = require('../middleware/authMiddleware');
const {
  registerLimiter,
  forgetPasswordLimiter,
  loginLimiter,
} = require('../middleware/limiter');
//requiring validation
const {
  userSchemaValidators,
  loginSchemaValidator,
  forgetPassValidators,
  resetPassValidators,
} = require('../validators/userValidators');

const {
  addUserValidator,
  loginValidator,
  forgetPassValidator,
  resetPassValidator,
} = require('../validators/userValidator');

//requiring controller
const {
  regController,
  postRegisterController,
  getLoginController,
  postLoginController,
  getLogoutController,
  accountActivationController,
  forgetPasswordFormController,
  forgetPasswordController,
  getResetPasswordController,
  postResetPasswordController,
} = require('../controller/authControllers');

//route for register
router.get('/register', ensureGuest, regController);

//route for adding user
router.post(
  '/register',
  userSchemaValidators(),
  addUserValidator,
  registerLimiter,
  postRegisterController
);

//route for login
router.get('/login', ensureGuest, getLoginController);

//route to post login
router.post(
  '/login',
  loginSchemaValidator(),
  loginValidator,
  loginLimiter,
  passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: true,
    path: '/auth/login',
  }),
  postLoginController
);

//logout route
router.get('/logout', getLogoutController);

//route for google login
router.get(
  '/google',
  ensureGuest,
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  (req, res, next) => {
    res.redirect('/ideas');
  }
);

//activate account
router.get('/activate/:token', accountActivationController);

//forget password form route
router.get('/forget-password', forgetPasswordFormController);

//forget password post routes
router.post(
  '/forget-password',
  forgetPassValidators(),
  forgetPassValidator,
  forgetPasswordLimiter,
  forgetPasswordController
);

//reset password
router.get('/reset-password/:token', getResetPasswordController);
//rest password post request
router.post(
  '/reset-password',
  resetPassValidators(),
  resetPassValidator,
  postResetPasswordController
);
module.exports = router;
