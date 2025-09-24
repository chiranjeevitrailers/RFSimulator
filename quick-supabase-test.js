#!/usr/bin/env node

/**
 * 5GLabX - Quick Supabase Test
 * Simple test to verify Supabase connectivity
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🚀 5GLabX - Quick Supabase Test');
console.log('===============================\n');

// Check environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing Supabase credentials in .env.local');
  console.log('Please ensure your .env.local file contains:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key');
  process.exit(1);
}

// Initialize Supabase admin client
const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function quickTest() {
  try {
    console.log('🔍 Testing basic connectivity...');

    // Test 1: Simple query to check if database is accessible
    const { data, error } = await supabaseAdmin
      .from('test_cases')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.log('❌ Database access failed:', error.message);
      console.log('💡 This suggests RLS policies are blocking access or tables don\'t exist');

      // Try to check if we can at least connect to the database
      console.log('🔍 Trying basic connection test...');
      const { data: basicData, error: basicError } = await supabaseAdmin
        .from('test_cases')
        .select('*')
        .limit(1);

      if (basicError) {
        console.log('❌ Cannot connect to database');
        console.log('💡 Check your Supabase project status and credentials');
      } else {
        console.log('✅ Basic connection works but RLS may be blocking access');
        console.log('💡 Check Row Level Security policies in Supabase dashboard');
      }
    } else {
      console.log('✅ Database access successful!');
      console.log(`📊 Test cases in database: ${data}`);
      console.log('🎉 Your database is working correctly!');
    }

  } catch (error) {
    console.log('❌ Connection error:', error.message);
    console.log('💡 Check your internet connection and Supabase project status');
  }
}

quickTest();