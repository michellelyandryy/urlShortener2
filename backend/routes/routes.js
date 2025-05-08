import express from 'express';
import {
    createShortLink,
    redirectToLongLink,
    getLinkSummary,
    deleteShortLink,
    getAllLinks
} from '../controllers/linkController.js';

const router = express.Router();

router.post('/', createShortLink);
router.get('/', getAllLinks);
router.get('/:short_link', redirectToLongLink);

//for counter
router.get('/:short_link/count', getLinkSummary);
router.delete('/:short_link', deleteShortLink);

export default router;
