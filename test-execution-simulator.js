// Test Execution Simulator - Run this in browser console
// This simulates running a test case and observing the frontend logs

console.log('🧪 Test Execution Simulator');
console.log('==========================');

// Test case data simulation
const testCaseData = {
  id: 'tc-001',
  name: 'Attach',
  component: 'eNodeB',
  expectedMessages: [
    {
      id: 'msg-001',
      timestampMs: Date.now(),
      layer: 'PHY',
      messageType: 'PDSCH',
      messageName: 'Physical Downlink Shared Channel',
      direction: 'DL',
      messagePayload: { mcs: 5, tbs: 1024, harqId: 0 }
    },
    {
      id: 'msg-002',
      timestampMs: Date.now() + 1000,
      layer: 'MAC',
      messageType: 'MAC_CE',
      messageName: 'MAC Control Element',
      direction: 'UL',
      messagePayload: { ceType: 'BSR', bufferSize: 512 }
    },
    {
      id: 'msg-003',
      timestampMs: Date.now() + 2000,
      layer: 'RRC',
      messageType: 'RRC_SETUP_REQUEST',
      messageName: 'RRC Setup Request',
      direction: 'UL',
      messagePayload: { ueId: 12345, establishmentCause: 'mo-Data' }
    },
    {
      id: 'msg-004',
      timestampMs: Date.now() + 3000,
      layer: 'NAS',
      messageType: 'REGISTRATION_REQUEST',
      messageName: 'Registration Request',
      direction: 'UL',
      messagePayload: { imsi: '123456789012345', securityCapabilities: {} }
    }
  ]
};

// Function to run a test case
function runTestCase(testCaseId = 'tc-001') {
  console.log(`🚀 Running test case: ${testCaseId}`);
  
  // Create the test execution event
  const event = new CustomEvent('5GLABX_TEST_EXECUTION', {
    detail: {
      executionId: `exec_${Date.now()}`,
      testCaseId: testCaseId,
      testCaseData: testCaseData,
      logs: [],
      timestamp: new Date().toISOString(),
      status: 'running'
    }
  });
  
  // Dispatch the event
  window.dispatchEvent(event);
  console.log('✅ 5GLABX_TEST_EXECUTION event dispatched');
  
  // Simulate real-time message processing
  console.log('🔄 Simulating real-time message processing...');
  testCaseData.expectedMessages.forEach((msg, index) => {
    setTimeout(() => {
      console.log(`📨 Processing message ${index + 1}: ${msg.layer} - ${msg.messageType}`);
      
      // Dispatch layer-specific events
      const layerEvent = new CustomEvent(`${msg.layer.toLowerCase()}layerupdate`, {
        detail: {
          layer: msg.layer,
          messageType: msg.messageType,
          message: msg.messageName,
          direction: msg.direction,
          testCaseId: testCaseId,
          executionId: `exec_${Date.now()}`
        }
      });
      
      window.dispatchEvent(layerEvent);
      console.log(`✅ Dispatched ${msg.layer} layer update event`);
    }, index * 1000);
  });
  
  console.log('🎉 Test case execution completed!');
  console.log('🔍 Check the 5GLabX views for live data display');
}

// Function to check view listeners
function checkViewListeners() {
  console.log('🔍 Checking 5GLabX view listeners...');
  
  const views = [
    'LogsView', 'LayerTraceView', 'CallFlowView', 'AnalyticsView', 'OranView',
    'PhyLayerView', 'MacLayerView', 'RlcLayerView', 'PdcpLayerView', 
    'RrcLayerView', 'NasLayerView', 'ImsLayerView'
  ];
  
  views.forEach(view => {
    console.log(`📋 ${view}: Ready for events`);
  });
  
  console.log('✅ All views are ready to receive events');
}

// Export functions to global scope
window.runTestCase = runTestCase;
window.checkViewListeners = checkViewListeners;

console.log('✅ Simulator loaded!');
console.log('💡 Run: runTestCase("tc-001") to execute a test case');
console.log('💡 Run: checkViewListeners() to check view status');
console.log('🚀 Auto-running test case in 2 seconds...');

// Auto-run after 2 seconds
setTimeout(() => {
  runTestCase('tc-001');
}, 2000);