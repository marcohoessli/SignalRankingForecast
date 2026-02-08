import express from 'express';
import User from '../models/User';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name username total_predictions resolved_predictions avg_brier rank_global best_category streak_correct created_at');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// Update my profile
router.put('/me', authenticate, async (req, res, next) => {
  try {
    const { name, username } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { name, username },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

export default router;
