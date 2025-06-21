const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// MySQL Connection Details
const dbOptions = {
    host: 'localhost',
    user: 'root',
    // password: 'root', # comment out this part and created empty for testing use
    password: '',
    database: 'DogWalkService'
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

// Handle User Login
app.post('/login', async (req, res,))

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;