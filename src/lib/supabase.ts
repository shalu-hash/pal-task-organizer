
import { createClient } from '@supabase/supabase-js';

// We don't have env variables in this environment, but would use these in a real project
const supabaseUrl = 'https://your-supabase-project.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
