#!/usr/bin/env node

/**
 * 5GLabX - Test Database Constraints
 * Tests what values are allowed in the test_case_executions table
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking test_case_executions table constraints...\n');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function testStatusValues() {
  console.log('🧪 Testing valid status values...');

  const testId = 'test-' + Date.now();
  const testUserId = '550e8400-e29b-41d4-a716-446655440000'; // Valid UUID

  const validStatuses = ['queued', 'running', 'completed', 'failed', 'cancelled', 'timeout', 'pending'];

  for (const status of validStatuses) {
    try {
      console.log(`   Testing status: "${status}"`);

      const { error: insertError } = await supabase
        .from('test_case_executions')
        .insert({
          id: testId,
          user_id: testUserId,
          test_case_id: '7004525a-5fb2-4654-bc91-44ccde3eb358',
          status: status,
          execution_mode: 'simulation',
          progress_percentage: 0,
          start_time: new Date().toISOString()
        });

      if (!insertError) {
        console.log(`   ✅ Status "${status}" is valid`);

        // Clean up the test record
        await supabase.from('test_case_executions').delete().eq('id', testId);
        return status;
      } else {
        console.log(`   ❌ Status "${status}" failed:`, insertError.message);
      }
    } catch (err) {
      console.log(`   ❌ Status "${status}" exception:`, err.message);
    }
  }

  console.log('   ❌ No valid status found');
  return null;
}

async function main() {
  const validStatus = await testStatusValues();

  if (validStatus) {
    console.log(`\n✅ Valid status found: "${validStatus}"`);
    console.log('🔧 Updating API to use this status value...');
  } else {
    console.log('\n❌ No valid status values found');
    console.log('💡 The database might have strict constraints');
  }
}

main();