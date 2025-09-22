import { NextRequest, NextResponse } from 'next/server';

/**
 * Mock Test Case Execution API for demonstration
 * This simulates the complete data flow without requiring Supabase
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testCaseId = searchParams.get('testCaseId') || 'TC_5G_NR_INITIAL_ACCESS_001';

    console.log(`🎯 Mock API: Fetching test case data for ${testCaseId}`);

    // Mock comprehensive test case data that simulates real Supabase data
    const mockTestData = {
      testCase: {
        id: testCaseId,
        name: '5G NR Initial Access Procedure',
        description: 'Complete 5G NR initial access procedure with RRC setup and NAS registration',
        protocol: '5G_NR',
        layer: 'Multi',
        complexity: 'intermediate',
        category: { name: '5G NR', description: '5G NR Test Cases' },
        testScenario: 'UE performs initial access to 5G network',
        testObjective: 'Verify successful RRC connection establishment and NAS registration',
        standardReference: 'TS 38.331 5.3.3, TS 24.501 5.5.1',
        releaseVersion: 'Release 17',
        expectedDurationMinutes: 5,
        executionPriority: 5,
        automationLevel: 'automated',
        testDataRequirements: {},
        kpiRequirements: {},
        dependencies: []
      },
      expectedMessages: [
        {
          id: 'msg_001',
          stepId: 'step_001',
          stepOrder: 1,
          timestampMs: 1000,
          direction: 'UL',
          layer: 'RRC',
          protocol: '5G_NR',
          messageType: 'RRCSetupRequest',
          messageName: 'RRC Setup Request',
          messageDescription: 'UE initiates RRC connection establishment',
          standardReference: 'TS 38.331 6.2.2',
          messageVariant: 'standard',
          messagePriority: 'normal',
          retryCount: 0,
          retryIntervalMs: 1000,
          successCriteria: 'Message sent successfully',
          failureCriteria: 'Message transmission failed',
          measurementCriteria: 'Standard measurement criteria',
          messageSequenceGroup: 'initial_access',
          parallelExecution: false,
          conditionalExecution: false,
          messagePayload: {
            rrcSetupRequest: {
              ue_Identity: {
                randomValue: '0x12345678AB',
                type: 'BIT STRING',
                size: 40
              },
              establishmentCause: 'mo-Data',
              spare: '0'
            }
          },
          expectedResponseTimeMs: 1000,
          maxResponseTimeMs: 5000,
          messageSizeBytes: 100,
          compressionEnabled: false,
          encryptionRequired: false,
          template: null
        },
        {
          id: 'msg_002',
          stepId: 'step_002',
          stepOrder: 2,
          timestampMs: 2000,
          direction: 'DL',
          layer: 'RRC',
          protocol: '5G_NR',
          messageType: 'RRCSetup',
          messageName: 'RRC Setup',
          messageDescription: 'gNB responds with RRC setup configuration',
          standardReference: 'TS 38.331 6.2.2',
          messageVariant: 'standard',
          messagePriority: 'normal',
          retryCount: 0,
          retryIntervalMs: 1000,
          successCriteria: 'Message received and processed',
          failureCriteria: 'Message reception failed',
          measurementCriteria: 'Standard measurement criteria',
          messageSequenceGroup: 'initial_access',
          parallelExecution: false,
          conditionalExecution: false,
          messagePayload: {
            rrcSetup: {
              rrc_TransactionIdentifier: 1,
              criticalExtensions: {
                rrcSetup: {
                  radioResourceConfigDedicated: {
                    srb_ToAddModList: [
                      {
                        srb_Identity: 1,
                        rlc_Config: {
                          am: {
                            ul_AM_RLC: {
                              t_PollRetransmit: 'ms45',
                              pollPDU: 'p64',
                              pollByte: 'kB500'
                            },
                            dl_AM_RLC: {
                              t_Reassembly: 'ms35',
                              t_StatusProhibit: 'ms0'
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          expectedResponseTimeMs: 1000,
          maxResponseTimeMs: 5000,
          messageSizeBytes: 150,
          compressionEnabled: false,
          encryptionRequired: false,
          template: null
        },
        {
          id: 'msg_003',
          stepId: 'step_003',
          stepOrder: 3,
          timestampMs: 3000,
          direction: 'UL',
          layer: 'NAS',
          protocol: '5G_NR',
          messageType: 'RegistrationRequest',
          messageName: 'Registration Request',
          messageDescription: 'UE performs NAS registration',
          standardReference: 'TS 24.501 8.2.6',
          messageVariant: 'standard',
          messagePriority: 'normal',
          retryCount: 0,
          retryIntervalMs: 1000,
          successCriteria: 'Registration request sent',
          failureCriteria: 'Registration request failed',
          measurementCriteria: 'Standard measurement criteria',
          messageSequenceGroup: 'initial_access',
          parallelExecution: false,
          conditionalExecution: false,
          messagePayload: {
            extendedProtocolDiscriminator: 126,
            securityHeaderType: 0,
            messageType: 65,
            '5gsRegistrationType': {
              for: 'initial-registration',
              ksi: 7
            },
            '5gsMobileIdentity': {
              suci: {
                supiFormat: 'imsi',
                mcc: '001',
                mnc: '01',
                routingIndicator: '0000',
                protectionScheme: 'null-scheme',
                msin: '0123456789'
              }
            }
          },
          expectedResponseTimeMs: 1000,
          maxResponseTimeMs: 5000,
          messageSizeBytes: 120,
          compressionEnabled: false,
          encryptionRequired: false,
          template: null
        }
      ],
      expectedInformationElements: [
        {
          id: 'ie_001',
          ieName: 'ue-Identity',
          ieType: 'CHOICE',
          ieValue: '0x12345678AB',
          ieValueHex: '12345678AB',
          ieValueBinary: '0001001000110100010101100111100010101011',
          ieSize: 40,
          mandatory: true,
          isValid: true,
          standardReference: 'TS 38.331 6.2.2',
          ieVariant: 'standard',
          iePriority: 'normal',
          ieCondition: 'always',
          ieValidationRules: {},
          ieMeasurementCriteria: 'Standard criteria',
          ieRelationship: 'standalone',
          ieDependencies: [],
          ieAlternatives: [],
          ieEncoding: 'binary',
          ieCompression: false,
          ieEncryption: false,
          library: {}
        },
        {
          id: 'ie_002',
          ieName: 'establishmentCause',
          ieType: 'ENUMERATED',
          ieValue: 'mo-Data',
          ieValueHex: '01',
          ieValueBinary: '00000001',
          ieSize: 8,
          mandatory: true,
          isValid: true,
          standardReference: 'TS 38.331 6.2.2',
          ieVariant: 'standard',
          iePriority: 'normal',
          ieCondition: 'always',
          ieValidationRules: {},
          ieMeasurementCriteria: 'Standard criteria',
          ieRelationship: 'standalone',
          ieDependencies: [],
          ieAlternatives: [],
          ieEncoding: 'binary',
          ieCompression: false,
          ieEncryption: false,
          library: {}
        },
        {
          id: 'ie_003',
          ieName: 'rrc-TransactionIdentifier',
          ieType: 'INTEGER',
          ieValue: 1,
          ieValueHex: '01',
          ieValueBinary: '00000001',
          ieSize: 8,
          mandatory: true,
          isValid: true,
          standardReference: 'TS 38.331 6.3.2',
          ieVariant: 'standard',
          iePriority: 'normal',
          ieCondition: 'always',
          ieValidationRules: {},
          ieMeasurementCriteria: 'Standard criteria',
          ieRelationship: 'standalone',
          ieDependencies: [],
          ieAlternatives: [],
          ieEncoding: 'binary',
          ieCompression: false,
          ieEncryption: false,
          library: {}
        },
        {
          id: 'ie_004',
          ieName: '5gsRegistrationType',
          ieType: 'SEQUENCE',
          ieValue: 'initial-registration',
          ieValueHex: '01',
          ieValueBinary: '00000001',
          ieSize: 8,
          mandatory: true,
          isValid: true,
          standardReference: 'TS 24.501 9.11.3.7',
          ieVariant: 'standard',
          iePriority: 'normal',
          ieCondition: 'always',
          ieValidationRules: {},
          ieMeasurementCriteria: 'Standard criteria',
          ieRelationship: 'standalone',
          ieDependencies: [],
          ieAlternatives: [],
          ieEncoding: 'binary',
          ieCompression: false,
          ieEncryption: false,
          library: {}
        }
      ],
      expectedLayerParameters: [
        {
          id: 'param_001',
          layer: 'PHY',
          parameterName: 'SS-RSRP',
          parameterType: 'config',
          parameterValue: -85,
          parameterUnit: 'dBm',
          context: 'initial_access',
          source: 'measurement',
          standardReference: 'TS 38.215 5.1.1',
          parameterVariant: 'standard',
          parameterPriority: 'normal',
          parameterCondition: 'always',
          parameterValidationRules: {},
          parameterMeasurementCriteria: 'Standard criteria',
          parameterRelationship: 'standalone',
          parameterDependencies: [],
          parameterAlternatives: [],
          parameterAccuracy: 0.1,
          parameterPrecision: 0.01,
          parameterResolution: 1,
          parameterCalibration: 'factory',
          parameterMeasurementMethod: 'direct',
          library: {}
        },
        {
          id: 'param_002',
          layer: 'PHY',
          parameterName: 'SS-RSRQ',
          parameterType: 'config',
          parameterValue: -10,
          parameterUnit: 'dB',
          context: 'initial_access',
          source: 'measurement',
          standardReference: 'TS 38.215 5.1.2',
          parameterVariant: 'standard',
          parameterPriority: 'normal',
          parameterCondition: 'always',
          parameterValidationRules: {},
          parameterMeasurementCriteria: 'Standard criteria',
          parameterRelationship: 'standalone',
          parameterDependencies: [],
          parameterAlternatives: [],
          parameterAccuracy: 0.1,
          parameterPrecision: 0.01,
          parameterResolution: 1,
          parameterCalibration: 'factory',
          parameterMeasurementMethod: 'direct',
          library: {}
        },
        {
          id: 'param_003',
          layer: 'RRC',
          parameterName: 'TransactionID',
          parameterType: 'config',
          parameterValue: 1,
          parameterUnit: 'none',
          context: 'initial_access',
          source: 'configuration',
          standardReference: 'TS 38.331 6.3.2',
          parameterVariant: 'standard',
          parameterPriority: 'normal',
          parameterCondition: 'always',
          parameterValidationRules: {},
          parameterMeasurementCriteria: 'Standard criteria',
          parameterRelationship: 'standalone',
          parameterDependencies: [],
          parameterAlternatives: [],
          parameterAccuracy: 0.1,
          parameterPrecision: 0.01,
          parameterResolution: 1,
          parameterCalibration: 'factory',
          parameterMeasurementMethod: 'direct',
          library: {}
        },
        {
          id: 'param_004',
          layer: 'NAS',
          parameterName: 'KeySetIdentifier',
          parameterType: 'config',
          parameterValue: 7,
          parameterUnit: 'none',
          context: 'initial_access',
          source: 'configuration',
          standardReference: 'TS 24.501 9.11.3.32',
          parameterVariant: 'standard',
          parameterPriority: 'normal',
          parameterCondition: 'always',
          parameterValidationRules: {},
          parameterMeasurementCriteria: 'Standard criteria',
          parameterRelationship: 'standalone',
          parameterDependencies: [],
          parameterAlternatives: [],
          parameterAccuracy: 0.1,
          parameterPrecision: 0.01,
          parameterResolution: 1,
          parameterCalibration: 'factory',
          parameterMeasurementMethod: 'direct',
          library: {}
        }
      ],
      actualExecution: null,
      actualMessages: [],
      complianceAnalysis: [],
      ieValidationResults: [],
      layerParameterAnalysis: [],
      messageTimingAnalysis: [],
      executionTemplates: [],
      simulation: {
        testCaseId: testCaseId,
        runId: null,
        totalExpectedMessages: 3,
        totalActualMessages: 0,
        layers: ['RRC', 'NAS'],
        protocols: ['5G_NR'],
        duration: 0,
        status: 'ready',
        complianceScore: 100
      }
    };

    console.log(`✅ Mock API: Generated comprehensive test case data:`);
    console.log(`   Test Case: ${mockTestData.testCase.name}`);
    console.log(`   Expected Messages: ${mockTestData.expectedMessages.length}`);
    console.log(`   Expected IEs: ${mockTestData.expectedInformationElements.length}`);
    console.log(`   Expected Layer Params: ${mockTestData.expectedLayerParameters.length}`);
    console.log(`   Layers: ${mockTestData.simulation.layers.join(', ')}`);
    console.log(`   Protocols: ${mockTestData.simulation.protocols.join(', ')}`);

    return NextResponse.json({
      success: true,
      data: mockTestData,
      message: 'Mock test case execution data generated successfully'
    });

  } catch (error) {
    console.error('❌ Error generating mock test case execution data:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}