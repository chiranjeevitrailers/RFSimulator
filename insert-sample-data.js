#!/usr/bin/env node

/**
 * 5GLabX - Insert Sample Data
 * Populates the database with sample test cases and data
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🚀 5GLabX - Insert Sample Data');
console.log('==============================\n');

// Check environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing Supabase credentials');
  console.log('Please ensure .env.local contains:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key');
  process.exit(1);
}

// Initialize Supabase admin client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const sampleTestCases = [
  {
    name: '5G NR Initial Access Test',
    description: 'Test case for 5G NR initial access procedures including cell search, synchronization, and random access',
    category: '5G_NR',
    subcategory: 'Initial Access',
    complexity: 'intermediate',
    duration: 120,
    protocol_layers: ['PHY', 'MAC', 'RRC'],
    test_data: {
      frequency: 3500,
      bandwidth: 100,
      duplex_mode: 'TDD',
      ssb_pattern: 'Case C',
      prach_config: 'Type A',
      msg1_fdm: 1,
      ssb_per_ro: 1,
      cb_preambles_per_ssb: 24
    },
    expected_results: {
      success_rate: 95,
      latency_ms: 50,
      throughput_mbps: 100,
      sinr_db: 15,
      rsrp_dbm: -80
    },
    is_active: true,
    tags: ['5G', 'NR', 'Initial Access', 'Cell Search', 'RACH']
  },
  {
    name: 'LTE Handover Test',
    description: 'Test case for LTE handover procedures including measurement reporting and HO command',
    category: '4G_LTE',
    subcategory: 'Handover',
    complexity: 'intermediate',
    duration: 180,
    protocol_layers: ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC'],
    test_data: {
      source_frequency: 1800,
      target_frequency: 2600,
      handover_type: 'Intra-frequency',
      measurement_event: 'A3',
      hysteresis: 2,
      time_to_trigger: 100,
      filter_coefficient: 4
    },
    expected_results: {
      success_rate: 98,
      interruption_time_ms: 40,
      ping_pong_rate: 5,
      rsrp_source: -70,
      rsrp_target: -65
    },
    is_active: true,
    tags: ['4G', 'LTE', 'Handover', 'Mobility', 'RRC']
  },
  {
    name: 'IMS VoLTE Call Test',
    description: 'Test case for IMS VoLTE voice call establishment and quality measurement',
    category: 'IMS_SIP',
    subcategory: 'VoLTE',
    complexity: 'advanced',
    duration: 300,
    protocol_layers: ['IMS', 'SIP', 'RTP', 'RTCP'],
    test_data: {
      call_type: 'VoLTE',
      codec: 'AMR-WB',
      bandwidth: '12.65 kbps',
      qci: 1,
      qos_profile: 'Voice',
      sip_registration: true,
      emergency_call: false
    },
    expected_results: {
      success_rate: 99,
      setup_time_ms: 2000,
      mos_score: 4.0,
      packet_loss_rate: 1,
      jitter_ms: 10
    },
    is_active: true,
    tags: ['IMS', 'VoLTE', 'SIP', 'Voice', 'QoS']
  },
  {
    name: 'O-RAN RIC Test',
    description: 'Test case for O-RAN RIC functionality including xApp integration and policy management',
    category: 'O_RAN',
    subcategory: 'RIC',
    complexity: 'advanced',
    duration: 240,
    protocol_layers: ['O-RAN', 'E2', 'A1'],
    test_data: {
      ric_type: 'Near-RT RIC',
      xapp_category: 'Control',
      policy_type: 'Admission Control',
      e2_nodes: 3,
      subscription_period: 1000,
      control_loop: true
    },
    expected_results: {
      success_rate: 96,
      response_time_ms: 100,
      policy_enforcement_rate: 98,
      ric_load_percent: 30,
      subscription_success_rate: 99
    },
    is_active: true,
    tags: ['O-RAN', 'RIC', 'xApp', 'E2', 'A1']
  },
  {
    name: 'NB-IoT Connection Test',
    description: 'Test case for NB-IoT device connection, coverage enhancement, and power saving',
    category: 'NB_IoT',
    subcategory: 'Connection',
    complexity: 'beginner',
    duration: 60,
    protocol_layers: ['PHY', 'MAC', 'RRC'],
    test_data: {
      coverage_class: 'CE Level 0',
      power_class: '3',
      drx_cycle: '1280 ms',
      repetitions: 1,
      subcarrier_spacing: '15 kHz',
      bandwidth: '180 kHz'
    },
    expected_results: {
      success_rate: 97,
      connection_time_s: 5,
      battery_life_days: 10,
      mcl_db: 144,
      rssi_dbm: -100
    },
    is_active: true,
    tags: ['NB-IoT', 'IoT', 'LPWAN', 'Coverage']
  }
];

const sampleUsers = [
  {
    email: 'admin@5glabx.com',
    full_name: '5GLabX Administrator',
    role: 'admin',
    subscription_tier: 'enterprise',
    subscription_status: 'active',
    is_active: true
  },
  {
    email: 'user@5glabx.com',
    full_name: 'Test User',
    role: 'user',
    subscription_tier: 'pro',
    subscription_status: 'active',
    is_active: true
  }
];

async function insertSampleTestCases() {
  console.log('🗄️  Inserting sample test cases...');

  try {
    const { data, error } = await supabaseAdmin
      .from('test_cases')
      .insert(sampleTestCases)
      .select();

    if (error) {
      console.log('❌ Failed to insert test cases:', error.message);
      return false;
    }

    console.log(`✅ Successfully inserted ${data.length} test cases`);
    return true;
  } catch (error) {
    console.log('❌ Error inserting test cases:', error.message);
    return false;
  }
}

async function insertSampleUsers() {
  console.log('👤 Inserting sample users...');

  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(sampleUsers)
      .select();

    if (error) {
      console.log('❌ Failed to insert users:', error.message);
      return false;
    }

    console.log(`✅ Successfully inserted ${data.length} users`);
    return true;
  } catch (error) {
    console.log('❌ Error inserting users:', error.message);
    return false;
  }
}

async function insertSampleTestExecutions() {
  console.log('📋 Inserting sample test executions...');

  try {
    // First get the test cases we just inserted
    const { data: testCases, error: tcError } = await supabaseAdmin
      .from('test_cases')
      .select('id, name')
      .order('created_at', { ascending: false })
      .limit(3);

    if (tcError || !testCases || testCases.length === 0) {
      console.log('⚠️  No test cases found, skipping test executions');
      return false;
    }

    // Get users
    const { data: users, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .limit(2);

    if (userError || !users || users.length === 0) {
      console.log('⚠️  No users found, skipping test executions');
      return false;
    }

    const executions = [];
    const now = new Date();

    for (let i = 0; i < 3; i++) {
      const testCase = testCases[i % testCases.length];
      const user = users[i % users.length];

      executions.push({
        user_id: user.id,
        test_case_id: testCase.id,
        status: i === 0 ? 'completed' : i === 1 ? 'running' : 'pending',
        start_time: new Date(now.getTime() - (i * 3600000)).toISOString(), // Different start times
        end_time: i === 0 ? new Date(now.getTime() - (i * 3600000) + 60000).toISOString() : null,
        results: i === 0 ? {
          success: true,
          duration: 120,
          messages_processed: 150,
          validation_passed: 148,
          errors: 2
        } : null,
        logs: i === 0 ? [
          { timestamp: now.toISOString(), level: 'info', message: 'Test execution started' },
          { timestamp: new Date(now.getTime() + 30000).toISOString(), level: 'info', message: 'Test completed successfully' }
        ] : []
      });
    }

    const { data, error } = await supabaseAdmin
      .from('test_executions')
      .insert(executions)
      .select();

    if (error) {
      console.log('❌ Failed to insert test executions:', error.message);
      return false;
    }

    console.log(`✅ Successfully inserted ${data.length} test executions`);
    return true;
  } catch (error) {
    console.log('❌ Error inserting test executions:', error.message);
    return false;
  }
}

async function main() {
  try {
    console.log('🎯 Populating 5GLabX database with sample data...\n');

    // Insert test cases
    const testCasesInserted = await insertSampleTestCases();

    // Insert users
    const usersInserted = await insertSampleUsers();

    // Insert test executions
    const executionsInserted = await insertSampleTestExecutions();

    console.log('\n📊 SAMPLE DATA INSERTION SUMMARY');
    console.log('================================');
    console.log(`✅ Test Cases: ${testCasesInserted ? 'Inserted' : 'Failed'}`);
    console.log(`✅ Users: ${usersInserted ? 'Inserted' : 'Failed'}`);
    console.log(`✅ Test Executions: ${executionsInserted ? 'Inserted' : 'Failed'}`);

    if (testCasesInserted && usersInserted && executionsInserted) {
      console.log('\n🎉 SUCCESS! Database populated with sample data!');
      console.log('Your 5GLabX platform now has:');
      console.log('   • 5 comprehensive test cases');
      console.log('   • 2 sample users (admin and user)');
      console.log('   • 3 test executions with different statuses');
      console.log('\n📝 Next steps:');
      console.log('1. Run: node test-real-supabase-data.js');
      console.log('2. Start your application: npm run dev');
      console.log('3. Test the web interface with real data');
    } else {
      console.log('\n⚠️  Some data insertion failed');
      console.log('Check the logs above for specific errors');
    }

  } catch (error) {
    console.log('\n❌ Sample data insertion failed:', error.message);
    console.log('💡 Check your Supabase configuration and try again');
  }
}

// Run the sample data insertion
main();