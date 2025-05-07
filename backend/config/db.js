import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'shorter',
    waitForConnections: true,
    connectionLimit: 10
});

export default pool;