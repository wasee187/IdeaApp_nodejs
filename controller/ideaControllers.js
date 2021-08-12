const mongoose = require('mongoose');
const _ = require('lodash');

//require async Middleware
const asyncMiddleware = require('../middleware/asyncMiddleware');
//require Idea module
const Idea = require('../models/ideas');
//requiring category model
const Category = require('../models/category');
//requiring sharp
const sharp = require('sharp');

//requiring file system
const fs = require('fs');
const util = require('util');
const deleteUploadFile = util.promisify(fs.unlink);

//require generate idea doc function
const {
  generateIdeaDoc,
  generateCommentDoc,
  generateCategoryDoc,
} = require('../helpers/docGener');

//***********************************All Idea controller function *****/

//getting all ideas
const getIdeasController = asyncMiddleware(async (req, res, next) => {
  const page = +req.query.page || 1;
  const item_per_page = 6;
  //getting total idea count
  const totalPublicIdeasCount = await Idea.find({
    status: 'public',
  }).countDocuments();
  //getting all ideas
  const allIdeas = await Idea.find();

  //getting all public ideas depending on page query
  const publicIdeas = await Idea.find({ status: 'public' })
    .skip((page - 1) * item_per_page)
    .sort({ createdAt: -1 })
    .limit(item_per_page);

  //getting all public ideas document to avoid handlebars error
  const publicIdeasContexts = publicIdeas.map((publicIdea) =>
    generateIdeaDoc(publicIdea)
  );

  //getting all ideas contexts
  const ideasContexts = allIdeas.map((idea) => generateIdeaDoc(idea));

  //get all categories
  const categories = await Category.find();

  //creating context for hbs error
  const categoryContexts = categories.map((category) =>
    generateCategoryDoc(category)
  );

  res.render('ideas/index', {
    title: 'All Ideas',
    categories: categoryContexts,
    ideasTags: ideasContexts,
    ideas: publicIdeasContexts,
    currentPage: page,
    previousPage: page - 1,
    nextPage: page + 1,
    hasPreviousPage: page > 1,
    hasNextPage: page * item_per_page < totalPublicIdeasCount,
    lastPage: Math.ceil(totalPublicIdeasCount / item_per_page),
    path: '/ideas',
  });
});

//add idea form controller
const addIdeaFormController = async (req, res) => {
  try {
    const allCategory = await Category.find();
    const contexts = allCategory.map((category) =>
      generateCategoryDoc(category)
    );

    res.render('ideas/new', {
      title: 'Add Idea',
      path: '/ideas/new',
      category: contexts,
    });
  } catch (err) {
    res.status(500).render('pages/error', {
      title: 'Error',
    });
  }
};

//single idea controller
const getIdeaController = asyncMiddleware(async (req, res) => {
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
    ideaDocument.category = ideaDocument.categories.map((category) =>
      generateCategoryDoc(category)
    );
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
const getEditIdeaFormController = asyncMiddleware(async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.render('pages/notFound', {
      title: 'Not Found',
    });
  }
  //getting idea
  const idea = await Idea.findById(id);
  //getting all category
  const allCategories = await Category.find();

  if (idea) {
    const ideaCategoryList = [];
    const ideaDocument = generateIdeaDoc(idea);

    //checking category of ideaDocument with all category and generating ideaCategory list
    ideaDocument.categories.filter(({ categoryName }) => {
      allCategories.map((category) => {
        if (category.categoryName === categoryName) {
          ideaCategoryList.push({
            category: category.categoryName,
            categoryName,
          });
        }
      });
    });

    //adding other category which are not included in ideaCategory list
    allCategories.map((category, i) => {
      if (
        category.categoryName !==
        (ideaCategoryList[i] ? ideaCategoryList[i].category : '')
      ) {
        ideaCategoryList.push({
          category: category.categoryName,
          categoryName: null,
        });
      }
    });

    //removing duplicate category with lodash in ideaCategoryList
    const uniqCategories = _.uniqBy(ideaCategoryList, 'category');

    res.render('ideas/edit', {
      title: 'Edit Idea',
      idea: ideaDocument,
      ideaCategories: uniqCategories,
    });
  } else {
    res.status(404).render('pages/notFound', {
      title: 'Not Found',
    });
  }
});

//add idea controller
const postAddIdeaController = async (req, res) => {
  req.body.tags = req.body.tags.split(',');

  const idea = new Idea({
    ...req.body,
    allowComments: req.body.allowComments,
    user: {
      id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
    },
    categories: [],
  });

  //saving file to uploads
  if (req.file) {
    const filename = Date.now() + req.file.originalname;
    sharp(req.file.buffer)
      .resize({ width: 1200, height: 300 })
      .toFile(`./uploads/ideas/${filename}`);
    idea.image = filename;
  }

  if (Array.isArray(req.body.categories)) {
    for (let index = 0; index < req.body.categories.length; index++) {
      const categoryName = req.body.categories[index];
      //pushing categories
      idea.categories.push({ categoryName });
    }
  } else {
    const categoryName = req.body.categories;
    //pushing categories
    idea.categories.push({ categoryName });
  }

  await idea.save();

  req.flash('success_msg', 'Idea added successfully');
  //redirect
  res.redirect('/ideas');
};

//update idea controller
const putUpdateIdeaController = asyncMiddleware(async (req, res, next) => {
  const id = req.params.id;
  const ideasCategory = [];
  req.body.tags = req.body.tags.split(',');
  const idea = await Idea.findById(id);

  if (Array.isArray(req.body.categories)) {
    for (let index = 0; index < req.body.categories.length; index++) {
      const categoryName = req.body.categories[index];
      //pushing categories
      ideasCategory.push({ categoryName });
    }
  } else {
    const categoryName = req.body.categories;
    //pushing categories
    ideasCategory.push({ categoryName });
  }
  req.body.categories = ideasCategory;
  const pickedValue = _.pick(req.body, [
    'title',
    'description',
    'allowComments',
    'status',
    'tags',
    'categories',
  ]);
  //uploading image
  if (req.file) {
    const filename = Date.now() + req.file.originalname;
    sharp(req.file.buffer)
      .resize({ width: 1200, height: 300 })
      .toFile(`./uploads/ideas/${filename}`);

    //modifying picked value
    pickedValue.image = filename;

    //deleting existing image
    if (idea.image) {
      deleteUploadFile(`./uploads/ideas/${idea.image}`);
    }
  }

  const ideaToUpdate = await Idea.findByIdAndUpdate(id, pickedValue);
  if (ideaToUpdate) {
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
    //deleting image from uploads
    if (idea.image) {
      deleteUploadFile(`./uploads/ideas/${idea.image}`);
    }
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
