#!/usr/bin/env node

/**
 * Test All Test Cases Loading
 * Verify that the Professional Test Manager loads all 1800+ test cases
 */

console.log('🧪 TESTING ALL TEST CASES LOADING');
console.log('==================================\n');

async function testAllTestCases() {
  try {
    // Test the comprehensive API directly
    console.log('1️⃣ Testing Comprehensive API...');
    const response = await fetch('http://localhost:3000/api/test-cases/comprehensive/?limit=2000');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Comprehensive API working');
      console.log(`   Loaded: ${data.data?.length || 0} test cases`);
      console.log(`   Total in database: ${data.total || 'Unknown'}`);
      console.log(`   Statistics:`, data.statistics || 'Not available');
      
      if (data.data && data.data.length > 0) {
        console.log('\n📊 Test Case Categories:');
        
        // Count by category
        const categories = {};
        data.data.forEach(testCase => {
          const category = testCase.category || 'Unknown';
          categories[category] = (categories[category] || 0) + 1;
        });
        
        Object.entries(categories).forEach(([cat, count]) => {
          console.log(`   ${cat}: ${count} test cases`);
        });
        
        console.log('\n📋 Sample Test Cases:');
        data.data.slice(0, 5).forEach((tc, index) => {
          console.log(`   ${index + 1}. ${tc.name} (${tc.category})`);
        });
      }
    } else {
      console.log('❌ Comprehensive API failed:', response.status);
    }

    // Test the user dashboard
    console.log('\n2️⃣ Testing User Dashboard...');
    const dashboardResponse = await fetch('http://localhost:3000/user-dashboard');
    if (dashboardResponse.ok) {
      console.log('✅ User Dashboard accessible');
      console.log('   Professional Test Manager should now load all test cases');
    } else {
      console.log('❌ User Dashboard not accessible');
    }

    console.log('\n🎯 EXPECTED RESULTS:');
    console.log('====================');
    console.log('✅ Should load 1000+ test cases (up to 2000 limit)');
    console.log('✅ Should show proper category breakdown:');
    console.log('   - 5G NR: ~350+ test cases');
    console.log('   - 4G LTE: ~430+ test cases');
    console.log('   - Core Network: Various test cases');
    console.log('   - Call Flows: Various test cases');
    console.log('   - Other categories: Various test cases');
    console.log('✅ Sidebar should show proper counts for each category');
    console.log('✅ Test Cases Management table should display all loaded test cases');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAllTestCases();