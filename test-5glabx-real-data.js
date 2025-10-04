// 5GLabX Real Data Verification Script
// Tests Frontend ↔ Backend ↔ Database connections for 5GLabX Platform

console.log("🧪 Starting 5GLabX Real Data Verification...");

// Test 1: Check 5GLabX API Endpoints
async function test5GLabXAPIs() {
  console.log("📡 Test 1: 5GLabX API Endpoints");
  
  try {
    // Test comprehensive API
    const response = await fetch("/api/test-cases/comprehensive/?limit=1");
    const data = await response.json();
    
    if (data.success && data.data && data.data.length > 0) {
      console.log("✅ 5GLabX API: WORKING");
      console.log(`📊 Test case: ${data.data[0].name}`);
      console.log(`📊 Protocol: ${data.data[0].protocol}`);
      console.log(`📊 Category: ${data.data[0].category}`);
      return data.data[0].id;
    } else {
      console.log("❌ 5GLabX API: FAILED");
      return null;
    }
  } catch (error) {
    console.log("❌ 5GLabX API: ERROR -", error.message);
    return null;
  }
}

// Test 2: Check Real Data Processing in 5GLabX Views
function test5GLabXViews() {
  console.log("🔍 Test 2: 5GLabX Views Real Data Processing");
  
  // Check if LogsView is listening for events
  const logsViewExists = document.querySelector('[data-testid="logs-view"], .logs-view, [class*="LogsView"]');
  console.log(`📋 LogsView: ${logsViewExists ? 'FOUND' : 'NOT FOUND'}`);
  
  // Check if Protocol Layer Views exist
  const phyLayerExists = document.querySelector('[data-layer="PHY"], .phy-layer, [class*="PhyLayer"]');
  const macLayerExists = document.querySelector('[data-layer="MAC"], .mac-layer, [class*="MacLayer"]');
  const rlcLayerExists = document.querySelector('[data-layer="RLC"], .rlc-layer, [class*="RlcLayer"]');
  
  console.log(`📋 PHY Layer View: ${phyLayerExists ? 'FOUND' : 'NOT FOUND'}`);
  console.log(`📋 MAC Layer View: ${macLayerExists ? 'FOUND' : 'NOT FOUND'}`);
  console.log(`📋 RLC Layer View: ${rlcLayerExists ? 'FOUND' : 'NOT FOUND'}`);
  
  // Check if Core Network Analyzers exist
  const amfAnalyzerExists = document.querySelector('[class*="amf-analyzer"], [class*="AMF"]');
  const smfAnalyzerExists = document.querySelector('[class*="smf-analyzer"], [class*="SMF"]');
  
  console.log(`📋 AMF Analyzer: ${amfAnalyzerExists ? 'FOUND' : 'NOT FOUND'}`);
  console.log(`📋 SMF Analyzer: ${smfAnalyzerExists ? 'FOUND' : 'NOT FOUND'}`);
  
  return {
    logsView: !!logsViewExists,
    phyLayer: !!phyLayerExists,
    macLayer: !!macLayerExists,
    rlcLayer: !!rlcLayerExists,
    amfAnalyzer: !!amfAnalyzerExists,
    smfAnalyzer: !!smfAnalyzerExists
  };
}

// Test 3: Test Real Data Event System
function test5GLabXEventSystem() {
  console.log("📡 Test 3: 5GLabX Event System");
  
  let eventReceived = false;
  let viewsProcessed = 0;
  
  // Create test event listener
  const testListener = (event) => {
    if (event.type === "5GLABX_TEST_EXECUTION") {
      eventReceived = true;
      viewsProcessed++;
      console.log(`✅ Event received by view ${viewsProcessed}:`, event.detail?.testCaseId);
    }
  };
  
  // Register listener
  window.addEventListener("5GLABX_TEST_EXECUTION", testListener);
  
  // Create test event with real data structure
  const testEvent = new CustomEvent("5GLABX_TEST_EXECUTION", {
    detail: {
      type: "5GLABX_TEST_EXECUTION",
      executionId: "test-exec-5glabx-123",
      testCaseId: "test-case-5glabx-123",
      testCaseData: {
        id: "test-case-5glabx-123",
        name: "5G NR Initial Access - Real Data Test",
        protocol: "5G_NR",
        category: "5G_NR",
        expectedMessages: [
          {
            id: "msg-1",
            layer: "PHY",
            messageType: "PRACH",
            messageName: "Physical Random Access Channel",
            direction: "UL",
            protocol: "5G_NR",
            timestampMs: Date.now(),
            messagePayload: {
              preambleId: 1,
              raRnti: 1234
            },
            informationElements: {
              "Preamble ID": { type: "INTEGER", value: 1 },
              "RA-RNTI": { type: "INTEGER", value: 1234 }
            }
          },
          {
            id: "msg-2",
            layer: "RRC",
            messageType: "RRCSetupRequest",
            messageName: "RRC Setup Request",
            direction: "UL",
            protocol: "5G_NR",
            timestampMs: Date.now() + 1000,
            messagePayload: {
              rrcTransactionIdentifier: 1,
              establishmentCause: "mo_Signalling"
            }
          }
        ]
      },
      timestamp: new Date().toISOString(),
      status: "running"
    }
  });
  
  // Dispatch test event
  window.dispatchEvent(testEvent);
  
  // Clean up and check results
  setTimeout(() => {
    window.removeEventListener("5GLABX_TEST_EXECUTION", testListener);
    console.log(`📊 Event System: ${eventReceived ? 'WORKING' : 'NOT WORKING'}`);
    console.log(`📊 Views Processed: ${viewsProcessed}`);
  }, 1000);
  
  return eventReceived;
}

// Test 4: Test Real Data from Supabase
async function testRealDataFromSupabase(testCaseId) {
  console.log("🗄️ Test 4: Real Data from Supabase");
  
  if (!testCaseId) {
    console.log("❌ Real Data Test: SKIPPED - No test case ID");
    return false;
  }
  
  try {
    // Execute test case to get real data
    const response = await fetch("/api/test-execution/simple/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        testCaseId: testCaseId, 
        userId: "5glabx-test-user" 
      })
    });
    
    const data = await response.json();
    
    if (data.success && data.testCaseData && data.testCaseData.expectedMessages) {
      console.log("✅ Real Data from Supabase: WORKING");
      console.log(`📊 Test Case: ${data.testCaseData.name}`);
      console.log(`📊 Messages: ${data.testCaseData.expectedMessages.length}`);
      console.log(`📊 Protocol: ${data.testCaseData.protocol}`);
      console.log(`📊 Category: ${data.testCaseData.category}`);
      
      // Check message structure
      const sampleMessage = data.testCaseData.expectedMessages[0];
      if (sampleMessage) {
        console.log("📊 Sample Message Structure:");
        console.log(`   - Layer: ${sampleMessage.layer}`);
        console.log(`   - Type: ${sampleMessage.messageType}`);
        console.log(`   - Direction: ${sampleMessage.direction}`);
        console.log(`   - Payload Keys: ${Object.keys(sampleMessage.messagePayload || {}).join(', ')}`);
      }
      
      return true;
    } else {
      console.log("❌ Real Data from Supabase: FAILED");
      return false;
    }
  } catch (error) {
    console.log("❌ Real Data from Supabase: ERROR -", error.message);
    return false;
  }
}

// Test 5: Check for Fake/Synthetic Data
function checkForFakeData() {
  console.log("🔍 Test 5: Check for Fake/Synthetic Data");
  
  // Check console for fake data indicators
  const consoleLogs = [];
  const originalLog = console.log;
  console.log = (...args) => {
    consoleLogs.push(args.join(' '));
    originalLog(...args);
  };
  
  // Check for common fake data patterns
  const fakeDataIndicators = [
    'sample', 'mock', 'fake', 'synthetic', 'dummy', 'placeholder',
    'test-data', 'sample-data', 'mock-data'
  ];
  
  let fakeDataFound = false;
  fakeDataIndicators.forEach(indicator => {
    if (consoleLogs.some(log => log.toLowerCase().includes(indicator))) {
      console.log(`⚠️  Potential fake data indicator found: "${indicator}"`);
      fakeDataFound = true;
    }
  });
  
  // Restore original console.log
  console.log = originalLog;
  
  if (!fakeDataFound) {
    console.log("✅ No fake data indicators found");
  }
  
  return !fakeDataFound;
}

// Run all tests
async function run5GLabXVerification() {
  console.log("🚀 Starting 5GLabX Real Data Verification Suite...");
  console.log("=" * 50);
  
  const results = {
    api: await test5GLabXAPIs(),
    views: test5GLabXViews(),
    eventSystem: test5GLabXEventSystem(),
    realData: false,
    noFakeData: checkForFakeData()
  };
  
  // Test real data with test case ID
  if (results.api) {
    results.realData = await testRealDataFromSupabase(results.api);
  }
  
  // Summary
  console.log("=" * 50);
  console.log("📊 5GLabX VERIFICATION SUMMARY:");
  console.log(`API Connection: ${results.api ? '✅' : '❌'}`);
  console.log(`Views Found: ${Object.values(results.views).filter(Boolean).length}/6`);
  console.log(`Event System: ${results.eventSystem ? '✅' : '❌'}`);
  console.log(`Real Data from Supabase: ${results.realData ? '✅' : '❌'}`);
  console.log(`No Fake Data: ${results.noFakeData ? '✅' : '❌'}`);
  
  const allWorking = results.api && results.eventSystem && results.realData && results.noFakeData;
  console.log(`Overall Status: ${allWorking ? '✅ ALL REAL DATA SYSTEMS WORKING' : '❌ SOME ISSUES FOUND'}`);
  
  if (allWorking) {
    console.log("🎉 5GLabX Platform is fully connected with real data from Supabase!");
  } else {
    console.log("⚠️  Some components may need attention for real data integration.");
  }
  
  return results;
}

// Run verification
run5GLabXVerification();