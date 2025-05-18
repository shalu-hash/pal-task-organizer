
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
  due_date?: string;
  user_id: string;
  parent_id?: string | null;
  weight?: number;
  priority_score?: number;
  days_remaining?: number;
  children?: Task[];
  
  // For backward compatibility
  dueDate?: string; 
  userId?: string;
}

export type ViewMode = 'list' | 'calendar';

export interface TaskFormData {
  id?: string;
  title: string;
  description: string;
  due_date: string | null;
  weight: number;
  parent_id: string | null;
  user_id?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
  
  // For backward compatibility
  dueDate?: string | null;
  userId?: string;
}
