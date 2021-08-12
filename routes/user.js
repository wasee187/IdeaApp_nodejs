const express = require('express');
const router = express.Router();
const multer = require('multer');
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

//configuring storage
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, './uploads');
//   },
//   filename(req, file, cb) {
//     cb(null, Date.now() + file.originalname);
//   },
// });
//configuring fileFilter
// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === 'image/jpeg' ||
//     file.mimetype === 'image/jpg' ||
//     file.mimetype === 'image/png'
//   ) {
//     //allowing uploads
//     cb(null, true);
//   } else {
//     //rejection uploads
//     cb(null, false);
//   }
// };
//configuring multer
const profilePicUploads = multer({
  // storage,
  // fileFilter,
  // limits: {
  //   fileSize: 1000000, //1mb
  // },
}).single('profilePic');
//get user routes
router.get('/me', isAuth, getUserController);

//get edit user form
router.get('/me/edit', isAuth, getUserEditFormController);

//update user routes
router.put(
  '/me',
  isAuth,
  profilePicUploads,
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
