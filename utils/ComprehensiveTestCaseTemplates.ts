/**
 * Comprehensive Test Case Templates
 * Based on 1000 test cases covering all wireless technologies
 */

export interface ComprehensiveTestCaseTemplate {
  testCaseId: string;
  name: string;
  description: string;
  technology: string;
  category: string;
  subcategory: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  complexity: 'SIMPLE' | 'MODERATE' | 'COMPLEX' | 'VERY_COMPLEX';
  duration: number; // minutes
  expectedOutcome: string;
  successCriteria: string[];
  failureCriteria: string[];
  prerequisites: string[];
  testSteps: TestStep[];
  assertions: Assertion[];
  layerParameters: LayerParameter[];
  informationElements: InformationElement[];
  validationRules: ValidationRule[];
  kpis: KPI[];
  testEnvironment: TestEnvironment;
  testData: TestData;
}

export interface TestStep {
  stepNumber: number;
  name: string;
  description: string;
  layer: string;
  expectedDuration: number;
  inputs: any[];
  outputs: any[];
  triggers: Trigger[];
  validations: Validation[];
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
}

export interface LayerParameter {
  layer: string;
  parameterName: string;
  description: string;
  unit: string;
  expectedRange: { min: number; max: number };
  typicalValue: number;
  variation: number;
  criticalThresholds?: { warning: number; error: number };
  measurementMethod: string;
}

export interface InformationElement {
  name: string;
  type: string;
  value: any;
  description: string;
  mandatory: boolean;
  conditional?: string;
  standardReference: string;
  layer: string;
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
}

export interface TestEnvironment {
  name: string;
  description: string;
  networkTopology: string;
  equipment: string[];
  configuration: any;
  constraints: string[];
}

export interface TestData {
  ueProfiles: any[];
  cellConfigurations: any[];
  networkConfigurations: any[];
  testScenarios: any[];
}

export class ComprehensiveTestCaseTemplateGenerator {
  private static instance: ComprehensiveTestCaseTemplateGenerator;
  private templates: Map<string, ComprehensiveTestCaseTemplate> = new Map();

  private constructor() {
    this.initializeTemplates();
  }

  public static getInstance(): ComprehensiveTestCaseTemplateGenerator {
    if (!ComprehensiveTestCaseTemplateGenerator.instance) {
      ComprehensiveTestCaseTemplateGenerator.instance = new ComprehensiveTestCaseTemplateGenerator();
    }
    return ComprehensiveTestCaseTemplateGenerator.instance;
  }

  private initializeTemplates(): void {
    // LTE Templates (1-250)
    this.createLTETemplates();
    // 5G NSA Templates (251-450)
    this.create5GNSATemplates();
    // 5G SA Templates (451-650)
    this.create5GSATemplates();
    // Performance Templates (651-750)
    this.createPerformanceTemplates();
    // Mobility Templates (751-850)
    this.createMobilityTemplates();
    // O-RAN Templates (851-900)
    this.createOranTemplates();
    // NB-IoT Templates (901-940)
    this.createNbIotTemplates();
    // V2X Templates (941-970)
    this.createV2XTemplates();
    // NTN Templates (971-1000)
    this.createNTNTemplates();
  }

  private createLTETemplates(): void {
    // LTE-001: Cell Search & Sync
    this.templates.set('LTE-001', {
      testCaseId: 'LTE-001',
      name: 'Cell Search & Sync',
      description: 'EARFCN scanning & MIB/SIB1 decode (single cell)',
      technology: 'LTE',
      category: 'CELL_SEARCH',
      subcategory: 'SYNC',
      priority: 'CRITICAL',
      complexity: 'SIMPLE',
      duration: 5,
      expectedOutcome: 'UE successfully synchronizes to cell',
      successCriteria: ['PSS detection', 'SSS detection', 'MIB decode', 'SIB1 decode'],
      failureCriteria: ['Sync failure', 'Timeout', 'Invalid parameters'],
      prerequisites: ['UE powered on', 'Cell available', 'Valid frequency'],
      testSteps: [
        {
          stepNumber: 1,
          name: 'PSS Detection',
          description: 'UE detects Primary Synchronization Signal',
          layer: 'PHY',
          expectedDuration: 1000,
          inputs: ['EARFCN', 'Bandwidth'],
          outputs: ['PSS Index', 'Timing'],
          triggers: [{ type: 'TIMER', timeout: 5000 }],
          validations: [{ parameter: 'pss_detection_time', operator: 'lte', expectedValue: 1000 }]
        }
      ],
      assertions: [
        {
          id: 'LTE-001-001',
          parameter: 'pss_detection_time',
          operator: 'lte',
          expectedValue: 1000,
          description: 'PSS detection within 1 second',
          severity: 'CRITICAL',
          layer: 'PHY'
        }
      ],
      layerParameters: [
        {
          layer: 'PHY',
          parameterName: 'rsrp',
          description: 'Reference Signal Received Power',
          unit: 'dBm',
          expectedRange: { min: -140, max: -44 },
          typicalValue: -95,
          variation: 5,
          criticalThresholds: { warning: -100, error: -110 },
          measurementMethod: 'RSRP measurement'
        }
      ],
      informationElements: [
        {
          name: 'pci',
          type: 'INTEGER',
          value: 123,
          description: 'Physical Cell ID',
          mandatory: true,
          standardReference: '3GPP TS 36.211',
          layer: 'PHY'
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
      kpis: [
        {
          name: 'sync_time',
          description: 'Cell synchronization time',
          unit: 'ms',
          targetValue: 1000,
          threshold: { min: 0, max: 5000 },
          measurementMethod: 'Timer measurement',
          layer: 'PHY'
        }
      ],
      testEnvironment: {
        name: 'LTE Cell Search Environment',
        description: 'Single cell environment for cell search testing',
        networkTopology: 'Single eNodeB',
        equipment: ['eNodeB', 'UE', 'Spectrum Analyzer'],
        configuration: { earfcn: 1850, bandwidth: 20 },
        constraints: ['Single cell', 'No interference']
      },
      testData: {
        ueProfiles: [],
        cellConfigurations: [],
        networkConfigurations: [],
        testScenarios: []
      }
    });

    // Add more LTE templates...
  }

  private create5GNSATemplates(): void {
    // NSA-251: EN-DC attach
    this.templates.set('NSA-251', {
      testCaseId: 'NSA-251',
      name: 'EN-DC Attach',
      description: 'LTE anchor + NR secondary cell addition initial attach',
      technology: '5G_NSA',
      category: 'DUAL_CONNECTIVITY',
      subcategory: 'EN_DC',
      priority: 'CRITICAL',
      complexity: 'COMPLEX',
      duration: 30,
      expectedOutcome: 'UE successfully attaches with EN-DC configuration',
      successCriteria: ['LTE attach success', 'NR SCG addition', 'Dual connectivity established'],
      failureCriteria: ['Attach failure', 'SCG addition failure', 'Dual connectivity failure'],
      prerequisites: ['LTE network available', 'NR network available', 'EN-DC capable UE'],
      testSteps: [],
      assertions: [],
      layerParameters: [],
      informationElements: [],
      validationRules: [],
      kpis: [],
      testEnvironment: {
        name: 'EN-DC Test Environment',
        description: 'LTE + NR dual connectivity environment',
        networkTopology: 'LTE eNodeB + NR gNodeB',
        equipment: ['eNodeB', 'gNodeB', 'UE', 'Core Network'],
        configuration: { lte_earfcn: 1850, nr_nrarfcn: 632448 },
        constraints: ['Dual connectivity support', 'X2/Xn interface']
      },
      testData: {
        ueProfiles: [],
        cellConfigurations: [],
        networkConfigurations: [],
        testScenarios: []
      }
    });
  }

  private create5GSATemplates(): void {
    // SA-451: NG-AP / NAS Attach
    this.templates.set('SA-451', {
      testCaseId: 'SA-451',
      name: 'NG-AP / NAS Attach',
      description: 'UE → gNB → AMF basic registration in 5G SA',
      technology: '5G_SA',
      category: 'REGISTRATION',
      subcategory: 'ATTACH',
      priority: 'CRITICAL',
      complexity: 'MODERATE',
      duration: 15,
      expectedOutcome: 'UE successfully registers to 5G SA network',
      successCriteria: ['NG-AP setup', 'NAS registration', 'AMF registration'],
      failureCriteria: ['Registration failure', 'NG-AP failure', 'NAS failure'],
      prerequisites: ['5G SA network available', 'gNodeB available', 'AMF available'],
      testSteps: [],
      assertions: [],
      layerParameters: [],
      informationElements: [],
      validationRules: [],
      kpis: [],
      testEnvironment: {
        name: '5G SA Test Environment',
        description: '5G standalone network environment',
        networkTopology: 'gNodeB + 5GC',
        equipment: ['gNodeB', 'AMF', 'SMF', 'UPF', 'UE'],
        configuration: { nrarfcn: 632448, bandwidth: 100 },
        constraints: ['5G SA only', 'No LTE dependency']
      },
      testData: {
        ueProfiles: [],
        cellConfigurations: [],
        networkConfigurations: [],
        testScenarios: []
      }
    });
  }

  private createPerformanceTemplates(): void {
    // PERF-651: DL TCP single flow saturation
    this.templates.set('PERF-651', {
      testCaseId: 'PERF-651',
      name: 'DL TCP Single Flow Saturation',
      description: 'Single UE max achievable rate',
      technology: 'LTE_5G',
      category: 'PERFORMANCE',
      subcategory: 'THROUGHPUT',
      priority: 'HIGH',
      complexity: 'SIMPLE',
      duration: 10,
      expectedOutcome: 'Achieve maximum DL throughput',
      successCriteria: ['Throughput > 100 Mbps', 'No packet loss', 'Stable connection'],
      failureCriteria: ['Low throughput', 'Packet loss', 'Connection drops'],
      prerequisites: ['Good RF conditions', 'Single UE', 'TCP server'],
      testSteps: [],
      assertions: [],
      layerParameters: [],
      informationElements: [],
      validationRules: [],
      kpis: [
        {
          name: 'dl_throughput',
          description: 'Downlink throughput',
          unit: 'Mbps',
          targetValue: 150,
          threshold: { min: 100, max: 200 },
          measurementMethod: 'TCP throughput measurement',
          layer: 'APPLICATION'
        }
      ],
      testEnvironment: {
        name: 'Performance Test Environment',
        description: 'High-performance test environment',
        networkTopology: 'Single cell',
        equipment: ['eNodeB/gNodeB', 'UE', 'TCP Server'],
        configuration: { bandwidth: 20, mimo: '4x4' },
        constraints: ['Good RF conditions', 'No interference']
      },
      testData: {
        ueProfiles: [],
        cellConfigurations: [],
        networkConfigurations: [],
        testScenarios: []
      }
    });
  }

  private createMobilityTemplates(): void {
    // MOB-751: Inter-RAT handover LTE → UMTS
    this.templates.set('MOB-751', {
      testCaseId: 'MOB-751',
      name: 'Inter-RAT Handover LTE → UMTS',
      description: 'Redirection vs handover',
      technology: 'LTE_UMTS',
      category: 'MOBILITY',
      subcategory: 'INTER_RAT',
      priority: 'HIGH',
      complexity: 'COMPLEX',
      duration: 20,
      expectedOutcome: 'Successful inter-RAT handover',
      successCriteria: ['Handover success', 'Service continuity', 'No data loss'],
      failureCriteria: ['Handover failure', 'Service interruption', 'Data loss'],
      prerequisites: ['LTE network', 'UMTS network', 'Inter-RAT capable UE'],
      testSteps: [],
      assertions: [],
      layerParameters: [],
      informationElements: [],
      validationRules: [],
      kpis: [],
      testEnvironment: {
        name: 'Inter-RAT Test Environment',
        description: 'LTE and UMTS co-located environment',
        networkTopology: 'LTE eNodeB + UMTS NodeB',
        equipment: ['eNodeB', 'NodeB', 'UE', 'Core Networks'],
        configuration: { lte_earfcn: 1850, umts_uarfcn: 10713 },
        constraints: ['Inter-RAT support', 'Co-located cells']
      },
      testData: {
        ueProfiles: [],
        cellConfigurations: [],
        networkConfigurations: [],
        testScenarios: []
      }
    });
  }

  private createOranTemplates(): void {
    // ORAN-851: O-RAN A1 policy deployment
    this.templates.set('ORAN-851', {
      testCaseId: 'ORAN-851',
      name: 'O-RAN A1 Policy Deployment',
      description: 'Policy deployment correctness & reaction time test',
      technology: 'O_RAN',
      category: 'O_RAN',
      subcategory: 'A1_POLICY',
      priority: 'HIGH',
      complexity: 'COMPLEX',
      duration: 15,
      expectedOutcome: 'A1 policy successfully deployed and applied',
      successCriteria: ['Policy deployment', 'Policy activation', 'KPI improvement'],
      failureCriteria: ['Policy deployment failure', 'Policy activation failure', 'No KPI improvement'],
      prerequisites: ['O-RAN RIC', 'A1 interface', 'Policy server'],
      testSteps: [],
      assertions: [],
      layerParameters: [],
      informationElements: [],
      validationRules: [],
      kpis: [],
      testEnvironment: {
        name: 'O-RAN Test Environment',
        description: 'O-RAN compliant test environment',
        networkTopology: 'O-RAN RIC + RU/CU/DU',
        equipment: ['RIC', 'RU', 'CU', 'DU', 'Policy Server'],
        configuration: { ric_type: 'near_rt', policy_type: 'A1' },
        constraints: ['O-RAN compliance', 'RIC availability']
      },
      testData: {
        ueProfiles: [],
        cellConfigurations: [],
        networkConfigurations: [],
        testScenarios: []
      }
    });
  }

  private createNbIotTemplates(): void {
    // NB-901: NB-IoT Coverage extension
    this.templates.set('NB-901', {
      testCaseId: 'NB-901',
      name: 'NB-IoT Coverage Extension',
      description: 'PRS/NPDSCH decoding at low SNR',
      technology: 'NB_IOT',
      category: 'COVERAGE',
      subcategory: 'EXTENSION',
      priority: 'HIGH',
      complexity: 'MODERATE',
      duration: 30,
      expectedOutcome: 'Successful coverage extension',
      successCriteria: ['PRS detection', 'NPDSCH decode', 'Coverage extension'],
      failureCriteria: ['PRS detection failure', 'NPDSCH decode failure', 'No coverage extension'],
      prerequisites: ['NB-IoT network', 'Low SNR conditions', 'NB-IoT UE'],
      testSteps: [],
      assertions: [],
      layerParameters: [],
      informationElements: [],
      validationRules: [],
      kpis: [],
      testEnvironment: {
        name: 'NB-IoT Test Environment',
        description: 'NB-IoT coverage extension test environment',
        networkTopology: 'NB-IoT cell',
        equipment: ['eNodeB', 'NB-IoT UE', 'Attenuator'],
        configuration: { earfcn: 1850, bandwidth: 0.2 },
        constraints: ['Low SNR', 'Coverage extension mode']
      },
      testData: {
        ueProfiles: [],
        cellConfigurations: [],
        networkConfigurations: [],
        testScenarios: []
      }
    });
  }

  private createV2XTemplates(): void {
    // V2X-941: PC5 sidelink discovery
    this.templates.set('V2X-941', {
      testCaseId: 'V2X-941',
      name: 'PC5 Sidelink Discovery',
      description: 'Direct communication setup (LTE-V2X)',
      technology: 'V2X',
      category: 'SIDELINK',
      subcategory: 'DISCOVERY',
      priority: 'HIGH',
      complexity: 'COMPLEX',
      duration: 20,
      expectedOutcome: 'Successful PC5 sidelink discovery',
      successCriteria: ['Discovery success', 'Direct communication', 'PC5 link established'],
      failureCriteria: ['Discovery failure', 'Communication failure', 'PC5 link failure'],
      prerequisites: ['V2X capable UEs', 'PC5 interface', 'V2X network'],
      testSteps: [],
      assertions: [],
      layerParameters: [],
      informationElements: [],
      validationRules: [],
      kpis: [],
      testEnvironment: {
        name: 'V2X Test Environment',
        description: 'V2X sidelink test environment',
        networkTopology: 'V2X UEs + LTE network',
        equipment: ['V2X UEs', 'LTE eNodeB', 'V2X Server'],
        configuration: { pc5_frequency: 5900, sidelink_bandwidth: 10 },
        constraints: ['V2X support', 'PC5 interface', 'Direct communication']
      },
      testData: {
        ueProfiles: [],
        cellConfigurations: [],
        networkConfigurations: [],
        testScenarios: []
      }
    });
  }

  private createNTNTemplates(): void {
    // NTN-971: NTN attach & registration
    this.templates.set('NTN-971', {
      testCaseId: 'NTN-971',
      name: 'NTN Attach & Registration',
      description: 'Satellite link characteristics (long RTT)',
      technology: 'NTN',
      category: 'SATELLITE',
      subcategory: 'ATTACH',
      priority: 'HIGH',
      complexity: 'VERY_COMPLEX',
      duration: 60,
      expectedOutcome: 'Successful NTN attach and registration',
      successCriteria: ['Satellite link established', 'Registration success', 'Long RTT handling'],
      failureCriteria: ['Link failure', 'Registration failure', 'RTT timeout'],
      prerequisites: ['NTN network', 'Satellite coverage', 'NTN capable UE'],
      testSteps: [],
      assertions: [],
      layerParameters: [],
      informationElements: [],
      validationRules: [],
      kpis: [],
      testEnvironment: {
        name: 'NTN Test Environment',
        description: 'Non-terrestrial network test environment',
        networkTopology: 'Satellite + Ground Station',
        equipment: ['Satellite', 'Ground Station', 'NTN UE', 'Core Network'],
        configuration: { satellite_type: 'LEO', rtt: 500, doppler: true },
        constraints: ['Long RTT', 'Doppler shift', 'Intermittent coverage']
      },
      testData: {
        ueProfiles: [],
        cellConfigurations: [],
        networkConfigurations: [],
        testScenarios: []
      }
    });
  }

  public getAvailableTemplates(): string[] {
    return Array.from(this.templates.keys());
  }

  public getTemplate(templateId: string): ComprehensiveTestCaseTemplate | null {
    return this.templates.get(templateId) || null;
  }

  public getTemplatesByTechnology(technology: string): ComprehensiveTestCaseTemplate[] {
    return Array.from(this.templates.values()).filter(template => 
      template.technology === technology
    );
  }

  public getTemplatesByCategory(category: string): ComprehensiveTestCaseTemplate[] {
    return Array.from(this.templates.values()).filter(template => 
      template.category === category
    );
  }

  public getTemplatesByPriority(priority: string): ComprehensiveTestCaseTemplate[] {
    return Array.from(this.templates.values()).filter(template => 
      template.priority === priority
    );
  }

  public generateTestCase(templateId: string, customizations: Partial<ComprehensiveTestCaseTemplate> = {}): ComprehensiveTestCaseTemplate {
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

export const comprehensiveTestCaseTemplateGenerator = ComprehensiveTestCaseTemplateGenerator.getInstance();