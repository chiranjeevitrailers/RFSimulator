#!/usr/bin/env node

/**
 * Simple Supabase Connection Test
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🧪 Testing Supabase Connection...\n');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Environment variables not loaded');
  console.log('URL:', supabaseUrl ? 'OK' : 'MISSING');
  console.log('KEY:', supabaseKey ? 'OK' : 'MISSING');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔍 Testing basic connection...');

    // Test 1: Simple table query
    const { data: testCases, error: testCasesError } = await supabase
      .from('test_cases')
      .select('id, name')
      .limit(1);

    if (testCasesError) {
      console.log('❌ Test cases query failed:', testCasesError.message);
    } else {
      console.log('✅ Test cases table accessible');
      console.log('📊 Found', testCases?.length || 0, 'test cases');
    }

    // Test 2: Check categories table
    const { data: categories, error: categoriesError } = await supabase
      .from('test_case_categories')
      .select('id, name')
      .limit(1);

    if (categoriesError) {
      console.log('❌ Categories query failed:', categoriesError.message);
    } else {
      console.log('✅ Categories table accessible');
      console.log('📊 Found', categories?.length || 0, 'categories');
    }

    // Test 3: Check messages table
    const { data: messages, error: messagesError } = await supabase
      .from('test_case_messages')
      .select('id')
      .limit(1);

    if (messagesError) {
      console.log('❌ Messages query failed:', messagesError.message);
    } else {
      console.log('✅ Messages table accessible');
      console.log('📊 Found', messages?.length || 0, 'messages');
    }

  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
  }
}

testConnection();