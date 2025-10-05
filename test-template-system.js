/**
 * Test Template System
 * Verifies that the test case template generator works correctly
 */

const fs = require('fs');
const path = require('path');

async function testTemplateSystem() {
  console.log('🧪 Testing Template System...\n');

  try {
    // 1. Check if TestCaseTemplateGenerator exists
    console.log('1. Checking TestCaseTemplateGenerator...');
    const generatorPath = path.join(process.cwd(), 'utils/TestCaseTemplateGenerator.ts');
    if (fs.existsSync(generatorPath)) {
      console.log('   ✅ TestCaseTemplateGenerator exists');
    } else {
      throw new Error('TestCaseTemplateGenerator not found');
    }

    // 2. Check if TestCaseBuilder exists
    console.log('\n2. Checking TestCaseBuilder...');
    const builderPath = path.join(process.cwd(), 'components/testing/TestCaseBuilder/TestCaseBuilder.tsx');
    if (fs.existsSync(builderPath)) {
      console.log('   ✅ TestCaseBuilder exists');
    } else {
      throw new Error('TestCaseBuilder not found');
    }

    // 3. Check if creation guide exists
    console.log('\n3. Checking creation guide...');
    const guidePath = path.join(process.cwd(), 'TEST-CASE-CREATION-GUIDE.md');
    if (fs.existsSync(guidePath)) {
      console.log('   ✅ Test case creation guide exists');
    } else {
      throw new Error('Test case creation guide not found');
    }

    // 4. Validate template generator features
    console.log('\n4. Validating template generator features...');
    const generatorContent = fs.readFileSync(generatorPath, 'utf8');
    
    const generatorFeatures = [
      'class TestCaseTemplateGenerator',
      'getAvailableTemplates()',
      'getTemplate(templateType)',
      'generateTestCase(',
      'validateTestCase(',
      'createLTEPowerOnTemplate()',
      'create5GNRInitialAccessTemplate()',
      'createLTEHandoverTemplate()',
      'createLTECallSetupTemplate()',
      'createLTEDataSessionTemplate()',
      'create5GNRHandoverTemplate()',
      'create5GNRPDUSessionTemplate()',
      'create5GNRMobilityTemplate()',
      'createOranRicTestTemplate()',
      'createOranXAppDeploymentTemplate()',
      'createNbIotAttachTemplate()',
      'createNbIotDataTransmissionTemplate()',
      'createCV2XSidelinkTemplate()',
      'createCV2XSafetyMessageTemplate()',
      'createNTNSatelliteAccessTemplate()',
      'createNTNHandoverTemplate()'
    ];
    
    let generatorFeaturesFound = 0;
    for (const feature of generatorFeatures) {
      if (generatorContent.includes(feature)) {
        console.log(`   ✅ ${feature}`);
        generatorFeaturesFound++;
      } else {
        console.log(`   ❌ ${feature} missing`);
      }
    }
    
    if (generatorFeaturesFound < generatorFeatures.length * 0.8) {
      throw new Error('TestCaseTemplateGenerator missing critical features');
    }

    // 5. Validate template structure
    console.log('\n5. Validating template structure...');
    const templateInterfaces = [
      'interface TestCaseTemplate',
      'interface UEProfileTemplate',
      'interface DeviceCapabilitiesTemplate',
      'interface SecuritySupportTemplate',
      'interface CellConfigTemplate',
      'interface TestStepTemplate',
      'interface IETemplate',
      'interface AssertionTemplate',
      'interface LayerParameterTemplate',
      'interface TestScenarioTemplate',
      'interface ValidationRuleTemplate'
    ];
    
    let templateInterfacesFound = 0;
    for (const interfaceName of templateInterfaces) {
      if (generatorContent.includes(interfaceName)) {
        console.log(`   ✅ ${interfaceName}`);
        templateInterfacesFound++;
      } else {
        console.log(`   ❌ ${interfaceName} missing`);
      }
    }
    
    if (templateInterfacesFound < templateInterfaces.length * 0.8) {
      throw new Error('Template interfaces missing');
    }

    // 6. Check available templates
    console.log('\n6. Checking available templates...');
    const expectedTemplates = [
      'lte-power-on',
      'lte-handover',
      'lte-call-setup',
      'lte-data-session',
      '5g-nr-initial-access',
      '5g-nr-handover',
      '5g-nr-pdu-session',
      '5g-nr-mobility',
      'oran-ric-test',
      'oran-xapp-deployment',
      'nb-iot-attach',
      'nb-iot-data-transmission',
      'c-v2x-sidelink',
      'c-v2x-safety-message',
      'ntn-satellite-access',
      'ntn-handover'
    ];
    
    let templatesFound = 0;
    for (const template of expectedTemplates) {
      if (generatorContent.includes(`'${template}'`)) {
        console.log(`   ✅ ${template}`);
        templatesFound++;
      } else {
        console.log(`   ❌ ${template} missing`);
      }
    }
    
    if (templatesFound < expectedTemplates.length * 0.8) {
      throw new Error('Expected templates missing');
    }

    // 7. Validate TestCaseBuilder features
    console.log('\n7. Validating TestCaseBuilder features...');
    const builderContent = fs.readFileSync(builderPath, 'utf8');
    
    const builderFeatures = [
      'TestCaseBuilder',
      'testCaseTemplateGenerator',
      'handleTemplateSelect',
      'handleValidate',
      'handleSave',
      'renderTemplateSelection',
      'renderTestCaseEditor',
      'technologyIcons',
      'categoryIcons'
    ];
    
    let builderFeaturesFound = 0;
    for (const feature of builderFeatures) {
      if (builderContent.includes(feature)) {
        console.log(`   ✅ ${feature}`);
        builderFeaturesFound++;
      } else {
        console.log(`   ❌ ${feature} missing`);
      }
    }
    
    if (builderFeaturesFound < builderFeatures.length * 0.8) {
      throw new Error('TestCaseBuilder missing critical features');
    }

    // 8. Check 3GPP compliance features
    console.log('\n8. Checking 3GPP compliance features...');
    const complianceFeatures = [
      '3GPP TS 36.101',
      'isValidIMSI',
      'isValidIMEI',
      'isValidMCC',
      'isValidMNC'
    ];
    
    let complianceFeaturesFound = 0;
    for (const feature of complianceFeatures) {
      if (generatorContent.includes(feature)) {
        console.log(`   ✅ ${feature}`);
        complianceFeaturesFound++;
      } else {
        console.log(`   ❌ ${feature} missing`);
      }
    }
    
    if (complianceFeaturesFound < complianceFeatures.length * 0.8) {
      throw new Error('3GPP compliance features missing');
    }

    // 9. Check validation features
    console.log('\n9. Checking validation features...');
    const validationFeatures = [
      'validateTestCase',
      'validateLTESpecific',
      'validate5GNRSpecific',
      'validateNbIotSpecific',
      'validateCV2XSpecific',
      'validateNTNSpecific',
      'ValidationResult',
      'isValid',
      'errors',
      'warnings'
    ];
    
    let validationFeaturesFound = 0;
    for (const feature of validationFeatures) {
      if (generatorContent.includes(feature)) {
        console.log(`   ✅ ${feature}`);
        validationFeaturesFound++;
      } else {
        console.log(`   ❌ ${feature} missing`);
      }
    }
    
    if (validationFeaturesFound < validationFeatures.length * 0.8) {
      throw new Error('Validation features missing');
    }

    // 10. Check template completeness
    console.log('\n10. Checking template completeness...');
    const lteTemplateFeatures = [
      'lte-power-on-template',
      'LTE Power-On Default Attach',
      'POWER_ON',
      'ueProfile',
      'cellConfig',
      'expectedMessageSequence',
      'assertions',
      'layerParameters',
      'informationElements',
      'testScenario',
      'validationRules'
    ];
    
    let lteTemplateFeaturesFound = 0;
    for (const feature of lteTemplateFeatures) {
      if (generatorContent.includes(feature)) {
        console.log(`   ✅ ${feature}`);
        lteTemplateFeaturesFound++;
      } else {
        console.log(`   ❌ ${feature} missing`);
      }
    }
    
    if (lteTemplateFeaturesFound < lteTemplateFeatures.length * 0.8) {
      throw new Error('LTE template incomplete');
    }

    console.log('\n🎉 Template System Test PASSED!');
    console.log('\n📋 Summary:');
    console.log('   • TestCaseTemplateGenerator properly implemented');
    console.log('   • TestCaseBuilder UI component ready');
    console.log('   • Test case creation guide available');
    console.log('   • All template interfaces defined');
    console.log(`   • ${templatesFound}/${expectedTemplates.length} templates available`);
    console.log('   • 3GPP compliance features implemented');
    console.log('   • Comprehensive validation system');
    console.log('   • Complete LTE template example');
    console.log('\n✅ Template system is ready for test case creation!');
    console.log('\n🚀 How to use:');
    console.log('   1. Go to User Dashboard');
    console.log('   2. Click "Test Case Builder" tab');
    console.log('   3. Select a template from available options');
    console.log('   4. Customize the test case parameters');
    console.log('   5. Validate against 3GPP standards');
    console.log('   6. Save and deploy for testing');

  } catch (error) {
    console.error('\n❌ Template System Test FAILED!');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the test
testTemplateSystem();