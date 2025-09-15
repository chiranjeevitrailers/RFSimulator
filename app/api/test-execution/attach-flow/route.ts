import { NextRequest, NextResponse } from 'next/server';

// Required for static export
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { createClient } from '@/lib/supabase';

/**
 * API endpoint to fetch complete attach flow data for real-time simulation
 * GET /api/test-execution/attach-flow?testCaseId=xxx&runId=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testCaseId = searchParams.get('testCaseId');
    const runId = searchParams.get('runId');
    const flowType = searchParams.get('flowType') || 'initial_access';

    if (!testCaseId && !runId) {
      return NextResponse.json(
        { error: 'Either testCaseId or runId is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    console.log(`🔗 Fetching attach flow data - TestCase: ${testCaseId}, RunId: ${runId}`);

    // Step 1: Fetch test case definition
    let testCase;
    if (testCaseId) {
      const { data: testCaseData, error: testCaseError } = await supabase
        .from('test_cases')
        .select('*')
        .eq('id', testCaseId)
        .single();

      if (testCaseError) {
        console.error('Test case fetch error:', testCaseError);
        return NextResponse.json(
          { error: 'Test case not found' },
          { status: 404 }
        );
      }
      testCase = testCaseData;
    }

    // Step 2: Fetch expected message flow
    const { data: expectedMessages, error: messagesError } = await supabase
      .from('test_case_messages')
      .select('*')
      .eq('test_case_id', testCaseId || runId)
      .order('step_order');

    if (messagesError) {
      console.error('Expected messages fetch error:', messagesError);
      return NextResponse.json(
        { error: 'Failed to fetch expected messages' },
        { status: 500 }
      );
    }

    // Step 3: Fetch expected information elements
    const { data: expectedIEs, error: iesError } = await supabase
      .from('test_case_information_elements')
      .select('*')
      .eq('test_case_id', testCaseId || runId);

    if (iesError) {
      console.error('Expected IEs fetch error:', iesError);
      return NextResponse.json(
        { error: 'Failed to fetch expected IEs' },
        { status: 500 }
      );
    }

    // Step 4: Fetch expected layer parameters
    const { data: expectedLayerParams, error: paramsError } = await supabase
      .from('test_case_layer_parameters')
      .select('*')
      .eq('test_case_id', testCaseId || runId);

    if (paramsError) {
      console.error('Expected layer params fetch error:', paramsError);
      return NextResponse.json(
        { error: 'Failed to fetch expected layer parameters' },
        { status: 500 }
      );
    }

    // Step 5: Fetch actual execution data (if runId provided)
    let actualMessages = [];
    let actualIEs = [];
    let actualLayerParams = [];
    let executionResults = null;

    if (runId) {
      // Fetch actual decoded messages
      const { data: decodedMessages, error: decodedError } = await supabase
        .from('decoded_messages')
        .select('*')
        .eq('test_run_id', runId)
        .order('timestamp_us');

      if (decodedError) {
        console.error('Decoded messages fetch error:', decodedError);
      } else {
        actualMessages = decodedMessages || [];
      }

      // Fetch actual information elements
      const { data: decodedIEs, error: decodedIEsError } = await supabase
        .from('decoded_information_elements')
        .select('*')
        .in('message_id', actualMessages.map(msg => msg.id));

      if (decodedIEsError) {
        console.error('Decoded IEs fetch error:', decodedIEsError);
      } else {
        actualIEs = decodedIEs || [];
      }

      // Fetch actual layer parameters
      const { data: decodedParams, error: decodedParamsError } = await supabase
        .from('decoded_layer_parameters')
        .select('*')
        .in('message_id', actualMessages.map(msg => msg.id));

      if (decodedParamsError) {
        console.error('Decoded layer params fetch error:', decodedParamsError);
      } else {
        actualLayerParams = decodedParams || [];
      }

      // Fetch execution results
      const { data: executionData, error: executionError } = await supabase
        .from('test_case_executions')
        .select('*')
        .eq('id', runId)
        .single();

      if (executionError) {
        console.error('Execution results fetch error:', executionError);
      } else {
        executionResults = executionData;
      }
    }

    // Step 6: Fetch compliance analysis (if runId provided)
    let complianceAnalysis = null;
    if (runId) {
      const { data: flowCompliance, error: complianceError } = await supabase
        .from('message_flow_compliance')
        .select('*')
        .eq('test_run_id', runId);

      if (complianceError) {
        console.error('Compliance analysis fetch error:', complianceError);
      } else {
        complianceAnalysis = flowCompliance || [];
      }
    }

    // Step 7: Organize data for real-time simulation
    const attachFlowData = {
      // Test case information
      testCase: testCase || {
        id: testCaseId,
        name: '5G NR Initial Attach Flow',
        protocol: '5G-NR',
        category: flowType,
        standard_reference: 'TS 38.331 Section 6.2.2',
        release_version: 'Release 17'
      },

      // Expected data (from test case definition)
      expected: {
        messages: expectedMessages || [],
        informationElements: expectedIEs || [],
        layerParameters: expectedLayerParams || []
      },

      // Actual data (from test execution)
      actual: {
        messages: actualMessages,
        informationElements: actualIEs,
        layerParameters: actualLayerParams
      },

      // Execution results
      execution: executionResults,

      // Compliance analysis
      compliance: complianceAnalysis,

      // Summary for real-time simulation
      simulation: {
        runId: runId,
        testCaseId: testCaseId,
        totalMessages: actualMessages.length || expectedMessages?.length || 0,
        layers: [...new Set([
          ...(actualMessages.map(msg => msg.layer) || []),
          ...(expectedMessages?.map(msg => msg.layer) || [])
        ])],
        protocols: [...new Set([
          ...(actualMessages.map(msg => msg.protocol) || []),
          ...(expectedMessages?.map(msg => msg.protocol) || [])
        ])],
        duration: actualMessages.length > 0 
          ? Math.max(...actualMessages.map(msg => msg.timestamp_us)) - Math.min(...actualMessages.map(msg => msg.timestamp_us))
          : 0,
        status: executionResults?.status || 'ready',
        complianceScore: complianceAnalysis?.[0]?.compliance_score || 100
      }
    };

    console.log(`✅ Attach flow data fetched successfully:`);
    console.log(`   Test Case: ${attachFlowData.testCase.name}`);
    console.log(`   Expected Messages: ${attachFlowData.expected.messages.length}`);
    console.log(`   Actual Messages: ${attachFlowData.actual.messages.length}`);
    console.log(`   Layers: ${attachFlowData.simulation.layers.join(', ')}`);
    console.log(`   Protocols: ${attachFlowData.simulation.protocols.join(', ')}`);
    console.log(`   Duration: ${attachFlowData.simulation.duration / 1000}ms`);

    return NextResponse.json({
      success: true,
      data: attachFlowData,
      message: 'Attach flow data fetched successfully'
    });

  } catch (error) {
    console.error('❌ Error fetching attach flow data:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * API endpoint to create a new attach flow test execution
 * POST /api/test-execution/attach-flow
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testCaseId, userId, executionMode = 'simulation' } = body;

    if (!testCaseId || !userId) {
      return NextResponse.json(
        { error: 'testCaseId and userId are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    console.log(`🚀 Creating attach flow test execution - TestCase: ${testCaseId}, User: ${userId}`);

    // Create test execution record
    const { data: execution, error: executionError } = await supabase
      .from('test_case_executions')
      .insert({
        test_case_id: testCaseId,
        user_id: userId,
        status: 'queued',
        execution_mode: executionMode,
        configuration: {
          time_acceleration: 1.0,
          log_level: 'detailed',
          capture_mode: 'full'
        }
      })
      .select()
      .single();

    if (executionError) {
      console.error('Test execution creation error:', executionError);
      return NextResponse.json(
        { error: 'Failed to create test execution' },
        { status: 500 }
      );
    }

    // Add to execution queue
    const { data: queueItem, error: queueError } = await supabase
      .from('test_run_queue')
      .insert({
        run_id: execution.id,
        user_id: userId,
        status: 'queued',
        priority: 0,
        scheduled_at: new Date().toISOString()
      })
      .select()
      .single();

    if (queueError) {
      console.error('Queue creation error:', queueError);
      return NextResponse.json(
        { error: 'Failed to add to execution queue' },
        { status: 500 }
      );
    }

    console.log(`✅ Attach flow test execution created successfully - RunId: ${execution.id}`);

    return NextResponse.json({
      success: true,
      data: {
        executionId: execution.id,
        queueId: queueItem.id,
        status: 'queued',
        message: 'Attach flow test execution queued successfully'
      }
    });

  } catch (error) {
    console.error('❌ Error creating attach flow test execution:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}