// backend/server.js
const express = require('express');
const dotenv = require('dotenv').config(); // Load .env file at the very top
const cors = require('cors'); // Import CORS
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const port = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
// Middleware to parse URL-encoded data (for form submissions)
app.use(express.urlencoded({ extended: false }));

// Enable CORS for all origins (for development)
app.use(cors());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('FixIt Backend API is running!');
});

app.listen(port, () => console.log(`Server running on port ${port}`));