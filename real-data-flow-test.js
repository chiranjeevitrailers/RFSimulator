#!/usr/bin/env node

/**
 * Real Data Flow Test - NO MOCK DATA
 * Tests actual test case execution with real Supabase data flow to 5GLabX frontend
 */

const http = require('http');

// Function to log with timestamp and color
function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const colors = {
    INFO: '\x1b[36m',    // Cyan
    SUCCESS: '\x1b[32m', // Green
    ERROR: '\x1b[31m',   // Red
    WARNING: '\x1b[33m', // Yellow
    DATA: '\x1b[35m',    // Magenta
    FLOW: '\x1b[34m'     // Blue
  };
  const reset = '\x1b[0m';
  const color = colors[type] || colors.INFO;
  console.log(`${color}[${timestamp}] [${type}] ${message}${reset}`);
}

// Function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 3003,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': '5GLabX-Real-Data-Test/1.0',
        ...options.headers
      },
      timeout: 15000
    };

    if (options.body) {
      const bodyString = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
      requestOptions.headers['Content-Length'] = Buffer.byteLength(bodyString);
    }

    const req = http.request(requestOptions, (res) => {
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

// Step 1: Fetch REAL test cases from Supabase database
async function fetchRealTestCases() {
  log('🔍 Fetching REAL test cases from Supabase database...', 'FLOW');
  try {
    const response = await makeRequest('http://localhost:3003/api/test-cases/basic/');
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      if (data.success && Array.isArray(data.data)) {
        log(`✅ Found ${data.data.length} REAL test cases from database`, 'SUCCESS');
        data.data.forEach((tc, index) => {
          log(`  ${index + 1}. ${tc.name} (${tc.id})`, 'DATA');
          log(`     Protocol: ${tc.protocol} | Layer: ${tc.layer} | Complexity: ${tc.complexity}`, 'DATA');
        });
        return data.data;
      }
    }
    log(`❌ Failed to fetch real test cases: Status ${response.statusCode}`, 'ERROR');
    log(`📊 Response: ${response.data}`, 'ERROR');
    return [];
  } catch (error) {
    log(`❌ Error fetching real test cases: ${error.message}`, 'ERROR');
    return [];
  }
}

// Step 2: Execute REAL test case with actual API call
async function executeRealTestCase(testCase) {
  log(`🚀 Executing REAL test case: ${testCase.name}`, 'FLOW');
  log(`📋 Real Test Case Details:`, 'DATA');
  log(`  🆔 ID: ${testCase.id}`, 'DATA');
  log(`  📋 Name: ${testCase.name}`, 'DATA');
  log(`  🔧 Protocol: ${testCase.protocol}`, 'DATA');
  log(`  📡 Layer: ${testCase.layer}`, 'DATA');
  log(`  ⚡ Complexity: ${testCase.complexity}`, 'DATA');
  log(`  📂 Category: ${testCase.category}`, 'DATA');
  log(`  📝 Description: ${testCase.description || 'N/A'}`, 'DATA');
  
  try {
    const executionData = {
      testCaseId: testCase.id,
      userId: `real-test-user-${Date.now()}`,
      executionMode: 'comprehensive',
      protocol: testCase.protocol,
      layer: testCase.layer,
      complexity: testCase.complexity,
      category: testCase.category,
      description: testCase.description,
      expectedMessages: testCase.expected_messages || 10,
      informationElements: testCase.information_elements || 15,
      layerParameters: testCase.layer_parameters || 12
    };

    log('📤 Sending REAL execution request to API...', 'FLOW');
    const response = await makeRequest('http://localhost:3003/api/test-execution/comprehensive/', {
      method: 'POST',
      body: executionData
    });

    log(`📊 API Response Status: ${response.statusCode}`, 'DATA');
    log(`📊 API Response Data: ${response.data}`, 'DATA');

    if (response.statusCode === 200) {
      const result = JSON.parse(response.data);
      log('✅ REAL test execution successful', 'SUCCESS');
      log(`📊 Execution ID: ${result.executionId || 'N/A'}`, 'DATA');
      return result;
    } else {
      log(`❌ REAL test execution failed - Status: ${response.statusCode}`, 'ERROR');
      log(`📊 Error Response: ${response.data}`, 'ERROR');
      return null;
    }
  } catch (error) {
    log(`❌ REAL test execution error: ${error.message}`, 'ERROR');
    return null;
  }
}

// Step 3: Check REAL database tables and data
async function checkRealDatabaseData() {
  log('🔍 Checking REAL database tables and data...', 'FLOW');
  
  const tablesToCheck = [
    'test_cases',
    'test_case_executions', 
    'test_case_results',
    'test_messages',
    'information_elements',
    'layer_parameters'
  ];

  const results = {};
  
  for (const table of tablesToCheck) {
    try {
      log(`🔍 Checking table: ${table}`, 'FLOW');
      const response = await makeRequest(`http://localhost:3003/api/database/table/${table}/`);
      
      if (response.statusCode === 200) {
        const data = JSON.parse(response.data);
        results[table] = {
          exists: true,
          recordCount: data.count || 0,
          sampleData: data.sample || null
        };
        log(`✅ Table ${table}: ${data.count || 0} records`, 'SUCCESS');
      } else {
        results[table] = {
          exists: false,
          error: `Status ${response.statusCode}: ${response.data}`
        };
        log(`❌ Table ${table}: Not accessible (${response.statusCode})`, 'ERROR');
      }
    } catch (error) {
      results[table] = {
        exists: false,
        error: error.message
      };
      log(`❌ Table ${table}: Error - ${error.message}`, 'ERROR');
    }
  }
  
  return results;
}

// Step 4: Test REAL API endpoints for data retrieval
async function testRealAPIEndpoints() {
  log('🔍 Testing REAL API endpoints for data retrieval...', 'FLOW');
  
  const endpoints = [
    { url: 'http://localhost:3003/api/test-cases/basic/', name: 'Basic Test Cases', method: 'GET' },
    { url: 'http://localhost:3003/api/test-cases/comprehensive/', name: 'Comprehensive Test Cases', method: 'GET' },
    { url: 'http://localhost:3003/api/test-execution/comprehensive/', name: 'Test Execution', method: 'POST' },
    { url: 'http://localhost:3003/api/tests/run/', name: 'Test Run', method: 'POST' }
  ];

  const results = {};
  
  for (const endpoint of endpoints) {
    try {
      log(`🔍 Testing: ${endpoint.name}`, 'FLOW');
      
      const options = { method: endpoint.method };
      if (endpoint.method === 'POST') {
        options.body = {
          testCaseId: 'test-id',
          userId: 'test-user',
          executionMode: 'comprehensive'
        };
      }
      
      const response = await makeRequest(endpoint.url, options);
      
      results[endpoint.name] = {
        status: response.statusCode,
        success: response.statusCode === 200,
        data: response.data.substring(0, 500) + (response.data.length > 500 ? '...' : ''),
        headers: response.headers
      };
      
      if (response.statusCode === 200) {
        log(`✅ ${endpoint.name}: Working (${response.statusCode})`, 'SUCCESS');
      } else {
        log(`❌ ${endpoint.name}: Failed (${response.statusCode})`, 'ERROR');
        log(`📊 Response: ${response.data.substring(0, 200)}...`, 'ERROR');
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

// Step 5: Monitor REAL console logs and data flow
async function monitorRealDataFlow(testCase, executionResult) {
  log('📊 Monitoring REAL data flow to 5GLabX frontend...', 'FLOW');
  
  if (!executionResult) {
    log('❌ No execution result to monitor', 'ERROR');
    return null;
  }

  // Check if execution created real database records
  log('🔍 Checking for REAL database records created by execution...', 'FLOW');
  
  try {
    // Try to fetch execution results
    const response = await makeRequest(`http://localhost:3003/api/test-execution/results/${executionResult.executionId || 'test'}/`);
    
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      log('✅ Found REAL execution results in database', 'SUCCESS');
      log(`📊 Results: ${JSON.stringify(data, null, 2)}`, 'DATA');
      return data;
    } else {
      log(`❌ No execution results found: ${response.statusCode}`, 'ERROR');
    }
  } catch (error) {
    log(`❌ Error fetching execution results: ${error.message}`, 'ERROR');
  }

  // Check for real messages, IEs, and layer parameters
  log('🔍 Checking for REAL messages, IEs, and layer parameters...', 'FLOW');
  
  const dataChecks = [
    { endpoint: 'http://localhost:3003/api/messages/', name: 'Messages' },
    { endpoint: 'http://localhost:3003/api/information-elements/', name: 'Information Elements' },
    { endpoint: 'http://localhost:3003/api/layer-parameters/', name: 'Layer Parameters' }
  ];

  const realData = {};
  
  for (const check of dataChecks) {
    try {
      const response = await makeRequest(check.endpoint);
      if (response.statusCode === 200) {
        const data = JSON.parse(response.data);
        realData[check.name] = data;
        log(`✅ Found REAL ${check.name}: ${Array.isArray(data) ? data.length : 'N/A'} items`, 'SUCCESS');
      } else {
        log(`❌ No REAL ${check.name} found: ${response.statusCode}`, 'ERROR');
        realData[check.name] = null;
      }
    } catch (error) {
      log(`❌ Error fetching REAL ${check.name}: ${error.message}`, 'ERROR');
      realData[check.name] = null;
    }
  }

  return realData;
}

// Main test function
async function main() {
  log('🎯 Starting REAL Data Flow Test - NO MOCK DATA');
  log('=' * 80);
  
  // Step 1: Fetch real test cases from database
  log('📋 Step 1: Fetching REAL Test Cases from Supabase');
  const realTestCases = await fetchRealTestCases();
  if (realTestCases.length === 0) {
    log('❌ No real test cases available', 'ERROR');
    return;
  }
  log('-' * 40);
  
  // Step 2: Check real database tables
  log('📋 Step 2: Checking REAL Database Tables');
  const databaseStatus = await checkRealDatabaseData();
  log('-' * 40);
  
  // Step 3: Test real API endpoints
  log('📋 Step 3: Testing REAL API Endpoints');
  const apiResults = await testRealAPIEndpoints();
  log('-' * 40);
  
  // Step 4: Execute real test case
  log('📋 Step 4: Executing REAL Test Case');
  const testCase = realTestCases[0]; // Use first real test case
  const executionResult = await executeRealTestCase(testCase);
  log('-' * 40);
  
  // Step 5: Monitor real data flow
  log('📋 Step 5: Monitoring REAL Data Flow');
  const dataFlowResults = await monitorRealDataFlow(testCase, executionResult);
  log('-' * 40);
  
  // Step 6: Generate real test report
  log('📋 Step 6: Generating REAL Test Report');
  const realTestReport = {
    timestamp: new Date().toISOString(),
    testType: 'REAL_DATA_FLOW_TEST',
    realTestCases: realTestCases,
    databaseStatus: databaseStatus,
    apiResults: apiResults,
    executionResult: executionResult,
    dataFlowResults: dataFlowResults,
    summary: {
      realTestCasesFound: realTestCases.length,
      databaseTablesWorking: Object.values(databaseStatus).filter(r => r.exists).length,
      apiEndpointsWorking: Object.values(apiResults).filter(r => r.success).length,
      testExecutionWorking: executionResult !== null,
      realDataFlowWorking: dataFlowResults !== null
    }
  };
  
  log('📊 REAL Test Report Summary:', 'SUCCESS');
  log(`  ✅ Real Test Cases Found: ${realTestReport.summary.realTestCasesFound}`, 'SUCCESS');
  log(`  ✅ Database Tables Working: ${realTestReport.summary.databaseTablesWorking}/6`, 'SUCCESS');
  log(`  ✅ API Endpoints Working: ${realTestReport.summary.apiEndpointsWorking}/4`, 'SUCCESS');
  log(`  ✅ Test Execution Working: ${realTestReport.summary.testExecutionWorking ? 'Yes' : 'No'}`, 'SUCCESS');
  log(`  ✅ Real Data Flow Working: ${realTestReport.summary.realDataFlowWorking ? 'Yes' : 'No'}`, 'SUCCESS');
  
  // Save real test report
  const fs = require('fs');
  fs.writeFileSync('/workspace/real-data-flow-test-report.json', JSON.stringify(realTestReport, null, 2));
  log('💾 Real test report saved to: real-data-flow-test-report.json', 'SUCCESS');
  
  log('🎉 REAL Data Flow Test Completed!');
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