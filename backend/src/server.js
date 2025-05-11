const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { promisePool, testConnection } = require('./config/db');
const productRoutes = require('./routes/products');
const inventoryRoutes = require('./routes/inventory');
const salesRoutes = require('./routes/sales');
const usersRoutes = require('./routes/users');
require('dotenv').config();

const app = express();

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  exposedHeaders: ['Content-Disposition']
};

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Uploads directory created');
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/users', usersRoutes);

// Test database connection
testConnection();

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to TCJ Autoparts API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});