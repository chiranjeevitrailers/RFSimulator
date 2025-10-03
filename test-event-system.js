// Test script to manually trigger 5GLABX_TEST_EXECUTION events
// Run this in the browser console to test the event system

console.log("🧪 Testing 5GLABX_TEST_EXECUTION event system...");

// Create test data
const testData = {
  executionId: "test-execution-" + Date.now(),
  testCaseId: "test-case-001",
  testCaseData: {
    id: "test-case-001",
    name: "Test Case 001",
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

// Dispatch the event
const event = new CustomEvent("5GLABX_TEST_EXECUTION", {
  detail: testData
});

console.log("📡 Dispatching 5GLABX_TEST_EXECUTION event with test data:", testData);
window.dispatchEvent(event);

console.log("✅ Event dispatched! Check the LogsView and other components for data.");

// Also test the immediate-logs-update event
const logsData = {
  logs: [
    {
      id: "log-1",
      timestamp: (Date.now() / 1000).toFixed(1),
      level: "I",
      component: "TEST",
      message: "Test log message 1",
      type: "TEST_LOG",
      source: "Manual Test"
    },
    {
      id: "log-2", 
      timestamp: (Date.now() / 1000).toFixed(1),
      level: "I",
      component: "TEST",
      message: "Test log message 2",
      type: "TEST_LOG", 
      source: "Manual Test"
    }
  ]
};

const logsEvent = new CustomEvent("immediate-logs-update", {
  detail: logsData
});

console.log("📡 Dispatching immediate-logs-update event with test logs:", logsData);
window.dispatchEvent(logsEvent);

console.log("✅ Both events dispatched! Check the console for component lifecycle logs and data display.");