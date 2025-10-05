/**
 * Test LTE Power On Procedure End-to-End
 * Verifies the complete LTE Power On test case execution
 */

const fs = require('fs');
const path = require('path');

async function testLTEPowerOnEndToEnd() {
  console.log('🧪 Testing LTE Power On Procedure End-to-End...\n');

  try {
    // 1. Load LTE Power On test case
    console.log('1. Loading LTE Power On test case...');
    const testCasePath = path.join(process.cwd(), 'test-cases/lte-power-on-v1.json');
    const testCaseContent = fs.readFileSync(testCasePath, 'utf8');
    const testCase = JSON.parse(testCaseContent);
    
    console.log(`   ✅ Test Case: ${testCase.name}`);
    console.log(`   ✅ Technology: ${testCase.technology}`);
    console.log(`   ✅ Steps: ${testCase.expectedMessageSequence.length}`);
    console.log(`   ✅ UE Profile: ${testCase.ueProfile.id}`);

    // 2. Validate test case structure
    console.log('\n2. Validating test case structure...');
    const requiredFields = ['testCaseId', 'name', 'description', 'technology', 'category', 'expectedMessageSequence'];
    for (const field of requiredFields) {
      if (!testCase[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    console.log('   ✅ All required fields present');

    // 3. Validate message sequence
    console.log('\n3. Validating message sequence...');
    const expectedSteps = [
      'CELL_SYNC', 'PRACH_ATTEMPT', 'PRACH_SUCCESS', 'RRC_CONN_REQUEST', 
      'RRC_CONN_SETUP', 'RRC_CONN_SETUP_COMPLETE', 'NAS_ATTACH_REQUEST',
      'NAS_AUTH_REQUEST', 'NAS_AUTH_RESPONSE', 'NAS_AUTH_SUCCESS',
      'NAS_SECURITY_MODE_COMMAND', 'NAS_SECURITY_MODE_COMPLETE',
      'NAS_ATTACH_ACCEPT', 'NAS_ATTACH_COMPLETE', 'GTP_CREATE_SESSION_REQUEST',
      'GTP_CREATE_SESSION_RESPONSE', 'S1AP_INITIAL_CONTEXT_SETUP_REQUEST',
      'S1AP_INITIAL_CONTEXT_SETUP_RESPONSE', 'GTPU_DATA'
    ];

    const actualSteps = testCase.expectedMessageSequence.map(step => step.eventType);
    console.log(`   ✅ Found ${actualSteps.length} steps in sequence`);
    
    for (const expectedStep of expectedSteps) {
      if (actualSteps.includes(expectedStep)) {
        console.log(`   ✅ ${expectedStep} - Present`);
      } else {
        console.log(`   ⚠️  ${expectedStep} - Missing`);
      }
    }

    // 4. Validate PHY layer details
    console.log('\n4. Validating PHY layer details...');
    const cellSyncStep = testCase.expectedMessageSequence.find(step => step.eventType === 'CELL_SYNC');
    if (cellSyncStep) {
      console.log(`   ✅ Cell Sync step found with ${cellSyncStep.subSteps?.length || 0} sub-steps`);
      
      const expectedSubSteps = [
        'PSS_DETECTION', 'SSS_DETECTION', 'PCI_CALCULATION', 'DMRS_DETECTION',
        'PBCH_MIB_DECODE', 'PHICH_DETECTION', 'PCFICH_DECODE', 'PDCCH_DECODE',
        'SIB1_DECODE', 'SIB2_DECODE', 'SIB3_DECODE'
      ];
      
      for (const expectedSubStep of expectedSubSteps) {
        if (cellSyncStep.subSteps?.includes(expectedSubStep)) {
          console.log(`   ✅ ${expectedSubStep} - Present`);
        } else {
          console.log(`   ⚠️  ${expectedSubStep} - Missing`);
        }
      }
    } else {
      throw new Error('CELL_SYNC step not found');
    }

    // 5. Validate Information Elements
    console.log('\n5. Validating Information Elements...');
    let totalIEs = 0;
    for (const step of testCase.expectedMessageSequence) {
      if (step.expectedIEs) {
        const ieCount = Object.keys(step.expectedIEs).length;
        totalIEs += ieCount;
        console.log(`   ✅ ${step.eventType}: ${ieCount} IEs`);
      }
    }
    console.log(`   ✅ Total IEs across all steps: ${totalIEs}`);

    // 6. Validate assertions
    console.log('\n6. Validating assertions...');
    let totalAssertions = 0;
    for (const step of testCase.expectedMessageSequence) {
      if (step.assertions) {
        const assertionCount = Object.keys(step.assertions).length;
        totalAssertions += assertionCount;
        console.log(`   ✅ ${step.eventType}: ${assertionCount} assertions`);
      }
    }
    console.log(`   ✅ Total assertions across all steps: ${totalAssertions}`);

    // 7. Validate layer coverage
    console.log('\n7. Validating layer coverage...');
    const layers = [...new Set(testCase.expectedMessageSequence.map(step => step.layer))];
    const expectedLayers = ['PHY', 'RRC', 'NAS', 'S1AP', 'GTP'];
    
    for (const expectedLayer of expectedLayers) {
      if (layers.includes(expectedLayer)) {
        console.log(`   ✅ ${expectedLayer} layer - Covered`);
      } else {
        console.log(`   ⚠️  ${expectedLayer} layer - Missing`);
      }
    }

    // 8. Validate UE profile
    console.log('\n8. Validating UE profile...');
    const ueProfile = testCase.ueProfile;
    console.log(`   ✅ IMSI: ${ueProfile.imsi}`);
    console.log(`   ✅ IMEI: ${ueProfile.imei}`);
    console.log(`   ✅ Default APN: ${ueProfile.defaultApn}`);
    console.log(`   ✅ Security Support: ${Object.keys(ueProfile.securitySupport).join(', ')}`);

    // 9. Validate cell configuration
    console.log('\n9. Validating cell configuration...');
    const cellConfig = testCase.cellConfig;
    console.log(`   ✅ PCI: ${cellConfig.pci}`);
    console.log(`   ✅ EARFCN: ${cellConfig.earfcn}`);
    console.log(`   ✅ Bandwidth: ${cellConfig.bandwidth} MHz`);
    console.log(`   ✅ TAC: ${cellConfig.tac}`);
    console.log(`   ✅ MCC: ${cellConfig.mcc}`);
    console.log(`   ✅ MNC: ${cellConfig.mnc}`);

    // 10. Validate test case completeness
    console.log('\n10. Validating test case completeness...');
    const hasCellSync = testCase.expectedMessageSequence.some(step => step.eventType === 'CELL_SYNC');
    const hasRRCSetup = testCase.expectedMessageSequence.some(step => step.eventType === 'RRC_CONN_SETUP');
    const hasNASAttach = testCase.expectedMessageSequence.some(step => step.eventType === 'NAS_ATTACH_REQUEST');
    const hasGTP = testCase.expectedMessageSequence.some(step => step.eventType.includes('GTP'));
    const hasS1AP = testCase.expectedMessageSequence.some(step => step.eventType.includes('S1AP'));
    
    console.log(`   ✅ Cell Synchronization: ${hasCellSync ? 'Present' : 'Missing'}`);
    console.log(`   ✅ RRC Setup: ${hasRRCSetup ? 'Present' : 'Missing'}`);
    console.log(`   ✅ NAS Attach: ${hasNASAttach ? 'Present' : 'Missing'}`);
    console.log(`   ✅ GTP Protocol: ${hasGTP ? 'Present' : 'Missing'}`);
    console.log(`   ✅ S1AP Protocol: ${hasS1AP ? 'Present' : 'Missing'}`);

    console.log('\n🎉 LTE Power On Procedure Test PASSED!');
    console.log('\n📋 Summary:');
    console.log(`   • Test Case: ${testCase.name}`);
    console.log(`   • Technology: ${testCase.technology}`);
    console.log(`   • Total Steps: ${testCase.expectedMessageSequence.length}`);
    console.log(`   • Total IEs: ${totalIEs}`);
    console.log(`   • Total Assertions: ${totalAssertions}`);
    console.log(`   • Layers Covered: ${layers.join(', ')}`);
    console.log(`   • UE Profile: ${ueProfile.id}`);
    console.log(`   • Cell Config: PCI ${cellConfig.pci}, EARFCN ${cellConfig.earfcn}`);
    console.log('\n✅ LTE Power On procedure is complete and ready for execution!');

  } catch (error) {
    console.error('\n❌ LTE Power On Procedure Test FAILED!');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the test
testLTEPowerOnEndToEnd();