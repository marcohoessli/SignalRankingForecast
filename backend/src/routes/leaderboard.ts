import express from 'express';
import User from '../models/User';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { min_resolved = 10, limit = 50 } = req.query;

    const users = await User.find({
      resolved_predictions: { $gte: parseInt(min_resolved as string) }
    })
    .sort({ avg_brier: 1 })
    .limit(parseInt(limit as string))
    .select('name username resolved_predictions avg_brier rank_global streak_correct');

    // Add rank
    const rankedUsers = users.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1
    }));

    res.json({ users: rankedUsers });
  } catch (error) {
    next(error);
  }
});

export default router;
