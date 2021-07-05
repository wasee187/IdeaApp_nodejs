const express = require('express');
const router = express.Router();

//requiring user controllers
const {
  getUserController,
  getUserEditFormController,
  updateUserController,
  getUserIdeasController,
  deleteUserController,
  getDashboardController,
} = require('../controller/userControllers');
//requiring middleware
const { isAuth } = require('../middleware/authMiddleware');

//requiring user validators
const { updateUserSchemaValidator } = require('../validators/userValidators');
const { updateUserValidator } = require('../validators/userValidator');

//get user routes
router.get('/me', isAuth, getUserController);

//get edit user form
router.get('/me/edit', isAuth, getUserEditFormController);

//update user routes
router.put(
  '/me',
  isAuth,
  updateUserSchemaValidator(),
  updateUserValidator,
  updateUserController
);
//route for dashboard
router.get('/me/ideas', isAuth, getDashboardController);

//delete user profile
router.delete('/me', isAuth, deleteUserController);

//get ideas by user /users/:id/ideas GET
router.get('/:id/ideas', getUserIdeasController);

module.exports = router;
