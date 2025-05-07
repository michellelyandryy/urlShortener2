import pool from '../config/db.js';
import { generateBase62Code, decodeBase62Code } from '../utils/helpers.js';

export const createLink = async (long_link) => {

  const [result] = await pool.query(
    'INSERT INTO links (long_link) VALUES (?)',
    [long_link]
  );
  const id = result.insertId;

  const short_link = generateBase62Code(id);

  await pool.query(
    'UPDATE links SET short_link = ? WHERE id = ?',
    [short_link, id]
  );

  return {id, short_link};
};

export const getLink = async (short_link) => {

  const id = decodeBase62Code(short_link);

  const [rows] = await pool.query(
    'SELECT id, long_link FROM links WHERE id = ?',
    [id]
  );
  return rows[0];
};