import pool from '../config/db.js';
import { generateBase62Code, decodeBase62Code } from '../utils/helpers.js';

export const createLink = async (long_link) => {

  const [result] = await pool.query(
    'INSERT INTO links (short_link, long_link) VALUES (?, ?)',
    [short_link, long_link]
  );
  const id = result.insertId;

  const short_link = generateBase62Code(id);
};

export const getLink = async (short_link) => {
  const [rows] = await pool.query(
    'SELECT id, long_link FROM links WHERE short_link = ?',
    [short_link]
  );
  return rows[0];
};