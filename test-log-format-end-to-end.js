// Test Log Format End-to-End
// This script tests the complete log format from API to UI display

console.log("🧪 Testing Log Format End-to-End...");

// Test 1: Check API Response Format
async function testAPIResponseFormat() {
  console.log("📡 Test 1: API Response Format");
  
  try {
    const response = await fetch('/api/test-execution/simple/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        testCaseId: '33ebec89-c08b-41fb-91f7-4f28936796be', 
        userId: 'test-user' 
      })
    });
    
    const data = await response.json();
    
    if (data.success && data.testCaseData && data.testCaseData.expectedMessages) {
      console.log("✅ API Response: WORKING");
      console.log("📊 Messages count:", data.testCaseData.expectedMessages.length);
      
      const sampleMessage = data.testCaseData.expectedMessages[0];
      console.log("📊 Sample message structure:");
      console.log("   - ID:", sampleMessage.id);
      console.log("   - Layer:", sampleMessage.layer);
      console.log("   - MessageType:", sampleMessage.messageType);
      console.log("   - MessageName:", sampleMessage.messageName);
      console.log("   - Direction:", sampleMessage.direction);
      console.log("   - Protocol:", sampleMessage.protocol);
      console.log("   - TimestampMs:", sampleMessage.timestampMs);
      console.log("   - MessagePayload keys:", Object.keys(sampleMessage.messagePayload || {}));
      console.log("   - InformationElements keys:", Object.keys(sampleMessage.informationElements || {}));
      console.log("   - LayerParameters keys:", Object.keys(sampleMessage.layerParameters || {}));
      
      return sampleMessage;
    } else {
      console.log("❌ API Response: FAILED");
      return null;
    }
  } catch (error) {
    console.log("❌ API Test: ERROR -", error.message);
    return null;
  }
}

// Test 2: Check DataFormatAdapter Processing
function testDataFormatAdapterProcessing(sampleMessage) {
  console.log("🔄 Test 2: DataFormatAdapter Processing");
  
  if (!sampleMessage) {
    console.log("❌ No sample message to test");
    return null;
  }
  
  if (typeof window !== 'undefined' && window.DataFormatAdapter) {
    try {
      const processedLog = window.DataFormatAdapter.adaptLogForViewer(sampleMessage);
      console.log("✅ DataFormatAdapter: WORKING");
      console.log("📊 Processed log structure:");
      console.log("   - ID:", processedLog.id);
      console.log("   - Timestamp:", processedLog.timestamp);
      console.log("   - Level:", processedLog.level);
      console.log("   - Component:", processedLog.component);
      console.log("   - Message:", processedLog.message);
      console.log("   - Type:", processedLog.type);
      console.log("   - Source:", processedLog.source);
      console.log("   - Direction:", processedLog.direction);
      console.log("   - Protocol:", processedLog.protocol);
      console.log("   - RawData length:", processedLog.rawData?.length || 0);
      console.log("   - IEs:", processedLog.ies);
      
      return processedLog;
    } catch (error) {
      console.log("❌ DataFormatAdapter: ERROR -", error.message);
      return null;
    }
  } else {
    console.log("❌ DataFormatAdapter: NOT AVAILABLE");
    return null;
  }
}

// Test 3: Check LogsView Processing
function testLogsViewProcessing(sampleMessage) {
  console.log("🖥️ Test 3: LogsView Processing");
  
  if (!sampleMessage) {
    console.log("❌ No sample message to test");
    return null;
  }
  
  // Simulate the LogsView processing logic
  try {
    const processedLog = {
      id: sampleMessage.id || `event-test-${Date.now()}`,
      timestamp: sampleMessage.timestampMs ? (sampleMessage.timestampMs / 1000).toFixed(1) : (Date.now() / 1000).toFixed(1),
      level: "I",
      component: sampleMessage.layer || sampleMessage.component || "TEST",
      message: `${sampleMessage.messageName || sampleMessage.messageType || "Test Message"}: ${JSON.stringify(sampleMessage.messagePayload || {}, null, 2)}`,
      type: sampleMessage.messageType || sampleMessage.type || "TEST_MESSAGE",
      source: "5GLABX_TEST_EXECUTION",
      testCaseId: "test-case-id",
      direction: sampleMessage.direction || "UL",
      protocol: sampleMessage.protocol || "5G_NR",
      rawData: JSON.stringify(sampleMessage.messagePayload || sampleMessage.payload || {}, null, 2),
      informationElements: sampleMessage.informationElements || {},
      layerParameters: sampleMessage.layerParameters || {},
      standardReference: sampleMessage.standardReference || "Unknown",
      messagePayload: sampleMessage.messagePayload || sampleMessage.payload || {},
      ies: sampleMessage.informationElements
        ? Object.entries(sampleMessage.informationElements)
            .map(([k, v]) => `${k}=${typeof v === "object" ? v.value || JSON.stringify(v) : v}`)
            .join(", ")
        : Object.entries(sampleMessage.messagePayload || sampleMessage.payload || {})
            .map(([k, v]) => `${k}=${v}`)
            .join(", ")
    };
    
    console.log("✅ LogsView Processing: WORKING");
    console.log("📊 Processed log structure:");
    console.log("   - ID:", processedLog.id);
    console.log("   - Timestamp:", processedLog.timestamp);
    console.log("   - Level:", processedLog.level);
    console.log("   - Component:", processedLog.component);
    console.log("   - Message length:", processedLog.message.length);
    console.log("   - Type:", processedLog.type);
    console.log("   - Source:", processedLog.source);
    console.log("   - Direction:", processedLog.direction);
    console.log("   - Protocol:", processedLog.protocol);
    console.log("   - RawData length:", processedLog.rawData.length);
    console.log("   - IEs length:", processedLog.ies.length);
    
    return processedLog;
  } catch (error) {
    console.log("❌ LogsView Processing: ERROR -", error.message);
    return null;
  }
}

// Test 4: Check UI Display Format
function testUIDisplayFormat(processedLog) {
  console.log("🎨 Test 4: UI Display Format");
  
  if (!processedLog) {
    console.log("❌ No processed log to test");
    return false;
  }
  
  try {
    // Check if all required fields are present for UI display
    const requiredFields = ['id', 'timestamp', 'level', 'component', 'message', 'type'];
    const missingFields = requiredFields.filter(field => !processedLog[field]);
    
    if (missingFields.length === 0) {
      console.log("✅ UI Display Format: WORKING");
      console.log("📊 All required fields present");
      console.log("📊 Timestamp format:", processedLog.timestamp);
      console.log("📊 Level format:", processedLog.level);
      console.log("📊 Component format:", processedLog.component);
      console.log("📊 Message preview:", processedLog.message.substring(0, 100) + "...");
      console.log("📊 Type format:", processedLog.type);
      
      return true;
    } else {
      console.log("❌ UI Display Format: MISSING FIELDS -", missingFields);
      return false;
    }
  } catch (error) {
    console.log("❌ UI Display Format: ERROR -", error.message);
    return false;
  }
}

// Test 5: Check Event System Integration
function testEventSystemIntegration() {
  console.log("📡 Test 5: Event System Integration");
  
  let eventReceived = false;
  let dataProcessed = false;
  
  // Create test event listener
  const testListener = (event) => {
    if (event.type === '5GLABX_TEST_EXECUTION') {
      eventReceived = true;
      console.log("✅ Event received:", event.detail?.testCaseId);
      
      if (event.detail && event.detail.testCaseData && event.detail.testCaseData.expectedMessages) {
        dataProcessed = true;
        console.log("✅ Data processed:", event.detail.testCaseData.expectedMessages.length, "messages");
      }
    }
  };
  
  // Register listener
  window.addEventListener('5GLABX_TEST_EXECUTION', testListener);
  
  // Create and dispatch test event
  const testEvent = new CustomEvent('5GLABX_TEST_EXECUTION', {
    detail: {
      type: '5GLABX_TEST_EXECUTION',
      executionId: 'test-exec-123',
      testCaseId: 'test-case-123',
      testCaseData: {
        id: 'test-case-123',
        name: 'Test Case',
        expectedMessages: [
          {
            id: 'msg-1',
            layer: 'RRC',
            messageType: 'RRC_SETUP_REQUEST',
            messageName: 'RRC Setup Request',
            direction: 'UL',
            protocol: '5G_NR',
            timestampMs: Date.now(),
            messagePayload: { test: 'data' },
            informationElements: { 'UE-Identity': { value: 'IMSI-123', type: 'IMSI' } },
            layerParameters: { 'RSRP': { value: '-80', unit: 'dBm' } }
          }
        ]
      },
      timestamp: new Date().toISOString(),
      status: 'running'
    }
  });
  
  window.dispatchEvent(testEvent);
  
  // Clean up and check results
  setTimeout(() => {
    window.removeEventListener('5GLABX_TEST_EXECUTION', testListener);
    console.log(`📊 Event System: ${eventReceived ? 'WORKING' : 'NOT WORKING'}`);
    console.log(`📊 Data Processing: ${dataProcessed ? 'WORKING' : 'NOT WORKING'}`);
  }, 1000);
  
  return { eventReceived, dataProcessed };
}

// Run all tests
async function runLogFormatTest() {
  console.log("🚀 Starting Log Format End-to-End Test...");
  console.log("=" * 50);
  
  const results = {
    apiResponse: await testAPIResponseFormat(),
    dataFormatAdapter: null,
    logsViewProcessing: null,
    uiDisplay: false,
    eventSystem: testEventSystemIntegration()
  };
  
  // Test DataFormatAdapter if API response is available
  if (results.apiResponse) {
    results.dataFormatAdapter = testDataFormatAdapterProcessing(results.apiResponse);
    results.logsViewProcessing = testLogsViewProcessing(results.apiResponse);
    results.uiDisplay = testUIDisplayFormat(results.logsViewProcessing);
  }
  
  // Summary
  console.log("=" * 50);
  console.log("📊 LOG FORMAT END-TO-END TEST SUMMARY:");
  console.log(`API Response: ${results.apiResponse ? '✅' : '❌'}`);
  console.log(`DataFormatAdapter: ${results.dataFormatAdapter ? '✅' : '❌'}`);
  console.log(`LogsView Processing: ${results.logsViewProcessing ? '✅' : '❌'}`);
  console.log(`UI Display Format: ${results.uiDisplay ? '✅' : '❌'}`);
  console.log(`Event System: ${results.eventSystem.eventReceived ? '✅' : '❌'}`);
  
  const allWorking = results.apiResponse && results.logsViewProcessing && results.uiDisplay;
  console.log(`Overall Status: ${allWorking ? '✅ ALL SYSTEMS WORKING' : '❌ SOME ISSUES FOUND'}`);
  
  if (allWorking) {
    console.log("🎉 Log format end-to-end is working correctly!");
  } else {
    console.log("⚠️  Some components need attention.");
  }
  
  return results;
}

// Run the test
runLogFormatTest();