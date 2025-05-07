import pool from './config/db.js';

(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    console.log('DB Connected! Result:', rows[0].solution); // Should print 2
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
})();
