import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface Student {
  id: string;
  name: string;
  class: string;
  created_at: string;
}

export interface PassLog {
  id: string;
  student_id: string;
  action_type: 'generated' | 'verified' | 'revoked';
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface RevokedPass {
  id: string;
  student_id: string;
  reason?: string;
  revoked_by?: string;
  created_at: string;
}