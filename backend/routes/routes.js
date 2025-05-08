import express from 'express';
import {
  createShortLink,
  redirectToLongLink,
  getLinkSummary,
  deleteShortLink,
  getAllLinks,
  getAnalyticsSummary
} from '../controllers/linkController.js';

const router = express.Router();

// 📌 These must be at the top to prevent being overridden by /:short_link
router.get('/analytics', getAnalyticsSummary);
router.get('/', getAllLinks);

// Short link operations
router.post('/', createShortLink);
router.get('/:short_link', redirectToLongLink);
router.get('/:short_link/count', getLinkSummary);
router.delete('/:short_link', deleteShortLink);

export default router;
