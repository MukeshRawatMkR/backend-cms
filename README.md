# Content Management System (CMS) Backend

A comprehensive, production-ready Content Management System backend built with Node.js, Express.js, and MongoDB. This system follows industry best practices, implements a clean MVC architecture, and provides a robust RESTful API for managing content, users, and media.

## 🚀 Features

### Core Functionality
- **User Management**: Complete user authentication and authorization system
- **Role-Based Access Control**: Admin, Editor, and Viewer roles with granular permissions
- **Content Management**: Full CRUD operations for posts and pages
- **Category System**: Hierarchical categorization with color coding
- **Media Management**: File upload, organization, and metadata management
- **SEO Optimization**: Built-in SEO fields for all content types

### Technical Features
- **RESTful API**: Clean, standardized API endpoints
- **JWT Authentication**: Secure token-based authentication
- **Data Validation**: Comprehensive input validation using express-validator
- **Error Handling**: Centralized error handling with detailed logging
- **Pagination**: Built-in pagination support for all list endpoints
- **File Upload**: Secure file upload with type validation
- **Database Relationships**: Proper MongoDB relationships with Mongoose

## 🏗️ Architecture

This project follows the **Model-View-Controller (MVC)** architecture pattern with a service layer for business logic separation:

```
src/
├── config/          # Configuration files (database, JWT)
├── controllers/     # Route controllers (request/response handling)
├── models/         # Mongoose models (data structure)
├── routes/         # Express routes (API endpoints)
├── services/       # Business logic layer
├── middlewares/    # Custom middleware (auth, validation, errors)
├── utils/          # Utility functions
├── validations/    # Input validation schemas
└── app.js          # Application entry point
```

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cms-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/cms_db
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_EXPIRES_IN=30d
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=./uploads
   CORS_ORIGIN=http://localhost:3000
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Create uploads directory**
   ```bash
   mkdir uploads
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

7. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🗂️ Database Schema

### User Model
- `username` (String, unique) - User identifier
- `email` (String, unique) - User email address
- `password` (String, hashed) - User password
- `firstName` & `lastName` (String) - User full name
- `role` (Enum) - admin, editor, viewer
- `avatar` (String) - Profile picture URL
- `bio` (String) - User biography
- `isActive` (Boolean) - Account status
- `lastLogin` (Date) - Last login timestamp

### Post Model
- `title` (String) - Post title
- `slug` (String, unique) - URL-friendly identifier
- `content` (String) - Post content (HTML)
- `excerpt` (String) - Brief description
- `status` (Enum) - draft, published, archived
- `author` (ObjectId) - Reference to User
- `categories` (Array) - References to Categories
- `tags` (Array) - String array of tags
- `featuredImage` (String) - Featured image URL
- `publishedAt` (Date) - Publication date
- `views` (Number) - View count
- `likes` (Array) - References to Users who liked
- SEO fields: `seoTitle`, `seoDescription`, `seoKeywords`

### Page Model
- Similar to Post with additional fields:
- `template` (Enum) - default, landing, contact, about
- `parentPage` (ObjectId) - For page hierarchy
- `showInMenu` (Boolean) - Menu visibility
- `isHomePage` (Boolean) - Homepage designation
- `customFields` (Map) - Flexible custom data

### Category Model
- `name` (String, unique) - Category name
- `slug` (String, unique) - URL-friendly identifier
- `description` (String) - Category description
- `color` (String) - Hex color code
- `parentCategory` (ObjectId) - For hierarchy
- `icon` (String) - Icon identifier
- `sortOrder` (Number) - Display order

### Media Model
- `filename` & `originalName` (String) - File names
- `mimetype` (String) - File type
- `size` (Number) - File size in bytes
- `path` & `url` (String) - File location
- `type` (Enum) - image, video, audio, document, other
- `alt`, `caption`, `description` (String) - Metadata
- `uploadedBy` (ObjectId) - Reference to User

## 🛠️ API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register         # User registration
POST   /api/auth/login            # User login
POST   /api/auth/refresh-token    # Refresh JWT token
POST   /api/auth/logout           # User logout
GET    /api/auth/profile          # Get user profile
PUT    /api/auth/profile          # Update user profile
PUT    /api/auth/change-password  # Change password
```

### User Management (Admin/Editor)
```
GET    /api/users                 # Get all users (paginated)
GET    /api/users/:id             # Get user by ID
POST   /api/users                 # Create new user (Admin only)
PUT    /api/users/:id             # Update user (Admin only)
DELETE /api/users/:id             # Delete user (Admin only)
PUT    /api/users/:id/role        # Update user role (Admin only)
PUT    /api/users/:id/status      # Toggle user status (Admin only)
```

### Posts Management
```
GET    /api/posts                 # Get all posts (authenticated)
GET    /api/posts/published       # Get published posts (public)
GET    /api/posts/featured        # Get featured posts (public)
GET    /api/posts/:id             # Get post by ID
GET    /api/posts/slug/:slug      # Get post by slug (public)
POST   /api/posts                 # Create post (Editor/Admin)
PUT    /api/posts/:id             # Update post (Editor/Admin)
DELETE /api/posts/:id             # Delete post (Admin only)
POST   /api/posts/:id/like        # Like post
DELETE /api/posts/:id/like        # Unlike post
```

### Pages Management
```
GET    /api/pages                 # Get all pages (authenticated)
GET    /api/pages/published       # Get published pages (public)
GET    /api/pages/menu            # Get menu pages (public)
GET    /api/pages/home            # Get homepage (public)
GET    /api/pages/:id             # Get page by ID
GET    /api/pages/slug/:slug      # Get page by slug (public)
POST   /api/pages                 # Create page (Editor/Admin)
PUT    /api/pages/:id             # Update page (Editor/Admin)
DELETE /api/pages/:id             # Delete page (Admin only)
```

### Categories Management
```
GET    /api/categories            # Get all categories (public)
GET    /api/categories/:id        # Get category by ID (public)
GET    /api/categories/slug/:slug # Get category by slug (public)
GET    /api/categories/:id/posts  # Get category posts (public)
POST   /api/categories            # Create category (Editor/Admin)
PUT    /api/categories/:id        # Update category (Editor/Admin)
DELETE /api/categories/:id        # Delete category (Admin only)
```

### Media Management
```
GET    /api/media                 # Get all media files
GET    /api/media/type/:type      # Get media by type
GET    /api/media/:id             # Get media by ID
POST   /api/media/upload          # Upload file
PUT    /api/media/:id             # Update media metadata
DELETE /api/media/:id             # Delete media file
```

## 🔐 Authentication & Authorization

### JWT Implementation
- **Access Token**: Short-lived (7 days default) for API access
- **Refresh Token**: Long-lived (30 days default) for token renewal
- **Token Storage**: Refresh tokens stored in database for security

### Role-Based Permissions

#### Admin Role
- Full system access
- User management (CRUD)
- Content management (CRUD)
- System configuration

#### Editor Role
- Content creation and editing
- Media management
- Category management
- Limited user viewing

#### Viewer Role
- Read-only access to content
- Profile management
- Basic interactions (likes, views)

### Permission Middleware
```javascript
// Require authentication
router.use(authenticateToken);

// Require specific roles
router.use(requireRole(['admin', 'editor']));

// Optional authentication (for public endpoints that benefit from user context)
router.use(optionalAuth);
```

## ⚠️ Error Handling

### Centralized Error Handling
All errors are processed through a centralized error handler that:
- Formats errors consistently
- Logs errors appropriately
- Provides different error details for development vs production
- Handles various error types (validation, authentication, database, etc.)

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Common Error Types
- **Validation Errors**: Input validation failures
- **Authentication Errors**: Invalid/expired tokens
- **Authorization Errors**: Insufficient permissions
- **Not Found Errors**: Resource not found
- **Duplicate Errors**: Unique constraint violations

## ✅ Validation

### Input Validation Strategy
Using `express-validator` for comprehensive input validation:

#### Registration Validation Example
```javascript
body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email address'),

body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage('Password must contain uppercase, lowercase, and number')
```

#### Validation Layers
1. **Schema Validation**: Mongoose schema constraints
2. **Route Validation**: express-validator rules
3. **Business Logic Validation**: Service layer checks
4. **Database Constraints**: Unique indexes, references

## 📊 Pagination & Filtering

### Pagination Implementation
All list endpoints support pagination with the following query parameters:
- `page` (default: 1) - Page number
- `limit` (default: 10, max: 100) - Items per page

### Filtering Options
- `search` - Text search across relevant fields
- `status` - Filter by status (published, draft, etc.)
- `category` - Filter by category ID
- `author` - Filter by author ID
- `sortBy` - Sort field
- `sortOrder` - Sort direction (asc/desc)

### Response Format
```json
{
  "success": true,
  "data": {
    "data": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false,
      "nextPage": 2,
      "prevPage": null
    }
  }
}
```

## 🧪 Testing

### Test Structure
```
tests/
├── auth.test.js       # Authentication tests
├── posts.test.js      # Posts management tests
├── users.test.js      # User management tests
└── setup.js           # Test setup and utilities
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in CI mode
npm run test:ci

# Run tests with coverage
npm run test:coverage
```

### Test Database
Tests use a separate test database to avoid affecting development data.

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Use environment variables for all configuration
3. Set up MongoDB Atlas or dedicated MongoDB instance
4. Configure reverse proxy (nginx recommended)
5. Set up SSL/TLS certificates
6. Configure logging and monitoring

### Environment Variables Checklist
- [ ] `MONGODB_URI` - Production database URL
- [ ] `JWT_SECRET` - Strong, unique secret key
- [ ] `CORS_ORIGIN` - Your frontend domain
- [ ] Rate limiting configuration
- [ ] File upload limits
- [ ] Email configuration (if using email features)

### Security Considerations(features)
- Use HTTPS in production.
- Implement rate limiting.
- Regular security updates.
- Monitor for suspicious activities.
- Regular database backups.
- Proper CORS configuration.

## 📝 Scripts Reference

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run test suite
npm run test:ci    # Run tests in CI mode
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
npm run seed       # Seed database with sample data
```

---

**Built with ❤️ using Node.js, Express.js, and MongoDB**