const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    maxLength: 15,
    unique: true,
    trim: true,
  },
});

categorySchema.virtual('ideas', {
  ref: 'Idea',
  localField: 'categoryName',
  foreignField: 'categories.categoryName',
});

categorySchema.set('toObject', { virtuals: true });
categorySchema.set('toJSON', { virtuals: true });
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
