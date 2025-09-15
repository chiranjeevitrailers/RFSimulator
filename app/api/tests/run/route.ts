import { NextRequest, NextResponse } from 'next/server';

// Required for static export
import { createClient } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get user from request (you'll need to implement auth)
    // For now, using a mock user ID
    const userId = 'mock-user-id';
    
    const body = await request.json();
    const { 
      test_ids, 
      execution_mode = 'simulation',
      input_files = [],
      time_acceleration = 1,
      log_level = 'detailed',
      capture_mode = 'full'
    } = body;
    
    if (!test_ids || !Array.isArray(test_ids) || test_ids.length === 0) {
      return NextResponse.json({ error: 'test_ids is required and must be an array' }, { status: 400 });
    }
    
    // Generate run ID
    const runId = uuidv4();
    
    // Calculate estimated duration
    const { data: testCases } = await supabase
      .from('test_cases')
      .select('duration_minutes')
      .in('id', test_ids);
    
    const estimatedDuration = testCases?.reduce((sum, test) => sum + (test.duration_minutes || 5), 0) || 0;
    
    // Create test run record
    const { data: testRun, error: runError } = await supabase
      .from('test_case_executions')
      .insert({
        id: runId,
        user_id: userId,
        status: 'queued',
        execution_mode,
        configuration: {
          input_files,
          time_acceleration,
          log_level,
          capture_mode
        },
        estimated_duration_minutes: estimatedDuration,
        test_case_ids: test_ids
      })
      .select()
      .single();
    
    if (runError) {
      console.error('Database error:', runError);
      return NextResponse.json({ error: 'Failed to create test run' }, { status: 500 });
    }
    
    // Add to queue (you'll need to implement a queue system)
    // For now, we'll simulate immediate execution
    setTimeout(async () => {
      try {
        // Update status to running
        await supabase
          .from('test_case_executions')
          .update({ 
            status: 'running',
            start_time: new Date().toISOString()
          })
          .eq('id', runId);
        
        // Simulate test execution
        for (let i = 0; i < test_ids.length; i++) {
          const testId = test_ids[i];
          const progress = Math.round(((i + 1) / test_ids.length) * 100);
          
          // Update progress
          await supabase
            .from('test_case_executions')
            .update({ 
              progress,
              current_test_id: testId
            })
            .eq('id', runId);
          
          // Simulate test execution time
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Create test result
          await supabase
            .from('test_case_results')
            .insert({
              execution_id: runId,
              test_case_id: testId,
              status: Math.random() > 0.1 ? 'passed' : 'failed', // 90% pass rate
              duration_seconds: Math.floor(Math.random() * 300) + 60,
              metrics: {
                latency_ms: Math.floor(Math.random() * 100) + 50,
                throughput_mbps: Math.floor(Math.random() * 100) + 50,
                success_rate: Math.floor(Math.random() * 20) + 80
              },
              errors: [],
              warnings: []
            });
        }
        
        // Mark as completed
        await supabase
          .from('test_case_executions')
          .update({ 
            status: 'completed',
            end_time: new Date().toISOString(),
            progress: 100
          })
          .eq('id', runId);
        
      } catch (error) {
        console.error('Test execution error:', error);
        
        // Mark as failed
        await supabase
          .from('test_case_executions')
          .update({ 
            status: 'failed',
            end_time: new Date().toISOString(),
            error_message: error instanceof Error ? error.message : 'Unknown error'
          })
          .eq('id', runId);
      }
    }, 1000);
    
    return NextResponse.json({
      run_id: runId,
      status: 'queued',
      estimated_duration_minutes: estimatedDuration,
      queue_position: 1,
      created_at: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}