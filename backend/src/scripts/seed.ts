import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Question from '../models/Question';
import Prediction from '../models/Prediction';
import { calculateBrierScore } from '../utils/brierScore';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/signalranking');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Question.deleteMany({});
    await Prediction.deleteMany({});

    // Create admin user
    const admin = new User({
      email: process.env.ADMIN_EMAIL || 'admin@signalranking.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      name: 'Admin User',
      username: 'admin',
      roles: ['admin'],
      isVerified: true,
    });
    await admin.save();
    console.log('Admin user created');

    // Create demo users
    const demoUsers = [];
    const demoUserData = [
      { name: 'Alice Johnson', email: 'alice@example.com', username: 'alice_j' },
      { name: 'Bob Smith', email: 'bob@example.com', username: 'bob_smith' },
      { name: 'Carol Davis', email: 'carol@example.com', username: 'carol_d' },
      { name: 'David Wilson', email: 'david@example.com', username: 'david_w' },
      { name: 'Emma Brown', email: 'emma@example.com', username: 'emma_b' },
    ];

    for (const userData of demoUserData) {
      const user = new User({
        ...userData,
        password: 'demo123',
        isVerified: true,
      });
      await user.save();
      demoUsers.push(user);
    }
    console.log('Demo users created');

    // Create sample questions
    const questions = [
      {
        title: 'Will Bitcoin reach $100,000 by end of 2024?',
        description: 'Bitcoin has shown significant growth in 2024. Will it reach the milestone of $100,000 USD by December 31, 2024?',
        category: 'Crypto',
        type: 'YES_NO' as const,
        status: 'OPEN' as const,
        close_time: new Date('2024-12-31T23:59:59Z'),
        created_by: admin._id,
        source_url: 'https://coinmarketcap.com/currencies/bitcoin/',
        tags: ['bitcoin', 'cryptocurrency', 'price'],
      },
      {
        title: 'Will the US Federal Reserve cut interest rates in 2024?',
        description: 'The Federal Reserve has maintained high interest rates. Will they cut rates at any point in 2024?',
        category: 'Politics',
        type: 'YES_NO' as const,
        status: 'OPEN' as const,
        close_time: new Date('2024-12-31T23:59:59Z'),
        created_by: admin._id,
        source_url: 'https://www.federalreserve.gov/',
        tags: ['fed', 'interest-rates', 'economy'],
      },
      {
        title: 'Will Apple release a new iPhone model in 2024?',
        description: 'Apple typically releases new iPhone models annually. Will they release a new iPhone model in 2024?',
        category: 'Tech',
        type: 'YES_NO' as const,
        status: 'RESOLVED' as const,
        close_time: new Date('2024-09-30T23:59:59Z'),
        resolve_time: new Date('2024-09-10T12:00:00Z'),
        outcome: 'YES',
        created_by: admin._id,
        source_url: 'https://www.apple.com/iphone/',
        tags: ['apple', 'iphone', 'technology'],
      },
      {
        title: 'Will the Lakers win the NBA Championship in 2024?',
        description: 'The Los Angeles Lakers are one of the top contenders for the 2024 NBA Championship. Will they win it all?',
        category: 'Sports',
        type: 'YES_NO' as const,
        status: 'CLOSED' as const,
        close_time: new Date('2024-06-01T23:59:59Z'),
        created_by: admin._id,
        source_url: 'https://www.nba.com/lakers',
        tags: ['lakers', 'nba', 'basketball'],
      },
      {
        title: 'Will there be a major earthquake (magnitude 7.0+) in 2024?',
        description: 'Major earthquakes (magnitude 7.0 or higher) occur several times per year globally. Will at least one occur in 2024?',
        category: 'Other',
        type: 'YES_NO' as const,
        status: 'OPEN' as const,
        close_time: new Date('2024-12-31T23:59:59Z'),
        created_by: admin._id,
        source_url: 'https://earthquake.usgs.gov/',
        tags: ['earthquake', 'natural-disaster'],
      },
      {
        title: 'Will Ethereum 2.0 staking exceed 30% of total supply?',
        description: 'Will the amount of staked ETH exceed 30% of the total Ethereum supply by end of 2024?',
        category: 'Crypto',
        type: 'YES_NO' as const,
        status: 'OPEN' as const,
        close_time: new Date('2024-12-31T23:59:59Z'),
        created_by: admin._id,
        tags: ['ethereum', 'staking', 'crypto'],
      },
      {
        title: 'Will a new COVID-19 variant cause significant concern?',
        description: 'Will a new COVID-19 variant emerge that causes WHO to issue a significant warning in 2024?',
        category: 'Other',
        type: 'YES_NO' as const,
        status: 'OPEN' as const,
        close_time: new Date('2024-12-31T23:59:59Z'),
        created_by: admin._id,
        tags: ['covid', 'health', 'pandemic'],
      },
      {
        title: 'Will Tesla release a new Model 2 in 2024?',
        description: 'Tesla has hinted at a more affordable "Model 2". Will they officially release it in 2024?',
        category: 'Tech',
        type: 'YES_NO' as const,
        status: 'OPEN' as const,
        close_time: new Date('2024-12-31T23:59:59Z'),
        created_by: admin._id,
        source_url: 'https://www.tesla.com/',
        tags: ['tesla', 'electric-vehicles', 'automotive'],
      },
    ];

    const createdQuestions = [];
    for (const questionData of questions) {
      const question = new Question(questionData);
      await question.save();
      createdQuestions.push(question);
    }
    console.log('Sample questions created');

    // Create predictions for resolved questions
    for (let i = 0; i < createdQuestions.length; i++) {
      const question = createdQuestions[i];
      
      if (question.status === 'RESOLVED') {
        const actualOutcome = question.outcome;
        
        for (const user of demoUsers) {
          // Generate random predictions (biased towards correct for some users)
          const isAccurateForecaster = Math.random() > 0.3;
          let probability: number;
          
          if (isAccurateForecaster) {
            if (actualOutcome === 'YES') {
              probability = 60 + Math.random() * 35;
            } else {
              probability = 5 + Math.random() * 35;
            }
          } else {
            probability = 20 + Math.random() * 60;
          }

          const prediction = new Prediction({
            user_id: user._id,
            question_id: question._id,
            probability: Math.round(probability),
            editable_until: question.close_time,
          });

          prediction.brier_score = calculateBrierScore(
            prediction.probability,
            actualOutcome as 'YES' | 'NO'
          );
          prediction.is_correct = prediction.brier_score <= 0.25;

          await prediction.save();

          user.total_predictions += 1;
          user.resolved_predictions += 1;
        }

        const predictions = await Prediction.find({ question_id: question._id });
        question.avg_prediction = predictions.reduce((sum, p) => sum + p.probability, 0) / predictions.length;
        question.avg_brier = predictions.reduce((sum, p) => sum + (p.brier_score || 0), 0) / predictions.length;
        await question.save();
      }
    }

    // Update user Brier scores
    for (const user of demoUsers) {
      const userPredictions = await Prediction.find({ user_id: user._id, brier_score: { $exists: true } });
      if (userPredictions.length > 0) {
        const totalBrier = userPredictions.reduce((sum, p) => sum + (p.brier_score || 0), 0);
        user.avg_brier = totalBrier / userPredictions.length;
        await user.save();
      }
    }

    console.log('Predictions created and stats updated');
    console.log('Seed data completed successfully!');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedData();
