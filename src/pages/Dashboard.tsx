
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import TaskList from '../components/TaskList';
import TaskCalendar from '../components/TaskCalendar';
import Navbar from '../components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ViewMode } from '../types';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchParams] = useSearchParams();
  
  const {
    tasks,
    allTasksFlat,
    urgentTasks,
    getDueSoonTasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    updateTaskParent,
  } = useTasks(!authLoading && !!user);

  // Show notifications for tasks due today or tomorrow
  useEffect(() => {
    if (!isLoading && allTasksFlat.length > 0) {
      const dueSoonTasks = getDueSoonTasks();
      
      if (dueSoonTasks.length > 0) {
        toast(`You have ${dueSoonTasks.length} task${dueSoonTasks.length > 1 ? 's' : ''} due soon`, {
          description: dueSoonTasks.map(t => t.title).join(', '),
          duration: 5000,
        });
      }
    }
  }, [isLoading, allTasksFlat.length]);

  // Handle task selection from URL parameter
  useEffect(() => {
    const taskId = searchParams.get('task');
    if (taskId) {
      // Implement task selection logic if needed
      console.log('Selected task ID:', taskId);
      // Could scroll to task, open edit modal, etc.
    }
  }, [searchParams]);

  const handleCreateTask = (data: any) => {
    createTask.mutate(data);
  };

  const handleUpdateTask = (taskId: string, data: any) => {
    updateTask.mutate({ id: taskId, ...data });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask.mutate(taskId);
  };

  const handleUpdateTaskParent = (taskId: string, newParentId: string | null) => {
    updateTaskParent.mutate({ taskId, newParentId });
  };

  // Mock function for Google Calendar sync - in a real app, this would call your API
  const handleGoogleCalendarSync = () => {
    toast.info('Google Calendar sync is not implemented in this demo');
  };

  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Not Authenticated</h1>
            <p className="text-muted-foreground">Please login to access your tasks</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Your Tasks</h1>
          <p className="text-muted-foreground">
            Manage your tasks and stay organized
          </p>
        </header>

        <div className="mb-6">
          <Tabs defaultValue={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              </TabsList>

              <button
                onClick={handleGoogleCalendarSync}
                className="text-sm text-primary hover:underline"
              >
                Sync to Google Calendar
              </button>
            </div>

            <TabsContent value="list" className="mt-0">
              <TaskList
                tasks={tasks}
                urgentTasks={urgentTasks}
                onCreateTask={handleCreateTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onUpdateTaskParent={handleUpdateTaskParent}
              />
            </TabsContent>

            <TabsContent value="calendar" className="mt-0">
              <TaskCalendar
                tasks={allTasksFlat}
                onUpdateTask={handleUpdateTask}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
