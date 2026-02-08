import express from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import questionRoutes from './questions';
import predictionRoutes from './predictions';
import leaderboardRoutes from './leaderboard';
import commentRoutes from './comments';
import challengeRoutes from './challenges';
import adminRoutes from './admin';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/questions', questionRoutes);
router.use('/predictions', predictionRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/comments', commentRoutes);
router.use('/challenges', challengeRoutes);
router.use('/admin', adminRoutes);

export default router;
