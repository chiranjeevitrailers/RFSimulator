import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Create Test Case API
 * POST /api/test-cases/create
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.protocol || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, protocol, category' },
        { status: 400 }
      );
    }

    // Use singleton admin client to prevent multiple instances
    const supabase = supabaseAdmin;

    console.log(`🔧 Creating test case: ${body.name}`);

    // Prepare test case data - using actual database column names
    const testCaseData = {
      name: body.name,
      description: body.description || '',
      protocol: body.protocol,
      category: body.category,
      test_type: body.test_type || 'conformance',
      complexity: body.complexity || 'expert',
      execution_priority: body.execution_priority || 5,
      tags: body.tags || [],
      test_data: body.test_data || {},
      expected_results: body.expected_results || {},
      duration_minutes: body.duration_minutes || 30,
      estimated_duration_minutes: body.estimated_duration_minutes || 30,
      automation_level: body.automation_level || 'manual',
      review_status: body.review_status || 'approved',
      layer: body.layer || 'Multi',
      standard_reference: body.standard_reference || '3GPP TS',
      is_active: true,
      is_premium: false,
      is_featured: false
    };

    // Insert test case into database
    const { data: newTestCase, error: insertError } = await supabase
      .from('test_cases')
      .insert([testCaseData])
      .select()
      .single();

    if (insertError) {
      console.error('Test case creation error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create test case', details: insertError.message },
        { status: 500 }
      );
    }

    console.log(`✅ Test case created successfully: ${newTestCase.id}`);

    return NextResponse.json({
      success: true,
      message: 'Test case created successfully',
      data: newTestCase
    });

  } catch (error) {
    console.error('Test case creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}