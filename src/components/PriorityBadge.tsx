
import React from 'react';
import { formatPriorityScore, getPriorityColor } from '../lib/priorityUtils';

interface PriorityBadgeProps {
  score: number;
  isTopUrgent?: boolean;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ score, isTopUrgent = false }) => {
  const colorClass = getPriorityColor(score);
  
  return (
    <span 
      className={`
        inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full
        ${colorClass} bg-opacity-20 ${isTopUrgent ? 'animate-pulse-priority' : ''}
      `}
    >
      {formatPriorityScore(score)}
    </span>
  );
};

export default PriorityBadge;
