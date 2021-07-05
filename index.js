const express = require('express');
require('dotenv').config();
const exphbs = require('express-handlebars');
const _ = require('lodash');
const methodOverride = require('method-override');
const path = require('path');
//session require
const session = require('express-session');
//requiring connect mongo
const MongoStore = require('connect-mongo');
//requiring flash connect
const flash = require('connect-flash');
//requiring passport
const passport = require('passport');
//requiring local passport
require('./config/passport').localStrategy(passport);
require('./config/passport').googleStrategy(passport);

const {
  compareValues,
  truncateContent,
  formatDate,
  checkArthur,
} = require('./helpers/hbs');

//importing idea router
const ideaRoutes = require('./routes/idea');
//importing page router
const pageRoutes = require('./routes/page');
//importing user routes
const userRoutes = require('./routes/user');
//importing auth router
const authRoutes = require('./routes/auth');
//importing comment routes
const commentRoutes = require('./routes/comment');
//import error middleware
const errMiddleware = require('./middleware/errMiddleware');

//db import
const { url, connectDB } = require('./config/db');
//calling connectDB
connectDB();

//configure connect mongo for session save
const store = MongoStore.create({ mongoUrl: url });

//configure express
const app = express();
app.engine(
  '.hbs',
  exphbs({
    extname: '.hbs',
    helpers: {
      compareValues,
      truncateContent,
      formatDate,
      checkArthur,
    },
  })
);
app.set('view engine', '.hbs');

//******************middleware *******************
//session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    store,
    saveUninitialized: false,
    cookie: {
      maxAge: 2 * 60 * 100 * 1000,
      httpOnly: true,
      sameSite: 'lax',
    },
  })
);

//flash message middleware
app.use(flash());
//middleware for passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.user_id = (req.user && req.user._id) || null;
  res.locals.user_firstName = (req.user && req.user.firstName) || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error = req.flash('error');
  res.locals.error_msg = req.flash('error_msg');
  next();
});
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

////*************Routing part******/
//auth router
app.use('/auth', authRoutes);
//all idea route
app.use('/ideas', ideaRoutes);
//user route
app.use('/users', userRoutes);
//comment route
app.use('/ideas/:id/comments', commentRoutes);

//all page routes

app.use(pageRoutes);

//error middleware
app.use(errMiddleware);

//creating server and listening to port
app.listen('3000', () => {
  console.log('Server is listening on port 3000');
});
