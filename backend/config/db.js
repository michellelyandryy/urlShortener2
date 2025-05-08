import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config;
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? '***hidden***' : '(empty)');
console.log("DB_NAME:", process.env.DB_NAME);


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'shorter',
    waitForConnections: true,
    connectionLimit: 10
});

export default pool;