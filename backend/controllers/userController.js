const User = require('../models/User');

/**
 * @desc   Get all users from MongoDB
 * @route  GET /api/users
 * @access Public / Admin
 */
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Register a new user in MongoDB
 * @route  POST /api/users
 * @access Public
 */
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, phone, role } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    if (!email || email.trim() === '' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address is required'
      });
    }

    const emailClean = email.toLowerCase().trim();
    const existing = await User.findOne({ email: emailClean });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `User with email '${email}' already exists`
      });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: emailClean,
      phone: phone ? phone.trim() : '',
      role: role || 'customer'
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully in MongoDB',
      data: newUser
    });
  } catch (err) {
    next(err);
  }
};
