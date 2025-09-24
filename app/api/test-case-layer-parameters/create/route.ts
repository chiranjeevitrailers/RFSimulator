import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Create Test Case Layer Parameter API
 * POST /api/test-case-layer-parameters/create
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.test_case_id || !body.parameter_name || !body.layer) {
      return NextResponse.json(
        { error: 'Missing required fields: test_case_id, parameter_name, layer' },
        { status: 400 }
      );
    }

    // Use singleton admin client to prevent multiple instances
    const supabase = supabaseAdmin;

    console.log(`🔧 Creating test case layer parameter: ${body.parameter_name}`);

    // Prepare parameter data
    const parameterData = {
      id: body.id,
      test_case_id: body.test_case_id,
      layer: body.layer,
      parameter_name: body.parameter_name,
      parameter_type: body.parameter_type || 'CONFIG',
      parameter_value: body.parameter_value || '',
      parameter_unit: body.parameter_unit || '',
      description: body.description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert parameter into database
    const { data: newParameter, error: insertError } = await supabase
      .from('test_case_layer_parameters')
      .insert([parameterData])
      .select()
      .single();

    if (insertError) {
      console.error('Parameter creation error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create parameter', details: insertError.message },
        { status: 500 }
      );
    }

    console.log(`✅ Layer parameter created successfully: ${newParameter.id}`);

    return NextResponse.json({
      success: true,
      message: 'Layer parameter created successfully',
      data: newParameter
    });

  } catch (error) {
    console.error('Parameter creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}