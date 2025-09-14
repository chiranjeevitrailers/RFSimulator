import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const runId = params.id;
    
    // Get test run details
    const { data: testRun, error: runError } = await supabase
      .from('test_case_executions')
      .select('*')
      .eq('id', runId)
      .single();
    
    if (runError) {
      console.error('Database error:', runError);
      return NextResponse.json({ error: 'Test run not found' }, { status: 404 });
    }
    
    // Get test results
    const { data: testResults, error: resultsError } = await supabase
      .from('test_case_results')
      .select('*')
      .eq('execution_id', runId);
    
    if (resultsError) {
      console.error('Database error:', resultsError);
      return NextResponse.json({ error: 'Failed to fetch test results' }, { status: 500 });
    }
    
    // Calculate summary statistics
    const totalTests = testResults?.length || 0;
    const completedTests = testResults?.length || 0;
    const passedTests = testResults?.filter(r => r.status === 'passed').length || 0;
    const failedTests = testResults?.filter(r => r.status === 'failed').length || 0;
    const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
    
    // Calculate progress
    let progress = 0;
    if (testRun.status === 'completed') {
      progress = 100;
    } else if (testRun.status === 'running') {
      progress = testRun.progress || 0;
    }
    
    // Get current test being executed
    let currentTest = null;
    if (testRun.current_test_id) {
      const { data: currentTestData } = await supabase
        .from('test_cases')
        .select('test_case_id, name')
        .eq('id', testRun.current_test_id)
        .single();
      
      currentTest = currentTestData?.test_case_id;
    }
    
    // Calculate estimated completion time
    let estimatedCompletion = null;
    if (testRun.status === 'running' && testRun.start_time) {
      const startTime = new Date(testRun.start_time);
      const elapsed = Date.now() - startTime.getTime();
      const estimatedTotal = testRun.estimated_duration_minutes * 60 * 1000;
      const remaining = Math.max(0, estimatedTotal - elapsed);
      estimatedCompletion = new Date(Date.now() + remaining).toISOString();
    }
    
    return NextResponse.json({
      run_id: runId,
      status: testRun.status,
      progress,
      current_test: currentTest,
      start_time: testRun.start_time,
      end_time: testRun.end_time,
      estimated_completion: estimatedCompletion,
      results: {
        total_tests: totalTests,
        completed_tests: completedTests,
        passed_tests: passedTests,
        failed_tests: failedTests,
        success_rate: successRate
      },
      test_results: testResults?.map(result => ({
        test_id: result.test_case_id,
        status: result.status,
        duration_seconds: result.duration_seconds,
        metrics: result.metrics,
        errors: result.errors,
        warnings: result.warnings
      })) || []
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const runId = params.id;
    
    // Get user from request (you'll need to implement auth)
    const userId = 'mock-user-id';
    
    // Check if user owns this test run
    const { data: testRun, error: runError } = await supabase
      .from('test_case_executions')
      .select('user_id, status')
      .eq('id', runId)
      .single();
    
    if (runError) {
      return NextResponse.json({ error: 'Test run not found' }, { status: 404 });
    }
    
    if (testRun.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Only allow cancellation of queued or running tests
    if (testRun.status === 'completed' || testRun.status === 'failed') {
      return NextResponse.json({ error: 'Cannot cancel completed test run' }, { status: 400 });
    }
    
    // Cancel the test run
    const { error: cancelError } = await supabase
      .from('test_case_executions')
      .update({
        status: 'cancelled',
        end_time: new Date().toISOString()
      })
      .eq('id', runId);
    
    if (cancelError) {
      console.error('Database error:', cancelError);
      return NextResponse.json({ error: 'Failed to cancel test run' }, { status: 500 });
    }
    
    // Also cancel in queue if it exists
    await supabase
      .from('test_run_queue')
      .update({
        status: 'cancelled',
        completed_at: new Date().toISOString()
      })
      .eq('run_id', runId);
    
    return NextResponse.json({ message: 'Test run cancelled successfully' });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}