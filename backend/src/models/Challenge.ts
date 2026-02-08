import mongoose, { Document, Schema } from 'mongoose';

export interface IChallenge extends Document {
  question_id: mongoose.Types.ObjectId;
  creator_user_id: mongoose.Types.ObjectId;
  invite_code: string;
  created_at: Date;
  expires_at: Date;
}

const challengeSchema = new Schema<IChallenge>({
  question_id: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  creator_user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invite_code: {
    type: String,
    required: true,
    unique: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  expires_at: {
    type: Date,
    required: true
  }
});

const Challenge = mongoose.model<IChallenge>('Challenge', challengeSchema);
export default Challenge;
