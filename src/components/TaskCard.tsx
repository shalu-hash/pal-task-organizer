
import React, { useState } from 'react';
import { Task } from '../types';
import PriorityBadge from './PriorityBadge';
import TaskForm from './TaskForm';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { Edit, Trash2, Plus, ChevronDown, ChevronUp, MoveUp, MoveDown, List } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TaskCardProps {
  task: Task;
  depth?: number;
  onUpdate: (taskId: string, data: any) => void;
  onDelete: (taskId: string) => void;
  onAddSubtask: (parentId: string, data: any) => void;
  onMoveTask?: (taskId: string, direction: 'up' | 'down') => void;
  isUrgent?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  depth = 0,
  onUpdate,
  onDelete,
  onAddSubtask,
  onMoveTask,
  isUrgent = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddSubtask, setShowAddSubtask] = useState(false);

  const handleUpdate = (data: any) => {
    onUpdate(task.id, data);
    setIsEditing(false);
  };

  const handleAddSubtask = (data: any) => {
    onAddSubtask(task.id, data);
    setShowAddSubtask(false);
  };

  const formattedDueDate = task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'No due date';
  const hasChildren = task.children && task.children.length > 0;

  return (
    <div className={`task-indent-${depth > 5 ? 5 : depth}`}>
      <div className={`mb-2 p-3 rounded-lg border bg-card transition-all ${isUrgent ? 'border-accent' : ''}`}>
        {!isEditing ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {hasChildren && (
                  <CollapsibleTrigger
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground"
                  >
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </CollapsibleTrigger>
                )}
                <h3 className="font-medium">{task.title}</h3>
                {task.priority_score !== undefined && (
                  <PriorityBadge score={task.priority_score} isTopUrgent={isUrgent} />
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <List size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowAddSubtask(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Add subtask
                    </DropdownMenuItem>
                    {onMoveTask && (
                      <>
                        <DropdownMenuItem onClick={() => onMoveTask(task.id, 'up')}>
                          <MoveUp className="mr-2 h-4 w-4" /> Move up
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onMoveTask(task.id, 'down')}>
                          <MoveDown className="mr-2 h-4 w-4" /> Move down
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem 
                      onClick={() => onDelete(task.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
            )}
            
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <div>Due: {formattedDueDate}</div>
              <div>Weight: {task.weight}</div>
            </div>
          </>
        ) : (
          <TaskForm 
            task={task} 
            onSubmit={handleUpdate} 
            onCancel={() => setIsEditing(false)} 
          />
        )}
      </div>
      
      {showAddSubtask && (
        <div className={`ml-${depth + 1} mb-2 p-3 rounded-lg border bg-card`}>
          <TaskForm
            parentId={task.id}
            onSubmit={handleAddSubtask}
            onCancel={() => setShowAddSubtask(false)}
          />
        </div>
      )}
      
      {hasChildren && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent>
            {task.children?.map((child) => (
              <TaskCard
                key={child.id}
                task={child}
                depth={depth + 1}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onAddSubtask={onAddSubtask}
                onMoveTask={onMoveTask}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export default TaskCard;
