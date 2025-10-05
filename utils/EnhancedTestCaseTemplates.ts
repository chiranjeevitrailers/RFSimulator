/**
 * Enhanced Test Case Templates with Complete Call Flows
 * Includes all IEs, layer parameters, and dynamic changes
 */

export interface EnhancedTestCaseTemplate {
  testCaseId: string;
  name: string;
  description: string;
  technology: string;
  category: string;
  subcategory: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  complexity: 'SIMPLE' | 'MODERATE' | 'COMPLEX' | 'VERY_COMPLEX';
  duration: number;
  expectedOutcome: string;
  successCriteria: string[];
  failureCriteria: string[];
  prerequisites: string[];
  
  // Complete End-to-End Call Flow
  callFlow: CallFlowMessage[];
  
  // Layer-wise Parameters with Dynamic Changes
  layerParameters: LayerParameterSet;
  
  // Test Steps with Detailed IEs
  testSteps: EnhancedTestStep[];
  
  // Assertions and Validation
  assertions: Assertion[];
  validationRules: ValidationRule[];
  
  // KPIs and Metrics
  kpis: KPI[];
  
  // Test Environment
  testEnvironment: TestEnvironment;
  testData: TestData;
}

export interface CallFlowMessage {
  messageId: string;
  stepNumber: number;
  messageName: string;
  direction: 'UE_TO_NETWORK' | 'NETWORK_TO_UE' | 'INTERNAL';
  layer: string;
  protocol: string;
  description: string;
  timestamp: number;
  duration: number;
  
  // Complete Information Elements
  informationElements: InformationElement[];
  
  // Layer Parameters at this step
  layerParameters: LayerParameterUpdate[];
  
  // Message Content (hex/decoded)
  messageContent: {
    hex: string;
    decoded: any;
    asn1: string;
  };
  
  // Expected Response
  expectedResponse?: CallFlowMessage;
  
  // Triggers and Conditions
  triggers: Trigger[];
  conditions: Condition[];
}

export interface InformationElement {
  ieId: string;
  name: string;
  type: string;
  value: any;
  description: string;
  mandatory: boolean;
  conditional?: string;
  standardReference: string;
  layer: string;
  protocol: string;
  encoding: 'BER' | 'PER' | 'XER' | 'JSON';
  size: number;
  criticality: 'REJECT' | 'IGNORE' | 'NOTIFY';
}

export interface LayerParameterUpdate {
  layer: string;
  parameterName: string;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercent: number;
  unit: string;
  timestamp: number;
  trend: 'INCREASING' | 'DECREASING' | 'STABLE' | 'FLUCTUATING';
  criticality: 'NORMAL' | 'WARNING' | 'CRITICAL' | 'ERROR';
  description: string;
}

export interface LayerParameterSet {
  PHY: LayerParameter[];
  MAC: LayerParameter[];
  RLC: LayerParameter[];
  PDCP: LayerParameter[];
  RRC: LayerParameter[];
  NAS: LayerParameter[];
  S1AP?: LayerParameter[];
  NGAP?: LayerParameter[];
  GTP?: LayerParameter[];
}

export interface LayerParameter {
  parameterName: string;
  description: string;
  unit: string;
  currentValue: number;
  baseValue: number;
  minValue: number;
  maxValue: number;
  typicalValue: number;
  variation: number;
  updateInterval: number; // ms
  criticalThresholds: {
    warning: number;
    error: number;
    critical: number;
  };
  measurementMethod: string;
  standardReference: string;
  dynamicChanges: ParameterChange[];
}

export interface ParameterChange {
  timestamp: number;
  value: number;
  change: number;
  changePercent: number;
  trend: 'INCREASING' | 'DECREASING' | 'STABLE' | 'FLUCTUATING';
  trigger: string;
  description: string;
}

export interface EnhancedTestStep {
  stepNumber: number;
  name: string;
  description: string;
  layer: string;
  protocol: string;
  expectedDuration: number;
  
  // Inputs and Outputs
  inputs: TestStepInput[];
  outputs: TestStepOutput[];
  
  // Triggers and Conditions
  triggers: Trigger[];
  conditions: Condition[];
  
  // Validations
  validations: Validation[];
  
  // Layer Parameter Updates
  layerParameterUpdates: LayerParameterUpdate[];
  
  // Information Elements
  informationElements: InformationElement[];
}

export interface TestStepInput {
  name: string;
  type: string;
  value: any;
  description: string;
  mandatory: boolean;
  source: string;
}

export interface TestStepOutput {
  name: string;
  type: string;
  value: any;
  description: string;
  expected: boolean;
  destination: string;
}

export interface Trigger {
  type: 'TIMER' | 'EVENT' | 'CONDITION' | 'MESSAGE' | 'PARAMETER';
  name: string;
  value?: any;
  condition?: string;
  timeout?: number;
  description: string;
}

export interface Condition {
  name: string;
  expression: string;
  expectedResult: boolean;
  description: string;
  criticality: 'REJECT' | 'IGNORE' | 'NOTIFY';
}

export interface Validation {
  parameter: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'nin' | 'exists' | 'regex';
  expectedValue: any;
  tolerance?: number;
  description: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  layer: string;
}

export interface Assertion {
  id: string;
  parameter: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'nin' | 'exists' | 'regex';
  expectedValue: any;
  tolerance?: number;
  description: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  layer: string;
  standardReference: string;
}

export interface ValidationRule {
  ruleId: string;
  name: string;
  description: string;
  layer: string;
  parameter: string;
  condition: string;
  expectedResult: any;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  standardReference: string;
}

export interface KPI {
  name: string;
  description: string;
  unit: string;
  targetValue: number;
  threshold: { min: number; max: number };
  measurementMethod: string;
  layer: string;
  calculationMethod: string;
  updateInterval: number;
}

export interface TestEnvironment {
  name: string;
  description: string;
  networkTopology: string;
  equipment: string[];
  configuration: any;
  constraints: string[];
  networkElements: NetworkElement[];
}

export interface NetworkElement {
  name: string;
  type: string;
  role: string;
  configuration: any;
  capabilities: string[];
  interfaces: string[];
}

export interface TestData {
  ueProfiles: UEProfile[];
  cellConfigurations: CellConfiguration[];
  networkConfigurations: NetworkConfiguration[];
  testScenarios: TestScenario[];
}

export interface UEProfile {
  id: string;
  imsi: string;
  imei: string;
  capabilities: DeviceCapabilities;
  securitySupport: SecuritySupport;
  mobilitySupport: MobilitySupport;
  serviceSupport: ServiceSupport;
}

export interface DeviceCapabilities {
  bandwidthClass: string;
  caSupport: boolean;
  mimoSupport: string;
  features: string[];
  maxThroughput: ThroughputCapability;
  powerClass: string;
  frequencyBands: string[];
}

export interface ThroughputCapability {
  downlink: number;
  uplink: number;
  unit: string;
}

export interface SecuritySupport {
  EEA: string[];
  EIA: string[];
  EEAStar?: string[];
  EIAStar?: string[];
}

export interface MobilitySupport {
  handoverTypes: string[];
  measurementCapabilities: string[];
  mobilityState: string;
}

export interface ServiceSupport {
  voiceSupport: boolean;
  dataSupport: boolean;
  smsSupport: boolean;
  emergencySupport: boolean;
  services: string[];
}

export interface CellConfiguration {
  cellId: string;
  pci?: number;
  nci?: string;
  earfcn?: number;
  nrarfcn?: number;
  bandwidth: number;
  tac: number;
  mcc: string;
  mnc: string;
  frequencyBand: string;
  duplexMode: string;
  powerConfig: PowerConfiguration;
  antennaConfig: AntennaConfiguration;
}

export interface PowerConfiguration {
  maxPower: number;
  minPower: number;
  powerStep: number;
  powerControl: string;
}

export interface AntennaConfiguration {
  antennaCount: number;
  mimoMode: string;
  beamforming: boolean;
  antennaGain: number;
}

export interface NetworkConfiguration {
  networkType: string;
  coreNetwork: string;
  interfaces: string[];
  protocols: string[];
  services: string[];
}

export interface TestScenario {
  name: string;
  description: string;
  environment: string;
  prerequisites: string[];
  testSteps: string[];
  expectedOutcome: string;
  successCriteria: string[];
  failureCriteria: string[];
}

export class EnhancedTestCaseTemplateGenerator {
  private static instance: EnhancedTestCaseTemplateGenerator;
  private templates: Map<string, EnhancedTestCaseTemplate> = new Map();

  private constructor() {
    this.initializeTemplates();
  }

  public static getInstance(): EnhancedTestCaseTemplateGenerator {
    if (!EnhancedTestCaseTemplateGenerator.instance) {
      EnhancedTestCaseTemplateGenerator.instance = new EnhancedTestCaseTemplateGenerator();
    }
    return EnhancedTestCaseTemplateGenerator.instance;
  }

  private initializeTemplates(): void {
    // LTE Power-On with Complete Call Flow
    this.templates.set('LTE-001-ENHANCED', this.createLTEPowerOnEnhanced());
    // 5G SA Registration with Complete Call Flow
    this.templates.set('SA-451-ENHANCED', this.create5GSARegistrationEnhanced());
    // Performance Test with Dynamic Parameters
    this.templates.set('PERF-651-ENHANCED', this.createPerformanceTestEnhanced());
  }

  private createLTEPowerOnEnhanced(): EnhancedTestCaseTemplate {
    return {
      testCaseId: 'LTE-001-ENHANCED',
      name: 'LTE Power-On Enhanced',
      description: 'Complete LTE UE power-on with full call flow, all IEs, and dynamic layer parameters',
      technology: 'LTE',
      category: 'POWER_ON',
      subcategory: 'ENHANCED',
      priority: 'CRITICAL',
      complexity: 'COMPLEX',
      duration: 30,
      expectedOutcome: 'UE successfully powers on and attaches to network',
      successCriteria: ['Cell sync success', 'RACH success', 'RRC setup success', 'NAS attach success'],
      failureCriteria: ['Cell sync failure', 'RACH failure', 'RRC setup failure', 'NAS attach failure'],
      prerequisites: ['UE powered off', 'LTE network available', 'Valid SIM card'],
      
      // Complete End-to-End Call Flow
      callFlow: [
        {
          messageId: 'LTE-001-MSG-001',
          stepNumber: 1,
          messageName: 'Cell Search & Sync',
          direction: 'UE_TO_NETWORK',
          layer: 'PHY',
          protocol: 'PHY',
          description: 'UE performs cell search and synchronization',
          timestamp: 0,
          duration: 3000,
          informationElements: [
            {
              ieId: 'PSS-INDEX',
              name: 'PSS Index',
              type: 'INTEGER',
              value: 0,
              description: 'Primary Synchronization Signal Index',
              mandatory: true,
              standardReference: '3GPP TS 36.211',
              layer: 'PHY',
              protocol: 'PHY',
              encoding: 'BER',
              size: 2,
              criticality: 'REJECT'
            },
            {
              ieId: 'SSS-INDEX',
              name: 'SSS Index',
              type: 'INTEGER',
              value: 0,
              description: 'Secondary Synchronization Signal Index',
              mandatory: true,
              standardReference: '3GPP TS 36.211',
              layer: 'PHY',
              protocol: 'PHY',
              encoding: 'BER',
              size: 2,
              criticality: 'REJECT'
            },
            {
              ieId: 'PCI',
              name: 'Physical Cell ID',
              type: 'INTEGER',
              value: 123,
              description: 'Physical Cell Identifier',
              mandatory: true,
              standardReference: '3GPP TS 36.211',
              layer: 'PHY',
              protocol: 'PHY',
              encoding: 'BER',
              size: 9,
              criticality: 'REJECT'
            }
          ],
          layerParameters: [
            {
              layer: 'PHY',
              parameterName: 'rsrp',
              currentValue: -95.2,
              previousValue: -100.0,
              change: 4.8,
              changePercent: 5.0,
              unit: 'dBm',
              timestamp: 0,
              trend: 'INCREASING',
              criticality: 'NORMAL',
              description: 'Reference Signal Received Power'
            },
            {
              layer: 'PHY',
              parameterName: 'rsrq',
              currentValue: -10.5,
              previousValue: -12.0,
              change: 1.5,
              changePercent: 12.5,
              unit: 'dB',
              timestamp: 0,
              trend: 'INCREASING',
              criticality: 'NORMAL',
              description: 'Reference Signal Received Quality'
            }
          ],
          messageContent: {
            hex: '0x1A2B3C4D',
            decoded: { pss: 0, sss: 0, pci: 123 },
            asn1: 'PSS-Index ::= 0, SSS-Index ::= 0, PCI ::= 123'
          },
          triggers: [
            {
              type: 'TIMER',
              name: 'Cell Search Timer',
              timeout: 5000,
              description: 'Maximum time for cell search'
            }
          ],
          conditions: [
            {
              name: 'RSRP Threshold',
              expression: 'rsrp > -110',
              expectedResult: true,
              description: 'RSRP must be above -110 dBm',
              criticality: 'REJECT'
            }
          ]
        },
        {
          messageId: 'LTE-001-MSG-002',
          stepNumber: 2,
          messageName: 'MIB Decode',
          direction: 'NETWORK_TO_UE',
          layer: 'PHY',
          protocol: 'PHY',
          description: 'UE decodes Master Information Block',
          timestamp: 3000,
          duration: 1000,
          informationElements: [
            {
              ieId: 'DL-BANDWIDTH',
              name: 'DL Bandwidth',
              type: 'ENUMERATED',
              value: 'n100',
              description: 'Downlink bandwidth configuration',
              mandatory: true,
              standardReference: '3GPP TS 36.211',
              layer: 'PHY',
              protocol: 'PHY',
              encoding: 'BER',
              size: 3,
              criticality: 'REJECT'
            },
            {
              ieId: 'PHICH-CONFIG',
              name: 'PHICH Configuration',
              type: 'SEQUENCE',
              value: { duration: 'NORMAL', resource: 'ONE_SIXTH' },
              description: 'PHICH configuration parameters',
              mandatory: true,
              standardReference: '3GPP TS 36.211',
              layer: 'PHY',
              protocol: 'PHY',
              encoding: 'BER',
              size: 8,
              criticality: 'REJECT'
            }
          ],
          layerParameters: [
            {
              layer: 'PHY',
              parameterName: 'sinr',
              currentValue: 15.3,
              previousValue: 12.0,
              change: 3.3,
              changePercent: 27.5,
              unit: 'dB',
              timestamp: 3000,
              trend: 'INCREASING',
              criticality: 'NORMAL',
              description: 'Signal to Interference plus Noise Ratio'
            }
          ],
          messageContent: {
            hex: '0x2B3C4D5E',
            decoded: { dlBandwidth: 'n100', phichConfig: { duration: 'NORMAL', resource: 'ONE_SIXTH' } },
            asn1: 'DL-Bandwidth ::= n100, PHICH-Config ::= { duration NORMAL, resource ONE_SIXTH }'
          }
        }
      ],
      
      // Layer-wise Parameters with Dynamic Changes
      layerParameters: {
        PHY: [
          {
            parameterName: 'rsrp',
            description: 'Reference Signal Received Power',
            unit: 'dBm',
            currentValue: -95.2,
            baseValue: -100.0,
            minValue: -140.0,
            maxValue: -44.0,
            typicalValue: -95.0,
            variation: 5.0,
            updateInterval: 1000,
            criticalThresholds: { warning: -100.0, error: -110.0, critical: -120.0 },
            measurementMethod: 'RSRP measurement',
            standardReference: '3GPP TS 36.101',
            dynamicChanges: [
              {
                timestamp: 0,
                value: -100.0,
                change: 0.0,
                changePercent: 0.0,
                trend: 'STABLE',
                trigger: 'Initial measurement',
                description: 'Initial RSRP measurement'
              },
              {
                timestamp: 1000,
                value: -98.5,
                change: 1.5,
                changePercent: 1.5,
                trend: 'INCREASING',
                trigger: 'Signal improvement',
                description: 'RSRP improving due to better positioning'
              }
            ]
          }
        ],
        MAC: [
          {
            parameterName: 'throughput',
            description: 'MAC layer throughput',
            unit: 'Mbps',
            currentValue: 0.0,
            baseValue: 0.0,
            minValue: 0.0,
            maxValue: 150.0,
            typicalValue: 50.0,
            variation: 10.0,
            updateInterval: 100,
            criticalThresholds: { warning: 10.0, error: 5.0, critical: 1.0 },
            measurementMethod: 'MAC throughput measurement',
            standardReference: '3GPP TS 36.321',
            dynamicChanges: []
          }
        ],
        RLC: [
          {
            parameterName: 'buffer_occupancy',
            description: 'RLC buffer occupancy',
            unit: 'bytes',
            currentValue: 0,
            baseValue: 0,
            minValue: 0,
            maxValue: 1000000,
            typicalValue: 10000,
            variation: 1000,
            updateInterval: 50,
            criticalThresholds: { warning: 800000, error: 900000, critical: 950000 },
            measurementMethod: 'RLC buffer measurement',
            standardReference: '3GPP TS 36.322',
            dynamicChanges: []
          }
        ],
        PDCP: [
          {
            parameterName: 'sequence_number',
            description: 'PDCP sequence number',
            unit: 'count',
            currentValue: 0,
            baseValue: 0,
            minValue: 0,
            maxValue: 4095,
            typicalValue: 0,
            variation: 1,
            updateInterval: 10,
            criticalThresholds: { warning: 4000, error: 4090, critical: 4095 },
            measurementMethod: 'PDCP sequence tracking',
            standardReference: '3GPP TS 36.323',
            dynamicChanges: []
          }
        ],
        RRC: [
          {
            parameterName: 'connection_state',
            description: 'RRC connection state',
            unit: 'state',
            currentValue: 0, // IDLE
            baseValue: 0,
            minValue: 0,
            maxValue: 2,
            typicalValue: 1,
            variation: 1,
            updateInterval: 1000,
            criticalThresholds: { warning: 0, error: 0, critical: 0 },
            measurementMethod: 'RRC state tracking',
            standardReference: '3GPP TS 36.331',
            dynamicChanges: []
          }
        ],
        NAS: [
          {
            parameterName: 'attach_state',
            description: 'NAS attach state',
            unit: 'state',
            currentValue: 0, // NOT_ATTACHED
            baseValue: 0,
            minValue: 0,
            maxValue: 3,
            typicalValue: 2,
            variation: 1,
            updateInterval: 5000,
            criticalThresholds: { warning: 0, error: 0, critical: 0 },
            measurementMethod: 'NAS state tracking',
            standardReference: '3GPP TS 24.301',
            dynamicChanges: []
          }
        ]
      },
      
      // Enhanced Test Steps
      testSteps: [
        {
          stepNumber: 1,
          name: 'Cell Search & Sync',
          description: 'UE performs cell search and synchronization',
          layer: 'PHY',
          protocol: 'PHY',
          expectedDuration: 3000,
          inputs: [
            {
              name: 'EARFCN',
              type: 'INTEGER',
              value: 1850,
              description: 'E-UTRA Absolute Radio Frequency Channel Number',
              mandatory: true,
              source: 'UE Configuration'
            }
          ],
          outputs: [
            {
              name: 'PCI',
              type: 'INTEGER',
              value: 123,
              description: 'Physical Cell ID',
              expected: true,
              destination: 'PHY Layer'
            }
          ],
          triggers: [
            {
              type: 'TIMER',
              name: 'Cell Search Timer',
              timeout: 5000,
              description: 'Maximum time for cell search'
            }
          ],
          conditions: [
            {
              name: 'RSRP Threshold',
              expression: 'rsrp > -110',
              expectedResult: true,
              description: 'RSRP must be above -110 dBm',
              criticality: 'REJECT'
            }
          ],
          validations: [
            {
              parameter: 'pss_detection_time',
              operator: 'lte',
              expectedValue: 1000,
              description: 'PSS detection within 1 second',
              severity: 'CRITICAL',
              layer: 'PHY'
            }
          ],
          layerParameterUpdates: [
            {
              layer: 'PHY',
              parameterName: 'rsrp',
              currentValue: -95.2,
              previousValue: -100.0,
              change: 4.8,
              changePercent: 5.0,
              unit: 'dBm',
              timestamp: 0,
              trend: 'INCREASING',
              criticality: 'NORMAL',
              description: 'Reference Signal Received Power'
            }
          ],
          informationElements: [
            {
              ieId: 'PSS-INDEX',
              name: 'PSS Index',
              type: 'INTEGER',
              value: 0,
              description: 'Primary Synchronization Signal Index',
              mandatory: true,
              standardReference: '3GPP TS 36.211',
              layer: 'PHY',
              protocol: 'PHY',
              encoding: 'BER',
              size: 2,
              criticality: 'REJECT'
            }
          ]
        }
      ],
      
      // Assertions and Validation
      assertions: [
        {
          id: 'LTE-001-ASSERT-001',
          parameter: 'pss_detection_time',
          operator: 'lte',
          expectedValue: 1000,
          description: 'PSS detection within 1 second',
          severity: 'CRITICAL',
          layer: 'PHY',
          standardReference: '3GPP TS 36.211'
        }
      ],
      
      validationRules: [
        {
          ruleId: 'LTE-001-RULE-001',
          name: 'PSS Detection Time',
          description: 'PSS must be detected within 1 second',
          layer: 'PHY',
          parameter: 'pss_detection_time',
          condition: 'pss_detection_time <= 1000',
          expectedResult: true,
          severity: 'CRITICAL',
          standardReference: '3GPP TS 36.211'
        }
      ],
      
      // KPIs
      kpis: [
        {
          name: 'sync_time',
          description: 'Cell synchronization time',
          unit: 'ms',
          targetValue: 1000,
          threshold: { min: 0, max: 5000 },
          measurementMethod: 'Timer measurement',
          layer: 'PHY',
          calculationMethod: 'Average',
          updateInterval: 1000
        }
      ],
      
      // Test Environment
      testEnvironment: {
        name: 'LTE Power-On Enhanced Environment',
        description: 'Enhanced LTE environment with complete call flow monitoring',
        networkTopology: 'Single eNodeB with EPC',
        equipment: ['eNodeB', 'MME', 'SGW', 'PGW', 'UE', 'Spectrum Analyzer'],
        configuration: { earfcn: 1850, bandwidth: 20, pci: 123 },
        constraints: ['Single cell', 'No interference', 'Complete call flow monitoring'],
        networkElements: [
          {
            name: 'eNodeB-001',
            type: 'eNodeB',
            role: 'Radio Access',
            configuration: { earfcn: 1850, bandwidth: 20, pci: 123 },
            capabilities: ['LTE', 'MIMO', 'CA'],
            interfaces: ['S1-MME', 'S1-U', 'X2']
          }
        ]
      },
      
      // Test Data
      testData: {
        ueProfiles: [
          {
            id: 'UE-001',
            imsi: '404123456789012',
            imei: '359123456789012',
            capabilities: {
              bandwidthClass: 'A',
              caSupport: true,
              mimoSupport: '2x2',
              features: ['VoLTE', 'VoWiFi'],
              maxThroughput: { downlink: 150, uplink: 50, unit: 'Mbps' },
              powerClass: '3',
              frequencyBands: ['Band 3', 'Band 7', 'Band 20']
            },
            securitySupport: {
              EEA: ['EEA0', 'EEA1', 'EEA2'],
              EIA: ['EIA0', 'EIA1', 'EIA2']
            },
            mobilitySupport: {
              handoverTypes: ['X2', 'S1'],
              measurementCapabilities: ['RSRP', 'RSRQ', 'SINR'],
              mobilityState: 'NORMAL'
            },
            serviceSupport: {
              voiceSupport: true,
              dataSupport: true,
              smsSupport: true,
              emergencySupport: true,
              services: ['VoLTE', 'VoWiFi', 'eMBB']
            }
          }
        ],
        cellConfigurations: [
          {
            cellId: 'CELL-001',
            pci: 123,
            earfcn: 1850,
            bandwidth: 20,
            tac: 12345,
            mcc: '404',
            mnc: '12',
            frequencyBand: 'Band 3',
            duplexMode: 'FDD',
            powerConfig: {
              maxPower: 46,
              minPower: -40,
              powerStep: 1,
              powerControl: 'CLOSED_LOOP'
            },
            antennaConfig: {
              antennaCount: 2,
              mimoMode: '2x2',
              beamforming: false,
              antennaGain: 15
            }
          }
        ],
        networkConfigurations: [
          {
            networkType: 'LTE',
            coreNetwork: 'EPC',
            interfaces: ['S1-MME', 'S1-U', 'X2'],
            protocols: ['LTE', 'S1AP', 'GTP'],
            services: ['VoLTE', 'Data', 'SMS']
          }
        ],
        testScenarios: [
          {
            name: 'LTE Power-On Enhanced',
            description: 'Complete LTE power-on with full call flow monitoring',
            environment: 'LTE Network with EPC',
            prerequisites: ['UE powered off', 'Network available', 'Valid SIM card'],
            testSteps: ['Power on UE', 'Cell search', 'Synchronization', 'RACH', 'RRC Setup', 'NAS Attach'],
            expectedOutcome: 'UE successfully attached to network',
            successCriteria: ['Attach accept received', 'Default bearer established', 'UE in RRC_CONNECTED state'],
            failureCriteria: ['Attach reject', 'Timeout', 'RRC connection failure']
          }
        ]
      }
    };
  }

  private create5GSARegistrationEnhanced(): EnhancedTestCaseTemplate {
    // Similar structure but for 5G SA registration
    return {
      testCaseId: 'SA-451-ENHANCED',
      name: '5G SA Registration Enhanced',
      description: 'Complete 5G SA registration with full call flow, all IEs, and dynamic layer parameters',
      technology: '5G_SA',
      category: 'REGISTRATION',
      subcategory: 'ENHANCED',
      priority: 'CRITICAL',
      complexity: 'COMPLEX',
      duration: 30,
      expectedOutcome: 'UE successfully registers to 5G SA network',
      successCriteria: ['NG-AP setup', 'NAS registration', 'AMF registration'],
      failureCriteria: ['Registration failure', 'NG-AP failure', 'NAS failure'],
      prerequisites: ['5G SA network available', 'gNodeB available', 'AMF available'],
      callFlow: [],
      layerParameters: {
        PHY: [],
        MAC: [],
        RLC: [],
        PDCP: [],
        RRC: [],
        NAS: []
      },
      testSteps: [],
      assertions: [],
      validationRules: [],
      kpis: [],
      testEnvironment: {
        name: '5G SA Enhanced Environment',
        description: 'Enhanced 5G SA environment with complete call flow monitoring',
        networkTopology: 'gNodeB + 5GC',
        equipment: ['gNodeB', 'AMF', 'SMF', 'UPF', 'UE'],
        configuration: { nrarfcn: 632448, bandwidth: 100 },
        constraints: ['5G SA only', 'No LTE dependency', 'Complete call flow monitoring'],
        networkElements: []
      },
      testData: {
        ueProfiles: [],
        cellConfigurations: [],
        networkConfigurations: [],
        testScenarios: []
      }
    };
  }

  private createPerformanceTestEnhanced(): EnhancedTestCaseTemplate {
    // Similar structure but for performance testing
    return {
      testCaseId: 'PERF-651-ENHANCED',
      name: 'Performance Test Enhanced',
      description: 'Complete performance test with dynamic parameter monitoring',
      technology: 'LTE_5G',
      category: 'PERFORMANCE',
      subcategory: 'ENHANCED',
      priority: 'HIGH',
      complexity: 'MODERATE',
      duration: 60,
      expectedOutcome: 'Achieve target performance metrics',
      successCriteria: ['Throughput > 100 Mbps', 'Latency < 10 ms', 'No packet loss'],
      failureCriteria: ['Low throughput', 'High latency', 'Packet loss'],
      prerequisites: ['Good RF conditions', 'Single UE', 'TCP server'],
      callFlow: [],
      layerParameters: {
        PHY: [],
        MAC: [],
        RLC: [],
        PDCP: [],
        RRC: [],
        NAS: []
      },
      testSteps: [],
      assertions: [],
      validationRules: [],
      kpis: [],
      testEnvironment: {
        name: 'Performance Test Enhanced Environment',
        description: 'Enhanced performance test environment',
        networkTopology: 'Single cell',
        equipment: ['eNodeB/gNodeB', 'UE', 'TCP Server'],
        configuration: { bandwidth: 20, mimo: '4x4' },
        constraints: ['Good RF conditions', 'No interference', 'Performance monitoring'],
        networkElements: []
      },
      testData: {
        ueProfiles: [],
        cellConfigurations: [],
        networkConfigurations: [],
        testScenarios: []
      }
    };
  }

  public getAvailableTemplates(): string[] {
    return Array.from(this.templates.keys());
  }

  public getTemplate(templateId: string): EnhancedTestCaseTemplate | null {
    return this.templates.get(templateId) || null;
  }

  public generateTestCase(templateId: string, customizations: Partial<EnhancedTestCaseTemplate> = {}): EnhancedTestCaseTemplate {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const testCase = JSON.parse(JSON.stringify(template));
    Object.assign(testCase, customizations);

    // Generate unique IDs
    testCase.testCaseId = this.generateTestCaseId(templateId);
    
    return testCase;
  }

  private generateTestCaseId(templateId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5);
    return `${templateId}-${timestamp}-${random}`;
  }
}

export const enhancedTestCaseTemplateGenerator = EnhancedTestCaseTemplateGenerator.getInstance();