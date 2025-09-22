#!/usr/bin/env node

/**
 * Test Database Tables Access
 * Tests if tables exist and can be accessed
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🧪 Testing Database Tables Access\n');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTables() {
  console.log('🔍 Testing table access...\n');

  const tables = [
    { name: 'test_cases', query: 'SELECT COUNT(*) as count FROM test_cases' },
    { name: 'users', query: 'SELECT COUNT(*) as count FROM users' },
    { name: 'test_case_messages', query: 'SELECT COUNT(*) as count FROM test_case_messages' },
    { name: 'test_case_executions', query: 'SELECT COUNT(*) as count FROM test_case_executions' }
  ];

  for (const table of tables) {
    try {
      console.log(`📋 Testing ${table.name}...`);

      // Try to access the table
      const { data, error } = await supabase.rpc('execute_sql', {
        sql: table.query
      });

      if (error) {
        // If RPC fails, try direct table access
        const { data: directData, error: directError } = await supabase
          .from(table.name)
          .select('*')
          .limit(1);

        if (directError) {
          console.log(`❌ ${table.name}: ${directError.message}`);
        } else {
          console.log(`✅ ${table.name}: Accessible (found ${directData?.length || 0} records)`);
        }
      } else {
        console.log(`✅ ${table.name}: Accessible via RPC (count: ${data?.[0]?.count || 0})`);
      }

    } catch (error) {
      console.log(`❌ ${table.name}: ${error.message}`);
    }

    console.log('---');
  }

  console.log('\n🧪 Creating test data...\n');

  try {
    // Create a test user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email: 'test@5glabx.com',
        full_name: 'Test User',
        role: 'user',
        subscription_tier: 'free'
      })
      .select()
      .single();

    if (userError) {
      console.log('⚠️ User creation:', userError.message);
    } else {
      console.log('✅ Test user created:', user.id);

      // Create a test case
      const { data: testCase, error: testCaseError } = await supabase
        .from('test_cases')
        .insert({
          name: 'Basic Connectivity Test',
          description: 'Test case for database connectivity',
          protocol: '5G_NR',
          layer: 'PDCP',
          complexity: 'beginner',
          category: 'connectivity',
          test_scenario: 'Basic ping test',
          test_objective: 'Verify database connectivity',
          created_by: user.id
        })
        .select()
        .single();

      if (testCaseError) {
        console.log('⚠️ Test case creation:', testCaseError.message);
      } else {
        console.log('✅ Test case created:', testCase.id);

        // Create test case message
        const { data: message, error: messageError } = await supabase
          .from('test_case_messages')
          .insert({
            test_case_id: testCase.id,
            step_order: 1,
            direction: 'uplink',
            layer: 'PDCP',
            protocol: '5G_NR',
            message_type: 'data',
            message_name: 'Test Message',
            message_description: 'Test message for connectivity verification'
          })
          .select()
          .single();

        if (messageError) {
          console.log('⚠️ Message creation:', messageError.message);
        } else {
          console.log('✅ Test message created:', message.id);
        }

        // Clean up - delete test data
        console.log('\n🧹 Cleaning up test data...');

        await supabase.from('test_case_messages').delete().eq('id', message.id);
        await supabase.from('test_cases').delete().eq('id', testCase.id);
        await supabase.from('users').delete().eq('id', user.id);

        console.log('✅ Test data cleaned up');
      }
    }

  } catch (error) {
    console.log('❌ Test data creation failed:', error.message);
  }

  console.log('\n🎉 Database testing completed!');
}

// Run the tests
testTables().catch(console.error);