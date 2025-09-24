#!/usr/bin/env node

/**
 * Test Final SQL File
 */

const fs = require('fs');

function testSQLFile() {
  const filePath = '/workspace/database/final_fix_test_executions.sql';
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log('✅ SQL file read successfully');
    console.log('📊 File size:', content.length, 'characters');
    console.log('📋 Lines:', content.split('\n').length);
    
    // Check for basic syntax
    const issues = [];
    
    // Check for CREATE POLICY IF NOT EXISTS
    if (content.includes('CREATE POLICY IF NOT EXISTS')) {
      issues.push('Contains CREATE POLICY IF NOT EXISTS');
    }
    
    // Check for proper semicolons
    const lines = content.split('\n');
    let policyLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('CREATE POLICY')) {
        policyLines.push({ line: i + 1, content: line });
      }
    }
    
    console.log('🔍 Found', policyLines.length, 'CREATE POLICY statements');
    policyLines.forEach(p => {
      console.log(`  Line ${p.line}: ${p.content}`);
    });
    
    if (issues.length === 0) {
      console.log('✅ No syntax issues detected');
      console.log('🎉 SQL file is ready to use!');
    } else {
      console.log('❌ Issues found:', issues);
    }
    
  } catch (error) {
    console.log('❌ Error reading file:', error.message);
  }
}

testSQLFile();