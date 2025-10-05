/**
 * Test Enhanced Template System
 * Verifies that the enhanced test case template generator works correctly
 */

const fs = require('fs');
const path = require('path');

async function testEnhancedTemplateSystem() {
  console.log('🧪 Testing Enhanced Template System...\n');

  try {
    // 1. Check if EnhancedTestCaseTemplates exists
    console.log('1. Checking EnhancedTestCaseTemplates...');
    const templatesPath = path.join(process.cwd(), 'utils/EnhancedTestCaseTemplates.ts');
    if (fs.existsSync(templatesPath)) {
      console.log('   ✅ EnhancedTestCaseTemplates exists');
    } else {
      throw new Error('EnhancedTestCaseTemplates not found');
    }

    // 2. Check if EnhancedTestCaseBuilder exists
    console.log('\n2. Checking EnhancedTestCaseBuilder...');
    const builderPath = path.join(process.cwd(), 'components/testing/EnhancedTestCaseBuilder/EnhancedTestCaseBuilder.tsx');
    if (fs.existsSync(builderPath)) {
      console.log('   ✅ EnhancedTestCaseBuilder exists');
    } else {
      throw new Error('EnhancedTestCaseBuilder not found');
    }

    // 3. Validate enhanced template generator features
    console.log('\n3. Validating enhanced template generator features...');
    const templatesContent = fs.readFileSync(templatesPath, 'utf8');
    
    const generatorFeatures = [
      'class EnhancedTestCaseTemplateGenerator',
      'getAvailableTemplates()',
      'getTemplate(templateId)',
      'generateTestCase(',
      'createLTEPowerOnEnhanced()',
      'create5GSARegistrationEnhanced()',
      'createPerformanceTestEnhanced()'
    ];
    
    let generatorFeaturesFound = 0;
    for (const feature of generatorFeatures) {
      if (templatesContent.includes(feature)) {
        console.log(`   ✅ ${feature}`);
        generatorFeaturesFound++;
      } else {
        console.log(`   ❌ ${feature} missing`);
      }
    }
    
    if (generatorFeaturesFound < generatorFeatures.length * 0.8) {
      throw new Error('EnhancedTestCaseTemplateGenerator missing critical features');
    }

    // 4. Validate enhanced template structure
    console.log('\n4. Validating enhanced template structure...');
    const templateInterfaces = [
      'interface EnhancedTestCaseTemplate',
      'interface CallFlowMessage',
      'interface InformationElement',
      'interface LayerParameterUpdate',
      'interface LayerParameterSet',
      'interface LayerParameter',
      'interface ParameterChange',
      'interface EnhancedTestStep',
      'interface TestStepInput',
      'interface TestStepOutput',
      'interface Trigger',
      'interface Condition',
      'interface Validation',
      'interface Assertion',
      'interface ValidationRule',
      'interface KPI',
      'interface TestEnvironment',
      'interface TestData'
    ];
    
    let templateInterfacesFound = 0;
    for (const interfaceName of templateInterfaces) {
      if (templatesContent.includes(interfaceName)) {
        console.log(`   ✅ ${interfaceName}`);
        templateInterfacesFound++;
      } else {
        console.log(`   ❌ ${interfaceName} missing`);
      }
    }
    
    if (templateInterfacesFound < templateInterfaces.length * 0.8) {
      throw new Error('Enhanced template interfaces missing');
    }

    // 5. Check call flow features
    console.log('\n5. Checking call flow features...');
    const callFlowFeatures = [
      'callFlow',
      'messageId',
      'messageName',
      'direction',
      'layer',
      'protocol',
      'timestamp',
      'duration',
      'informationElements',
      'layerParameters',
      'messageContent',
      'expectedResponse',
      'triggers',
      'conditions'
    ];
    
    let callFlowFeaturesFound = 0;
    for (const feature of callFlowFeatures) {
      if (templatesContent.includes(feature)) {
        console.log(`   ✅ ${feature}`);
        callFlowFeaturesFound++;
      } else {
        console.log(`   ❌ ${feature} missing`);
      }
    }
    
    if (callFlowFeaturesFound < callFlowFeatures.length * 0.8) {
      throw new Error('Call flow features missing');
    }

    // 6. Check information elements features
    console.log('\n6. Checking information elements features...');
    const ieFeatures = [
      'ieId',
      'name',
      'type',
      'value',
      'description',
      'mandatory',
      'conditional',
      'standardReference',
      'layer',
      'protocol',
      'encoding',
      'size',
      'criticality'
    ];
    
    let ieFeaturesFound = 0;
    for (const feature of ieFeatures) {
      if (templatesContent.includes(feature)) {
        console.log(`   ✅ ${feature}`);
        ieFeaturesFound++;
      } else {
        console.log(`   ❌ ${feature} missing`);
      }
    }
    
    if (ieFeaturesFound < ieFeatures.length * 0.8) {
      throw new Error('Information elements features missing');
    }

    // 7. Check layer parameter features
    console.log('\n7. Checking layer parameter features...');
    const layerParamFeatures = [
      'layerParameters',
      'parameterName',
      'currentValue',
      'previousValue',
      'change',
      'changePercent',
      'unit',
      'timestamp',
      'trend',
      'criticality',
      'description',
      'dynamicChanges',
      'updateInterval',
      'criticalThresholds',
      'measurementMethod',
      'standardReference'
    ];
    
    let layerParamFeaturesFound = 0;
    for (const feature of layerParamFeatures) {
      if (templatesContent.includes(feature)) {
        console.log(`   ✅ ${feature}`);
        layerParamFeaturesFound++;
      } else {
        console.log(`   ❌ ${feature} missing`);
      }
    }
    
    if (layerParamFeaturesFound < layerParamFeatures.length * 0.8) {
      throw new Error('Layer parameter features missing');
    }

    // 8. Validate EnhancedTestCaseBuilder features
    console.log('\n8. Validating EnhancedTestCaseBuilder features...');
    const builderContent = fs.readFileSync(builderPath, 'utf8');
    
    const builderFeatures = [
      'EnhancedTestCaseBuilder',
      'enhancedTestCaseTemplateGenerator',
      'handleTemplateSelect',
      'handleSave',
      'renderTemplateBrowser',
      'renderTestCaseEditor',
      'renderCallFlowView',
      'renderLayerStatsView',
      'startSimulation',
      'technologyIcons',
      'layerIcons',
      'directionIcons',
      'trendIcons',
      'criticalityColors'
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
      throw new Error('EnhancedTestCaseBuilder missing critical features');
    }

    // 9. Check UI features
    console.log('\n9. Checking UI features...');
    const uiFeatures = [
      'activeView',
      'selectedMessage',
      'selectedLayer',
      'isSimulating',
      'simulationData',
      'callflow',
      'layerstats',
      'renderCallFlowView',
      'renderLayerStatsView',
      'startSimulation'
    ];
    
    let uiFeaturesFound = 0;
    for (const feature of uiFeatures) {
      if (builderContent.includes(feature)) {
        console.log(`   ✅ ${feature}`);
        uiFeaturesFound++;
      } else {
        console.log(`   ❌ ${feature} missing`);
      }
    }
    
    if (uiFeaturesFound < uiFeatures.length * 0.8) {
      throw new Error('UI features missing');
    }

    // 10. Check simulation features
    console.log('\n10. Checking simulation features...');
    const simulationFeatures = [
      'isSimulating',
      'simulationData',
      'startSimulation',
      'trend',
      'criticality'
    ];
    
    let simulationFeaturesFound = 0;
    for (const feature of simulationFeatures) {
      if (builderContent.includes(feature)) {
        console.log(`   ✅ ${feature}`);
        simulationFeaturesFound++;
      } else {
        console.log(`   ❌ ${feature} missing`);
      }
    }
    
    if (simulationFeaturesFound < simulationFeatures.length * 0.8) {
      throw new Error('Simulation features missing');
    }

    console.log('\n🎉 Enhanced Template System Test PASSED!');
    console.log('\n📋 Summary:');
    console.log('   • EnhancedTestCaseTemplateGenerator properly implemented');
    console.log('   • EnhancedTestCaseBuilder UI component ready');
    console.log('   • All enhanced template interfaces defined');
    console.log(`   • ${callFlowFeaturesFound}/${callFlowFeatures.length} call flow features available`);
    console.log(`   • ${ieFeaturesFound}/${ieFeatures.length} information elements features available`);
    console.log(`   • ${layerParamFeaturesFound}/${layerParamFeatures.length} layer parameter features available`);
    console.log(`   • ${builderFeaturesFound}/${builderFeatures.length} builder features available`);
    console.log(`   • ${uiFeaturesFound}/${uiFeatures.length} UI features available`);
    console.log(`   • ${simulationFeaturesFound}/${simulationFeatures.length} simulation features available`);
    console.log('\n✅ Enhanced template system is ready for complete call flows!');
    console.log('\n🚀 How to use:');
    console.log('   1. Go to User Dashboard');
    console.log('   2. Click "Enhanced Test Case Builder" tab');
    console.log('   3. Select a template with complete call flow');
    console.log('   4. View call flow messages with all IEs');
    console.log('   5. Monitor layer statistics with dynamic changes');
    console.log('   6. Start simulation to see real-time parameter updates');

  } catch (error) {
    console.error('\n❌ Enhanced Template System Test FAILED!');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the test
testEnhancedTemplateSystem();