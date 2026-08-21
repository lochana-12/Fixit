// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Please add your full name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [/.+@.+\..+/, 'Please enter a valid email address'] // Basic email validation
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: [6, 'Password must be at least 6 characters long']
        },
        homeType: {
            type: String,
            required: [true, 'Please select your home type'],
            enum: ['apartment', 'house', 'condo', 'townhouse', 'mobile']
        },
        emailNotifications: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps
    }
);

// Hash password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;