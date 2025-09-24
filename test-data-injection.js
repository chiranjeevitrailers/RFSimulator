#!/usr/bin/env node

/**
 * Test Data Injection - Simple verification script
 * This script tests if data injection is working without complex services
 */

console.log('🧪 TESTING DATA INJECTION');
console.log('=========================\n');

// Test data that matches the frontend format
const testData = {
  testCaseId: 'data-injection-test',
  testCaseData: {
    id: 'data-injection-test',
    name: 'Data Injection Test',
    description: 'Testing direct data injection to frontend',
    protocol: '5G_NR',
    category: '5G_NR',
    expectedMessages: [
      {
        id: 'test_msg_1',
        stepOrder: 1,
        timestampMs: Date.now(),
        direction: 'UL',
        layer: 'RRC',
        protocol: '5G_NR',
        messageType: 'RRCSetupRequest',
        messageName: 'RRC Setup Request',
        messageDescription: 'Test message for data injection',
        messagePayload: {
          rrc_TransactionIdentifier: 1,
          establishmentCause: 'mo_Signalling'
        },
        informationElements: {
          'RRC Transaction Identifier': { type: 'INTEGER', value: 1 },
          'Establishment Cause': { type: 'ENUMERATED', value: 'mo-Signalling' }
        },
        layerParameters: {
          'Protocol': { value: 'RRC', reference: 'TS 38.331' }
        },
        standardReference: 'TS 38.331'
      },
      {
        id: 'test_msg_2',
        stepOrder: 2,
        timestampMs: Date.now() + 1000,
        direction: 'DL',
        layer: 'RRC',
        protocol: '5G_NR',
        messageType: 'RRCSetup',
        messageName: 'RRC Setup',
        messageDescription: 'Test message 2 for data injection',
        messagePayload: {
          rrc_TransactionIdentifier: 1,
          radioBearerConfig: {}
        },
        informationElements: {
          'RRC Transaction Identifier': { type: 'INTEGER', value: 1 },
          'Radio Bearer Config': { type: 'SEQUENCE', value: 'Present' }
        },
        layerParameters: {
          'RRC Setup': { value: 'Success', reference: 'TS 38.331' }
        },
        standardReference: 'TS 38.331'
      }
    ]
  },
  source: 'DataInjectionTest',
  timestamp: Date.now()
};

// Convert to log format expected by frontend
const convertToLogs = (data) => {
  if (!data.testCaseData?.expectedMessages) return [];

  return data.testCaseData.expectedMessages.map((msg, index) => ({
    id: `test-${Date.now()}-${index}`,
    timestamp: (Date.now() / 1000).toFixed(1),
    level: 'I',
    component: msg.layer || 'TEST',
    message: `${msg.messageName}: ${JSON.stringify(msg.messagePayload || {}, null, 2)}`,
    type: msg.messageType || 'TEST_MESSAGE',
    source: 'DataInjectionTest',
    testCaseId: data.testCaseId,
    direction: msg.direction || 'UL',
    protocol: msg.protocol || '5G_NR',
    rawData: JSON.stringify(msg.messagePayload || {}, null, 2),
    informationElements: msg.informationElements || {},
    layerParameters: msg.layerParameters || {}
  }));
};

const logs = convertToLogs(testData);

console.log(`✅ Generated ${logs.length} test logs`);
console.log('📊 Sample log:', JSON.stringify(logs[0], null, 2));

// Generate browser console commands
console.log('\n🔧 BROWSER CONSOLE TEST COMMANDS:');
console.log('=================================');
console.log('1. Open http://localhost:3000/simple-direct-data-view in your browser');
console.log('2. Open browser console (F12)');
console.log('3. Run the following commands to test data injection:');
console.log('');

console.log('// Test 1: Direct event dispatch');
console.log(`window.dispatchEvent(new CustomEvent('immediate-logs-update', {
  detail: { logs: ${JSON.stringify(logs)}, source: 'ConsoleTest' }
}));`);
console.log('');

console.log('// Test 2: 5GLabX test execution event');
console.log(`window.dispatchEvent(new CustomEvent('5GLABX_TEST_EXECUTION', {
  detail: ${JSON.stringify(testData)}
}));`);
console.log('');

console.log('// Test 3: Generic logs update');
console.log(`window.dispatchEvent(new CustomEvent('logs-update', {
  detail: { logs: ${JSON.stringify(logs)}, source: 'ConsoleTest' }
}));`);
console.log('');

console.log('// Test 4: Manual log injection');
console.log(`const manualLog = {
  id: 'manual-' + Date.now(),
  timestamp: (Date.now() / 1000).toFixed(1),
  level: 'I',
  component: 'MANUAL_TEST',
  message: 'Manual test log: ' + new Date().toLocaleTimeString(),
  type: 'MANUAL_TEST',
  source: 'ManualTest',
  testCaseId: 'manual-test',
  direction: 'UL',
  protocol: '5G_NR'
};`);
console.log('window.dispatchEvent(new CustomEvent("immediate-logs-update", { detail: { logs: [manualLog], source: "ManualTest" } }));');
console.log('');

console.log('// Test 5: Check if SimpleDirectDataView is loaded');
console.log('console.log("SimpleDirectDataView components:", document.querySelectorAll("[data-component-name]"));');
console.log('console.log("Log containers:", document.querySelectorAll("[class*=log]"));');
console.log('');

console.log('// Test 6: Force data into global stores');
console.log('if (window.labxDataStore) {');
console.log(`  window.labxDataStore.logs = [...window.labxDataStore.logs, ...${JSON.stringify(logs)}];`);
console.log('  console.log("Added to labxDataStore:", window.labxDataStore.logs.length);');
console.log('}');
console.log('');

console.log('// Test 7: Try direct DOM injection');
console.log('const logElements = document.querySelectorAll("[class*=log], [class*=logs]");');
console.log('logElements.forEach((el, i) => {');
console.log('  const testDiv = document.createElement("div");');
console.log('  testDiv.style.cssText = "color: red; font-weight: bold; padding: 5px; margin: 2px; border: 1px solid red;";');
console.log('  testDiv.textContent = "DIRECT TEST LOG: " + new Date().toLocaleTimeString();');
console.log('  el.appendChild(testDiv);');
console.log('  console.log("Injected into element", i + 1);');
console.log('});');
console.log('');

console.log('4. Look for green indicator showing "DIRECT DATA LOADED"');
console.log('5. Check if logs appear in the SimpleDirectDataView component');
console.log('6. Monitor console for event reception confirmations');
console.log('');

console.log('\n🎯 EXPECTED RESULTS:');
console.log('===================');
console.log('1. Green indicator should appear: "DIRECT DATA LOADED"');
console.log('2. Console should log: "📡 Received immediate-logs-update"');
console.log('3. SimpleDirectDataView should show new log entries');
console.log('4. Log count should increase from 0 to 2 (or more)');
console.log('5. Red DOM injection logs should appear in existing log containers');
console.log('');

console.log('\n🔍 TROUBLESHOOTING:');
console.log('===================');
console.log('If no data appears, run these diagnostic commands:');
console.log('');
console.log('// Check if page is loaded');
console.log('console.log("Document ready:", !!document.body);');
console.log('console.log("Window object:", typeof window);');
console.log('');
console.log('// Check for event listeners');
console.log('console.log("Event listeners available:", typeof window.addEventListener);');
console.log('');
console.log('// Check for React components');
console.log('console.log("React components:", Object.keys(window).filter(k => k.includes("React")));');
console.log('');
console.log('// Check for existing log containers');
console.log('console.log("Log containers found:", document.querySelectorAll("[class*=log]").length);');
console.log('console.log("Log container classes:", Array.from(document.querySelectorAll("[class*=log]")).map(el => el.className));');
console.log('');
console.log('// Force component re-render (if using React)');
console.log('if (window.forceUpdate) window.forceUpdate();');
console.log('if (window.forceRender) window.forceRender();');
console.log('');

console.log('\n🚀 TEST STATUS:');
console.log('===============');
console.log('✅ Test data generated:', logs.length, 'logs');
console.log('✅ Console commands prepared');
console.log('✅ Event dispatch mechanisms ready');
console.log('✅ DOM injection fallback prepared');
console.log('✅ Visual indicators configured');
console.log('✅ Multiple test methods available');

console.log('\n📋 TEST SUMMARY:');
console.log('================');
console.log('This test will verify if data injection is working');
console.log('by bypassing all complex service dependencies.');
console.log('');
console.log('The SimpleDirectDataView component should immediately');
console.log('display the injected data without any service loading.');
console.log('');
console.log('If this test works, the issue is with service loading.');
console.log('If this test fails, the issue is with event dispatching.');
console.log('');
console.log('Run the browser console commands above to test.');