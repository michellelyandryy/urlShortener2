import pool from '../config/db.js';
import { generateBase62Code, decodeBase62Code, isValidLink } from '../utils/helpers.js';

// make link
export const createLink = async (long_link) => {

  if(!isValidLink(long_link)){
    return {
      success: false, 
      message: "Invalid link"
    }
  }

    const [latestId] = await pool.query('SELECT MAX(id) AS maxId FROM links');
    const nextId = (latestId[0].maxId || 0) + 1;
    const shortCode = generateBase62Code(nextId);

    try {
      const [result] = await pool.query(
        'INSERT INTO links (long_link, short_link) VALUES (?, ?)',
        [long_link, shortCode]
      );

      return {
        id: result.insertId,
        short_link: `short.ly/${shortCode}`
      };

    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.warn(`Duplicate short link '${shortCode}' detected. Retrying...`);
      } else {
        throw error;
      }
    }
};

export const fetchAllLinks = async () => {
  const [rows] = await pool.query('SELECT id, long_link, short_link FROM links');
  return rows;
}

// get linkkkkk
export const getLink = async (short_link) => {
  const shortCode = short_link.replace('short.ly/', ''); 
  const decoded = decodeBase62Code(shortCode);

  const [rows] = await pool.query(
    'SELECT id, long_link FROM links WHERE id = ?',
    [decoded]
  );

  return rows[0];
};

// Delete link logic remains unchanged
export const deleteLink = async (short_link) => {
  let conn;
  try {
    const shortCode = short_link.replace('short.ly/', '');

    conn = await pool.getConnection();
    await conn.beginTransaction();

      //check if link exists
      const [link] = await conn.query(
        'SELECT id FROM links WHERE short_link = ?',
        [shortCode]
      );

      if(link.length === 0){
        await conn.rollback();
        return {
          success: false, message: 'Short link not found'
        };
      }

      //delete counter first
      await conn.query(
        'DELETE FROM click_logs WHERE link_id = (SELECT id FROM links WHERE short_link = ?)',
        [link[0].id]
      );

      //delete the summary
      await conn.query(
        'DELETE FROM click_summary WHERE link_id = (SELECT id FROM links WHERE short_link = ?)',
        [link[0].id]
      );

      //rm link
      const [result] = await conn.query(
        'DELETE FROM links WHERE short_link = ?',
        [shortCode]
      );

      await conn.commit();
      return result.affectedRows > 0 ? {
        success: true, message: "Yay, short url deleted"
      } 
      :{
        success: false, message: "Darn, deletion failed"
      };

    } catch (error){
      //no orphan record
      await conn.rollback();
      return { 
        success: false, 
        message: 'Short link not found' 
      };
    } finally {
    if (conn) conn.release();
  }
};
