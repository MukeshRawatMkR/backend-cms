const pageService = require('../services/pageService');
const { validationResult } = require('express-validator');
const createResponse = require('../utils/responseFormatter');

const getAllPages = async (req, res, next) => {
  try {
    const result = await pageService.getAllPages(req.query);
    res.json(createResponse(true, 'Pages retrieved successfully', result));
  } catch (error) {
    next(error);
  }
};

const getPageById = async (req, res, next) => {
  try {
    const page = await pageService.getPageById(req.params.id);
    res.json(createResponse(true, 'Page retrieved successfully', page));
  } catch (error) {
    next(error);
  }
};

const getPageBySlug = async (req, res, next) => {
  try {
    const page = await pageService.getPageBySlug(req.params.slug);
    
    // Increment views for published pages
    if (page.status === 'published') {
      await page.incrementViews();
    }
    
    res.json(createResponse(true, 'Page retrieved successfully', page));
  } catch (error) {
    next(error);
  }
};

const createPage = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(createResponse(false, 'Validation error', null, errors.array()));
    }

    const pageData = {
      ...req.body,
      author: req.user.id
    };

    const page = await pageService.createPage(pageData);
    res.status(201).json(createResponse(true, 'Page created successfully', page));
  } catch (error) {
    next(error);
  }
};

const updatePage = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(createResponse(false, 'Validation error', null, errors.array()));
    }

    const page = await pageService.updatePage(req.params.id, req.body, req.user);
    res.json(createResponse(true, 'Page updated successfully', page));
  } catch (error) {
    next(error);
  }
};

const deletePage = async (req, res, next) => {
  try {
    await pageService.deletePage(req.params.id, req.user);
    res.json(createResponse(true, 'Page deleted successfully'));
  } catch (error) {
    next(error);
  }
};

const getPublishedPages = async (req, res, next) => {
  try {
    const result = await pageService.getPublishedPages(req.query);
    res.json(createResponse(true, 'Published pages retrieved successfully', result));
  } catch (error) {
    next(error);
  }
};

const getMenuPages = async (req, res, next) => {
  try {
    const pages = await pageService.getMenuPages();
    res.json(createResponse(true, 'Menu pages retrieved successfully', pages));
  } catch (error) {
    next(error);
  }
};

const getHomePage = async (req, res, next) => {
  try {
    const page = await pageService.getHomePage();
    res.json(createResponse(true, 'Home page retrieved successfully', page));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPages,
  getPageById,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
  getPublishedPages,
  getMenuPages,
  getHomePage
};