// Test Event System - Run this in browser console
console.log('🧪 Testing 5GLabX Event System');
console.log('==============================');

// Test data
const testData = {
  executionId: `exec_${Date.now()}`,
  testCaseId: 'tc-001',
  testCaseData: {
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
        layer: 'RLC',
        messageType: 'RLC_PDU',
        messageName: 'RLC PDU',
        direction: 'UL',
        messagePayload: { pduType: 'AM', sequenceNumber: 1 }
      },
      {
        id: 'msg-004',
        timestampMs: Date.now() + 3000,
        layer: 'RRC',
        messageType: 'RRC_SETUP_REQUEST',
        messageName: 'RRC Setup Request',
        direction: 'UL',
        messagePayload: { ueId: 12345, establishmentCause: 'mo-Data' }
      },
      {
        id: 'msg-005',
        timestampMs: Date.now() + 4000,
        layer: 'NAS',
        messageType: 'REGISTRATION_REQUEST',
        messageName: 'Registration Request',
        direction: 'UL',
        messagePayload: { imsi: '123456789012345', securityCapabilities: {} }
      }
    ]
  },
  logs: [],
  timestamp: new Date().toISOString(),
  status: 'running'
};

// Function to test event dispatch
function testEventDispatch() {
  console.log('📡 Testing 5GLABX_TEST_EXECUTION event dispatch...');
  
  // Add temporary listener to verify event is received
  const tempListener = (event) => {
    console.log('✅ Event received by temporary listener:', event.detail);
    console.log('📊 Event type:', event.type);
    console.log('📊 Event detail keys:', Object.keys(event.detail || {}));
  };
  
  window.addEventListener('5GLABX_TEST_EXECUTION', tempListener);
  
  // Dispatch the event
  const event = new CustomEvent('5GLABX_TEST_EXECUTION', {
    detail: testData
  });
  
  window.dispatchEvent(event);
  console.log('📡 Event dispatched!');
  
  // Remove temporary listener after 2 seconds
  setTimeout(() => {
    window.removeEventListener('5GLABX_TEST_EXECUTION', tempListener);
    console.log('🧹 Temporary listener removed');
  }, 2000);
}

// Function to test layer-specific events
function testLayerEvents() {
  console.log('📡 Testing layer-specific events...');
  
  const layers = ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS'];
  
  layers.forEach((layer, index) => {
    setTimeout(() => {
      const layerEvent = new CustomEvent(`${layer.toLowerCase()}layerupdate`, {
        detail: {
          layer: layer,
          messageType: `${layer}_MESSAGE`,
          message: `${layer} Layer Update`,
          direction: 'UL',
          testCaseId: 'tc-001',
          executionId: testData.executionId
        }
      });
      
      window.dispatchEvent(layerEvent);
      console.log(`✅ Dispatched ${layer} layer update event`);
    }, index * 500);
  });
}

// Function to run full test
function runFullTest() {
  console.log('🚀 Running full event system test...');
  
  // Test main event
  testEventDispatch();
  
  // Wait a moment, then test layer events
  setTimeout(() => {
    testLayerEvents();
  }, 1000);
  
  console.log('🎉 Full test completed!');
  console.log('🔍 Check the 5GLabX views for data display');
  console.log('📊 Look for console logs showing event reception');
}

// Export functions
window.testEventDispatch = testEventDispatch;
window.testLayerEvents = testLayerEvents;
window.runFullTest = runFullTest;

console.log('✅ Test script loaded!');
console.log('💡 Run: runFullTest() to test all events');
console.log('💡 Run: testEventDispatch() to test main event only');
console.log('💡 Run: testLayerEvents() to test layer events only');
console.log('🚀 Auto-running full test in 2 seconds...');

// Auto-run after 2 seconds
setTimeout(() => {
  runFullTest();
}, 2000);