//requiring category models
const Category = require('../models/category');
//requiring Idea model
const Idea = require('../models/ideas');
//requiring generate doc
const { generateIdeaDoc, generateCategoryDoc } = require('../helpers/docGener');

//add category controller
const addCategoryController = (req, res) => {
  res.render('admin/category', {
    title: 'Add Category',
    path: '/categories',
  });
};

//requiring all categories controller
const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).send({ success: true, categories });
  } catch (err) {
    res.render('pages/error', {
      title: 'Error',
    });
  }
};

//post category controller
const postCategoryController = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res
      .status(200)
      .send({ success: true, message: 'Category added successfully' });
  } catch (err) {
    res.render('pages/error', {
      title: 'Error',
    });
  }
};

//deleting category
const deleteCategoryController = async (req, res) => {
  const name = req.params.cat_name;
  try {
    const category = await Category.findOneAndDelete({ categoryName: name });
    if (category) {
      res
        .status(200)
        .send({ success: true, message: 'Category deleted successfully' });
    } else {
      res.status(404).send({ success: false, message: 'Category Not found' });
    }
  } catch (err) {
    res.render('pages/error', {
      title: 'Error',
    });
  }
};

//get ideas based on category
const getCatIdeasController = async (req, res) => {
  const page = +req.query.page || 1;
  const item_per_page = 4;
  const name = req.params.cat_name;
  // try {
  //getting all ideas
  const allIdeas = await Idea.find().sort({ createdAt: -1 });
  //getting all ideas contexts for hbs error
  const ideasContexts = allIdeas.map((idea) => generateIdeaDoc(idea));

  //get all categories
  const allCategories = await Category.find();

  //creating context for hbs error
  const categoryContexts = allCategories.map((category) =>
    generateCategoryDoc(category)
  );
  //searching category
  // const getCategory = await Category.findOne({ categoryName: name })
  //   .populate('ideas')
  //   .skip((page - 1) * item_per_page)
  //   .sort({ createdAt: -1 })
  //   .limit(item_per_page);

  // //getting specific category form allCategories
  const getCategory = allCategories.find(
    (category) => category.categoryName === name
  );

  if (getCategory) {
    const matchedIdeas = [];
    //mapping ideas related to getCategory
    allIdeas.map((idea) => {
      idea.categories.map((category) => {
        if (category.categoryName === getCategory.categoryName) {
          matchedIdeas.push(idea);
        }
      });
    });
    getCategory.ideas = matchedIdeas;

    //getting specific category's ideas document to avoid handlebar errors
    const getCatIdeasContext = getCategory.ideas.map((idea) =>
      generateIdeaDoc(idea)
    );
    //filtering getCatIdeasContext's public idea only
    const publicIdeas = getCatIdeasContext.filter(
      (idea) => idea.status === 'public'
    );

    //getting all public ideas count
    const totalPublicIdeasCount = publicIdeas.length;
    //ideas to pass in pagination
    const catPublicIdeasToPass = publicIdeas.splice(
      (page - 1) * item_per_page,
      item_per_page
    );
    // console.log(catPublicIdeasToPass);
    res.render('ideas/index', {
      title: `All ideas under ${getCategory.categoryName}`,
      ideas: catPublicIdeasToPass,
      categories: categoryContexts,
      categoryName: name,
      ideasTags: ideasContexts,
      currentPage: page,
      previousPage: page - 1,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      hasNextPage: page * item_per_page < totalPublicIdeasCount,
      lastPage: Math.ceil(totalPublicIdeasCount / item_per_page),
      catRef: true,
    });
  } else {
    res.status(404).render('pages/notFound', {
      title: 'Not Found',
    });
  }
  // } catch (err) {
  //   res.status(500).render('pages/error', {
  //     title: 'Error',
  //   });
  // }
};
module.exports = {
  addCategoryController,
  postCategoryController,
  getAllCategoriesController,
  deleteCategoryController,
  getCatIdeasController,
};
