/**
 * Test File-Based System
 * Verifies that the file-based test case system works correctly
 */

const fs = require('fs');
const path = require('path');

async function testFileBasedSystem() {
  console.log('🧪 Testing File-Based System...\n');

  try {
    // 1. Check if test case files exist
    console.log('1. Checking test case files...');
    const testCasesDir = path.join(process.cwd(), 'test-cases');
    
    if (!fs.existsSync(testCasesDir)) {
      throw new Error('Test cases directory does not exist');
    }
    
    const testCaseFiles = fs.readdirSync(testCasesDir).filter(file => file.endsWith('.json'));
    console.log(`   ✅ Found ${testCaseFiles.length} test case files`);
    
    for (const file of testCaseFiles) {
      console.log(`   📄 ${file}`);
    }

    // 2. Validate test case structure
    console.log('\n2. Validating test case structure...');
    for (const file of testCaseFiles) {
      const filePath = path.join(testCasesDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const testCase = JSON.parse(content);
      
      // Check required fields
      const requiredFields = ['testCaseId', 'name', 'description', 'technology', 'category', 'expectedMessageSequence'];
      for (const field of requiredFields) {
        if (!testCase[field]) {
          throw new Error(`Test case ${file} missing required field: ${field}`);
        }
      }
      
      console.log(`   ✅ ${file} - Valid structure`);
    }

    // 3. Check if components exist
    console.log('\n3. Checking components...');
    const components = [
      'components/testing/NewTestManager_1/NewTestManagerFileBased.tsx',
      'utils/TestCaseManager.ts',
      'utils/TestDataProcessor.ts'
    ];
    
    for (const component of components) {
      const componentPath = path.join(process.cwd(), component);
      if (fs.existsSync(componentPath)) {
        console.log(`   ✅ ${component} exists`);
      } else {
        throw new Error(`Component ${component} does not exist`);
      }
    }

    // 4. Check DataFlowManager integration
    console.log('\n4. Checking DataFlowManager integration...');
    const dataFlowManagerPath = path.join(process.cwd(), 'utils/DataFlowManager.ts');
    if (fs.existsSync(dataFlowManagerPath)) {
      const content = fs.readFileSync(dataFlowManagerPath, 'utf8');
      if (content.includes('DataFlowManager') && content.includes('dispatch') && content.includes('subscribe')) {
        console.log('   ✅ DataFlowManager properly implemented');
      } else {
        throw new Error('DataFlowManager missing required methods');
      }
    } else {
      throw new Error('DataFlowManager not found');
    }

    // 5. Check dashboard integration
    console.log('\n5. Checking dashboard integration...');
    const dashboardPath = path.join(process.cwd(), 'app/user-dashboard/page.tsx');
    if (fs.existsSync(dashboardPath)) {
      const content = fs.readFileSync(dashboardPath, 'utf8');
      if (content.includes('NewTestManagerFileBased') && content.includes('file-based-test-manager')) {
        console.log('   ✅ Dashboard properly integrated');
      } else {
        throw new Error('Dashboard missing file-based test manager integration');
      }
    } else {
      throw new Error('Dashboard not found');
    }

    console.log('\n🎉 File-Based System Test PASSED!');
    console.log('\n📋 Summary:');
    console.log(`   • ${testCaseFiles.length} test case files found`);
    console.log('   • All test cases have valid structure');
    console.log('   • All required components exist');
    console.log('   • DataFlowManager properly integrated');
    console.log('   • Dashboard properly integrated');
    console.log('\n✅ Ready to use file-based test system!');

  } catch (error) {
    console.error('\n❌ File-Based System Test FAILED!');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the test
testFileBasedSystem();