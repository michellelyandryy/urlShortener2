import {
    createLink,
    getLink,
    deleteLink,
    fetchAllLinks
  } from "../models/Link.js";
  
  import {
    incrementCounter,
    getCount,
    getSummary,
    getRecentClick
  } from "../models/Counter.js";
  
  import pool from '../config/db.js';
  
  // Create short link
  export const createShortLink = async (req, res) => {
    try {
      const { long_link, custom_alias } = req.body;
      if (!long_link) {
        return res.status(400).json({ message: 'Original link is required' });
      }
  
      const { id, short_link } = await createLink(long_link, custom_alias);
      res.status(201).json({ id, short_link, long_link });
    } catch (error) {
      console.error('Error creating short link:', error);
      res.status(500).json({ message: "Issue creating short link" });
    }
  };
  
  // Get all links
  export const getAllLinks = async (req, res) => {
    try {
      const links = await fetchAllLinks();
      res.status(200).json(links);
    } catch (error) {
      console.error("Error fetching all links:", error);
      res.status(500).json({ message: "Failed to fetch links" });
    }
  };
  
  // Redirect
  export const redirectToLongLink = async (req, res) => {
    try {
      const { short_link } = req.params;
  
      if (!short_link || !/^[a-zA-Z0-9]{6}$/.test(short_link)) {
        return res.status(400).json({ message: 'Invalid short link format' });
      }
  
      const link = await getLink(short_link);
      if (!link) {
        return res.status(404).json({ message: 'Link not found' });
      }
  
      incrementCounter(link.id).catch(err =>
        console.error("Counter failed:", err)
      );
  
      res.status(302).redirect(link.long_link);
    } catch (error) {
      console.error('Redirection error:', error);
      res.status(500).json({ message: "Redirection error" });
    }
  };
  
  // Click count
  export const getLinkCount = async (req, res) => {
    try {
      const { short_link } = req.params;
  
      const link = await getLink(short_link);
      if (!link) {
        return res.status(404).json({ message: 'Link not found' });
      }
  
      const count = await getCount(link.id);
      res.status(200).json({
        short_link,
        long_link: link.long_link,
        clicks: count
      });
    } catch (error) {
      console.error('Error fetching link clicks:', error);
      res.status(500).json({ message: "Error getting click count" });
    }
  };
  
  // Delete
  export const deleteShortLink = async (req, res) => {
    try {
      const { short_link } = req.params;
  
      const isDeleted = await deleteLink(short_link);
      if (!isDeleted) {
        return res.status(404).json({ message: "Link not found" });
      }
  
      res.status(200).json({ message: "Link successfully deleted" });
    } catch (error) {
      console.error('Error deleting link:', error);
      res.status(500).json({ message: "Deleting error" });
    }
  };
  
  // Get summary for one link
  export const getLinkSummary = async (req, res) => {
    try {
      const { short_link } = req.params;
      const summary = await getSummary(short_link);
      if (!summary) {
        return res.status(404).json({ message: "Link not found" });
      }
  
      const recent = await getRecentClick(summary.link_id);
      res.json({ ...summary, recent_clicks: recent });
    } catch (error) {
      console.error('Error fetching summary:', error);
      res.status(500).json({ message: "Error fetching data" });
    }
  };
  
  // Analytics summary
  export const getAnalyticsSummary = async (req, res) => {
    console.log("🔍 getAnalyticsSummary hit!");
  
    try {
      const [mostClicked] = await pool.query(`
        SELECT short_link, long_link, total_clicks 
        FROM click_summary 
        JOIN links ON click_summary.link_id = links.id 
        ORDER BY total_clicks DESC 
        LIMIT 1
      `);
      console.log("✔ mostClicked result:", mostClicked);
  
      const [leastClicked] = await pool.query(`
        SELECT short_link, long_link, total_clicks 
        FROM click_summary 
        JOIN links ON click_summary.link_id = links.id 
        ORDER BY total_clicks ASC 
        LIMIT 1
      `);
  
      const [recentClick] = await pool.query(`
        SELECT links.short_link, links.long_link, click_logs.clicked_at 
        FROM click_logs 
        JOIN links ON click_logs.link_id = links.id 
        ORDER BY clicked_at DESC 
        LIMIT 1
      `);
  
      res.json({
        mostClicked: mostClicked[0] || null,
        leastClicked: leastClicked[0] || null,
        recentClick: recentClick[0] || null
      });
    } catch (error) {
      console.error("❌ Error fetching analytics summary:", error);
      res.status(500).json({ message: "Analytics error" });
    }
  };
  