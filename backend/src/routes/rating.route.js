import express from 'express';
import { getRatingsForStore, addRating, deleteRating } from '../controllers/rating.controller.js';
import protect from '../middlewares/protect.js';
import { restrictTo } from '../middlewares/restrictTo.js';

const router = express.Router();

router.get('/store/:storeId', protect, restrictTo('STORE_OWNER', 'ADMIN'), getRatingsForStore);
router.post('/store/:storeId', protect, restrictTo('USER'), addRating);
router.delete('/:id', protect, restrictTo('USER'), deleteRating);

export default router;