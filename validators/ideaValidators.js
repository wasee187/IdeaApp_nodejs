const { check } = require('express-validator');

const ideaValidators = () => {
  return [
    check('title')
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 10, max: 100 })
      .withMessage('Title must be in between 10 to 50 characters long')
      .trim(),

    check(
      'description',
      'Description must be less than 20000 characters'
    ).isLength({ max: 20000 }),

    check('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(['public', 'private'])
      .withMessage('Status must public or private'),

    check('tags')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Idea must have at least one tag'),
    check('categories').notEmpty().withMessage('Categories is required'),
    check('ideaPic').custom((value, { req }) => {
      const { file } = req;
      if (file) {
        if (
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/jpg' ||
          file.mimetype === 'image/png'
        ) {
          return true;
        } else {
          throw new Error('Please select an image file');
        }
      } else {
        return true;
      }
    }),
    check('ideaPic').custom((value, { req }) => {
      const { file } = req;
      if (file) {
        //checking if file size is greater than 5 mb
        if (file.size > 5242880) {
          throw new Error('Image file must be less than 5 MB');
        } else {
          return true;
        }
      } else {
        return true;
      }
    }),
  ];
};

module.exports = ideaValidators;
