var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// MySQL connection pool
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'DogWalkService'
});

// /api/dogs
app.get('/api/dogs', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT Dogs.name AS dog_name, Dogs.size, Users.username AS owner_username
            FROM Dogs
            JOIN Users ON Dogs.owner_id = Users.user_id
        `);
        res.json(rows);
    } catch (err) {
        console.error('DB Error:', err.message);
        res.status(500).json({error: 'Failed to fetch dogs'});
    }
});

// /api/walkrequests/open
app.get('/api/walkrequests/open', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
            walkrequest.request_id,
            dog.name AS dog_name,
            walkrequest.requested_time,
            walkrequest.duration_minutes,
            walkrequest.location,
            user.username AS owner_username
            FROM WalkRequests walkrequest
            JOIN Dogs dog ON walkrequest.dog_id = dog.dog_id
            JOIN Users user ON dog.owner_id = user.user_id
            WHERE walkrequest.status = 'open'
        `);
        res.json(rows);
    } catch (err) {
        console.error ('DB Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch open walk requests' });
    }
});

// /api/walkers/summary
app.get('/api/walkers/summary', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
            user.username AS walker_username,
            COUNT(rate.rating_id) AS total_ratings,
            ROUND(AVG(rate.rating), 1) AS average_rating,
            COUNT(DISTINCT walkrequest.request_id) AS completed_walks
            FROM Users user
            LEFT JOIN WalkRatings rate ON user.user_id = rate.walker_id
            LEFT JOIN WalkApplications walkapply ON user.user_id = walkapply.walker_id
            LEFT JOIN WalkRequests walkrequest ON walkapply.request_id = walkrequest.request_id AND walkrequest.status = 'completed'
            WHERE user.role = 'walker'
            GROUP BY user.user_id
        `);
        res.json(rows);
    } catch (err) {
        console.error('DB Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch walk summary'});
    }
});

module.exports = app;
