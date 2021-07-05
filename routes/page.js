const express = require('express');
const router = express.Router();

//require page controller
const {
  homePageController,
  aboutPageController,
  notFoundPageController,
} = require('../controller/pagesControllers');
//require middleware
const { ensureGuest } = require('../middleware/authMiddleware');

//route for home page
router.get('/', ensureGuest, homePageController);

//route for about page
router.get('/about', aboutPageController);

//no found page
router.get('*', notFoundPageController);

module.exports = router;
