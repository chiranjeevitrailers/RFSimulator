import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Simple Test Cases API - No complex filters, just get test cases by category
 * GET /api/test-cases/simple?category=5G_NR&limit=100
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    const supabase = supabaseAdmin!;
    
    console.log(`🔍 Simple fetch - Category: ${category}, Limit: ${limit}`);
    
    // Build simple query without complex joins
    let query = supabase
      .from('test_cases')
      .select('*')
      .order('name');
    
    // Apply category filter if provided
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    // Apply limit
    if (limit > 0) {
      query = query.limit(limit);
    }
    
    const { data: testCases, error } = await query;
    
    if (error) {
      console.error('Simple test cases fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch test cases', details: error.message },
        { status: 500 }
      );
    }
    
    console.log(`✅ Simple fetch successful: ${testCases?.length || 0} test cases found`);
    
    return NextResponse.json({
      success: true,
      data: {
        testCases: testCases || [],
        count: testCases?.length || 0,
        category: category,
        limit: limit
      },
      message: 'Test cases fetched successfully'
    });
    
  } catch (error) {
    console.error('❌ Simple test cases API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}