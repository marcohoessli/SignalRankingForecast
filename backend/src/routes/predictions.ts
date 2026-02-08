import express from 'express';
import Prediction from '../models/Prediction';
import Question from '../models/Question';
import User from '../models/User';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Create prediction
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { questionId, probability } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.status !== 'OPEN') {
      return res.status(400).json({ message: 'Question is not open for predictions' });
    }

    if (new Date() > new Date(question.close_time)) {
      return res.status(400).json({ message: 'Question has closed' });
    }

    // Check if user already predicted
    let prediction = await Prediction.findOne({
      user_id: req.user!._id,
      question_id: questionId
    });

    if (prediction) {
      // Update existing prediction
      prediction.probability = probability;
      prediction.updated_at = new Date();
      await prediction.save();
    } else {
      // Create new prediction
      prediction = new Prediction({
        user_id: req.user!._id,
        question_id: questionId,
        probability,
        editable_until: question.close_time
      });
      await prediction.save();

      // Update user stats
      await User.findByIdAndUpdate(req.user!._id, {
        $inc: { total_predictions: 1 }
      });
    }

    res.json({ prediction });
  } catch (error) {
    next(error);
  }
});

// Get my predictions
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const predictions = await Prediction.find({ user_id: req.user!._id })
      .populate('question_id', 'title category status outcome close_time')
      .sort({ created_at: -1 });

    res.json({ predictions });
  } catch (error) {
    next(error);
  }
});

export default router;
