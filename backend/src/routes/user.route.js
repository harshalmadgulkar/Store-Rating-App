import express from 'express';
import protect from '../middlewares/protect.js';
import { getMe, login, logout, signup, updatePassword } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.patch('/password', protect, updatePassword);

export default router;