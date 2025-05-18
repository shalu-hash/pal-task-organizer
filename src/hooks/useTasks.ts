
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Task, TaskFormData } from '../types';
import { calculatePriority } from '../lib/priorityUtils';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

// Helper function to build task hierarchy
const buildTaskHierarchy = (tasks: Task[]): Task[] => {
  const taskMap: Record<string, Task> = {};
  const rootTasks: Task[] = [];

  // First pass: Create task map
  tasks.forEach(task => {
    // Calculate priority score and days remaining
    const { score, daysRemaining } = calculatePriority(task.weight || 3, task.due_date || task.dueDate);
    task.priority_score = score;
    task.days_remaining = daysRemaining;
    task.children = [];
    
    taskMap[task.id] = task;
  });

  // Second pass: Build hierarchy
  tasks.forEach(task => {
    if (task.parent_id === null) {
      rootTasks.push(task);
    } else if (taskMap[task.parent_id || '']) {
      taskMap[task.parent_id || ''].children!.push(task);
    }
  });

  return rootTasks;
};

export const useTasks = (enableQuery = true) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch all tasks for current user
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as Task[];
    },
    enabled: enableQuery && !!user,
  });

  // Create a new task
  const createTask = useMutation({
    mutationFn: async (taskData: TaskFormData) => {
      // Add the current user ID to the task data
      const newTaskData = {
        ...taskData,
        user_id: user?.id,
        completed: false, 
        priority: 'medium',
      };
      
      const { data, error } = await supabase
        .from('tasks')
        .insert([newTaskData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tasks']});
      toast.success('Task created successfully');
    },
    onError: (error: any) => {
      console.error("Task creation error:", error);
      toast.error(`Failed to create task: ${error.message}`);
    },
  });

  // Update a task
  const updateTask = useMutation({
    mutationFn: async ({ id, ...taskData }: TaskFormData & { id: string }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tasks']});
      toast.success('Task updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update task: ${error.message}`);
    },
  });

  // Delete a task
  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      // First, delete all child tasks recursively
      const deleteChildren = async (parentId: string) => {
        const { data: childTasks } = await supabase
          .from('tasks')
          .select('id')
          .eq('parent_id', parentId);

        if (childTasks && childTasks.length > 0) {
          for (const child of childTasks) {
            await deleteChildren(child.id);
          }
        }

        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', parentId);

        if (error) {
          throw error;
        }
      };

      await deleteChildren(taskId);
      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tasks']});
      toast.success('Task deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete task: ${error.message}`);
    },
  });

  // Update task parent (for drag and drop)
  const updateTaskParent = useMutation({
    mutationFn: async ({ taskId, newParentId }: { taskId: string; newParentId: string | null }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({ parent_id: newParentId })
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tasks']});
    },
    onError: (error: any) => {
      toast.error(`Failed to update task hierarchy: ${error.message}`);
    },
  });

  // Process tasks into hierarchical structure if available
  const processedTasks = tasks ? buildTaskHierarchy(tasks) : [];

  // Get flat list of all tasks with priority scores
  const allTasksFlat = tasks ? tasks.map(task => {
    const { score, daysRemaining } = calculatePriority(task.weight || 3, task.due_date || task.dueDate);
    return {
      ...task,
      priority_score: score,
      days_remaining: daysRemaining
    };
  }).sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0)) : [];

  // Get top 5 urgent tasks
  const urgentTasks = allTasksFlat.slice(0, 5);

  // Get tasks due today or tomorrow for notifications
  const getDueSoonTasks = () => {
    if (!tasks) return [];
    
    return tasks.filter(task => {
      if (!task.due_date && !task.dueDate) return false;
      
      const dueDate = new Date(task.due_date || task.dueDate || '');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      return (
        dueDate.getTime() === today.getTime() || 
        dueDate.getTime() === tomorrow.getTime()
      );
    });
  };

  return {
    tasks: processedTasks,
    allTasksFlat,
    urgentTasks,
    getDueSoonTasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    updateTaskParent,
  };
};
