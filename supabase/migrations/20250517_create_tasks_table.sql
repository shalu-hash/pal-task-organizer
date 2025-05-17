
-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'medium',
  dueDate TEXT,
  userId UUID NOT NULL,
  parent_id UUID REFERENCES public.tasks(id),
  weight INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies to ensure users can only access their own tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own tasks
CREATE POLICY select_own_tasks ON tasks 
  FOR SELECT USING (auth.uid() = "userId");

-- Allow users to insert their own tasks
CREATE POLICY insert_own_tasks ON tasks 
  FOR INSERT WITH CHECK (auth.uid() = "userId");

-- Allow users to update their own tasks
CREATE POLICY update_own_tasks ON tasks 
  FOR UPDATE USING (auth.uid() = "userId");

-- Allow users to delete their own tasks
CREATE POLICY delete_own_tasks ON tasks 
  FOR DELETE USING (auth.uid() = "userId");
