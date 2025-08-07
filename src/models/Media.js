const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: [true, 'Filename is required']
  },
  originalName: {
    type: String,
    required: [true, 'Original name is required']
  },
  mimetype: {
    type: String,
    required: [true, 'Mimetype is required']
  },
  size: {
    type: Number,
    required: [true, 'File size is required']
  },
  path: {
    type: String,
    required: [true, 'File path is required']
  },
  url: {
    type: String,
    required: [true, 'File URL is required']
  },
  alt: {
    type: String,
    maxlength: [200, 'Alt text cannot exceed 200 characters']
  },
  caption: {
    type: String,
    maxlength: [500, 'Caption cannot exceed 500 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  type: {
    type: String,
    enum: ['image', 'video', 'audio', 'document', 'other'],
    required: true
  },
  dimensions: {
    width: Number,
    height: Number
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  folder: {
    type: String,
    default: 'uploads'
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for file extension
mediaSchema.virtual('extension').get(function() {
  return this.filename.split('.').pop();
});

// Virtual for formatted file size
mediaSchema.virtual('formattedSize').get(function() {
  const bytes = this.size;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Indexes
mediaSchema.index({ type: 1 });
mediaSchema.index({ uploadedBy: 1 });
mediaSchema.index({ folder: 1 });
mediaSchema.index({ tags: 1 });
mediaSchema.index({ createdAt: -1 });

// Static method to get files by type
mediaSchema.statics.findByType = function(type) {
  return this.find({ type }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Media', mediaSchema);