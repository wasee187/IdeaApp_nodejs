const { validationResult } = require('express-validator');

const updateIdeaValidator = (req, res, next) => {
  const allowComments = req.body.allowComments ? true : false;
  req.body.allowComments = allowComments;
  const errors = validationResult(req);
  const id = req.params.id;
  if (!errors.isEmpty()) {
    return res.render('ideas/edit', {
      title: 'Edit Idea',
      errMsg: errors.array()[0].msg,
      idea: {
        id,
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

module.exports = updateIdeaValidator;
