
import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Task } from '../types';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import TaskForm from './TaskForm';
import { getPriorityColor } from '../lib/priorityUtils';

interface TaskCalendarProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, data: any) => void;
}

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: Task;
};

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks, onUpdateTask }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const events: CalendarEvent[] = tasks
    .filter(task => task.due_date)
    .map(task => ({
      id: task.id,
      title: task.title,
      start: new Date(task.due_date!),
      end: new Date(task.due_date!),
      allDay: true,
      resource: task,
    }));

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedTask(event.resource);
    setIsDialogOpen(true);
  };

  const handleUpdateTask = (data: any) => {
    if (selectedTask) {
      onUpdateTask(selectedTask.id, data);
      setIsDialogOpen(false);
    }
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const priority = event.resource.priority_score || 0;
    const colorClass = getPriorityColor(priority).replace('text-', 'bg-');
    
    return {
      style: {
        backgroundColor: colorClass === 'bg-priority-high' ? '#EF4444' : 
                        colorClass === 'bg-priority-medium' ? '#F59E0B' : '#10B981',
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0',
        display: 'block',
      }
    };
  };

  return (
    <div className="h-[70vh]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>{selectedTask?.title || 'Edit Task'}</DialogTitle>
          {selectedTask && (
            <TaskForm
              task={selectedTask}
              onSubmit={handleUpdateTask}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskCalendar;
