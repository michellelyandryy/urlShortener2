import pool from '../config/db.js';

// Increments the click counter
export const incrementCounter = async (link_id) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Record click in logs
    await conn.query(
      'INSERT INTO click_logs(link_id) VALUES (?)',
      [link_id]
    );

    // Update or insert summary
    await conn.query(
      `INSERT INTO click_summary (link_id, last_clicked_at, total_clicks) 
       VALUES (?, CURRENT_TIMESTAMP, 1)
       ON DUPLICATE KEY UPDATE
         last_clicked_at = CURRENT_TIMESTAMP,
         total_clicks = total_clicks + 1`,
      [link_id, new Date()]
    );

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    console.error('Counter increment failed:', error);
    throw error;
  } finally {
    conn.release();
  }
};

// Fetch total clicks for a link
export const getCount = async (link_id) => {
  try {
    const [rows] = await pool.query(
      'SELECT total_clicks FROM click_summary WHERE link_id = ?',
      [link_id]
    );
    return rows[0]?.total_clicks || 0;
  } catch (error) {
    console.error('Error fetching counter:', error);
    throw error;
  }
};

// Fetch detailed summary for a short link
export const getSummary = async (short_link) => {
  try {
    const [summary] = await pool.query(
      `SELECT 
         l.id AS link_id,
         l.short_link,
         l.long_link,
         l.created_at,
         COALESCE(s.total_clicks, 0) AS total_clicks,
         s.last_clicked_at
       FROM links l
       LEFT JOIN click_summary s ON l.id = s.link_id
       WHERE l.short_link = ?`,
      [short_link]
    );

    if (!summary[0]) return null;

    return summary[0];
  } catch (error) {
    console.error('Error fetching click summary:', error);
    throw error;
  }
};

// Fetch recent click logs for a link
export const getRecentClick = async (link_id, limit = 10) => {
  try {
    const [rows] = await pool.query(
      `SELECT link_id, clicked_at
       FROM click_logs
       WHERE link_id = ?
       ORDER BY clicked_at DESC
       LIMIT ?`,
      [link_id, limit]
    );
    return rows;
  } catch (error) {
    console.error('Error fetching recent clicks:', error);
    throw error;
  }
};
