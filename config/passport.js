//requiring passport local
const LocalStrategy = require('passport-local');
//requiring passport google
const GoogleStrategy = require('passport-google-oauth20');
//requiring user model
const User = require('../models/users');
//requiring bcrypt
const bcrypt = require('bcryptjs');
//requiring clientId, clientSecret
const { clientID, clientSecret } = require('../config/key');

const localStrategy = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
      },
      async (email, password, next) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return next(null, false, { message: 'Invalid email or password' });
          }

          const isMatch = await bcrypt.compare(password, user.password);

          if (isMatch) {
            return next(null, user);
          }

          next(null, false, { message: 'Invalid email or password' });
        } catch (err) {
          next(err);
        }
      }
    )
  );
  passport.serializeUser((user, next) => {
    next(null, user);
  });
  passport.deserializeUser(async (id, next) => {
    try {
      const user = await User.findById(id);
      next(null, user);
    } catch (err) {
      next(err);
    }
  });
};

const googleStrategy = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, next) => {
        try {
          // console.log(accessToken, refreshToken, profile);
          const profileToSave = {
            googleID: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
          };
          const foundUser = await User.findOne({ googleID: profile.id });
          if (foundUser) {
            next(null, foundUser);
          } else {
            const user = new User(profileToSave);
            await user.save({ validateBeforeSave: false });
            next(null, user);
          }
        } catch (err) {
          next(err);
        }
      }
    )
  );

  passport.serializeUser((user, next) => {
    next(null, user);
  });
  passport.deserializeUser(async (id, next) => {
    try {
      const user = await User.findById(id);
      next(null, user);
    } catch (err) {
      next(err);
    }
  });
};
module.exports = { localStrategy, googleStrategy };
