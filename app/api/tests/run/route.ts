import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Create admin client directly
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase configuration missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
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
    
    // Calculate estimated duration - handle both duration_minutes and duration_seconds
    let estimatedDuration = 5; // Default 5 minutes
    try {
      const { data: testCases, error: durationError } = await supabase
        .from('test_cases')
        .select('duration_minutes, duration_seconds, test_case_id, id')
        .or(`id.in.(${test_ids.map(id => `"${id}"`).join(',')}),test_case_id.in.(${test_ids.map(id => `"${id}"`).join(',')})`);
      
      if (durationError) {
        console.warn('Duration fetch error:', durationError.message);
      } else if (testCases && testCases.length > 0) {
        estimatedDuration = testCases.reduce((sum, test) => {
          const duration = test.duration_minutes || (test.duration_seconds ? Math.ceil(test.duration_seconds / 60) : 5);
          return sum + duration;
        }, 0);
      }
    } catch (durationErr) {
      console.warn('Duration calculation failed, using default:', durationErr);
    }
    
    // Create test run record - use correct column names based on actual schema
    const { data: testRun, error: runError } = await supabase
      .from('test_case_executions')
      .insert({
        id: runId,
        user_id: userId,
        test_case_id: test_ids[0], // Use first test case ID
        status: 'queued',
        execution_mode: execution_mode,
        start_time: new Date().toISOString(),
        progress_percentage: 0,
        total_steps: test_ids.length,
        completed_steps: 0,
        // Store configuration as JSON
        configuration: {
          input_files,
          time_acceleration,
          log_level,
          capture_mode,
          estimated_duration_minutes: estimatedDuration,
          test_case_ids: test_ids
        }
      })
      .select()
      .single();
    
    if (runError) {
      console.error('Database error:', runError);
      console.error('Error details:', JSON.stringify(runError, null, 2));
      return NextResponse.json({
        error: 'Failed to create test run',
        details: runError.message,
        code: runError.code
      }, { status: 500 });
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
            start_time: new Date().toISOString(),
            progress_percentage: 0
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
              progress_percentage: progress,
              completed_steps: i + 1
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
              step_name: `Test Step ${i + 1}`,
              step_order: i + 1,
              status: Math.random() > 0.1 ? 'passed' : 'failed', // 90% pass rate
              start_time: new Date().toISOString(),
              end_time: new Date(Date.now() + Math.floor(Math.random() * 300000) + 60000).toISOString(),
              duration_ms: Math.floor(Math.random() * 300000) + 60000,
              message: `Test case ${testId} executed successfully`,
              details: {
                metrics: {
                  latency_ms: Math.floor(Math.random() * 100) + 50,
                  throughput_mbps: Math.floor(Math.random() * 100) + 50,
                  success_rate: Math.floor(Math.random() * 20) + 80
                },
                errors: [],
                warnings: []
              },
              metrics: {
                latency_ms: Math.floor(Math.random() * 100) + 50,
                throughput_mbps: Math.floor(Math.random() * 100) + 50,
                success_rate: Math.floor(Math.random() * 20) + 80
              }
            });
        }
        
        // Mark as completed
        await supabase
          .from('test_case_executions')
          .update({
            status: 'completed',
            end_time: new Date().toISOString(),
            progress_percentage: 100,
            completed_steps: test_ids.length
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
            progress_percentage: 0
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