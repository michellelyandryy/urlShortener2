import pool from '../config/db.js';

//increments counter
export const incrementCounter = async (link_id) => {
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        //record log
        await conn.query(
            'INSERT INTO click_logs(link_id) VALUES (?)',
            [link_id]
        );

        //update summary with current timestamp + total click
        await conn.query(
           ` INSERT INTO click_summary (link_id, last_clicked_at, total_clicks) 
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

//counts for total links 
// export const getCount = async (link_id) => {
//     try {    
//         const [rows] = await pool.query(
//             'SELECT total_clicks FROM click_summary WHERE link_id = ?',
//             [link_id]
//         );
//         return rows[0]?.count || 0;
//     } catch (error) {
//         console.error('Error fetching counter:', error);
//         throw error;
//     }
// };

export const getSummary = async (link_id) => {
    try{
        const [summary] = await pool.query(
        `SELECT 
            total_clicks, 
            last_clicked_at
        FROM click_summary
        WHERE link_id = ?`,
        [link_id]);

        return summary[0] || {total_clicks: 0, last_clicked_at: null};
    } catch (error) {
        console.error('Error fetching click summary:', error);
        throw error;
    }
}

export const getRecentClick = async (link_id, limit = 10) => {
    const [rows] = await pool.query(
      `SELECT link_id, clicked_at
      FROM click_logs WHERE link_id = ?
      ORDER BY clicked_at DESC LIMIT ?`,
      [link_id, limit]
    );
    return rows;
};