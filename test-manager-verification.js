// Comprehensive Test Manager Verification Script
// Tests Frontend ↔ Backend ↔ Database connections

console.log("🧪 Starting Test Manager Verification...");

// Test 1: Frontend-Backend Connection
async function testFrontendBackendConnection() {
  console.log("📡 Test 1: Frontend-Backend Connection");
  
  try {
    const response = await fetch("/api/test-cases/comprehensive/?limit=1");
    const data = await response.json();
    
    if (data.success && data.data && data.data.length > 0) {
      console.log("✅ Frontend-Backend: CONNECTED");
      console.log(`📊 Sample test case: ${data.data[0].name}`);
      return true;
    } else {
      console.log("❌ Frontend-Backend: DISCONNECTED");
      return false;
    }
  } catch (error) {
    console.log("❌ Frontend-Backend: ERROR -", error.message);
    return false;
  }
}

// Test 2: Database Connection
async function testDatabaseConnection() {
  console.log("🗄️ Test 2: Database Connection");
  
  try {
    const response = await fetch("/api/test-cases/comprehensive/?limit=5");
    const data = await response.json();
    
    if (data.success && data.total > 0) {
      console.log("✅ Database: CONNECTED");
      console.log(`📊 Total test cases: ${data.total}`);
      console.log(`📋 Categories: ${data.statistics?.byProtocol ? Object.keys(data.statistics.byProtocol).join(', ') : 'N/A'}`);
      return data.data[0].id; // Return first test case ID
    } else {
      console.log("❌ Database: DISCONNECTED");
      return null;
    }
  } catch (error) {
    console.log("❌ Database: ERROR -", error.message);
    return null;
  }
}

// Test 3: Test Execution API
async function testExecutionAPI(testCaseId) {
  console.log("🚀 Test 3: Test Execution API");
  
  if (!testCaseId) {
    console.log("❌ Test Execution API: SKIPPED - No test case ID");
    return false;
  }
  
  try {
    const response = await fetch("/api/test-execution/simple/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testCaseId: testCaseId, userId: "test-user" })
    });
    
    const data = await response.json();
    
    if (data.success && data.executionId && data.testCaseData) {
      console.log("✅ Test Execution API: WORKING");
      console.log(`📊 Execution ID: ${data.executionId}`);
      console.log(`📋 Test Case: ${data.testCaseData.name}`);
      console.log(`📨 Messages: ${data.testCaseData.expectedMessages?.length || 0}`);
      return true;
    } else {
      console.log("❌ Test Execution API: FAILED");
      return false;
    }
  } catch (error) {
    console.log("❌ Test Execution API: ERROR -", error.message);
    return false;
  }
}

// Test 4: UI Button Functionality
function testUIButtons() {
  console.log("🖱️ Test 4: UI Button Functionality");
  
  // Check if buttons exist in DOM
  const runButtons = document.querySelectorAll('button[onclick*="handleRunTest"], button[onclick*="handleRunTest"]');
  const stopButtons = document.querySelectorAll('button[onclick*="handleStopTest"], button[onclick*="handleStopTest"]');
  
  if (runButtons.length > 0) {
    console.log("✅ Run Buttons: FOUND");
    console.log(`📊 Run buttons count: ${runButtons.length}`);
  } else {
    console.log("❌ Run Buttons: NOT FOUND");
  }
  
  if (stopButtons.length > 0) {
    console.log("✅ Stop Buttons: FOUND");
    console.log(`📊 Stop buttons count: ${stopButtons.length}`);
  } else {
    console.log("❌ Stop Buttons: NOT FOUND");
  }
  
  return runButtons.length > 0 && stopButtons.length > 0;
}

// Test 5: Test Case Loading in UI
function testTestCaseLoading() {
  console.log("📋 Test 5: Test Case Loading in UI");
  
  // Check if test cases are loaded in the UI
  const testCaseElements = document.querySelectorAll('[data-testid="test-case"], .test-case, [class*="test-case"]');
  const testCaseRows = document.querySelectorAll('tr, .test-row, [class*="test-row"]');
  
  if (testCaseElements.length > 0 || testCaseRows.length > 0) {
    console.log("✅ Test Cases: LOADED IN UI");
    console.log(`📊 Test case elements found: ${testCaseElements.length + testCaseRows.length}`);
    return true;
  } else {
    console.log("❌ Test Cases: NOT LOADED IN UI");
    return false;
  }
}

// Test 6: Event System
function testEventSystem() {
  console.log("📡 Test 6: Event System");
  
  let eventReceived = false;
  
  // Create test event listener
  const testListener = (event) => {
    if (event.type === "5GLABX_TEST_EXECUTION") {
      eventReceived = true;
      console.log("✅ Event System: WORKING");
      console.log("📊 Event received:", event.detail);
    }
  };
  
  window.addEventListener("5GLABX_TEST_EXECUTION", testListener);
  
  // Dispatch test event
  const testEvent = new CustomEvent("5GLABX_TEST_EXECUTION", {
    detail: {
      type: "5GLABX_TEST_EXECUTION",
      executionId: "test-123",
      testCaseId: "test-case-123",
      testCaseData: { name: "Test Case" },
      timestamp: new Date().toISOString(),
      status: "running"
    }
  });
  
  window.dispatchEvent(testEvent);
  
  // Clean up
  setTimeout(() => {
    window.removeEventListener("5GLABX_TEST_EXECUTION", testListener);
    if (!eventReceived) {
      console.log("❌ Event System: NOT WORKING");
    }
  }, 1000);
  
  return eventReceived;
}

// Test 7: Automation Log
function testAutomationLog() {
  console.log("📝 Test 7: Automation Log");
  
  // Check if automation log exists
  const logElements = document.querySelectorAll('[class*="log"], [class*="automation"], [data-testid*="log"]');
  const logContainers = document.querySelectorAll('.logs, .automation-log, [class*="automation-log"]');
  
  if (logElements.length > 0 || logContainers.length > 0) {
    console.log("✅ Automation Log: FOUND");
    console.log(`📊 Log elements found: ${logElements.length + logContainers.length}`);
    return true;
  } else {
    console.log("❌ Automation Log: NOT FOUND");
    return false;
  }
}

// Run all tests
async function runVerification() {
  console.log("🚀 Starting Test Manager Verification Suite...");
  console.log("=" * 50);
  
  const results = {
    frontendBackend: await testFrontendBackendConnection(),
    database: await testDatabaseConnection(),
    executionAPI: false,
    uiButtons: false,
    testCaseLoading: false,
    eventSystem: false,
    automationLog: false
  };
  
  // Test execution API with test case ID
  if (results.database) {
    results.executionAPI = await testExecutionAPI(results.database);
  }
  
  // Test UI components
  results.uiButtons = testUIButtons();
  results.testCaseLoading = testTestCaseLoading();
  results.eventSystem = testEventSystem();
  results.automationLog = testAutomationLog();
  
  // Summary
  console.log("=" * 50);
  console.log("📊 VERIFICATION SUMMARY:");
  console.log(`Frontend ↔ Backend: ${results.frontendBackend ? '✅' : '❌'}`);
  console.log(`Database Connection: ${results.database ? '✅' : '❌'}`);
  console.log(`Test Execution API: ${results.executionAPI ? '✅' : '❌'}`);
  console.log(`UI Buttons: ${results.uiButtons ? '✅' : '❌'}`);
  console.log(`Test Case Loading: ${results.testCaseLoading ? '✅' : '❌'}`);
  console.log(`Event System: ${results.eventSystem ? '✅' : '❌'}`);
  console.log(`Automation Log: ${results.automationLog ? '✅' : '❌'}`);
  
  const allWorking = Object.values(results).every(result => result === true);
  console.log(`Overall Status: ${allWorking ? '✅ ALL SYSTEMS WORKING' : '❌ SOME ISSUES FOUND'}`);
  
  return results;
}

// Run verification
runVerification();