#!/usr/bin/env node

/**
 * Test Updated E2E Test Cases
 * This script will test if the updated E2E test cases are working correctly
 */

async function testUpdatedE2E() {
  console.log('🧪 Testing Updated E2E Test Cases...\n');

  try {
    // Test SMS Service E2E
    const smsTestCaseId = 'd427e8aa-d3c7-46e3-80f5-f955571934ea';
    
    console.log('📋 Testing SMS Service End-to-End Test Case...');
    console.log(`   - ID: ${smsTestCaseId}`);
    
    const testDataResponse = await fetch(`http://localhost:3000/api/test-execution/simple?testCaseId=${smsTestCaseId}`);
    
    if (!testDataResponse.ok) {
      throw new Error(`Failed to fetch test data: ${testDataResponse.status}`);
    }

    const testData = await testDataResponse.json();
    console.log(`✅ SMS E2E test case data fetched:`);
    console.log(`   - Test Case Name: ${testData.data?.testCase?.name}`);
    console.log(`   - Protocol: ${testData.data?.testCase?.protocol}`);
    console.log(`   - Category: ${testData.data?.testCase?.category}`);
    console.log(`   - Expected Messages: ${testData.data?.expectedMessages?.length || 0}`);
    console.log(`   - Information Elements: ${testData.data?.expectedInformationElements?.length || 0}`);
    console.log(`   - Layer Parameters: ${testData.data?.expectedLayerParameters?.length || 0}`);

    // Check if we have complete E2E flow
    if (testData.data?.expectedMessages?.length > 0) {
      console.log(`\n📨 SMS E2E Message Flow Analysis:`);
      const messages = testData.data.expectedMessages;
      const layers = [...new Set(messages.map(msg => msg.layer))];
      const protocols = [...new Set(messages.map(msg => msg.protocol))];
      
      console.log(`   - Total Messages: ${messages.length}`);
      console.log(`   - Layers Covered: ${layers.join(', ')}`);
      console.log(`   - Protocols: ${protocols.join(', ')}`);
      
      // Show first few messages
      console.log(`\n📋 First 5 Messages:`);
      messages.slice(0, 5).forEach((message, index) => {
        console.log(`   ${index + 1}. ${message.messageName} (${message.layer})`);
        console.log(`      - Type: ${message.messageType}`);
        console.log(`      - Direction: ${message.direction}`);
        console.log(`      - Description: ${message.messageDescription}`);
      });
      
      if (messages.length > 5) {
        console.log(`   ... and ${messages.length - 5} more messages`);
      }
    }

    // Test 5G→LTE Handover E2E
    console.log(`\n🔄 Testing 5G→LTE Handover E2E Test Case...`);
    const handoverTestCaseId = '7004525a-5fb2-4654-bc91-44ccde3eb358';
    
    const handoverResponse = await fetch(`http://localhost:3000/api/test-execution/simple?testCaseId=${handoverTestCaseId}`);
    if (handoverResponse.ok) {
      const handoverData = await handoverResponse.json();
      console.log(`✅ 5G→LTE Handover E2E test case data:`);
      console.log(`   - Messages: ${handoverData.data?.expectedMessages?.length || 0}`);
      console.log(`   - IEs: ${handoverData.data?.expectedInformationElements?.length || 0}`);
      console.log(`   - Layer Params: ${handoverData.data?.expectedLayerParameters?.length || 0}`);
      
      if (handoverData.data?.expectedMessages?.length > 0) {
        const messages = handoverData.data.expectedMessages;
        const layers = [...new Set(messages.map(msg => msg.layer))];
        console.log(`   - Layers: ${layers.join(', ')}`);
      }
    }

    // Analysis Summary
    console.log(`\n🎯 E2E Database Analysis:`);
    const smsHasMessages = testData.data?.expectedMessages?.length > 0;
    const smsHasIEs = testData.data?.expectedInformationElements?.length > 0;
    const smsHasLayerParams = testData.data?.expectedLayerParameters?.length > 0;
    
    console.log(`   SMS E2E Test Case:`);
    console.log(`   - Messages Generated: ${smsHasMessages ? '✅' : '❌'}`);
    console.log(`   - Information Elements Generated: ${smsHasIEs ? '✅' : '❌'}`);
    console.log(`   - Layer Parameters Generated: ${smsHasLayerParams ? '✅' : '❌'}`);
    
    if (smsHasMessages && smsHasIEs && smsHasLayerParams) {
      console.log(`\n🎉 SUCCESS! Complete E2E database working!`);
      console.log(`   The SMS E2E test case now generates:`);
      console.log(`   - ${testData.data.expectedMessages.length} messages`);
      console.log(`   - ${testData.data.expectedInformationElements.length} Information Elements`);
      console.log(`   - ${testData.data.expectedLayerParameters.length} Layer Parameters`);
    } else {
      console.log(`\n⚠️  WARNING: Incomplete E2E data generation`);
      console.log(`   Missing: ${!smsHasMessages ? 'Messages' : ''} ${!smsHasIEs ? 'IEs' : ''} ${!smsHasLayerParams ? 'Layer Parameters' : ''}`);
    }

  } catch (error) {
    console.error('❌ Error during E2E test:', error.message);
  }
}

// Run the test
testUpdatedE2E();