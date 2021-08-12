//require express rate limit
const rateLimit = require('express-rate-limit');

//configuring express rate limit
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 1 requests per windowMs
  message: 'Too many account creating attempts',
});

const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 1 requests per windowMs
  message: 'Too many login attempts',
});

const forgetPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 1 requests per windowMs
  message: 'Too many password reset attempts',
});

module.exports = {
  registerLimiter,
  forgetPasswordLimiter,
  loginLimiter,
};
