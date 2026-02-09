import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import userRouter from './src/routes/user.route.js';
import storeRouter from './src/routes/store.route.js';
import ratingRouter from './src/routes/rating.route.js';
import adminRouter from './src/routes/admin.route.js';
import ownerRouter from './src/routes/owner.route.js';

import { connectDB } from './src/database/database.js';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Rate limiting for auth routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
});
app.use('/api/auth', limiter);

// Routes
app.use('/api/auth', userRouter);
app.use('/api/stores', storeRouter);
app.use('/api/ratings', ratingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/owner', ownerRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

async function startServer() {
  try {
    await connectDB();
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();