const express = require('express');
const router = express.Router();

//requiring multer
const multer = require('multer');

//import idea validators
const addIdeaValidator = require('../validators/addIdeaValidator');
const ideaValidators = require('../validators/ideaValidators');
const updateIdeaValidator = require('../validators/updateIdeaValidator');

//configuring multer
const ideaPictureUploads = multer().single('ideaPic');
//import controllers
const {
  getIdeasController,
  addIdeaFormController,
  getIdeaController,
  getEditIdeaFormController,
  postAddIdeaController,
  putUpdateIdeaController,
  deleteIdeaController,
} = require('../controller/ideaControllers');

//requiring auth middleware
const { isAuth, checkOwnership } = require('../middleware/authMiddleware');

//Get all ideas route
router.get('/', getIdeasController);

//show add idea form
router.get('/new', isAuth, addIdeaFormController);

//route for showing single idea

router.get('/:id', getIdeaController);

//show edit idea form
router.get('/:id/edit', isAuth, checkOwnership, getEditIdeaFormController);

//add idea route
router.post(
  '/',
  isAuth,
  ideaPictureUploads,
  ideaValidators(),
  addIdeaValidator,
  postAddIdeaController
);

//update idea
router.put(
  '/:id',
  isAuth,
  checkOwnership,
  ideaPictureUploads,
  ideaValidators(),
  updateIdeaValidator,
  putUpdateIdeaController
);

//delete route

router.delete('/:id', isAuth, checkOwnership, deleteIdeaController);

module.exports = router;
