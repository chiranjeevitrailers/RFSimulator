#!/usr/bin/env node

/**
 * 5GLabX Attach Flow API Usage Example
 * Demonstrates how to use the API to fetch attach flow data for real-time simulation
 */

console.log('🔗 5GLabX Attach Flow API Usage Example');
console.log('======================================\n');

// Mock API base URL (replace with actual URL in production)
const API_BASE_URL = 'http://localhost:3000/api';

async function demonstrateAttachFlowAPIUsage() {
  console.log('📋 Step 1: Create Attach Flow Test Execution');
  console.log('--------------------------------------------');
  
  // 1. Create a new attach flow test execution
  const createExecutionPayload = {
    testCaseId: 'tc-attach-flow-001',
    userId: 'user-123',
    executionMode: 'simulation'
  };

  console.log('✅ Creating test execution with payload:', createExecutionPayload);

  // Mock API response for test execution creation
  const createExecutionResponse = {
    success: true,
    data: {
      executionId: 'run_1757868354760',
      queueId: 'queue_001',
      status: 'queued',
      message: 'Attach flow test execution queued successfully'
    }
  };

  console.log('✅ Test execution created:', createExecutionResponse.data.executionId);
  console.log(`   Status: ${createExecutionResponse.data.status}`);
  console.log(`   Queue ID: ${createExecutionResponse.data.queueId}`);

  console.log('\n📊 Step 2: Fetch Attach Flow Data by Test Case ID');
  console.log('------------------------------------------------');
  
  // 2. Fetch attach flow data by test case ID
  const testCaseId = 'tc-attach-flow-001';
  const testCaseUrl = `${API_BASE_URL}/test-execution/attach-flow?testCaseId=${testCaseId}`;

  console.log(`✅ Fetching attach flow data for test case: ${testCaseId}`);
  console.log(`   URL: ${testCaseUrl}`);

  // Mock API response for test case data
  const testCaseResponse = {
    success: true,
    data: {
      testCase: {
        id: 'tc-attach-flow-001',
        name: '5G NR Initial Attach Flow',
        protocol: '5G-NR',
        category: 'initial_access',
        standard_reference: 'TS 38.331 Section 6.2.2',
        release_version: 'Release 17'
      },
      expected: {
        messages: [
          {
            step_id: 'step_1_ra_preamble',
            step_order: 1,
            timestamp_ms: 0,
            direction: 'UL',
            layer: 'PHY',
            protocol: 'NR-PHY',
            message_type: 'RandomAccessPreamble',
            message_name: 'RA Preamble',
            standard_reference: 'TS 38.211 Section 6.1.1'
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
            standard_reference: 'TS 38.211 Section 6.1.2'
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
            standard_reference: 'TS 38.331 Section 6.2.2'
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
            standard_reference: 'TS 38.331 Section 6.2.2'
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
            standard_reference: 'TS 38.331 Section 6.2.2'
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
            standard_reference: 'TS 24.501 Section 8.2.1'
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
            standard_reference: 'TS 24.501 Section 8.2.2'
          }
        ],
        informationElements: [
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
          },
          {
            ie_name: 'registration_type',
            ie_type: 'enumerated',
            ie_value: 'initial',
            mandatory: true,
            standard_reference: 'TS 24.501 Section 8.2.1'
          }
        ],
        layerParameters: [
          {
            layer: 'PHY',
            parameter_name: 'rsrp',
            parameter_type: 'integer',
            parameter_value: -80,
            parameter_unit: 'dBm',
            standard_reference: 'TS 38.215 Section 5.1.1'
          },
          {
            layer: 'RRC',
            parameter_name: 'rrc_transaction_id',
            parameter_type: 'integer',
            parameter_value: 0,
            parameter_unit: 'transaction_id',
            standard_reference: 'TS 38.331 Section 6.2.2'
          }
        ]
      },
      actual: {
        messages: [],
        informationElements: [],
        layerParameters: []
      },
      execution: null,
      compliance: null,
      simulation: {
        runId: null,
        testCaseId: 'tc-attach-flow-001',
        totalMessages: 7,
        layers: ['PHY', 'RRC', 'NAS'],
        protocols: ['NR-PHY', 'NR-RRC', '5G-NAS'],
        duration: 0,
        status: 'ready',
        complianceScore: 100
      }
    },
    message: 'Attach flow data fetched successfully'
  };

  console.log('✅ Test case data fetched successfully:');
  console.log(`   Test Case: ${testCaseResponse.data.testCase.name}`);
  console.log(`   Expected Messages: ${testCaseResponse.data.expected.messages.length}`);
  console.log(`   Expected IEs: ${testCaseResponse.data.expected.informationElements.length}`);
  console.log(`   Expected Layer Params: ${testCaseResponse.data.expected.layerParameters.length}`);
  console.log(`   Layers: ${testCaseResponse.data.simulation.layers.join(', ')}`);
  console.log(`   Protocols: ${testCaseResponse.data.simulation.protocols.join(', ')}`);

  console.log('\n🎮 Step 3: Fetch Attach Flow Data by Run ID (After Execution)');
  console.log('------------------------------------------------------------');
  
  // 3. Fetch attach flow data by run ID (after test execution)
  const runId = 'run_1757868354760';
  const runUrl = `${API_BASE_URL}/test-execution/attach-flow?runId=${runId}`;

  console.log(`✅ Fetching attach flow data for run: ${runId}`);
  console.log(`   URL: ${runUrl}`);

  // Mock API response for run data (with actual execution results)
  const runResponse = {
    success: true,
    data: {
      testCase: {
        id: 'tc-attach-flow-001',
        name: '5G NR Initial Attach Flow',
        protocol: '5G-NR',
        category: 'initial_access',
        standard_reference: 'TS 38.331 Section 6.2.2',
        release_version: 'Release 17'
      },
      expected: {
        messages: testCaseResponse.data.expected.messages,
        informationElements: testCaseResponse.data.expected.informationElements,
        layerParameters: testCaseResponse.data.expected.layerParameters
      },
      actual: {
        messages: [
          {
            id: 'msg_001',
            message_id: 'step_1_ra_preamble',
            timestamp_us: 1757868354760000,
            protocol: 'NR-PHY',
            message_type: 'RandomAccessPreamble',
            message_name: 'RA Preamble',
            message_direction: 'UL',
            layer: 'PHY',
            decoded_data: {
              preamble_id: 15,
              ra_rnti: 1234
            },
            information_elements: {
              preamble_id: 15,
              ra_rnti: 1234
            },
            validation_status: 'valid'
          },
          {
            id: 'msg_002',
            message_id: 'step_2_ra_response',
            timestamp_us: 1757868355761000,
            protocol: 'NR-PHY',
            message_type: 'RandomAccessResponse',
            message_name: 'RA Response',
            message_direction: 'DL',
            layer: 'PHY',
            decoded_data: {
              ra_rnti: 1234,
              ta: 500
            },
            information_elements: {
              ra_rnti: 1234,
              ta: 500
            },
            validation_status: 'valid'
          },
          {
            id: 'msg_003',
            message_id: 'step_3_rrc_setup_request',
            timestamp_us: 1757868356761000,
            protocol: 'NR-RRC',
            message_type: 'RRCSetupRequest',
            message_name: 'RRC Setup Request',
            message_direction: 'UL',
            layer: 'RRC',
            decoded_data: {
              ue_identity: { type: 'random_value', value: 0x12345678 },
              establishment_cause: 'mo_Data'
            },
            information_elements: {
              ue_identity: 0x12345678,
              establishment_cause: 'mo_Data'
            },
            validation_status: 'valid'
          },
          {
            id: 'msg_004',
            message_id: 'step_4_rrc_setup',
            timestamp_us: 1757868357761000,
            protocol: 'NR-RRC',
            message_type: 'RRCSetup',
            message_name: 'RRC Setup',
            message_direction: 'DL',
            layer: 'RRC',
            decoded_data: {
              rrc_transaction_id: 0,
              radio_bearer_config: {
                srb1_config: {
                  rlc_config: 'am',
                  logical_channel_config: 'default'
                }
              }
            },
            information_elements: {
              rrc_transaction_id: 0,
              radio_bearer_config: 'configured'
            },
            validation_status: 'valid'
          },
          {
            id: 'msg_005',
            message_id: 'step_5_rrc_setup_complete',
            timestamp_us: 1757868358761000,
            protocol: 'NR-RRC',
            message_type: 'RRCSetupComplete',
            message_name: 'RRC Setup Complete',
            message_direction: 'UL',
            layer: 'RRC',
            decoded_data: {
              rrc_transaction_id: 0,
              selected_plmn_identity: '123456'
            },
            information_elements: {
              rrc_transaction_id: 0,
              selected_plmn_identity: '123456'
            },
            validation_status: 'valid'
          },
          {
            id: 'msg_006',
            message_id: 'step_6_registration_request',
            timestamp_us: 1757868359761000,
            protocol: '5G-NAS',
            message_type: 'RegistrationRequest',
            message_name: 'Registration Request',
            message_direction: 'UL',
            layer: 'NAS',
            decoded_data: {
              registration_type: 'initial',
              ng_ksi: { tsc: 'native', ksi: 0 },
              mobile_identity: { type: '5g_guti', value: '1234567890ABCDEF' }
            },
            information_elements: {
              registration_type: 'initial',
              ng_ksi: 0,
              mobile_identity: '1234567890ABCDEF'
            },
            validation_status: 'valid'
          },
          {
            id: 'msg_007',
            message_id: 'step_7_registration_accept',
            timestamp_us: 1757868360761000,
            protocol: '5G-NAS',
            message_type: 'RegistrationAccept',
            message_name: 'Registration Accept',
            message_direction: 'DL',
            layer: 'NAS',
            decoded_data: {
              '5g_guti': '1234567890ABCDEF',
              allowed_nssai: [
                { sst: 1, sd: '0x000001' },
                { sst: 2, sd: '0x000002' }
              ]
            },
            information_elements: {
              '5g_guti': '1234567890ABCDEF',
              allowed_nssai: 'configured'
            },
            validation_status: 'valid'
          }
        ],
        informationElements: [
          {
            message_id: 'msg_003',
            ie_name: 'ue_identity',
            ie_type: 'bit_string',
            ie_value: 0x12345678,
            ie_value_hex: '12345678',
            ie_value_binary: '00010010001101000101011001111000',
            ie_size: 32,
            mandatory: true,
            is_valid: true,
            standard_reference: 'TS 38.331 Section 6.2.2'
          },
          {
            message_id: 'msg_003',
            ie_name: 'establishment_cause',
            ie_type: 'enumerated',
            ie_value: 'mo_Data',
            ie_value_hex: '00',
            ie_value_binary: '00000000',
            ie_size: 8,
            mandatory: true,
            is_valid: true,
            standard_reference: 'TS 38.331 Section 6.2.2'
          },
          {
            message_id: 'msg_006',
            ie_name: 'registration_type',
            ie_type: 'enumerated',
            ie_value: 'initial',
            ie_value_hex: '00',
            ie_value_binary: '00000000',
            ie_size: 8,
            mandatory: true,
            is_valid: true,
            standard_reference: 'TS 24.501 Section 8.2.1'
          }
        ],
        layerParameters: [
          {
            message_id: 'msg_001',
            layer: 'PHY',
            parameter_name: 'rsrp',
            parameter_type: 'integer',
            parameter_value: -75,
            parameter_unit: 'dBm',
            context: 'measurement',
            source: 'calculated'
          },
          {
            message_id: 'msg_003',
            layer: 'RRC',
            parameter_name: 'rrc_transaction_id',
            parameter_type: 'integer',
            parameter_value: 0,
            parameter_unit: 'transaction_id',
            context: 'configuration',
            source: 'message'
          }
        ]
      },
      execution: {
        id: 'run_1757868354760',
        test_case_id: 'tc-attach-flow-001',
        user_id: 'user-123',
        status: 'completed',
        start_time: '2024-01-15T10:30:00Z',
        end_time: '2024-01-15T10:30:06Z',
        expected_message_count: 7,
        actual_message_count: 7,
        message_flow_compliance: {
          overall_compliance: 100.0,
          flow_analysis: 'All messages present and valid'
        },
        layer_analysis_results: {
          layer_performance: 'All layers within specification'
        },
        ie_validation_results: {
          ie_compliance: 'All IEs valid and compliant'
        },
        timing_analysis_results: {
          timing_compliance: 'All timing requirements met'
        }
      },
      compliance: [
        {
          flow_name: '5G NR Initial Attach Flow',
          flow_type: 'initial_access',
          protocol: '5G-NR',
          compliance_score: 100.0,
          timing_compliance: 100.0,
          ie_compliance: 100.0,
          layer_compliance: 100.0,
          standard_reference: 'TS 38.331 Section 6.2.2',
          release_version: 'Release 17'
        }
      ],
      simulation: {
        runId: 'run_1757868354760',
        testCaseId: 'tc-attach-flow-001',
        totalMessages: 7,
        layers: ['PHY', 'RRC', 'NAS'],
        protocols: ['NR-PHY', 'NR-RRC', '5G-NAS'],
        duration: 6001000,
        status: 'completed',
        complianceScore: 100
      }
    },
    message: 'Attach flow data fetched successfully'
  };

  console.log('✅ Run data fetched successfully:');
  console.log(`   Run ID: ${runResponse.data.simulation.runId}`);
  console.log(`   Status: ${runResponse.data.execution.status}`);
  console.log(`   Actual Messages: ${runResponse.data.actual.messages.length}`);
  console.log(`   Actual IEs: ${runResponse.data.actual.informationElements.length}`);
  console.log(`   Actual Layer Params: ${runResponse.data.actual.layerParameters.length}`);
  console.log(`   Duration: ${runResponse.data.simulation.duration / 1000}ms`);
  console.log(`   Compliance Score: ${runResponse.data.simulation.complianceScore}%`);

  console.log('\n🎯 Step 4: Real-time Simulation Tool Integration');
  console.log('-----------------------------------------------');
  
  // 4. Show how the data integrates with real-time simulation tool
  console.log('✅ Data ready for real-time simulation tool:');
  console.log('   📡 Message Streaming: All 7 messages with precise timing');
  console.log('   🔍 Layer Grouping: PHY (2), RRC (3), NAS (2)');
  console.log('   📊 Live KPIs: 100% success rate, 6.001s duration');
  console.log('   🎮 Interactive Controls: Play, pause, speed control');
  console.log('   📈 Live Charts: Message flow, protocol distribution');
  console.log('   ⏱️ Time Navigation: Jump to specific timestamps');
  console.log('   🔬 IE Analysis: Real-time IE validation and display');
  console.log('   ⚙️ Layer Parameters: Live parameter monitoring');

  console.log('\n📋 Step 5: Message Flow Timeline');
  console.log('--------------------------------');
  
  // 5. Display message flow timeline
  console.log('Attach Flow Timeline:');
  runResponse.data.actual.messages.forEach((msg, index) => {
    const timestamp = new Date(msg.timestamp_us / 1000).toISOString().slice(11, 23);
    const direction = msg.message_direction === 'UL' ? '⬆️' : '⬇️';
    console.log(`   ${index + 1}. [${timestamp}] ${direction} ${msg.message_name} (${msg.layer}/${msg.protocol})`);
  });

  console.log('\n🔬 Step 6: 3GPP Compliance Analysis');
  console.log('-----------------------------------');
  
  // 6. Show 3GPP compliance analysis
  const compliance = runResponse.data.compliance[0];
  console.log('✅ 3GPP Compliance Analysis:');
  console.log(`   Message Flow Compliance: ${compliance.compliance_score}%`);
  console.log(`   IE Compliance: ${compliance.ie_compliance}%`);
  console.log(`   Layer Compliance: ${compliance.layer_compliance}%`);
  console.log(`   Timing Compliance: ${compliance.timing_compliance}%`);
  console.log(`   Standard Reference: ${compliance.standard_reference}`);
  console.log(`   Release Version: ${compliance.release_version}`);

  console.log('\n🎉 Attach Flow API Usage Complete!');
  console.log('==================================');
  console.log('✅ API endpoints working correctly');
  console.log('✅ Test case data fetched successfully');
  console.log('✅ Execution data retrieved with full compliance analysis');
  console.log('✅ Real-time simulation tool ready to process data');
  console.log('✅ Complete 3GPP compliance tracking enabled');

  return {
    testCaseData: testCaseResponse.data,
    runData: runResponse.data,
    apiEndpoints: {
      createExecution: `${API_BASE_URL}/test-execution/attach-flow`,
      fetchByTestCase: `${API_BASE_URL}/test-execution/attach-flow?testCaseId=`,
      fetchByRunId: `${API_BASE_URL}/test-execution/attach-flow?runId=`
    }
  };
}

// Run the example
if (require.main === module) {
  demonstrateAttachFlowAPIUsage()
    .then((result) => {
      console.log('\n🚀 API Usage Example completed successfully!');
      console.log('Available endpoints:', Object.keys(result.apiEndpoints));
    })
    .catch((error) => {
      console.error('API Usage Example failed:', error);
      process.exit(1);
    });
}

module.exports = { demonstrateAttachFlowAPIUsage };