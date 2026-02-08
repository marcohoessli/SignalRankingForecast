import express from 'express';
import crypto from 'crypto';
import Challenge from '../models/Challenge';
import ChallengeEntry from '../models/ChallengeEntry';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Create challenge
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { question_id } = req.body;

    const invite_code = crypto.randomBytes(6).toString('hex');

    const challenge = new Challenge({
      question_id,
      creator_user_id: req.user!._id,
      invite_code,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    await challenge.save();

    res.status(201).json({ 
      challenge: {
        ...challenge.toObject(),
        share_url: `${process.env.FRONTEND_URL}/challenge/${invite_code}`
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get challenge by code
router.get('/:code', async (req, res, next) => {
  try {
    const challenge = await Challenge.findOne({ invite_code: req.params.code })
      .populate('question_id', 'title description category status close_time')
      .populate('creator_user_id', 'name');

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const entries = await ChallengeEntry.find({ challenge_id: challenge._id })
      .populate('user_id', 'name')
      .sort({ created_at: -1 });

    res.json({ challenge, entries });
  } catch (error) {
    next(error);
  }
});

// Join challenge
router.post('/:code/join', authenticate, async (req, res, next) => {
  try {
    const { probability } = req.body;

    const challenge = await Challenge.findOne({ invite_code: req.params.code });
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Check if already joined
    const existingEntry = await ChallengeEntry.findOne({
      challenge_id: challenge._id,
      user_id: req.user!._id
    });

    if (existingEntry) {
      return res.status(400).json({ message: 'Already joined this challenge' });
    }

    const entry = new ChallengeEntry({
      challenge_id: challenge._id,
      user_id: req.user!._id,
      probability
    });

    await entry.save();

    res.status(201).json({ entry });
  } catch (error) {
    next(error);
  }
});

export default router;
