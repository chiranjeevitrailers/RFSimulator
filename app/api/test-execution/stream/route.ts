import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase';

// Store active streaming connections
const activeConnections = new Map<string, {
  controller: ReadableStreamDefaultController;
  startTime: number;
  lastActivity: number;
}>();

// Cleanup inactive connections every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [executionId, connection] of activeConnections.entries()) {
    if (now - connection.lastActivity > 300000) { // 5 minutes
      activeConnections.delete(executionId);
      console.log(`Cleaned up inactive connection for execution: ${executionId}`);
    }
  }
}, 300000);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const executionId = searchParams.get('executionId');
  const testCaseId = searchParams.get('testCaseId');

  if (!executionId && !testCaseId) {
    return new Response('Execution ID or Test Case ID is required', { status: 400 });
  }

  try {
    const supabase = createClient();

    // Create a ReadableStream for Server-Sent Events
    const stream = new ReadableStream({
      start(controller) {
        // Store the controller for this execution
        const connectionKey = executionId || testCaseId!;
        activeConnections.set(connectionKey, {
          controller,
          startTime: Date.now(),
          lastActivity: Date.now(),
        });

        console.log(`Started streaming for execution: ${connectionKey}`);

        // Send initial connection confirmation
        const initialData = {
          type: 'connection',
          timestamp: Date.now(),
          executionId: executionId || 'unknown',
          testCaseId: testCaseId || 'unknown',
          status: 'connected',
          message: 'Streaming connection established'
        };

        controller.enqueue(`data: ${JSON.stringify(initialData)}\n\n`);

        // Function to send stream data
        const sendStreamData = async () => {
          try {
            if (executionId) {
              // Fetch latest execution status
              const { data: execution, error: execError } = await supabase
                .from('test_case_executions')
                .select('*')
                .eq('id', executionId)
                .single();

              if (!execError && execution) {
                const statusData = {
                  type: 'execution_status',
                  timestamp: Date.now(),
                  executionId: execution.id,
                  status: execution.status,
                  progress: Math.round((execution.actual_message_count || 0) / Math.max(execution.expected_message_count || 1, 1) * 100),
                  messagesProcessed: execution.actual_message_count || 0,
                  totalMessages: execution.expected_message_count || 0,
                  currentMessage: execution.current_message,
                  startTime: execution.start_time,
                  endTime: execution.end_time,
                  error: execution.error,
                };

                controller.enqueue(`data: ${JSON.stringify(statusData)}\n\n`);
              }

              // Fetch latest decoded messages
              const { data: messages, error: msgError } = await supabase
                .from('decoded_messages')
                .select('*')
                .eq('execution_id', executionId)
                .order('timestamp_us', { ascending: false })
                .limit(10);

              if (!msgError && messages && messages.length > 0) {
                for (const message of messages) {
                  const messageData = {
                    type: 'message',
                    timestamp: Date.now(),
                    executionId: executionId,
                    messageId: message.id,
                    layer: message.layer,
                    protocol: message.protocol,
                    messageType: message.message_type,
                    messageName: message.message_name,
                    direction: message.message_direction,
                    decodedData: message.decoded_data,
                    informationElements: message.information_elements,
                    validationStatus: message.validation_status,
                    processingTimeMs: message.processing_time_ms,
                  };

                  controller.enqueue(`data: ${JSON.stringify(messageData)}\n\n`);
                }
              }
            }

            // Send heartbeat
            const heartbeatData = {
              type: 'heartbeat',
              timestamp: Date.now(),
              executionId: executionId || 'unknown',
              message: 'Connection alive'
            };

            controller.enqueue(`data: ${JSON.stringify(heartbeatData)}\n\n`);

            // Update last activity
            const connection = activeConnections.get(connectionKey);
            if (connection) {
              connection.lastActivity = Date.now();
            }

          } catch (error) {
            console.error('Error in stream processing:', error);
            const errorData = {
              type: 'error',
              timestamp: Date.now(),
              executionId: executionId || 'unknown',
              message: 'Stream processing error',
              error: error instanceof Error ? error.message : 'Unknown error'
            };
            controller.enqueue(`data: ${JSON.stringify(errorData)}\n\n`);
          }
        };

        // Start sending data every 1 second
        const interval = setInterval(sendStreamData, 1000);

        // Clean up on connection close
        request.signal.addEventListener('abort', () => {
          clearInterval(interval);
          activeConnections.delete(connectionKey);
          console.log(`Stream closed for execution: ${connectionKey}`);
        });

      },
      cancel() {
        console.log('Stream cancelled');
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    });

  } catch (error) {
    console.error('Error setting up stream:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

// Handle WebSocket upgrade for real-time streaming
export async function WebSocket(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const executionId = searchParams.get('executionId');
  const testCaseId = searchParams.get('testCaseId');

  if (!executionId && !testCaseId) {
    return new Response('Execution ID or Test Case ID is required', { status: 400 });
  }

  const upgradeHeader = request.headers.get('upgrade');

  if (upgradeHeader !== 'websocket') {
    return new Response('Expected websocket connection', { status: 400 });
  }

  try {
    // In a production environment, you would use a proper WebSocket server
    // For now, we'll redirect to the SSE endpoint
    const sseUrl = new URL(request.url);
    sseUrl.pathname = sseUrl.pathname.replace('/websocket', '');
    sseUrl.searchParams.set('format', 'websocket');

    return new Response(null, {
      status: 303,
      headers: {
        'Location': sseUrl.toString(),
      },
    });

  } catch (error) {
    console.error('WebSocket upgrade error:', error);
    return new Response('WebSocket upgrade failed', { status: 500 });
  }
}