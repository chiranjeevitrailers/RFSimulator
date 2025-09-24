#!/usr/bin/env node

/**
 * TEST API RESPONSE STRUCTURE
 * Let's examine what the backend API actually returns
 */

async function testAPIResponse() {
  console.log('🔍 EXAMINING API RESPONSE STRUCTURE');
  console.log('==================================\n');

  const testCaseId = '2fac4988-2313-4197-bc7e-39d3a66f23c1';

  try {
    console.log(`📡 Calling: /api/test-execution/simple?testCaseId=${testCaseId}`);

    const response = await fetch(`http://localhost:3000/api/test-execution/simple?testCaseId=${testCaseId}`);

    console.log(`📊 Response Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log('\n📋 FULL API RESPONSE STRUCTURE:');
      console.log('==============================');
      console.log(JSON.stringify(data, null, 2));

      console.log('\n📊 RESPONSE ANALYSIS:');
      console.log('====================');

      // Analyze the structure
      if (data.success && data.data) {
        console.log('✅ Response format: { success: true, data: {...} }');
        console.log('📋 Test case data available:', !!data.data.testCase);

        if (data.data.testCase) {
          const testCase = data.data.testCase;
          console.log('📋 Test Case ID:', testCase.id);
          console.log('📋 Test Case Name:', testCase.name);
          console.log('📋 Protocol:', testCase.protocol);
          console.log('📋 Has expectedMessages:', testCase.expectedMessages ? 'YES' : 'NO');

          if (testCase.expectedMessages) {
            console.log('📋 Messages count:', testCase.expectedMessages.length);
            console.log('📋 Sample message:', JSON.stringify(testCase.expectedMessages[0], null, 2));
          } else {
            console.log('❌ NO expectedMessages found - this is the problem!');
          }
        }
      } else {
        console.log('❌ Unexpected response format');
        console.log('Response keys:', Object.keys(data));
      }

      return data;
    } else {
      console.log('❌ API Response failed');
      const errorText = await response.text();
      console.log('Error response:', errorText);
      return null;
    }
  } catch (error) {
    console.log('❌ API Call error:', error.message);
    return null;
  }
}

// Test different API endpoints
async function testAllAPIs() {
  console.log('🔍 TESTING ALL API ENDPOINTS');
  console.log('============================\n');

  const testCaseId = '2fac4988-2313-4197-bc7e-39d3a66f23c1';
  const endpoints = [
    `/api/test-execution/simple?testCaseId=${testCaseId}`,
    `/api/test-execution/comprehensive?testCaseId=${testCaseId}`,
    `/api/test-execution/enhanced?testCaseId=${testCaseId}`,
    `/api/tests/run?testCaseId=${testCaseId}`
  ];

  for (const endpoint of endpoints) {
    console.log(`\n📡 Testing: ${endpoint}`);
    console.log('─'.repeat(endpoint.length + 10));

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`);
      const data = await response.json();

      console.log(`📊 Status: ${response.status}`);
      console.log('📋 Response format:', Object.keys(data));

      if (data.testCaseData?.expectedMessages) {
        console.log('✅ Has expectedMessages:', data.testCaseData.expectedMessages.length);
      } else if (data.data?.testCase?.expectedMessages) {
        console.log('✅ Has expectedMessages:', data.data.testCase.expectedMessages.length);
      } else if (data.expectedMessages) {
        console.log('✅ Has expectedMessages:', data.expectedMessages.length);
      } else {
        console.log('❌ No expectedMessages found');
      }
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }
}

// Main execution
async function main() {
  console.log('🎯 API RESPONSE ANALYSIS');
  console.log('=======================\n');

  // Test the main API
  const data = await testAPIResponse();

  if (data && data.success && data.data && data.data.testCase) {
    console.log('\n✅ API is working and returns test case data');
    console.log('📋 The issue is in the frontend data processing');

    console.log('\n🔧 FRONTEND DATA PROCESSING ISSUE:');
    console.log('=================================');
    console.log('The API returns: { success: true, data: { testCase: {...} } }');
    console.log('But our frontend expects: { testCaseData: { expectedMessages: [...] } }');
    console.log('📋 We need to fix the data structure mapping!');

    console.log('\n🎯 SOLUTION:');
    console.log('===========');
    console.log('Update the frontend to handle the correct API response structure:');
    console.log('');
    console.log('// Current (incorrect):');
    console.log('if (data.testCaseData?.expectedMessages) { ... }');
    console.log('');
    console.log('// Fixed (correct):');
    console.log('if (data.success && data.data?.testCase?.expectedMessages) {');
    console.log('  const testCase = data.data.testCase;');
    console.log('  const logs = testCase.expectedMessages.map(msg => ({ ... }));');
    console.log('  // Process logs...');
    console.log('}');

  } else {
    console.log('\n❌ API response structure issue detected');
    console.log('📋 Need to fix the backend API response');

    // Test other endpoints
    await testAllAPIs();
  }
}

main().catch(console.error);