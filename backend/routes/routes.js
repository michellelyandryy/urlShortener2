import express from 'express';
import {
    createShortLink,
    redirectToLongLink,
    getLinkSummary,
    deleteShortLink,
    getAllLinks
} from '../controllers/linkController.js';

const router = express.Router();

//make link
router.post('/', createShortLink);

//grab all link
router.get('/', getAllLinks);

//for redirect
router.get('/:short_link', redirectToLongLink);

//for counter
router.get('/:short_link/count', getLinkSummary);

//for del link
router.delete('/:short_link', deleteShortLink);

export default router;
