import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  question_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  body: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

const commentSchema = new Schema<IComment>({
  question_id: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  body: {
    type: String,
    required: true,
    maxlength: 1000
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
});

commentSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

const Comment = mongoose.model<IComment>('Comment', commentSchema);
export default Comment;
