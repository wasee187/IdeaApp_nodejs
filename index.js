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

//requiring csruf
const csrf = require('csurf');
//requiring helmet
// const helmet = require('helmet');
//requiring express mongoose sanitize
const mongoSanitizer = require('express-mongo-sanitize');
//requiring xss-clean
var xss = require('xss-clean');
//require compression
const compression = require('compression');

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
//importing category routes
const categoryRoutes = require('./routes/category');
//importing comment routes
const commentRoutes = require('./routes/comment');
//importing like routes
const likeRoutes = require('./routes/like');
//import error middleware
const errMiddleware = require('./middleware/errMiddleware');

//db import
const { url, connectDB } = require('./config/db');
//calling connectDB
connectDB();

//configure connect mongo for session save
const store = MongoStore.create({ mongoUrl: url });
const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  store,
  saveUninitialized: false,
  name: 'myApp',
  cookie: {
    maxAge: 2 * 60 * 100 * 1000,
    httpOnly: true,
    sameSite: 'lax',
  },
};

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
//change session option based on env
if (app.get('env') === 'production') {
  sessionOptions.proxy = true;
  sessionOptions.cookie.secure = true;
}
//session middleware
app.use(session(sessionOptions));

//flash message middleware
app.use(flash());
//middleware for passport
app.use(passport.initialize());
app.use(passport.session());

//for parsing json data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//compress response
app.use(compression());
//sanitize user data to prevent nosql injection attack (operator)
app.use(mongoSanitizer());

//xss protection
app.use(xss());
//csrf token middleware
app.use(csrf());
//set different headers by helmet
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'", 'https://cdnjs.com/'],
//         styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
//         imgSrc: ["'self'", 'https://cdnjs.com/', 'data:'],
//         connectSrc: ["'self'", 'https://cdnjs.com/'],
//         fontSrc: ["'self'", 'https://fonts.gstatic.com'],
//         // objectSrc: ["'self'"],
//         // mediaSrc: ["'self'"],
//         // frameSrc: ["'self'"],
//       },
//       // reportOnly: true,
//     },
//   })
// );
app.disable('x-powered-by');
//local variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.user_id = (req.user && req.user._id) || null;
  res.locals.user_firstName = (req.user && req.user.firstName) || null;
  res.locals.isAdmin = req.user && req.user.role;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error = req.flash('error');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//uploads folder publicly accessible from browser
app.use(express.static(path.join(__dirname, 'uploads')));

////*************Routing part******/
//auth router
app.use('/auth', authRoutes);
//all idea route
app.use('/ideas', ideaRoutes);
//user route
app.use('/users', userRoutes);
//category routes
app.use('/categories', categoryRoutes);
//comment route
app.use('/ideas/:id/comments', commentRoutes);
//like route
app.use('/likes', likeRoutes);

//all page routes

app.use(pageRoutes);

//error middleware
app.use(errMiddleware);

const port = process.env.PORT || 3000;
//creating server and listening to port
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
