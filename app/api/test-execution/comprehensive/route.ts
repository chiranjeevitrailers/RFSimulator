import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Comprehensive Test Execution API
 * GET /api/test-execution/comprehensive?testCaseId=xxx - Get test case data for execution
 * POST /api/test-execution/comprehensive - Execute a test case
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testCaseId = searchParams.get('testCaseId');
    const includeTemplates = searchParams.get('includeTemplates') === 'true';

    if (!testCaseId) {
      return NextResponse.json(
        { error: 'testCaseId parameter is required' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin;
    console.log(`🔍 Fetching test case data for execution: ${testCaseId}`);

    // Get test case data
    const { data: testCase, error: testCaseError } = await supabase
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

    // Transform test case data for execution
    const executionData = {
      id: testCase.id,
      name: testCase.name,
      description: testCase.description,
      protocol: testCase.protocol || '5G_NR',
      layer: testCase.layer || 'Multi',
      complexity: testCase.complexity || 'intermediate',
      category: testCase.category || '5G_NR',
      expectedMessages: testCase.expected_results || [],
      expectedInformationElements: [],
      expectedLayerParameters: [],
      simulation: {
        testCaseId: testCase.id,
        totalExpectedMessages: testCase.expected_results?.length || 0,
        totalActualMessages: 0,
        layers: ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'],
        protocols: [testCase.protocol || '5G_NR'],
        duration: testCase.test_data?.duration_seconds || 30,
        status: 'ready',
        complianceScore: 0
      }
    };

    console.log(`✅ Test case data prepared for execution: ${testCase.name}`);

    return NextResponse.json({
      success: true,
      data: executionData,
      message: 'Test case data fetched successfully'
    });

  } catch (error) {
    console.error('❌ Error fetching test case for execution:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      testCaseId,
      userId = 'anonymous',
      executionMode = 'comprehensive',
      configuration = {},
      timeAcceleration = 1,
      logLevel = 'info',
      captureMode = 'all'
    } = body;

    if (!testCaseId) {
      return NextResponse.json(
        { error: 'testCaseId is required' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin;
    console.log(`🚀 Starting test execution: ${testCaseId}`);

    // Get test case data
    const { data: testCase, error: testCaseError } = await supabase
      .from('test_cases')
      .select('*')
      .eq('id', testCaseId)
      .single();

    if (testCaseError) {
      console.error('Test case not found:', testCaseError);
      return NextResponse.json(
        { error: 'Test case not found' },
        { status: 404 }
      );
    }

    // Create test execution record
    const { data: execution, error: executionError } = await supabase
      .from('test_executions')
      .insert({
        test_case_id: testCaseId,
        user_id: userId,
        status: 'running',
        start_time: new Date().toISOString(),
        progress: 0,
        current_message: 'Starting test execution...',
        expected_message_count: testCase.expected_results?.length || 0,
        actual_message_count: 0,
        results: {
          executionMode,
          configuration,
          timeAcceleration,
          logLevel,
          captureMode
        }
      })
      .select()
      .single();

    if (executionError) {
      console.error('Execution creation error:', executionError);
      return NextResponse.json(
        { error: 'Failed to create test execution' },
        { status: 500 }
      );
    }

    // Simulate test execution (in a real implementation, this would be async)
    setTimeout(async () => {
      try {
        const expectedMessages = testCase.expected_results || [];
        const totalMessages = expectedMessages.length;
        
        // Simulate processing messages
        for (let i = 0; i < totalMessages; i++) {
          const progress = Math.round(((i + 1) / totalMessages) * 100);
          const currentMessage = expectedMessages[i];
          
          await supabase
            .from('test_executions')
            .update({
              progress,
              current_message: `Processing: ${currentMessage.message || 'Unknown message'}`,
              actual_message_count: i + 1
            })
            .eq('id', execution.id);

          // Simulate processing time
          await new Promise(resolve => setTimeout(resolve, 1000 / timeAcceleration));
        }

        // Complete execution
        await supabase
          .from('test_executions')
          .update({
            status: 'completed',
            end_time: new Date().toISOString(),
            progress: 100,
            current_message: 'Test execution completed successfully',
            results: {
              ...execution.results,
              totalMessages,
              processedMessages: totalMessages,
              successRate: 100,
              complianceScore: 95,
              layerData: {
                PHY: { totalCount: Math.floor(totalMessages * 0.3), errorCount: 0 },
                MAC: { totalCount: Math.floor(totalMessages * 0.2), errorCount: 0 },
                RLC: { totalCount: Math.floor(totalMessages * 0.2), errorCount: 0 },
                PDCP: { totalCount: Math.floor(totalMessages * 0.1), errorCount: 0 },
                RRC: { totalCount: Math.floor(totalMessages * 0.1), errorCount: 0 },
                NAS: { totalCount: Math.floor(totalMessages * 0.1), errorCount: 0 }
              }
            }
          })
          .eq('id', execution.id);

        console.log(`✅ Test execution completed: ${execution.id}`);
      } catch (error) {
        console.error('Error during test execution simulation:', error);
        
        // Mark execution as failed
        await supabase
          .from('test_executions')
          .update({
            status: 'failed',
            end_time: new Date().toISOString(),
            current_message: `Execution failed: ${error.message}`,
            results: {
              ...execution.results,
              error: error.message
            }
          })
          .eq('id', execution.id);
      }
    }, 100); // Start simulation after 100ms

    console.log(`✅ Test execution started: ${execution.id}`);

    return NextResponse.json({
      success: true,
      data: {
        executionId: execution.id,
        queueId: execution.id,
        status: 'running',
        message: 'Test execution started successfully'
      }
    });

  } catch (error) {
    console.error('❌ Error starting test execution:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}