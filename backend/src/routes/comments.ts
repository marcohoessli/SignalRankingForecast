import express from 'express';
import Comment from '../models/Comment';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get comments for a question
router.get('/question/:questionId', async (req, res, next) => {
  try {
    const comments = await Comment.find({ question_id: req.params.questionId })
      .populate('user_id', 'name')
      .sort({ created_at: -1 });

    res.json({ comments });
  } catch (error) {
    next(error);
  }
});

// Create comment
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { question_id, body } = req.body;

    const comment = new Comment({
      question_id,
      user_id: req.user!._id,
      body
    });

    await comment.save();
    await comment.populate('user_id', 'name');

    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
});

export default router;
