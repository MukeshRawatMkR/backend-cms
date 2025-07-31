
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title must be at least 1 characters'],
    maxlength: [50, 'Title must not exceed 50 characters']
  },

  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [3, 'Content must be at least 3 characters']
  },

  excerpt: {
    type: String,
    trim: true,
    maxlength: [300, 'Excerpt must not exceed 300 characters']
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },

  tags: {
    type: [String],
    default: [],
    validate: [arr => arr.length <= 5, 'You can assign up to 5 tags only']
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
