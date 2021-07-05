const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    idea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Idea',
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },
    text: {
      type: String,
      maxlength: 1000,
    },
    user: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      firstName: String,
      lastName: String,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = {
  Comment,
  commentSchema,
};
