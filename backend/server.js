const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./controller/auth');
const userRoutes = require('./controller/users');
const storeRoutes = require('./controller/stores');
const ratingRoutes = require('./controller/ratings');

const app = express();


app.use(
  cors({
    origin: 'http://localhost:5173', // frontend URL
    credentials: true, // allow cookies / auth headers
  })
);

app.use(express.json());

// Database connection (modern way)
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI );
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
})();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});