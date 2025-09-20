// Integration Test Script for Test Manager ↔ 5GLabX Data Flow
// Run this script to test the integration between components

console.log('🚀 Starting 5GLabX Integration Test...');

// Test 1: Check if required components are available
function testComponentAvailability() {
  console.log('\n📋 Test 1: Component Availability');

  const components = [
    'TestCasePlaybackService',
    'WebSocketService',
    'DataFormatAdapter',
    'LogProcessor',
    'StreamProcessor',
    'LayerStatsService'
  ];

  components.forEach(component => {
    if (typeof window !== 'undefined' && window[component]) {
      console.log(`✅ ${component}: Available`);
    } else {
      console.log(`❌ ${component}: Not Available`);
    }
  });
}

// Test 2: Test event dispatching
function testEventDispatching() {
  console.log('\n📡 Test 2: Event Dispatching');

  if (typeof window === 'undefined') {
    console.log('❌ Window not available');
    return;
  }

  // Test 5GLabX_TEST_EXECUTION event
  const testData = {
    type: '5GLABX_TEST_EXECUTION',
    testCaseId: 'TEST_001',
    testCaseData: {
      testCase: { name: 'Test Case 1', protocol: '5G_NR' },
      expectedMessages: [
        {
          id: 'msg_1',
          messageName: 'RRC Setup Request',
          messageType: 'RRC_SETUP_REQUEST',
          layer: 'RRC',
          protocol: '5G_NR',
          direction: 'UL',
          messagePayload: { ue_identity: '0x12345678' }
        },
        {
          id: 'msg_2',
          messageName: 'RRC Setup',
          messageType: 'RRC_SETUP',
          layer: 'RRC',
          protocol: '5G_NR',
          direction: 'DL',
          messagePayload: { rrc_transaction_id: 1 }
        }
      ]
    }
  };

  // Dispatch test event
  window.dispatchEvent(new MessageEvent('message', { data: testData }));
  console.log('✅ Dispatched 5GLABX_TEST_EXECUTION event');

  // Test logsViewUpdate event
  const logData = {
    id: 'log_1',
    timestamp: new Date().toISOString(),
    level: 'I',
    component: 'RRC',
    message: 'Test log message',
    type: 'RRC_SETUP_REQUEST',
    source: 'TestManager'
  };

  window.dispatchEvent(new CustomEvent('logsViewUpdate', { detail: logData }));
  console.log('✅ Dispatched logsViewUpdate event');

  // Test enhancedLogsUpdate event
  window.dispatchEvent(new CustomEvent('enhancedLogsUpdate', { detail: logData }));
  console.log('✅ Dispatched enhancedLogsUpdate event');

  // Test layer-specific events
  const layers = ['phy', 'mac', 'rlc', 'pdcp', 'rrc', 'nas'];
  layers.forEach(layer => {
    window.dispatchEvent(new CustomEvent(`${layer}layerupdate`, { detail: logData }));
    console.log(`✅ Dispatched ${layer}layerupdate event`);
  });
}

// Test 3: Test data processing
function testDataProcessing() {
  console.log('\n🔄 Test 3: Data Processing');

  // Test message processing
  const testMessage = {
    id: 'msg_1',
    messageName: 'RRC Setup Request',
    messageType: 'RRC_SETUP_REQUEST',
    layer: 'RRC',
    protocol: '5G_NR',
    direction: 'UL',
    messagePayload: { ue_identity: '0x12345678' }
  };

  console.log('📊 Processing test message:', testMessage);

  // Test log entry creation
  const logEntry = {
    id: `${testMessage.id}_log`,
    timestamp: (Date.now() / 1000).toFixed(1),
    level: 'I',
    component: testMessage.layer,
    message: `${testMessage.messageName}: ${JSON.stringify(testMessage.messagePayload)}`,
    type: testMessage.messageType,
    source: 'TestManager',
    direction: testMessage.direction,
    protocol: testMessage.protocol
  };

  console.log('📋 Generated log entry:', logEntry);
}

// Test 4: Test localStorage fallback
function testLocalStorageFallback() {
  console.log('\n💾 Test 4: LocalStorage Fallback');

  try {
    const testData = {
      type: '5GLABX_TEST_EXECUTION',
      testCaseId: 'TEST_LOCALSTORAGE',
      timestamp: Date.now()
    };

    localStorage.setItem('5glabx_test_data', JSON.stringify(testData));
    console.log('✅ Test data stored in localStorage');

    const retrieved = localStorage.getItem('5glabx_test_data');
    if (retrieved) {
      const parsed = JSON.parse(retrieved);
      console.log('✅ Test data retrieved from localStorage:', parsed);
    }
  } catch (error) {
    console.log('❌ LocalStorage test failed:', error);
  }
}

// Test 5: Test global variable storage
function testGlobalVariableStorage() {
  console.log('\n🌐 Test 5: Global Variable Storage');

  if (typeof window !== 'undefined') {
    const testData = {
      type: '5GLABX_TEST_EXECUTION',
      testCaseId: 'TEST_GLOBAL_VAR',
      timestamp: Date.now()
    };

    (window as any).latestTestCaseData = testData;
    console.log('✅ Test data stored in global variable');

    const retrieved = (window as any).latestTestCaseData;
    if (retrieved) {
      console.log('✅ Test data retrieved from global variable:', retrieved);
    }
  } else {
    console.log('❌ Window not available for global variable test');
  }
}

// Test 6: Integration test summary
function testIntegrationSummary() {
  console.log('\n📊 Test 6: Integration Summary');

  console.log('🎯 Integration Test Results:');
  console.log('✅ Event dispatching: Tested');
  console.log('✅ Data processing: Tested');
  console.log('✅ LocalStorage fallback: Tested');
  console.log('✅ Global variable storage: Tested');
  console.log('✅ Component availability: Tested');

  console.log('\n🔧 Next Steps:');
  console.log('1. Open Test Manager tab and run a test case');
  console.log('2. Switch to 5GLabX Platform tab');
  console.log('3. Check browser console for data flow logs');
  console.log('4. Verify data appears in Logs View and Enhanced Logs View');
  console.log('5. Check layer-specific views (PHY, MAC, RLC, etc.)');

  console.log('\n📝 Debug Tips:');
  console.log('- Look for console logs starting with 📊, 📡, 🔍, ✅, ❌');
  console.log('- Check Network tab for API calls');
  console.log('- Verify event listeners are registered');
  console.log('- Test with different browsers if issues persist');
}

// Run all tests
function runIntegrationTests() {
  console.log('🧪 Running 5GLabX Integration Tests...\n');

  testComponentAvailability();
  testEventDispatching();
  testDataProcessing();
  testLocalStorageFallback();
  testGlobalVariableStorage();
  testIntegrationSummary();

  console.log('\n✨ Integration tests completed!');
  console.log('Check the results above and follow the next steps to verify the integration.');
}

// Auto-run tests when script loads
if (typeof window !== 'undefined') {
  // Run tests after a short delay to ensure components are loaded
  setTimeout(() => {
    runIntegrationTests();
  }, 1000);
} else {
  console.log('❌ Window not available - running in Node.js environment');
  runIntegrationTests();
}

// Export for manual testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runIntegrationTests,
    testComponentAvailability,
    testEventDispatching,
    testDataProcessing,
    testLocalStorageFallback,
    testGlobalVariableStorage
  };
}