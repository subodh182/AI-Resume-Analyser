const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const serverless = require('serverless-http');
require('dotenv').config();

const authRoutes = require('../routes/authRoutes');
const resumeRoutes = require('../routes/resumeRoutes');
const jobRoutes = require('../routes/jobRoutes');
const userRoutes = require('../routes/userRoutes');
const errorHandler = require('../middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Root Route
app.get('/', (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

// Health
app.get('/health', (req, res) => {
  res.json({ status: "OK" });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

// MongoDB Connection (connect once)
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));
}

module.exports = serverless(app);
