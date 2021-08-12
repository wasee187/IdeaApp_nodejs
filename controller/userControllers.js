//requiring user model
const User = require('../models/users');
//requiring Category model
const Category = require('../models/category');
//requiring Idea model
const Idea = require('../models/ideas');
//requiring sharp
const sharp = require('sharp');
//requiring file system
const fs = require('fs');
//requiring util
const util = require('util');
const deleteFilePromise = util.promisify(fs.unlink);

//requiring nodemailer
const nodemailer = require('nodemailer');
//requiring mail config
const mailConfig = require('../config/mail');
//requiring farewell email function
const { farewellEmail } = require('../email/account');

//configure transporter
const transporter = nodemailer.createTransport(mailConfig);

//require async Middleware
const asyncMiddleware = require('../middleware/asyncMiddleware');

//requiring user generate doc
const {
  generateUserDoc,
  generateCategoryDoc,
  generateIdeaDoc,
} = require('../helpers/docGener');

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

  if (req.file) {
    const filename = Date.now() + req.file.originalname;
    //resizing profile picture
    await sharp(req.file.buffer)
      .resize({
        width: 150,
        height: 150,
      })
      .png()
      .toFile(`./uploads/users/${filename}`);
    //modifying picked image value object
    pickedValue.image = filename;

    //logged in with google
    if (req.user.imageURL) {
      req.user.imageURL = undefined;
      await req.user.save({ validateBeforeSave: false });
    }

    //deleting image
    if (req.user.image) {
      deleteFilePromise(`./uploads/users/${req.user.image}`);
    }
  }
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
  const page = +req.query.page || 1;
  const item_per_page = 1;
  try {
    //getting specific user data
    const user = await User.findById(id).populate({
      path: 'ideas',
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });
    //getting all ideas
    const allIdeas = await Idea.find();
    //getting all ideas contexts
    const ideasContexts = allIdeas.map((idea) => generateIdeaDoc(idea));
    //getting all category
    const allCategories = await Category.find();
    //creating context for hbs error
    const categoryContexts = allCategories.map((category) =>
      generateCategoryDoc(category)
    );

    if (user) {
      const contextIdeas = user.ideas.map((idea) => generateIdeaDoc(idea));
      //filtering public ideas
      const publicIdeas = contextIdeas.filter(
        (idea) => idea.status === 'public'
      );
      const totalPublicIdeasCount = publicIdeas.length;
      //ideas to pass to pagination
      const userPublicIdeasToPass = publicIdeas.splice(
        (page - 1) * item_per_page,
        item_per_page
      );
      //getting allIDe
      res.render('ideas/index', {
        title: `All ideas by ${user.firstName}`,
        id: user.id,
        ideas: userPublicIdeasToPass,
        firstName: user.firstName,
        categories: categoryContexts,
        ideasTags: ideasContexts,
        currentPage: page,
        previousPage: page - 1,
        nextPage: page + 1,
        hasPreviousPage: page > 1,
        hasNextPage: page * item_per_page < totalPublicIdeasCount,
        lastPage: Math.ceil(totalPublicIdeasCount / item_per_page),
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
    transporter.sendMail(farewellEmail(user.email));
    if (user) {
      req.logout();
      req.flash('success_msg', 'Your information deleted successfully');
      //deleting image
      if (user.image) {
        deleteFilePromise(`./uploads/users/${req.user.image}`);
      }
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
