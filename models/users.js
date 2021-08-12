const mongoose = require('mongoose');
//requiring bcrypt
const bcrypt = require('bcryptjs');

//requiring idea model
const Idea = require('../models/ideas');
const { Comment } = require('../models/comments');
const Like = require('../models/likes');
//requiring file system
const fs = require('fs');
const util = require('util');
const deleteUploadFile = util.promisify(fs.unlink);

const userSchema = new mongoose.Schema({
  googleID: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 15,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 15,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate: {
      validator(v) {
        return v.match(
          /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        );
      },
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 25,
    validate: {
      validator(v) {
        const passArray = ['password', '123456', 'god123'];
        const isMatch = passArray.some((pass) => v.includes(pass));
        if (isMatch) return false;
      },
    },
  },
  image: String,
  imageURL: String,
  role: {
    type: Number,
    default: 0,
  },
  resetPasswordToken: String,
});

//virtual schema idea
userSchema.virtual('ideas', {
  ref: 'Idea',
  localField: '_id',
  foreignField: 'user.id',
});
//virtual schema for like
userSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'user.id',
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

//function for hashing password before saving user data in db
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } else {
    next();
  }
});

///deleting idea before remove
userSchema.pre('remove', async function (next) {
  const user = this;
  const id = user._id;

  const ideas = await Idea.find({ 'user.id': id });
  ideas.map((idea) => {
    if (idea.image) {
      deleteUploadFile(`./uploads/ideas/${idea.image}`);
    }
  });
  //removing all idea of user
  await Idea.deleteMany({
    'user.id': id,
  });
  await Like.deleteMany({
    user: id,
  });
  await Comment.deleteMany({
    'user.id': id,
  });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
