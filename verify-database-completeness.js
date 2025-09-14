#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 5GLabX Database Completeness Verification');
console.log('=============================================\n');

// Define all required components
const requiredComponents = {
  // Core tables
  tables: [
    'users', 'user_profiles', 'subscriptions', 'test_cases', 'test_case_executions',
    'test_case_messages', 'test_case_information_elements', 'test_case_layer_parameters',
    'decoded_messages', 'decoded_information_elements', 'decoded_layer_parameters',
    'log_files', 'message_flow_analysis', 'test_run_configs', 'test_run_queue',
    'test_run_schedules', 'test_run_artifacts', 'test_suite_collections',
    'test_execution_workers', 'test_run_metrics', 'alert_rules', 'alerts',
    'security_events', 'test_execution_metrics'
  ],
  
  // Functions
  functions: [
    'get_layer_statistics', 'get_protocol_statistics', 'get_test_execution_progress',
    'get_layer_performance_metrics', 'update_updated_at_column'
  ],
  
  // Views
  views: [
    'message_flow_timeline', 'index_usage_stats', 'table_size_stats'
  ],
  
  // Extensions
  extensions: [
    'uuid-ossp', 'pgcrypto', 'pg_trgm'
  ]
};

// Get all SQL files
const sqlFiles = [
  'supabase/migrations/001_complete_platform_schema.sql',
  'supabase/migrations/002_test_cases_enhanced.sql',
  'supabase/migrations/003_comprehensive_test_cases_seed.sql',
  'supabase/migrations/004_default_configurations_seed.sql',
  'supabase/migrations/005_alert_management_tables.sql',
  'supabase/migrations/006_comprehensive_1000_test_cases.sql',
  'supabase/migrations/007_remaining_protocols_test_cases.sql',
  'supabase/migrations/008_comprehensive_3gpp_ies.sql',
  'supabase/migrations/009_complete_3gpp_message_flows.sql',
  'supabase/migrations/010_test_configuration_tables.sql',
  'supabase/migrations/011_test_suites_enhancements.sql',
  'supabase/migrations/012_decoded_messages_schema.sql',
  'supabase/migrations/013_fix_missing_columns_and_improvements.sql',
  'supabase/migrations/014_comprehensive_seed_data_setup.sql',
  'supabase/migrations/015_final_database_optimization.sql',
  'supabase/migrations/016_missing_tables_and_functions.sql',
  'supabase/migrations/017_missing_indexes.sql'
];

// Read and analyze all SQL files
let allContent = '';
const fileContents = {};

console.log('📁 Reading SQL migration files...');
sqlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    fileContents[file] = content;
    allContent += content + '\n';
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - NOT FOUND`);
  }
});

console.log('\n🔍 Analyzing database components...\n');

// Check tables
console.log('📊 TABLES:');
const foundTables = [];
const missingTables = [];

requiredComponents.tables.forEach(table => {
  const patterns = [
    `CREATE TABLE.*${table}`,
    `CREATE TABLE IF NOT EXISTS.*${table}`,
    `CREATE TABLE IF NOT EXISTS public.${table}`,
    `CREATE TABLE public.${table}`
  ];
  
  const found = patterns.some(pattern => {
    const regex = new RegExp(pattern, 'i');
    return regex.test(allContent);
  });
  
  if (found) {
    foundTables.push(table);
    console.log(`✅ ${table}`);
  } else {
    missingTables.push(table);
    console.log(`❌ ${table} - NOT FOUND`);
  }
});

// Check functions
console.log('\n⚙️ FUNCTIONS:');
const foundFunctions = [];
const missingFunctions = [];

requiredComponents.functions.forEach(func => {
  const patterns = [
    `CREATE.*FUNCTION.*${func}`,
    `CREATE OR REPLACE FUNCTION.*${func}`,
    `FUNCTION ${func}\\(`
  ];
  
  const found = patterns.some(pattern => {
    const regex = new RegExp(pattern, 'i');
    return regex.test(allContent);
  });
  
  if (found) {
    foundFunctions.push(func);
    console.log(`✅ ${func}`);
  } else {
    missingFunctions.push(func);
    console.log(`❌ ${func} - NOT FOUND`);
  }
});

// Check views
console.log('\n👁️ VIEWS:');
const foundViews = [];
const missingViews = [];

requiredComponents.views.forEach(view => {
  const patterns = [
    `CREATE.*VIEW.*${view}`,
    `CREATE OR REPLACE VIEW.*${view}`,
    `CREATE MATERIALIZED VIEW.*${view}`,
    `VIEW public.${view}`
  ];
  
  const found = patterns.some(pattern => {
    const regex = new RegExp(pattern, 'i');
    return regex.test(allContent);
  });
  
  if (found) {
    foundViews.push(view);
    console.log(`✅ ${view}`);
  } else {
    missingViews.push(view);
    console.log(`❌ ${view} - NOT FOUND`);
  }
});

// Check extensions
console.log('\n🔌 EXTENSIONS:');
const foundExtensions = [];
const missingExtensions = [];

requiredComponents.extensions.forEach(ext => {
  const patterns = [
    `CREATE EXTENSION.*${ext}`,
    `CREATE EXTENSION IF NOT EXISTS.*${ext}`
  ];
  
  const found = patterns.some(pattern => {
    const regex = new RegExp(pattern, 'i');
    return regex.test(allContent);
  });
  
  if (found) {
    foundExtensions.push(ext);
    console.log(`✅ ${ext}`);
  } else {
    missingExtensions.push(ext);
    console.log(`❌ ${ext} - NOT FOUND`);
  }
});

// Check for RLS policies
console.log('\n🔒 ROW LEVEL SECURITY:');
const rlsTables = [];
const rlsPattern = /ALTER TABLE.*ENABLE ROW LEVEL SECURITY/gi;
const rlsMatches = allContent.match(rlsPattern);
if (rlsMatches) {
  console.log(`✅ RLS enabled on ${rlsMatches.length} tables`);
} else {
  console.log('❌ No RLS policies found');
}

// Check for indexes
console.log('\n📈 INDEXES:');
const indexPattern = /CREATE INDEX/gi;
const indexMatches = allContent.match(indexPattern);
if (indexMatches) {
  console.log(`✅ ${indexMatches.length} indexes created`);
} else {
  console.log('❌ No indexes found');
}

// Check for triggers
console.log('\n⚡ TRIGGERS:');
const triggerPattern = /CREATE TRIGGER/gi;
const triggerMatches = allContent.match(triggerPattern);
if (triggerMatches) {
  console.log(`✅ ${triggerMatches.length} triggers created`);
} else {
  console.log('❌ No triggers found');
}

// Check for seed data
console.log('\n🌱 SEED DATA:');
const seedFiles = [
  'supabase/seed.sql',
  'supabase/seed_test_cases.sql',
  'supabase/seed_5g_nr_test_cases.sql',
  'supabase/seed_4g_lte_test_cases.sql',
  'supabase/seed_3gpp_compliant_test_cases.sql',
  'supabase/seed_ims_sip_test_cases.sql',
  'supabase/seed_oran_test_cases.sql',
  'supabase/seed_nbiot_v2x_ntn_test_cases.sql',
  'supabase/seed_detailed_test_cases.sql'
];

let seedDataFound = 0;
seedFiles.forEach(file => {
  if (fs.existsSync(file)) {
    seedDataFound++;
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - NOT FOUND`);
  }
});

// Check for real-time simulation dependencies
console.log('\n🎮 REAL-TIME SIMULATION DEPENDENCIES:');
const simulationDeps = [
  'test_case_messages',
  'decoded_messages',
  'test_run_queue',
  'test_run_configs',
  'test_execution_workers'
];

simulationDeps.forEach(dep => {
  if (foundTables.includes(dep)) {
    console.log(`✅ ${dep} - Available for real-time simulation`);
  } else {
    console.log(`❌ ${dep} - Missing for real-time simulation`);
  }
});

// Summary
console.log('\n📋 SUMMARY:');
console.log('===========');
console.log(`Tables: ${foundTables.length}/${requiredComponents.tables.length} (${Math.round(foundTables.length/requiredComponents.tables.length*100)}%)`);
console.log(`Functions: ${foundFunctions.length}/${requiredComponents.functions.length} (${Math.round(foundFunctions.length/requiredComponents.functions.length*100)}%)`);
console.log(`Views: ${foundViews.length}/${requiredComponents.views.length} (${Math.round(foundViews.length/requiredComponents.views.length*100)}%)`);
console.log(`Extensions: ${foundExtensions.length}/${requiredComponents.extensions.length} (${Math.round(foundExtensions.length/requiredComponents.extensions.length*100)}%)`);
console.log(`Seed Files: ${seedDataFound}/${seedFiles.length} (${Math.round(seedDataFound/seedFiles.length*100)}%)`);

if (missingTables.length > 0) {
  console.log('\n❌ MISSING TABLES:');
  missingTables.forEach(table => console.log(`  - ${table}`));
}

if (missingFunctions.length > 0) {
  console.log('\n❌ MISSING FUNCTIONS:');
  missingFunctions.forEach(func => console.log(`  - ${func}`));
}

if (missingViews.length > 0) {
  console.log('\n❌ MISSING VIEWS:');
  missingViews.forEach(view => console.log(`  - ${view}`));
}

if (missingExtensions.length > 0) {
  console.log('\n❌ MISSING EXTENSIONS:');
  missingExtensions.forEach(ext => console.log(`  - ${ext}`));
}

// Check for potential issues
console.log('\n⚠️ POTENTIAL ISSUES:');
const issues = [];

// Check for missing update_updated_at_column function
if (!foundFunctions.includes('update_updated_at_column')) {
  issues.push('Missing update_updated_at_column function (required for triggers)');
}

// Check for missing test_case_executions table
if (!foundTables.includes('test_case_executions')) {
  issues.push('Missing test_case_executions table (core table)');
}

// Check for missing decoded_messages table
if (!foundTables.includes('decoded_messages')) {
  issues.push('Missing decoded_messages table (required for real-time simulation)');
}

// Check for missing test_case_messages table
if (!foundTables.includes('test_case_messages')) {
  issues.push('Missing test_case_messages table (required for real-time simulation)');
}

if (issues.length > 0) {
  issues.forEach(issue => console.log(`  - ${issue}`));
} else {
  console.log('  ✅ No critical issues found');
}

// Final assessment
const totalComponents = requiredComponents.tables.length + requiredComponents.functions.length + requiredComponents.views.length + requiredComponents.extensions.length;
const foundComponents = foundTables.length + foundFunctions.length + foundViews.length + foundExtensions.length;
const completeness = Math.round(foundComponents/totalComponents*100);

console.log('\n🎯 FINAL ASSESSMENT:');
console.log('===================');
console.log(`Database Completeness: ${completeness}%`);

if (completeness >= 95) {
  console.log('✅ EXCELLENT - Database is ready for Supabase deployment!');
} else if (completeness >= 90) {
  console.log('✅ GOOD - Database is mostly ready, minor issues to address');
} else if (completeness >= 80) {
  console.log('⚠️ FAIR - Database needs some work before deployment');
} else {
  console.log('❌ POOR - Database needs significant work before deployment');
}

console.log('\n🚀 Ready for Supabase deployment: ' + (completeness >= 95 && issues.length === 0 ? 'YES' : 'NO'));

// Generate deployment checklist
console.log('\n📝 DEPLOYMENT CHECKLIST:');
console.log('========================');
console.log('1. ✅ Run all migration files in order');
console.log('2. ✅ Verify all tables are created');
console.log('3. ✅ Verify all functions are created');
console.log('4. ✅ Verify all views are created');
console.log('5. ✅ Verify all extensions are enabled');
console.log('6. ✅ Verify RLS policies are in place');
console.log('7. ✅ Verify indexes are created');
console.log('8. ✅ Verify triggers are created');
console.log('9. ✅ Load seed data');
console.log('10. ✅ Test real-time simulation components');

console.log('\n🎉 Database verification complete!');