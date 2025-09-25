#!/usr/bin/env node

/**
 * Integration Files Cleanup Script
 * Removes duplicate and unnecessary integration files
 */

const fs = require('fs');
const path = require('path');

// Files to remove (safe removals)
const filesToRemove = [
  // Test and verification files
  'test-frontend-integration.html',
  'test-integration-complete.js',
  'scripts/integration-test.js',
  
  // CLI integration test files
  'services/cli/CliIntegrationTest.js',
  
  // Data format adapter integration (if not actively used)
  'utils/DataFormatAdapterIntegration.js',
  
  // Desktop integration (if not needed)
  'electron/desktop-integration.js',
  
  // Oran CLI integration (if not actively used)
  'services/OranCliIntegration.js'
];

// Directories to check for empty folders after cleanup
const directoriesToCheck = [
  'components/5glabx/services',
  'components/5glabx/components',
  'services/cli',
  'utils',
  'electron'
];

function removeFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
      console.log(`✅ Removed: ${filePath}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to remove ${filePath}:`, error.message);
      return false;
    }
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }
}

function checkDirectory(dirPath) {
  const fullPath = path.join(__dirname, dirPath);
  
  if (fs.existsSync(fullPath)) {
    try {
      const files = fs.readdirSync(fullPath);
      if (files.length === 0) {
        console.log(`📁 Empty directory: ${dirPath}`);
        // Optionally remove empty directories
        // fs.rmdirSync(fullPath);
        // console.log(`🗑️  Removed empty directory: ${dirPath}`);
      }
    } catch (error) {
      console.error(`❌ Error checking directory ${dirPath}:`, error.message);
    }
  }
}

function main() {
  console.log('🚀 Starting integration files cleanup...\n');
  
  let removedCount = 0;
  let totalCount = filesToRemove.length;
  
  // Remove files
  filesToRemove.forEach(file => {
    if (removeFile(file)) {
      removedCount++;
    }
  });
  
  console.log(`\n📊 Cleanup Summary:`);
  console.log(`   Files removed: ${removedCount}/${totalCount}`);
  console.log(`   Space saved: ~${removedCount * 5}KB (estimated)`);
  
  // Check directories
  console.log(`\n📁 Directory Check:`);
  directoriesToCheck.forEach(dir => {
    checkDirectory(dir);
  });
  
  console.log('\n✅ Cleanup completed!');
  console.log('\n🔍 Next steps:');
  console.log('   1. Test the application functionality');
  console.log('   2. Check for any broken imports');
  console.log('   3. Update documentation if needed');
}

// Run the cleanup
main();