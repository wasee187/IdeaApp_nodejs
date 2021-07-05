const { validationResult } = require('express-validator');

const addIdeaValidator = (req, res, next) => {
  const allowComments = req.body.allowComments ? true : false;
  req.body.allowComments = allowComments;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('ideas/new', {
      title: 'Add Idea',
      path: '/ideas/new',
      errMsg: errors.array()[0].msg,
      idea: {
        title: req.body.title,
        description: req.body.description,
        allowComments,
        status: req.body.status,
        tags: req.body.tags,
      },
    });
  } else {
    next();
  }
};

module.exports = addIdeaValidator;
