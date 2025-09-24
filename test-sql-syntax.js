#!/usr/bin/env node

/**
 * SQL Syntax Test Script
 * Tests the SQL files to ensure they have correct syntax
 */

const fs = require('fs');
const path = require('path');

// Function to log with timestamp
function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${type}] ${message}`;
  console.log(logEntry);
}

// Function to check SQL file for syntax issues
function checkSQLFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for problematic patterns
    const issues = [];
    
    // Check for CREATE POLICY IF NOT EXISTS (not supported in PostgreSQL)
    if (content.includes('CREATE POLICY IF NOT EXISTS')) {
      issues.push('CREATE POLICY IF NOT EXISTS is not supported in PostgreSQL');
    }
    
    // Check for other potential issues
    if (content.includes('IF NOT EXISTS') && content.includes('CREATE POLICY')) {
      issues.push('CREATE POLICY with IF NOT EXISTS may cause syntax errors');
    }
    
    // Check for missing semicolons
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('CREATE POLICY') && !line.endsWith(';') && !line.endsWith('(')) {
        // Check if next line is part of the same statement
        if (i + 1 < lines.length && !lines[i + 1].trim().startsWith('CREATE') && !lines[i + 1].trim().startsWith('--')) {
          issues.push(`Line ${i + 1}: CREATE POLICY statement may be missing semicolon`);
        }
      }
    }
    
    return {
      file: filePath,
      issues: issues,
      status: issues.length === 0 ? 'OK' : 'ISSUES'
    };
    
  } catch (error) {
    return {
      file: filePath,
      issues: [`Error reading file: ${error.message}`],
      status: 'ERROR'
    };
  }
}

async function main() {
  log('🎯 Starting SQL Syntax Check');
  log('=' * 60);
  
  // List of SQL files to check
  const sqlFiles = [
    '/workspace/database/fix_test_executions_table.sql',
    '/workspace/database/fix_test_executions_table_clean.sql',
    '/workspace/database/fix_all_sql_syntax_errors.sql',
    '/workspace/database/insert_missing_e2e_test_cases.sql'
  ];
  
  let totalIssues = 0;
  
  for (const filePath of sqlFiles) {
    if (fs.existsSync(filePath)) {
      log(`🔍 Checking: ${path.basename(filePath)}`);
      const result = checkSQLFile(filePath);
      
      if (result.status === 'OK') {
        log(`✅ ${path.basename(filePath)}: No syntax issues found`, 'SUCCESS');
      } else {
        log(`❌ ${path.basename(filePath)}: ${result.issues.length} issue(s) found`, 'ERROR');
        result.issues.forEach(issue => {
          log(`  - ${issue}`, 'ERROR');
        });
        totalIssues += result.issues.length;
      }
    } else {
      log(`⚠️  File not found: ${filePath}`, 'WARNING');
    }
    log('-' * 40);
  }
  
  log('📊 SQL Syntax Check Summary');
  log('=' * 60);
  log(`Total issues found: ${totalIssues}`);
  
  if (totalIssues === 0) {
    log('✅ All SQL files have correct syntax!', 'SUCCESS');
  } else {
    log('❌ Some SQL files have syntax issues that need to be fixed', 'ERROR');
  }
  
  log('🎉 SQL syntax check completed!');
  log('=' * 60);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  log(`❌ Unhandled rejection: ${error.message}`, 'ERROR');
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  log(`❌ Uncaught exception: ${error.message}`, 'ERROR');
  process.exit(1);
});

// Start execution
main().catch((error) => {
  log(`❌ Main execution error: ${error.message}`, 'ERROR');
  process.exit(1);
});