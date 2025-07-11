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