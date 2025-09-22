/**
 * Frontend Test Script for 5GLabX
 * Run this in browser console to test the data flow
 */

// Test 1: Check if SimpleDataDisplay is available
console.log('🧪 Testing 5GLabX Frontend...');

if (typeof window !== 'undefined') {
  console.log('✅ Browser environment detected');

  // Test 2: Check if components are loaded
  if (window.SimpleDataDisplay) {
    console.log('✅ SimpleDataDisplay component available globally');
  } else {
    console.log('⚠️ SimpleDataDisplay not found globally');
  }

  // Test 3: Test API endpoint directly
  console.log('🔍 Testing API endpoint...');
  fetch('/api/test-execution/simple/?testCaseId=a27e2fc0-d6a9-4fa7-b3b2-a7d3089af985')
    .then(response => {
      console.log('📡 API Response Status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('📊 API Response Data:', data);

      if (data.success) {
        console.log('✅ API working correctly');
        console.log('📋 Test Case:', data.data.testCase?.name);
        console.log('📝 Messages:', data.data.expectedMessages?.length || 0);
        console.log('🧩 IEs:', data.data.expectedInformationElements?.length || 0);
        console.log('⚙️ Layer Params:', data.data.expectedLayerParameters?.length || 0);

        // Test 4: Trigger event dispatch
        console.log('🚀 Triggering 5GLABX_TEST_EXECUTION event...');

        const testEvent = new CustomEvent('5GLABX_TEST_EXECUTION', {
          detail: {
            type: '5GLABX_TEST_EXECUTION',
            testCaseId: 'a27e2fc0-d6a9-4fa7-b3b2-a7d3089af985',
            testCaseData: data.data,
            dataSource: 'Console Test'
          }
        });

        window.dispatchEvent(testEvent);
        console.log('✅ Test event dispatched');

        // Test 5: Direct data injection
        console.log('💉 Testing direct data injection...');
        if (typeof window.DirectDataInjector !== 'undefined') {
          window.DirectDataInjector.injectTestData(data.data);
          console.log('✅ DirectDataInjector called');
        } else {
          console.log('⚠️ DirectDataInjector not available');
        }

      } else {
        console.log('❌ API returned error:', data.error);
      }
    })
    .catch(error => {
      console.error('❌ API call failed:', error);
    });

  // Test 6: Check for existing test data
  console.log('🔍 Checking for existing test data...');
  if (typeof window.testManagerData !== 'undefined') {
    console.log('📊 Found testManagerData:', window.testManagerData);
  }

  // Test 7: Manual fetch test
  console.log('🖱️ Manual fetch function available?');
  if (typeof window.manualFetch !== 'undefined') {
    console.log('✅ Manual fetch function available');
    // Uncomment to test: window.manualFetch();
  }

} else {
  console.log('❌ Not running in browser environment');
}

console.log('🎉 Frontend test script completed!');