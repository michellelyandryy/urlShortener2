import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// console.log('Database configuration:', {
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   database: process.env.DB_NAME
// });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shorter',
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 10000 
});

// Test conn
pool.getConnection()
  .then(conn => {
    console.log('Successfully connected to database!');
    conn.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1); 
  });

export default pool;