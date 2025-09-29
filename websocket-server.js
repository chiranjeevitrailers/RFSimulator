#!/usr/bin/env node

const WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uujdknhxsrugxwcjidac.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1amRrbmh4c3J1Z3h3Y2ppZGFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQ5NDk0NSwiZXhwIjoyMDcwMDcwOTQ1fQ.8QJXy01zbvRkue9fWinO_b1KmxE_92SOIR9oM1E87SI'
);

class TestExecutionWebSocketServer {
  constructor() {
    this.wss = null;
    this.clients = new Map();
    this.heartbeatInterval = null;
  }

  start(port = 8081) {
    if (this.wss) {
      console.log('WebSocket server is already running');
      return;
    }

    try {
      this.wss = new WebSocket.Server({ port });

      console.log(`🚀 Test Execution WebSocket server started on port ${port}`);
      console.log(`📡 Ready to accept connections at ws://localhost:${port}`);

      this.wss.on('connection', (ws, request) => {
        const url = new URL(request.url || '', 'ws://localhost');
        const executionId = url.searchParams.get('executionId');
        const testCaseId = url.searchParams.get('testCaseId');

        if (!executionId && !testCaseId) {
          ws.close(1008, 'Execution ID or Test Case ID is required');
          return;
        }

        const clientId = executionId || testCaseId;
        const client = {
          ws: ws,
          executionId: executionId,
          testCaseId: testCaseId,
          connectedAt: Date.now(),
          lastActivity: Date.now()
        };

        this.clients.set(clientId, client);

        console.log(`✅ Client connected: ${clientId} (${this.clients.size} total clients)`);

        // Send welcome message
        ws.send(JSON.stringify({
          type: 'connection_established',
          message: 'Connected to 5GLabX Test Execution WebSocket Server',
          clientId: clientId,
          timestamp: new Date().toISOString()
        }));

        ws.on('message', (message) => {
          try {
            const data = JSON.parse(message);
            client.lastActivity = Date.now();

            console.log(`📨 Received message from ${clientId}:`, data.type);

            // Handle different message types
            switch (data.type) {
              case 'ping':
                ws.send(JSON.stringify({
                  type: 'pong',
                  timestamp: Date.now()
                }));
                break;

              case 'test_execution_start':
                this.handleTestExecutionStart(clientId, data);
                break;

              case 'test_execution_update':
                this.handleTestExecutionUpdate(clientId, data);
                break;

              default:
                console.log(`Unknown message type: ${data.type}`);
            }
          } catch (error) {
            console.error(`Error processing message from ${clientId}:`, error);
          }
        });

        ws.on('close', () => {
          this.clients.delete(clientId);
          console.log(`❌ Client disconnected: ${clientId} (${this.clients.size} total clients)`);
        });

        ws.on('error', (error) => {
          console.error(`WebSocket error for client ${clientId}:`, error);
          this.clients.delete(clientId);
        });
      });

      this.startHeartbeat();

    } catch (error) {
      console.error('Failed to start WebSocket server:', error);
    }
  }

  handleTestExecutionStart(clientId, data) {
    console.log(`🚀 Test execution started for ${clientId}:`, data.testCaseId);
    
    // Send acknowledgment
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify({
        type: 'test_execution_acknowledged',
        executionId: data.executionId,
        testCaseId: data.testCaseId,
        message: 'Test execution started successfully',
        timestamp: new Date().toISOString()
      }));
    }

    // Simulate test execution progress
    this.simulateTestExecution(clientId, data);
  }

  handleTestExecutionUpdate(clientId, data) {
    console.log(`📊 Test execution update for ${clientId}:`, data.message);
    
    // Broadcast update to all clients
    this.broadcastToAllClients({
      type: 'test_execution_update',
      executionId: data.executionId,
      testCaseId: data.testCaseId,
      message: data.message,
      timestamp: new Date().toISOString()
    });
  }

  simulateTestExecution(clientId, data) {
    const steps = [
      'Initializing test environment...',
      'Loading test case configuration...',
      'Setting up network parameters...',
      'Starting test execution...',
      'Monitoring test progress...',
      'Collecting test results...',
      'Test execution completed successfully!'
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex >= steps.length) {
        clearInterval(interval);
        return;
      }

      const client = this.clients.get(clientId);
      if (client && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify({
          type: 'test_execution_progress',
          executionId: data.executionId,
          testCaseId: data.testCaseId,
          step: stepIndex + 1,
          totalSteps: steps.length,
          message: steps[stepIndex],
          progress: Math.round(((stepIndex + 1) / steps.length) * 100),
          timestamp: new Date().toISOString()
        }));
      }

      stepIndex++;
    }, 2000); // Send update every 2 seconds
  }

  broadcastToAllClients(message) {
    this.clients.forEach((client, clientId) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        try {
          client.ws.send(JSON.stringify(message));
        } catch (error) {
          console.error(`Error broadcasting to client ${clientId}:`, error);
          this.clients.delete(clientId);
        }
      }
    });
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      const now = Date.now();

      // Send heartbeat to all connected clients
      this.clients.forEach((client, clientId) => {
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
      this.clients.forEach((client, clientId) => {
        if (now - client.lastActivity > 300000) {
          client.ws.close(1000, 'Connection timeout');
          this.clients.delete(clientId);
          console.log(`🧹 Cleaned up inactive client: ${clientId}`);
        }
      });
    }, 30000); // Heartbeat every 30 seconds
  }

  getConnectedClients() {
    return Array.from(this.clients.keys());
  }

  stop() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }

    this.clients.clear();
    console.log('🛑 WebSocket server stopped');
  }
}

// Start the server
const server = new TestExecutionWebSocketServer();
server.start(8081);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  server.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  server.stop();
  process.exit(0);
});

console.log('🎯 5GLabX Test Execution WebSocket Server');
console.log('📡 Listening for connections on port 8081');
console.log('🔗 Connect with: ws://localhost:8081?executionId=test-123');