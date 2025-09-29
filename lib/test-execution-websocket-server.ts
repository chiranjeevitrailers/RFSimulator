import { WebSocketServer, WebSocket } from 'ws';
import { createClient } from '@/lib/supabase';

interface TestExecutionWebSocketClient {
  ws: WebSocket;
  executionId: string;
  testCaseId: string;
  connectedAt: number;
  lastActivity: number;
}

class TestExecutionWebSocketServer {
  private static instance: TestExecutionWebSocketServer;
  private wss: WebSocketServer | null = null;
  private clients = new Map<string, TestExecutionWebSocketClient>();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private supabase = createClient();

  private constructor() {}

  static getInstance(): TestExecutionWebSocketServer {
    if (!TestExecutionWebSocketServer.instance) {
      TestExecutionWebSocketServer.instance = new TestExecutionWebSocketServer();
    }
    return TestExecutionWebSocketServer.instance;
  }

  start(port: number = 8081): void {
    if (this.wss) {
      console.log('WebSocket server is already running');
      return;
    }

    try {
      this.wss = new WebSocketServer({ port });

      console.log(`Test Execution WebSocket server started on port ${port}`);

      this.wss.on('connection', (ws, request) => {
        const url = new URL(request.url || '', 'ws://localhost');
        const executionId = url.searchParams.get('executionId');
        const testCaseId = url.searchParams.get('testCaseId');

        if (!executionId && !testCaseId) {
          ws.close(1008, 'Execution ID or Test Case ID is required');
          return;
        }

        const clientId = executionId || testCaseId!;
        const client: TestExecutionWebSocketClient = {
          ws,
          executionId: executionId || 'unknown',
          testCaseId: testCaseId || 'unknown',
          connectedAt: Date.now(),
          lastActivity: Date.now(),
        };

        this.clients.set(clientId, client);
        console.log(`Client connected for execution: ${clientId}`);

        // Send connection confirmation
        this.sendToClient(clientId, {
          type: 'connection',
          timestamp: Date.now(),
          executionId: client.executionId,
          testCaseId: client.testCaseId,
          status: 'connected',
          message: 'WebSocket connection established'
        });

        // Set up message handler
        ws.on('message', async (message) => {
          try {
            const data = JSON.parse(message.toString());
            client.lastActivity = Date.now();

            // Handle different message types
            if (data.type === 'ping') {
              this.sendToClient(clientId, {
                type: 'pong',
                timestamp: Date.now(),
                executionId: client.executionId,
              });
            } else if (data.type === 'request_status') {
              await this.sendExecutionStatus(clientId);
            } else if (data.type === 'request_messages') {
              await this.sendRecentMessages(clientId);
            }

          } catch (error) {
            console.error('Error processing WebSocket message:', error);
            this.sendToClient(clientId, {
              type: 'error',
              timestamp: Date.now(),
              executionId: client.executionId,
              message: 'Error processing message',
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        });

        // Handle client disconnect
        ws.on('close', () => {
          console.log(`Client disconnected for execution: ${clientId}`);
          this.clients.delete(clientId);
        });

        // Handle errors
        ws.on('error', (error) => {
          console.error(`WebSocket error for execution ${clientId}:`, error);
          this.clients.delete(clientId);
        });

        // Start sending periodic updates for this execution
        this.startPeriodicUpdates(clientId);
      });

      // Start heartbeat
      this.startHeartbeat();

      console.log('Test Execution WebSocket server is ready to accept connections');

    } catch (error) {
      console.error('Failed to start WebSocket server:', error);
    }
  }

  stop(): void {
    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    this.clients.clear();
    console.log('Test Execution WebSocket server stopped');
  }

  private sendToClient(clientId: string, message: any): void {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error(`Error sending message to client ${clientId}:`, error);
      }
    }
  }

  private async sendExecutionStatus(executionId: string): Promise<void> {
    try {
      const { data: execution, error } = await this.supabase
        .from('test_case_executions')
        .select('*')
        .eq('id', executionId)
        .single();

      if (!error && execution) {
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

        this.sendToClient(executionId, statusData);
      }
    } catch (error) {
      console.error('Error fetching execution status:', error);
    }
  }

  private async sendRecentMessages(executionId: string): Promise<void> {
    try {
      const { data: messages, error } = await this.supabase
        .from('decoded_messages')
        .select('*')
        .eq('execution_id', executionId)
        .order('timestamp_us', { ascending: false })
        .limit(20);

      if (!error && messages) {
        for (const message of messages.reverse()) { // Send in chronological order
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

          this.sendToClient(executionId, messageData);
        }
      }
    } catch (error) {
      console.error('Error fetching recent messages:', error);
    }
  }

  private startPeriodicUpdates(executionId: string): void {
    const updateInterval = setInterval(async () => {
      const client = this.clients.get(executionId);
      if (!client) {
        clearInterval(updateInterval);
        return;
      }

      // Send status update
      await this.sendExecutionStatus(executionId);

      // Send recent messages
      await this.sendRecentMessages(executionId);
    }, 1000);

    // Clean up interval after 10 minutes
    setTimeout(() => {
      clearInterval(updateInterval);
    }, 600000);
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      const now = Date.now();

      // Send heartbeat to all connected clients
      Array.from(this.clients.entries()).forEach(([clientId, client]) => {
        if (client.ws.readyState === WebSocket.OPEN) {
          try {
            client.ws.send(JSON.stringify({
              type: 'heartbeat',
              timestamp: now,
              executionId: client.executionId,
              message: 'Connection alive'
            }));
          } catch (error) {
            console.error(`Error sending heartbeat to client ${clientId}:`, error);
            this.clients.delete(clientId);
          }
        } else {
          this.clients.delete(clientId);
        }
      });

      // Clean up inactive clients (no activity for 5 minutes)
      Array.from(this.clients.entries()).forEach(([clientId, client]) => {
        if (now - client.lastActivity > 300000) {
          client.ws.close(1000, 'Connection timeout');
          this.clients.delete(clientId);
          console.log(`Cleaned up inactive client: ${clientId}`);
        }
      });
    }, 30000); // Heartbeat every 30 seconds
  }

  getConnectedClients(): string[] {
    return Array.from(this.clients.keys());
  }

  getClientCount(): number {
    return this.clients.size;
  }
}

export default TestExecutionWebSocketServer;

// Function to start the WebSocket server (call this from your main server file)
export const startTestExecutionWebSocketServer = (port?: number): TestExecutionWebSocketServer => {
  const server = TestExecutionWebSocketServer.getInstance();
  server.start(port);
  return server;
};

// Function to stop the WebSocket server
export const stopTestExecutionWebSocketServer = (): void => {
  const server = TestExecutionWebSocketServer.getInstance();
  server.stop();
};