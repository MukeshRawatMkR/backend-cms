# Backend Portfolio

A professional backend portfolio built with Node.js, Express, and Mongoose (MongoDB).

## Features

- Modular folder structure
- JWT-based authentication
- MongoDB with Mongoose
- Joi-based validations
- Docker support
- Unit/Integration tests
- Example CRUD

## Getting Started

1. Clone the repo  
2. Install dependencies  
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your config  
4. Start the server  
   ```bash
   npm run dev
   ```

## Project Structure

```plaintext
src/
  config/          # Configuration files
  controllers/     # Route controller logic
  models/          # Mongoose schemas
  routes/          # Express route definitions
  middlewares/     # Auth, validation, error handling
  services/        # Business logic/helpers
  utils/           # Utility functions
  validations/     # Joi schemas
  jobs/            # Scheduled jobs
  tests/           # Tests
  app.js           # Express app setup
  server.js        # App entry point
public/            # Static files
```

## License

MIT


const URI -> mongodb+srv://mukeshrawatmkr:<db_password>@cluster0testing.lgzkt.mongodb.net/

HTTP Method	   Route	         Auth Required?	               Purpose
POST	         /api/auth/register❌	Register a new user (sign-up)
POST	          /api/auth/login	❌	Login and receive a JWT token
POST	          /api/blogs	      ✅	Create a new blog (only logged-in users)
GET	           /api/blogs	   ❌	Publicly list all blogs (yours + others)
GET	           /api/blogs/my	✅	Get only your own blogs
PUT	         /api/blogs/:id	   ✅	Update your blog post (authorization: owner only)
DELETE	      /api/blogs/:id	   ✅	Delete your blog post (authorization: owner only)




Additional but powerfull APIs:

Feature	         Route Example	                   Notes
Search Blogs	   GET /api/blogs?search=react	     Filter by title/content
Filter by Tags	   GET /api/blogs?tag=JS	            Add tags to blog schema
Like Blog	      POST /api/blogs/:id/like	         Toggle-like system
Comment	         POST /api/blogs/:id/comments     	Blog-commenting system
Get Blog By ID	   GET /api/blogs/:id               	For single blog detail page
Swagger Docs	   /api-docs                        	Auto-generated API docs


