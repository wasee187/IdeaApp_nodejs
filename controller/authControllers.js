//requiring User model
const User = require('../models/users');

//register controller
const regController = (req, res) => {
  res.render('auth/register', {
    title: 'Register',
    path: '/auth/register',
  });
};

//addUser controller
const postRegisterController = async (req, res) => {
  const user = new User(req.body);
  await user.save();
  req.flash('success_msg', 'Successfully registered. Please login');
  res.redirect('/auth/login');
};

//login controller
const getLoginController = (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    path: '/auth/login',
  });
};

//post login controller
const postLoginController = (req, res) => {
  req.flash('success_msg', 'Successfully logged in');
  res.redirect('/ideas');
};

//logout controller

const getLogoutController = async (req, res) => {
  // res.clearCookie('isLoggedIn');
  // await req.session.destroy();
  req.logout();
  req.flash('success_msg', 'Successfully logged out');
  res.redirect('/auth/login');
};

module.exports = {
  regController,
  postRegisterController,
  getLoginController,
  postLoginController,
  getLogoutController,
};
