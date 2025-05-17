
// Add any types you need for your application
export interface User {
  id: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  userId: string;
  parent_id?: string | null;
  weight?: number;
  due_date?: string | null; // for backward compatibility
  priority_score?: number;
  days_remaining?: number;
  children?: Task[];
}

export type ViewMode = 'list' | 'calendar';

export interface TaskFormData {
  id?: string;
  title: string;
  description: string;
  due_date: string | null;
  dueDate?: string | null;
  weight: number;
  parent_id: string | null;
  userId?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
}
