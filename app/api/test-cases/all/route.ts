import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * All Test Cases API - Load all test cases for sidebar categories
 * GET /api/test-cases/all
 */

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Loading all test cases for sidebar categories');

    // Use singleton admin client to prevent multiple instances
    const supabase = supabaseAdmin;

    // Load all test cases with category information
    const { data: testCases, error } = await supabase
      .from('test_cases')
      .select('id, name, protocol, layer, complexity, category, subcategory, description')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('❌ All test cases query failed:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        data: []
      }, { status: 500 });
    }

    console.log(`✅ All test cases query successful: ${testCases?.length || 0} test cases found`);

    // Process test cases into categories for sidebar
    const categories = {};
    const totalCount = testCases?.length || 0;

    if (testCases) {
      testCases.forEach(testCase => {
        const category = testCase.category || 'Other';
        const subcategory = testCase.subcategory || 'General';
        
        if (!categories[category]) {
          categories[category] = {
            total: 0,
            subcategories: {}
          };
        }
        
        categories[category].total++;
        
        if (!categories[category].subcategories[subcategory]) {
          categories[category].subcategories[subcategory] = 0;
        }
        categories[category].subcategories[subcategory]++;
      });
    }

    return NextResponse.json({
      success: true,
      data: testCases || [],
      count: totalCount,
      categories: categories,
      message: `All ${totalCount} test cases fetched successfully`
    });

  } catch (error) {
    console.error('❌ All test cases API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      data: []
    }, { status: 500 });
  }
}