const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  idea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
