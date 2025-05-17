
/**
 * Calculate priority score for a task
 * Formula: weight / max(1, daysUntilDue)
 * 
 * @param weight Task weight (1-5)
 * @param dueDate Task due date (ISO string)
 * @returns Object with priority score and days remaining
 */
export const calculatePriority = (weight: number, dueDate: string | null): { 
  score: number; 
  daysRemaining: number 
} => {
  if (!dueDate) {
    return { score: 0, daysRemaining: Infinity };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  // Calculate days remaining
  const diffTime = due.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Calculate priority score: weight / max(1, daysRemaining)
  const score = weight / Math.max(1, daysRemaining);
  
  return { 
    score: Number(score.toFixed(2)), 
    daysRemaining 
  };
};

/**
 * Get priority level based on score
 */
export const getPriorityLevel = (score: number): 'low' | 'medium' | 'high' => {
  if (score >= 2) return 'high';
  if (score >= 1) return 'medium';
  return 'low';
};

/**
 * Get color class based on priority level
 */
export const getPriorityColor = (score: number): string => {
  const level = getPriorityLevel(score);
  return `text-priority-${level}`;
};

/**
 * Format the priority score to be displayed
 */
export const formatPriorityScore = (score: number): string => {
  return score.toFixed(2);
};
