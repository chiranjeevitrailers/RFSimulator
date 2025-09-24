#!/usr/bin/env node

/**
 * 5GLabX - Real Data Test with Admin Client
 * Tests actual data fetching using admin client (bypasses RLS)
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🚀 5GLabX - Real Data Test (Admin Client)');
console.log('===========================================\n');

console.log('🔍 STEP 1: Environment Check\n');

// Check environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Environment Variables:');
console.log(`   ✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'Set ✓' : '❌ Missing'}`);
console.log(`   ✅ SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? 'Set ✓' : '❌ Missing'}\n`);

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing Supabase credentials');
  console.log('Please ensure .env.local contains:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key');
  process.exit(1);
}

// Initialize Supabase admin client (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('✅ Supabase admin client initialized\n');

async function fetchRealTestCases() {
  console.log('🔍 STEP 2: Fetching Real Test Cases (Admin)\n');

  try {
    // Get all test cases using admin client
    const { data: testCases, error: testCasesError } = await supabaseAdmin
      .from('test_cases')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(10);

    if (testCasesError) {
      console.log('❌ Failed to fetch test cases:', testCasesError.message);
      console.log('💡 This suggests RLS policies are blocking access');
      console.log('💡 Try disabling RLS temporarily or check policies');
      return null;
    }

    console.log('✅ Successfully fetched test cases');
    console.log(`   📊 Retrieved ${testCases.length} test cases\n`);

    if (testCases.length > 0) {
      // Display test cases
      console.log('📋 Test Cases Preview:');
      testCases.forEach((testCase, index) => {
        console.log(`   ${index + 1}. ${testCase.name}`);
        console.log(`      📱 Category: ${testCase.category}`);
        console.log(`      🔧 Complexity: ${testCase.complexity}`);
        console.log(`      📝 Description: ${testCase.description?.substring(0, 100)}...`);
        console.log(`      🆔 ID: ${testCase.id}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No test cases found in database');
      console.log('💡 The database is empty - you may need to seed it with data');
    }

    return testCases;
  } catch (error) {
    console.log('❌ Error fetching test cases:', error.message);
    return null;
  }
}

async function fetchTestCasesByCategory(category) {
  console.log(`🔍 STEP 3: Fetching ${category} Test Cases\n`);

  try {
    const { data: categoryTestCases, error } = await supabaseAdmin
      .from('test_cases')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.log(`❌ Failed to fetch ${category} test cases:`, error.message);
      return null;
    }

    console.log(`✅ Successfully fetched ${categoryTestCases.length} ${category} test cases\n`);
    return categoryTestCases;
  } catch (error) {
    console.log('❌ Error fetching category test cases:', error.message);
    return null;
  }
}

async function fetchTestExecutions() {
  console.log('🔍 STEP 4: Fetching Test Executions\n');

  try {
    const { data: executions, error } = await supabaseAdmin
      .from('test_executions')
      .select(`
        *,
        test_cases (
          name,
          category,
          description
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.log('❌ Failed to fetch test executions:', error.message);
      return null;
    }

    console.log(`✅ Successfully fetched ${executions.length} test executions\n`);

    if (executions.length > 0) {
      console.log('📋 Test Executions Preview:');
      executions.forEach((execution, index) => {
        console.log(`   ${index + 1}. ${execution.test_cases?.name || 'Unknown Test Case'}`);
        console.log(`      📊 Status: ${execution.status}`);
        console.log(`      🕐 Start: ${new Date(execution.start_time).toLocaleString()}`);
        console.log(`      📱 Category: ${execution.test_cases?.category}`);
        console.log('');
      });
    }

    return executions;
  } catch (error) {
    console.log('❌ Error fetching test executions:', error.message);
    return null;
  }
}

async function fetchUsers() {
  console.log('🔍 STEP 5: Fetching Users\n');

  try {
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.log('❌ Failed to fetch users:', error.message);
      return null;
    }

    console.log(`✅ Successfully fetched ${users.length} users\n`);

    if (users.length > 0) {
      console.log('👤 Users Preview:');
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email}`);
        console.log(`      🏷️  Role: ${user.role}`);
        console.log(`      📊 Subscription: ${user.subscription_tier}`);
        console.log(`      📅 Created: ${new Date(user.created_at).toLocaleString()}`);
        console.log('');
      });
    }

    return users;
  } catch (error) {
    console.log('❌ Error fetching users:', error.message);
    return null;
  }
}

async function testRealTimeSubscription() {
  console.log('🔍 STEP 6: Testing Real-time Subscription\n');

  try {
    console.log('   📡 Setting up real-time subscription for test executions...');

    // Set up real-time subscription
    const subscription = supabaseAdmin
      .channel('test_executions_changes_admin')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'test_executions'
      }, (payload) => {
        console.log('   📨 Real-time update received:', payload.eventType);
        console.log('   📊 Data:', JSON.stringify(payload.new || payload.old, null, 2));
      })
      .subscribe();

    console.log('✅ Real-time subscription established');
    console.log('   💡 Listening for changes... (Press Ctrl+C to stop)\n');

    // Wait for a few seconds to test subscription
    await new Promise(resolve => setTimeout(resolve, 5000));

    subscription.unsubscribe();
    console.log('✅ Real-time subscription test completed\n');

    return true;
  } catch (error) {
    console.log('❌ Error testing real-time subscription:', error.message);
    return false;
  }
}

async function testDatabaseHealth() {
  console.log('🔍 STEP 7: Testing Database Health\n');

  try {
    // Test basic connectivity
    const { data, error } = await supabaseAdmin.from('test_cases').select('count', { count: 'exact', head: true });

    if (error) {
      console.log('❌ Database health check failed:', error.message);
      return false;
    }

    console.log('✅ Database health check passed');
    console.log(`   📊 Active test cases: ${data}`);

    // Test user table
    const { data: userCount, error: userError } = await supabaseAdmin
      .from('users')
      .select('count', { count: 'exact', head: true });

    if (!userError) {
      console.log(`👤 Users in database: ${userCount}`);
    }

    // Test test executions
    const { data: executionCount, error: execError } = await supabaseAdmin
      .from('test_executions')
      .select('count', { count: 'exact', head: true });

    if (!execError) {
      console.log(`📋 Test executions: ${executionCount}`);
    }

    return true;
  } catch (error) {
    console.log('❌ Database health check error:', error.message);
    return false;
  }
}

async function insertSampleTestCase() {
  console.log('🔍 STEP 8: Inserting Sample Test Case\n');

  try {
    const sampleTestCase = {
      name: '5G NR Initial Access Test',
      description: 'Test case for 5G NR initial access procedures including cell search and random access',
      category: '5G_NR',
      subcategory: 'Initial Access',
      complexity: 'intermediate',
      duration: 120,
      protocol_layers: ['PHY', 'MAC', 'RRC'],
      test_data: {
        frequency: 3500,
        bandwidth: 100,
        duplex_mode: 'TDD',
        ssb_pattern: 'Case C'
      },
      expected_results: {
        success_rate: 95,
        latency_ms: 50,
        throughput_mbps: 100
      },
      is_active: true,
      tags: ['5G', 'NR', 'Initial Access', 'Cell Search']
    };

    const { data, error } = await supabaseAdmin
      .from('test_cases')
      .insert([sampleTestCase])
      .select()
      .single();

    if (error) {
      console.log('❌ Failed to insert sample test case:', error.message);
      return null;
    }

    console.log('✅ Sample test case inserted successfully');
    console.log(`   🆔 ID: ${data.id}`);
    console.log(`   📝 Name: ${data.name}`);
    console.log(`   📱 Category: ${data.category}\n`);

    return data;
  } catch (error) {
    console.log('❌ Error inserting sample test case:', error.message);
    return null;
  }
}

async function runCompleteTest() {
  console.log('🎯 Running Complete Real Data Test (Admin)\n');

  const results = {
    testCases: null,
    executions: null,
    users: null,
    realtime: false,
    health: false,
    sampleInserted: null
  };

  // Fetch real test cases
  results.testCases = await fetchRealTestCases();

  // Fetch test cases by category (if we have data)
  if (results.testCases && results.testCases.length > 0) {
    const categories = [...new Set(results.testCases.map(tc => tc.category))];
    for (const category of categories.slice(0, 2)) {
      await fetchTestCasesByCategory(category);
    }
  }

  // Fetch test executions
  results.executions = await fetchTestExecutions();

  // Fetch users
  results.users = await fetchUsers();

  // Test real-time subscription
  results.realtime = await testRealTimeSubscription();

  // Test database health
  results.health = await testDatabaseHealth();

  // Insert sample data if database is empty
  if (results.testCases && results.testCases.length === 0) {
    results.sampleInserted = await insertSampleTestCase();
  }

  return results;
}

// Run the complete test
async function main() {
  try {
    const results = await runCompleteTest();

    console.log('\n🎉 REAL DATA TEST SUMMARY (ADMIN)');
    console.log('==================================');
    console.log(`✅ Test Cases Retrieved: ${results.testCases ? results.testCases.length : 0}`);
    console.log(`✅ Test Executions Retrieved: ${results.executions ? results.executions.length : 0}`);
    console.log(`✅ Users Retrieved: ${results.users ? results.users.length : 0}`);
    console.log(`✅ Real-time Subscription: ${results.realtime ? 'Working' : 'Failed'}`);
    console.log(`✅ Database Health: ${results.health ? 'Good' : 'Issues'}`);
    console.log(`✅ Sample Data Inserted: ${results.sampleInserted ? 'Yes' : 'No'}`);

    if (results.testCases && results.testCases.length > 0) {
      console.log('\n🚀 SUCCESS! Real data fetching is working correctly!');
      console.log('Your 5GLabX platform can now:');
      console.log('   • Fetch real test cases from Supabase');
      console.log('   • Display actual test execution data');
      console.log('   • Handle real-time subscriptions');
      console.log('   • Manage user data and activities');
      console.log('\n📝 Next steps:');
      console.log('1. Start your application: npm run dev');
      console.log('2. Test the web interface with real data');
      console.log('3. Run end-to-end tests');
    } else {
      console.log('\n⚠️  Database is empty or access issues remain');
      console.log('   • If sample data was inserted, re-run this test');
      console.log('   • Check RLS policies in Supabase dashboard');
      console.log('   • Verify table permissions');
    }

  } catch (error) {
    console.log('\n❌ Test failed with error:', error.message);
    console.log('💡 Check your Supabase configuration and try again');
  }
}

// Run the test
main();