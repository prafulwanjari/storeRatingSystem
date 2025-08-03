
const express = require('express');
const Store = require('../models/Store');
const User = require('../models/User');
const Rating = require('../models/Rating');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * ------------------ Manual Input Validation ------------------
 */
function validateStoreInput(data) {
  if (!data.name || data.name.length < 3 || data.name.length > 60) {
    return 'Store name must be 3-60 characters long';
  }
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    return 'Please enter a valid store email';
  }
  if (!data.address || data.address.length > 400) {
    return 'Address cannot exceed 400 characters';
  }
  if (!data.ownerName || data.ownerName.length < 3 || data.ownerName.length > 60) {
    return 'Owner name must be 3-60 characters long';
  }
  if (!data.ownerEmail || !/^\S+@\S+\.\S+$/.test(data.ownerEmail)) {
    return 'Please enter a valid owner email';
  }
  if (
    !data.ownerPassword ||
    !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,16}$/.test(data.ownerPassword)
  ) {
    return 'Owner password must be 8-16 characters and contain uppercase, lowercase, number, and a special character';
  }
  return null;
}

/**
 * ------------------ GET STORES (Normal Users) ------------------
 */
router.get('/', auth, async (req, res) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'asc' } = req.query;
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { address: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const sortDirection = sortOrder === 'desc' ? -1 : 1;
    const stores = await Store.find(query).sort({ [sortBy]: sortDirection });

    if (req.user.role === 'user') {
      const storeIds = stores.map((store) => store._id);
      const userRatings = await Rating.find({
        userId: req.user._id,
        storeId: { $in: storeIds }
      });

      const ratingsMap = userRatings.reduce((acc, rating) => {
        acc[rating.storeId] = rating.rating;
        return acc;
      }, {});

      return res.json(
        stores.map((store) => ({
          ...store.toObject(),
          userRating: ratingsMap[store._id] ?? null
        }))
      );
    }

    res.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

/**
 * ------------------ GET STORES (Admin Only) ------------------
 */
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', sortOrder = 'asc' } = req.query;
    const query = {};

    if (name) query.name = { $regex: name, $options: 'i' };
    if (email) query.email = { $regex: email, $options: 'i' };
    if (address) query.address = { $regex: address, $options: 'i' };

    const sortDirection = sortOrder === 'desc' ? -1 : 1;
    const stores = await Store.find(query)
      .populate('ownerId', 'name email')
      .sort({ [sortBy]: sortDirection });

    res.json(stores);
  } catch (error) {
    console.error('Error fetching admin stores:', error);
    res.status(500).json({ error: 'Failed to fetch admin stores' });
  }
});

/**
 * ------------------ ADD NEW STORE (Admin Only) ------------------
 */
router.post('/', adminAuth, async (req, res) => {
  try {
    console.log('Incoming data:', req.body);

    const error = validateStoreInput(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    const {
      name,
      email,
      address,
      ownerName,
      ownerEmail,
      ownerPassword,
      ownerAddress
    } = req.body;

    // Check for duplicates
    const [existingStore, existingUser] = await Promise.all([
      Store.findOne({ email }),
      User.findOne({ email: ownerEmail })
    ]);

    if (existingStore) {
      return res.status(409).json({ error: 'A store with this email already exists' });
    }
    if (existingUser) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }

    //  Create owner without storeId (password is plain, pre-save will hash & validate)
    const owner = new User({
      name: ownerName,
      email: ownerEmail,
      password: ownerPassword,
      address: ownerAddress,
      role: 'storeOwner'
    });
    await owner.save({ validateBeforeSave: true });

    //  Create store and link owner
    const store = new Store({
      name,
      email,
      address,
      ownerId: owner._id
    });
    await store.save();

    //  Update owner with storeId
    owner.storeId = store._id;
    await owner.save({ validateBeforeSave: false });

    res.status(201).json({
      message: 'Store and owner created successfully',
      store,
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email
      }
    });
  } catch (error) {
    console.error('Error adding store:', error);

    if (error.code === 11000) {
      return res.status(409).json({ error: 'Duplicate email detected' });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;