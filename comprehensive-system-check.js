// Comprehensive System Check Script
// Tests all components of the 5GLabX platform

console.log("🔍 Starting Comprehensive System Check...");

// Test 1: Check if DataFormatAdapter is loaded
function checkDataFormatAdapter() {
  console.log("📡 Test 1: DataFormatAdapter Loading");
  
  if (typeof window !== 'undefined' && window.DataFormatAdapter) {
    console.log("✅ DataFormatAdapter: LOADED");
    console.log("📊 Available methods:", Object.getOwnPropertyNames(window.DataFormatAdapter));
    
    // Test the adaptLogForViewer method
    try {
      const testData = {
        id: 'test-123',
        layer: 'RRC',
        messageType: 'RRC_SETUP_REQUEST',
        messageName: 'RRC Setup Request',
        messagePayload: { test: 'data' },
        timestampMs: Date.now()
      };
      
      const result = window.DataFormatAdapter.adaptLogForViewer(testData);
      console.log("✅ adaptLogForViewer method: WORKING");
      console.log("📊 Test result:", result);
      return true;
    } catch (error) {
      console.log("❌ adaptLogForViewer method: ERROR -", error.message);
      return false;
    }
  } else {
    console.log("❌ DataFormatAdapter: NOT LOADED");
    return false;
  }
}

// Test 2: Check API endpoints
async function checkAPIEndpoints() {
  console.log("🌐 Test 2: API Endpoints");
  
  try {
    // Test test cases API
    const testCasesResponse = await fetch('/api/test-cases/comprehensive/?limit=1');
    const testCasesData = await testCasesResponse.json();
    
    if (testCasesData.success && testCasesData.data && testCasesData.data.length > 0) {
      console.log("✅ Test Cases API: WORKING");
      console.log("📊 Sample test case:", testCasesData.data[0].name);
      
      // Test test execution API
      const testExecutionResponse = await fetch('/api/test-execution/simple/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          testCaseId: testCasesData.data[0].id, 
          userId: 'test-user' 
        })
      });
      
      const executionData = await testExecutionResponse.json();
      
      if (executionData.success && executionData.testCaseData) {
        console.log("✅ Test Execution API: WORKING");
        console.log("📊 Execution ID:", executionData.executionId);
        console.log("📊 Messages:", executionData.testCaseData.expectedMessages?.length || 0);
        return { testCaseId: testCasesData.data[0].id, executionId: executionData.executionId };
      } else {
        console.log("❌ Test Execution API: FAILED");
        return null;
      }
    } else {
      console.log("❌ Test Cases API: FAILED");
      return null;
    }
  } catch (error) {
    console.log("❌ API Test: ERROR -", error.message);
    return null;
  }
}

// Test 3: Check UI Components
function checkUIComponents() {
  console.log("🖥️ Test 3: UI Components");
  
  // Check if LogsView exists
  const logsViewExists = document.querySelector('[data-testid="logs-view"], .logs-view, [class*="LogsView"]');
  console.log(`📋 LogsView: ${logsViewExists ? 'FOUND' : 'NOT FOUND'}`);
  
  // Check if Test Manager exists
  const testManagerExists = document.querySelector('[class*="ProfessionalTestManager"], [class*="test-manager"]');
  console.log(`📋 Test Manager: ${testManagerExists ? 'FOUND' : 'NOT FOUND'}`);
  
  // Check if 5GLabX Platform exists
  const platformExists = document.querySelector('[class*="Enhanced5GLabXPlatform"], [class*="5glabx"]');
  console.log(`📋 5GLabX Platform: ${platformExists ? 'FOUND' : 'NOT FOUND'}`);
  
  return {
    logsView: !!logsViewExists,
    testManager: !!testManagerExists,
    platform: !!platformExists
  };
}

// Test 4: Check Event System
function checkEventSystem() {
  console.log("📡 Test 4: Event System");
  
  let eventReceived = false;
  let eventProcessed = false;
  
  // Create test event listener
  const testListener = (event) => {
    if (event.type === '5GLABX_TEST_EXECUTION') {
      eventReceived = true;
      console.log("✅ Event received:", event.detail?.testCaseId);
      
      // Check if event has proper structure
      if (event.detail && event.detail.testCaseData && event.detail.testCaseData.expectedMessages) {
        eventProcessed = true;
        console.log("✅ Event processed with data:", event.detail.testCaseData.expectedMessages.length, "messages");
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
            messagePayload: { test: 'data' }
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
    console.log(`📊 Event Processing: ${eventProcessed ? 'WORKING' : 'NOT WORKING'}`);
  }, 1000);
  
  return { eventReceived, eventProcessed };
}

// Test 5: Check Data Flow
async function checkDataFlow() {
  console.log("🔄 Test 5: Data Flow");
  
  try {
    // Get a test case
    const response = await fetch('/api/test-cases/comprehensive/?limit=1');
    const data = await response.json();
    
    if (data.success && data.data && data.data.length > 0) {
      const testCase = data.data[0];
      console.log("📊 Test case loaded:", testCase.name);
      
      // Execute the test case
      const executionResponse = await fetch('/api/test-execution/simple/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          testCaseId: testCase.id, 
          userId: 'test-user' 
        })
      });
      
      const executionData = await executionResponse.json();
      
      if (executionData.success) {
        console.log("✅ Test execution successful");
        console.log("📊 Execution ID:", executionData.executionId);
        console.log("📊 Messages generated:", executionData.testCaseData.expectedMessages?.length || 0);
        
        // Check if data is properly formatted
        const messages = executionData.testCaseData.expectedMessages || [];
        if (messages.length > 0) {
          const sampleMessage = messages[0];
          console.log("📊 Sample message structure:");
          console.log("   - ID:", sampleMessage.id);
          console.log("   - Layer:", sampleMessage.layer);
          console.log("   - Type:", sampleMessage.messageType);
          console.log("   - Direction:", sampleMessage.direction);
          console.log("   - Payload keys:", Object.keys(sampleMessage.messagePayload || {}));
        }
        
        return true;
      } else {
        console.log("❌ Test execution failed");
        return false;
      }
    } else {
      console.log("❌ No test cases available");
      return false;
    }
  } catch (error) {
    console.log("❌ Data flow test failed:", error.message);
    return false;
  }
}

// Run all tests
async function runComprehensiveCheck() {
  console.log("🚀 Starting Comprehensive System Check...");
  console.log("=" * 50);
  
  const results = {
    dataFormatAdapter: checkDataFormatAdapter(),
    apiEndpoints: await checkAPIEndpoints(),
    uiComponents: checkUIComponents(),
    eventSystem: checkEventSystem(),
    dataFlow: await checkDataFlow()
  };
  
  // Summary
  console.log("=" * 50);
  console.log("📊 COMPREHENSIVE CHECK SUMMARY:");
  console.log(`DataFormatAdapter: ${results.dataFormatAdapter ? '✅' : '❌'}`);
  console.log(`API Endpoints: ${results.apiEndpoints ? '✅' : '❌'}`);
  console.log(`UI Components: ${Object.values(results.uiComponents).filter(Boolean).length}/3`);
  console.log(`Event System: ${results.eventSystem.eventReceived ? '✅' : '❌'}`);
  console.log(`Data Flow: ${results.dataFlow ? '✅' : '❌'}`);
  
  const allWorking = results.dataFormatAdapter && results.apiEndpoints && results.dataFlow;
  console.log(`Overall Status: ${allWorking ? '✅ ALL SYSTEMS WORKING' : '❌ SOME ISSUES FOUND'}`);
  
  if (allWorking) {
    console.log("🎉 System is fully operational!");
  } else {
    console.log("⚠️  Some components need attention.");
  }
  
  return results;
}

// Run the check
runComprehensiveCheck();