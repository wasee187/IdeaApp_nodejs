//requiring user model
const User = require('../models/users');
//require async Middleware
const asyncMiddleware = require('../middleware/asyncMiddleware');

//requiring user generate doc
const { generateUserDoc, generateIdeaDoc } = require('../helpers/docGener');

const _ = require('lodash');

const getUserController = asyncMiddleware(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const userDoc = generateUserDoc(user);
    res.render('users/profile', {
      title: `Profile of ${user.firstName}`,
      path: '/users/me',
      user: userDoc,
    });
  } else {
    res.status(404).render('pages/notFound', {
      title: 'Not Found',
    });
  }
});

//edit user form controller
const getUserEditFormController = asyncMiddleware(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const userDoc = generateUserDoc(user);
    res.render('users/edit-profile', {
      title: `Edit Profile of ${user.firstName}`,
      user: userDoc,
      path: '/users/me',
    });
  } else {
    res.status(404).render('pages/notFound', {
      title: 'Not Found',
    });
  }
});

const updateUserController = asyncMiddleware(async (req, res) => {
  const pickedValue = _.pick(req.body, ['firstName', 'lastName']);
  const user = await User.findByIdAndUpdate(req.user._id, pickedValue);

  if (user) {
    req.flash('success_msg', 'Your information updated successfully');
    //redirecting
    res.redirect('/users/me');
  } else {
    res.status(404).render('pages/notFound', {
      title: 'Not Found',
    });
  }
});

//get user ideas controller
const getUserIdeasController = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).populate('ideas');

    if (user) {
      const contextIdeas = user.ideas.map((idea) => generateIdeaDoc(idea));
      const publicIdeas = contextIdeas.filter(
        (idea) => idea.status === 'public'
      );
      res.render('ideas/index', {
        title: `All ideas by ${user.firstName}`,
        ideas: publicIdeas,
        firstName: user.firstName,
        userRef: true,
      });
    } else {
      res.status(404).render('pages/notFound', {
        title: 'Not Found',
      });
    }
  } catch (err) {
    res.render('pages/error', {
      title: 'Error',
    });
  }
};

const deleteUserController = async (req, res) => {
  try {
    const user = await req.user.remove();
    if (user) {
      req.logout();
      req.flash('success_msg', 'Your information deleted successfully');
      //redirect
      res.redirect('/ideas');
    }
  } catch (err) {
    req.flash('error_msg', 'Problem occurred during deleting your account');
    res.redirect('back');
  }
};

//get dashboard controller
const getDashboardController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('ideas');

    if (user) {
      const contextIdeas = user.ideas.map((idea) => generateIdeaDoc(idea));

      res.render('users/dashboard', {
        title: `All ideas by ${user.firstName}`,
        ideas: contextIdeas,
        path: '/users/me/ideas',
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
module.exports = {
  getUserController,
  getUserEditFormController,
  updateUserController,
  getUserIdeasController,
  deleteUserController,
  getDashboardController,
};
