/**
 * Test Case Template Generator
 * Generates 3GPP-compliant test case templates for different technologies and scenarios
 */

export interface TestCaseTemplate {
  testCaseId: string;
  name: string;
  description: string;
  technology: string;
  category: string;
  version: string;
  ueProfile: UEProfileTemplate;
  cellConfig: CellConfigTemplate;
  expectedMessageSequence: TestStepTemplate[];
  assertions: AssertionTemplate[];
  layerParameters: LayerParameterTemplate[];
  informationElements: IETemplate[];
  testScenario: TestScenarioTemplate;
  validationRules: ValidationRuleTemplate[];
}

export interface UEProfileTemplate {
  id: string;
  imsi: string;
  imei: string;
  deviceCapabilities: DeviceCapabilitiesTemplate;
  defaultApn: string;
  securitySupport: SecuritySupportTemplate;
  mobilitySupport?: MobilitySupportTemplate;
  serviceSupport?: ServiceSupportTemplate;
}

export interface DeviceCapabilitiesTemplate {
  bandwidthClass: string;
  caSupport: boolean;
  mimoSupport: string;
  features: string[];
  maxThroughput?: ThroughputTemplate;
  powerClass?: string;
  frequencyBands?: string[];
}

export interface ThroughputTemplate {
  downlink: number;
  uplink: number;
  unit: string;
}

export interface SecuritySupportTemplate {
  EEA: string[];
  EIA: string[];
  EEAStar?: string[];
  EIAStar?: string[];
}

export interface MobilitySupportTemplate {
  handoverTypes: string[];
  measurementCapabilities: string[];
  mobilityState: string;
}

export interface ServiceSupportTemplate {
  voiceSupport: boolean;
  dataSupport: boolean;
  smsSupport: boolean;
  emergencySupport: boolean;
  services: string[];
}

export interface CellConfigTemplate {
  pci?: number;
  nci?: string;
  earfcn?: number;
  nrarfcn?: number;
  bandwidth: number;
  tac: number;
  mcc: string;
  mnc: string;
  cellId?: string;
  frequencyBand?: string;
  duplexMode?: string;
}

export interface TestStepTemplate {
  step: number;
  eventType: string;
  layer: string;
  description: string;
  subSteps?: string[];
  expectedIEs?: IETemplate[];
  assertions?: AssertionTemplate[];
  duration?: number;
  trigger?: TriggerTemplate;
  expectedResponse?: ResponseTemplate;
}

export interface TriggerTemplate {
  type: 'TIMER' | 'EVENT' | 'CONDITION' | 'MANUAL';
  value?: any;
  condition?: string;
  timeout?: number;
}

export interface ResponseTemplate {
  success: string[];
  failure: string[];
  timeout?: string;
}

export interface IETemplate {
  name: string;
  type: string;
  value: any;
  description: string;
  mandatory: boolean;
  conditional?: string;
  standardReference?: string;
}

export interface AssertionTemplate {
  parameter: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'nin' | 'exists' | 'regex';
  expectedValue: any;
  tolerance?: number;
  description: string;
  severity: 'ERROR' | 'WARN' | 'INFO';
}

export interface LayerParameterTemplate {
  layer: string;
  parameterName: string;
  description: string;
  unit: string;
  expectedRange: {
    min: number;
    max: number;
  };
  typicalValue: number;
  variation: number;
  criticalThresholds?: {
    warning: number;
    error: number;
  };
}

export interface TestScenarioTemplate {
  name: string;
  description: string;
  environment: string;
  prerequisites: string[];
  testSteps: string[];
  expectedOutcome: string;
  successCriteria: string[];
  failureCriteria: string[];
}

export interface ValidationRuleTemplate {
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

export class TestCaseTemplateGenerator {
  private static instance: TestCaseTemplateGenerator;
  private templates: Map<string, TestCaseTemplate> = new Map();

  private constructor() {
    this.initializeTemplates();
  }

  public static getInstance(): TestCaseTemplateGenerator {
    if (!TestCaseTemplateGenerator.instance) {
      TestCaseTemplateGenerator.instance = new TestCaseTemplateGenerator();
    }
    return TestCaseTemplateGenerator.instance;
  }

  private initializeTemplates(): void {
    // LTE Templates
    this.templates.set('lte-power-on', this.createLTEPowerOnTemplate());
    this.templates.set('lte-handover', this.createLTEHandoverTemplate());
    this.templates.set('lte-call-setup', this.createLTECallSetupTemplate());
    this.templates.set('lte-data-session', this.createLTEDataSessionTemplate());
    
    // 5G NR Templates
    this.templates.set('5g-nr-initial-access', this.create5GNRInitialAccessTemplate());
    this.templates.set('5g-nr-handover', this.create5GNRHandoverTemplate());
    this.templates.set('5g-nr-pdu-session', this.create5GNRPDUSessionTemplate());
    this.templates.set('5g-nr-mobility', this.create5GNRMobilityTemplate());
    
    // O-RAN Templates
    this.templates.set('oran-ric-test', this.createOranRicTestTemplate());
    this.templates.set('oran-xapp-deployment', this.createOranXAppDeploymentTemplate());
    
    // NB-IoT Templates
    this.templates.set('nb-iot-attach', this.createNbIotAttachTemplate());
    this.templates.set('nb-iot-data-transmission', this.createNbIotDataTransmissionTemplate());
    
    // C-V2X Templates
    this.templates.set('c-v2x-sidelink', this.createCV2XSidelinkTemplate());
    this.templates.set('c-v2x-safety-message', this.createCV2XSafetyMessageTemplate());
    
    // NTN Templates
    this.templates.set('ntn-satellite-access', this.createNTNSatelliteAccessTemplate());
    this.templates.set('ntn-handover', this.createNTNHandoverTemplate());
  }

  /**
   * Get available template types
   */
  public getAvailableTemplates(): string[] {
    return Array.from(this.templates.keys());
  }

  /**
   * Get template by type
   */
  public getTemplate(templateType: string): TestCaseTemplate | null {
    return this.templates.get(templateType) || null;
  }

  /**
   * Generate test case from template
   */
  public generateTestCase(templateType: string, customizations: Partial<TestCaseTemplate> = {}): TestCaseTemplate {
    const template = this.getTemplate(templateType);
    if (!template) {
      throw new Error(`Template ${templateType} not found`);
    }

    // Deep clone template and apply customizations
    const testCase = JSON.parse(JSON.stringify(template));
    Object.assign(testCase, customizations);

    // Generate unique IDs
    testCase.testCaseId = this.generateTestCaseId(templateType);
    testCase.ueProfile.id = this.generateUEProfileId();
    testCase.ueProfile.imsi = this.generateIMSI();
    testCase.ueProfile.imei = this.generateIMEI();

    return testCase;
  }

  /**
   * Validate test case against 3GPP standards
   */
  public validateTestCase(testCase: TestCaseTemplate): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate basic structure
    if (!testCase.testCaseId) errors.push('Test case ID is required');
    if (!testCase.name) errors.push('Test case name is required');
    if (!testCase.technology) errors.push('Technology is required');
    if (!testCase.category) errors.push('Category is required');

    // Validate UE Profile
    if (!testCase.ueProfile.imsi || !this.isValidIMSI(testCase.ueProfile.imsi)) {
      errors.push('Valid IMSI is required');
    }
    if (!testCase.ueProfile.imei || !this.isValidIMEI(testCase.ueProfile.imei)) {
      errors.push('Valid IMEI is required');
    }

    // Validate Cell Configuration
    if (!testCase.cellConfig.mcc || !this.isValidMCC(testCase.cellConfig.mcc)) {
      errors.push('Valid MCC is required');
    }
    if (!testCase.cellConfig.mnc || !this.isValidMNC(testCase.cellConfig.mnc)) {
      errors.push('Valid MNC is required');
    }

    // Validate Message Sequence
    if (!testCase.expectedMessageSequence || testCase.expectedMessageSequence.length === 0) {
      errors.push('Message sequence is required');
    }

    // Validate Technology-specific requirements
    this.validateTechnologySpecific(testCase, errors, warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private validateTechnologySpecific(testCase: TestCaseTemplate, errors: string[], warnings: string[]): void {
    switch (testCase.technology) {
      case 'LTE':
        this.validateLTESpecific(testCase, errors, warnings);
        break;
      case '5G_NR':
        this.validate5GNRSpecific(testCase, errors, warnings);
        break;
      case 'NB_IOT':
        this.validateNbIotSpecific(testCase, errors, warnings);
        break;
      case 'C_V2X':
        this.validateCV2XSpecific(testCase, errors, warnings);
        break;
      case 'NTN':
        this.validateNTNSpecific(testCase, errors, warnings);
        break;
    }
  }

  private validateLTESpecific(testCase: TestCaseTemplate, errors: string[], warnings: string[]): void {
    if (!testCase.cellConfig.earfcn) {
      errors.push('EARFCN is required for LTE');
    }
    if (!testCase.cellConfig.pci) {
      errors.push('PCI is required for LTE');
    }
    if (testCase.cellConfig.bandwidth < 1.4 || testCase.cellConfig.bandwidth > 20) {
      warnings.push('LTE bandwidth should be between 1.4 and 20 MHz');
    }
  }

  private validate5GNRSpecific(testCase: TestCaseTemplate, errors: string[], warnings: string[]): void {
    if (!testCase.cellConfig.nrarfcn) {
      errors.push('NRARFCN is required for 5G NR');
    }
    if (!testCase.cellConfig.nci) {
      errors.push('NCI is required for 5G NR');
    }
    if (testCase.cellConfig.bandwidth < 5 || testCase.cellConfig.bandwidth > 400) {
      warnings.push('5G NR bandwidth should be between 5 and 400 MHz');
    }
  }

  private validateNbIotSpecific(testCase: TestCaseTemplate, errors: string[], warnings: string[]): void {
    if (!testCase.cellConfig.earfcn) {
      errors.push('EARFCN is required for NB-IoT');
    }
    if (testCase.cellConfig.bandwidth !== 0.2) {
      warnings.push('NB-IoT bandwidth should be 0.2 MHz');
    }
  }

  private validateCV2XSpecific(testCase: TestCaseTemplate, errors: string[], warnings: string[]): void {
    if (!testCase.cellConfig.earfcn && !testCase.cellConfig.nrarfcn) {
      errors.push('EARFCN or NRARFCN is required for C-V2X');
    }
  }

  private validateNTNSpecific(testCase: TestCaseTemplate, errors: string[], warnings: string[]): void {
    if (!testCase.cellConfig.earfcn && !testCase.cellConfig.nrarfcn) {
      errors.push('EARFCN or NRARFCN is required for NTN');
    }
  }

  // Template creation methods
  private createLTEPowerOnTemplate(): TestCaseTemplate {
    return {
      testCaseId: 'lte-power-on-template',
      name: 'LTE Power-On Default Attach',
      description: 'Complete LTE UE power-on and attach procedure',
      technology: 'LTE',
      category: 'POWER_ON',
      version: '1.0',
      ueProfile: {
        id: 'ue_lte_template',
        imsi: '404123456789012',
        imei: '359123456789012',
        deviceCapabilities: {
          bandwidthClass: 'A',
          caSupport: true,
          mimoSupport: '2x2',
          features: ['VoLTE', 'VoWiFi'],
          maxThroughput: { downlink: 150, uplink: 50, unit: 'Mbps' },
          powerClass: '3',
          frequencyBands: ['Band 3', 'Band 7', 'Band 20']
        },
        defaultApn: 'internet',
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
      },
      cellConfig: {
        pci: 123,
        earfcn: 1850,
        bandwidth: 20,
        tac: 12345,
        mcc: '404',
        mnc: '12',
        cellId: '1234567890',
        frequencyBand: 'Band 3',
        duplexMode: 'FDD'
      },
      expectedMessageSequence: [
        {
          step: 1,
          eventType: 'CELL_SYNC',
          layer: 'PHY',
          description: 'UE performs cell synchronization',
          subSteps: ['PSS_DETECTION', 'SSS_DETECTION', 'PCI_CALCULATION', 'PBCH_DECODE'],
          expectedIEs: [
            { name: 'pci', type: 'INTEGER', value: 123, description: 'Physical Cell ID', mandatory: true },
            { name: 'earfcn', type: 'INTEGER', value: 1850, description: 'E-UTRA Absolute Radio Frequency Channel Number', mandatory: true },
            { name: 'rsrp', type: 'REAL', value: -95.2, description: 'Reference Signal Received Power', mandatory: true },
            { name: 'rsrq', type: 'REAL', value: -10.5, description: 'Reference Signal Received Quality', mandatory: true },
            { name: 'sinr', type: 'REAL', value: 15.3, description: 'Signal to Interference plus Noise Ratio', mandatory: true }
          ],
          assertions: [
            { parameter: 'rsrp', operator: 'gte', expectedValue: -110, description: 'RSRP should be above -110 dBm', severity: 'ERROR' },
            { parameter: 'rsrq', operator: 'gte', expectedValue: -20, description: 'RSRQ should be above -20 dB', severity: 'ERROR' },
            { parameter: 'sinr', operator: 'gte', expectedValue: 0, description: 'SINR should be above 0 dB', severity: 'ERROR' }
          ],
          duration: 3000,
          trigger: { type: 'TIMER', timeout: 5000 },
          expectedResponse: { success: ['CELL_SYNC_SUCCESS'], failure: ['CELL_SYNC_FAILURE'] }
        }
      ],
      assertions: [
        { parameter: 'attach_success', operator: 'eq', expectedValue: true, description: 'Attach should be successful', severity: 'ERROR' },
        { parameter: 'attach_time', operator: 'lte', expectedValue: 10000, description: 'Attach time should be less than 10 seconds', severity: 'WARN' }
      ],
      layerParameters: [
        { layer: 'PHY', parameterName: 'rsrp', description: 'Reference Signal Received Power', unit: 'dBm', expectedRange: { min: -140, max: -44 }, typicalValue: -95, variation: 5, criticalThresholds: { warning: -100, error: -110 } },
        { layer: 'PHY', parameterName: 'rsrq', description: 'Reference Signal Received Quality', unit: 'dB', expectedRange: { min: -20, max: -3 }, typicalValue: -10, variation: 2, criticalThresholds: { warning: -12, error: -15 } },
        { layer: 'PHY', parameterName: 'sinr', description: 'Signal to Interference plus Noise Ratio', unit: 'dB', expectedRange: { min: -5, max: 30 }, typicalValue: 15, variation: 3, criticalThresholds: { warning: 5, error: 0 } }
      ],
      informationElements: [
        { name: 'imsi', type: 'STRING', value: '404123456789012', description: 'International Mobile Subscriber Identity', mandatory: true, standardReference: '3GPP TS 23.003' },
        { name: 'imei', type: 'STRING', value: '359123456789012', description: 'International Mobile Equipment Identity', mandatory: true, standardReference: '3GPP TS 23.003' }
      ],
      testScenario: {
        name: 'LTE Power-On Attach',
        description: 'UE powers on and performs complete attach procedure',
        environment: 'LTE Network with eNodeB and EPC',
        prerequisites: ['UE powered off', 'Network available', 'Valid SIM card'],
        testSteps: ['Power on UE', 'Cell search', 'Synchronization', 'RACH', 'RRC Setup', 'NAS Attach'],
        expectedOutcome: 'UE successfully attached to network',
        successCriteria: ['Attach accept received', 'Default bearer established', 'UE in RRC_CONNECTED state'],
        failureCriteria: ['Attach reject', 'Timeout', 'RRC connection failure']
      },
      validationRules: [
        { ruleId: 'LTE-001', name: 'RSRP Threshold', description: 'RSRP must be above -110 dBm', layer: 'PHY', parameter: 'rsrp', condition: 'rsrp > -110', expectedResult: true, severity: 'CRITICAL', standardReference: '3GPP TS 36.101' },
        { ruleId: 'LTE-002', name: 'Attach Success', description: 'Attach procedure must complete successfully', layer: 'NAS', parameter: 'attach_result', condition: 'attach_result == SUCCESS', expectedResult: true, severity: 'CRITICAL', standardReference: '3GPP TS 24.301' }
      ]
    };
  }

  private create5GNRInitialAccessTemplate(): TestCaseTemplate {
    return {
      testCaseId: '5g-nr-initial-access-template',
      name: '5G NR Initial Access Procedure',
      description: 'Complete 5G NR UE initial access and registration procedure',
      technology: '5G_NR',
      category: 'INITIAL_ACCESS',
      version: '1.0',
      ueProfile: {
        id: 'ue_5g_nr_template',
        imsi: '404123456789013',
        imei: '359123456789013',
        deviceCapabilities: {
          bandwidthClass: 'A',
          caSupport: true,
          mimoSupport: '4x4',
          features: ['VoNR', 'eMBB', 'URLLC', 'mMTC'],
          maxThroughput: { downlink: 1000, uplink: 100, unit: 'Mbps' },
          powerClass: '2',
          frequencyBands: ['n78', 'n41', 'n28']
        },
        defaultApn: 'internet',
        securitySupport: {
          EEA: ['EEA0', 'EEA1', 'EEA2', 'EEA3'],
          EIA: ['EIA0', 'EIA1', 'EIA2', 'EIA3']
        }
      },
      cellConfig: {
        nci: '12345678901234567890',
        nrarfcn: 632448,
        bandwidth: 100,
        tac: 54321,
        mcc: '404',
        mnc: '12',
        cellId: '1234567890',
        frequencyBand: 'n78',
        duplexMode: 'TDD'
      },
      expectedMessageSequence: [
        {
          step: 1,
          eventType: 'SSB_DETECTION',
          layer: 'PHY',
          description: 'UE detects SSB and performs cell synchronization',
          subSteps: ['PSS_DETECTION', 'SSS_DETECTION', 'PBCH_DECODE', 'SIB1_DECODE'],
          expectedIEs: [
            { name: 'ssb_index', type: 'INTEGER', value: 0, description: 'SSB Index', mandatory: true },
            { name: 'nrarfcn', type: 'INTEGER', value: 632448, description: 'NR Absolute Radio Frequency Channel Number', mandatory: true },
            { name: 'pci', type: 'INTEGER', value: 456, description: 'Physical Cell ID', mandatory: true }
          ],
          assertions: [
            { parameter: 'ssb_detection_time', operator: 'lte', expectedValue: 5000, description: 'SSB detection should complete within 5 seconds', severity: 'ERROR' }
          ],
          duration: 3000
        }
      ],
      assertions: [],
      layerParameters: [],
      informationElements: [],
      testScenario: {
        name: '5G NR Initial Access',
        description: 'UE performs initial access to 5G NR network',
        environment: '5G NR Network with gNB and 5GC',
        prerequisites: ['UE powered off', '5G network available', 'Valid SIM card'],
        testSteps: ['Power on UE', 'SSB detection', 'RACH', 'RRC Setup', 'Registration'],
        expectedOutcome: 'UE successfully registered to 5G network',
        successCriteria: ['Registration accept received', 'UE in RRC_CONNECTED state'],
        failureCriteria: ['Registration reject', 'Timeout', 'RRC connection failure']
      },
      validationRules: []
    };
  }

  // Additional template creation methods would go here...
  private createLTEHandoverTemplate(): TestCaseTemplate {
    return { testCaseId: 'lte-handover-template', name: 'LTE Handover', description: 'LTE handover procedure', technology: 'LTE', category: 'HANDOVER', version: '1.0', ueProfile: {} as UEProfileTemplate, cellConfig: {} as CellConfigTemplate, expectedMessageSequence: [], assertions: [], layerParameters: [], informationElements: [], testScenario: {} as TestScenarioTemplate, validationRules: [] };
  }

  private createLTECallSetupTemplate(): TestCaseTemplate {
    return { testCaseId: 'lte-call-setup-template', name: 'LTE Call Setup', description: 'LTE call setup procedure', technology: 'LTE', category: 'CALL_SETUP', version: '1.0', ueProfile: {} as UEProfileTemplate, cellConfig: {} as CellConfigTemplate, expectedMessageSequence: [], assertions: [], layerParameters: [], informationElements: [], testScenario: {} as TestScenarioTemplate, validationRules: [] };
  }

  private createLTEDataSessionTemplate(): TestCaseTemplate {
    return { testCaseId: 'lte-data-session-template', name: 'LTE Data Session', description: 'LTE data session establishment', technology: 'LTE', category: 'DATA_SESSION', version: '1.0', ueProfile: {} as UEProfileTemplate, cellConfig: {} as CellConfigTemplate, expectedMessageSequence: [], assertions: [], layerParameters: [], informationElements: [], testScenario: {} as TestScenarioTemplate, validationRules: [] };
  }

  private create5GNRHandoverTemplate(): TestCaseTemplate {
    return { testCaseId: '5g-nr-handover-template', name: '5G NR Handover', description: '5G NR handover procedure', technology: '5G_NR', category: 'HANDOVER', version: '1.0', ueProfile: {} as UEProfileTemplate, cellConfig: {} as CellConfigTemplate, expectedMessageSequence: [], assertions: [], layerParameters: [], informationElements: [], testScenario: {} as TestScenarioTemplate, validationRules: [] };
  }

  private create5GNRPDUSessionTemplate(): TestCaseTemplate {
    return { testCaseId: '5g-nr-pdu-session-template', name: '5G NR PDU Session', description: '5G NR PDU session establishment', technology: '5G_NR', category: 'PDU_SESSION', version: '1.0', ueProfile: {} as UEProfileTemplate, cellConfig: {} as CellConfigTemplate, expectedMessageSequence: [], assertions: [], layerParameters: [], informationElements: [], testScenario: {} as TestScenarioTemplate, validationRules: [] };
  }

  private create5GNRMobilityTemplate(): TestCaseTemplate {
    return { testCaseId: '5g-nr-mobility-template', name: '5G NR Mobility', description: '5G NR mobility procedures', technology: '5G_NR', category: 'MOBILITY', version: '1.0', ueProfile: {} as UEProfileTemplate, cellConfig: {} as CellConfigTemplate, expectedMessageSequence: [], assertions: [], layerParameters: [], informationElements: [], testScenario: {} as TestScenarioTemplate, validationRules: [] };
  }

  private createOranRicTestTemplate(): TestCaseTemplate {
    return { testCaseId: 'oran-ric-test-template', name: 'O-RAN RIC Test', description: 'O-RAN RIC functionality test', technology: 'O_RAN', category: 'RIC_TEST', version: '1.0', ueProfile: {} as UEProfileTemplate, cellConfig: {} as CellConfigTemplate, expectedMessageSequence: [], assertions: [], layerParameters: [], informationElements: [], testScenario: {} as TestScenarioTemplate, validationRules: [] };
  }

  private createOranXAppDeploymentTemplate(): TestCaseTemplate {
    return { testCaseId: 'oran-xapp-deployment-template', name: 'O-RAN xApp Deployment', description: 'O-RAN xApp deployment test', technology: 'O_RAN', category: 'XAPP_DEPLOYMENT', version: '1.0', ueProfile: {} as UEProfileTemplate, cellConfig: {} as CellConfigTemplate, expectedMessageSequence: [], assertions: [], layerParameters: [], informationElements: [], testScenario: {} as TestScenarioTemplate, validationRules: [] };
  }

  private createNbIotAttachTemplate(): TestCaseTemplate {
    return { testCaseId: 'nb-iot-attach-template', name: 'NB-IoT Attach', description: 'NB-IoT attach procedure', technology: 'NB_IOT', category: 'ATTACH', version: '1.0', ueProfile: {} as UEProfileTemplate, cellConfig: {} as CellConfigTemplate, expectedMessageSequence: [], assertions: [], layerParameters: [], informationElements: [], testScenario: {} as TestScenarioTemplate, validationRules: [] };
  }

  private createNbIotDataTransmissionTemplate(): TestCaseTemplate {
    return { testCaseId: 'nb-iot-data-transmission-template', name: 'NB-IoT Data Transmission', description: 'NB-IoT data transmission test', technology: 'NB_IOT', category: 'DATA_TRANSMISSION', version: '1.0', ueProfile: {} as UEProfileTemplate, cellConfig: {} as CellConfigTemplate, expectedMessageSequence: [], assertions: [], layerParameters: [], informationElements: [], testScenario: {} as TestScenarioTemplate, validationRules: [] };
  }

  private createCV2XSidelinkTemplate(): TestCaseTemplate {
    return { testCaseId: 'c-v2x-sidelink-template', name: 'C-V2X Sidelink', description: 'C-V2X sidelink communication test', technology: 'C_V2X', category: 'SIDELINK', version: '1.0', ueProfile: {} as UEProfileTemplate, cellConfig: {} as CellConfigTemplate, expectedMessageSequence: [], assertions: [], layerParameters: [], informationElements: [], testScenario: {} as TestScenarioTemplate, validationRules: [] };
  }

  private createCV2XSafetyMessageTemplate(): TestCaseTemplate {
    return { testCaseId: 'c-v2x-safety-message-template', name: 'C-V2X Safety Message', description: 'C-V2X safety message transmission test', technology: 'C_V2X', category: 'SAFETY_MESSAGE', version: '1.0', ueProfile: {} as UEProfileTemplate, cellConfig: {} as CellConfigTemplate, expectedMessageSequence: [], assertions: [], layerParameters: [], informationElements: [], testScenario: {} as TestScenarioTemplate, validationRules: [] };
  }

  private createNTNSatelliteAccessTemplate(): TestCaseTemplate {
    return { testCaseId: 'ntn-satellite-access-template', name: 'NTN Satellite Access', description: 'NTN satellite access test', technology: 'NTN', category: 'SATELLITE_ACCESS', version: '1.0', ueProfile: {} as UEProfileTemplate, cellConfig: {} as CellConfigTemplate, expectedMessageSequence: [], assertions: [], layerParameters: [], informationElements: [], testScenario: {} as TestScenarioTemplate, validationRules: [] };
  }

  private createNTNHandoverTemplate(): TestCaseTemplate {
    return { testCaseId: 'ntn-handover-template', name: 'NTN Handover', description: 'NTN handover procedure test', technology: 'NTN', category: 'HANDOVER', version: '1.0', ueProfile: {} as UEProfileTemplate, cellConfig: {} as CellConfigTemplate, expectedMessageSequence: [], assertions: [], layerParameters: [], informationElements: [], testScenario: {} as TestScenarioTemplate, validationRules: [] };
  }

  // Utility methods
  private generateTestCaseId(templateType: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5);
    return `${templateType}-${timestamp}-${random}`;
  }

  private generateUEProfileId(): string {
    return `ue_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  }

  private generateIMSI(): string {
    const mcc = '404';
    const mnc = '12';
    const msin = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    return mcc + mnc + msin;
  }

  private generateIMEI(): string {
    const tac = '35912345';
    const serial = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const checkDigit = this.calculateIMEICheckDigit(tac + serial);
    return tac + serial + checkDigit;
  }

  private calculateIMEICheckDigit(imei: string): string {
    let sum = 0;
    for (let i = 0; i < imei.length; i++) {
      let digit = parseInt(imei[i]);
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) {
          digit = Math.floor(digit / 10) + (digit % 10);
        }
      }
      sum += digit;
    }
    return ((10 - (sum % 10)) % 10).toString();
  }

  private isValidIMSI(imsi: string): boolean {
    return /^[0-9]{15}$/.test(imsi);
  }

  private isValidIMEI(imei: string): boolean {
    return /^[0-9]{15}$/.test(imei);
  }

  private isValidMCC(mcc: string): boolean {
    return /^[0-9]{3}$/.test(mcc);
  }

  private isValidMNC(mnc: string): boolean {
    return /^[0-9]{2,3}$/.test(mnc);
  }
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const testCaseTemplateGenerator = TestCaseTemplateGenerator.getInstance();