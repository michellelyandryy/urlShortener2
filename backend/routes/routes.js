import express from 'express';
import {
    createShortLink,
    redirectToLongLink,
    getLinkSummary,
    deleteShortLink
} from '../controllers/linkController.js';

const router = express.Router();

//route new short link
router.post('/', createShortLink);

//for redirect
router.get('/:short_link', redirectToLongLink);

//for counter
router.get('/:short_link/count', getLinkSummary);

//for delete
router.delete('/:short_link', deleteShortLink)

export default router;