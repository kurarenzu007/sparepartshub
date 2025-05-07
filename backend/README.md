# TCJ Autoparts Backend

This is the backend API for the TCJ Autoparts e-commerce platform.

## Features

- RESTful API
- MySQL database with Sequelize ORM
- JWT authentication
- Secure password hashing
- CORS enabled
- Helmet security headers
- Request logging
- Input validation

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=tcj_autoparts
   DB_PORT=3306
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=http://localhost:3000
   ```
4. Create the database:
   ```sql
   CREATE DATABASE tcj_autoparts;
   ```

## Running the Application

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Documentation

Coming soon...

## Testing

Run tests:
```bash
npm test
```

## License

MIT 