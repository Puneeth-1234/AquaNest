const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware:
 * Verifies JWT from 'Authorization: Bearer <token>' header.
 * Rejects missing or invalid tokens with 401 Unauthorized.
 * Attaches authenticated user document to req.user.
 */
const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No authorization token provided.'
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('FATAL: JWT_SECRET environment variable is missing.');
      return res.status(500).json({
        success: false,
        message: 'Internal server configuration error.'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (jwtErr) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please log in again.'
      });
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Malformed token payload.'
      });
    }

    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account associated with this token was not found.'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Admin Authorization Middleware:
 * Allows only users with role === 'admin' to access admin-only endpoints.
 * Returns 403 Forbidden for non-admin accounts.
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin privileges required.'
    });
  }

  next();
};

/**
 * Optional Authentication Middleware:
 * If a valid token is provided, attaches req.user.
 * If no token or invalid, req.user is null and request proceeds (for guest checkout).
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      req.user = null;
      return next();
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      req.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, secret);
      if (decoded && decoded.id) {
        const user = await User.findById(decoded.id).select('-passwordHash');
        req.user = user || null;
      } else {
        req.user = null;
      }
    } catch (e) {
      req.user = null;
    }

    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

module.exports = {
  authenticate,
  requireAdmin,
  optionalAuth
};
