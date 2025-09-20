import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

/**
 * Trigger Protocol Layer Data Fetching
 * POST /api/test-execution/trigger-protocol-layers
 * This endpoint simulates test execution and triggers protocol layer data updates
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { executionId, testCaseId, userId } = body;

    if (!executionId && !testCaseId) {
      return NextResponse.json(
        { error: 'Either executionId or testCaseId is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    console.log(`🚀 Triggering protocol layer data fetch - ExecutionId: ${executionId}, TestCaseId: ${testCaseId}`);

    // If we have an executionId, fetch real execution data
    if (executionId) {
      const { data: execution, error: executionError } = await supabase
        .from('test_case_executions')
        .select(`
          id,
          test_case_id,
          user_id,
          status,
          start_time,
          end_time,
          decoded_messages(
            id,
            message_id,
            timestamp_us,
            protocol,
            message_type,
            message_name,
            message_direction,
            layer,
            sublayer,
            source_entity,
            target_entity,
            decoded_data,
            information_elements,
            ie_count,
            validation_status,
            validation_errors,
            validation_warnings,
            message_size,
            processing_time_ms
          )
        `)
        .eq('id', executionId)
        .single();

      if (executionError) {
        console.error('Execution fetch error:', executionError);
        return NextResponse.json(
          { error: 'Execution not found' },
          { status: 404 }
        );
      }

      // Group messages by layer
      const messagesByLayer = (execution.decoded_messages || []).reduce((acc: any, msg: any) => {
        if (!acc[msg.layer]) {
          acc[msg.layer] = [];
        }
        acc[msg.layer].push(msg);
        return acc;
      }, {});

      console.log(`✅ Found execution with ${execution.decoded_messages?.length || 0} messages across layers:`, Object.keys(messagesByLayer));

      return NextResponse.json({
        success: true,
        data: {
          executionId: execution.id,
          testCaseId: execution.test_case_id,
          userId: execution.user_id,
          status: execution.status,
          messagesByLayer,
          totalMessages: execution.decoded_messages?.length || 0,
          layers: Object.keys(messagesByLayer),
          message: 'Protocol layer data fetched successfully'
        }
      });
    }

    // If we only have testCaseId, fetch expected messages
    if (testCaseId) {
      const { data: testCase, error: testCaseError } = await supabase
        .from('test_cases')
        .select(`
          id,
          name,
          protocol,
          layer,
          test_case_messages(
            id,
            step_id,
            step_order,
            timestamp_ms,
            direction,
            layer,
            protocol,
            message_type,
            message_name,
            message_description,
            message_payload
          )
        `)
        .eq('id', testCaseId)
        .single();

      if (testCaseError) {
        console.error('Test case fetch error:', testCaseError);
        return NextResponse.json(
          { error: 'Test case not found' },
          { status: 404 }
        );
      }

      // Group expected messages by layer
      const expectedMessagesByLayer = (testCase.test_case_messages || []).reduce((acc: any, msg: any) => {
        if (!acc[msg.layer]) {
          acc[msg.layer] = [];
        }
        acc[msg.layer].push(msg);
        return acc;
      }, {});

      console.log(`✅ Found test case with ${testCase.test_case_messages?.length || 0} expected messages across layers:`, Object.keys(expectedMessagesByLayer));

      return NextResponse.json({
        success: true,
        data: {
          testCaseId: testCase.id,
          testCaseName: testCase.name,
          protocol: testCase.protocol,
          layer: testCase.layer,
          expectedMessagesByLayer,
          totalExpectedMessages: testCase.test_case_messages?.length || 0,
          layers: Object.keys(expectedMessagesByLayer),
          message: 'Expected protocol layer data fetched successfully'
        }
      });
    }

  } catch (error) {
    console.error('❌ Error triggering protocol layer data fetch:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}