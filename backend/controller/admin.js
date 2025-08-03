router.get('/admin', adminAuth, async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', sortOrder = 'asc' } = req.query;
    let query = {};
    
    if (name) query.name = { $regex: name, $options: 'i' };
    if (email) query.email = { $regex: email, $options: 'i' };
    if (address) query.address = { $regex: address, $options: 'i' };

    const sortDirection = sortOrder === 'desc' ? -1 : 1;
    const stores = await Store.find(query)
      .populate('ownerId', 'name email')
      .sort({ [sortBy]: sortDirection });
    
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new store (admin only)
router.post('/', adminAuth, [
  body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be 20-60 characters'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('address').isLength({ max: 400 }).withMessage('Address cannot exceed 400 characters'),
  body('ownerName').isLength({ min: 20, max: 60 }).withMessage('Owner name must be 20-60 characters'),
  body('ownerPassword').isLength({ min: 8, max: 16 }).withMessage('Password must be 8-16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/).withMessage('Password must contain uppercase and special character')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, address, ownerName, ownerEmail, ownerPassword, ownerAddress } = req.body;
    
    // Check if store email already exists
    const existingStore = await Store.findOne({ email });
    if (existingStore) {
      return res.status(400).json({ error: 'Store with this email already exists' });
    }

    // Check if owner email already exists
    const existingUser = await User.findOne({ email: ownerEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create store owner
    const owner = new User({
      name: ownerName,
      email: ownerEmail,
      password: ownerPassword,
      address: ownerAddress,
      role: 'storeOwner'
    });
    await owner.save();

    // Create store
    const store = new Store({
      name,
      email,
      address,
      ownerId: owner._id
    });
    await store.save();

    // Update owner with store reference
    owner.storeId = store._id;
    await owner.save();

    res.status(201).json({ store, owner: { id: owner._id, name: owner.name, email: owner.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;