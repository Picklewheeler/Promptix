import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type UserRole = 'executive' | 'it_manager' | 'systems_admin' | 'sales' | '3d_modeler' | 'employee';
export type Department = 'Executive' | 'IT/Infrastructure' | 'Sales' | 'Design & Development';

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  department: Department;
  rank: string;
  avatar_url?: string;
  isActive: boolean;
  created_at: string;
}

// Helper function to check if a user has management access
export const hasManagementAccess = (role: UserRole): boolean => {
  return ['executive', 'it_manager', 'systems_admin'].includes(role);
};

// Helper function to authenticate a user
export const authenticateUser = async (email: string, password: string) => {
  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    return null;
  }

  // Fetch additional user data from the users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (userError) {
    throw new Error(userError.message);
  }

  return userData;
};

// Helper function to get a user by username
export const getUserByUsername = async (username: string): Promise<User | null> => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return user;
};

// Helper function to check if a user is authorized for a specific action
export const isAuthorizedForAction = async (
  userId: string, 
  action: 'manage_tasks' | 'manage_projects' | 'manage_budget'
): Promise<boolean> => {
  const { data: user, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !user) {
    return false;
  }

  if (user.role === 'executive') return true;
  
  if (user.role === 'systems_admin' || user.role === 'it_manager') {
    return ['manage_tasks', 'manage_projects'].includes(action);
  }

  return false;
};
