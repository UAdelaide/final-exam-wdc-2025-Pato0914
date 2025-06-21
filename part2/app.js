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

// Session Settings
app.use(session({
    secret: 'walkapp-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 86400000 // 1 day in ms
    }
}));

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
        req.session.userId = user.user_id;
        req.session.username = user.username;
        req.session.role = user.role;

        return res.json({ success: true, role: user.role, username: user.username });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Login process failed' });
    }
});

// Middleware for Authentication
const verifyUser = (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ message: 'Please log in' });
    next();
};

const verifyOwner = (req, res, next) => {
    if (req.session.role !== 'owner') return res.status(403).json({ message: 'Access restricted to owners' });
    next();
};

const verifyWalker = (req, res, next) => {
  if (req.session.role !== 'walker') return res.status(403).json({ message: 'Access restricted to walkers' });
  next();
};

// Route to Check Auth Session
app.get('/api/auth/check', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Session not found' });
    }
    res.json({
        userId: req.session.userId,
        username: req.session.username,
        role: req.session.role
    });
});

// Get Logged-In User Info
app.get('/api/users/me', verifyUser, (req, res) => {
  res.json({
    userId: req.session.userId,
    username: req.session.username,
    role: req.session.role
  });
});

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;