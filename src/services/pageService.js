const Page = require('../models/Page');
const AppError = require('../utils/AppError');
const { getPaginationOptions, getPaginatedResult } = require('../utils/pagination');

const getAllPages = async (queryParams) => {
  const { page, limit, skip } = getPaginationOptions(queryParams);
  
  // Build filter
  const filter = {};
  if (queryParams.status) {
    filter.status = queryParams.status;
  }
  if (queryParams.author) {
    filter.author = queryParams.author;
  }
  if (queryParams.template) {
    filter.template = queryParams.template;
  }
  if (queryParams.showInMenu !== undefined) {
    filter.showInMenu = queryParams.showInMenu === 'true';
  }
  if (queryParams.search) {
    filter.$or = [
      { title: { $regex: queryParams.search, $options: 'i' } },
      { content: { $regex: queryParams.search, $options: 'i' } }
    ];
  }

  // Build sort
  let sort = { createdAt: -1 };
  if (queryParams.sortBy) {
    const sortOrder = queryParams.sortOrder === 'asc' ? 1 : -1;
    sort = { [queryParams.sortBy]: sortOrder };
  }

  const pages = await Page.find(filter)
    .populate('author', 'username firstName lastName avatar')
    .populate('parentPage', 'title slug')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Page.countDocuments(filter);

  return getPaginatedResult(pages, total, page, limit);
};

const getPageById = async (pageId) => {
  const page = await Page.findById(pageId)
    .populate('author', 'username firstName lastName avatar bio')
    .populate('parentPage', 'title slug')
    .populate('childPages', 'title slug status');

  if (!page) {
    throw new AppError('Page not found', 404);
  }

  return page;
};

const getPageBySlug = async (slug) => {
  const page = await Page.findOne({ slug })
    .populate('author', 'username firstName lastName avatar bio')
    .populate('parentPage', 'title slug')
    .populate('childPages', 'title slug status');

  if (!page) {
    throw new AppError('Page not found', 404);
  }

  return page;
};

const createPage = async (pageData) => {
  const page = await Page.create(pageData);
  await page.populate('author', 'username firstName lastName avatar');
  await page.populate('parentPage', 'title slug');
  
  return page;
};

const updatePage = async (pageId, updateData, currentUser) => {
  const page = await Page.findById(pageId);
  
  if (!page) {
    throw new AppError('Page not found', 404);
  }

  // Check permissions
  if (page.author.toString() !== currentUser.id && 
      !['admin', 'editor'].includes(currentUser.role)) {
    throw new AppError('You can only update your own pages', 403);
  }

  const updatedPage = await Page.findByIdAndUpdate(
    pageId,
    updateData,
    { new: true, runValidators: true }
  )
    .populate('author', 'username firstName lastName avatar')
    .populate('parentPage', 'title slug');

  return updatedPage;
};

const deletePage = async (pageId, currentUser) => {
  const page = await Page.findById(pageId);
  
  if (!page) {
    throw new AppError('Page not found', 404);
  }

  // Check permissions
  if (page.author.toString() !== currentUser.id && 
      currentUser.role !== 'admin') {
    throw new AppError('You can only delete your own pages', 403);
  }

  // Check if page has child pages
  const childPages = await Page.find({ parentPage: pageId });
  if (childPages.length > 0) {
    throw new AppError('Cannot delete page that has child pages', 400);
  }

  await Page.findByIdAndDelete(pageId);
};

const getPublishedPages = async (queryParams) => {
  const { page, limit, skip } = getPaginationOptions(queryParams);
  
  const filter = { status: 'published' };
  
  if (queryParams.template) {
    filter.template = queryParams.template;
  }
  if (queryParams.search) {
    filter.$or = [
      { title: { $regex: queryParams.search, $options: 'i' } },
      { content: { $regex: queryParams.search, $options: 'i' } }
    ];
  }

  let sort = { publishedAt: -1 };
  if (queryParams.sortBy) {
    const sortOrder = queryParams.sortOrder === 'asc' ? 1 : -1;
    sort = { [queryParams.sortBy]: sortOrder };
  }

  const pages = await Page.find(filter)
    .populate('author', 'username firstName lastName avatar')
    .populate('parentPage', 'title slug')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Page.countDocuments(filter);

  return getPaginatedResult(pages, total, page, limit);
};

const getMenuPages = async () => {
  const pages = await Page.find({ 
    status: 'published', 
    showInMenu: true 
  })
    .populate('parentPage', 'title slug')
    .sort({ menuOrder: 1, title: 1 });

  return pages;
};

const getHomePage = async () => {
  const page = await Page.findOne({ 
    status: 'published', 
    isHomePage: true 
  })
    .populate('author', 'username firstName lastName avatar');

  if (!page) {
    throw new AppError('Home page not found', 404);
  }

  return page;
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