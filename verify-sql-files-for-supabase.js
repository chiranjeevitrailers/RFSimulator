#!/usr/bin/env node

/**
 * 5GLabX Platform - SQL Files Verification for Supabase
 * Verifies all SQL files are ready for Supabase SQL Editor execution
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 5GLabX Platform - SQL Files Verification for Supabase\n');

// Define the correct execution order
const executionOrder = [
    // Phase 1: Core Schema Setup
    '001_complete_platform_schema.sql',
    
    // Phase 2: Enhanced Schema Components
    '002_test_cases_enhanced.sql',
    '003_security_tables.sql',
    '004_monitoring_tables.sql',
    '005_alert_management_tables.sql',
    '006_backup_system_tables.sql',
    '007_load_testing_tables.sql',
    '008_deployment_system_tables.sql',
    '009_detailed_test_case_data.sql',
    '010_test_configuration_tables.sql',
    
    // Phase 3: Test Suites & Execution
    '011_test_suites_enhancements.sql',
    '012_decoded_messages_schema.sql',
    '013_fix_missing_columns_and_improvements.sql',
    '014_comprehensive_seed_data_setup.sql',
    '015_final_database_optimization.sql',
    '016_missing_tables_and_functions.sql',
    '017_missing_indexes.sql',
    '018_final_realtime_indexes.sql',
    '019_enhanced_test_execution_flow.sql',
    
    // Phase 4: Comprehensive Test Cases Database
    '020_comprehensive_1000_test_cases_database.sql',
    '021_comprehensive_1000_test_cases_seed_data.sql',
    
    // Phase 5: VoLTE/VoNR/Conference/IMS Flows
    '022_volte_vonr_conference_ims_flows.sql',
    '023_volte_vonr_conference_ims_test_cases.sql',
    
    // Phase 6: Detailed 5G NR Test Cases
    '024_detailed_5g_nr_initial_access_test_cases.sql',
    '025_detailed_5g_nr_handover_test_cases.sql',
    '026_detailed_5g_nr_pdu_session_test_cases.sql',
    '027_detailed_5g_nr_mobility_test_cases.sql',
    '028_detailed_5g_nr_security_test_cases.sql',
    
    // Phase 7: Additional Components
    '002_subscription_plans_seed.sql',
    '003_comprehensive_test_cases_seed.sql',
    '004_default_configurations_seed.sql',
    '005_documentation_tutorials_seed.sql',
    '006_backup_tables.sql',
    '006_comprehensive_1000_test_cases.sql',
    '007_remaining_protocols_test_cases.sql',
    '008_comprehensive_3gpp_ies.sql',
    '009_complete_3gpp_message_flows.sql'
];

// Files that should NOT be executed (conflicts)
const conflictingFiles = [
    '001_initial_schema.sql', // Conflicts with 001_complete_platform_schema.sql
    '004_default_configurations_seed_v2.sql', // Conflicts with 004_default_configurations_seed.sql
    '008_comprehensive_3gpp_ies_v2.sql', // Conflicts with 008_comprehensive_3gpp_ies.sql
    '009_complete_3gpp_message_flows_v2.sql' // Conflicts with 009_complete_3gpp_message_flows.sql
];

const migrationsDir = path.join(__dirname, 'supabase', 'migrations');

console.log('📁 Checking migrations directory...');
if (!fs.existsSync(migrationsDir)) {
    console.error('❌ Migrations directory not found:', migrationsDir);
    process.exit(1);
}

console.log('✅ Migrations directory found\n');

// Get all SQL files
const allFiles = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.sql'));
console.log(`📊 Found ${allFiles.length} SQL files in migrations directory\n`);

// Check execution order files
console.log('🎯 Checking execution order files...');
let executionOrderStatus = true;
const missingFiles = [];
const extraFiles = [];

executionOrder.forEach((file, index) => {
    if (allFiles.includes(file)) {
        console.log(`✅ ${index + 1}. ${file}`);
    } else {
        console.log(`❌ ${index + 1}. ${file} - MISSING`);
        missingFiles.push(file);
        executionOrderStatus = false;
    }
});

// Check for extra files not in execution order
allFiles.forEach(file => {
    if (!executionOrder.includes(file) && !conflictingFiles.includes(file)) {
        extraFiles.push(file);
    }
});

console.log('\n🚨 Checking conflicting files...');
conflictingFiles.forEach(file => {
    if (allFiles.includes(file)) {
        console.log(`⚠️  ${file} - CONFLICTS (DO NOT EXECUTE)`);
    }
});

console.log('\n📋 Summary:');
console.log(`✅ Execution order files: ${executionOrder.length - missingFiles.length}/${executionOrder.length}`);
console.log(`❌ Missing files: ${missingFiles.length}`);
console.log(`⚠️  Conflicting files: ${conflictingFiles.filter(f => allFiles.includes(f)).length}`);
console.log(`📁 Extra files: ${extraFiles.length}`);

if (missingFiles.length > 0) {
    console.log('\n❌ Missing files:');
    missingFiles.forEach(file => console.log(`   - ${file}`));
}

if (extraFiles.length > 0) {
    console.log('\n📁 Extra files (not in execution order):');
    extraFiles.forEach(file => console.log(`   - ${file}`));
}

// Check file sizes and basic syntax
console.log('\n🔍 Checking file sizes and basic syntax...');
let totalSize = 0;
let syntaxIssues = 0;

executionOrder.forEach(file => {
    const filePath = path.join(migrationsDir, file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const size = content.length;
        totalSize += size;
        
        // Basic syntax checks
        const issues = [];
        
        // Check for balanced parentheses in CREATE statements
        const createStatements = content.match(/CREATE\s+(?:TABLE|FUNCTION|INDEX|VIEW|POLICY)/gi) || [];
        if (createStatements.length > 0) {
            // This is a basic check - in production, you'd want more sophisticated parsing
            const openParens = (content.match(/\(/g) || []).length;
            const closeParens = (content.match(/\)/g) || []).length;
            if (openParens !== closeParens) {
                issues.push('Unbalanced parentheses');
            }
        }
        
        // Check for semicolons at end of statements
        const lines = content.split('\n');
        const lastLine = lines[lines.length - 1].trim();
        if (lastLine && !lastLine.endsWith(';') && !lastLine.startsWith('--')) {
            issues.push('Missing semicolon at end');
        }
        
        if (issues.length > 0) {
            console.log(`⚠️  ${file} - ${issues.join(', ')}`);
            syntaxIssues++;
        } else {
            console.log(`✅ ${file} - ${(size / 1024).toFixed(1)}KB`);
        }
    }
});

console.log('\n📊 Final Statistics:');
console.log(`📁 Total files to execute: ${executionOrder.length}`);
console.log(`📏 Total size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
console.log(`⚠️  Syntax issues: ${syntaxIssues}`);
console.log(`🚨 Conflicting files: ${conflictingFiles.filter(f => allFiles.includes(f)).length}`);

// Final status
if (executionOrderStatus && syntaxIssues === 0) {
    console.log('\n🎉 ALL SQL FILES ARE READY FOR SUPABASE EXECUTION!');
    console.log('\n📋 Next Steps:');
    console.log('1. Open Supabase SQL Editor');
    console.log('2. Execute files in the exact order listed above');
    console.log('3. Wait for each file to complete before proceeding');
    console.log('4. Verify no errors after each execution');
    console.log('\n🎯 Your 5GLabX platform database will be ready!');
} else {
    console.log('\n⚠️  ISSUES FOUND - Please resolve before execution:');
    if (missingFiles.length > 0) {
        console.log(`   - ${missingFiles.length} missing files`);
    }
    if (syntaxIssues > 0) {
        console.log(`   - ${syntaxIssues} syntax issues`);
    }
    console.log('\n🔧 Please fix these issues before proceeding to Supabase execution.');
}

console.log('\n📖 For detailed execution instructions, see: SUPABASE_SQL_EDITOR_EXECUTION_GUIDE.md');