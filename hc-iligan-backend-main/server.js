const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const projectRoutes = require('./routes/projectRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Enable CORS for all origins (allow app to connect from any device)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - From: ${req.ip}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Listen on 0.0.0.0 to accept connections from network (not just localhost)
app.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log('  HC Iligan Backend Server Started');
  console.log('========================================');
  console.log(`Port: ${PORT}`);
  console.log('');
  console.log('Access URLs:');
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Network: http://192.168.1.218:${PORT}`);
  console.log('');
  console.log('API Endpoints:');
  console.log(`  Health Check: http://192.168.1.218:${PORT}/health`);
  console.log(`  Auth API:     http://192.168.1.218:${PORT}/api/auth`);
  console.log(`  Products API: http://192.168.1.218:${PORT}/api/products`);
  console.log(`  Projects API: http://192.168.1.218:${PORT}/api/projects`);
  console.log('========================================');
  console.log('');
});
