import mongoose, { Document, Schema } from 'mongoose';

export interface IChallengeEntry extends Document {
  challenge_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  probability: number;
  created_at: Date;
}

const challengeEntrySchema = new Schema<IChallengeEntry>({
  challenge_id: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  }
});

challengeEntrySchema.index({ challenge_id: 1, user_id: 1 }, { unique: true });

const ChallengeEntry = mongoose.model<IChallengeEntry>('ChallengeEntry', challengeEntrySchema);
export default ChallengeEntry;
