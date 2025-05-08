import express from 'express';
import {
    createShortLink,
    redirectToLongLink,
    getLinkCount,
    deleteShortLink,
    getAllLinks
} from '../controllers/linkController.js';

const router = express.Router();

router.post('/', createShortLink);
router.get('/', getAllLinks);
router.get('/:short_link', redirectToLongLink);
router.get('/:short_link/count', getLinkCount);
router.delete('/:short_link', deleteShortLink);

export default router;
