const { validationResult } = require('express-validator');
//requiring idea model
const Idea = require('../models/ideas');
//requiring doc generate helper
const generateIdeaDoc = require('../helpers/docGener');

const commentValidator = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const id = req.params.id;
    try {
      const idea = await Idea.findById(id);
      const ideaDoc = generateIdeaDoc(idea._id, idea.title);
      res.render('comments/new', {
        title: 'Add Comment',
        errMsg: error.errors[0].msg,
        ideaDoc,
        comTitle: req.body.title,
        comText: req.body.text,
      });
    } catch (err) {
      res.render('pages/notFound', {
        title: 'Not Found',
      });
    }
  } else {
    next();
  }
};

module.exports = commentValidator;
