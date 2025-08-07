const Media = require('../models/Media');
const AppError = require('../utils/AppError');
const { getPaginationOptions, getPaginatedResult } = require('../utils/pagination');
const fs = require('fs').promises;
const path = require('path');

const getAllMedia = async (queryParams) => {
  const { page, limit, skip } = getPaginationOptions(queryParams);
  
  // Build filter
  const filter = {};
  if (queryParams.type) {
    filter.type = queryParams.type;
  }
  if (queryParams.uploadedBy) {
    filter.uploadedBy = queryParams.uploadedBy;
  }
  if (queryParams.folder) {
    filter.folder = queryParams.folder;
  }
  if (queryParams.search) {
    filter.$or = [
      { originalName: { $regex: queryParams.search, $options: 'i' } },
      { alt: { $regex: queryParams.search, $options: 'i' } },
      { caption: { $regex: queryParams.search, $options: 'i' } },
      { tags: { $in: [new RegExp(queryParams.search, 'i')] } }
    ];
  }

  // Build sort
  let sort = { createdAt: -1 };
  if (queryParams.sortBy) {
    const sortOrder = queryParams.sortOrder === 'asc' ? 1 : -1;
    sort = { [queryParams.sortBy]: sortOrder };
  }

  const media = await Media.find(filter)
    .populate('uploadedBy', 'username firstName lastName')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Media.countDocuments(filter);

  return getPaginatedResult(media, total, page, limit);
};

const getMediaById = async (mediaId) => {
  const media = await Media.findById(mediaId)
    .populate('uploadedBy', 'username firstName lastName');

  if (!media) {
    throw new AppError('Media not found', 404);
  }

  return media;
};

const uploadMedia = async (mediaData) => {
  const { file, uploadedBy, alt, caption, description, tags, folder } = mediaData;
  
  // Determine file type
  let type = 'other';
  if (file.mimetype.startsWith('image/')) {
    type = 'image';
  } else if (file.mimetype.startsWith('video/')) {
    type = 'video';
  } else if (file.mimetype.startsWith('audio/')) {
    type = 'audio';
  } else if (file.mimetype.includes('pdf') || file.mimetype.includes('document') || 
             file.mimetype.includes('text') || file.mimetype.includes('msword') ||
             file.mimetype.includes('sheet') || file.mimetype.includes('presentation')) {
    type = 'document';
  }

  // Create media record
  const media = await Media.create({
    filename: file.filename,
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    path: file.path,
    url: `/uploads/${file.filename}`,
    type,
    uploadedBy,
    alt,
    caption,
    description,
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    folder: folder || 'uploads'
  });

  await media.populate('uploadedBy', 'username firstName lastName');
  return media;
};

const updateMedia = async (mediaId, updateData, currentUser) => {
  const media = await Media.findById(mediaId);
  
  if (!media) {
    throw new AppError('Media not found', 404);
  }

  // Check permissions
  if (media.uploadedBy.toString() !== currentUser.id && 
      currentUser.role !== 'admin') {
    throw new AppError('You can only update media you uploaded', 403);
  }

  // Only allow updating certain fields
  const allowedUpdates = {
    alt: updateData.alt,
    caption: updateData.caption,
    description: updateData.description,
    tags: updateData.tags ? updateData.tags.split(',').map(tag => tag.trim()) : undefined,
    folder: updateData.folder,
    isPublic: updateData.isPublic
  };

  // Remove undefined values
  Object.keys(allowedUpdates).forEach(key => 
    allowedUpdates[key] === undefined && delete allowedUpdates[key]
  );

  const updatedMedia = await Media.findByIdAndUpdate(
    mediaId,
    allowedUpdates,
    { new: true, runValidators: true }
  ).populate('uploadedBy', 'username firstName lastName');

  return updatedMedia;
};

const deleteMedia = async (mediaId, currentUser) => {
  const media = await Media.findById(mediaId);
  
  if (!media) {
    throw new AppError('Media not found', 404);
  }

  // Check permissions
  if (media.uploadedBy.toString() !== currentUser.id && 
      currentUser.role !== 'admin') {
    throw new AppError('You can only delete media you uploaded', 403);
  }

  try {
    // Delete file from filesystem
    await fs.unlink(media.path);
  } catch (error) {
    console.error('Error deleting file:', error);
    // Continue with database deletion even if file deletion fails
  }

  await Media.findByIdAndDelete(mediaId);
};

const getMediaByType = async (type, queryParams) => {
  const { page, limit, skip } = getPaginationOptions(queryParams);
  
  const filter = { type };
  if (queryParams.search) {
    filter.$or = [
      { originalName: { $regex: queryParams.search, $options: 'i' } },
      { alt: { $regex: queryParams.search, $options: 'i' } },
      { caption: { $regex: queryParams.search, $options: 'i' } }
    ];
  }

  let sort = { createdAt: -1 };
  if (queryParams.sortBy) {
    const sortOrder = queryParams.sortOrder === 'asc' ? 1 : -1;
    sort = { [queryParams.sortBy]: sortOrder };
  }

  const media = await Media.find(filter)
    .populate('uploadedBy', 'username firstName lastName')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Media.countDocuments(filter);

  return getPaginatedResult(media, total, page, limit);
};

module.exports = {
  getAllMedia,
  getMediaById,
  uploadMedia,
  updateMedia,
  deleteMedia,
  getMediaByType
};