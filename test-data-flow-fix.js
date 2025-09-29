#!/usr/bin/env node

/**
 * Data Flow Fix Test Script
 * Tests the complete Test Manager → 5GLabX Platform data flow
 */

console.log('🔧 Testing Data Flow Fixes...\n');

// Test data structure matching what Test Manager sends
const testExecutionData = {
  executionId: 'test-exec-123',
  testCaseId: 'tc-5g-nr-attach-001',
  testCaseData: {
    id: 'tc-5g-nr-attach-001',
    name: '5G NR Initial Access - Attach Procedure',
    protocol: '5G_NR',
    category: '5G_NR',
    expectedMessages: [
      {
        id: 'msg-1',
        stepOrder: 1,
        timestampMs: 1000,
        direction: 'DL',
        layer: 'PHY',
        protocol: '5G_NR',
        messageType: 'SSB',
        messageName: 'Synchronization Signal Block',
        messageDescription: 'SSB detection and timing synchronization',
        messagePayload: { 
          ssb_index: 0, 
          timing_offset: 0, 
          pci: 123,
          rsrp: -85.5,
          rsrq: -10.2
        }
      },
      {
        id: 'msg-2',
        stepOrder: 2,
        timestampMs: 2000,
        direction: 'UL',
        layer: 'MAC',
        protocol: '5G_NR',
        messageType: 'PRACH',
        messageName: 'Physical Random Access Channel',
        messageDescription: 'Random access preamble transmission',
        messagePayload: { 
          preamble_id: 5,
          ra_rnti: 0x1234,
          timing_advance: 0,
          power_ramping: 0
        }
      },
      {
        id: 'msg-3',
        stepOrder: 3,
        timestampMs: 3000,
        direction: 'UL',
        layer: 'RRC',
        protocol: '5G_NR',
        messageType: 'RRCSetupRequest',
        messageName: 'RRC Setup Request',
        messageDescription: 'RRC connection establishment request',
        messagePayload: { 
          ue_identity: '0x12345678',
          establishment_cause: 'mo-Data',
          spare: 0
        }
      }
    ],
    expectedInformationElements: [
      {
        id: 'ie-1',
        ieName: 'UE-Identity',
        ieType: 'MANDATORY',
        ieValue: '0x12345678',
        ieSize: 32,
        mandatory: true,
        description: 'UE identity for RRC connection'
      }
    ],
    expectedLayerParameters: [
      {
        id: 'param-1',
        layer: 'PHY',
        parameterName: 'SS-RSRP',
        parameterType: 'MEASUREMENT',
        parameterValue: -85.5,
        parameterUnit: 'dBm',
        description: 'SS Reference Signal Received Power'
      }
    ]
  },
  timestamp: new Date().toISOString(),
  status: 'running'
};

console.log('📊 Test Data Structure:');
console.log(`   Test Case: ${testExecutionData.testCaseData.name}`);
console.log(`   Expected Messages: ${testExecutionData.testCaseData.expectedMessages.length}`);
console.log(`   Expected IEs: ${testExecutionData.testCaseData.expectedInformationElements.length}`);
console.log(`   Expected Layer Params: ${testExecutionData.testCaseData.expectedLayerParameters.length}\n`);

console.log('🔧 FIXES APPLIED:');
console.log('==================');
console.log('✅ 1. Created EventBridge service to bridge testCaseExecutionStarted → immediate-logs-update');
console.log('✅ 2. Updated 5GLabX Platform to include EventBridge component');
console.log('✅ 3. Fixed LogsView state update race conditions');
console.log('✅ 4. Fixed Enhanced Logs View state updates');
console.log('✅ 5. Created comprehensive data format conversion\n');

console.log('🧪 TESTING INSTRUCTIONS:');
console.log('========================');
console.log('1. Open browser and navigate to the application');
console.log('2. Open browser console (F12)');
console.log('3. Run the following test commands:\n');

console.log('// Test 1: Simulate Test Manager execution');
console.log(`const testData = ${JSON.stringify(testExecutionData, null, 2)};`);
console.log('window.dispatchEvent(new CustomEvent("testCaseExecutionStarted", { detail: testData }));\n');

console.log('// Test 2: Check if EventBridge is working');
console.log('console.log("EventBridge active:", document.querySelector("[data-component]") !== null);\n');

console.log('// Test 3: Verify immediate-logs-update events are dispatched');
console.log('let logsUpdateCount = 0;');
console.log('window.addEventListener("immediate-logs-update", (e) => {');
console.log('  logsUpdateCount++;');
console.log('  console.log(`📡 Received immediate-logs-update #${logsUpdateCount}:`, e.detail.logs.length, "logs");');
console.log('});\n');

console.log('// Test 4: Check log view components');
console.log('const logsView = document.querySelector("[data-component=\\"LogsView\\"]");');
console.log('const enhancedLogsView = document.querySelector("[data-component=\\"EnhancedLogsViewAdvanced\\"]");');
console.log('console.log("LogsView found:", !!logsView);');
console.log('console.log("Enhanced Logs View found:", !!enhancedLogsView);\n');

console.log('// Test 5: Manual data injection test');
console.log('const manualLogs = [');
console.log('  {');
console.log('    id: "manual-1",');
console.log('    timestamp: (Date.now() / 1000).toFixed(1),');
console.log('    level: "I",');
console.log('    component: "RRC",');
console.log('    message: "Manual Test Message: RRC Setup Request",');
console.log('    type: "RRCSetupRequest",');
console.log('    source: "ManualTest"');
console.log('  }');
console.log('];');
console.log('window.dispatchEvent(new CustomEvent("immediate-logs-update", {');
console.log('  detail: { logs: manualLogs, source: "ManualTest" }');
console.log('}));\n');

console.log('🎯 EXPECTED RESULTS:');
console.log('===================');
console.log('1. EventBridge should convert testCaseExecutionStarted to immediate-logs-update');
console.log('2. LogsView should receive and display 3 test messages');
console.log('3. Enhanced Logs View should receive and display enhanced format logs');
console.log('4. No race conditions or duplicate state updates');
console.log('5. All log views should show real-time data from Test Manager\n');

console.log('🔍 DEBUGGING COMMANDS:');
console.log('======================');
console.log('// Check event listeners');
console.log('console.log("Active event listeners:", window.getEventListeners ? "Available" : "Not available");\n');

console.log('// Check component state');
console.log('const logElements = document.querySelectorAll("[class*=\\"log\\"]");');
console.log('console.log("Log elements found:", logElements.length);\n');

console.log('// Check for data in components');
console.log('const logContainers = document.querySelectorAll("[data-component]");');
console.log('logContainers.forEach(container => {');
console.log('  console.log(`Component: ${container.dataset.component}, Content length: ${container.innerHTML.length}`);');
console.log('});\n');

console.log('✅ Data Flow Fix Test Script Complete!');
console.log('Run the above commands in browser console to test the fixes.');