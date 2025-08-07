const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Category = require('../models/Category');
const Post = require('../models/Post');
const Page = require('../models/Page');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('📦 MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('🌱 Starting to seed data...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Post.deleteMany({});
    await Page.deleteMany({});
    
    console.log('🗑️ Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@cms.com',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true
    });

    // Create editor user
    const editorUser = await User.create({
      username: 'editor',
      email: 'editor@cms.com',
      password: 'Editor123!',
      firstName: 'Editor',
      lastName: 'User',
      role: 'editor',
      isActive: true
    });

    // Create viewer user
    const viewerUser = await User.create({
      username: 'viewer',
      email: 'viewer@cms.com',
      password: 'Viewer123!',
      firstName: 'Viewer',
      lastName: 'User',
      role: 'viewer',
      isActive: true
    });

    console.log('👥 Created users');

    // Create categories
    const techCategory = await Category.create({
      name: 'Technology',
      description: 'Posts about technology and programming',
      color: '#3B82F6',
      createdBy: adminUser._id,
      isActive: true
    });

    const businessCategory = await Category.create({
      name: 'Business',
      description: 'Business-related content',
      color: '#10B981',
      createdBy: adminUser._id,
      isActive: true
    });

    const designCategory = await Category.create({
      name: 'Design',
      description: 'UI/UX and design articles',
      color: '#F59E0B',
      createdBy: editorUser._id,
      isActive: true
    });

    console.log('📂 Created categories');

    // Create posts
    const post1 = await Post.create({
      title: 'Getting Started with Node.js',
      content: `
        <h2>Introduction to Node.js</h2>
        <p>Node.js is a powerful JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript on the server side, making it possible to build scalable network applications.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>Non-blocking I/O operations</li>
          <li>Event-driven architecture</li>
          <li>Large ecosystem of packages (npm)</li>
          <li>Cross-platform compatibility</li>
        </ul>
        
        <h3>Getting Started</h3>
        <p>To get started with Node.js, you'll need to install it on your system. Visit the official Node.js website and download the latest LTS version.</p>
        
        <pre><code>// Your first Node.js application
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
</code></pre>
      `,
      excerpt: 'Learn the basics of Node.js and how to get started with server-side JavaScript development.',
      status: 'published',
      publishedAt: new Date(),
      categories: [techCategory._id],
      tags: ['nodejs', 'javascript', 'backend', 'tutorial'],
      author: adminUser._id,
      isFeatured: true,
      seoTitle: 'Getting Started with Node.js - Complete Guide',
      seoDescription: 'Learn Node.js fundamentals and build your first server-side JavaScript application with our comprehensive guide.',
      seoKeywords: ['nodejs', 'javascript', 'backend', 'server', 'tutorial']
    });

    const post2 = await Post.create({
      title: 'Building RESTful APIs with Express.js',
      content: `
        <h2>Express.js for API Development</h2>
        <p>Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for building APIs.</p>
        
        <h3>Setting up Express</h3>
        <p>First, install Express in your Node.js project:</p>
        <pre><code>npm install express</code></pre>
        
        <h3>Creating Your First Route</h3>
        <pre><code>const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
</code></pre>
        
        <h3>Best Practices</h3>
        <ul>
          <li>Use middleware for common functionality</li>
          <li>Implement proper error handling</li>
          <li>Validate input data</li>
          <li>Use environment variables for configuration</li>
        </ul>
      `,
      excerpt: 'Learn how to build robust RESTful APIs using Express.js framework with best practices.',
      status: 'published',
      publishedAt: new Date(Date.now() - 86400000), // Yesterday
      categories: [techCategory._id],
      tags: ['expressjs', 'api', 'rest', 'javascript'],
      author: editorUser._id,
      seoTitle: 'Building RESTful APIs with Express.js',
      seoDescription: 'Complete guide to building RESTful APIs with Express.js including best practices and examples.',
      seoKeywords: ['express', 'api', 'rest', 'javascript', 'nodejs']
    });

    const post3 = await Post.create({
      title: 'UI/UX Design Principles for Modern Web Applications',
      content: `
        <h2>Design Principles That Matter</h2>
        <p>Creating intuitive and beautiful user interfaces requires understanding fundamental design principles.</p>
        
        <h3>Core Principles</h3>
        <ol>
          <li><strong>Clarity</strong> - Make sure your interface communicates clearly</li>
          <li><strong>Consistency</strong> - Use consistent patterns throughout</li>
          <li><strong>Accessibility</strong> - Design for all users</li>
          <li><strong>Feedback</strong> - Provide clear feedback for user actions</li>
        </ol>
        
        <h3>Modern Trends</h3>
        <p>Stay updated with current design trends while maintaining usability:</p>
        <ul>
          <li>Minimalist design</li>
          <li>Dark mode support</li>
          <li>Micro-interactions</li>
          <li>Mobile-first approach</li>
        </ul>
      `,
      excerpt: 'Explore essential UI/UX design principles that will help you create better user experiences.',
      status: 'published',
      publishedAt: new Date(Date.now() - 172800000), // 2 days ago
      categories: [designCategory._id],
      tags: ['ui', 'ux', 'design', 'web'],
      author: editorUser._id,
      seoTitle: 'UI/UX Design Principles for Modern Web Applications',
      seoDescription: 'Learn essential UI/UX design principles to create intuitive and beautiful web applications.',
      seoKeywords: ['ui', 'ux', 'design', 'web', 'user experience']
    });

    console.log('📝 Created posts');

    // Create pages
    const homePage = await Page.create({
      title: 'Welcome to Our CMS',
      content: `
        <h1>Welcome to Our Content Management System</h1>
        <p>This is a powerful and flexible CMS built with Node.js, Express, and MongoDB. It provides all the essential features for managing your content effectively.</p>
        
        <h2>Features</h2>
        <ul>
          <li>User management with role-based access control</li>
          <li>Content creation and management</li>
          <li>Media library</li>
          <li>SEO optimization tools</li>
          <li>RESTful API</li>
        </ul>
        
        <h2>Getting Started</h2>
        <p>Explore our features and start creating amazing content today!</p>
      `,
      excerpt: 'Welcome to our powerful content management system built with modern technologies.',
      status: 'published',
      publishedAt: new Date(),
      template: 'landing',
      isHomePage: true,
      showInMenu: true,
      menuOrder: 1,
      author: adminUser._id,
      seoTitle: 'Welcome to Our CMS - Powerful Content Management',
      seoDescription: 'A powerful and flexible content management system built with Node.js, Express, and MongoDB.',
      seoKeywords: ['cms', 'content management', 'nodejs', 'mongodb']
    });

    const aboutPage = await Page.create({
      title: 'About Us',
      content: `
        <h1>About Our Company</h1>
        <p>We are dedicated to providing innovative solutions for content management and web development.</p>
        
        <h2>Our Mission</h2>
        <p>To empower businesses and individuals with powerful, easy-to-use content management tools that help them succeed online.</p>
        
        <h2>Our Team</h2>
        <p>Our team consists of experienced developers, designers, and content strategists who are passionate about creating exceptional digital experiences.</p>
      `,
      excerpt: 'Learn more about our company and mission.',
      status: 'published',
      publishedAt: new Date(),
      template: 'about',
      showInMenu: true,
      menuOrder: 2,
      author: adminUser._id,
      seoTitle: 'About Us - Our Mission and Team',
      seoDescription: 'Learn about our company, mission, and the team behind our content management system.',
      seoKeywords: ['about', 'company', 'team', 'mission']
    });

    const contactPage = await Page.create({
      title: 'Contact Us',
      content: `
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Get in touch with us using the information below.</p>
        
        <h2>Contact Information</h2>
        <ul>
          <li><strong>Email:</strong> contact@cms.com</li>
          <li><strong>Phone:</strong> +1 (555) 123-4567</li>
          <li><strong>Address:</strong> 123 Tech Street, Digital City, DC 12345</li>
        </ul>
        
        <h2>Business Hours</h2>
        <ul>
          <li>Monday - Friday: 9:00 AM - 6:00 PM</li>
          <li>Saturday: 10:00 AM - 4:00 PM</li>
          <li>Sunday: Closed</li>
        </ul>
      `,
      excerpt: 'Get in touch with us for any questions or support.',
      status: 'published',
      publishedAt: new Date(),
      template: 'contact',
      showInMenu: true,
      menuOrder: 3,
      author: adminUser._id,
      seoTitle: 'Contact Us - Get in Touch',
      seoDescription: 'Contact us for questions, support, or business inquiries. We are here to help!',
      seoKeywords: ['contact', 'support', 'help', 'business']
    });

    console.log('📄 Created pages');

    console.log('✅ Seeding completed successfully!');
    console.log('\n📋 Seed Data Summary:');
    console.log('👤 Users created: 3');
    console.log('   - admin@cms.com (password: Admin123!)');
    console.log('   - editor@cms.com (password: Editor123!)');
    console.log('   - viewer@cms.com (password: Viewer123!)');
    console.log('📂 Categories created: 3');
    console.log('📝 Posts created: 3');
    console.log('📄 Pages created: 3');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Connect to database and seed data
const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();