import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Update Test Case API
 * PUT /api/test-cases/update/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testCaseId = params.id;
    const body = await request.json();
    
    if (!testCaseId) {
      return NextResponse.json(
        { error: 'Test case ID is required' },
        { status: 400 }
      );
    }

    // Use singleton admin client to prevent multiple instances
    const supabase = supabaseAdmin;

    console.log(`🔧 Updating test case: ${testCaseId}`);

    // Update test case in database
    const { data: updatedTestCase, error: updateError } = await supabase
      .from('test_cases')
      .update(body)
      .eq('id', testCaseId)
      .select()
      .single();

    if (updateError) {
      console.error('Test case update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update test case', details: updateError.message },
        { status: 500 }
      );
    }

    console.log(`✅ Test case updated successfully: ${updatedTestCase.id}`);

    return NextResponse.json({
      success: true,
      message: 'Test case updated successfully',
      data: updatedTestCase
    });

  } catch (error) {
    console.error('Test case update error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}