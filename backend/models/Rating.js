const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 500
  }
}, { timestamps: true });

// Ensure one rating per user per store
ratingSchema.index({ userId: 1, storeId: 1 }, { unique: true });

// Hooks to update store stats
ratingSchema.post('save', async function() {
  await updateStoreRating(this.storeId);
});

ratingSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) await updateStoreRating(doc.storeId);
});

ratingSchema.post('remove', async function() {
  await updateStoreRating(this.storeId);
});

ratingSchema.post('findOneAndDelete', async function(doc) {
  if (doc) await updateStoreRating(doc.storeId);
});

async function updateStoreRating(storeId) {
  const Rating = mongoose.model('Rating');
  const Store = mongoose.model('Store');

  const ratings = await Rating.find({ storeId });
  const totalRatings = ratings.length;
  const averageRating = totalRatings > 0 
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
    : 0;

  await Store.findByIdAndUpdate(storeId, {
    averageRating: Math.round(averageRating * 10) / 10,
    totalRatings
  });
}

module.exports = mongoose.model('Rating', ratingSchema);