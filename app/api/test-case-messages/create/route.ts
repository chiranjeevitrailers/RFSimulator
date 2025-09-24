import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Create Test Case Message API
 * POST /api/test-case-messages/create
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.test_case_id || !body.message_name || !body.layer) {
      return NextResponse.json(
        { error: 'Missing required fields: test_case_id, message_name, layer' },
        { status: 400 }
      );
    }

    // Use singleton admin client to prevent multiple instances
    const supabase = supabaseAdmin;

    console.log(`🔧 Creating test case message: ${body.message_name}`);

    // Prepare message data
    const messageData = {
      id: body.id,
      test_case_id: body.test_case_id,
      step_order: body.step_order || 1,
      timestamp_ms: body.timestamp_ms || 1000,
      direction: body.direction || 'UL',
      layer: body.layer,
      protocol: body.protocol || 'LTE',
      message_type: body.message_type || 'Message',
      message_name: body.message_name,
      message_description: body.message_description || '',
      message_payload: body.message_payload || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert message into database
    const { data: newMessage, error: insertError } = await supabase
      .from('test_case_messages')
      .insert([messageData])
      .select()
      .single();

    if (insertError) {
      console.error('Message creation error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create message', details: insertError.message },
        { status: 500 }
      );
    }

    console.log(`✅ Message created successfully: ${newMessage.id}`);

    return NextResponse.json({
      success: true,
      message: 'Message created successfully',
      data: newMessage
    });

  } catch (error) {
    console.error('Message creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}