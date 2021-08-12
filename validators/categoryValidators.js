//requiring category model
const Category = require('../models/category');

const { check } = require('express-validator');

const categoryValidators = () => {
  return [
    check('categoryName')
      .trim()
      .notEmpty()
      .withMessage('Category is required')
      .isLength({ max: 15 })
      .withMessage('Category must be less than 15 characters'),
    check('categoryName').custom(async (categoryName) => {
      const foundCategory = await Category.findOne({ categoryName });
      if (foundCategory) {
        throw new Error('Category already exists');
      } else {
        return true;
      }
    }),
  ];
};

module.exports = categoryValidators;
