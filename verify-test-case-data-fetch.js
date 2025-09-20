// Verification script to test if test case data is properly fetched from Supabase
// This script will help identify the exact issue with test case data fetching

async function verifyTestCaseDataFetch() {
  console.log('🔍 Starting Test Case Data Fetch Verification...');
  
  // Test different test case IDs to see what works
  const testCaseIds = [
    // Sample IDs we're using
    'GCF-001',
    'PTCRB-001', 
    '5G-001',
    'LTE-001',
    
    // Real IDs from schema
    'TC_5G_NR_INITIAL_ACCESS_001',
    'TC_4G_LTE_ATTACH_001',
    
    // UUID format (if database uses UUIDs)
    '550e8400-e29b-41d4-a716-446655440000'
  ];
  
  for (const testCaseId of testCaseIds) {
    console.log(`\n🧪 Testing test case ID: ${testCaseId}`);
    
    try {
      // Test 1: Simple API
      console.log('  📡 Testing /api/test-cases/simple...');
      const simpleResponse = await fetch(`/api/test-cases/simple?category=5G_NR&limit=10`);
      if (simpleResponse.ok) {
        const simpleData = await simpleResponse.json();
        console.log(`    ✅ Simple API: ${simpleData.data?.testCases?.length || 0} test cases found`);
        if (simpleData.data?.testCases?.length > 0) {
          console.log(`    📋 Sample test case IDs:`, simpleData.data.testCases.slice(0, 3).map(tc => tc.id || tc.test_case_id));
        }
      } else {
        console.log(`    ❌ Simple API failed: ${simpleResponse.status}`);
      }
      
      // Test 2: Comprehensive API with specific test case ID
      console.log(`  📡 Testing /api/test-execution/comprehensive?testCaseId=${testCaseId}...`);
      const comprehensiveResponse = await fetch(`/api/test-execution/comprehensive?testCaseId=${encodeURIComponent(testCaseId)}&includeTemplates=true`);
      if (comprehensiveResponse.ok) {
        const comprehensiveData = await comprehensiveResponse.json();
        console.log(`    ✅ Comprehensive API: Success`);
        console.log(`    📊 Data structure:`, {
          testCase: !!comprehensiveData.data?.testCase,
          expectedMessages: comprehensiveData.data?.expectedMessages?.length || 0,
          expectedIEs: comprehensiveData.data?.expectedInformationElements?.length || 0,
          expectedLayerParams: comprehensiveData.data?.expectedLayerParameters?.length || 0
        });
        
        if (comprehensiveData.data?.expectedMessages?.length > 0) {
          console.log(`    🎯 FOUND REAL DATA for ${testCaseId}!`);
          return testCaseId; // Return the working ID
        }
      } else {
        const errorText = await comprehensiveResponse.text();
        console.log(`    ❌ Comprehensive API failed: ${comprehensiveResponse.status} - ${errorText.substring(0, 100)}`);
      }
      
      // Test 3: Tests API
      console.log(`  📡 Testing /api/tests?protocol=5G_NR...`);
      const testsResponse = await fetch('/api/tests?protocol=5G_NR&limit=5');
      if (testsResponse.ok) {
        const testsData = await testsResponse.json();
        console.log(`    ✅ Tests API: ${testsData.tests?.length || 0} test cases found`);
        if (testsData.tests?.length > 0) {
          console.log(`    📋 Real test case IDs:`, testsData.tests.slice(0, 3).map(tc => tc.id || tc.test_case_id));
        }
      } else {
        console.log(`    ❌ Tests API failed: ${testsResponse.status}`);
      }
      
    } catch (error) {
      console.log(`    ❌ Error testing ${testCaseId}:`, error);
    }
  }
  
  console.log('\n🔍 Verification Complete. Check above for working test case IDs.');
}

// Run verification if in browser
if (typeof window !== 'undefined') {
  // Add to window for manual testing
  window.verifyTestCaseDataFetch = verifyTestCaseDataFetch;
  console.log('🔧 Test case data fetch verification available: window.verifyTestCaseDataFetch()');
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { verifyTestCaseDataFetch };
}