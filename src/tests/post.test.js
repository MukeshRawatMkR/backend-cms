const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Register & login user
  await request(app)
    .post('/api/users/register')
    .send({
      name: 'Poster',
      email: 'poster@example.com',
      password: 'password123'
    });

  const res = await request(app)
    .post('/api/users/login')
    .send({
      email: 'poster@example.com',
      password: 'password123'
    });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Post Endpoints', () => {
  it('should create a new post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'My First Post',
        content: 'Hello World!'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.post).toHaveProperty('title', 'My First Post');
  });
});