const mongoose = require('mongoose');
const _ = require('lodash');

//require async Middleware
const asyncMiddleware = require('../middleware/asyncMiddleware');
//require Idea module
const Idea = require('../models/ideas');
const { Comment } = require('../models/comments');

//require generate idea doc function
const { generateIdeaDoc, generateCommentDoc } = require('../helpers/docGener');

//getting all ideas
const getIdeasController = asyncMiddleware(async (req, res, next) => {
  const allIdeas = await Idea.find({ status: 'public' });
  const contexts = {
    ideasDocuments: allIdeas.map((idea) => generateIdeaDoc(idea)),
  };
  res.render('ideas/index', {
    ideas: contexts.ideasDocuments,
    title: 'All Ideas',
    path: '/ideas',
  });
});

//add idea form controller
const addIdeaFormController = (req, res) => {
  res.render('ideas/new', {
    title: 'Add Idea',
    path: '/ideas/new',
  });
};

//single idea controller
const getIdeaController = asyncMiddleware(async (req, res, next) => {
  const id = req.params.id;
  let commentsDoc;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.render('pages/notFound', {
      title: 'Not Found',
    });
  }
  const idea = await Idea.findById(id).populate('comments');

  //generating context comment doc
  if (idea.comments) {
    commentsDoc = idea.comments.map((comment) => generateCommentDoc(comment));
  }

  if (idea) {
    const ideaDocument = generateIdeaDoc(idea);
    ideaDocument.comments = commentsDoc;
    res.render('ideas/show', {
      idea: ideaDocument,
      title: ideaDocument.title,
    });
  } else {
    res.status(404).render('pages/notFound', {
      title: 'Not Found',
    });
  }
});

//get edit idea form controller
const getEditIdeaFormController = asyncMiddleware(async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.render('pages/notFound', {
      title: 'Not Found',
    });
  }

  const idea = await Idea.findById(id);

  if (idea) {
    const ideaDocument = generateIdeaDoc(idea);
    res.render('ideas/edit', {
      title: 'Edit Idea',
      idea: ideaDocument,
    });
  } else {
    res.status(404).render('pages/notFound', {
      title: 'Not Found',
    });
  }
});

//add idea controller
const postAddIdeaController = asyncMiddleware(async (req, res, next) => {
  req.body.tags = req.body.tags.split(',');
  const idea = new Idea({
    ...req.body,
    allowComments: req.body.allowComments,
    user: {
      id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
    },
  });
  await idea.save();

  req.flash('success_msg', 'Idea added successfully');
  //redirect
  res.redirect('/ideas');
});

//update idea controller
const putUpdateIdeaController = asyncMiddleware(async (req, res, next) => {
  const id = req.params.id;
  req.body.tags = req.body.tags.split(',');
  const pickedValue = _.pick(req.body, [
    'title',
    'description',
    'allowComments',
    'status',
    'tags',
  ]);

  const idea = await Idea.findByIdAndUpdate(id, pickedValue);
  if (idea) {
    req.flash('success_msg', 'Idea updated successfully');
    //redirecting
    res.redirect(`/ideas/${id}`);
  } else {
    res.status(404).render('pages/notFound', {
      title: 'Not Found',
    });
  }
});

//delete idea controller
const deleteIdeaController = asyncMiddleware(async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.render('pages/notFound', {
      title: 'Not Found',
    });
  }

  //get the idea
  const ideaToRemove = await Idea.findById(id);
  const idea = await ideaToRemove.remove();
  if (idea) {
    req.flash('success_msg', 'Idea deleted successfully');
    res.redirect('/ideas');
  } else {
    res.status(404).render('pages/notFound', {
      title: 'Not Found',
    });
  }
});

//export controller
module.exports = {
  getIdeasController,
  addIdeaFormController,
  getIdeaController,
  getEditIdeaFormController,
  postAddIdeaController,
  putUpdateIdeaController,
  deleteIdeaController,
};
