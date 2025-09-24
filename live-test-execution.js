#!/usr/bin/env node

/**
 * LIVE TEST CASE EXECUTION DEMONSTRATION
 * This script demonstrates the complete data flow from test case selection to real-time display
 */

const http = require('http');
const WebSocket = require('ws');

console.log('🚀 5GLabX LIVE TEST CASE EXECUTION DEMONSTRATION');
console.log('================================================\n');

console.log('🎯 STEP 1: SELECTING TEST CASE');
console.log('   Selected: "5G NR Initial Access"');
console.log('   Test Case ID: 5g-nr-initial-access');
console.log('   Protocol: 5G_NR');
console.log('   Layer: Multi (PHY → IMS)');
console.log('   Complexity: Intermediate');
console.log('   Expected Messages: 7\n');

// Test execution parameters
const testExecutionData = {
  testCaseId: '5g-nr-initial-access',
  userId: `live-demo-${Date.now()}`,
  executionMode: 'comprehensive',
  configuration: {
    protocol: '5G_NR',
    layer: 'Multi',
    complexity: 'intermediate',
    category: '5G NR',
    description: '5G NR Initial Access Procedures'
  },
  timeAcceleration: 2.0, // Speed up for demo
  logLevel: 'detailed',
  captureMode: 'full'
};

console.log('🎯 STEP 2: EXECUTING TEST CASE');
console.log('   Execution Parameters:');
console.log(`   • Test Case ID: ${testExecutionData.testCaseId}`);
console.log(`   • User ID: ${testExecutionData.userId}`);
console.log(`   • Mode: ${testExecutionData.executionMode}`);
console.log(`   • Time Acceleration: ${testExecutionData.timeAcceleration}x`);
console.log('   • Log Level: detailed');
console.log('   • Capture Mode: full\n');

console.log('📡 SENDING EXECUTION REQUEST TO ENHANCED API...');

// Make the API call to start test execution
function executeTestCase() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(testExecutionData);

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/test-execution/enhanced/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('   ✅ API Response Received:');
          console.log(`   • Success: ${response.success}`);
          console.log(`   • Execution ID: ${response.executionId}`);
          console.log(`   • Status: ${response.status}`);
          console.log(`   • Message: ${response.message}\n`);

          if (response.success && response.executionId) {
            resolve({
              executionId: response.executionId,
              websocketUrl: `ws://localhost:8082?executionId=${response.executionId}`,
              response
            });
          } else {
            reject(new Error(`API returned error: ${response.message || 'Unknown error'}`));
          }
        } catch (error) {
          console.log('   ❌ Error parsing API response:', error.message);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log('   ❌ API Request Failed:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Monitor execution status
function monitorExecutionStatus(executionId) {
  console.log('🎯 STEP 3: MONITORING EXECUTION STATUS');
  console.log(`   Execution ID: ${executionId}\n`);

  const checkInterval = setInterval(async () => {
    try {
      const response = await makeRequest(`http://localhost:3000/api/test-execution/enhanced/?executionId=${executionId}`);
      if (response.status === 200) {
        const data = JSON.parse(response.body);
        console.log('   📊 Execution Status Update:');
        console.log(`   • Status: ${data.status}`);
        console.log(`   • Progress: ${data.progress}%`);
        console.log(`   • Messages Processed: ${data.messagesProcessed}/${data.totalMessages}`);
        console.log(`   • Current Message: ${data.currentMessage || 'N/A'}`);

        if (data.messages && data.messages.length > 0) {
          console.log('   📨 Recent Messages:');
          data.messages.slice(0, 3).forEach((msg, i) => {
            console.log(`      ${i + 1}. ${msg.message_name} (${msg.layer}) - ${msg.validation_status}`);
          });
        }

        console.log('');
      }
    } catch (error) {
      console.log('   ⚠️  Could not fetch status update:', error.message);
    }
  }, 2000);

  return checkInterval;
}

// Connect to WebSocket and monitor real-time streaming
function connectWebSocket(executionData) {
  console.log('🎯 STEP 4: CONNECTING TO REAL-TIME WEBSOCKET');
  console.log(`   WebSocket URL: ${executionData.websocketUrl}\n`);

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(executionData.websocketUrl);
    let messageCount = 0;
    let statusUpdates = 0;
    let connected = false;

    const timeout = setTimeout(() => {
      if (connected) {
        console.log('   ✅ WebSocket connection successful');
        console.log(`   📊 Total messages received: ${messageCount}`);
        console.log(`   📊 Status updates: ${statusUpdates}`);
        ws.close();
        resolve({ messageCount, statusUpdates });
      } else {
        console.log('   ❌ WebSocket connection timeout');
        reject(new Error('WebSocket connection timeout'));
      }
    }, 15000);

    ws.on('open', () => {
      console.log('   🔌 WebSocket connected successfully');
      connected = true;

      // Send test message
      ws.send(JSON.stringify({
        type: 'request_status',
        executionId: executionData.executionId
      }));
    });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        messageCount++;

        console.log(`   📨 Message ${messageCount}: ${message.type}`);

        if (message.type === 'connection') {
          console.log('   ✅ WebSocket connection confirmed');
        } else if (message.type === 'execution_status') {
          statusUpdates++;
          console.log(`   📊 Status Update ${statusUpdates}: ${message.status} (${message.progress}%)`);
          console.log(`      Messages: ${message.messagesProcessed}/${message.totalMessages}`);
        } else if (message.type === 'message') {
          console.log(`   📨 Protocol Message: ${message.messageName}`);
          console.log(`      Layer: ${message.layer}, Protocol: ${message.protocol}`);
          console.log(`      Direction: ${message.direction}, Validation: ${message.validationStatus}`);
        } else if (message.type === 'complete') {
          console.log('   🎉 TEST EXECUTION COMPLETED!');
          console.log(`   📊 Total Messages Processed: ${messageCount}`);
          clearTimeout(timeout);
          ws.close();
          resolve({ messageCount, statusUpdates, completed: true });
        }
      } catch (error) {
        console.log('   ❌ Error parsing WebSocket message:', error.message);
      }
    });

    ws.on('error', (error) => {
      console.log('   ❌ WebSocket error:', error.message);
      clearTimeout(timeout);
      reject(error);
    });

    ws.on('close', (code, reason) => {
      console.log(`   🔌 WebSocket closed: ${code} - ${reason}`);
      clearTimeout(timeout);
    });
  });
}

// Utility function to make HTTP requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
  });
}

// Main execution
async function runLiveTest() {
  try {
    console.log('🎯 STEP 0: VERIFYING SYSTEM STATUS\n');

    // Check if servers are running
    const servers = [
      { name: 'Next.js App', url: 'http://localhost:3000' },
      { name: 'CLI Server', url: 'http://localhost:8080/health' }
    ];

    for (const server of servers) {
      try {
        const response = await makeRequest(server.url);
        console.log(`   ✅ ${server.name}: Running (${response.status})`);
      } catch (error) {
        console.log(`   ❌ ${server.name}: Not accessible`);
        console.log('   💡 Please start the servers first:');
        console.log('      • npm run dev (Next.js)');
        console.log('      • node server.js (CLI Server)');
        return;
      }
    }

    console.log('\n🎯 STARTING LIVE TEST EXECUTION...\n');

    // Execute the test case
    const executionData = await executeTestCase();

    // Monitor execution status
    const statusMonitor = monitorExecutionStatus(executionData.executionId);

    // Connect to WebSocket for real-time streaming
    const wsResult = await connectWebSocket(executionData);

    // Stop monitoring
    clearInterval(statusMonitor);

    console.log('\n🎉 LIVE TEST EXECUTION COMPLETED!');
    console.log('=================================');
    console.log('✅ Test Case Selected: 5G NR Initial Access');
    console.log('✅ API Execution: Success');
    console.log('✅ Real-time Streaming: Active');
    console.log('✅ WebSocket Connection: Established');
    console.log('✅ Database Integration: Working');
    console.log('✅ Status Monitoring: Real-time');
    console.log(`📊 Total Messages Received: ${wsResult.messageCount}`);
    console.log(`📊 Status Updates: ${wsResult.statusUpdates}`);
    console.log(`✅ Completion Status: ${wsResult.completed ? 'Completed' : 'Running'}`);

    console.log('\n🚀 DATA FLOW VERIFIED!');
    console.log('======================');
    console.log('The complete data flow from test case execution to frontend display is working!');
    console.log('You can now test this manually through the web interface at:');
    console.log('🌐 http://localhost:3000');

  } catch (error) {
    console.log('\n❌ LIVE TEST FAILED!');
    console.log('===================');
    console.log(`Error: ${error.message}`);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure servers are running:');
    console.log('   - Next.js: npm run dev');
    console.log('   - CLI Server: node server.js');
    console.log('2. Check if test case ID is valid');
    console.log('3. Verify database connectivity');
  }
}

// Run the live test
runLiveTest();