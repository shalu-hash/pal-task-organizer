
export interface Task {
  id: string;
  user_id: string;
  parent_id: string | null;
  title: string;
  description: string | null;
  due_date: string | null; // ISO format date string
  weight: number; // 1-5
  created_at: string;
  updated_at: string;
  
  // Computed fields
  priority_score?: number;
  days_remaining?: number;
  children?: Task[];
}

export interface User {
  id: string;
  email: string;
}

export type ViewMode = 'list' | 'calendar';

export interface TaskFormData {
  title: string;
  description: string;
  due_date: string | null;
  weight: number;
  parent_id: string | null;
}
