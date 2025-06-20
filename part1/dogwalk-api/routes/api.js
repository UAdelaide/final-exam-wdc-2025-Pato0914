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

router.get('/dogs')