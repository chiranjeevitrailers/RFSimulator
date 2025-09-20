import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

/**
 * Simple Test Run API - No database dependencies, just returns run data
 * POST /api/tests/run-simple
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      test_ids, 
      execution_mode = 'simulation',
      user_id = 'mock-user'
    } = body;
    
    if (!test_ids || !Array.isArray(test_ids) || test_ids.length === 0) {
      return NextResponse.json({ error: 'test_ids is required and must be an array' }, { status: 400 });
    }
    
    // Generate run ID
    const runId = uuidv4();
    
    console.log(`🚀 Simple test run started: ${runId} for test cases: ${test_ids.join(', ')}`);
    
    // Return success without database dependency
    return NextResponse.json({
      success: true,
      run_id: runId,
      test_ids: test_ids,
      status: 'queued',
      execution_mode: execution_mode,
      estimated_duration_minutes: test_ids.length * 5, // 5 minutes per test
      start_time: new Date().toISOString(),
      message: 'Test run queued successfully'
    });
    
  } catch (error) {
    console.error('❌ Simple test run error:', error);
    return NextResponse.json(
      { 
        error: 'Test run failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}