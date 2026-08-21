// backend/controllers/authController.js
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, homeType, agreeTerms, emailNotifications } = req.body;

    if (!fullName || !email || !password || !homeType || !agreeTerms) {
        res.status(400).json({ message: 'Please enter all required fields.' });
        return;
    }

    if (!agreeTerms) {
        res.status(400).json({ message: 'You must agree to the Terms of Service and Privacy Policy.' });
        return;
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    // Create user
    const user = await User.create({
        fullName,
        email,
        password, // Password will be hashed by the pre-save hook in User model
        homeType,
        emailNotifications: emailNotifications || false // Default to false if not provided
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            homeType: user.homeType,
            emailNotifications: user.emailNotifications,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            homeType: user.homeType,
            emailNotifications: user.emailNotifications,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

// @desc    Get user data (for profile or session check)
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    // req.user is set by the protect middleware
    res.status(200).json(req.user);
});


module.exports = {
    registerUser,
    loginUser,
    getMe,
};