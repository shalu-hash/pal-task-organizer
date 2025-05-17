
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zoakyziekidbbxwusxyu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvYWt5emlla2lkYmJ4d3VzeHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MjAxMjksImV4cCI6MjA2MzA5NjEyOX0.w2jymRHiilzQLRxjewRMRsVVuw1mNB3DQgFD-InUpQI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
