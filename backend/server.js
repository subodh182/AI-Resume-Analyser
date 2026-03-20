const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const jobRoutes = require('./routes/jobRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// =============================================
// CORS Configuration - Enhanced
// =============================================
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://ai-resume-analyser-khaki.vercel.app',
  process.env.FRONTEND_URL,
  /\.vercel\.app$/ // Allow all Vercel preview deployments
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') return allowed === origin;
      if (allowed instanceof RegExp) return allowed.test(origin);
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
}));

// Handle preflight requests
app.options('*', cors());

// =============================================
// Security Middleware
// =============================================
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
  crossOriginEmbedderPolicy: false
}));

// =============================================
// Rate Limiting
// =============================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// =============================================
// Body Parser Middleware
// =============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =============================================
// Logging
// =============================================
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// =============================================
// Static Files
// =============================================
app.use('/uploads', express.static('uploads'));

// =============================================
// Health Check Routes
// =============================================
app.get('/', (req, res) => {
  res.json({ 
    message: "Resume Analyzer API is running 🚀",
    status: "OK",
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// =============================================
// API Routes
// =============================================
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

// =============================================
// 404 Handler
// =============================================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// =============================================
// Error Handler (must be last)
// =============================================
app.use(errorHandler);

// =============================================
// Database Connection
// =============================================
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected Successfully');
    console.log(`📊 Database Host: ${conn.connection.host}`);
    console.log(`📁 Database Name: ${conn.connection.name}`);
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// =============================================
// Start Server
// =============================================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 Resume Analyzer Backend Server');
  console.log('='.repeat(50));
  console.log(`📡 Server running on port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Base URL: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log('='.repeat(50));
});

// =============================================
// Graceful Shutdown
// =============================================
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

// =============================================
// Handle Unhandled Promise Rejections
// =============================================
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  console.error('Stack:', err.stack);
  
  // Close server & exit
  server.close(() => {
    process.exit(1);
  });
});

// =============================================
// Handle Uncaught Exceptions
// =============================================
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error('Stack:', err.stack);
  
  process.exit(1);
});

module.exports = app;
