var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// ✅ Seed database with test data
const mysql = require('mysql2/promise');

(async function seedDatabase() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'DogWalkService'
    });

    const [users] = await conn.query('SELECT COUNT(*) AS count FROM Users');
    if (users[0].count === 0) {
      await conn.query(`
        INSERT INTO Users (username, email, password_hash, role) VALUES
        ('alice123', 'alice@example.com', 'hashed123', 'owner'),
        ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
        ('carol123', 'carol@example.com', 'hashed789', 'owner'),
        ('davewalker', 'dave@example.com', 'hashed101', 'walker'),
        ('eveowner', 'eve@example.com', 'hashed202', 'owner');
      `);
      console.log('✅ Users inserted.');
    }

    const [dogs] = await conn.query('SELECT COUNT(*) AS count FROM Dogs');
    if (dogs[0].count === 0) {
      await conn.query(`
        INSERT INTO Dogs (owner_id, name, size)
        VALUES
        ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
        ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
        ((SELECT user_id FROM Users WHERE username = 'eveowner'), 'Rocky', 'large'),
        ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Daisy', 'medium'),
        ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Milo', 'small');
      `);
      console.log('✅ Dogs inserted.');
    }

    await conn.end();
  } catch (err) {
    console.error('❌ Error during DB seed:', err.message);
  }
})();

module.exports = app;
