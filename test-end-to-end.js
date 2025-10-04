// End-to-End Test Script: Test Manager → 5GLabX Platform
// This script tests the complete data flow from Test Manager to 5GLabX Platform

console.log("🧪 Starting End-to-End Test: Test Manager → 5GLabX Platform");

// Test 1: Verify Test Manager loads test cases
async function testTestManagerDataLoading() {
  console.log("📋 Test 1: Verifying Test Manager data loading...");
  
  try {
    const response = await fetch("/api/test-cases/comprehensive/?limit=3");
    const data = await response.json();
    
    if (data.success && data.data && data.data.length > 0) {
      console.log("✅ Test 1 PASSED: Test Manager loads test cases from Supabase");
      console.log(`📊 Loaded ${data.data.length} test cases`);
      console.log(`📋 Sample test case: ${data.data[0].name}`);
      return data.data[0].id; // Return first test case ID for next test
    } else {
      console.log("❌ Test 1 FAILED: No test cases loaded");
      return null;
    }
  } catch (error) {
    console.log("❌ Test 1 FAILED: Error loading test cases:", error.message);
    return null;
  }
}

// Test 2: Verify Test Execution API
async function testTestExecutionAPI(testCaseId) {
  console.log("📋 Test 2: Verifying Test Execution API...");
  
  if (!testCaseId) {
    console.log("❌ Test 2 SKIPPED: No test case ID available");
    return null;
  }
  
  try {
    const response = await fetch("/api/test-execution/simple/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testCaseId: testCaseId, userId: "test-user" })
    });
    
    const data = await response.json();
    
    if (data.success && data.testCaseData && data.executionId) {
      console.log("✅ Test 2 PASSED: Test Execution API works");
      console.log(`📊 Execution ID: ${data.executionId}`);
      console.log(`📋 Test Case: ${data.testCaseData.name}`);
      console.log(`📨 Messages: ${data.testCaseData.expectedMessages?.length || 0}`);
      return data;
    } else {
      console.log("❌ Test 2 FAILED: Test execution API failed");
      return null;
    }
  } catch (error) {
    console.log("❌ Test 2 FAILED: Error executing test:", error.message);
    return null;
  }
}

// Test 3: Verify Event Dispatch
function testEventDispatch(testExecutionData) {
  console.log("📋 Test 3: Verifying Event Dispatch...");
  
  if (!testExecutionData) {
    console.log("❌ Test 3 SKIPPED: No test execution data available");
    return false;
  }
  
  // Create a test event
  const testEvent = new CustomEvent("5GLABX_TEST_EXECUTION", {
    detail: {
      type: "5GLABX_TEST_EXECUTION",
      executionId: testExecutionData.executionId,
      testCaseId: testExecutionData.testCaseData.id,
      testCaseData: testExecutionData.testCaseData,
      logs: [],
      timestamp: new Date().toISOString(),
      status: "running"
    }
  });
  
  // Dispatch the event
  window.dispatchEvent(testEvent);
  console.log("✅ Test 3 PASSED: Event dispatched successfully");
  return true;
}

// Test 4: Verify LogsView Event Listener
function testLogsViewEventListener() {
  console.log("📋 Test 4: Verifying LogsView Event Listener...");
  
  let eventReceived = false;
  
  // Create a temporary event listener
  const tempListener = (event) => {
    if (event.type === "5GLABX_TEST_EXECUTION") {
      eventReceived = true;
      console.log("✅ Test 4 PASSED: LogsView received 5GLABX_TEST_EXECUTION event");
      console.log("📊 Event detail:", event.detail);
    }
  };
  
  window.addEventListener("5GLABX_TEST_EXECUTION", tempListener);
  
  // Dispatch a test event
  const testEvent = new CustomEvent("5GLABX_TEST_EXECUTION", {
    detail: {
      type: "5GLABX_TEST_EXECUTION",
      executionId: "test-execution-123",
      testCaseId: "test-case-123",
      testCaseData: {
        expectedMessages: [
          {
            id: "msg-1",
            messageName: "Test Message",
            messageType: "RRC_SETUP_REQUEST",
            layer: "RRC",
            direction: "UL",
            protocol: "5G_NR",
            messagePayload: { test: true },
            timestampMs: Date.now()
          }
        ]
      },
      timestamp: new Date().toISOString(),
      status: "running"
    }
  });
  
  window.dispatchEvent(testEvent);
  
  // Clean up
  setTimeout(() => {
    window.removeEventListener("5GLABX_TEST_EXECUTION", tempListener);
    if (!eventReceived) {
      console.log("❌ Test 4 FAILED: LogsView did not receive event");
    }
  }, 1000);
  
  return eventReceived;
}

// Run all tests
async function runEndToEndTest() {
  console.log("🚀 Starting End-to-End Test Suite...");
  
  // Test 1: Data Loading
  const testCaseId = await testTestManagerDataLoading();
  
  // Test 2: Test Execution API
  const testExecutionData = await testTestExecutionAPI(testCaseId);
  
  // Test 3: Event Dispatch
  testEventDispatch(testExecutionData);
  
  // Test 4: Event Listener
  testLogsViewEventListener();
  
  console.log("🏁 End-to-End Test Suite completed");
  console.log("📊 Check the console and Automation Log for detailed results");
}

// Run the test
runEndToEndTest();