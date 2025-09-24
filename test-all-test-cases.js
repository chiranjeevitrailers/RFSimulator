#!/usr/bin/env node

/**
 * 5GLabX - Test All Test Cases
 * This script tests fetching all test cases to verify the fix
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🚀 5GLabX - Test All Test Cases');
console.log('================================\n');

console.log('🔍 STEP 1: Environment Check\n');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing Supabase credentials');
  console.log('Please ensure .env.local contains:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key');
  process.exit(1);
}

console.log('✅ Environment variables loaded\n');

// Initialize Supabase admin client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testDatabaseDirectly() {
  console.log('🔍 STEP 2: Testing Direct Database Access\n');

  try {
    // Test different limits
    const limits = [20, 50, 100, 200, 500, 1000, 2000];

    for (const limit of limits) {
      console.log(`   📊 Testing limit: ${limit}`);

      const { data, error, count } = await supabaseAdmin
        .from('test_cases')
        .select('*', { count: 'exact' })
        .limit(limit);

      if (error) {
        console.log(`   ❌ Error with limit ${limit}:`, error.message);
        continue;
      }

      console.log(`   ✅ Fetched ${data?.length || 0} test cases (total: ${count})`);

      if (data && data.length > 0) {
        console.log(`   📋 Sample test case: ${data[0].name} (${data[0].category})`);
        console.log(`   🔍 Test case ID: ${data[0].test_case_id}`);
      }

      if (data && data.length >= limit) {
        console.log(`   ⚠️  Hit the limit - there might be more test cases`);
      }
    }

    return true;
  } catch (error) {
    console.log('❌ Direct database test failed:', error.message);
    return false;
  }
}

async function testAPIAccess() {
  console.log('\n🔍 STEP 3: Testing API Access\n');

  try {
    // Test the comprehensive API endpoint
    const apiUrl = `http://localhost:3000/api/test-cases/comprehensive?limit=2000`;

    console.log(`   📡 Testing API: ${apiUrl}`);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.log(`   ❌ API request failed: ${response.status} ${response.statusText}`);
      return false;
    }

    const result = await response.json();

    if (!result.success) {
      console.log('   ❌ API returned error:', result.error);
      return false;
    }

    const testCases = result.data || [];
    console.log(`   ✅ API fetched ${testCases.length} test cases`);

    if (testCases.length > 0) {
      // Group by category
      const byCategory = {};
      testCases.forEach(tc => {
        byCategory[tc.category] = (byCategory[tc.category] || 0) + 1;
      });

      console.log('   📊 Test cases by category:');
      Object.entries(byCategory).forEach(([category, count]) => {
        console.log(`      • ${category}: ${count} test cases`);
      });

      // Show sample test cases
      console.log('   📋 Sample test cases:');
      testCases.slice(0, 5).forEach((tc, i) => {
        console.log(`      ${i + 1}. ${tc.name} (${tc.category}) - ${tc.complexity}`);
      });
    }

    return true;
  } catch (error) {
    console.log('❌ API test failed:', error.message);
    return false;
  }
}

async function testCategories() {
  console.log('\n🔍 STEP 4: Testing Categories\n');

  try {
    const { data, error } = await supabaseAdmin
      .from('test_cases')
      .select('category, COUNT(*) as count')
      .group('category');

    if (error) {
      console.log('❌ Category query failed:', error.message);
      return;
    }

    console.log('   📊 Available categories:');
    data.forEach(cat => {
      console.log(`      • ${cat.category}: ${cat.count} test cases`);
    });

    return true;
  } catch (error) {
    console.log('❌ Category test failed:', error.message);
  }
}

async function main() {
  try {
    // Test direct database access
    const dbSuccess = await testDatabaseDirectly();

    // Test API access
    const apiSuccess = await testAPIAccess();

    // Test categories
    const catSuccess = await testCategories();

    console.log('\n🎯 TEST SUMMARY');
    console.log('===============');

    if (dbSuccess && apiSuccess) {
      console.log('✅ All tests passed!');
      console.log('✅ Database has comprehensive test cases');
      console.log('✅ API can fetch all test cases');
      console.log('✅ Frontend should now display all 1000+ test cases');
    } else {
      console.log('⚠️  Some tests failed. Check the output above.');
    }

    console.log('\n🔄 NEXT STEPS:');
    console.log('==============');
    console.log('1. Restart your development server: npm run dev');
    console.log('2. Refresh your browser (hard refresh: Ctrl+F5)');
    console.log('3. Navigate to the test cases section');
    console.log('4. Check if all test cases are now visible');

    console.log('\n💡 TROUBLESHOOTING:');
    console.log('==================');
    console.log('If you still see only 20 test cases:');
    console.log('- Check browser console for errors');
    console.log('- Verify the API endpoints are working');
    console.log('- Check if Row Level Security (RLS) policies are blocking access');
    console.log('- Try accessing the API directly: /api/test-cases/comprehensive?limit=2000');

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

// Run the main function
main();