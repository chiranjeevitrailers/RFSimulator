import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = supabaseAdmin;

    // Get the most recent running test execution
    const { data: activeRun, error } = await supabase
      .from('test_case_executions')
      .select('*')
      .eq('status', 'running')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error fetching active run:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!activeRun) {
      return NextResponse.json({ message: 'No active test executions' }, { status: 404 });
    }

    // Return with execution_id as the primary identifier for frontend compatibility
    return NextResponse.json({
      id: activeRun.execution_id,  // Use execution_id for frontend compatibility
      execution_id: activeRun.execution_id,
      status: activeRun.status,
      test_case_id: activeRun.test_case_id,
      user_id: activeRun.user_id,
      start_time: activeRun.start_time,
      end_time: activeRun.end_time,
      progress_percentage: activeRun.progress_percentage,
      current_step: activeRun.current_step,
      total_steps: activeRun.total_steps,
      completed_steps: activeRun.completed_steps,
      results: activeRun.results,
      logs: activeRun.logs,
      created_at: activeRun.created_at,
      updated_at: activeRun.updated_at
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}