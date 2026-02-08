export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  avatar_url?: string;
  roles: ('user' | 'admin')[];
  isVerified: boolean;
  stats: {
    total_predictions: number;
    resolved_predictions: number;
    avg_brier: number;
    rank_global?: number;
    streak_correct: number;
  };
}

export interface Question {
  _id: string;
  title: string;
  description: string;
  category: 'Crypto' | 'Politics' | 'Tech' | 'Sports' | 'Other';
  status: 'OPEN' | 'CLOSED' | 'RESOLVED';
  close_time: string;
  resolve_time?: string;
  outcome?: 'YES' | 'NO';
  created_by: string;
  source_url?: string;
  tags: string[];
  created_at: string;
  prediction_count?: number;
  avg_prediction?: number;
  avg_brier?: number;
}

export interface Prediction {
  _id: string;
  user_id: string;
  question_id: string;
  probability: number;
  created_at: string;
  updated_at: string;
  brier_score?: number;
  is_correct?: boolean;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  username?: string;
  resolved_predictions: number;
  avg_brier: number;
  rank?: number;
}
