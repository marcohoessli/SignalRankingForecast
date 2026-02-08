/**
 * Calculate Brier Score for binary predictions
 * Brier Score = (p - o)^2 where p is predicted probability (0-1) and o is outcome (0 or 1)
 * Lower scores are better (0 is perfect, 1 is worst)
 */
export const calculateBrierScore = (
  predictedProbability: number, // 0-100
  actualOutcome: 'YES' | 'NO'
): number => {
  const p = predictedProbability / 100;
  const o = actualOutcome === 'YES' ? 1 : 0;
  return Math.pow(p - o, 2);
};

/**
 * Calculate average Brier Score for multiple predictions
 */
export const calculateAverageBrierScore = (
  predictions: Array<{ probability: number; outcome: 'YES' | 'NO' }>
): number => {
  if (predictions.length === 0) return 0;
  const totalScore = predictions.reduce((sum, pred) => {
    return sum + calculateBrierScore(pred.probability, pred.outcome);
  }, 0);
  return totalScore / predictions.length;
};
