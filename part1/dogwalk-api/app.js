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

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'DogWalkService'
});

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
            WHERE walkrequest.status = 'open
        '`);
        res.json(rows);
    } catch (err) {
        console.error ('DB Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch open walk requests' });
    }
});

app.get

module.exports = app;
