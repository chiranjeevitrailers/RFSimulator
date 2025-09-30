#!/usr/bin/env node

/**
 * Script to get all test cases and analyze their protocol data requirements
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Supabase configuration
const supabaseUrl = 'https://uujdknhxsrugxwcjidac.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1amRrbmh4c3J1Z3h3Y2ppZGFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQ5NDk0NSwiZXhwIjoyMDcwMDcwOTQ1fQ.75uGCbdbOxX5Jmt4Gbl5GH70MIv0wWXCqqrXBe2SWGA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getAllTestCases() {
  console.log('🔍 Fetching all test cases...');
  
  try {
    const { data: testCases, error } = await supabase
      .from('test_cases')
      .select('id, name, category, protocol, complexity, test_data')
      .order('category', { ascending: true })
      .order('name', { ascending: true });
    
    if (error) {
      console.error('❌ Error:', error);
      return;
    }
    
    console.log(`📊 Total test cases found: ${testCases.length}`);
    console.log('\n📋 Test Cases by Category:');
    
    const categories = {};
    testCases.forEach(tc => {
      if (!categories[tc.category]) {
        categories[tc.category] = [];
      }
      categories[tc.category].push(tc);
    });
    
    Object.keys(categories).forEach(category => {
      console.log(`\n📁 ${category} (${categories[category].length} test cases):`);
      categories[category].forEach(tc => {
        const hasRealData = tc.test_data?.messages ? '✅' : '❌';
        console.log(`  ${hasRealData} ${tc.id} - ${tc.name} (${tc.protocol}, ${tc.complexity})`);
      });
    });
    
    // Save to file for analysis
    fs.writeFileSync('/workspace/all-test-cases.json', JSON.stringify(testCases, null, 2));
    console.log('\n💾 Saved all test cases to /workspace/all-test-cases.json');
    
    // Count test cases needing protocol data
    const needsData = testCases.filter(tc => !tc.test_data?.messages);
    const hasData = testCases.filter(tc => tc.test_data?.messages);
    
    console.log('\n📊 Summary:');
    console.log(`✅ Test cases with real protocol data: ${hasData.length}`);
    console.log(`❌ Test cases needing protocol data: ${needsData.length}`);
    console.log(`📈 Total test cases: ${testCases.length}`);
    
    return testCases;
    
  } catch (error) {
    console.error('❌ Error during analysis:', error);
  }
}

// Run the analysis
getAllTestCases();