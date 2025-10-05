/**
 * LTE Cell Search Complete Templates
 * Includes all steps: RSSI scanning, PSS/SSS sync, PCI, DMRS, PBCH-MIB, PHICH, PCFICH, PDCCH, PDSCH-SIB1, PLMN match
 */

export interface LTECellSearchTemplate {
  testCaseId: string;
  name: string;
  description: string;
  technology: 'LTE';
  category: 'CELL_SEARCH';
  subcategory: 'COMPLETE';
  priority: 'CRITICAL';
  complexity: 'VERY_COMPLEX';
  duration: 60;
  
  // Complete Cell Search Call Flow
  cellSearchFlow: CellSearchStep[];
  
  // All Information Elements for each step
  informationElements: Map<string, InformationElement[]>;
  
  // Layer Parameters with Dynamic Changes
  layerParameters: LayerParameterSet;
  
  // Test Environment
  testEnvironment: TestEnvironment;
}

export interface CellSearchStep {
  stepId: string;
  stepNumber: number;
  stepName: string;
  description: string;
  layer: string;
  protocol: string;
  direction: 'UE_TO_NETWORK' | 'NETWORK_TO_UE' | 'INTERNAL';
  timestamp: number;
  duration: number;
  
  // Step-specific IEs
  informationElements: InformationElement[];
  
  // Layer Parameters at this step
  layerParameters: LayerParameterUpdate[];
  
  // Message Content
  messageContent: {
    hex: string;
    decoded: any;
    asn1: string;
  };
  
  // Success Criteria
  successCriteria: string[];
  failureCriteria: string[];
  
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
  bitPosition?: number;
  fieldLength?: number;
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
  measurementMethod: string;
}

export interface LayerParameterSet {
  PHY: LayerParameter[];
  MAC: LayerParameter[];
  RLC: LayerParameter[];
  PDCP: LayerParameter[];
  RRC: LayerParameter[];
  NAS: LayerParameter[];
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
  updateInterval: number;
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

export class LTECellSearchTemplateGenerator {
  private static instance: LTECellSearchTemplateGenerator;
  private templates: Map<string, LTECellSearchTemplate> = new Map();

  private constructor() {
    this.initializeTemplates();
  }

  public static getInstance(): LTECellSearchTemplateGenerator {
    if (!LTECellSearchTemplateGenerator.instance) {
      LTECellSearchTemplateGenerator.instance = new LTECellSearchTemplateGenerator();
    }
    return LTECellSearchTemplateGenerator.instance;
  }

  private initializeTemplates(): void {
    this.templates.set('LTE-001-COMPLETE', this.createLTE001CompleteCellSearch());
  }

  private createLTE001CompleteCellSearch(): LTECellSearchTemplate {
    return {
      testCaseId: 'LTE-001-COMPLETE',
      name: 'LTE Cell Search & Sync Complete',
      description: 'Complete LTE cell search procedure: RSSI scanning, PSS/SSS sync, PCI, DMRS, PBCH-MIB, PHICH, PCFICH, PDCCH, PDSCH-SIB1, PLMN match',
      technology: 'LTE',
      category: 'CELL_SEARCH',
      subcategory: 'COMPLETE',
      priority: 'CRITICAL',
      complexity: 'VERY_COMPLEX',
      duration: 60,
      
      // Complete Cell Search Call Flow
      cellSearchFlow: [
        // Step 1: RSSI Scanning Multiple Cells
        {
          stepId: 'LTE-001-STEP-001',
          stepNumber: 1,
          stepName: 'RSSI Scanning Multiple Cells',
          description: 'UE performs RSSI scanning across multiple cells to identify potential candidates',
          layer: 'PHY',
          protocol: 'PHY',
          direction: 'UE_TO_NETWORK',
          timestamp: 0,
          duration: 5000,
          informationElements: [
            {
              ieId: 'RSSI-SCAN-RESULT',
              name: 'RSSI Scan Result',
              type: 'SEQUENCE',
              value: [
                { earfcn: 1850, rssi: -85.2, cellId: 'CELL-001' },
                { earfcn: 1850, rssi: -92.1, cellId: 'CELL-002' },
                { earfcn: 1850, rssi: -88.7, cellId: 'CELL-003' }
              ],
              description: 'RSSI scan results for multiple cells',
              mandatory: true,
              standardReference: '3GPP TS 36.101',
              layer: 'PHY',
              protocol: 'PHY',
              encoding: 'BER',
              size: 24,
              criticality: 'REJECT'
            },
            {
              ieId: 'SCANNED-EARFCN',
              name: 'Scanned EARFCN',
              type: 'INTEGER',
              value: 1850,
              description: 'E-UTRA Absolute Radio Frequency Channel Number',
              mandatory: true,
              standardReference: '3GPP TS 36.101',
              layer: 'PHY',
              protocol: 'PHY',
              encoding: 'BER',
              size: 16,
              criticality: 'REJECT'
            },
            {
              ieId: 'SCAN-DURATION',
              name: 'Scan Duration',
              type: 'INTEGER',
              value: 5000,
              description: 'Duration of RSSI scan in milliseconds',
              mandatory: true,
              standardReference: '3GPP TS 36.101',
              layer: 'PHY',
              protocol: 'PHY',
              encoding: 'BER',
              size: 16,
              criticality: 'REJECT'
            }
          ],
          layerParameters: [
            {
              layer: 'PHY',
              parameterName: 'rssi',
              currentValue: -85.2,
              previousValue: -100.0,
              change: 14.8,
              changePercent: 14.8,
              unit: 'dBm',
              timestamp: 0,
              trend: 'INCREASING',
              criticality: 'NORMAL',
              description: 'Received Signal Strength Indicator',
              measurementMethod: 'RSSI measurement'
            },
            {
              layer: 'PHY',
              parameterName: 'scan_progress',
              currentValue: 100.0,
              previousValue: 0.0,
              change: 100.0,
              changePercent: 100.0,
              unit: '%',
              timestamp: 0,
              trend: 'INCREASING',
              criticality: 'NORMAL',
              description: 'RSSI scan progress percentage',
              measurementMethod: 'Progress tracking'
            }
          ],
          messageContent: {
            hex: '0x1A2B3C4D5E6F',
            decoded: { 
              scanResults: [
                { earfcn: 1850, rssi: -85.2, cellId: 'CELL-001' },
                { earfcn: 1850, rssi: -92.1, cellId: 'CELL-002' },
                { earfcn: 1850, rssi: -88.7, cellId: 'CELL-003' }
              ],
              scanDuration: 5000
            },
            asn1: 'RSSI-Scan-Result ::= SEQUENCE { earfcn INTEGER, rssi INTEGER, cellId OCTET STRING }'
          },
          successCriteria: ['RSSI scan completed', 'Multiple cells detected', 'Best cell identified'],
          failureCriteria: ['RSSI scan timeout', 'No cells detected', 'Scan failure'],
          triggers: [
            {
              type: 'TIMER',
              name: 'RSSI Scan Timer',
              timeout: 10000,
              description: 'Maximum time for RSSI scanning'
            }
          ],
          conditions: [
            {
              name: 'RSSI Threshold',
              expression: 'rssi > -100',
              expectedResult: true,
              description: 'RSSI must be above -100 dBm',
              criticality: 'REJECT'
            }
          ]
        },
        
        // Step 2: PSS Detection and Sync
        {
          stepId: 'LTE-001-STEP-002',
          stepNumber: 2,
          stepName: 'PSS Detection and Sync',
          description: 'UE detects Primary Synchronization Signal and achieves time synchronization',
          layer: 'PHY',
          protocol: 'PHY',
          direction: 'UE_TO_NETWORK',
          timestamp: 5000,
          duration: 2000,
          informationElements: [
            {
              ieId: 'PSS-INDEX',
              name: 'PSS Index',
              type: 'INTEGER',
              value: 0,
              description: 'Primary Synchronization Signal Index (0-2)',
              mandatory: true,
              standardReference: '3GPP TS 36.211',
              layer: 'PHY',
              protocol: 'PHY',
              encoding: 'BER',
              size: 2,
              criticality: 'REJECT',
              bitPosition: 0,
              fieldLength: 2
            },
            {
              ieId: 'PSS-CORRELATION',
              name: 'PSS Correlation',
              type: 'REAL',
              value: 0.95,
              description: 'PSS correlation peak value',
              mandatory: true,
              standardReference: '3GPP TS 36.211',
              layer: 'PHY',
              protocol: 'PHY',
              encoding: 'BER',
              size: 16,
              criticality: 'REJECT'
            },
            {
              ieId: 'PSS-TIMING',
              name: 'PSS Timing',
              type: 'INTEGER',
              value: 1234,
              description: 'PSS timing offset in samples',
              mandatory: true,
              standardReference: '3GPP TS 36.211',
              layer: 'PHY',
              protocol: 'PHY',
              encoding: 'BER',
              size: 16,
              criticality: 'REJECT'
            }
          ],
          layerParameters: [
            {
              layer: 'PHY',
              parameterName: 'pss_correlation',
              currentValue: 0.95,
              previousValue: 0.0,
              change: 0.95,
              changePercent: 95.0,
              unit: 'ratio',
              timestamp: 5000,
              trend: 'INCREASING',
              criticality: 'NORMAL',
              description: 'PSS correlation peak value',
              measurementMethod: 'Correlation analysis'
            },
            {
              layer: 'PHY',
              parameterName: 'timing_offset',
              currentValue: 1234,
              previousValue: 0,
              change: 1234,
              changePercent: 100.0,
              unit: 'samples',
              timestamp: 5000,
              trend: 'STABLE',
              criticality: 'NORMAL',
              description: 'Timing offset from PSS detection',
              measurementMethod: 'Timing measurement'
            }
          ],
          messageContent: {
            hex: '0x2B3C4D5E',
            decoded: { pssIndex: 0, correlation: 0.95, timing: 1234 },
            asn1: 'PSS-Index ::= 0, PSS-Correlation ::= 0.95, PSS-Timing ::= 1234'
          },
          successCriteria: ['PSS detected', 'Timing sync achieved', 'Correlation > 0.8'],
          failureCriteria: ['PSS detection failed', 'Timing sync failed', 'Low correlation'],
          triggers: [
            {
              type: 'TIMER',
              name: 'PSS Detection Timer',
              timeout: 5000,
              description: 'Maximum time for PSS detection'
            }
          ],
          conditions: [
            {
              name: 'PSS Correlation Threshold',
              expression: 'pss_correlation > 0.8',
              expectedResult: true,
              description: 'PSS correlation must be above 0.8',
              criticality: 'REJECT'
            }
          ]
        },
        
        // Step 3: SSS Detection and PCI Calculation
        {
          stepId: 'LTE-001-STEP-003',
          stepNumber: 3,
          stepName: 'SSS Detection and PCI Calculation',
          description: 'UE detects Secondary Synchronization Signal and calculates Physical Cell ID',
          layer: 'PHY',
          protocol: 'PHY',
          direction: 'UE_TO_NETWORK',
          timestamp: 7000,
          duration: 1500,
          informationElements: [
            {
              ieId: 'SSS-INDEX',
              name: 'SSS Index',
              type: 'INTEGER',
              value: 0,
              description: 'Secondary Synchronization Signal Index (0-167)',
              mandatory: true,
              standardReference: '3GPP TS 36.211',
              layer: 'PHY',
              protocol: 'PHY',
              encoding: 'BER',
              size: 8,
              criticality: 'REJECT'
            },
            {
              ieId: 'PCI',
              name: 'Physical Cell ID',
              type: 'INTEGER',
              value: 123,
              description: 'Physical Cell Identifier (0-503)',
              mandatory: true,
              standardReference: '3GPP TS 36.211',
              layer: 'PHY',
              protocol: 'PHY',
              encoding: 'BER',
              size: 9,
              criticality: 'REJECT'
            },
            {
              ieId: 'SSS-CORRELATION',
              name: 'SSS Correlation',
              type: 'REAL',
              value: 0.92,
              description: 'SSS correlation peak value',
              mandatory: true,
              standardReference: '3GPP TS 36.211',
              layer: 'PHY',
              protocol: 'PHY',
              encoding: 'BER',
              size: 16,
              criticality: 'REJECT'
            }
          ],
          layerParameters: [
            {
              layer: 'PHY',
              parameterName: 'sss_correlation',
              currentValue: 0.92,
              previousValue: 0.0,
              change: 0.92,
              changePercent: 92.0,
              unit: 'ratio',
              timestamp: 7000,
              trend: 'INCREASING',
              criticality: 'NORMAL',
              description: 'SSS correlation peak value',
              measurementMethod: 'Correlation analysis'
            },
            {
              layer: 'PHY',
              parameterName: 'pci',
              currentValue: 123,
              previousValue: 0,
              change: 123,
              changePercent: 100.0,
              unit: 'id',
              timestamp: 7000,
              trend: 'STABLE',
              criticality: 'NORMAL',
              description: 'Physical Cell ID',
              measurementMethod: 'PCI calculation'
            }
          ],
          messageContent: {
            hex: '0x3C4D5E6F',
            decoded: { sssIndex: 0, pci: 123, correlation: 0.92 },
            asn1: 'SSS-Index ::= 0, PCI ::= 123, SSS-Correlation ::= 0.92'
          },
          successCriteria: ['SSS detected', 'PCI calculated', 'Correlation > 0.8'],
          failureCriteria: ['SSS detection failed', 'PCI calculation failed', 'Low correlation'],
          triggers: [
            {
              type: 'TIMER',
              name: 'SSS Detection Timer',
              timeout: 3000,
              description: 'Maximum time for SSS detection'
            }
          ],
          conditions: [
            {
              name: 'SSS Correlation Threshold',
              expression: 'sss_correlation > 0.8',
              expectedResult: true,
              description: 'SSS correlation must be above 0.8',
              criticality: 'REJECT'
            }
          ]
        },
        
        // Step 4: DMRS Detection
        {
          stepId: 'LTE-001-STEP-004',
          stepNumber: 4,
          stepName: 'DMRS Detection',
          description: 'UE detects Demodulation Reference Signal for channel estimation',
          layer: 'PHY',
          protocol: 'PHY',
          direction: 'NETWORK_TO_UE',
          timestamp: 8500,
          duration: 1000,
          informationElements: [
            {
              ieId: 'DMRS-SEQUENCE',
              name: 'DMRS Sequence',
              type: 'BIT_STRING',
              value: '1101010101010101',
              description: 'DMRS sequence bits',
              mandatory: true,
              standardReference: '3GPP TS 36.211',
              layer: 'PHY',
              protocol: 'PHY',
              encoding: 'BER',
              size: 16,
              criticality: 'REJECT'
            },
            {
              ieId: 'DMRS-POWER',
              name: 'DMRS Power',
              type: 'REAL',
              value: -85.5,
              description: 'DMRS received power in dBm',
              mandatory: true,
              standardReference: '3GPP TS 36.211',
              layer: 'PHY',
              protocol: 'PHY',
              encoding: 'BER',
              size: 16,
              criticality: 'REJECT'
            },
            {
              ieId: 'DMRS-SNR',
              name: 'DMRS SNR',
              type: 'REAL',
              value: 15.2,
              description: 'DMRS Signal to Noise Ratio in dB',
              mandatory: true,
              standardReference: '3GPP TS 36.211',
              layer: 'PHY',
              protocol: 'PHY',
              encoding: 'BER',
              size: 16,
              criticality: 'REJECT'
            }
          ],
          layerParameters: [
            {
              layer: 'PHY',
              parameterName: 'dmrs_power',
              currentValue: -85.5,
              previousValue: -90.0,
              change: 4.5,
              changePercent: 5.0,
              unit: 'dBm',
              timestamp: 8500,
              trend: 'INCREASING',
              criticality: 'NORMAL',
              description: 'DMRS received power',
              measurementMethod: 'Power measurement'
            },
            {
              layer: 'PHY',
              parameterName: 'dmrs_snr',
              currentValue: 15.2,
              previousValue: 12.0,
              change: 3.2,
              changePercent: 26.7,
              unit: 'dB',
              timestamp: 8500,
              trend: 'INCREASING',
              criticality: 'NORMAL',
              description: 'DMRS Signal to Noise Ratio',
              measurementMethod: 'SNR measurement'
            }
          ],
          messageContent: {
            hex: '0x4D5E6F70',
            decoded: { dmrsSequence: '1101010101010101', power: -85.5, snr: 15.2 },
            asn1: 'DMRS-Sequence ::= BIT STRING, DMRS-Power ::= -85.5, DMRS-SNR ::= 15.2'
          },
          successCriteria: ['DMRS detected', 'Channel estimation successful', 'SNR > 10 dB'],
          failureCriteria: ['DMRS detection failed', 'Channel estimation failed', 'Low SNR'],
          triggers: [
            {
              type: 'TIMER',
              name: 'DMRS Detection Timer',
              timeout: 2000,
              description: 'Maximum time for DMRS detection'
            }
          ],
          conditions: [
            {
              name: 'DMRS SNR Threshold',
              expression: 'dmrs_snr > 10',
              expectedResult: true,
              description: 'DMRS SNR must be above 10 dB',
              criticality: 'REJECT'
            }
          ]
        },
        
        // Step 5: PBCH-MIB Decode
        {
          stepId: 'LTE-001-STEP-005',
          stepNumber: 5,
          stepName: 'PBCH-MIB Decode',
          description: 'UE decodes Physical Broadcast Channel to obtain Master Information Block',
          layer: 'PHY',
          protocol: 'PHY',
          direction: 'NETWORK_TO_UE',
          timestamp: 9500,
          duration: 2000,
          informationElements: [
            {
              ieId: 'DL-BANDWIDTH',
              name: 'DL Bandwidth',
              type: 'ENUMERATED',
              value: 'n100',
              description: 'Downlink bandwidth configuration (n6, n15, n25, n50, n75, n100)',
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
            },
            {
              ieId: 'SYSTEM-FRAME-NUMBER',
              name: 'System Frame Number',
              type: 'INTEGER',
              value: 1234,
              description: 'System Frame Number (0-1023)',
              mandatory: true,
              standardReference: '3GPP TS 36.211',
              layer: 'PHY',
              protocol: 'PHY',
              encoding: 'BER',
              size: 10,
              criticality: 'REJECT'
            }
          ],
          layerParameters: [
            {
              layer: 'PHY',
              parameterName: 'mib_decode_success',
              currentValue: 1,
              previousValue: 0,
              change: 1,
              changePercent: 100.0,
              unit: 'boolean',
              timestamp: 9500,
              trend: 'STABLE',
              criticality: 'NORMAL',
              description: 'MIB decode success flag',
              measurementMethod: 'Decode verification'
            },
            {
              layer: 'PHY',
              parameterName: 'dl_bandwidth',
              currentValue: 100,
              previousValue: 0,
              change: 100,
              changePercent: 100.0,
              unit: 'MHz',
              timestamp: 9500,
              trend: 'STABLE',
              criticality: 'NORMAL',
              description: 'Downlink bandwidth',
              measurementMethod: 'MIB decode'
            }
          ],
          messageContent: {
            hex: '0x5E6F7081',
            decoded: { 
              dlBandwidth: 'n100', 
              phichConfig: { duration: 'NORMAL', resource: 'ONE_SIXTH' },
              sfn: 1234
            },
            asn1: 'DL-Bandwidth ::= n100, PHICH-Config ::= { duration NORMAL, resource ONE_SIXTH }, SFN ::= 1234'
          },
          successCriteria: ['MIB decoded successfully', 'Bandwidth identified', 'SFN obtained'],
          failureCriteria: ['MIB decode failed', 'Invalid bandwidth', 'SFN error'],
          triggers: [
            {
              type: 'TIMER',
              name: 'MIB Decode Timer',
              timeout: 5000,
              description: 'Maximum time for MIB decode'
            }
          ],
          conditions: [
            {
              name: 'MIB Decode Success',
              expression: 'mib_decode_success == 1',
              expectedResult: true,
              description: 'MIB must be decoded successfully',
              criticality: 'REJECT'
            }
          ]
        }
      ],
      
      // Information Elements Map
      informationElements: new Map([
        ['RSSI-SCAN', [
          {
            ieId: 'RSSI-SCAN-RESULT',
            name: 'RSSI Scan Result',
            type: 'SEQUENCE',
            value: [],
            description: 'RSSI scan results for multiple cells',
            mandatory: true,
            standardReference: '3GPP TS 36.101',
            layer: 'PHY',
            protocol: 'PHY',
            encoding: 'BER',
            size: 24,
            criticality: 'REJECT'
          }
        ]],
        ['PSS-DETECTION', [
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
        ]]
      ]),
      
      // Layer Parameters with Dynamic Changes
      layerParameters: {
        PHY: [
          {
            parameterName: 'rssi',
            description: 'Received Signal Strength Indicator',
            unit: 'dBm',
            currentValue: -85.2,
            baseValue: -100.0,
            minValue: -140.0,
            maxValue: -44.0,
            typicalValue: -85.0,
            variation: 5.0,
            updateInterval: 100,
            criticalThresholds: { warning: -90.0, error: -100.0, critical: -110.0 },
            measurementMethod: 'RSSI measurement',
            standardReference: '3GPP TS 36.101',
            dynamicChanges: [
              {
                timestamp: 0,
                value: -100.0,
                change: 0.0,
                changePercent: 0.0,
                trend: 'STABLE',
                trigger: 'Initial measurement',
                description: 'Initial RSSI measurement'
              },
              {
                timestamp: 1000,
                value: -95.0,
                change: 5.0,
                changePercent: 5.0,
                trend: 'INCREASING',
                trigger: 'Signal improvement',
                description: 'RSSI improving during scan'
              },
              {
                timestamp: 2000,
                value: -90.0,
                change: 5.0,
                changePercent: 5.3,
                trend: 'INCREASING',
                trigger: 'Better cell found',
                description: 'RSSI improving with better cell'
              },
              {
                timestamp: 3000,
                value: -85.2,
                change: 4.8,
                changePercent: 5.3,
                trend: 'INCREASING',
                trigger: 'Best cell selected',
                description: 'RSSI at best cell'
              }
            ]
          },
          {
            parameterName: 'rsrp',
            description: 'Reference Signal Received Power',
            unit: 'dBm',
            currentValue: -95.2,
            baseValue: -100.0,
            minValue: -140.0,
            maxValue: -44.0,
            typicalValue: -95.0,
            variation: 3.0,
            updateInterval: 200,
            criticalThresholds: { warning: -100.0, error: -110.0, critical: -120.0 },
            measurementMethod: 'RSRP measurement',
            standardReference: '3GPP TS 36.101',
            dynamicChanges: [
              {
                timestamp: 5000,
                value: -100.0,
                change: 0.0,
                changePercent: 0.0,
                trend: 'STABLE',
                trigger: 'PSS detection start',
                description: 'RSRP measurement during PSS detection'
              },
              {
                timestamp: 6000,
                value: -98.5,
                change: 1.5,
                changePercent: 1.5,
                trend: 'INCREASING',
                trigger: 'PSS sync achieved',
                description: 'RSRP improving with PSS sync'
              },
              {
                timestamp: 7000,
                value: -96.0,
                change: 2.5,
                changePercent: 2.5,
                trend: 'INCREASING',
                trigger: 'SSS detection',
                description: 'RSRP improving with SSS detection'
              },
              {
                timestamp: 8000,
                value: -95.2,
                change: 0.8,
                changePercent: 0.8,
                trend: 'INCREASING',
                trigger: 'DMRS detection',
                description: 'RSRP stable after DMRS detection'
              }
            ]
          },
          {
            parameterName: 'rsrq',
            description: 'Reference Signal Received Quality',
            unit: 'dB',
            currentValue: -10.5,
            baseValue: -15.0,
            minValue: -20.0,
            maxValue: -3.0,
            typicalValue: -10.0,
            variation: 2.0,
            updateInterval: 200,
            criticalThresholds: { warning: -12.0, error: -15.0, critical: -18.0 },
            measurementMethod: 'RSRQ measurement',
            standardReference: '3GPP TS 36.101',
            dynamicChanges: [
              {
                timestamp: 5000,
                value: -15.0,
                change: 0.0,
                changePercent: 0.0,
                trend: 'STABLE',
                trigger: 'PSS detection start',
                description: 'RSRQ measurement during PSS detection'
              },
              {
                timestamp: 6000,
                value: -13.5,
                change: 1.5,
                changePercent: 10.0,
                trend: 'INCREASING',
                trigger: 'PSS sync achieved',
                description: 'RSRQ improving with PSS sync'
              },
              {
                timestamp: 7000,
                value: -12.0,
                change: 1.5,
                changePercent: 11.1,
                trend: 'INCREASING',
                trigger: 'SSS detection',
                description: 'RSRQ improving with SSS detection'
              },
              {
                timestamp: 8000,
                value: -10.5,
                change: 1.5,
                changePercent: 12.5,
                trend: 'INCREASING',
                trigger: 'DMRS detection',
                description: 'RSRQ stable after DMRS detection'
              }
            ]
          },
          {
            parameterName: 'sinr',
            description: 'Signal to Interference plus Noise Ratio',
            unit: 'dB',
            currentValue: 15.3,
            baseValue: 10.0,
            minValue: -5.0,
            maxValue: 30.0,
            typicalValue: 15.0,
            variation: 3.0,
            updateInterval: 200,
            criticalThresholds: { warning: 5.0, error: 0.0, critical: -5.0 },
            measurementMethod: 'SINR measurement',
            standardReference: '3GPP TS 36.101',
            dynamicChanges: [
              {
                timestamp: 5000,
                value: 10.0,
                change: 0.0,
                changePercent: 0.0,
                trend: 'STABLE',
                trigger: 'PSS detection start',
                description: 'SINR measurement during PSS detection'
              },
              {
                timestamp: 6000,
                value: 12.5,
                change: 2.5,
                changePercent: 25.0,
                trend: 'INCREASING',
                trigger: 'PSS sync achieved',
                description: 'SINR improving with PSS sync'
              },
              {
                timestamp: 7000,
                value: 14.0,
                change: 1.5,
                changePercent: 12.0,
                trend: 'INCREASING',
                trigger: 'SSS detection',
                description: 'SINR improving with SSS detection'
              },
              {
                timestamp: 8000,
                value: 15.3,
                change: 1.3,
                changePercent: 9.3,
                trend: 'INCREASING',
                trigger: 'DMRS detection',
                description: 'SINR stable after DMRS detection'
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
            updateInterval: 1000,
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
      
      // Test Environment
      testEnvironment: {
        name: 'LTE Cell Search Complete Environment',
        description: 'Complete LTE cell search environment with multiple cells and full monitoring',
        networkTopology: 'Multiple eNodeBs with EPC',
        equipment: ['eNodeB-001', 'eNodeB-002', 'eNodeB-003', 'MME', 'SGW', 'PGW', 'UE', 'Spectrum Analyzer'],
        configuration: { 
          earfcn: 1850, 
          bandwidth: 20, 
          cells: [
            { cellId: 'CELL-001', pci: 123, power: 46 },
            { cellId: 'CELL-002', pci: 456, power: 43 },
            { cellId: 'CELL-003', pci: 789, power: 40 }
          ]
        },
        constraints: ['Multiple cells', 'No interference', 'Complete cell search monitoring'],
        networkElements: [
          {
            name: 'eNodeB-001',
            type: 'eNodeB',
            role: 'Primary Cell',
            configuration: { earfcn: 1850, bandwidth: 20, pci: 123, power: 46 },
            capabilities: ['LTE', 'MIMO', 'CA'],
            interfaces: ['S1-MME', 'S1-U', 'X2']
          },
          {
            name: 'eNodeB-002',
            type: 'eNodeB',
            role: 'Secondary Cell',
            configuration: { earfcn: 1850, bandwidth: 20, pci: 456, power: 43 },
            capabilities: ['LTE', 'MIMO'],
            interfaces: ['S1-MME', 'S1-U', 'X2']
          },
          {
            name: 'eNodeB-003',
            type: 'eNodeB',
            role: 'Tertiary Cell',
            configuration: { earfcn: 1850, bandwidth: 20, pci: 789, power: 40 },
            capabilities: ['LTE', 'MIMO'],
            interfaces: ['S1-MME', 'S1-U', 'X2']
          }
        ]
      }
    };
  }

  public getAvailableTemplates(): string[] {
    return Array.from(this.templates.keys());
  }

  public getTemplate(templateId: string): LTECellSearchTemplate | null {
    return this.templates.get(templateId) || null;
  }

  public generateTestCase(templateId: string, customizations: Partial<LTECellSearchTemplate> = {}): LTECellSearchTemplate {
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

export const lteCellSearchTemplateGenerator = LTECellSearchTemplateGenerator.getInstance();