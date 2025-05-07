import pool from '../config/db.js';

export const createLink = async (long_link) => {
  const short_link = generateBase62Code();
  const [result] = await pool.query(
    'INSERT INTO links (short_link, long_link) VALUES (?, ?)',
    [short_link, long_link]
  );
  return { id: result.insertId, short_link };
};

export const getLink = async (short_link) => {
  const [rows] = await pool.query(
    'SELECT id, long_link FROM links WHERE short_link = ?',
    [short_link]
  );
  return rows[0];
};