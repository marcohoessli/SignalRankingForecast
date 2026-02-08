import express from 'express';
import User from '../models/User';
import Question from '../models/Question';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Get all users (admin only)
router.get('/users', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const users = await User.find()
      .select('name email roles isVerified created_at')
      .sort({ created_at: -1 });

    res.json({ users });
  } catch (error) {
    next(error);
  }
});

// Promote/demote admin (admin only)
router.put('/users/:id/role', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { role } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { roles: [role] } },
      { new: true }
    ).select('name email roles');

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// Get admin dashboard stats
router.get('/stats', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const openQuestions = await Question.countDocuments({ status: 'OPEN' });
    const resolvedQuestions = await Question.countDocuments({ status: 'RESOLVED' });

    res.json({
      stats: {
        totalUsers,
        totalQuestions,
        openQuestions,
        resolvedQuestions
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
