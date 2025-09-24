#!/usr/bin/env node

/**
 * Fix API 500 Error Script
 * Diagnoses and fixes the 500 error in api/tests/run/ endpoint
 */

const http = require('http');

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': '5GLabX-API-Fix-Script/1.0',
        ...options.headers
      }
    };

    const client = urlObj.protocol === 'https:' ? https : http;
    
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

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Function to log with timestamp
function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${type}] ${message}`;
  console.log(logEntry);
}

async function diagnoseAPIError() {
  log('🔍 Diagnosing API 500 error in /api/tests/run/ endpoint...');
  
  try {
    // Test the problematic endpoint
    const response = await makeRequest('http://localhost:3000/api/tests/run/', {
      method: 'POST',
      body: {
        test_ids: ['test-123'],
        execution_mode: 'simulation'
      }
    });
    
    log(`📊 API Response Status: ${response.statusCode}`);
    log(`📊 API Response: ${response.data}`);
    
    if (response.statusCode === 500) {
      log('❌ Confirmed 500 error - investigating database schema...', 'ERROR');
      
      // Check if we can access the database through other endpoints
      const dbResponse = await makeRequest('http://localhost:3000/api/test-cases/basic/');
      
      if (dbResponse.statusCode === 200) {
        log('✅ Database connectivity is working through other endpoints', 'SUCCESS');
        log('🔍 Issue is likely with test_case_executions table structure', 'INFO');
      } else {
        log('❌ Database connectivity issues detected', 'ERROR');
      }
    } else {
      log('✅ API endpoint is working correctly', 'SUCCESS');
    }
    
  } catch (error) {
    log(`❌ Error diagnosing API: ${error.message}`, 'ERROR');
  }
}

async function testAlternativeEndpoints() {
  log('🧪 Testing alternative test execution endpoints...');
  
  const endpoints = [
    '/api/test-execution/simple',
    '/api/test-execution/comprehensive/',
    '/api/test-cases/basic/'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`http://localhost:3000${endpoint}`);
      log(`📊 ${endpoint}: Status ${response.statusCode}`);
      
      if (response.statusCode === 200) {
        log(`✅ ${endpoint} is working`, 'SUCCESS');
      } else {
        log(`⚠️  ${endpoint} returned status ${response.statusCode}`, 'WARNING');
      }
    } catch (error) {
      log(`❌ ${endpoint} error: ${error.message}`, 'ERROR');
    }
  }
}

async function main() {
  log('🎯 Starting API 500 Error Diagnosis');
  log('=' * 60);
  
  await diagnoseAPIError();
  log('-' * 40);
  await testAlternativeEndpoints();
  
  log('🎉 API diagnosis completed!');
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