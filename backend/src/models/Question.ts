import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  title: string;
  description: string;
  category: 'Crypto' | 'Politics' | 'Tech' | 'Sports' | 'Other';
  type: 'YES_NO' | 'NUMERIC';
  status: 'OPEN' | 'CLOSED' | 'RESOLVED';
  close_time: Date;
  resolve_time?: Date;
  outcome?: 'YES' | 'NO' | number;
  created_by: mongoose.Types.ObjectId;
  source_url?: string;
  tags: string[];
  created_at: Date;
  updated_at: Date;
}

const questionSchema = new Schema<IQuestion>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  category: {
    type: String,
    enum: ['Crypto', 'Politics', 'Tech', 'Sports', 'Other'],
    required: true
  },
  type: {
    type: String,
    enum: ['YES_NO', 'NUMERIC'],
    default: 'YES_NO'
  },
  status: {
    type: String,
    enum: ['OPEN', 'CLOSED', 'RESOLVED'],
    default: 'OPEN'
  },
  close_time: {
    type: Date,
    required: true
  },
  resolve_time: Date,
  outcome: {
    type: Schema.Types.Mixed
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source_url: String,
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

questionSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

const Question = mongoose.model<IQuestion>('Question', questionSchema);
export default Question;
