//requiring User model
const Idea = require('../models/ideas');
//requiring comment model
const { Comment } = require('../models/comments');

//requiring docGener
const { generateIdeaDoc } = require('../helpers/docGener');

//get comments form controller
const addCommentController = async (req, res) => {
  const id = req.params.id;

  try {
    //get idea
    const idea = await Idea.findById(id);
    if (idea) {
      const ideaDoc = generateIdeaDoc(idea);
      res.render('comments/new', {
        title: 'Add a comment',
        idea: ideaDoc,
      });
    } else {
      res.status(404).render('pages/notFound', {
        title: 'Not Found',
      });
    }
  } catch (err) {
    res.status(500).render('pages/error', {
      title: 'Error',
    });
  }
};

//post comment controller
const postCommentController = async (req, res) => {
  const id = req.params.id;

  try {
    const idea = await Idea.findById(id);

    if (idea) {
      const comment = new Comment({
        ...req.body,
        idea: idea.id,
        user: {
          id: req.user._id,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
        },
      });

      await comment.save();
      //saving idea
      await idea.save();
      req.flash('success_msg', 'Comment added');
      //redirecting
      res.redirect(`/ideas/${id}`);
    } else {
      res.status(404).render('pages/notFound', {
        title: 'Not Found',
      });
    }
  } catch (err) {
    res.status(500).render('pages/error', {
      title: 'Error',
    });
  }
};

//delete comment controller
const deleteCommentController = async (req, res) => {
  const id = req.params.id;
  const comment_id = req.params.comment_id;
  //get idea
  try {
    const idea = await Idea.findById(id);
    if (idea) {
      await Comment.findByIdAndDelete(comment_id);
      req.flash('success_msg', 'Comment deleted!');
      //redirecting
      res.redirect(`/ideas/${id}`);
    } else {
      res.render('pages/notFound', {
        title: 'Not Found',
      });
    }
  } catch (err) {
    res.status(500).render('pages/error', {
      title: 'Error',
    });
  }
};

//get Comment Count Controller

const getCommentCountController = async (req, res) => {
  const ideaId = req.params.id;
  try {
    const idea = await Idea.findById(ideaId).populate('comments');
    if (idea) {
      const count = idea.comments.length;
      res.status(200).send({ success: true, count });
    } else {
      res.status(500).send({ success: false, message: 'Idea is not found' });
    }
  } catch (err) {
    res.status(500).render('pages/error', {
      title: 'Error',
    });
  }
};
module.exports = {
  addCommentController,
  postCommentController,
  deleteCommentController,
  getCommentCountController,
};
