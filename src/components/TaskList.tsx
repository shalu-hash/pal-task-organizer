import React, { useState } from 'react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { Task } from '../types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import UrgentTasks from './UrgentTasks';

interface TaskListProps {
  tasks: Task[];
  urgentTasks: Task[];
  onCreateTask: (data: any) => void;
  onUpdateTask: (taskId: string, data: any) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskParent: (taskId: string, newParentId: string | null) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  urgentTasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onUpdateTaskParent,
}) => {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before activation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper to find a task by ID in the nested structure
  const findTaskById = (tasks: Task[], id: string): Task | null => {
    for (const task of tasks) {
      if (task.id === id) return task;
      if (task.children && task.children.length > 0) {
        const found = findTaskById(task.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper to find a task's parent
  const findParentTask = (tasks: Task[], childId: string): Task | null => {
    for (const task of tasks) {
      if (task.children && task.children.some(child => child.id === childId)) {
        return task;
      }
      if (task.children && task.children.length > 0) {
        const found = findParentTask(task.children, childId);
        if (found) return found;
      }
    }
    return null;
  };

  // Event handlers for drag and drop
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over) return;
    setHoveredTaskId(event.over.id.toString());
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setHoveredTaskId(null);
    
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    const activeTaskId = active.id.toString();
    const overTaskId = over.id.toString();
    
    // If dropping onto the same parent or root level, just reorder
    // Otherwise, change the parent
    const parentTask = findParentTask(tasks, activeTaskId);
    
    // If dropping onto another task, make it a child of that task
    const overTask = findTaskById(tasks, overTaskId);
    if (overTask) {
      onUpdateTaskParent(activeTaskId, overTaskId);
      return;
    }
    
    // If dropping at root level and it wasn't already at root
    if (!parentTask) {
      onUpdateTaskParent(activeTaskId, null);
    }
  };
  
  const handleMoveTask = (taskId: string, direction: 'up' | 'down') => {
    // Implementation for manual reordering 
    // This would require additional tracking of task positions in the database
    console.log(`Move task ${taskId} ${direction}`);
  };

  const renderTaskHierarchy = (taskList: Task[]) => {
    return taskList.map(task => (
      <TaskCard
        key={task.id}
        task={task}
        onUpdate={onUpdateTask}
        onDelete={onDeleteTask}
        onAddSubtask={onCreateTask}
        onMoveTask={handleMoveTask}
        isDragging={activeId === task.id}
        isHovered={hoveredTaskId === task.id}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Urgent Tasks Section */}
      {urgentTasks.length > 0 && (
        <UrgentTasks tasks={urgentTasks} />
      )}
      
      {/* Add New Task Button */}
      <div className="mb-4">
        {!showNewTaskForm ? (
          <Button onClick={() => setShowNewTaskForm(true)} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add New Task
          </Button>
        ) : (
          <div className="border rounded-lg p-4 bg-card">
            <TaskForm 
              onSubmit={(data) => {
                onCreateTask(data);
                setShowNewTaskForm(false);
              }}
              onCancel={() => setShowNewTaskForm(false)}
            />
          </div>
        )}
      </div>
      
      {/* Task List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No tasks yet. Create one to get started!
              </div>
            ) : (
              renderTaskHierarchy(tasks)
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TaskList;
