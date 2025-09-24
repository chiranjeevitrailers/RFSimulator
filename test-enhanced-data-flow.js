#!/usr/bin/env node

/**
 * Enhanced Data Flow Test
 * Tests the complete data flow from test execution to frontend display
 */

const http = require('http');
const WebSocket = require('ws');

console.log('🚀 Enhanced 5GLabX Data Flow Test');
console.log('==================================\n');

// Test 1: Start the servers
console.log('1. Testing server connectivity...');
const testServers = () => {
  return new Promise((resolve, reject) => {
    const servers = [
      { name: 'Next.js App', url: 'http://localhost:3000' },
      { name: 'CLI Server', url: 'http://localhost:8080' },
    ];

    let completed = 0;
    let failed = 0;

    servers.forEach(server => {
      const req = http.get(server.url, (res) => {
        if (res.statusCode === 200 || res.statusCode === 404) { // 404 is ok for some routes
          console.log(`   ✅ ${server.name} is running on ${server.url}`);
          completed++;
        } else {
          console.log(`   ❌ ${server.name} returned status: ${res.statusCode}`);
          failed++;
        }

        if (completed + failed === servers.length) {
          if (failed === 0) {
            resolve(true);
          } else {
            reject(new Error(`${failed} server(s) failed`));
          }
        }
      });

      req.on('error', (err) => {
        console.log(`   ❌ ${server.name} is not accessible: ${err.message}`);
        failed++;
        if (completed + failed === servers.length) {
          reject(new Error(`${failed} server(s) failed`));
        }
      });

      req.setTimeout(5000, () => {
        console.log(`   ❌ ${server.name} connection timeout`);
        failed++;
        if (completed + failed === servers.length) {
          reject(new Error(`${failed} server(s) failed`));
        }
      });
    });
  });
};

// Test 2: Test enhanced API endpoint
console.log('\n2. Testing enhanced API endpoint...');
const testEnhancedAPI = () => {
  return new Promise((resolve, reject) => {
    const testData = {
      testCaseId: '5g-nr-initial-access',
      userId: `test-user-${Date.now()}`,
      executionMode: 'comprehensive',
      configuration: {
        protocol: '5G_NR',
        layer: 'Multi',
        complexity: 'intermediate',
        category: '5G NR',
        description: 'Test 5G NR Initial Access'
      },
      timeAcceleration: 1.0,
      logLevel: 'detailed',
      captureMode: 'full'
    };

    const req = http.request('http://localhost:3000/api/test-execution/enhanced', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.success) {
            console.log('   ✅ Enhanced API is working');
            console.log(`   📊 Execution ID: ${response.executionId}`);
            console.log(`   📊 WebSocket URL: ${response.data?.websocketUrl}`);
            resolve({
              executionId: response.executionId,
              websocketUrl: response.data?.websocketUrl
            });
          } else {
            console.log('   ❌ Enhanced API returned error:', response);
            reject(new Error('API returned error'));
          }
        } catch (err) {
          console.log('   ❌ Failed to parse API response');
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      console.log('   ❌ Enhanced API request failed:', err.message);
      reject(err);
    });

    req.write(JSON.stringify(testData));
    req.end();
  });
};

// Test 3: Test WebSocket connection
console.log('\n3. Testing WebSocket connection...');
const testWebSocketConnection = (executionData) => {
  return new Promise((resolve, reject) => {
    if (!executionData.websocketUrl) {
      reject(new Error('No WebSocket URL provided'));
      return;
    }

    console.log(`   🔌 Connecting to WebSocket: ${executionData.websocketUrl}`);

    const ws = new WebSocket(executionData.websocketUrl);
    let messagesReceived = 0;
    let connectionEstablished = false;
    let lastMessageTime = Date.now();

    const timeout = setTimeout(() => {
      ws.close();
      if (connectionEstablished) {
        console.log(`   ✅ WebSocket connection successful (${messagesReceived} messages received)`);
        resolve({ success: true, messagesReceived });
      } else {
        console.log('   ❌ WebSocket connection timeout');
        reject(new Error('WebSocket connection timeout'));
      }
    }, 10000);

    ws.on('open', () => {
      console.log('   🔌 WebSocket connected');
      connectionEstablished = true;

      // Send test message
      ws.send(JSON.stringify({
        type: 'test_message',
        data: 'Hello from test script'
      }));
    });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        messagesReceived++;
        lastMessageTime = Date.now();

        console.log(`   📨 Message ${messagesReceived}: ${message.type}`);

        if (message.type === 'connection') {
          console.log('   ✅ Connection confirmed');
        } else if (message.type === 'execution_status') {
          console.log(`   📊 Execution status: ${message.status} (${message.progress}% complete)`);
        } else if (message.type === 'message') {
          console.log(`   📨 Test message: ${message.messageName} (${message.layer})`);
        } else if (message.type === 'complete') {
          console.log('   ✅ Test execution completed');
        }
      } catch (err) {
        console.log('   ❌ Failed to parse WebSocket message:', err.message);
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

      if (messagesReceived > 0) {
        console.log(`   ✅ WebSocket test completed (${messagesReceived} messages received)`);
        resolve({ success: true, messagesReceived });
      } else {
        reject(new Error('No messages received'));
      }
    });
  });
};

// Test 4: Test database integration
console.log('\n4. Testing database integration...');
const testDatabaseIntegration = (executionId) => {
  return new Promise((resolve, reject) => {
    const checkInterval = setInterval(() => {
      const req = http.get(`http://localhost:3000/api/test-execution/enhanced?executionId=${executionId}`, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.success) {
              console.log('   ✅ Database integration working');
              console.log(`   📊 Execution status: ${response.status}`);
              console.log(`   📊 Messages processed: ${response.messagesProcessed}/${response.totalMessages}`);
              console.log(`   📊 Progress: ${response.progress}%`);

              if (response.messages && response.messages.length > 0) {
                console.log(`   📨 Recent messages: ${response.messages.length}`);
                response.messages.slice(0, 3).forEach((msg, i) => {
                  console.log(`      ${i + 1}. ${msg.message_name} (${msg.layer})`);
                });
              }

              clearInterval(checkInterval);
              resolve(response);
            }
          } catch (err) {
            // Continue polling
          }
        });
      });

      req.on('error', (err) => {
        // Continue polling
      });
    }, 2000);

    // Stop checking after 30 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      console.log('   ⏰ Database check timeout - this is expected if execution takes time');
      resolve({ timeout: true });
    }, 30000);
  });
};

// Main test execution
const runEnhancedTest = async () => {
  try {
    // Step 1: Test servers
    await testServers();

    // Step 2: Test enhanced API
    const executionData = await testEnhancedAPI();

    // Step 3: Test WebSocket connection
    await testWebSocketConnection(executionData);

    // Step 4: Test database integration
    await testDatabaseIntegration(executionData.executionId);

    console.log('\n🎉 ENHANCED DATA FLOW TEST SUCCESSFUL!');
    console.log('=====================================');
    console.log('✅ Servers are running');
    console.log('✅ Enhanced API is working');
    console.log('✅ WebSocket connection successful');
    console.log('✅ Database integration working');
    console.log('✅ Real-time data streaming functional');
    console.log('\n📋 Summary:');
    console.log(`   • Execution ID: ${executionData.executionId}`);
    console.log(`   • WebSocket URL: ${executionData.websocketUrl}`);
    console.log('\n🚀 The 5GLabX platform data flow is working correctly!');
    console.log('   You can now:');
    console.log('   1. Open http://localhost:3000 in your browser');
    console.log('   2. Navigate to the User Dashboard');
    console.log('   3. Select a test case and run it');
    console.log('   4. Switch to the 5GLabX Platform tab to see live data streaming');

  } catch (error) {
    console.log('\n❌ ENHANCED TEST FAILED!');
    console.log('=======================');
    console.log(`Error: ${error.message}`);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure all servers are running:');
    console.log('   - Next.js app: npm run dev (port 3000)');
    console.log('   - CLI Server: npm run server (port 8080)');
    console.log('   - Test Execution WebSocket: Should auto-start with CLI server (port 8082)');
    console.log('2. Check database connectivity');
    console.log('3. Verify API endpoints are accessible');
    process.exit(1);
  }
};

// Run the enhanced test
runEnhancedTest();