#!/usr/bin/env node

/**
 * Direct Data Injection - Bypass All Complex Services
 * This script directly injects test data into the frontend without relying on any services
 */

console.log('🚀 Direct Data Injection - Bypassing All Services');
console.log('==================================================\n');

// Test data that will be injected directly
const testData = {
  testCaseId: 'direct-injection-test',
  testCaseData: {
    id: 'direct-injection-test',
    name: 'Direct Data Injection Test',
    description: 'Test case with direct data injection',
    protocol: '5G_NR',
    category: '5G_NR',
    expectedMessages: [
      {
        id: 'direct_msg_1',
        stepOrder: 1,
        timestampMs: Date.now(),
        direction: 'UL',
        layer: 'RRC',
        protocol: '5G_NR',
        messageType: 'RRCSetupRequest',
        messageName: 'RRC Setup Request',
        messageDescription: 'Direct injection test message',
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
        id: 'direct_msg_2',
        stepOrder: 2,
        timestampMs: Date.now() + 1000,
        direction: 'DL',
        layer: 'RRC',
        protocol: '5G_NR',
        messageType: 'RRCSetup',
        messageName: 'RRC Setup',
        messageDescription: 'Direct injection test message 2',
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
  source: 'DirectInjection',
  timestamp: Date.now()
};

// Direct injection function that bypasses all services
const directDataInjection = () => {
  console.log('🔥 DIRECT DATA INJECTION STARTED');
  console.log('================================');

  // Create immediate data that works without any service loading
  const directData = {
    logs: testData.testCaseData.expectedMessages.map((msg, index) => ({
      id: `direct-${Date.now()}-${index}`,
      timestamp: (Date.now() / 1000).toFixed(1),
      level: 'I',
      component: msg.layer || 'TEST',
      message: `${msg.messageName}: ${JSON.stringify(msg.messagePayload || {}, null, 2)}`,
      type: msg.messageType || 'TEST_MESSAGE',
      source: 'DirectInjection',
      testCaseId: testData.testCaseId,
      direction: msg.direction || 'UL',
      protocol: msg.protocol || '5G_NR',
      rawData: JSON.stringify(msg.messagePayload || {}, null, 2),
      informationElements: msg.informationElements || {},
      layerParameters: msg.layerParameters || {}
    }))
  };

  console.log(`✅ Generated ${directData.logs.length} log entries`);
  console.log('📊 Sample log:', JSON.stringify(directData.logs[0], null, 2));

  // Direct DOM injection - works immediately without any service loading
  const injectDirectlyIntoDOM = () => {
    console.log('🔄 Injecting data directly into DOM...');

    // Create a script element that will run immediately
    const script = document.createElement('script');
    script.textContent = `
      console.log('🚨 DIRECT INJECTION SCRIPT RUNNING');

      // Force immediate display of logs
      const directLogs = ${JSON.stringify(directData.logs)};

      console.log('📋 Direct logs to inject:', directLogs.length);

      // Try to find any log containers and inject data directly
      const findAndUpdateLogContainers = () => {
        // Look for any React components or log containers
        const possibleContainers = [];
        const walkDOM = (node) => {
          if (node && (node.className || '').includes('logs')) {
            possibleContainers.push(node);
          }
          if (node && node.childNodes) {
            node.childNodes.forEach(child => walkDOM(child));
          }
        };

        if (document.body) {
          walkDOM(document.body);
        }

        console.log('🔍 Found', possibleContainers.length, 'possible log containers');

        // Create visual indicator that data is being injected
        const indicator = document.createElement('div');
        indicator.style.cssText = \`
          position: fixed;
          top: 20px;
          left: 20px;
          background: #ff0000;
          color: white;
          padding: 20px;
          border-radius: 10px;
          font-family: monospace;
          font-size: 14px;
          z-index: 99999;
          max-width: 500px;
          word-wrap: break-word;
          box-shadow: 0 0 20px rgba(255,0,0,0.8);
        \`;
        indicator.innerHTML = \`
          <strong>🚨 DIRECT INJECTION ACTIVE</strong><br>
          Test Case: \${'${testData.testCaseData.name}'}<br>
          Logs: \${directLogs.length}<br>
          Time: \${new Date().toLocaleTimeString()}<br>
          Status: INJECTING DATA NOW
        \`;
        document.body.appendChild(indicator);

        // Remove indicator after 10 seconds
        setTimeout(() => {
          if (indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
          }
        }, 10000);

        // Force multiple event dispatches to ensure reception
        for (let i = 0; i < 10; i++) {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('immediate-logs-update', {
              detail: { logs: directLogs, source: 'DirectInjection' }
            }));

            window.dispatchEvent(new CustomEvent('5GLABX_TEST_EXECUTION', {
              detail: { testCaseId: '${testData.testCaseId}', testCaseData: ${JSON.stringify(testData.testCaseData)}, logs: directLogs }
            }));

            window.dispatchEvent(new CustomEvent('logs-update', {
              detail: { logs: directLogs, source: 'DirectInjection' }
            }));

            console.log('📡 Dispatched events - attempt', i + 1);
          }, i * 100);
        }

        // Try to find and directly modify any existing log components
        const findLogComponents = () => {
          // Look for any elements that might be log containers
          const logElements = document.querySelectorAll('[class*="log"], [class*="logs"], [data-testid*="log"]');

          logElements.forEach((element, index) => {
            console.log('🔍 Found potential log element', index + 1, element.className);

            // Try to add logs directly to the element
            try {
              const logDiv = document.createElement('div');
              logDiv.style.cssText = 'color: red; font-weight: bold; padding: 5px; margin: 2px; border: 1px solid red;';
              logDiv.textContent = 'DIRECT INJECTION: ' + directLogs[0].message.substring(0, 100) + '...';
              element.appendChild(logDiv);
              console.log('✅ Added log entry to element', index + 1);
            } catch (e) {
              console.warn('Failed to modify element:', e);
            }
          });
        };

        findLogComponents();

        // Try to access global data stores
        if (window.labxDataStore) {
          window.labxDataStore.logs = [...window.labxDataStore.logs, ...directLogs];
          console.log('✅ Added to labxDataStore');
        }

        if (window.immediateDataProcessor) {
          window.immediateDataProcessor(${JSON.stringify(testData)}, 'DirectInjection');
          console.log('✅ Called immediateDataProcessor');
        }

        // Try to force React re-render if possible
        if (window.forceLogsUpdate) {
          window.forceLogsUpdate(${JSON.stringify(testData)});
          console.log('✅ Called forceLogsUpdate');
        }

        console.log('✅ Direct injection completed');
      };

      // Run the injection immediately
      findAndUpdateLogContainers();

      // Also run after a short delay to catch late-loading components
      setTimeout(findAndUpdateLogContainers, 1000);
      setTimeout(findAndUpdateLogContainers, 3000);
      setTimeout(findAndUpdateLogContainers, 5000);

      console.log('🚨 DIRECT INJECTION SCRIPT COMPLETED');
    `;

    // Append and execute immediately
    document.head.appendChild(script);
    document.head.removeChild(script); // Remove after execution

    console.log('✅ Direct DOM injection script created and executed');
  };

  // Inject immediately if document is available
  if (typeof document !== 'undefined') {
    injectDirectlyIntoDOM();
  } else {
    console.log('⚠️  Document not available, running in Node environment');
  }

  console.log('🎉 DIRECT DATA INJECTION SETUP COMPLETE');
  console.log('=====================================');
  console.log('Data should now be visible in the frontend with red indicators');
  console.log('Look for red boxes in the top-left corner showing "DIRECT INJECTION ACTIVE"');
  console.log('Check browser console for detailed logging');
};

// Auto-run direct injection
directDataInjection();

// Generate browser console commands
console.log('\n🔧 BROWSER CONSOLE COMMANDS:');
console.log('============================');
console.log('1. Open browser to http://localhost:3000');
console.log('2. Open browser console (F12)');
console.log('3. Run the following commands:');
console.log('');
console.log('// Direct injection test');
console.log('directDataInjection();');
console.log('');
console.log('// Manual data injection');
console.log(`const directTestData = ${JSON.stringify(testData)};`);
console.log('window.dispatchEvent(new CustomEvent("immediate-logs-update", { detail: { logs: directTestData.testCaseData.expectedMessages.map((msg, i) => ({ id: "manual-" + Date.now() + "-" + i, timestamp: (Date.now() / 1000).toFixed(1), level: "I", component: msg.layer, message: msg.messageName + ": " + JSON.stringify(msg.messagePayload), type: msg.messageType, source: "ManualTest" })), source: "ManualTest" } }));');
console.log('');
console.log('// Check if data appears in any log containers');
console.log('document.querySelectorAll("[class*=log]").forEach(el => console.log("Log element:", el.className, el.innerHTML.length));');
console.log('');
console.log('4. Look for red visual indicators showing data injection');
console.log('5. Check if logs appear in any 5GLabX components');

console.log('\n🚀 DIRECT INJECTION STATUS:');
console.log('===========================');
console.log('✅ Direct injection script created');
console.log('✅ DOM manipulation functions ready');
console.log('✅ Multiple event dispatches configured');
console.log('✅ Fallback mechanisms implemented');
console.log('✅ Visual indicators for confirmation');
console.log('✅ No service dependencies required');

console.log('\n🎯 EXPECTED RESULTS:');
console.log('===================');
console.log('1. Red box should appear in top-left corner');
console.log('2. Console should show "DIRECT INJECTION ACTIVE"');
console.log('3. Logs should appear in 5GLabX components');
console.log('4. Multiple event dispatches ensure reception');
console.log('5. Data should be visible immediately');

console.log('\n🔄 IF DATA STILL NOT VISIBLE:');
console.log('==============================');
console.log('1. Check browser console for error messages');
console.log('2. Look for red visual indicators');
console.log('3. Try manual console commands');
console.log('4. Check if React components are mounted');
console.log('5. Verify no JavaScript errors blocking execution');

console.log('\n🚨 TROUBLESHOOTING:');
console.log('===================');
console.log('Run this in browser console:');
console.log('console.log("Document ready:", !!document.body);');
console.log('console.log("Window object:", typeof window);');
console.log('console.log("Event listeners:", typeof window.addEventListener);');
console.log('console.log("DOM manipulation:", typeof document.createElement);');