import pool from '../config/db.js';
import { generateBase62Code, decodeBase62Code } from '../utils/helpers.js';

// Create link with retry logic to avoid duplicate short_link
export const createLink = async (long_link) => {
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    const [latestId] = await pool.query('SELECT MAX(id) AS maxId FROM links');
    const nextId = (latestId[0].maxId || 0) + 1 + attempt;
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
        attempt++;
      } else {
        throw error;
      }
    }
  }

  throw new Error('Failed to generate a unique short link after multiple attempts.');
};


export const fetchAllLinks = async () => {
  const [rows] = await pool.query('SELECT id, long_link, short_link FROM links');
  return rows;
}
// Get link by short code
export const getLink = async (short_link) => {
  const shortCode = short_link; // expected to be clean, not prefixed
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
    const shortCode = short_link;

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [link] = await conn.query(
      'SELECT id FROM links WHERE short_link = ?',
      [shortCode]
    );

    if (link.length === 0) {
      await conn.rollback();
      return { success: false, message: 'Short link not found' };
    }

    await conn.query(
      'DELETE FROM counter WHERE link_id = (SELECT id FROM links WHERE short_link = ?)',
      [shortCode]
    );

    const [result] = await conn.query(
      'DELETE FROM links WHERE short_link = ?',
      [shortCode]
    );

    await conn.commit();
    return result.affectedRows > 0
      ? { success: true, message: "Short URL deleted" }
      : { success: false, message: "Deletion failed" };

  } catch (error) {
    if (conn) await conn.rollback();
    console.error('Delete failed:', error);
    return {
      success: false,
      message: 'Server error during delete'
    };
  } finally {
    if (conn) conn.release();
  }
};
