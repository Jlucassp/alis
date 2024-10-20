const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Register User
router.post('/register', registerUser);

// Login User
router.post('/login', loginUser);

// Get User Profile (protected route)
router.get('/profile', protect, getUserProfile);

router.put('/profile', protect, updateUserProfile);

module.exports = router;