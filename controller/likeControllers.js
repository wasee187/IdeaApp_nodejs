//require Idea module
const Idea = require('../models/ideas');
//requiring category model
const Category = require('../models/category');
//requiring like model
const Like = require('../models/likes');

//*************************Likes controller***************************//
//add or delete likes controller
const postLikesController = async (req, res) => {
  const ideaId = req.body.id;
  const userId = req.body.userId;
  try {
    const findLike = await Like.find({ idea: ideaId, user: userId });

    if (findLike.length === 0) {
      const like = new Like({
        idea: ideaId,
        user: userId,
      });
      await like.save();
      res.status(200).send({ success: true, message: 'You liked the idea' });
    } else {
      await Like.findOneAndDelete({ idea: ideaId, user: userId });
      res.status(200).send({ success: true, message: 'Like is removed' });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: 'Something went wrong, please try again',
    });
  }
};

//get like count controller
const getLikeCountController = async (req, res) => {
  const id = req.params.id;
  try {
    const likes = await Like.find({ idea: id });
    if (likes) {
      const count = likes.length;
      res.status(200).send({ success: true, count });
    } else {
      res.status(500).send({ success: false, message: 'Idea is not found' });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: 'Something went wrong, please try again',
    });
  }
};

module.exports = {
  postLikesController,
  getLikeCountController,
};
