const express = require('express');
const router = express.Router();

//requiring middleware
const { isAuth, ensureAdmin } = require('../middleware/authMiddleware');
//requiring controller
const {
  addCategoryController,
  postCategoryController,
  getAllCategoriesController,
  deleteCategoryController,
  getCatIdeasController,
} = require('../controller/categoryController');

//requiring all validator
const categoryValidators = require('../validators/categoryValidators');
const { categoryValidator } = require('../validators/categoryValidate');

//add category form routes
router.get('/new', isAuth, ensureAdmin, addCategoryController);

//all categories route
router.get('/', isAuth, ensureAdmin, getAllCategoriesController);

//post /categories adding category in the database
router.post(
  '/',
  isAuth,
  ensureAdmin,
  categoryValidators(),
  categoryValidator,
  postCategoryController
);

//deleting category
router.delete('/:cat_name', isAuth, ensureAdmin, deleteCategoryController);

//get ideas based on category
router.get('/:cat_name/ideas', getCatIdeasController);
module.exports = router;
