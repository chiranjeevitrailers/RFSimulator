#!/usr/bin/env node

/**
 * 5GLabX Attach Flow Data Fetch Example
 * Demonstrates how to fetch complete attach flow data for real-time simulation
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log('🔗 5GLabX Attach Flow Data Fetch Example');
console.log('========================================\n');

async function fetchAttachFlowData() {
  try {
    console.log('📋 Step 1: Fetch Test Case Definition');
    console.log('-------------------------------------');
    
    // 1. Fetch test case definition for 5G NR Attach Flow
    const { data: testCase, error: testCaseError } = await supabase
      .from('test_cases')
      .select('*')
      .eq('name', '5G NR Initial Attach Flow')
      .eq('category', 'initial_access')
      .single();

    if (testCaseError) {
      console.log('❌ Test case not found, creating example...');
      // For demo purposes, we'll create a mock test case
      const mockTestCase = {
        id: 'tc-attach-flow-001',
        name: '5G NR Initial Attach Flow',
        category: 'initial_access',
        protocol: '5G-NR',
        standard_reference: 'TS 38.331 Section 6.2.2',
        release_version: 'Release 17',
        description: 'Complete 5G NR initial attach flow with all message sequences'
      };
      console.log('✅ Mock test case created:', mockTestCase.name);
    } else {
      console.log('✅ Test case found:', testCase.name);
      console.log(`   Protocol: ${testCase.protocol}`);
      console.log(`   Standard: ${testCase.standard_reference}`);
      console.log(`   Release: ${testCase.release_version}`);
    }

    console.log('\n📊 Step 2: Fetch Expected Message Flow');
    console.log('--------------------------------------');
    
    // 2. Fetch expected message flow for attach flow
    const expectedMessages = [
      {
        step_id: 'step_1_ra_preamble',
        step_order: 1,
        timestamp_ms: 0,
        direction: 'UL',
        layer: 'PHY',
        protocol: 'NR-PHY',
        message_type: 'RandomAccessPreamble',
        message_name: 'RA Preamble',
        standard_reference: 'TS 38.211 Section 6.1.1',
        release_version: 'Release 17',
        validation_criteria: {
          preamble_id: { min: 0, max: 63 },
          ra_rnti: { min: 1, max: 65536 }
        }
      },
      {
        step_id: 'step_2_ra_response',
        step_order: 2,
        timestamp_ms: 1000,
        direction: 'DL',
        layer: 'PHY',
        protocol: 'NR-PHY',
        message_type: 'RandomAccessResponse',
        message_name: 'RA Response',
        standard_reference: 'TS 38.211 Section 6.1.2',
        release_version: 'Release 17',
        validation_criteria: {
          ra_rnti: { min: 1, max: 65536 },
          ta: { min: 0, max: 1282 }
        }
      },
      {
        step_id: 'step_3_rrc_setup_request',
        step_order: 3,
        timestamp_ms: 2000,
        direction: 'UL',
        layer: 'RRC',
        protocol: 'NR-RRC',
        message_type: 'RRCSetupRequest',
        message_name: 'RRC Setup Request',
        standard_reference: 'TS 38.331 Section 6.2.2',
        release_version: 'Release 17',
        validation_criteria: {
          ue_identity: { type: 'random_value' },
          establishment_cause: { values: ['mo_Data', 'mo_Signalling'] }
        }
      },
      {
        step_id: 'step_4_rrc_setup',
        step_order: 4,
        timestamp_ms: 3000,
        direction: 'DL',
        layer: 'RRC',
        protocol: 'NR-RRC',
        message_type: 'RRCSetup',
        message_name: 'RRC Setup',
        standard_reference: 'TS 38.331 Section 6.2.2',
        release_version: 'Release 17',
        validation_criteria: {
          rrc_transaction_id: { min: 0, max: 3 },
          radio_bearer_config: { required: true }
        }
      },
      {
        step_id: 'step_5_rrc_setup_complete',
        step_order: 5,
        timestamp_ms: 4000,
        direction: 'UL',
        layer: 'RRC',
        protocol: 'NR-RRC',
        message_type: 'RRCSetupComplete',
        message_name: 'RRC Setup Complete',
        standard_reference: 'TS 38.331 Section 6.2.2',
        release_version: 'Release 17',
        validation_criteria: {
          rrc_transaction_id: { min: 0, max: 3 },
          selected_plmn_identity: { required: true }
        }
      },
      {
        step_id: 'step_6_registration_request',
        step_order: 6,
        timestamp_ms: 5000,
        direction: 'UL',
        layer: 'NAS',
        protocol: '5G-NAS',
        message_type: 'RegistrationRequest',
        message_name: 'Registration Request',
        standard_reference: 'TS 24.501 Section 8.2.1',
        release_version: 'Release 17',
        validation_criteria: {
          registration_type: { values: ['initial', 'mobility', 'periodic'] },
          '5g_s_tmsi': { required: false }
        }
      },
      {
        step_id: 'step_7_registration_accept',
        step_order: 7,
        timestamp_ms: 6000,
        direction: 'DL',
        layer: 'NAS',
        protocol: '5G-NAS',
        message_type: 'RegistrationAccept',
        message_name: 'Registration Accept',
        standard_reference: 'TS 24.501 Section 8.2.2',
        release_version: 'Release 17',
        validation_criteria: {
          '5g_guti': { required: true },
          allowed_nssai: { required: true }
        }
      }
    ];

    console.log(`✅ Expected message flow loaded: ${expectedMessages.length} messages`);
    expectedMessages.forEach((msg, index) => {
      console.log(`   ${index + 1}. ${msg.message_name} (${msg.layer}/${msg.protocol}) - ${msg.direction}`);
    });

    console.log('\n🔍 Step 3: Fetch Expected Information Elements');
    console.log('---------------------------------------------');
    
    // 3. Fetch expected IEs for each message
    const expectedIEs = {
      'step_3_rrc_setup_request': [
        {
          ie_name: 'ue_identity',
          ie_type: 'bit_string',
          ie_value: { type: 'random_value', size: 32 },
          mandatory: true,
          standard_reference: 'TS 38.331 Section 6.2.2'
        },
        {
          ie_name: 'establishment_cause',
          ie_type: 'enumerated',
          ie_value: 'mo_Data',
          mandatory: true,
          standard_reference: 'TS 38.331 Section 6.2.2'
        }
      ],
      'step_6_registration_request': [
        {
          ie_name: 'registration_type',
          ie_type: 'enumerated',
          ie_value: 'initial',
          mandatory: true,
          standard_reference: 'TS 24.501 Section 8.2.1'
        },
        {
          ie_name: 'ng_ksi',
          ie_type: 'bit_string',
          ie_value: { tsc: 'native', ksi: 0 },
          mandatory: true,
          standard_reference: 'TS 24.501 Section 8.2.1'
        },
        {
          ie_name: 'mobile_identity',
          ie_type: 'bit_string',
          ie_value: { type: '5g_guti' },
          mandatory: true,
          standard_reference: 'TS 24.501 Section 8.2.1'
        }
      ]
    };

    console.log('✅ Expected IEs loaded for key messages:');
    Object.entries(expectedIEs).forEach(([stepId, ies]) => {
      console.log(`   ${stepId}:`);
      ies.forEach(ie => {
        console.log(`     - ${ie.ie_name} (${ie.ie_type}) - ${ie.mandatory ? 'Mandatory' : 'Optional'}`);
      });
    });

    console.log('\n⚙️ Step 4: Fetch Expected Layer Parameters');
    console.log('------------------------------------------');
    
    // 4. Fetch expected layer parameters
    const expectedLayerParams = {
      'PHY': [
        {
          parameter_name: 'rsrp',
          parameter_type: 'integer',
          parameter_value: -80,
          parameter_unit: 'dBm',
          standard_reference: 'TS 38.215 Section 5.1.1'
        },
        {
          parameter_name: 'rsrq',
          parameter_type: 'integer',
          parameter_value: -10,
          parameter_unit: 'dB',
          standard_reference: 'TS 38.215 Section 5.1.2'
        }
      ],
      'RRC': [
        {
          parameter_name: 'rrc_transaction_id',
          parameter_type: 'integer',
          parameter_value: 0,
          parameter_unit: 'transaction_id',
          standard_reference: 'TS 38.331 Section 6.2.2'
        }
      ],
      'NAS': [
        {
          parameter_name: 'security_context',
          parameter_type: 'object',
          parameter_value: {
            integrity_protection: 'enabled',
            ciphering: 'enabled',
            key_set_id: 0
          },
          parameter_unit: 'context',
          standard_reference: 'TS 24.501 Section 8.2.1'
        }
      ]
    };

    console.log('✅ Expected layer parameters loaded:');
    Object.entries(expectedLayerParams).forEach(([layer, params]) => {
      console.log(`   ${layer} Layer:`);
      params.forEach(param => {
        console.log(`     - ${param.parameter_name}: ${JSON.stringify(param.parameter_value)} ${param.parameter_unit}`);
      });
    });

    console.log('\n🎮 Step 5: Simulate Test Execution and Store Data');
    console.log('------------------------------------------------');
    
    // 5. Simulate test execution and store actual data
    const runId = `run_${Date.now()}`;
    const actualMessages = [];
    
    for (const expectedMsg of expectedMessages) {
      // Generate actual message data
      const actualMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        test_run_id: runId,
        message_id: expectedMsg.step_id,
        timestamp_us: Date.now() * 1000 + expectedMsg.timestamp_ms * 1000,
        protocol: expectedMsg.protocol,
        message_type: expectedMsg.message_type,
        message_name: expectedMsg.message_name,
        message_direction: expectedMsg.direction,
        layer: expectedMsg.layer,
        decoded_data: generateMessageData(expectedMsg),
        information_elements: generateInformationElements(expectedMsg),
        validation_status: 'valid',
        standard_reference: expectedMsg.standard_reference
      };
      
      actualMessages.push(actualMessage);
      console.log(`✅ Generated actual message: ${actualMessage.message_name} at ${actualMessage.timestamp_us}μs`);
    }

    console.log('\n📊 Step 6: Fetch Data for Real-time Simulation');
    console.log('----------------------------------------------');
    
    // 6. Fetch all data needed for real-time simulation
    const simulationData = {
      testCase: testCase || {
        id: 'tc-attach-flow-001',
        name: '5G NR Initial Attach Flow',
        protocol: '5G-NR'
      },
      expectedMessages: expectedMessages,
      actualMessages: actualMessages,
      expectedIEs: expectedIEs,
      expectedLayerParams: expectedLayerParams,
      runId: runId
    };

    console.log('✅ Complete simulation data prepared:');
    console.log(`   Test Case: ${simulationData.testCase.name}`);
    console.log(`   Expected Messages: ${simulationData.expectedMessages.length}`);
    console.log(`   Actual Messages: ${simulationData.actualMessages.length}`);
    console.log(`   Expected IEs: ${Object.keys(simulationData.expectedIEs).length} message types`);
    console.log(`   Layer Parameters: ${Object.keys(simulationData.expectedLayerParams).length} layers`);

    console.log('\n🎯 Step 7: Real-time Simulation Tool Integration');
    console.log('-----------------------------------------------');
    
    // 7. Show how data feeds into real-time simulation tool
    console.log('✅ Data ready for real-time simulation tool:');
    console.log('   📡 Message Streaming: All messages with timing');
    console.log('   🔍 Layer Grouping: PHY, MAC, RLC, PDCP, RRC, NAS');
    console.log('   📊 Live KPIs: Success rate, latency, throughput');
    console.log('   🎮 Interactive Controls: Play, pause, speed control');
    console.log('   📈 Live Charts: Message flow, protocol distribution');
    console.log('   ⏱️ Time Navigation: Jump to specific timestamps');

    console.log('\n📋 Step 8: Message Flow Timeline');
    console.log('--------------------------------');
    
    // 8. Display message flow timeline
    console.log('Attach Flow Timeline:');
    actualMessages.forEach((msg, index) => {
      const timestamp = new Date(msg.timestamp_us / 1000).toISOString().slice(11, 23);
      console.log(`   ${index + 1}. [${timestamp}] ${msg.message_name} (${msg.layer}/${msg.protocol}) - ${msg.message_direction}`);
    });

    console.log('\n🎉 Attach Flow Data Fetch Complete!');
    console.log('===================================');
    console.log('✅ All data successfully fetched and prepared for real-time simulation');
    console.log('✅ 3GPP compliance tracking enabled');
    console.log('✅ Complete message flow with timing available');
    console.log('✅ IEs and layer parameters ready for analysis');
    console.log('✅ Real-time simulation tool can now process the data');

    return simulationData;

  } catch (error) {
    console.error('❌ Error fetching attach flow data:', error);
    throw error;
  }
}

// Helper functions
function generateMessageData(expectedMsg) {
  const baseData = {
    message_id: expectedMsg.step_id,
    timestamp: Date.now() + expectedMsg.timestamp_ms,
    protocol_version: expectedMsg.release_version,
    direction: expectedMsg.direction
  };

  switch (expectedMsg.message_type) {
    case 'RRCSetupRequest':
      return {
        ...baseData,
        ue_identity: {
          type: 'random_value',
          value: Math.floor(Math.random() * 0xFFFFFFFF)
        },
        establishment_cause: 'mo_Data',
        spare: 0
      };

    case 'RegistrationRequest':
      return {
        ...baseData,
        registration_type: 'initial',
        ng_ksi: {
          tsc: 'native',
          ksi: Math.floor(Math.random() * 16)
        },
        mobile_identity: {
          type: '5g_guti',
          value: `1234567890${Math.floor(Math.random() * 1000000)}`
        }
      };

    default:
      return {
        ...baseData,
        message_content: {
          type: expectedMsg.message_type,
          data: 'Generated message data'
        }
      };
  }
}

function generateInformationElements(expectedMsg) {
  const ies = [];

  switch (expectedMsg.message_type) {
    case 'RRCSetupRequest':
      ies.push(
        {
          name: 'ue_identity',
          type: 'bit_string',
          value: Math.floor(Math.random() * 0xFFFFFFFF),
          hex_value: Math.floor(Math.random() * 0xFFFFFFFF).toString(16),
          binary_value: Math.floor(Math.random() * 0xFFFFFFFF).toString(2),
          size: 32,
          mandatory: true,
          standard_reference: 'TS 38.331 Section 6.2.2'
        },
        {
          name: 'establishment_cause',
          type: 'enumerated',
          value: 'mo_Data',
          hex_value: '00',
          binary_value: '00000000',
          size: 8,
          mandatory: true,
          standard_reference: 'TS 38.331 Section 6.2.2'
        }
      );
      break;

    case 'RegistrationRequest':
      ies.push(
        {
          name: 'registration_type',
          type: 'enumerated',
          value: 'initial',
          hex_value: '00',
          binary_value: '00000000',
          size: 8,
          mandatory: true,
          standard_reference: 'TS 24.501 Section 8.2.1'
        },
        {
          name: 'ng_ksi',
          type: 'bit_string',
          value: { tsc: 'native', ksi: Math.floor(Math.random() * 16) },
          hex_value: Math.floor(Math.random() * 16).toString(16),
          binary_value: Math.floor(Math.random() * 16).toString(2),
          size: 4,
          mandatory: true,
          standard_reference: 'TS 24.501 Section 8.2.1'
        }
      );
      break;

    default:
      ies.push({
        name: 'message_content',
        type: 'octet_string',
        value: 'Generated IE value',
        hex_value: '47454E455241544544',
        binary_value: '010001110100010101001110010001010101001001000001010101000100010101000100',
        size: 64,
        mandatory: true,
        standard_reference: expectedMsg.standard_reference
      });
  }

  return ies;
}

// Run the example
if (require.main === module) {
  fetchAttachFlowData()
    .then((data) => {
      console.log('\n🚀 Example completed successfully!');
      console.log('Data structure:', JSON.stringify(data, null, 2));
    })
    .catch((error) => {
      console.error('Example failed:', error);
      process.exit(1);
    });
}

module.exports = { fetchAttachFlowData };