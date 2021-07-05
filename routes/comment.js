const express = require('express');
const router = express.Router({ mergeParams: true });
const { isAuth, checkCommentOwner } = require('../middleware/authMiddleware');

//requiring comment controllers
const {
  addCommentController,
  postCommentController,
  deleteCommentController,
} = require('../controller/commentController');

//requiring comments validator
const commentValidators = require('../validators/commentValidators');
const commentValidator = require('../validators/commentValidator');

//get comment form router
router.get('/new', isAuth, addCommentController);

//post comment
router.post(
  '/',
  isAuth,
  commentValidators(),
  commentValidator,
  postCommentController
);

//delete method /ideas/:id/comments/:comment_id
router.delete(
  '/:comment_id',
  isAuth,
  checkCommentOwner,
  deleteCommentController
);

module.exports = router;
