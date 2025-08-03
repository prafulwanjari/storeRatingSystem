const express = require('express');
const Rating = require('../models/Rating');
const Store = require('../models/Store');
const { auth, storeOwnerAuth } = require('../middleware/auth');

const ratingsRouter = express.Router();

// Submit or update rating
ratingsRouter.post('/', auth, async (req, res) => {
  try {
    const { storeId, rating } = req.body;

    // Manual validation
    if (!storeId) {
      return res.status(400).json({ error: 'Store ID is required' });
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
    }

    // Check if user has already rated this store
    const existingRating = await Rating.findOne({
      userId: req.user._id,
      storeId,
    });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      return res.json({
        message: 'Rating updated successfully',
        rating: existingRating,
      });
    }

    // Create new rating
    const newRating = new Rating({
      userId: req.user._id,
      storeId,
      rating,
    });
    await newRating.save();

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: newRating,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get store ratings (for store owners)
ratingsRouter.get('/store', storeOwnerAuth, async (req, res) => {
  try {
    const ratings = await Rating.find({ storeId: req.user.storeId })
      .populate('userId', 'name email address')
      .sort({ createdAt: -1 });

    const store = await Store.findById(req.user.storeId);

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json({
      ratings,
      averageRating: store.averageRating,
      totalRatings: store.totalRatings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = ratingsRouter;