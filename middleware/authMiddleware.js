//requiring idea model
const Idea = require('../models/ideas');
const { Comment } = require('../models/comments');

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('error_msg', 'Please login to perform the action');
    res.redirect('/auth/login');
  }
};

const checkOwnership = async (req, res, next) => {
  const id = req.params.id;
  const idea = await Idea.findById(id);

  if (idea) {
    if (idea.user.id.equals(req.user._id)) {
      next();
    } else {
      req.flash(
        'error_msg',
        'You do not have permission to perform this action'
      );
      res.redirect('back');
    }
  } else {
    req.flash('error_msg', 'Idea nor found');
    res.redirect('back');
  }
};

const checkCommentOwner = async (req, res, next) => {
  const comment_id = req.params.comment_id;
  const comment = await Comment.findById(comment_id);
  if (comment) {
    if (comment.user.id.equals(req.user._id)) {
      next();
    } else {
      req.flash(
        'error_msg',
        'You do not have permission to perform this action'
      );
      res.redirect('back');
    }
  } else {
    req.flash('error_msg', 'Comment not found');
    res.redirect('back');
  }
};

const ensureGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/users/me/ideas');
  } else {
    next();
  }
};

const ensureAdmin = (req, res, next) => {
  if (req.user.role === 1) {
    next();
  } else {
    req.flash('error_msg', 'You do not have permission to perform this action');
    res.redirect('back');
  }
};
module.exports = {
  isAuth,
  checkOwnership,
  checkCommentOwner,
  ensureGuest,
  ensureAdmin,
};
