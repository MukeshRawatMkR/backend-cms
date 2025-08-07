const mediaService = require('../services/mediaService');
const { validationResult } = require('express-validator');
const createResponse = require('../utils/responseFormatter');

const getAllMedia = async (req, res, next) => {
  try {
    const result = await mediaService.getAllMedia(req.query);
    res.json(createResponse(true, 'Media files retrieved successfully', result));
  } catch (error) {
    next(error);
  }
};

const getMediaById = async (req, res, next) => {
  try {
    const media = await mediaService.getMediaById(req.params.id);
    res.json(createResponse(true, 'Media file retrieved successfully', media));
  } catch (error) {
    next(error);
  }
};

const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json(createResponse(false, 'No file uploaded'));
    }

    const mediaData = {
      ...req.body,
      uploadedBy: req.user.id,
      file: req.file
    };

    const media = await mediaService.uploadMedia(mediaData);
    res.status(201).json(createResponse(true, 'Media uploaded successfully', media));
  } catch (error) {
    next(error);
  }
};

const updateMedia = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(createResponse(false, 'Validation error', null, errors.array()));
    }

    const media = await mediaService.updateMedia(req.params.id, req.body, req.user);
    res.json(createResponse(true, 'Media updated successfully', media));
  } catch (error) {
    next(error);
  }
};

const deleteMedia = async (req, res, next) => {
  try {
    await mediaService.deleteMedia(req.params.id, req.user);
    res.json(createResponse(true, 'Media deleted successfully'));
  } catch (error) {
    next(error);
  }
};

const getMediaByType = async (req, res, next) => {
  try {
    const result = await mediaService.getMediaByType(req.params.type, req.query);
    res.json(createResponse(true, `${req.params.type} files retrieved successfully`, result));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMedia,
  getMediaById,
  uploadMedia,
  updateMedia,
  deleteMedia,
  getMediaByType
};