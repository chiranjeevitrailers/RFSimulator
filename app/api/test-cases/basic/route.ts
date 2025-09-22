import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Basic Test Cases API - Minimal query to test connectivity
 * GET /api/test-cases/basic?limit=xxx
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '3');

    // Use environment variables directly to avoid import issues
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Supabase configuration missing',
        data: []
      }, { status: 500 });
    }

    console.log('🔍 Basic test cases query - Limit:', limit);

    // Create client directly
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Ultra-simple query - just get IDs and names to test connectivity
    const { data: testCases, error } = await supabase
      .from('test_cases')
      .select('id, name, protocol')
      .limit(limit);

    if (error) {
      console.error('❌ Basic query failed:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        data: []
      }, { status: 500 });
    }

    console.log(`✅ Basic query successful: ${testCases?.length || 0} test cases found`);

    return NextResponse.json({
      success: true,
      data: testCases || [],
      count: testCases?.length || 0,
      message: 'Basic test cases fetched successfully'
    });

  } catch (error) {
    console.error('❌ Basic API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      data: []
    }, { status: 500 });
  }
}