import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jygkhetecyfdvyfgxuer.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5Z2toZXRlY3lmZHZ5Zmd4dWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDYxOTIsImV4cCI6MjA2MzI4MjE5Mn0.z63Ggm5QwvxXFoosYwdIrYs94JuzM7WFcAAIj3gymi0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
