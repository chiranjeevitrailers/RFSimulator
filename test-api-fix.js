#!/usr/bin/env node

/**
 * 5GLabX - Test API Fix
 * Tests if the /api/tests/run endpoint is working after the fixes
 */

console.log('🚀 5GLabX - Testing API Fix');
console.log('=============================\n');

async function testAPI() {
  console.log('🔍 Testing /api/tests/run endpoint...');

  try {
    const response = await fetch('http://localhost:3000/api/tests/run/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        test_ids: ['7004525a-5fb2-4654-bc91-44ccde3eb358'],
        execution_mode: 'simulation'
      })
    });

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:', JSON.stringify(data, null, 2));
      console.log('🎉 API is working correctly!');
    } else {
      const errorText = await response.text();
      console.log('❌ API Error:', errorText);
      console.log('❌ API still has issues');
    }

  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

async function testAlternativeAPI() {
  console.log('\n🔍 Testing /api/test-execution/simple endpoint...');

  try {
    const response = await fetch('http://localhost:3000/api/test-execution/simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        testCaseId: '7004525a-5fb2-4654-bc91-44ccde3eb358',
        userId: 'test-user-123'
      })
    });

    console.log('📊 Response Status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Simple API Response:', JSON.stringify(data, null, 2));
      console.log('🎉 Simple API is working!');
    } else {
      const errorText = await response.text();
      console.log('❌ Simple API Error:', errorText);
    }

  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

async function main() {
  await testAPI();
  await testAlternativeAPI();

  console.log('\n🎯 SUMMARY:');
  console.log('===========');
  console.log('If both APIs are working, the 500 error should be resolved.');
  console.log('The frontend should now be able to execute tests without errors.');
  console.log('\n🔄 Next steps:');
  console.log('1. Restart your development server: npm run dev');
  console.log('2. Test the fix by running a test case');
  console.log('3. Check if the 500 error is gone');
}

main();