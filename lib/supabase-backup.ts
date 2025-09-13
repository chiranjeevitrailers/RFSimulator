import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Only create client if we have valid environment variables
export const supabase = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key' 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Admin client for server-side operations
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';
export const supabaseAdmin = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseServiceKey !== 'placeholder-service-key'
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Database Types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  subscription_tier: 'free' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'inactive' | 'cancelled';
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  category: '4G_LTE' | '5G_NR' | 'IMS_SIP' | 'O_RAN' | 'NB_IoT' | 'V2X' | 'NTN';
  subcategory: string;
  complexity: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: number; // in seconds
  protocol_layers: string[];
  test_data: any; // JSON object with test case data
  expected_results: any; // JSON object with expected results
  created_at: string;
  updated_at: string;
  created_by: string;
  is_active: boolean;
  tags: string[];
}

export interface TestExecution {
  id: string;
  user_id: string;
  test_case_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  start_time: string;
  end_time?: string;
  results: any; // JSON object with execution results
  logs: any[]; // Array of log entries
  created_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: 'login' | 'logout' | 'test_execution' | 'test_case_view' | 'dashboard_view';
  activity_data: any; // JSON object with activity details
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Helper function to check if supabase is available
const checkSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please check environment variables.');
  }
};

// Database helper functions
export const db = {
  // User operations
  async createUser(userData: Partial<User>) {
    checkSupabase();
    
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserById(id: string) {
    checkSupabase();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAllUsers(limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  },

  // Test case operations
  async createTestCase(testCaseData: Partial<TestCase>) {
    const { data, error } = await supabase
      .from('test_cases')
      .insert([testCaseData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getTestCaseById(id: string) {
    const { data, error } = await supabase
      .from('test_cases')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAllTestCases(limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('test_cases')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  },

  async getTestCasesByCategory(category: string, limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('test_cases')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  },

  // Test execution operations
  async createTestExecution(executionData: Partial<TestExecution>) {
    const { data, error } = await supabase
      .from('test_executions')
      .insert([executionData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getTestExecutionsByUser(userId: string, limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('test_executions')
      .select(`
        *,
        test_cases (
          name,
          category,
          description
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  },

  // User activity operations
  async logUserActivity(activityData: Partial<UserActivity>) {
    const { data, error } = await supabase
      .from('user_activities')
      .insert([activityData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserActivities(userId: string, limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  },
};