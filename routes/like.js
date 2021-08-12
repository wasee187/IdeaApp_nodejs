const express = require('express');
const router = express.Router();
//import controllers
const {
  postLikesController,
  getLikeCountController,
} = require('../controller/likeControllers');

//requiring auth middleware
const { isAuth } = require('../middleware/authMiddleware');

//************Routes for like****************//

//add or delete likes route
router.post('/', isAuth, postLikesController);

//get likes count route
router.get('/:id', getLikeCountController);

module.exports = router;
