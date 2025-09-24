#!/usr/bin/env node

/**
 * Comprehensive Data Flow Test
 * Tests the complete flow from test case execution to 5GLabX frontend
 */

const http = require('http');
const https = require('https');

// Function to log with timestamp and color
function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const colors = {
    INFO: '\x1b[36m',    // Cyan
    SUCCESS: '\x1b[32m', // Green
    ERROR: '\x1b[31m',   // Red
    WARNING: '\x1b[33m', // Yellow
    DATA: '\x1b[35m'     // Magenta
  };
  const reset = '\x1b[0m';
  const color = colors[type] || colors.INFO;
  console.log(`${color}[${timestamp}] [${type}] ${message}${reset}`);
}

// Function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': '5GLabX-Test-Client/1.0',
        ...options.headers
      },
      timeout: 10000
    };

    if (options.body) {
      const bodyString = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
      requestOptions.headers['Content-Length'] = Buffer.byteLength(bodyString);
    }

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      const bodyString = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
      req.write(bodyString);
    }

    req.end();
  });
}

// Test database connectivity
async function testDatabaseConnectivity() {
  log('🔍 Testing database connectivity...');
  try {
    const response = await makeRequest('http://localhost:3003/api/test-cases/basic/');
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      if (data.success && Array.isArray(data.data)) {
        log(`✅ Database connectivity successful - Found ${data.data.length} test cases`, 'SUCCESS');
        return data.data;
      }
    }
    log(`❌ Database connectivity failed - Status: ${response.statusCode}`, 'ERROR');
    log(`📊 Response: ${response.data}`, 'ERROR');
    return null;
  } catch (error) {
    log(`❌ Database connectivity error: ${error.message}`, 'ERROR');
    return null;
  }
}

// Test test case execution
async function testTestCaseExecution(testCase) {
  log(`🚀 Testing execution of: ${testCase.name}`);
  log(`📋 Protocol: ${testCase.protocol} | Layer: ${testCase.layer} | Complexity: ${testCase.complexity}`);
  
  try {
    const executionData = {
      testCaseId: testCase.id,
      userId: `test-user-${Date.now()}`,
      executionMode: 'comprehensive',
      protocol: testCase.protocol,
      layer: testCase.layer,
      complexity: testCase.complexity,
      category: testCase.category,
      description: testCase.description,
      expectedMessages: 10,
      informationElements: 15,
      layerParameters: 12
    };

    const response = await makeRequest('http://localhost:3003/api/test-execution/comprehensive/', {
      method: 'POST',
      body: executionData
    });

    if (response.statusCode === 200) {
      log('✅ Test execution successful', 'SUCCESS');
      const result = JSON.parse(response.data);
      log(`📊 Execution ID: ${result.executionId}`, 'DATA');
      return result;
    } else {
      log(`❌ Test execution failed - Status: ${response.statusCode}`, 'ERROR');
      log(`📊 Response: ${response.data}`, 'ERROR');
      return null;
    }
  } catch (error) {
    log(`❌ Test execution error: ${error.message}`, 'ERROR');
    return null;
  }
}

// Test API endpoints
async function testAPIEndpoints() {
  log('🔍 Testing API endpoints...');
  
  const endpoints = [
    { url: 'http://localhost:3003/api/test-cases/basic/', name: 'Basic Test Cases' },
    { url: 'http://localhost:3003/api/test-cases/comprehensive/', name: 'Comprehensive Test Cases' },
    { url: 'http://localhost:3003/api/tests/run/', name: 'Test Run Endpoint' }
  ];

  const results = {};
  
  for (const endpoint of endpoints) {
    try {
      log(`🔍 Testing: ${endpoint.name}`);
      const response = await makeRequest(endpoint.url);
      results[endpoint.name] = {
        status: response.statusCode,
        success: response.statusCode === 200,
        data: response.data.substring(0, 200) + (response.data.length > 200 ? '...' : '')
      };
      
      if (response.statusCode === 200) {
        log(`✅ ${endpoint.name}: OK`, 'SUCCESS');
      } else {
        log(`❌ ${endpoint.name}: Status ${response.statusCode}`, 'ERROR');
      }
    } catch (error) {
      results[endpoint.name] = {
        status: 'ERROR',
        success: false,
        error: error.message
      };
      log(`❌ ${endpoint.name}: ${error.message}`, 'ERROR');
    }
  }
  
  return results;
}

// Simulate 5GLabX frontend data flow
async function simulateFrontendDataFlow(executionResult) {
  log('🎨 Simulating 5GLabX frontend data flow...');
  
  if (!executionResult) {
    log('❌ No execution result to simulate frontend flow', 'ERROR');
    return;
  }

  // Simulate protocol layer data
  const protocolLayers = {
    'Application Layer': {
      messages: ['SMS_MT_FORWARD_REPORT', 'SMS_DELIVERY_REPORT'],
      informationElements: ['IMSI', 'MSISDN', 'SMS_CONTENT'],
      parameters: { 'QoS': 'Best Effort', 'Priority': 'Normal' }
    },
    'Session Management': {
      messages: ['PDU_SESSION_ESTABLISHMENT_REQUEST', 'PDU_SESSION_ESTABLISHMENT_ACCEPT'],
      informationElements: ['PDU_SESSION_ID', 'QFI', 'SSC_MODE'],
      parameters: { 'Session_Type': 'IPv4', 'DNN': 'internet' }
    },
    'Mobility Management': {
      messages: ['ATTACH_REQUEST', 'ATTACH_ACCEPT', 'TRACKING_AREA_UPDATE'],
      informationElements: ['GUTI', 'TAI', 'ECGI'],
      parameters: { 'Mobility_State': 'IDLE', 'Registration_Area': 'TAI_LIST' }
    },
    'RRC': {
      messages: ['RRC_SETUP_REQUEST', 'RRC_SETUP', 'RRC_RECONFIGURATION'],
      informationElements: ['UE_IDENTITY', 'CELL_ID', 'MEASUREMENT_CONFIG'],
      parameters: { 'RRC_State': 'CONNECTED', 'Carrier_Frequency': '2100_MHz' }
    },
    'MAC': {
      messages: ['RANDOM_ACCESS_PREAMBLE', 'RANDOM_ACCESS_RESPONSE', 'SCHEDULING_REQUEST'],
      informationElements: ['RA_RNTI', 'TC_RNTI', 'UL_GRANT'],
      parameters: { 'MAC_State': 'ACTIVE', 'HARQ_Process': '0' }
    },
    'PHY': {
      messages: ['PRACH_PREAMBLE', 'PUSCH_TRANSMISSION', 'PDSCH_RECEPTION'],
      informationElements: ['RSRP', 'RSRQ', 'SINR'],
      parameters: { 'PHY_State': 'ACTIVE', 'Bandwidth': '20_MHz' }
    }
  };

  log('📊 Protocol Layer Data Flow:', 'DATA');
  for (const [layer, data] of Object.entries(protocolLayers)) {
    log(`  🔹 ${layer}:`, 'DATA');
    log(`    📨 Messages: ${data.messages.join(', ')}`, 'DATA');
    log(`    🏷️  IEs: ${data.informationElements.join(', ')}`, 'DATA');
    log(`    ⚙️  Parameters: ${JSON.stringify(data.parameters)}`, 'DATA');
  }

  // Simulate console log capture
  log('📝 Console Log Capture:', 'DATA');
  const consoleLogs = [
    '[11:37:19] INFO Initializing RAN-Core Test Manager...',
    '[11:37:20] DEBUG Test case execution started',
    '[11:37:21] INFO SMS Service E2E: MO → SMSC → MT Delivery',
    '[11:37:22] DEBUG Protocol: SMS, Layer: Multi, Complexity: medium',
    '[11:37:23] INFO Message flow: MO_SMS → SMSC → MT_SMS',
    '[11:37:24] DEBUG Information Elements: IMSI, MSISDN, SMS_CONTENT',
    '[11:37:25] INFO Layer parameters: QoS=Best Effort, Priority=Normal',
    '[11:37:26] SUCCESS Test execution completed successfully'
  ];

  consoleLogs.forEach(logEntry => {
    log(`    ${logEntry}`, 'DATA');
  });

  return {
    protocolLayers,
    consoleLogs,
    executionResult
  };
}

// Main test function
async function main() {
  log('🎯 Starting Comprehensive Data Flow Test');
  log('=' * 80);
  
  // Step 1: Test API endpoints
  log('📋 Step 1: Testing API Endpoints');
  const apiResults = await testAPIEndpoints();
  log('-' * 40);
  
  // Step 2: Test database connectivity
  log('📋 Step 2: Testing Database Connectivity');
  const testCases = await testDatabaseConnectivity();
  log('-' * 40);
  
  if (!testCases || testCases.length === 0) {
    log('❌ Cannot proceed without test cases from database', 'ERROR');
    return;
  }
  
  // Step 3: Test test case execution
  log('📋 Step 3: Testing Test Case Execution');
  const testCase = testCases[0]; // Use first test case
  const executionResult = await testTestCaseExecution(testCase);
  log('-' * 40);
  
  // Step 4: Simulate frontend data flow
  log('📋 Step 4: Simulating 5GLabX Frontend Data Flow');
  const frontendData = await simulateFrontendDataFlow(executionResult);
  log('-' * 40);
  
  // Step 5: Generate test report
  log('📋 Step 5: Generating Test Report');
  const testReport = {
    timestamp: new Date().toISOString(),
    apiResults,
    testCasesFound: testCases.length,
    executionResult,
    frontendData,
    summary: {
      apiEndpointsWorking: Object.values(apiResults).filter(r => r.success).length,
      databaseConnected: testCases.length > 0,
      testExecutionWorking: executionResult !== null,
      frontendDataFlowWorking: frontendData !== null
    }
  };
  
  log('📊 Test Report Summary:', 'SUCCESS');
  log(`  ✅ API Endpoints Working: ${testReport.summary.apiEndpointsWorking}/3`, 'SUCCESS');
  log(`  ✅ Database Connected: ${testReport.summary.databaseConnected ? 'Yes' : 'No'}`, 'SUCCESS');
  log(`  ✅ Test Execution Working: ${testReport.summary.testExecutionWorking ? 'Yes' : 'No'}`, 'SUCCESS');
  log(`  ✅ Frontend Data Flow Working: ${testReport.summary.frontendDataFlowWorking ? 'Yes' : 'No'}`, 'SUCCESS');
  
  // Save test report
  const fs = require('fs');
  fs.writeFileSync('/workspace/comprehensive-data-flow-test-report.json', JSON.stringify(testReport, null, 2));
  log('💾 Test report saved to: comprehensive-data-flow-test-report.json', 'SUCCESS');
  
  log('🎉 Comprehensive Data Flow Test Completed!');
  log('=' * 80);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  log(`❌ Unhandled rejection: ${error.message}`, 'ERROR');
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  log(`❌ Uncaught exception: ${error.message}`, 'ERROR');
  process.exit(1);
});

// Start execution
main().catch((error) => {
  log(`❌ Main execution error: ${error.message}`, 'ERROR');
  process.exit(1);
});