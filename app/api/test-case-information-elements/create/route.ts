import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Create Test Case Information Element API
 * POST /api/test-case-information-elements/create
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.test_case_id || !body.ie_name || !body.ie_type) {
      return NextResponse.json(
        { error: 'Missing required fields: test_case_id, ie_name, ie_type' },
        { status: 400 }
      );
    }

    // Use singleton admin client to prevent multiple instances
    const supabase = supabaseAdmin;

    console.log(`🔧 Creating test case IE: ${body.ie_name}`);

    // Prepare IE data
    const ieData = {
      id: body.id,
      test_case_id: body.test_case_id,
      ie_name: body.ie_name,
      ie_type: body.ie_type,
      ie_value: body.ie_value || '',
      ie_size: body.ie_size || 0,
      mandatory: body.mandatory || false,
      description: body.description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert IE into database
    const { data: newIE, error: insertError } = await supabase
      .from('test_case_information_elements')
      .insert([ieData])
      .select()
      .single();

    if (insertError) {
      console.error('IE creation error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create IE', details: insertError.message },
        { status: 500 }
      );
    }

    console.log(`✅ IE created successfully: ${newIE.id}`);

    return NextResponse.json({
      success: true,
      message: 'Information Element created successfully',
      data: newIE
    });

  } catch (error) {
    console.error('IE creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}