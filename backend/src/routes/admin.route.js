import express from 'express';
import protect from '../middlewares/protect.js';
import { restrictTo } from '../middlewares/restrictTo.js';
import { createUser, getAllUsers, getUserDetail, createStore, getAllStoresAdmin, getDashboard } from '../controllers/admin.controller.js';

const router = express.Router();

router.use(protect, restrictTo('ADMIN'));

router.get('/dashboard', getDashboard);
router.post('/users', createUser);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetail);
router.post('/stores', createStore);
router.get('/stores', getAllStoresAdmin);

export default router;