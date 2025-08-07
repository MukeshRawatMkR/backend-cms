const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Post = require('../src/models/Post');
const Category = require('../src/models/Category');

describe('Posts Tests', () => {
  let authToken;
  let userId;
  let categoryId;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/cms_test';
    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
    await Category.deleteMany({});

    // Create test user
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'User',
      role: 'editor'
    });
    await user.save();
    userId = user._id;

    // Create test category
    const category = new Category({
      name: 'Test Category',
      description: 'Test category description',
      createdBy: userId
    });
    await category.save();
    categoryId = category._id;

    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Test123!'
      });

    authToken = loginResponse.body.data.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/posts', () => {
    it('should get all posts with pagination', async () => {
      const response = await request(app)
        .get('/api/posts?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.pagination).toBeDefined();
    });
  });

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const postData = {
        title: 'Test Post',
        content: 'This is test content',
        excerpt: 'Test excerpt',
        categories: [categoryId],
        tags: ['test', 'nodejs'],
        status: 'draft'
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(postData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(postData.title);
    });

    it('should not create post without required fields', async () => {
      const postData = {
        content: 'This is test content'
        // Missing title
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(postData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/posts/published', () => {
    beforeEach(async () => {
      // Create a published post
      const post = new Post({
        title: 'Published Post',
        content: 'Published content',
        status: 'published',
        publishedAt: new Date(),
        author: userId
      });
      await post.save();
    });

    it('should get published posts without authentication', async () => {
      const response = await request(app)
        .get('/api/posts/published')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.data.length).toBe(1);
    });
  });
});