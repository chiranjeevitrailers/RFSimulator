/**
 * 3GPP-Compliant Test Case Generator
 * Generates proper test cases with correct 3GPP message structures, IEs, and parameters
 */

import { ThreeGPPComplianceAnalyzer, ThreeGPPMessage } from './3gpp-compliance-analyzer';

export interface ThreeGPPTestCase {
  id: string;
  name: string;
  description: string;
  category: string;
  protocol: string;
  standardReference: string;
  releaseVersion: string;
  expectedMessages: ThreeGPPMessage[];
  expectedOutcome: string;
  testSteps: ThreeGPPTestStep[];
  complianceLevel: 'FULLY_COMPLIANT' | 'MOSTLY_COMPLIANT' | 'BASIC_COMPLIANT';
}

export interface ThreeGPPTestStep {
  stepId: string;
  stepOrder: number;
  timestampMs: number;
  direction: 'UL' | 'DL';
  layer: 'PHY' | 'MAC' | 'RLC' | 'PDCP' | 'RRC' | 'NAS';
  protocol: string;
  message: ThreeGPPMessage;
  expectedResponseTimeMs: number;
  maxResponseTimeMs: number;
  successCriteria: string[];
  failureCriteria: string[];
}

export class ThreeGPPTestCaseGenerator {

  /**
   * Generate 5G NR Initial Access Test Case (Fully 3GPP Compliant)
   */
  static generate5GNRInitialAccess(): ThreeGPPTestCase {
    const rrcSetupRequest = ThreeGPPComplianceAnalyzer.generateRRCSetupRequest();
    const rrcSetup = ThreeGPPComplianceAnalyzer.generateRRCSetup();
    const nasRegistration = ThreeGPPComplianceAnalyzer.generateNASRegistrationRequest();

    return {
      id: '3GPP_5G_NR_INITIAL_ACCESS_001',
      name: '5G NR Initial Access with RRC Setup',
      description: 'Complete 5G NR initial access procedure including PRACH, RRC Setup, and NAS Registration',
      category: '5G_NR',
      protocol: '5G_NR',
      standardReference: 'TS 38.300 4.2.2, TS 38.331 5.3.3, TS 24.501 5.5.1',
      releaseVersion: 'Release 17',
      complianceLevel: 'FULLY_COMPLIANT',
      expectedOutcome: 'UE successfully completes initial access and establishes RRC connection with proper 3GPP signaling',
      expectedMessages: [
        {
          messageType: 'PRACH_Preamble',
          messageName: 'PRACH Preamble',
          standardReference: 'TS 38.211 6.3.3.1',
          releaseVersion: 'Release 17',
          informationElements: {
            'preamble-Id': {
              type: 'INTEGER',
              value: 23,
              range: '0..63',
              presence: 'mandatory',
              reference: 'TS 38.211 6.3.3.1'
            },
            'prach-RootSequenceIndex': {
              type: 'INTEGER',
              value: 839,
              range: '0..837',
              presence: 'mandatory',
              reference: 'TS 38.211 6.3.3.1'
            }
          },
          layerParameters: ThreeGPPComplianceAnalyzer.generatePHYLayerParameters()
        },
        rrcSetupRequest,
        rrcSetup,
        nasRegistration
      ],
      testSteps: [
        {
          stepId: 'step_1_prach',
          stepOrder: 1,
          timestampMs: 0,
          direction: 'UL',
          layer: 'PHY',
          protocol: '5G_NR',
          message: {
            messageType: 'PRACH_Preamble',
            messageName: 'PRACH Preamble Transmission',
            standardReference: 'TS 38.211 6.3.3.1',
            releaseVersion: 'Release 17',
            informationElements: {
              'preamble-Id': {
                type: 'INTEGER',
                value: 23,
                range: '0..63',
                presence: 'mandatory',
                reference: 'TS 38.211 6.3.3.1',
                validation: {
                  valid: true,
                  errors: [],
                  warnings: []
                }
              },
              'prach-ConfigurationIndex': {
                type: 'INTEGER',
                value: 0,
                range: '0..255',
                presence: 'mandatory',
                reference: 'TS 38.211 6.3.3.2'
              },
              'prach-FrequencyStart': {
                type: 'INTEGER',
                value: 0,
                range: '0..274',
                presence: 'mandatory',
                reference: 'TS 38.211 6.3.3.2'
              }
            }
          },
          expectedResponseTimeMs: 5,
          maxResponseTimeMs: 10,
          successCriteria: [
            'PRACH preamble transmitted with correct power',
            'Preamble ID within valid range (0-63)',
            'PRACH configuration matches cell broadcast'
          ],
          failureCriteria: [
            'Invalid preamble ID',
            'Power exceeds maximum allowed',
            'PRACH configuration mismatch'
          ]
        },
        {
          stepId: 'step_2_rar',
          stepOrder: 2,
          timestampMs: 5,
          direction: 'DL',
          layer: 'PHY',
          protocol: '5G_NR',
          message: {
            messageType: 'RandomAccessResponse',
            messageName: 'Random Access Response',
            standardReference: 'TS 38.213 8.2',
            releaseVersion: 'Release 17',
            informationElements: {
              'ra-RNTI': {
                type: 'INTEGER',
                value: 1234,
                range: '1..65519',
                presence: 'mandatory',
                reference: 'TS 38.213 8.2'
              },
              'timingAdvance': {
                type: 'INTEGER',
                value: 500,
                range: '0..3846',
                presence: 'mandatory',
                reference: 'TS 38.213 8.2'
              },
              'ul-Grant': {
                type: 'SEQUENCE',
                value: {
                  'frequencyHopping': false,
                  'mcs': 0,
                  'tpc': 0,
                  'csi-Request': false
                },
                presence: 'mandatory',
                reference: 'TS 38.213 8.2'
              }
            }
          },
          expectedResponseTimeMs: 100,
          maxResponseTimeMs: 500,
          successCriteria: [
            'RAR received within response window',
            'RA-RNTI matches transmitted preamble',
            'Timing advance within valid range'
          ],
          failureCriteria: [
            'RAR not received within window',
            'Invalid RA-RNTI',
            'Timing advance out of range'
          ]
        },
        {
          stepId: 'step_3_rrc_setup_request',
          stepOrder: 3,
          timestampMs: 105,
          direction: 'UL',
          layer: 'RRC',
          protocol: '5G_NR',
          message: rrcSetupRequest,
          expectedResponseTimeMs: 50,
          maxResponseTimeMs: 200,
          successCriteria: [
            'RRC Setup Request with valid UE identity',
            'Establishment cause correctly set',
            'Message format compliant with TS 38.331'
          ],
          failureCriteria: [
            'Invalid UE identity format',
            'Missing mandatory IEs',
            'ASN.1 encoding errors'
          ]
        },
        {
          stepId: 'step_4_rrc_setup',
          stepOrder: 4,
          timestampMs: 155,
          direction: 'DL',
          layer: 'RRC',
          protocol: '5G_NR',
          message: rrcSetup,
          expectedResponseTimeMs: 100,
          maxResponseTimeMs: 500,
          successCriteria: [
            'RRC Setup with proper radio resource configuration',
            'SRB1 configuration present',
            'Transaction identifier matches request'
          ],
          failureCriteria: [
            'Missing radio resource configuration',
            'Invalid SRB configuration',
            'Transaction identifier mismatch'
          ]
        },
        {
          stepId: 'step_5_rrc_setup_complete',
          stepOrder: 5,
          timestampMs: 255,
          direction: 'UL',
          layer: 'RRC',
          protocol: '5G_NR',
          message: {
            messageType: 'RRCSetupComplete',
            messageName: 'RRC Setup Complete',
            standardReference: 'TS 38.331 6.2.2',
            releaseVersion: 'Release 17',
            informationElements: {
              'rrcSetupComplete': {
                type: 'SEQUENCE',
                value: {
                  'rrc-TransactionIdentifier': {
                    type: 'INTEGER',
                    value: 1,
                    range: '0..3',
                    presence: 'mandatory',
                    reference: 'TS 38.331 6.3.2'
                  },
                  'criticalExtensions': {
                    type: 'CHOICE',
                    value: {
                      'rrcSetupComplete': {
                        'selectedPLMN-Identity': {
                          type: 'INTEGER',
                          value: 1,
                          range: '1..12'
                        },
                        'dedicatedNAS-Message': {
                          type: 'OCTET STRING',
                          value: 'NAS_REGISTRATION_REQUEST_PAYLOAD'
                        }
                      }
                    },
                    presence: 'mandatory',
                    reference: 'TS 38.331 6.2.2'
                  }
                },
                presence: 'mandatory',
                reference: 'TS 38.331 6.2.2'
              }
            }
          },
          expectedResponseTimeMs: 50,
          maxResponseTimeMs: 200,
          successCriteria: [
            'RRC Setup Complete with NAS message',
            'Selected PLMN identity valid',
            'Transaction identifier matches setup'
          ],
          failureCriteria: [
            'Missing NAS message',
            'Invalid PLMN identity',
            'Transaction identifier mismatch'
          ]
        },
        {
          stepId: 'step_6_nas_registration',
          stepOrder: 6,
          timestampMs: 305,
          direction: 'UL',
          layer: 'NAS',
          protocol: '5G_NR',
          message: nasRegistration,
          expectedResponseTimeMs: 100,
          maxResponseTimeMs: 1000,
          successCriteria: [
            'NAS Registration Request with valid 5G-GUTI/SUCI',
            'Registration type correctly set',
            'Security header properly formatted'
          ],
          failureCriteria: [
            'Invalid mobile identity format',
            'Missing mandatory IEs',
            'Security header errors'
          ]
        }
      ]
    };
  }

  /**
   * Generate VoLTE Call Setup Test Case (Fully 3GPP Compliant)
   */
  static generateVoLTECallSetup(): ThreeGPPTestCase {
    return {
      id: '3GPP_VOLTE_CALL_SETUP_001',
      name: 'VoLTE Call Setup with IMS Signaling',
      description: 'Complete VoLTE call setup procedure with proper SIP/IMS signaling and QoS establishment',
      category: 'VoLTE',
      protocol: 'VoLTE',
      standardReference: 'TS 24.229 5.1.1, TS 23.228 5.2, RFC 3261',
      releaseVersion: 'Release 17',
      complianceLevel: 'FULLY_COMPLIANT',
      expectedOutcome: 'Successful VoLTE call establishment with proper IMS registration and QoS setup',
      expectedMessages: [
        {
          messageType: 'SIP_INVITE',
          messageName: 'SIP INVITE for VoLTE Call',
          standardReference: 'RFC 3261 Section 17.1.1, TS 24.229 5.1.1',
          releaseVersion: 'Release 17',
          informationElements: {
            'request-Line': {
              type: 'SEQUENCE',
              value: {
                'method': 'INVITE',
                'request-URI': 'sip:+1234567890@ims.operator.com'
              },
              presence: 'mandatory',
              reference: 'RFC 3261 Section 25'
            },
            'via': {
              type: 'SEQUENCE OF',
              value: [
                'SIP/2.0/UDP 192.168.1.100:5060;branch=z9hG4bK776asdhds'
              ],
              presence: 'mandatory',
              reference: 'RFC 3261 Section 20.42'
            },
            'from': {
              type: 'SEQUENCE',
              value: {
                'displayName': 'Alice User',
                'uri': 'sip:alice@ims.operator.com',
                'tag': 'from-tag-12345'
              },
              presence: 'mandatory',
              reference: 'RFC 3261 Section 20.20'
            },
            'to': {
              type: 'SEQUENCE',
              value: {
                'displayName': 'Bob User', 
                'uri': 'sip:+1234567890@ims.operator.com'
              },
              presence: 'mandatory',
              reference: 'RFC 3261 Section 20.39'
            },
            'call-ID': {
              type: 'OCTET STRING',
              value: 'call-id-12345@192.168.1.100',
              presence: 'mandatory',
              reference: 'RFC 3261 Section 20.8'
            },
            'cseq': {
              type: 'SEQUENCE',
              value: {
                'sequence': 1,
                'method': 'INVITE'
              },
              presence: 'mandatory',
              reference: 'RFC 3261 Section 20.16'
            },
            'contact': {
              type: 'SEQUENCE',
              value: {
                'uri': 'sip:alice@192.168.1.100:5060'
              },
              presence: 'mandatory',
              reference: 'RFC 3261 Section 20.10'
            },
            'content-Type': {
              type: 'OCTET STRING',
              value: 'application/sdp',
              presence: 'mandatory',
              reference: 'RFC 3261 Section 20.15'
            },
            'p-Access-Network-Info': {
              type: 'OCTET STRING',
              value: '3GPP-E-UTRAN-FDD;utran-cell-id-3gpp=234151234567890',
              presence: 'mandatory',
              reference: 'TS 24.229 7.2A.4'
            },
            'p-Charging-Vector': {
              type: 'SEQUENCE',
              value: {
                'icid': 'icid-value-12345',
                'orig-ioi': 'operator.com'
              },
              presence: 'mandatory',
              reference: 'TS 24.229 7.2.3'
            }
          }
        }
      ],
      testSteps: [
        {
          stepId: 'step_1_sip_invite',
          stepOrder: 1,
          timestampMs: 0,
          direction: 'UL',
          layer: 'NAS',
          protocol: 'VoLTE',
          message: {
            messageType: 'SIP_INVITE',
            messageName: 'SIP INVITE',
            standardReference: 'RFC 3261, TS 24.229',
            releaseVersion: 'Release 17',
            informationElements: {
              'method': {
                type: 'OCTET STRING',
                value: 'INVITE',
                presence: 'mandatory',
                reference: 'RFC 3261'
              }
            }
          },
          expectedResponseTimeMs: 100,
          maxResponseTimeMs: 2000,
          successCriteria: [
            'SIP INVITE with proper VoLTE headers',
            'SDP contains AMR-WB codec',
            'P-Access-Network-Info present'
          ],
          failureCriteria: [
            'Missing mandatory SIP headers',
            'Invalid SDP format',
            'Missing IMS-specific headers'
          ]
        }
      ]
    };
  }

  /**
   * Validate test case against 3GPP compliance
   */
  static validateTestCase(testCase: ThreeGPPTestCase): {
    isCompliant: boolean;
    complianceScore: number;
    errors: string[];
    warnings: string[];
    recommendations: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    let complianceScore = 100;

    // Check test case structure
    if (!testCase.standardReference) {
      errors.push('Missing standard reference');
      complianceScore -= 20;
    }

    if (!testCase.releaseVersion) {
      errors.push('Missing 3GPP release version');
      complianceScore -= 15;
    }

    // Check messages compliance
    for (const message of testCase.expectedMessages) {
      const messageValidation = ThreeGPPComplianceAnalyzer.validateMessageCompliance(message);
      if (!messageValidation.isCompliant) {
        errors.push(`Message ${message.messageName}: ${messageValidation.errors.join(', ')}`);
        complianceScore -= 10;
      }
      warnings.push(...messageValidation.warnings.map(w => `${message.messageName}: ${w}`));
    }

    // Recommendations for improvement
    if (testCase.complianceLevel !== 'FULLY_COMPLIANT') {
      recommendations.push('Consider upgrading to FULLY_COMPLIANT level');
    }

    if (testCase.testSteps.length < 3) {
      recommendations.push('Add more test steps for comprehensive coverage');
    }

    return {
      isCompliant: errors.length === 0 && complianceScore >= 80,
      complianceScore: Math.max(0, complianceScore),
      errors,
      warnings,
      recommendations
    };
  }
}