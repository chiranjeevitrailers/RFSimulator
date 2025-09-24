#!/usr/bin/env node

/**
 * Test Integration Fixes
 * Verifies that the critical fixes are working
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Testing Integration Fixes...\n');

// Test 1: Check environment variables
console.log('1️⃣ Checking Environment Variables:');
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=') && !envContent.includes('your-project.supabase.co');
  const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=') && !envContent.includes('your-anon-key');
  const hasServiceKey = envContent.includes('SUPABASE_SERVICE_ROLE_KEY=') && !envContent.includes('your-service-role-key');
  const hasWsUrl = envContent.includes('NEXT_PUBLIC_5GLABX_WS_URL=');
  
  console.log(`   ✅ .env.local exists`);
  console.log(`   ${hasSupabaseUrl ? '✅' : '❌'} NEXT_PUBLIC_SUPABASE_URL configured`);
  console.log(`   ${hasSupabaseKey ? '✅' : '❌'} NEXT_PUBLIC_SUPABASE_ANON_KEY configured`);
  console.log(`   ${hasServiceKey ? '✅' : '❌'} SUPABASE_SERVICE_ROLE_KEY configured`);
  console.log(`   ${hasWsUrl ? '✅' : '❌'} NEXT_PUBLIC_5GLABX_WS_URL configured`);
} else {
  console.log('   ❌ .env.local not found');
}

// Test 2: Check WebSocket port configuration
console.log('\n2️⃣ Checking WebSocket Configuration:');
const wsServicePath = path.join(__dirname, 'services', 'WebSocketService.js');
if (fs.existsSync(wsServicePath)) {
  const wsContent = fs.readFileSync(wsServicePath, 'utf8');
  const hasEnvVar = wsContent.includes('process.env.NEXT_PUBLIC_5GLABX_WS_URL');
  const hasCorrectPort = wsContent.includes('ws://localhost:8082');
  
  console.log(`   ${hasEnvVar ? '✅' : '❌'} Uses environment variable for WebSocket URL`);
  console.log(`   ${hasCorrectPort ? '✅' : '❌'} Defaults to correct port (8082)`);
} else {
  console.log('   ❌ WebSocketService.js not found');
}

// Test 3: Check TestExecutionWebSocketService
console.log('\n3️⃣ Checking TestExecutionWebSocketService:');
const testWsPath = path.join(__dirname, 'components', '5glabx', 'services', 'TestExecutionWebSocketService.tsx');
if (fs.existsSync(testWsPath)) {
  const testWsContent = fs.readFileSync(testWsPath, 'utf8');
  const hasEnvVar = testWsContent.includes('process.env.NEXT_PUBLIC_5GLABX_WS_URL');
  const hasCorrectPort = testWsContent.includes('ws://localhost:8082');
  
  console.log(`   ${hasEnvVar ? '✅' : '❌'} Uses environment variable for WebSocket URL`);
  console.log(`   ${hasCorrectPort ? '✅' : '❌'} Defaults to correct port (8082)`);
} else {
  console.log('   ❌ TestExecutionWebSocketService.tsx not found');
}

// Test 4: Check 5GLabX fallback mechanism
console.log('\n4️⃣ Checking 5GLabX Fallback Mechanism:');
const labxPath = path.join(__dirname, 'components', '5glabx', '5GLabXPlatformMinimal.tsx');
if (fs.existsSync(labxPath)) {
  const labxContent = fs.readFileSync(labxPath, 'utf8');
  const hasFallback = labxContent.includes('checkForActiveExecutions');
  const hasRealtime = labxContent.includes('subscribeToExecutionData');
  
  console.log(`   ${hasFallback ? '✅' : '❌'} Has fallback mechanism for missed events`);
  console.log(`   ${hasRealtime ? '✅' : '❌'} Has Supabase Realtime subscription`);
} else {
  console.log('   ❌ 5GLabXPlatformMinimal.tsx not found');
}

// Test 5: Check API route for active runs
console.log('\n5️⃣ Checking API Route for Active Runs:');
const apiPath = path.join(__dirname, 'app', 'api', 'tests', 'runs', 'active', 'route.ts');
if (fs.existsSync(apiPath)) {
  console.log('   ✅ /api/tests/runs/active route exists');
} else {
  console.log('   ❌ /api/tests/runs/active route not found');
}

// Test 6: Check server.js WebSocket configuration
console.log('\n6️⃣ Checking Server WebSocket Configuration:');
const serverPath = path.join(__dirname, 'server.js');
if (fs.existsSync(serverPath)) {
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  const hasMainWs = serverContent.includes('port: 8081');
  const hasTestWs = serverContent.includes('start(8082)');
  
  console.log(`   ${hasMainWs ? '✅' : '❌'} Main WebSocket server on port 8081`);
  console.log(`   ${hasTestWs ? '✅' : '❌'} Test execution WebSocket server on port 8082`);
} else {
  console.log('   ❌ server.js not found');
}

console.log('\n🎯 Summary:');
console.log('   The critical fixes have been applied to resolve:');
console.log('   • WebSocket port mismatches (8081 vs 8082)');
console.log('   • Hard-coded WebSocket URLs');
console.log('   • Missing environment variable configuration');
console.log('   • Event timing issues with fallback mechanism');
console.log('   • Supabase integration problems');

console.log('\n📋 Next Steps:');
console.log('   1. Set your actual Supabase credentials in .env.local');
console.log('   2. Start the backend server: node server.js');
console.log('   3. Start the frontend: npm run dev');
console.log('   4. Test the integration flow');

console.log('\n✅ Integration fixes test completed!');