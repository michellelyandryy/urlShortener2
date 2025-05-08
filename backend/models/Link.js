// import shortid from 'shortid';
import pool from '../config/db.js';
import { generateBase62Code, decodeBase62Code } from '../utils/helpers.js';

//make link
export const createLink = async (long_link) => {

  const [latestId] = await pool.query('SELECT MAX(id) AS maxId FROM links');
  const nextId = (latestId[0].maxId || 0) + 1; //get next id
  const short_link = generateBase62Code(nextId);

  const [result] = await pool.query(
    'INSERT INTO links (long_link, short_link) VALUES (?, ?)',
    [long_link, short_link]
  );

  return {
    id: result.insertId, short_link: `${short_link}`};
};

//searches for link
export const getLink = async (short_link) => {
  try {
    const shortCode = short_link  //.replace('short.ly/', '');
    const decoded = decodeBase62Code(shortCode);

    const [rows] = await pool.query(
      'SELECT id, long_link FROM links WHERE id = ?',
      [decoded]
    );
    return rows[0];
  } catch (error){
    console.error('Error fetching link:', error);
    throw error;
  }
};

//rm link
export const deleteLink = async (short_link) => {
  let conn;
  try{  
    const shortCode = short_link //.replace('short.ly/', '');

    //validate syntax
    // if (!shortCode || !/^[a-zA-Z0-9]{6}$/.test(shortCode)) {
    //   return { success: false, message: 'Invalid short URL format' };
    // }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    try{

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
      throw error;
    } finally {
      //relesse conn
      conn.release();
    }

  } catch (error) {
    console.error('Delete failed:', error);
    return{
      success: false,
      message: 'Server error during deleting process',
    };
  }
};