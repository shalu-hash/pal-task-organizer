
import React from 'react';
import { Task } from '../types';
import PriorityBadge from './PriorityBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface UrgentTasksProps {
  tasks: Task[];
}

const UrgentTasks: React.FC<UrgentTasksProps> = ({ tasks }) => {
  if (tasks.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Badge variant="destructive" className="mr-2">Top Priority</Badge>
          Urgent Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {tasks.map((task) => (
            <Link 
              key={task.id} 
              to={`/dashboard?task=${task.id}`}
              className="block py-3 hover:bg-accent/10 rounded px-2 -mx-2 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{task.title}</div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {task.due_date && (
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(task.due_date), 'MMM dd')}
                    </span>
                  )}
                  {task.priority_score !== undefined && (
                    <PriorityBadge score={task.priority_score} isTopUrgent />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UrgentTasks;
