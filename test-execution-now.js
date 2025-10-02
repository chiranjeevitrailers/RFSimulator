#!/usr/bin/env node

/**
 * Test Script - Execute a Test Case via API
 * This simulates what the Test Manager does when you click "Execute"
 */

const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function testExecution() {
  console.log('🧪 Testing 5GLabX Test Case Execution\n');
  console.log('='.repeat(60));
  
  // Step 1: Get a test case
  console.log('\n📋 Step 1: Fetching test cases from Supabase...');
  try {
    const testCasesResponse = await fetch('http://localhost:3000/api/test-cases/basic');
    const testCasesData = await testCasesResponse.json();
    
    if (!testCasesData.success || !testCasesData.data || testCasesData.data.length === 0) {
      console.error('❌ Failed to fetch test cases');
      console.error('Response:', JSON.stringify(testCasesData, null, 2));
      process.exit(1);
    }
    
    const firstTestCase = testCasesData.data[0];
    console.log(`✅ Found test case: ${firstTestCase.name}`);
    console.log(`   ID: ${firstTestCase.id}`);
    console.log(`   Category: ${firstTestCase.category}`);
    console.log(`   Protocol: ${firstTestCase.protocol}`);
    
    // Step 2: Execute the test case
    console.log('\n🚀 Step 2: Executing test case via API...');
    const executionResponse = await fetch('http://localhost:3000/api/test-execution/simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        testCaseId: firstTestCase.id,
        userId: null  // System execution
      })
    });
    
    const executionData = await executionResponse.json();
    
    if (!executionResponse.ok) {
      console.error(`❌ Test execution failed with status: ${executionResponse.status}`);
      console.error('Response:', JSON.stringify(executionData, null, 2));
      process.exit(1);
    }
    
    console.log(`✅ Test execution started successfully!`);
    console.log(`   Execution ID: ${executionData.executionId}`);
    console.log(`   Message count: ${executionData.testCaseData?.messageCount || 0}`);
    console.log(`   Data source: ${executionData.testCaseData?.dataSource || 'Unknown'}`);
    
    // Step 3: Verify data in database
    console.log('\n📊 Step 3: Checking if data was stored in database...');
    console.log('   (Check Supabase Dashboard → Table Editor → test_case_executions)');
    console.log(`   Look for execution_id: ${executionData.executionId}`);
    
    // Step 4: Instructions for frontend
    console.log('\n🎯 Step 4: View data in frontend:');
    console.log('   1. Open: http://localhost:3000/user-dashboard');
    console.log('   2. Go to "5GLabX Platform" tab');
    console.log('   3. Click "Logs Viewer" in sidebar');
    console.log('   4. You should see:');
    console.log('      - 🟢 "Receiving Real-Time Data" indicator');
    console.log('      - Log messages in the table');
    console.log('      - Real-time updates');
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ TEST EXECUTION SUCCESSFUL!');
    console.log('🎉 Data flow is working correctly!\n');
    
    // Show sample data
    if (executionData.testCaseData?.expectedMessages?.length > 0) {
      console.log('📨 Sample Messages Generated:');
      executionData.testCaseData.expectedMessages.slice(0, 3).forEach((msg, idx) => {
        console.log(`   ${idx + 1}. ${msg.messageName || msg.messageType} (${msg.layer})`);
      });
      if (executionData.testCaseData.expectedMessages.length > 3) {
        console.log(`   ... and ${executionData.testCaseData.expectedMessages.length - 3} more`);
      }
    }
    
    console.log('\n✨ Next: Check the frontend to see these messages!');
    
  } catch (error) {
    console.error('\n❌ Error during test execution:');
    console.error(error.message);
    console.error('\n💡 Make sure your dev server is running: npm run dev');
    process.exit(1);
  }
}

// Run the test
testExecution().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
