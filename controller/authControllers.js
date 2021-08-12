//requiring User model
const User = require('../models/users');
//requiring lodash
const _ = require('lodash');
//requiring welcome email function
const { welcomeEmail, passwordResetMail } = require('../email/account');
//requiring json web token
const jwt = require('jsonwebtoken');
//requiring nodemailer
const nodemailer = require('nodemailer');
//requiring mail config
const { devMailConfig, prodMailConfig } = require('../config/mail');

let mailConfig;
if (process.env.NODE_ENV === 'development') {
  mailConfig = devMailConfig;
} else if (process.env.NODE_ENV === 'production') {
  mailConfig = prodMailConfig;
}
//configuring transporter
const transporter = nodemailer.createTransport(mailConfig);
//requiring account activation secret
const { accountActivationSecret, resetPasskey } = require('../config/key');

//register controller
const regController = (req, res) => {
  res.render('auth/register', {
    title: 'Register',
    path: '/auth/register',
  });
};

//addUser controller
const postRegisterController = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const token = jwt.sign(
    { firstName, lastName, email, password },
    accountActivationSecret,
    { expiresIn: 5 * 60 }
  );

  // const user = new User(req.body);
  // await user.save();
  transporter.sendMail(welcomeEmail(email, token));

  req.flash('success_msg', 'Email sent. Please activate your account.');
  res.redirect('/auth/register');
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

//account activation controller
const accountActivationController = (req, res) => {
  const token = req.params.token;
  jwt.verify(token, accountActivationSecret, async (err, decoded) => {
    if (err) {
      req.flash('error_msg', 'Account activation failed, please try again');
      return res.redirect('/auth/register');
    }
    const { firstName, lastName, email, password } = decoded;
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      req.flash(
        'error_msg',
        'Your account is already activated. Please login.'
      );
      res.redirect('/auth/login');
    } else {
      const user = new User({
        firstName,
        lastName,
        email,
        password,
      });
      await user.save();
      req.flash('success_msg', 'Registration successful, Please login');
      res.redirect('/auth/login');
    }
  });
};

const forgetPasswordFormController = (req, res) => {
  res.render('auth/forget-password.hbs', {
    title: 'Forget Password',
    path: '/auth/login',
  });
};

const forgetPasswordController = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  //generating token
  const token = jwt.sign({ email }, resetPasskey, { expiresIn: 5 * 60 });

  //token store in db
  user.resetPasswordToken = token;
  await user.save({ validateBeforeSave: false });

  //sending mail
  transporter.sendMail(passwordResetMail(email, token));
  req.flash(
    'success_msg',
    'Reset password link was sent to your email. Please follow the instruction'
  );
  res.redirect('/auth/forget-password');
};

//reset password controller
const getResetPasswordController = (req, res) => {
  const token = req.params.token;
  jwt.verify(token, resetPasskey, async (err, decoded) => {
    if (err) {
      req.flash('error_msg', 'Password reset failed, please try again');
      return res.redirect('/auth/forget-password');
    }

    const { email } = decoded;
    //finding user by email and token
    const user = await User.findOne({ email, resetPasswordToken: token });
    if (user) {
      res.render('auth/reset-password', {
        title: 'Reset password',
        token,
        email,
      });
    } else {
      req.flash('error_msg', 'Password reset failed, please try again');
      return res.redirect('/auth/login');
    }
  });
};

//reset password post request
const postResetPasswordController = (req, res) => {
  const { token, email, password } = req.body;

  jwt.verify(token, resetPasskey, async (err, decoded) => {
    if (err) {
      req.flash('error_msg', 'Password reset failed, please try again');
      return res.redirect('/auth/forget-password');
    }

    //finding user by email and token
    const user = await User.findOne({ email, resetPasswordToken: token });
    if (user) {
      user.password = password;
      user.resetPasswordToken = undefined;

      await user.save();

      req.flash('success_msg', 'Password reset successfully. Please login.');
      res.redirect('/auth/login');
    } else {
      req.flash('error_msg', 'Password reset failed, please try again');
      return res.redirect('/auth/login');
    }
  });
};
module.exports = {
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
};
