const mongoose = require('mongoose');
//requiring comment model
const { Comment } = require('../models/comments');
const Like = require('../models/likes');

const ideaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [10, 'Title must be 10 characters long'],
      maxlength: [100, 'Title must be less than 100 characters long'],
      trim: true,
    },
    description: {
      type: String,
      maxlength: 20000,
    },
    allowComments: {
      type: Boolean,
      required: [true, 'AllowComments is required'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['public', 'private'],
        message: 'Please set public or private in status field',
      },
    },
    categories: [
      {
        categoryName: String,
      },
    ],
    tags: [
      {
        type: String,
        required: [true, 'Idea must have at least one tag'],
      },
    ],
    image: String,
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

//virtual schema for comments
ideaSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'idea',
});

//virtual schema for like
ideaSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'idea',
});

ideaSchema.set('toObject', { virtuals: true });
ideaSchema.set('toJSON', { virtuals: true });

//deleting associate comment before removing idea
ideaSchema.pre('remove', async function (next) {
  const idea = this;
  const id = idea._id;

  //removing comment
  await Comment.deleteMany({
    idea: id,
  });
  //removing all likes
  await Like.deleteMany({
    idea: id,
  });
  next();
});
//sub document , embedding
const Idea = mongoose.model('Idea', ideaSchema);

module.exports = Idea;
