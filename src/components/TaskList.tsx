
import React, { useState } from 'react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // This is a simplified example. In a real app, you'd need to handle
      // hierarchy changes more carefully, checking for cycles, etc.
      onUpdateTaskParent(active.id.toString(), over.id.toString());
    }
  };

  const renderTaskHierarchy = (taskList: Task[]) => {
    return taskList.map(task => (
      <TaskCard
        key={task.id}
        task={task}
        onUpdate={onUpdateTask}
        onDelete={onDeleteTask}
        onAddSubtask={onCreateTask}
        onMoveTask={(taskId, direction) => {
          // Handle task reordering here
          console.log(`Move task ${taskId} ${direction}`);
        }}
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
