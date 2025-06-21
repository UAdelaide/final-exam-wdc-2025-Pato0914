const express = require('express');
const path = require('path');
const session = require('express-session');
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
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Missing username or password' });
    }

    try {
        const conn = await mysql.createConnection(dbOptions);
        const [result] = await conn.execute(
            'SELECT user_id, username, password_hash, role FROM Users WHERE username = ?',
            [username]
        );
        await conn.end();

        if (result.length === 0 || result[0].password_hash !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result[0];
        req.session.userId = 
    }
})

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;