const mongoose = require('mongoose');
const slugify = require('slugify');

const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Page title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Page content is required']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  featuredImage: {
    type: String,
    default: null
  },
  template: {
    type: String,
    enum: ['default', 'landing', 'contact', 'about'],
    default: 'default'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'private'],
    default: 'draft'
  },
  publishedAt: {
    type: Date,
    default: null
  },
  parentPage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    default: null
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  showInMenu: {
    type: Boolean,
    default: false
  },
  menuOrder: {
    type: Number,
    default: 0
  },
  isHomePage: {
    type: Boolean,
    default: false
  },
  seoTitle: {
    type: String,
    maxlength: [60, 'SEO title cannot exceed 60 characters']
  },
  seoDescription: {
    type: String,
    maxlength: [160, 'SEO description cannot exceed 160 characters']
  },
  seoKeywords: [{
    type: String,
    trim: true
  }],
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for child pages
pageSchema.virtual('childPages', {
  ref: 'Page',
  localField: '_id',
  foreignField: 'parentPage'
});

// Indexes
pageSchema.index({ slug: 1 });
pageSchema.index({ status: 1 });
pageSchema.index({ parentPage: 1 });
pageSchema.index({ showInMenu: 1 });
pageSchema.index({ isHomePage: 1 });

// Generate slug before saving
pageSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Ensure only one home page
  if (this.isModified('isHomePage') && this.isHomePage) {
    this.constructor.updateMany(
      { _id: { $ne: this._id }, isHomePage: true },
      { isHomePage: false }
    ).exec();
  }
  
  next();
});

// Static method to get published pages
pageSchema.statics.findPublished = function() {
  return this.find({ status: 'published' }).sort({ sortOrder: 1, createdAt: -1 });
};

// Instance method to increment views
pageSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('Page', pageSchema);