const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();



router.post('/register', async (req, res) => {
  try {
    let { name, email, password, address } = req.body;

    // Trim inputs
    name = name?.trim();
    email = email?.trim().toLowerCase();
    address = address?.trim();

    // Manual validation
    if (!name || name.length < 20 || name.length > 60) {
      return res.status(400).json({ error: 'Name must be 20-60 characters' });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email' });
    }
    if (!password || password.length < 8 || password.length > 16) {
      return res.status(400).json({ error: 'Password must be 8-16 characters' });
    }
    if (!/[A-Z]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      return res.status(400).json({
        error:
          'Password must contain at least one uppercase and one special character',
      });
    }
    if (address && address.length > 400) {
      return res
        .status(400)
        .json({ error: 'Address cannot exceed 400 characters' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({ name, email, password, address, role: 'user' });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});



router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    // Trim inputs
    email = email?.trim().toLowerCase();

    // Manual validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeId: user.storeId,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});



router.get('/me', auth, async (req, res) => {
  try {
    // Fetch user details from DB, exclude password
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get User Profile Error:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});



router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Manual validation
    if (!currentPassword) {
      return res.status(400).json({ error: 'Current password is required' });
    }
    if (!newPassword || newPassword.length < 8 || newPassword.length > 16) {
      return res.status(400).json({ error: 'Password must be 8-16 characters' });
    }
    if (!/[A-Z]/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
      return res.status(400).json({
        error:
          'Password must contain at least one uppercase and one special character',
      });
    }

    const user = await User.findById(req.user._id);
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

module.exports = router;