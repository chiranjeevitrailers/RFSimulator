#!/usr/bin/env node

/**
 * Apply Database Schema Fix
 * Executes the SQL fix to create missing tables for real data flow
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
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 3003,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Database-Fix-Client/1.0',
        ...options.headers
      },
      timeout: 30000
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

// Read the SQL fix file
function readSQLFix() {
  const fs = require('fs');
  try {
    const sqlContent = fs.readFileSync('/workspace/database/final_fix_test_executions.sql', 'utf8');
    log('✅ SQL fix file read successfully', 'SUCCESS');
    return sqlContent;
  } catch (error) {
    log(`❌ Error reading SQL fix file: ${error.message}`, 'ERROR');
    return null;
  }
}

// Apply database fix via API
async function applyDatabaseFix() {
  log('🔧 Applying database schema fix...', 'INFO');
  
  const sqlContent = readSQLFix();
  if (!sqlContent) {
    return false;
  }

  try {
    // Try to apply the fix via a database API endpoint
    const response = await makeRequest('http://localhost:3003/api/database/execute/', {
      method: 'POST',
      body: {
        sql: sqlContent,
        description: 'Fix test_case_executions table schema'
      }
    });

    if (response.statusCode === 200) {
      log('✅ Database fix applied successfully', 'SUCCESS');
      log(`📊 Response: ${response.data}`, 'DATA');
      return true;
    } else {
      log(`❌ Database fix failed: ${response.statusCode}`, 'ERROR');
      log(`📊 Response: ${response.data}`, 'ERROR');
      return false;
    }
  } catch (error) {
    log(`❌ Error applying database fix: ${error.message}`, 'ERROR');
    return false;
  }
}

// Test if tables exist after fix
async function testTablesAfterFix() {
  log('🔍 Testing if tables exist after fix...', 'INFO');
  
  const tables = ['test_case_executions', 'test_case_results'];
  const results = {};
  
  for (const table of tables) {
    try {
      const response = await makeRequest(`http://localhost:3003/api/database/table/${table}/`);
      if (response.statusCode === 200) {
        results[table] = { exists: true, status: 'OK' };
        log(`✅ Table ${table}: EXISTS`, 'SUCCESS');
      } else {
        results[table] = { exists: false, status: response.statusCode };
        log(`❌ Table ${table}: NOT FOUND (${response.statusCode})`, 'ERROR');
      }
    } catch (error) {
      results[table] = { exists: false, error: error.message };
      log(`❌ Table ${table}: ERROR - ${error.message}`, 'ERROR');
    }
  }
  
  return results;
}

// Test test execution after fix
async function testExecutionAfterFix() {
  log('🚀 Testing test execution after database fix...', 'INFO');
  
  try {
    const executionData = {
      testCaseId: '2fac4988-2313-4197-bc7e-39d3a66f23c1',
      userId: `test-user-after-fix-${Date.now()}`,
      executionMode: 'comprehensive',
      protocol: 'LTE',
      layer: 'Multi',
      complexity: 'expert',
      category: '4G_LTE',
      description: 'Test after database fix',
      expectedMessages: 10,
      informationElements: 15,
      layerParameters: 12
    };

    const response = await makeRequest('http://localhost:3003/api/test-execution/comprehensive/', {
      method: 'POST',
      body: executionData
    });

    if (response.statusCode === 200) {
      log('✅ Test execution working after fix!', 'SUCCESS');
      log(`📊 Response: ${response.data}`, 'DATA');
      return true;
    } else {
      log(`❌ Test execution still failing: ${response.statusCode}`, 'ERROR');
      log(`📊 Response: ${response.data}`, 'ERROR');
      return false;
    }
  } catch (error) {
    log(`❌ Error testing execution: ${error.message}`, 'ERROR');
    return false;
  }
}

// Main function
async function main() {
  log('🎯 Starting Database Schema Fix Application');
  log('=' * 60);
  
  // Step 1: Apply database fix
  log('📋 Step 1: Applying Database Schema Fix');
  const fixApplied = await applyDatabaseFix();
  log('-' * 40);
  
  if (!fixApplied) {
    log('❌ Database fix failed - cannot proceed', 'ERROR');
    return;
  }
  
  // Step 2: Test tables after fix
  log('📋 Step 2: Testing Tables After Fix');
  const tableResults = await testTablesAfterFix();
  log('-' * 40);
  
  // Step 3: Test execution after fix
  log('📋 Step 3: Testing Execution After Fix');
  const executionWorking = await testExecutionAfterFix();
  log('-' * 40);
  
  // Step 4: Generate report
  log('📋 Step 4: Generating Fix Report');
  const report = {
    timestamp: new Date().toISOString(),
    fixApplied: fixApplied,
    tableResults: tableResults,
    executionWorking: executionWorking,
    summary: {
      tablesCreated: Object.values(tableResults).filter(r => r.exists).length,
      totalTables: Object.keys(tableResults).length,
      executionWorking: executionWorking
    }
  };
  
  log('📊 Database Fix Report:', 'SUCCESS');
  log(`  ✅ Fix Applied: ${report.fixApplied ? 'Yes' : 'No'}`, 'SUCCESS');
  log(`  ✅ Tables Created: ${report.summary.tablesCreated}/${report.summary.totalTables}`, 'SUCCESS');
  log(`  ✅ Execution Working: ${report.summary.executionWorking ? 'Yes' : 'No'}`, 'SUCCESS');
  
  // Save report
  const fs = require('fs');
  fs.writeFileSync('/workspace/database-fix-report.json', JSON.stringify(report, null, 2));
  log('💾 Fix report saved to: database-fix-report.json', 'SUCCESS');
  
  log('🎉 Database Schema Fix Application Completed!');
  log('=' * 60);
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