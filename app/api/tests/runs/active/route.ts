import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get user from request (you'll need to implement auth)
    const userId = 'mock-user-id';
    
    // Get active test runs for the user
    const { data: activeRuns, error } = await supabase
      .from('test_case_executions')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['queued', 'running'])
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch active runs' }, { status: 500 });
    }
    
    if (!activeRuns || activeRuns.length === 0) {
      return NextResponse.json(null);
    }
    
    const activeRun = activeRuns[0];
    
    // Get test results for the active run
    const { data: testResults, error: resultsError } = await supabase
      .from('test_case_results')
      .select('*')
      .eq('execution_id', activeRun.id);
    
    if (resultsError) {
      console.error('Database error:', resultsError);
      return NextResponse.json({ error: 'Failed to fetch test results' }, { status: 500 });
    }
    
    // Calculate summary statistics
    const totalTests = activeRun.test_case_ids?.length || 0;
    const completedTests = testResults?.length || 0;
    const passedTests = testResults?.filter(r => r.status === 'passed').length || 0;
    const failedTests = testResults?.filter(r => r.status === 'failed').length || 0;
    const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
    
    // Calculate progress
    let progress = 0;
    if (activeRun.status === 'completed') {
      progress = 100;
    } else if (activeRun.status === 'running') {
      progress = activeRun.progress || 0;
    } else if (activeRun.status === 'queued') {
      progress = 0;
    }
    
    // Get current test being executed
    let currentTest = null;
    if (activeRun.current_test_id) {
      const { data: currentTestData } = await supabase
        .from('test_cases')
        .select('test_case_id, name')
        .eq('id', activeRun.current_test_id)
        .single();
      
      currentTest = currentTestData?.test_case_id;
    }
    
    // Calculate estimated completion time
    let estimatedCompletion = null;
    if (activeRun.status === 'running' && activeRun.start_time) {
      const startTime = new Date(activeRun.start_time);
      const elapsed = Date.now() - startTime.getTime();
      const estimatedTotal = (activeRun.estimated_duration_minutes || 10) * 60 * 1000;
      const remaining = Math.max(0, estimatedTotal - elapsed);
      estimatedCompletion = new Date(Date.now() + remaining).toISOString();
    }
    
    return NextResponse.json({
      run_id: activeRun.id,
      status: activeRun.status,
      progress,
      current_test: currentTest,
      start_time: activeRun.start_time,
      estimated_completion: estimatedCompletion,
      results: {
        total_tests: totalTests,
        completed_tests: completedTests,
        passed_tests: passedTests,
        failed_tests: failedTests,
        success_rate: successRate
      }
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}