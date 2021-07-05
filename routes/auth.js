const express = require('express');
const router = express.Router();

//requiring passport
const passport = require('passport');
//require middleware
const { ensureGuest } = require('../middleware/authMiddleware');

//requiring validation
const {
  userSchemaValidators,
  loginSchemaValidator,
} = require('../validators/userValidators');

const {
  addUserValidator,
  loginValidator,
} = require('../validators/userValidator');

//requiring controller
const {
  regController,
  postRegisterController,
  getLoginController,
  postLoginController,
  getLogoutController,
} = require('../controller/authControllers');

//route for register
router.get('/register', ensureGuest, regController);

//route for adding user
router.post(
  '/register',
  userSchemaValidators(),
  addUserValidator,
  postRegisterController
);

//route for login
router.get('/login', ensureGuest, getLoginController);

//route to post login
router.post(
  '/login',
  loginSchemaValidator(),
  loginValidator,
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
    console.log(req.user);
    res.redirect('/ideas');
  }
);

module.exports = router;
