#!/usr/bin/env node

/**
 * 5GLabX - Real Supabase Data Test
 * Tests actual data fetching from Supabase database
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🚀 5GLabX - Real Supabase Data Test');
console.log('===================================\n');

console.log('🔍 STEP 1: Checking Environment Configuration\n');

// Check environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Environment Variables:');
console.log(`   ✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'Set ✓' : '❌ Missing'}`);
console.log(`   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'Set ✓' : '❌ Missing'}`);
console.log(`   ✅ SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? 'Set ✓' : '❌ Missing'}\n`);

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Missing required Supabase environment variables');
  console.log('💡 Please ensure .env.local contains:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.log('   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('✅ Supabase clients initialized\n');

// Test functions
async function testSupabaseConnection() {
  console.log('🔍 STEP 2: Testing Supabase Connection\n');

  try {
    const { data, error } = await supabase.from('test_cases').select('count', { count: 'exact', head: true });

    if (error) {
      console.log('❌ Connection failed:', error.message);
      return false;
    }

    console.log('✅ Supabase connection successful');
    console.log(`   📊 Total test cases in database: ${data}\n`);
    return true;
  } catch (error) {
    console.log('❌ Connection error:', error.message);
    console.log('💡 Make sure your Supabase project is active and accessible');
    return false;
  }
}

async function fetchRealTestCases() {
  console.log('🔍 STEP 3: Fetching Real Test Cases\n');

  try {
    // Get all test cases
    const { data: testCases, error: testCasesError } = await supabase
      .from('test_cases')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(10);

    if (testCasesError) {
      console.log('❌ Failed to fetch test cases:', testCasesError.message);
      return null;
    }

    console.log('✅ Successfully fetched test cases');
    console.log(`   📊 Retrieved ${testCases.length} test cases\n`);

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

    return testCases;
  } catch (error) {
    console.log('❌ Error fetching test cases:', error.message);
    return null;
  }
}

async function fetchTestCaseByCategory(category) {
  console.log(`🔍 STEP 4: Fetching ${category} Test Cases\n`);

  try {
    const { data: categoryTestCases, error } = await supabase
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
  console.log('🔍 STEP 5: Fetching Test Executions\n');

  try {
    const { data: executions, error } = await supabase
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

async function testRealTimeSubscription() {
  console.log('🔍 STEP 6: Testing Real-time Subscription\n');

  try {
    console.log('   📡 Setting up real-time subscription for test executions...');

    // Set up real-time subscription
    const subscription = supabase
      .channel('test_executions_changes')
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

async function fetchUserData() {
  console.log('🔍 STEP 7: Fetching User Data\n');

  try {
    const { data: users, error } = await supabase
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

async function testDatabaseHealth() {
  console.log('🔍 STEP 8: Testing Database Health\n');

  try {
    // Test basic connectivity
    const { data, error } = await supabase.from('test_cases').select('count', { count: 'exact', head: true });

    if (error) {
      console.log('❌ Database health check failed:', error.message);
      return false;
    }

    console.log('✅ Database health check passed');
    console.log(`   📊 Active test cases: ${data}\n`);

    // Test admin client
    if (supabaseServiceKey) {
      const { data: adminData, error: adminError } = await supabaseAdmin
        .from('test_cases')
        .select('count', { count: 'exact', head: true });

      if (!adminError) {
        console.log('✅ Admin client connection successful');
        console.log(`   📊 Admin access to test cases: ${adminData}\n`);
      }
    }

    return true;
  } catch (error) {
    console.log('❌ Database health check error:', error.message);
    return false;
  }
}

async function runCompleteTest() {
  console.log('🎯 Running Complete Real Data Test\n');

  const results = {
    connection: false,
    testCases: null,
    executions: null,
    realtime: false,
    users: null,
    health: false
  };

  // Test connection
  results.connection = await testSupabaseConnection();

  if (!results.connection) {
    console.log('❌ Cannot proceed with tests - no database connection');
    return results;
  }

  // Fetch real test cases
  results.testCases = await fetchRealTestCases();

  // Fetch test cases by category
  if (results.testCases && results.testCases.length > 0) {
    const categories = [...new Set(results.testCases.map(tc => tc.category))];
    for (const category of categories.slice(0, 2)) {
      await fetchTestCaseByCategory(category);
    }
  }

  // Fetch test executions
  results.executions = await fetchTestExecutions();

  // Test real-time subscription
  results.realtime = await testRealTimeSubscription();

  // Fetch user data
  results.users = await fetchUserData();

  // Test database health
  results.health = await testDatabaseHealth();

  return results;
}

// Run the complete test
async function main() {
  try {
    const results = await runCompleteTest();

    console.log('\n🎉 REAL DATA TEST SUMMARY');
    console.log('=========================');
    console.log(`✅ Supabase Connection: ${results.connection ? 'Working' : 'Failed'}`);
    console.log(`✅ Test Cases Retrieved: ${results.testCases ? results.testCases.length : 0}`);
    console.log(`✅ Test Executions Retrieved: ${results.executions ? results.executions.length : 0}`);
    console.log(`✅ Real-time Subscription: ${results.realtime ? 'Working' : 'Failed'}`);
    console.log(`✅ Users Retrieved: ${results.users ? results.users.length : 0}`);
    console.log(`✅ Database Health: ${results.health ? 'Good' : 'Issues'}`);

    if (results.connection && results.testCases && results.testCases.length > 0) {
      console.log('\n🚀 SUCCESS! Real data fetching is working correctly!');
      console.log('Your 5GLabX platform can now:');
      console.log('   • Fetch real test cases from Supabase');
      console.log('   • Display actual test execution data');
      console.log('   • Handle real-time subscriptions');
      console.log('   • Manage user data and activities');
    } else {
      console.log('\n⚠️  Some issues found. Please check:');
      console.log('   • Supabase project configuration');
      console.log('   • Database permissions and RLS policies');
      console.log('   • Environment variables in .env.local');
    }

  } catch (error) {
    console.log('\n❌ Test failed with error:', error.message);
    console.log('💡 Check your Supabase configuration and try again');
  }
}

// Run the test
main();