import pool from '../config/db.js';

//increments counter
export const incrementCounter = async (link_id) => {
    try{   
        await pool.query(
        `INSERT INTO counter (link-id, count)
        VALUES (?, 0)
        ON DUPLICATE KEY UPDATE count = count + 1`,
        [link_id]);
    } catch (error) {
        console.error('Error incrementing counter:', error);
        throw error;
    }
};

//counts for total links 
export const getCount = async (link_id) => {
    try {    
        const [rows] = await pool.query(
            'SELECT count FROM counter WHERE link_id = ?',
            [link_id]
        );
        return rows[0]?.count || 0;
    } catch (error) {
        console.error('Error fetching counter:', error);
        throw error;
    }
};