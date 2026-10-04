const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// 1. Security HTTP Headers with Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false // Allows external CDNs (e.g. Razorpay checkout)
}));

// 2. Production & Development CORS Configuration
const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(o => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const devOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:5500',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
  'http://127.0.0.1:5500'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser requests (e.g. server-to-server, curl, tests, mobile)
    if (!origin || origin === 'null') {
      return callback(null, true);
    }

    const cleanOrigin = origin.replace(/\/+$/, '');

    if (isProduction) {
      // In production, strictly enforce allowed origins (no unrestricted wildcard)
      if (configuredOrigins.length > 0 && configuredOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }
      return callback(new Error(`Blocked by CORS: Origin ${origin} is not allowed in production`));
    } else {
      // In development, allow localhost, 127.0.0.1, or configured origins
      if (
        devOrigins.includes(cleanOrigin) ||
        configuredOrigins.includes(cleanOrigin) ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin)
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// 3. Request Body Size Limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 4. Rate Limiting for Sensitive Endpoints
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
  }
});

const paymentRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many payment requests from this IP. Please try again after 15 minutes.'
  }
});

// 5. Health Check Endpoint (Always accessible)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AquaNest API is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 6. Mount Resource Routes (with rate limiters on auth & payment)
app.use('/api/auth', authRateLimiter, require('./routes/auth'));
app.use('/api/payment', paymentRateLimiter, require('./routes/payment'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));

// 7. 404 Handler for Unknown Routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// 8. Centralized Secure Error Handling Middleware
app.use((err, req, res, next) => {
  if (err.message && err.message.includes('Blocked by CORS')) {
    return res.status(403).json({
      success: false,
      message: err.message
    });
  }

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    console.error('Unhandled Server Error:', err);
  } else {
    console.error(`[Server Error] ${err.message}`);
  }

  const statusCode = err.statusCode || err.status || 500;
  const response = {
    success: false,
    message: isProd && statusCode === 500 ? 'Internal Server Error' : (err.message || 'Internal Server Error')
  };

  // Stack traces and internal secrets are NEVER exposed in production
  if (!isProd && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
});

/**
 * Start Server:
 * Connects to MongoDB first.
 * If database connection fails, displays clear error and prevents server from listening.
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Bootstrap default administrator account if needed
    const seedAdmin = require('./config/seedAdmin');
    await seedAdmin();

    const server = app.listen(PORT, () => {
      console.log(`========================================`);
      console.log(` AquaNest Backend Server Running`);
      console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Port: ${PORT}`);
      console.log(` Database: Connected via Mongoose`);
      console.log(` Health: http://localhost:${PORT}/api/health`);
      console.log(` Auth: http://localhost:${PORT}/api/auth`);
      console.log(` Products: http://localhost:${PORT}/api/products`);
      console.log(` Orders: http://localhost:${PORT}/api/orders`);
      console.log(` Users: http://localhost:${PORT}/api/users`);
      console.log(`========================================`);
    });

    return server;
  } catch (err) {
    console.error('====================================================');
    console.error('FATAL: Server startup aborted due to MongoDB failure.');
    console.error(`Reason: ${err.message}`);
    console.error('====================================================');
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw err;
  }
};

// Start Server if run directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
