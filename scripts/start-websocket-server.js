#!/usr/bin/env node

/**
 * WebSocket Server Startup Script
 * Ensures the WebSocket server is properly initialized before the main application starts
 */

const TestExecutionWebSocketServer = require('../lib/test-execution-websocket-server');

console.log('🚀 Starting WebSocket Server...');

try {
  // Get the singleton instance
  const wsServer = TestExecutionWebSocketServer.getInstance();
  
  // Start the server
  wsServer.start(8082);
  
  console.log('✅ WebSocket server started successfully on port 8082');
  console.log('📡 Server is ready to accept connections');
  
  // Keep the process alive
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down WebSocket server...');
    wsServer.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down WebSocket server...');
    wsServer.stop();
    process.exit(0);
  });
  
} catch (error) {
  console.error('❌ Failed to start WebSocket server:', error);
  process.exit(1);
}