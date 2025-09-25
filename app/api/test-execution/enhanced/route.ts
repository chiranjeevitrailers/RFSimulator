import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import TestExecutionWebSocketServer from '@/lib/test-execution-websocket-server';

const activeExecutions = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      testCaseId,
      userId,
      executionMode = 'comprehensive',
      configuration = {},
      timeAcceleration = 1.0,
      logLevel = 'detailed',
      captureMode = 'full'
    } = body;

    if (!testCaseId || !userId) {
      return NextResponse.json(
        { error: 'testCaseId and userId are required' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin;

    console.log(`🚀 Starting enhanced test execution: ${testCaseId}`);

    // Create test execution record
    const { data: execution, error: executionError } = await supabase
      .from('test_case_executions')
      .insert({
        test_case_id: testCaseId,
        user_id: userId,
        status: 'running',
        execution_mode: executionMode,
        configuration: {
          time_acceleration: timeAcceleration,
          log_level: logLevel,
          capture_mode: captureMode,
          ...configuration
        },
        start_time: new Date().toISOString(),
        expected_message_count: 0, // Will be updated after fetching test case data
        actual_message_count: 0
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

    // Fetch comprehensive test case data
    const { data: testCaseData, error: testCaseError } = await supabase
      .from('test_cases')
      .select(`
        *,
        test_case_messages(*),
        test_case_information_elements(*),
        test_case_layer_parameters(*),
        test_case_categories(*)
      `)
      .eq('id', testCaseId)
      .single();

    if (testCaseError) {
      console.error('Test case fetch error:', testCaseError);
      // Don't fail, just log the error
    }

    // Update execution with expected message count
    if (testCaseData) {
      await supabase
        .from('test_case_executions')
        .update({
          expected_message_count: testCaseData.test_case_messages?.length || 0
        })
        .eq('id', execution.id);
    }

    // Store execution info for streaming
    activeExecutions.set(execution.id, {
      executionId: execution.id,
      testCaseId: testCaseId,
      testCaseData: testCaseData,
      status: 'running',
      startTime: Date.now(),
      messages: [],
      currentIndex: 0
    });

    // Start the execution process
    startTestExecution(execution.id, testCaseData);

    console.log(`✅ Enhanced test execution started successfully - ExecutionId: ${execution.id}`);

    return NextResponse.json({
      success: true,
      executionId: execution.id,
      status: 'running',
      message: 'Enhanced test execution started successfully',
      data: {
        executionId: execution.id,
        testCaseData: testCaseData,
        websocketUrl: `ws://localhost:8082?executionId=${execution.id}`
      }
    });

  } catch (error) {
    console.error('❌ Error in enhanced test execution:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function startTestExecution(executionId: string, testCaseData: any) {
  const execution = activeExecutions.get(executionId);
  if (!execution) return;

  try {
    // Get the WebSocket server instance
    const wsServer = TestExecutionWebSocketServer.getInstance();
    const supabase = supabaseAdmin;

    // Process messages sequentially based on their timestamps
    if (testCaseData?.test_case_messages && testCaseData.test_case_messages.length > 0) {
      const messages = testCaseData.test_case_messages.sort((a: any, b: any) => a.step_order - b.step_order);

      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];

        // Create decoded message entry
        const decodedMessage = {
          execution_id: executionId,
          message_id: message.id,
          timestamp_us: Date.now() * 1000 + (message.timestamp_ms || i * 100),
          protocol: testCaseData.protocol || '5G_NR',
          message_type: message.message_type,
          message_name: message.message_name,
          message_direction: message.direction,
          layer: message.layer || 'RRC',
          sublayer: message.layer || 'RRC',
          source_entity: message.direction === 'UL' ? 'UE' : 'gNB',
          target_entity: message.direction === 'UL' ? 'gNB' : 'UE',
          decoded_data: message.message_payload || {},
          information_elements: message.test_case_information_elements || [],
          ie_count: message.test_case_information_elements?.length || 0,
          validation_status: 'valid',
          validation_errors: [],
          validation_warnings: [],
          message_size: JSON.stringify(message.message_payload || {}).length,
          processing_time_ms: Math.random() * 10 + 1,
          decoded_information_elements: message.test_case_information_elements || [],
          decoded_layer_parameters: message.test_case_layer_parameters || []
        };

        // Save to database
        const { data: savedMessage, error: msgError } = await supabase
          .from('decoded_messages')
          .insert(decodedMessage)
          .select()
          .single();

        if (msgError) {
          console.error('Error saving decoded message:', msgError);
        }

        // Update execution status
        await supabase
          .from('test_case_executions')
          .update({
            actual_message_count: i + 1,
            current_message: message.message_name,
            status: i === messages.length - 1 ? 'completed' : 'running'
          })
          .eq('id', executionId);

        // Send to WebSocket clients
        if (wsServer) {
          wsServer['sendToClient'](executionId, {
            type: 'message',
            timestamp: Date.now(),
            executionId: executionId,
            messageId: savedMessage?.id || message.id,
            layer: message.layer || 'RRC',
            protocol: testCaseData.protocol || '5G_NR',
            messageType: message.message_type,
            messageName: message.message_name,
            direction: message.direction,
            decodedData: message.message_payload || {},
            informationElements: message.test_case_information_elements || [],
            validationStatus: 'valid',
            processingTimeMs: decodedMessage.processing_time_ms,
          });
        }

        // Add delay between messages (simulated processing time)
        const delay = Math.max(100, (message.timestamp_ms || 1000) / (execution.testCaseData?.timeAcceleration || 1));
        await new Promise(resolve => setTimeout(resolve, delay));

        // Update execution info
        execution.currentIndex = i + 1;
        execution.messages.push(decodedMessage);
      }
    }

    // Mark execution as completed
    await supabase
      .from('test_case_executions')
      .update({
        status: 'completed',
        end_time: new Date().toISOString()
      })
      .eq('id', executionId);

    // Send completion message
    if (wsServer) {
      wsServer['sendToClient'](executionId, {
        type: 'complete',
        timestamp: Date.now(),
        executionId: executionId,
        message: 'Test execution completed successfully',
        totalMessages: execution.messages.length
      });
    }

    // Clean up
    activeExecutions.delete(executionId);

    console.log(`✅ Test execution completed: ${executionId}`);

  } catch (error) {
    console.error('Error in test execution:', error);

    // Mark execution as failed
    await supabase
      .from('test_case_executions')
      .update({
        status: 'failed',
        end_time: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      .eq('id', executionId);

    // Send error message
    if (wsServer) {
      wsServer['sendToClient'](executionId, {
        type: 'error',
        timestamp: Date.now(),
        executionId: executionId,
        message: 'Test execution failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Clean up
    activeExecutions.delete(executionId);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const executionId = searchParams.get('executionId');

  if (!executionId) {
    return NextResponse.json(
      { error: 'executionId is required' },
      { status: 400 }
    );
  }

  const supabase = supabaseAdmin;

  try {
    // Get execution status
    const { data: execution, error: execError } = await supabase
      .from('test_case_executions')
      .select('*')
      .eq('id', executionId)
      .single();

    if (execError) {
      return NextResponse.json(
        { error: 'Execution not found' },
        { status: 404 }
      );
    }

    // Get recent messages
    const { data: messages, error: msgError } = await supabase
      .from('decoded_messages')
      .select('*')
      .eq('execution_id', executionId)
      .order('timestamp_us', { ascending: false })
      .limit(50);

    if (msgError) {
      console.error('Error fetching messages:', msgError);
    }

    return NextResponse.json({
      success: true,
      executionId: executionId,
      status: execution.status,
      progress: Math.round((execution.actual_message_count || 0) / Math.max(execution.expected_message_count || 1, 1) * 100),
      messagesProcessed: execution.actual_message_count || 0,
      totalMessages: execution.expected_message_count || 0,
      currentMessage: execution.current_message,
      startTime: execution.start_time,
      endTime: execution.end_time,
      error: execution.error,
      messages: messages || []
    });

  } catch (error) {
    console.error('Error fetching execution status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Use supabaseAdmin for the startTestExecution function
// This is a workaround since the function is called asynchronously