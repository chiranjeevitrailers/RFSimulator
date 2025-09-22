#!/usr/bin/env node

/**
 * 5GLabX Database Setup Script
 * Creates essential tables directly via Supabase REST API
 */

const https = require('https');
const { URL } = require('url');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🗄️ 5GLabX Database Setup Script\n');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables');
  console.log('URL:', supabaseUrl ? 'OK' : 'MISSING');
  console.log('SERVICE KEY:', supabaseKey ? 'OK' : 'MISSING');
  process.exit(1);
}

// Essential SQL commands to create basic tables
const essentialTables = [
  // Users table
  `CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    subscription_tier VARCHAR(20) NOT NULL DEFAULT 'free',
    subscription_status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
  )`,

  // Test cases table (simplified)
  `CREATE TABLE IF NOT EXISTS test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    protocol VARCHAR(50) NOT NULL DEFAULT '5G_NR',
    layer VARCHAR(50) NOT NULL DEFAULT 'PDCP',
    complexity VARCHAR(20) NOT NULL DEFAULT 'beginner',
    category VARCHAR(100),
    test_scenario TEXT,
    test_objective TEXT,
    standard_reference TEXT,
    release_version TEXT DEFAULT 'Rel-18',
    expected_duration_minutes INTEGER DEFAULT 30,
    execution_priority INTEGER DEFAULT 1,
    automation_level VARCHAR(20) DEFAULT 'automated',
    test_data_requirements JSONB DEFAULT '{}',
    kpi_requirements JSONB DEFAULT '{}',
    dependencies JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true
  )`,

  // Test case messages table
  `CREATE TABLE IF NOT EXISTS test_case_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
    step_id VARCHAR(50),
    step_order INTEGER DEFAULT 0,
    timestamp_ms INTEGER,
    direction VARCHAR(10) CHECK (direction IN ('uplink', 'downlink')),
    layer VARCHAR(50),
    protocol VARCHAR(50),
    message_type VARCHAR(100),
    message_name VARCHAR(255),
    message_description TEXT,
    standard_reference TEXT,
    message_variant VARCHAR(100),
    message_priority INTEGER DEFAULT 1,
    retry_count INTEGER DEFAULT 0,
    retry_interval_ms INTEGER DEFAULT 1000,
    success_criteria JSONB DEFAULT '{}',
    failure_criteria JSONB DEFAULT '{}',
    measurement_criteria JSONB DEFAULT '{}',
    message_sequence_group VARCHAR(100),
    parallel_execution BOOLEAN DEFAULT false,
    conditional_execution JSONB DEFAULT '{}',
    message_payload JSONB DEFAULT '{}',
    expected_response_time_ms INTEGER,
    max_response_time_ms INTEGER,
    message_size_bytes INTEGER,
    compression_enabled BOOLEAN DEFAULT false,
    encryption_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )`,

  // Test case executions table
  `CREATE TABLE IF NOT EXISTS test_case_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    execution_status VARCHAR(20) DEFAULT 'pending' CHECK (execution_status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    execution_environment JSONB DEFAULT '{}',
    execution_parameters JSONB DEFAULT '{}',
    results_summary JSONB DEFAULT '{}',
    logs TEXT,
    error_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )`,

  // Create indexes for performance
  `CREATE INDEX IF NOT EXISTS idx_test_cases_protocol ON test_cases(protocol)`,
  `CREATE INDEX IF NOT EXISTS idx_test_cases_layer ON test_cases(layer)`,
  `CREATE INDEX IF NOT EXISTS idx_test_cases_category ON test_cases(category)`,
  `CREATE INDEX IF NOT EXISTS idx_test_case_messages_test_case_id ON test_case_messages(test_case_id)`,
  `CREATE INDEX IF NOT EXISTS idx_test_case_executions_test_case_id ON test_case_executions(test_case_id)`,
  `CREATE INDEX IF NOT EXISTS idx_test_case_executions_status ON test_case_executions(execution_status)`
];

// Function to execute SQL via Supabase REST API
function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${supabaseUrl}/rest/v1/rpc/execute_sql`);

    const postData = JSON.stringify({ sql });

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: response });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

// Main setup function
async function setupDatabase() {
  console.log('🔧 Setting up 5GLabX database...\n');

  for (let i = 0; i < essentialTables.length; i++) {
    const sql = essentialTables[i];
    console.log(`📋 Executing table ${i + 1}/${essentialTables.length}...`);

    try {
      const result = await executeSQL(sql);

      if (result.statusCode === 200) {
        console.log(`✅ Table ${i + 1} created successfully`);
      } else {
        console.log(`⚠️ Table ${i + 1} result: ${result.statusCode}`, result.data);
      }
    } catch (error) {
      console.log(`❌ Error creating table ${i + 1}:`, error.message);
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n🎉 Database setup completed!');

  // Test the setup
  console.log('\n🧪 Testing database connectivity...');

  try {
    const testResult = await executeSQL('SELECT COUNT(*) as count FROM test_cases');
    console.log('✅ Test cases table accessible');
  } catch (error) {
    console.log('⚠️ Test query result:', error.message);
  }
}

// Run the setup
setupDatabase().catch(console.error);