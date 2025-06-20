const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Create database pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'DogWalkService'
});

router.get('/dogs', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT Dogs.name AS dog_name, Dogs.size, Users.username AS owner_username
            FROM Dogs
            JOIN Users ON Dogs.owner_id = Users.user_id
        `);
        res.json(rows);
    }
})