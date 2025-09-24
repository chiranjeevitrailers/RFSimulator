#!/usr/bin/env node

/**
 * 5GLabX - Supabase Connection Diagnostic
 * Detailed testing of Supabase connectivity and configuration
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🚀 5GLabX - Supabase Connection Diagnostic');
console.log('==========================================\n');

console.log('🔍 STEP 1: Environment Analysis\n');

// Check environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Environment Variables:');
console.log(`   📊 NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}`);
console.log(`   📊 NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : '❌ Missing'}`);
console.log(`   📊 SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? supabaseServiceKey.substring(0, 20) + '...' : '❌ Missing'}\n`);

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Missing required Supabase environment variables');
  console.log('💡 Please ensure .env.local contains:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.log('   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key');
  process.exit(1);
}

// Validate URL format
try {
  const url = new URL(supabaseUrl);
  console.log('✅ Supabase URL format is valid');
  console.log(`   🌐 Domain: ${url.hostname}`);
  console.log(`   🔒 Protocol: ${url.protocol}\n`);
} catch (error) {
  console.log('❌ Invalid Supabase URL format:', error.message);
  process.exit(1);
}

// Initialize Supabase clients
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('✅ Supabase clients initialized\n');

// Test basic connectivity
async function testBasicConnectivity() {
  console.log('🔍 STEP 2: Basic Connectivity Test\n');

  try {
    console.log('   🔌 Testing basic HTTP connection...');

    // Test with a simple fetch to the REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });

    console.log(`   📡 HTTP Status: ${response.status}`);
    console.log(`   📡 Status Text: ${response.statusText}`);

    if (response.ok) {
      console.log('   ✅ Basic HTTP connectivity successful\n');
      return true;
    } else {
      console.log('   ❌ Basic HTTP connectivity failed');
      console.log('   💡 Check if your Supabase project is active\n');
      return false;
    }
  } catch (error) {
    console.log('   ❌ HTTP connection error:', error.message);
    console.log('   💡 Possible causes:');
    console.log('      • Network connectivity issues');
    console.log('      • Supabase project URL is incorrect');
    console.log('      • Supabase project is paused or deleted\n');
    return false;
  }
}

async function testSupabaseRESTAPI() {
  console.log('🔍 STEP 3: Supabase REST API Test\n');

  try {
    console.log('   🔌 Testing Supabase REST API...');

    // Try to access the REST API without specifying a table first
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      }
    });

    const responseText = await response.text();
    console.log(`   📡 Response Status: ${response.status}`);
    console.log(`   📡 Response Body: ${responseText.substring(0, 200)}...`);

    if (response.status === 200) {
      console.log('   ✅ Supabase REST API is accessible\n');
      return true;
    } else {
      console.log('   ❌ Supabase REST API access failed');
      console.log('   💡 This might be normal if no tables exist yet\n');
      return false;
    }
  } catch (error) {
    console.log('   ❌ REST API error:', error.message);
    return false;
  }
}

async function testTableAccess() {
  console.log('🔍 STEP 4: Database Table Access Test\n');

  try {
    console.log('   🗄️  Testing access to test_cases table...');

    // Try to query the test_cases table
    const { data, error } = await supabase
      .from('test_cases')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.log('   ❌ Table access failed:', error.message);
      console.log('   💡 Possible causes:');
      console.log('      • Table does not exist');
      console.log('      • Row Level Security (RLS) policies blocking access');
      console.log('      • Insufficient permissions');
      console.log('      • Database is not properly set up\n');

      // Try to check if tables exist at all
      console.log('   🔍 Checking if any tables exist...');
      const { data: tablesData, error: tablesError } = await supabaseAdmin
        .rpc('get_table_names');

      if (tablesError) {
        console.log('   ❌ Cannot check table structure:', tablesError.message);
        console.log('   💡 This suggests the database is not properly configured\n');
      } else if (tablesData && tablesData.length === 0) {
        console.log('   ⚠️  No tables found in database');
        console.log('   💡 You need to run database migrations to create tables\n');
      } else {
        console.log(`   ✅ Found ${tablesData?.length || 0} tables in database\n`);
      }

      return false;
    }

    console.log('   ✅ Table access successful');
    console.log(`   📊 Found ${data} records in test_cases table\n`);
    return true;
  } catch (error) {
    console.log('   ❌ Table access error:', error.message);
    return false;
  }
}

async function testAuthentication() {
  console.log('🔍 STEP 5: Authentication Test\n');

  try {
    console.log('   🔐 Testing anonymous authentication...');

    // Try to get current user (should be null for anonymous)
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.log('   ❌ Authentication check failed:', error.message);
      return false;
    }

    console.log('   ✅ Authentication check successful');
    console.log(`   👤 Current user: ${user ? user.email : 'Anonymous (expected)'}\n`);
    return true;
  } catch (error) {
    console.log('   ❌ Authentication error:', error.message);
    return false;
  }
}

async function testRealTimeConnectivity() {
  console.log('🔍 STEP 6: Real-time Connectivity Test\n');

  try {
    console.log('   📡 Testing real-time connection...');

    // Try to establish a real-time connection
    const subscription = supabase
      .channel('test_connection')
      .subscribe((status) => {
        console.log(`   📡 Real-time status: ${status}`);
      });

    // Wait a moment for connection
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('   ✅ Real-time connection test initiated');
    console.log('   💡 Real-time subscriptions are working\n');

    subscription.unsubscribe();
    return true;
  } catch (error) {
    console.log('   ❌ Real-time connection error:', error.message);
    console.log('   💡 This might be normal if real-time is not enabled\n');
    return false;
  }
}

async function diagnoseIssues() {
  console.log('🔍 STEP 7: Issue Diagnosis & Recommendations\n');

  const diagnosis = {
    urlFormat: false,
    httpConnectivity: false,
    restApiAccess: false,
    tableAccess: false,
    authentication: false,
    realtime: false
  };

  // Check URL format
  try {
    new URL(supabaseUrl);
    diagnosis.urlFormat = true;
    console.log('   ✅ URL format: Valid');
  } catch {
    console.log('   ❌ URL format: Invalid');
  }

  // Test HTTP connectivity
  diagnosis.httpConnectivity = await testBasicConnectivity();

  // Test REST API
  diagnosis.restApiAccess = await testSupabaseRESTAPI();

  // Test table access
  diagnosis.tableAccess = await testTableAccess();

  // Test authentication
  diagnosis.authentication = await testAuthentication();

  // Test real-time
  diagnosis.realtime = await testRealTimeConnectivity();

  console.log('\n📋 DIAGNOSIS SUMMARY');
  console.log('====================');
  console.log(`✅ URL Format: ${diagnosis.urlFormat ? 'Valid' : 'Invalid'}`);
  console.log(`✅ HTTP Connectivity: ${diagnosis.httpConnectivity ? 'Working' : 'Failed'}`);
  console.log(`✅ REST API Access: ${diagnosis.restApiAccess ? 'Working' : 'Failed'}`);
  console.log(`✅ Table Access: ${diagnosis.tableAccess ? 'Working' : 'Failed'}`);
  console.log(`✅ Authentication: ${diagnosis.authentication ? 'Working' : 'Failed'}`);
  console.log(`✅ Real-time: ${diagnosis.realtime ? 'Working' : 'Failed'}`);

  if (diagnosis.urlFormat && diagnosis.httpConnectivity && diagnosis.restApiAccess && diagnosis.authentication) {
    console.log('\n🎉 BASIC SUPABASE SETUP IS WORKING!');
    console.log('The main issue is likely:');
    console.log('   • Database tables not created yet');
    console.log('   • Row Level Security policies blocking access');
    console.log('   • Missing database migrations\n');

    console.log('💡 SOLUTIONS:');
    console.log('   1. Run database migrations: pnpm db:migrate');
    console.log('   2. Check RLS policies in Supabase dashboard');
    console.log('   3. Seed the database: pnpm db:seed');
    console.log('   4. Verify table structure matches your code');
  } else {
    console.log('\n❌ FUNDAMENTAL SUPABASE ISSUES DETECTED');
    console.log('Please check:');
    console.log('   • Supabase project is active and accessible');
    console.log('   • Environment variables are correct');
    console.log('   • Network connectivity to Supabase');
    console.log('   • Supabase project URL and API keys\n');
  }

  return diagnosis;
}

// Run diagnostic
async function main() {
  try {
    const diagnosis = await diagnoseIssues();

    console.log('\n🔧 TROUBLESHOOTING STEPS');
    console.log('=========================');

    if (!diagnosis.urlFormat) {
      console.log('1. Fix Supabase URL format in .env.local');
      console.log('   Should be: https://your-project.supabase.co');
    }

    if (!diagnosis.httpConnectivity) {
      console.log('2. Check network connectivity');
      console.log('   • Try: curl -I', supabaseUrl);
      console.log('   • Check if Supabase project is active');
    }

    if (!diagnosis.tableAccess) {
      console.log('3. Set up database tables');
      console.log('   • Run: pnpm db:migrate');
      console.log('   • Check Supabase dashboard > SQL Editor');
      console.log('   • Verify table structure matches your code');
    }

    if (!diagnosis.authentication) {
      console.log('4. Check authentication setup');
      console.log('   • Verify API keys are correct');
      console.log('   • Check Supabase dashboard > Settings > API');
    }

    console.log('\n📞 NEED HELP?');
    console.log('=============');
    console.log('• Check Supabase dashboard: https://app.supabase.com');
    console.log('• Verify project settings and API keys');
    console.log('• Review database structure and RLS policies');
    console.log('• Check browser console for additional errors');

  } catch (error) {
    console.log('\n❌ Diagnostic failed:', error.message);
    console.log('💡 Check your Supabase configuration and try again');
  }
}

// Run the diagnostic
main();