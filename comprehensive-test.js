// Comprehensive Test Script for 5GLabX Data Flow System
// Run this in browser console to test the entire system

console.log("🧪 Starting Comprehensive 5GLabX Data Flow Test...");

// Test 1: Check if LogsView is mounted and stable
function testLogsViewStability() {
  console.log("📋 Test 1: Checking LogsView stability...");
  
  // Check if component is mounted
  const logsView = document.querySelector('[data-testid="logs-view"]') || 
                   document.querySelector('.logs-view') ||
                   document.querySelector('[class*="logs"]');
  
  if (logsView) {
    console.log("✅ LogsView component found in DOM");
  } else {
    console.log("⚠️ LogsView component not found in DOM");
  }
  
  // Check for component lifecycle logs
  const logs = console.log.toString();
  console.log("📊 Component lifecycle check: Look for 'Component rendering/remounting' logs");
}

// Test 2: Test event system
function testEventSystem() {
  console.log("📋 Test 2: Testing event system...");
  
  const testData = {
    executionId: "test-execution-" + Date.now(),
    testCaseId: "test-case-001",
    testCaseData: {
      id: "test-case-001",
      name: "Comprehensive Test Case",
      component: "Test Component",
      expectedMessages: [
        {
          id: "msg-1",
          layer: "PHY",
          messageType: "RACH_PREAMBLE",
          direction: "UL",
          timestampMs: Date.now(),
          messagePayload: { preambleId: 1, rachConfig: "config1" },
          protocol: "5G_NR"
        },
        {
          id: "msg-2", 
          layer: "MAC",
          messageType: "RAR",
          direction: "DL",
          timestampMs: Date.now() + 1000,
          messagePayload: { raResponse: "success", timingAdvance: 10 },
          protocol: "5G_NR"
        },
        {
          id: "msg-3",
          layer: "RRC",
          messageType: "RRC_SETUP_REQUEST",
          direction: "UL", 
          timestampMs: Date.now() + 2000,
          messagePayload: { ueId: "12345", establishmentCause: "mo-data" },
          protocol: "5G_NR"
        }
      ],
      expectedInformationElements: [],
      expectedLayerParameters: [],
      category: "Functional",
      protocol: "5G_NR"
    },
    logs: [],
    timestamp: new Date().toISOString(),
    status: "running"
  };

  // Dispatch the main event
  const event = new CustomEvent("5GLABX_TEST_EXECUTION", {
    detail: testData
  });

  console.log("📡 Dispatching 5GLABX_TEST_EXECUTION event...");
  window.dispatchEvent(event);
  console.log("✅ Event dispatched successfully");
}

// Test 3: Test data persistence
function testDataPersistence() {
  console.log("📋 Test 3: Testing data persistence...");
  
  // Add some test logs
  const logsData = {
    logs: [
      {
        id: "log-1",
        timestamp: (Date.now() / 1000).toFixed(1),
        level: "I",
        component: "TEST",
        message: "Test log message 1",
        type: "TEST_LOG",
        source: "Comprehensive Test"
      },
      {
        id: "log-2", 
        timestamp: (Date.now() / 1000).toFixed(1),
        level: "I",
        component: "TEST",
        message: "Test log message 2",
        type: "TEST_LOG", 
        source: "Comprehensive Test"
      }
    ]
  };

  const logsEvent = new CustomEvent("immediate-logs-update", {
    detail: logsData
  });

  console.log("📡 Dispatching immediate-logs-update event...");
  window.dispatchEvent(logsEvent);
  console.log("✅ Logs event dispatched successfully");
}

// Test 4: Test component switching
function testComponentSwitching() {
  console.log("📋 Test 4: Testing component switching...");
  
  // Simulate navigation events
  const navigationEvents = [
    { type: "navigate", view: "logs" },
    { type: "navigate", view: "enhanced-logs" },
    { type: "navigate", view: "layer-trace" },
    { type: "navigate", view: "logs" }
  ];
  
  navigationEvents.forEach((event, index) => {
    setTimeout(() => {
      console.log(`🔄 Simulating navigation to: ${event.view}`);
      // This would normally be handled by the navigation system
    }, index * 1000);
  });
  
  console.log("✅ Navigation simulation started");
}

// Test 5: Check for errors
function checkForErrors() {
  console.log("📋 Test 5: Checking for errors...");
  
  // Check console for errors
  const originalError = console.error;
  const errors = [];
  
  console.error = function(...args) {
    errors.push(args.join(' '));
    originalError.apply(console, args);
  };
  
  // Restore after a short delay
  setTimeout(() => {
    console.error = originalError;
    if (errors.length > 0) {
      console.log("⚠️ Errors found:", errors);
    } else {
      console.log("✅ No errors detected");
    }
  }, 2000);
}

// Test 6: Performance check
function performanceCheck() {
  console.log("📋 Test 6: Performance check...");
  
  const startTime = performance.now();
  
  // Simulate heavy operations
  for (let i = 0; i < 1000; i++) {
    const testEvent = new CustomEvent("test-performance", {
      detail: { iteration: i, timestamp: Date.now() }
    });
    window.dispatchEvent(testEvent);
  }
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log(`⏱️ Performance test completed in ${duration.toFixed(2)}ms`);
  
  if (duration > 100) {
    console.log("⚠️ Performance warning: Event dispatching took longer than expected");
  } else {
    console.log("✅ Performance test passed");
  }
}

// Run all tests
function runAllTests() {
  console.log("🚀 Running comprehensive test suite...");
  
  testLogsViewStability();
  
  setTimeout(() => {
    testEventSystem();
  }, 500);
  
  setTimeout(() => {
    testDataPersistence();
  }, 1000);
  
  setTimeout(() => {
    testComponentSwitching();
  }, 1500);
  
  setTimeout(() => {
    checkForErrors();
  }, 2000);
  
  setTimeout(() => {
    performanceCheck();
  }, 2500);
  
  setTimeout(() => {
    console.log("🎉 Comprehensive test suite completed!");
    console.log("📊 Check the console logs above for test results");
    console.log("🔍 Look for any 'Component rendering/remounting' logs to verify stability");
  }, 3000);
}

// Auto-run tests
runAllTests();

// Export functions for manual testing
window.test5GLabX = {
  testLogsViewStability,
  testEventSystem,
  testDataPersistence,
  testComponentSwitching,
  checkForErrors,
  performanceCheck,
  runAllTests
};

console.log("🔧 Test functions available at window.test5GLabX");
console.log("💡 Run 'window.test5GLabX.runAllTests()' to run tests again");