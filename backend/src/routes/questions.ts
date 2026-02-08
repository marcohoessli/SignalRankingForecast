import express from 'express';
import Question from '../models/Question';
import Prediction from '../models/Prediction';
import { authenticate, requireAdmin } from '../middleware/auth';
import { calculateBrierScore } from '../utils/brierScore';

const router = express.Router();

// Get all questions
router.get('/', async (req, res, next) => {
  try {
    const { category, status, search, sort = 'created_at' } = req.query;
    
    let query: any = {};
    
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const questions = await Question.find(query)
      .populate('created_by', 'name')
      .sort({ [sort as string]: -1 });

    res.json({ questions });
  } catch (error) {
    next(error);
  }
});

// Get single question
router.get('/:id', async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('created_by', 'name');
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Get prediction stats
    const predictions = await Prediction.find({ question_id: req.params.id });
    const predictionCount = predictions.length;
    const avgPrediction = predictionCount > 0 
      ? predictions.reduce((sum, p) => sum + p.probability, 0) / predictionCount 
      : null;

    res.json({ 
      question: {
        ...question.toObject(),
        prediction_count: predictionCount,
        avg_prediction: avgPrediction
      }
    });
  } catch (error) {
    next(error);
  }
});

// Create question (admin only)
router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { title, description, category, close_time, source_url, tags } = req.body;

    const question = new Question({
      title,
      description,
      category,
      close_time: new Date(close_time),
      created_by: req.user!._id,
      source_url,
      tags: tags || []
    });

    await question.save();
    res.status(201).json({ question });
  } catch (error) {
    next(error);
  }
});

// Resolve question (admin only)
router.post('/:id/resolve', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { outcome } = req.body;
    
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.status = 'RESOLVED';
    question.outcome = outcome;
    question.resolve_time = new Date();
    await question.save();

    // Calculate Brier scores for all predictions
    const predictions = await Prediction.find({ question_id: req.params.id });
    
    for (const prediction of predictions) {
      prediction.brier_score = calculateBrierScore(
        prediction.probability,
        outcome as 'YES' | 'NO'
      );
      prediction.is_correct = prediction.brier_score <= 0.25;
      await prediction.save();
    }

    res.json({ question });
  } catch (error) {
    next(error);
  }
});

export default router;
