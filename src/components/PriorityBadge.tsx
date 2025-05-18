
import React from 'react';
import { formatPriorityScore, getPriorityColor, getPriorityLevel } from '../lib/priorityUtils';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Bell } from 'lucide-react';

interface PriorityBadgeProps {
  score: number;
  isTopUrgent?: boolean;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ score, isTopUrgent = false }) => {
  const colorClass = getPriorityColor(score);
  const priorityLevel = getPriorityLevel(score);
  
  const getIcon = () => {
    if (priorityLevel === 'high') return <Bell size={14} />;
    if (priorityLevel === 'medium') return <Clock size={14} />;
    return <Calendar size={14} />;
  };
  
  return (
    <Badge 
      variant="outline" 
      className={`
        inline-flex items-center justify-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full
        ${colorClass} bg-opacity-20 border-current
        ${isTopUrgent ? 'animate-pulse-priority' : ''}
      `}
    >
      {getIcon()}
      {formatPriorityScore(score)}
    </Badge>
  );
};

export default PriorityBadge;
