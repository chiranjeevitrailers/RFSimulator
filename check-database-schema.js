#!/usr/bin/env node

/**
 * 5GLabX - Check Database Schema
 * Inspects the actual database schema to understand table structure
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🚀 5GLabX - Database Schema Inspector');
console.log('===================================\n');

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

async function inspectTableSchema(tableName) {
  console.log(`🗄️  Inspecting ${tableName} table...`);

  try {
    // Try to get one record to see the structure
    const { data, error } = await supabaseAdmin
      .from(tableName)
      .select('*')
      .limit(1);

    if (error && error.code === 'PGRST116') {
      console.log('   ❌ Table does not exist');
      return null;
    } else if (error) {
      console.log(`   ❌ Error accessing table: ${error.message}`);
      return null;
    }

    if (data && data.length > 0) {
      console.log('   ✅ Table exists');
      console.log('   📊 Schema:');
      Object.keys(data[0]).forEach(key => {
        const value = data[0][key];
        const type = typeof value;
        console.log(`      • ${key}: ${type} ${value === null ? '(nullable)' : ''}`);
      });
      return Object.keys(data[0]);
    } else {
      console.log('   ✅ Table exists but is empty');
      return [];
    }
  } catch (error) {
    console.log(`   ❌ Error inspecting table: ${error.message}`);
    return null;
  }
}

async function getTableCount(tableName) {
  try {
    const { data, error } = await supabaseAdmin
      .from(tableName)
      .select('count', { count: 'exact', head: true });

    if (error) {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
}

async function main() {
  try {
    console.log('🎯 Inspecting database schema...\n');

    const tables = ['users', 'test_cases', 'test_executions', 'user_activities'];

    for (const table of tables) {
      console.log(`\n🔍 Checking ${table} table...`);
      console.log('─'.repeat(40));

      const schema = await inspectTableSchema(table);
      const count = await getTableCount(table);

      if (count !== null) {
        console.log(`   📊 Records: ${count}`);
      }

      if (schema) {
        console.log(`   ✅ Columns: ${schema.join(', ')}`);
      }
    }

    console.log('\n📋 DATABASE SCHEMA SUMMARY');
    console.log('=========================');

    // Try to understand the actual schema based on common patterns
    console.log('\n💡 Based on the inspection, here are the likely table structures:');

    console.log('\n1. Users table typically has:');
    console.log('   • id (UUID, primary key)');
    console.log('   • email (TEXT, unique)');
    console.log('   • full_name (TEXT)');
    console.log('   • role (TEXT)');
    console.log('   • subscription_tier (TEXT)');
    console.log('   • subscription_status (TEXT)');
    console.log('   • created_at (TIMESTAMP)');
    console.log('   • updated_at (TIMESTAMP)');
    console.log('   • is_active (BOOLEAN)');

    console.log('\n2. Test Cases table typically has:');
    console.log('   • id (UUID, primary key)');
    console.log('   • name (TEXT)');
    console.log('   • description (TEXT)');
    console.log('   • category (TEXT)');
    console.log('   • subcategory (TEXT)');
    console.log('   • complexity (TEXT)');
    console.log('   • test_data (JSONB)');
    console.log('   • expected_results (JSONB)');
    console.log('   • is_active (BOOLEAN)');
    console.log('   • created_at (TIMESTAMP)');
    console.log('   • updated_at (TIMESTAMP)');

    console.log('\n3. Test Executions table typically has:');
    console.log('   • id (UUID, primary key)');
    console.log('   • user_id (UUID, foreign key)');
    console.log('   • test_case_id (UUID, foreign key)');
    console.log('   • status (TEXT)');
    console.log('   • start_time (TIMESTAMP)');
    console.log('   • end_time (TIMESTAMP, nullable)');
    console.log('   • results (JSONB)');
    console.log('   • logs (JSONB)');
    console.log('   • created_at (TIMESTAMP)');

    console.log('\n📝 RECOMMENDATIONS:');
    console.log('1. Check your Supabase dashboard > Table Editor');
    console.log('2. Verify the actual column names and types');
    console.log('3. Update the sample data insertion script accordingly');
    console.log('4. Or create the tables manually using the SQL Editor');

  } catch (error) {
    console.log('\n❌ Schema inspection failed:', error.message);
    console.log('💡 Check your Supabase configuration and try again');
  }
}

// Run the schema inspection
main();