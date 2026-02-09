import express from 'express';
import { getOwnerDashboard } from '../controllers/owner.controller.js';
import protect from '../middlewares/protect.js';
import { restrictTo } from '../middlewares/restrictTo.js';

const router = express.Router();

router.use(protect, restrictTo('STORE_OWNER'));

router.get('/dashboard', getOwnerDashboard);

export default router;