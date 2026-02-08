import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  username?: string;
  roles: ('user' | 'admin')[];
  isVerified: boolean;
  created_at: Date;
  last_login_at?: Date;
  total_predictions: number;
  resolved_predictions: number;
  avg_brier: number;
  rank_global?: number;
  streak_correct: number;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  roles: {
    type: [String],
    enum: ['user', 'admin'],
    default: ['user']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  last_login_at: Date,
  total_predictions: {
    type: Number,
    default: 0
  },
  resolved_predictions: {
    type: Number,
    default: 0
  },
  avg_brier: {
    type: Number,
    default: 0
  },
  rank_global: Number,
  streak_correct: {
    type: Number,
    default: 0
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  if (this.password) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
