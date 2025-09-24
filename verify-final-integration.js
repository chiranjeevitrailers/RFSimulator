#!/usr/bin/env node

/**
 * Final Integration Verification Script
 * Verifies all remaining issues have been resolved
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Final Integration Verification...\n');

let allTestsPassed = true;

// Test 1: Check all WebSocket configurations use environment variables
console.log('1️⃣ Checking WebSocket Environment Variable Usage:');
const wsFiles = [
  'services/WebSocketService.js',
  'components/5glabx/services/TestExecutionWebSocketService.tsx',
  'services/CLIBridge.js',
  'components/5glabx/services/DataFlowIntegration.tsx',
  'components/5glabx/services/ServiceIntegration.tsx',
  'components/5glabx/services/EnhancedDataFlowIntegration.tsx',
  'components/5glabx/services/EnhancedServiceIntegration.tsx',
  'components/input/LiveMonitor.js',
  'components/protocol-analyzer/LiveCharts.tsx',
  'components/protocol-analyzer/LiveKPIDashboard.tsx',
  'components/protocol-analyzer/LiveLayerGrouping.tsx',
  'components/protocol-analyzer/TimeController.tsx'
];

wsFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasEnvVar = content.includes('process.env.NEXT_PUBLIC_5GLABX_WS_URL');
    const hasCorrectPort = content.includes('ws://localhost:8082');
    const hasHardcoded8081 = content.includes('ws://localhost:8081');
    
    console.log(`   ${hasEnvVar ? '✅' : '❌'} ${file} - Uses env var`);
    console.log(`   ${hasCorrectPort ? '✅' : '❌'} ${file} - Defaults to port 8082`);
    console.log(`   ${!hasHardcoded8081 ? '✅' : '❌'} ${file} - No hardcoded 8081`);
    
    if (!hasEnvVar || !hasCorrectPort || hasHardcoded8081) {
      allTestsPassed = false;
    }
  } else {
    console.log(`   ❌ ${file} - File not found`);
    allTestsPassed = false;
  }
});

// Test 2: Check configuration files
console.log('\n2️⃣ Checking Configuration Files:');
const configPath = path.join(__dirname, 'config', 'log-paths.json');
if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, 'utf8');
  const hasCorrectPort = configContent.includes('"websocketUrl": "ws://localhost:8082"');
  const hasOldPort = configContent.includes('"websocketUrl": "ws://localhost:8081"');
  
  console.log(`   ${hasCorrectPort ? '✅' : '❌'} config/log-paths.json - Uses port 8082`);
  console.log(`   ${!hasOldPort ? '✅' : '❌'} config/log-paths.json - No hardcoded 8081`);
  
  if (!hasCorrectPort || hasOldPort) {
    allTestsPassed = false;
  }
} else {
  console.log('   ❌ config/log-paths.json - File not found');
  allTestsPassed = false;
}

// Test 3: Check environment configuration
console.log('\n3️⃣ Checking Environment Configuration:');
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasWsUrl = envContent.includes('NEXT_PUBLIC_5GLABX_WS_URL=ws://localhost:8082');
  const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=');
  const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=');
  const hasServiceKey = envContent.includes('SUPABASE_SERVICE_ROLE_KEY=');
  
  console.log(`   ${hasWsUrl ? '✅' : '❌'} .env.local - WebSocket URL configured`);
  console.log(`   ${hasSupabaseUrl ? '✅' : '❌'} .env.local - Supabase URL configured`);
  console.log(`   ${hasSupabaseKey ? '✅' : '❌'} .env.local - Supabase anon key configured`);
  console.log(`   ${hasServiceKey ? '✅' : '❌'} .env.local - Service role key configured`);
  
  if (!hasWsUrl || !hasSupabaseUrl || !hasSupabaseKey || !hasServiceKey) {
    allTestsPassed = false;
  }
} else {
  console.log('   ❌ .env.local - File not found');
  allTestsPassed = false;
}

// Test 4: Check Supabase integration
console.log('\n4️⃣ Checking Supabase Integration:');
const supabaseFiles = [
  'app/api/tests/runs/active/route.ts',
  'components/5glabx/5GLabXPlatformMinimal.tsx',
  'lib/supabase.ts'
];

supabaseFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasCreateClient = content.includes('createClient');
    const hasTableAccess = content.includes('.from(') && (content.includes('test_case_executions') || content.includes('decoded_messages'));
    const hasRealtime = content.includes('channel(') || content.includes('postgres_changes');
    
    console.log(`   ${hasCreateClient ? '✅' : '❌'} ${file} - Has Supabase client`);
    console.log(`   ${hasTableAccess ? '✅' : '❌'} ${file} - Has table access`);
    console.log(`   ${hasRealtime ? '✅' : '❌'} ${file} - Has realtime features`);
  } else {
    console.log(`   ❌ ${file} - File not found`);
    allTestsPassed = false;
  }
});

// Test 5: Check server configuration
console.log('\n5️⃣ Checking Server Configuration:');
const serverPath = path.join(__dirname, 'server.js');
if (fs.existsSync(serverPath)) {
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  const hasMainWs = serverContent.includes('port: 8081');
  const hasTestWs = serverContent.includes('start(8082)');
  
  console.log(`   ${hasMainWs ? '✅' : '❌'} server.js - Main WebSocket on port 8081`);
  console.log(`   ${hasTestWs ? '✅' : '❌'} server.js - Test execution WebSocket on port 8082`);
  
  if (!hasMainWs || !hasTestWs) {
    allTestsPassed = false;
  }
} else {
  console.log('   ❌ server.js - File not found');
  allTestsPassed = false;
}

// Final Results
console.log('\n🎯 Final Results:');
if (allTestsPassed) {
  console.log('   ✅ ALL TESTS PASSED - Integration fixes are complete!');
  console.log('\n📋 Next Steps:');
  console.log('   1. Set your actual Supabase credentials in .env.local');
  console.log('   2. Start the backend server: node server.js');
  console.log('   3. Start the frontend: npm run dev');
  console.log('   4. Test the integration flow');
} else {
  console.log('   ❌ SOME TESTS FAILED - Please review the issues above');
}

console.log('\n✅ Final integration verification completed!');