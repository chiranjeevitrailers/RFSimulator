#!/usr/bin/env node

/**
 * 5GLabX - Simple Supabase Connectivity Test
 * Quick test to check basic Supabase connection
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🚀 5GLabX - Simple Supabase Test');
console.log('=================================\n');

// Check environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Environment Check:');
console.log(`   📊 URL: ${supabaseUrl ? 'Set ✓' : '❌ Missing'}`);
console.log(`   📊 Key: ${supabaseAnonKey ? 'Set ✓' : '❌ Missing'}\n`);

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Missing Supabase credentials in .env.local');
  console.log('Please ensure your .env.local file contains:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

// Test 1: Basic URL validation
console.log('🔍 Test 1: URL Validation');
try {
  const url = new URL(supabaseUrl);
  console.log(`   ✅ Valid URL: ${url.hostname}`);
} catch (error) {
  console.log(`   ❌ Invalid URL: ${error.message}`);
  process.exit(1);
}

// Test 2: Basic HTTP connectivity
console.log('\n🔍 Test 2: HTTP Connectivity');
(async () => {
  try {
    console.log(`   🔌 Testing: ${supabaseUrl}/rest/v1/`);

    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      timeout: 10000 // 10 second timeout
    });

    console.log(`   📡 Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      console.log('   ✅ HTTP connection successful!\n');

      // Test 3: Supabase API access
      console.log('🔍 Test 3: Supabase API Access');
      const response2 = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      const text = await response2.text();
      console.log(`   📡 API Response: ${response2.status}`);
      console.log(`   📄 Response: ${text.substring(0, 100)}...`);

      if (response2.status === 200) {
        console.log('   ✅ Supabase API is accessible!\n');

        // Test 4: Try to access a table (this might fail if tables don't exist)
        console.log('🔍 Test 4: Table Access (test_cases)');
        try {
          const { createClient } = require('@supabase/supabase-js');
          const supabase = createClient(supabaseUrl, supabaseAnonKey);

          const { data, error } = await supabase
            .from('test_cases')
            .select('count', { count: 'exact', head: true });

          if (error) {
            console.log(`   ⚠️  Table access failed (expected): ${error.message}`);
            console.log('   💡 This is normal if database tables haven\'t been created yet');
            console.log('   💡 Solution: Run database migrations with: pnpm db:migrate\n');
          } else {
            console.log(`   ✅ Table access successful! Records: ${data}`);
          }
        } catch (tableError) {
          console.log(`   ❌ Table access error: ${tableError.message}\n`);
        }

        console.log('🎉 SUCCESS SUMMARY');
        console.log('==================');
        console.log('✅ Environment variables: Configured correctly');
        console.log('✅ HTTP connectivity: Working');
        console.log('✅ Supabase API: Accessible');
        console.log('✅ Basic setup: Complete');
        console.log('\n📝 Next steps:');
        console.log('1. Run database migrations: pnpm db:migrate');
        console.log('2. Seed database: pnpm db:seed');
        console.log('3. Test real data fetching');

      } else {
        console.log('   ❌ Supabase API not accessible');
        console.log('   💡 Check your Supabase project status');
      }

    } else {
      console.log('   ❌ HTTP connection failed');
      console.log('   💡 Possible issues:');
      console.log('      • Supabase project is paused');
      console.log('      • Incorrect project URL');
      console.log('      • Network connectivity issues');
    }

  } catch (error) {
    console.log(`   ❌ Connection error: ${error.message}`);
    console.log('   💡 Check your internet connection and Supabase project status');
  }
})();