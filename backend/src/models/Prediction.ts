import mongoose, { Document, Schema } from 'mongoose';

export interface IPrediction extends Document {
  user_id: mongoose.Types.ObjectId;
  question_id: mongoose.Types.ObjectId;
  probability: number;
  created_at: Date;
  updated_at: Date;
  editable_until: Date;
  brier_score?: number;
  is_correct?: boolean;
}

const predictionSchema = new Schema<IPrediction>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  question_id: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
    index: true
  },
  probability: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  editable_until: {
    type: Date,
    required: true
  },
  brier_score: Number,
  is_correct: Boolean
});

predictionSchema.index({ user_id: 1, question_id: 1 }, { unique: true });

predictionSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

const Prediction = mongoose.model<IPrediction>('Prediction', predictionSchema);
export default Prediction;
