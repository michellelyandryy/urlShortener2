import express from 'express';
import {
    createShortLink,
    redirectToLongLink,
    getLinkCount
} from '../controllers/linkController.js';

const router = express.Router();

//route new short link
router.post('/', createShortLink);

//for redirect
router.get('/:short_link', redirectToLongLink);

//for counter
router.get('/:short_link/count', getLinkCount);

export default router;