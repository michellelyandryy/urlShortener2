import shortid from 'shortid';
import pool from '../config/db.js';
import { generateBase62Code, decodeBase62Code } from '../utils/helpers.js';

//make link
export const createLink = async (long_link) => {

  const [result] = await pool.query(
    'INSERT INTO links (long_link) VALUES (?)',
    [long_link]
  );
  const id = result.insertId;

  //check for uniqueness
  let isUnique = false;
  let short_link;
  while(!isUnique){
    const short_link = generateBase62Code(id).replace('short.ly/', '');

    const [existingLink] = await pool.query(
      `SELECT short_link FROM links WHERE short_link = ?`,
      [short_link]
    );

    if(existingLink.length === 0){
      isUnique = true;
    }
  }

  await pool.query(
    'UPDATE links SET short_link = ? WHERE id = ?',
    [short_link, id]
  );

  return {id: result.insertId, short_link: `short.ly/${short_link}`};
};

//searches for link
export const getLink = async (short_link) => {

  const id = short_link.replace('short.ly/', '');
  const decoded = decodeBase62Code(id);

  const [rows] = await pool.query(
    'SELECT id, long_link FROM links WHERE id = ?',
    [decoded]
  );
  return rows[0];
};

//rm link
export const deleteLink = async (short_link) => {
  const shortCode = short_link.replace('short.ly/', '');

  const result = await pool.query(
    'DELETE FROM links WHERE short_link = ?',
    [shortCode]
  );
  return result.affectedRows > 0;
}