import express from 'express';
import { getAllStores, getStore, addStore, deleteStore } from '../controllers/store.controller.js';
import protect from '../middlewares/protect.js';
import { restrictTo } from '../middlewares/restrictTo.js';

const router = express.Router();

router.get('/', protect, restrictTo('USER', 'STORE_OWNER', 'ADMIN'), getAllStores);
router.get('/:id', protect, restrictTo('USER', 'STORE_OWNER', 'ADMIN'), getStore);
router.post('/', protect, restrictTo('ADMIN'), addStore); // Admin only
router.delete('/:id', protect, restrictTo('ADMIN'), deleteStore); // Admin only

export default router;