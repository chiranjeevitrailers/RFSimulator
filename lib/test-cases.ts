import { supabase } from './supabase';

export interface TestCase {
  id: string;
  name: string;
  category: string;
  description: string;
  protocol_version: string;
  layers: any;
  message_flow: any[];
  duration_ms: number;
  complexity: 'low' | 'medium' | 'high';
  test_case_id: string;
  tags: string[];
  prerequisites: any;
  expected_results: any;
  success_criteria: any;
  failure_scenarios: any;
  performance_metrics: any;
  test_environment: any;
  is_active: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
}

export interface TestCaseExecution {
  id: string;
  test_case_id: string;
  user_id: string;
  execution_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'timeout';
  start_time: string;
  end_time?: string;
  duration_ms?: number;
  progress_percentage: number;
  current_step?: string;
  total_steps: number;
  completed_steps: number;
  results?: any;
  logs?: any;
  errors?: any;
  performance_data?: any;
  created_at: string;
  updated_at: string;
}

export interface TestCaseResult {
  id: string;
  execution_id: string;
  step_name: string;
  step_order: number;
  status: 'passed' | 'failed' | 'skipped' | 'warning';
  start_time: string;
  end_time?: string;
  duration_ms?: number;
  message?: string;
  details?: any;
  metrics?: any;
  screenshots?: any;
  created_at: string;
}

export interface TestCaseTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  protocol_version: string;
  template_data: any;
  parameters?: any;
  is_public: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface TestCaseLibrary {
  id: string;
  name: string;
  description?: string;
  category: string;
  protocol_version: string;
  is_public: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export class TestCaseService {
  // Test Case CRUD Operations
  static async getTestCases(filters?: {
    category?: string;
    protocol_version?: string;
    complexity?: string;
    is_active?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<TestCase[]> {
    let query = supabase
      .from('test_cases')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.protocol_version) {
      query = query.eq('protocol_version', filters.protocol_version);
    }

    if (filters?.complexity) {
      query = query.eq('complexity', filters.complexity);
    }

    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching test cases:', error);
      throw error;
    }

    return data || [];
  }

  static async getTestCaseById(id: string): Promise<TestCase | null> {
    const { data, error } = await supabase
      .from('test_cases')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching test case:', error);
      return null;
    }

    return data;
  }

  static async getTestCaseByTestCaseId(testCaseId: string): Promise<TestCase | null> {
    const { data, error } = await supabase
      .from('test_cases')
      .select('*')
      .eq('test_case_id', testCaseId)
      .single();

    if (error) {
      console.error('Error fetching test case:', error);
      return null;
    }

    return data;
  }

  static async createTestCase(testCase: Partial<TestCase>): Promise<TestCase> {
    const { data, error } = await supabase
      .from('test_cases')
      .insert([testCase])
      .select()
      .single();

    if (error) {
      console.error('Error creating test case:', error);
      throw error;
    }

    return data;
  }

  static async updateTestCase(id: string, updates: Partial<TestCase>): Promise<TestCase> {
    const { data, error } = await supabase
      .from('test_cases')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating test case:', error);
      throw error;
    }

    return data;
  }

  static async deleteTestCase(id: string): Promise<void> {
    const { error } = await supabase
      .from('test_cases')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting test case:', error);
      throw error;
    }
  }

  // Test Case Execution Operations
  static async createExecution(testCaseId: string, userId: string): Promise<TestCaseExecution> {
    const { data, error } = await supabase
      .from('test_case_executions')
      .insert([{
        test_case_id: testCaseId,
        user_id: userId,
        status: 'pending',
        progress_percentage: 0,
        total_steps: 0,
        completed_steps: 0,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating test execution:', error);
      throw error;
    }

    return data;
  }

  static async updateExecution(id: string, updates: Partial<TestCaseExecution>): Promise<TestCaseExecution> {
    const { data, error } = await supabase
      .from('test_case_executions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating test execution:', error);
      throw error;
    }

    return data;
  }

  static async getExecutions(userId?: string, testCaseId?: string): Promise<TestCaseExecution[]> {
    let query = supabase
      .from('test_case_executions')
      .select('*')
      .order('start_time', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (testCaseId) {
      query = query.eq('test_case_id', testCaseId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching test executions:', error);
      throw error;
    }

    return data || [];
  }

  static async getExecutionById(id: string): Promise<TestCaseExecution | null> {
    const { data, error } = await supabase
      .from('test_case_executions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching test execution:', error);
      return null;
    }

    return data;
  }

  // Test Case Results Operations
  static async addResult(result: Partial<TestCaseResult>): Promise<TestCaseResult> {
    const { data, error } = await supabase
      .from('test_case_results')
      .insert([result])
      .select()
      .single();

    if (error) {
      console.error('Error adding test result:', error);
      throw error;
    }

    return data;
  }

  static async getResults(executionId: string): Promise<TestCaseResult[]> {
    const { data, error } = await supabase
      .from('test_case_results')
      .select('*')
      .eq('execution_id', executionId)
      .order('step_order', { ascending: true });

    if (error) {
      console.error('Error fetching test results:', error);
      throw error;
    }

    return data || [];
  }

  // Test Case Templates Operations
  static async getTemplates(category?: string, protocolVersion?: string): Promise<TestCaseTemplate[]> {
    let query = supabase
      .from('test_case_templates')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (protocolVersion) {
      query = query.eq('protocol_version', protocolVersion);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching test templates:', error);
      throw error;
    }

    return data || [];
  }

  static async createTemplate(template: Partial<TestCaseTemplate>): Promise<TestCaseTemplate> {
    const { data, error } = await supabase
      .from('test_case_templates')
      .insert([template])
      .select()
      .single();

    if (error) {
      console.error('Error creating test template:', error);
      throw error;
    }

    return data;
  }

  // Test Case Libraries Operations
  static async getLibraries(category?: string, protocolVersion?: string): Promise<TestCaseLibrary[]> {
    let query = supabase
      .from('test_case_libraries')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (protocolVersion) {
      query = query.eq('protocol_version', protocolVersion);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching test libraries:', error);
      throw error;
    }

    return data || [];
  }

  // Statistics and Analytics
  static async getTestCaseStats(testCaseId: string): Promise<any> {
    const { data, error } = await supabase
      .rpc('get_test_case_stats', { test_case_uuid: testCaseId });

    if (error) {
      console.error('Error fetching test case stats:', error);
      throw error;
    }

    return data;
  }

  static async getExecutionStats(userId?: string): Promise<any> {
    let query = supabase
      .from('test_case_executions')
      .select('status, duration_ms, start_time');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching execution stats:', error);
      throw error;
    }

    const stats = {
      total_executions: data?.length || 0,
      successful_executions: data?.filter(e => e.status === 'completed').length || 0,
      failed_executions: data?.filter(e => e.status === 'failed').length || 0,
      average_duration_ms: data?.reduce((sum, e) => sum + (e.duration_ms || 0), 0) / (data?.length || 1),
      success_rate: 0,
    };

    stats.success_rate = stats.total_executions > 0 
      ? (stats.successful_executions / stats.total_executions) * 100 
      : 0;

    return stats;
  }

  // Search and Filter Operations
  static async searchTestCases(query: string, filters?: {
    category?: string;
    protocol_version?: string;
    complexity?: string;
    tags?: string[];
  }): Promise<TestCase[]> {
    let supabaseQuery = supabase
      .from('test_cases')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,test_case_id.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (filters?.category) {
      supabaseQuery = supabaseQuery.eq('category', filters.category);
    }

    if (filters?.protocol_version) {
      supabaseQuery = supabaseQuery.eq('protocol_version', filters.protocol_version);
    }

    if (filters?.complexity) {
      supabaseQuery = supabaseQuery.eq('complexity', filters.complexity);
    }

    if (filters?.tags && filters.tags.length > 0) {
      supabaseQuery = supabaseQuery.overlaps('tags', filters.tags);
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error('Error searching test cases:', error);
      throw error;
    }

    return data || [];
  }

  // Bulk Operations
  static async bulkUpdateTestCases(ids: string[], updates: Partial<TestCase>): Promise<void> {
    const { error } = await supabase
      .from('test_cases')
      .update(updates)
      .in('id', ids);

    if (error) {
      console.error('Error bulk updating test cases:', error);
      throw error;
    }
  }

  static async bulkDeleteTestCases(ids: string[]): Promise<void> {
    const { error } = await supabase
      .from('test_cases')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('Error bulk deleting test cases:', error);
      throw error;
    }
  }

  // Import/Export Operations
  static async exportTestCases(ids: string[]): Promise<any[]> {
    const { data, error } = await supabase
      .from('test_cases')
      .select('*')
      .in('id', ids);

    if (error) {
      console.error('Error exporting test cases:', error);
      throw error;
    }

    return data || [];
  }

  static async importTestCases(testCases: Partial<TestCase>[]): Promise<TestCase[]> {
    const { data, error } = await supabase
      .from('test_cases')
      .insert(testCases)
      .select();

    if (error) {
      console.error('Error importing test cases:', error);
      throw error;
    }

    return data || [];
  }
}