const express = require('express');
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Manual validator for user input
function validateUserInput(data) {
  if (!data.name || data.name.length < 3 || data.name.length > 60) {
    return 'Name must be 3-60 characters';
  }
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    return 'Please enter a valid email';
  }
  if (
    !data.password ||
    !/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(data.password)
  ) {
    return 'Password must be 8-16 characters and contain uppercase and special character';
  }
  if (!data.address || data.address.length > 400) {
    return 'Address cannot exceed 400 characters';
  }
  if (!['user', 'admin', 'storeOwner'].includes(data.role)) {
    return 'Role must be user, admin, or storeOwner';
  }
  return null;
}

// Get dashboard statistics (admin only)
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $in: ['user', 'storeOwner'] } });
    const totalStores = await Store.countDocuments();
    const totalRatings = await Rating.countDocuments();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', sortOrder = 'asc' } = req.query;
    let query = { role: { $ne: 'admin' } };

    if (name) query.name = { $regex: name, $options: 'i' };
    if (email) query.email = { $regex: email, $options: 'i' };
    if (address) query.address = { $regex: address, $options: 'i' };
    if (role && role !== 'all') query.role = role;

    const sortDirection = sortOrder === 'desc' ? -1 : 1;
    const users = await User.find(query)
      .select('-password')
      .populate('storeId', 'name averageRating')
      .sort({ [sortBy]: sortDirection });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user details by ID (admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('storeId', 'name averageRating');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new user (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const error = validateUserInput(req.body);
    if (error) return res.status(400).json({ error });

    const { name, email, password, address, role, storeId } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Ensure storeId is provided if role is storeOwner
    if (role === 'storeOwner' && !storeId) {
      return res.status(400).json({ error: 'Store ID is required for store owners' });
    }

    // Create user (password will be hashed automatically in User.js)
    const user = new User({ name, email, password, address, role, storeId });
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;