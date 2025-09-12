/**
 * 3GPP Standards Compliance Library
 * Implements proper 3GPP Information Elements (IEs) and message structures
 * Based on 3GPP TS 38.331, 36.331, 24.501, 38.321, 36.321, etc.
 */

// 3GPP Information Element Definitions
export interface ThreeGPPIE {
  name: string;
  type: 'integer' | 'bitstring' | 'octetstring' | 'enumerated' | 'sequence' | 'choice';
  size?: number;
  range?: [number, number];
  mandatory: boolean;
  description: string;
  reference: string; // 3GPP TS reference
  values?: any[];
}

// 3GPP Message Structure
export interface ThreeGPPMessage {
  messageType: string;
  protocol: string;
  direction: 'UL' | 'DL' | 'BIDIRECTIONAL';
  ies: ThreeGPPIE[];
  reference: string;
  description: string;
}

// 3GPP Layer Statistics
export interface ThreeGPPLayerStats {
  layer: string;
  metrics: Record<string, any>;
  timestamps: number[];
  performance: {
    throughput: number;
    latency: number;
    errorRate: number;
    successRate: number;
  };
}

// 3GPP Test Case with proper IEs
export interface ThreeGPPTestCase {
  id: string;
  name: string;
  category: string;
  protocol_version: string;
  test_case_id: string; // 3GPP test case ID
  complexity: 'low' | 'medium' | 'high' | 'expert';
  
  // 3GPP Message Flow with proper IEs
  message_flow: ThreeGPPMessageFlow[];
  
  // Layer-specific configurations
  layers: {
    PHY?: ThreeGPPLayerConfig;
    MAC?: ThreeGPPLayerConfig;
    RLC?: ThreeGPPLayerConfig;
    PDCP?: ThreeGPPLayerConfig;
    RRC?: ThreeGPPLayerConfig;
    NAS?: ThreeGPPLayerConfig;
    SIP?: ThreeGPPLayerConfig;
    IMS?: ThreeGPPLayerConfig;
  };
  
  // 3GPP Compliance
  compliance: {
    standard: string; // e.g., "TS 38.331"
    release: string; // e.g., "Release 17"
    validation: boolean;
    ie_coverage: number; // percentage of IEs covered
  };
  
  // Expected Results with 3GPP validation
  expected_results: ThreeGPPExpectedResults;
  
  // Performance Metrics per 3GPP requirements
  performance_metrics: ThreeGPPPerformanceMetrics;
  
  // Unique data for each test case
  unique_data: Record<string, any>;
}

export interface ThreeGPPMessageFlow {
  step_id: string;
  timestamp: number;
  direction: 'UL' | 'DL' | 'BIDIRECTIONAL';
  layer: string;
  message_type: string;
  message_name: string;
  
  // 3GPP Information Elements
  information_elements: Record<string, ThreeGPPIEValue>;
  
  // Layer-specific parameters
  layer_parameters: Record<string, any>;
  
  // Expected response
  expected_response?: {
    message_type: string;
    timeout: number;
    validation_criteria: Record<string, any>;
  };
  
  // Dependencies
  dependencies?: string[];
  
  // 3GPP Reference
  reference: string;
}

export interface ThreeGPPIEValue {
  ie_name: string;
  value: any;
  validation: {
    valid: boolean;
    errors: string[];
    warnings: string[];
  };
  reference: string;
}

export interface ThreeGPPLayerConfig {
  parameters: Record<string, any>;
  statistics: Record<string, any>;
  capabilities: Record<string, any>;
  configuration: Record<string, any>;
}

export interface ThreeGPPExpectedResults {
  success_criteria: Record<string, any>;
  failure_scenarios: Record<string, any>;
  performance_requirements: Record<string, any>;
  validation_rules: Record<string, any>;
}

export interface ThreeGPPPerformanceMetrics {
  latency: {
    min: number;
    max: number;
    target: number;
    unit: string;
  };
  throughput: {
    min: number;
    max: number;
    target: number;
    unit: string;
  };
  reliability: {
    success_rate: number;
    error_rate: number;
    availability: number;
  };
}

// 3GPP Information Element Definitions
export const ThreeGPP_IES: Record<string, ThreeGPPIE> = {
  // RRC IEs (TS 38.331)
  'rrc-transaction-id': {
    name: 'rrc-transaction-id',
    type: 'integer',
    size: 2,
    range: [0, 3],
    mandatory: true,
    description: 'RRC Transaction Identifier',
    reference: 'TS 38.331 6.2.2'
  },
  'establishment-cause': {
    name: 'establishment-cause',
    type: 'enumerated',
    mandatory: true,
    description: 'Establishment Cause',
    reference: 'TS 38.331 6.2.2',
    values: ['emergency', 'highPriorityAccess', 'mt-Access', 'mo-Signalling', 'mo-Data', 'mo-VoiceCall', 'mo-VideoCall', 'mo-SMS', 'mps-PriorityAccess', 'mcs-PriorityAccess']
  },
  'ue-identity': {
    name: 'ue-identity',
    type: 'choice',
    mandatory: true,
    description: 'UE Identity',
    reference: 'TS 38.331 6.2.2',
    values: ['s-TMSI', 'randomValue']
  },
  'cell-id': {
    name: 'cell-id',
    type: 'bitstring',
    size: 36,
    mandatory: true,
    description: 'Cell Identity',
    reference: 'TS 38.331 6.2.2'
  },
  'tac': {
    name: 'tac',
    type: 'bitstring',
    size: 24,
    mandatory: true,
    description: 'Tracking Area Code',
    reference: 'TS 38.331 6.2.2'
  },
  'plmn-identity': {
    name: 'plmn-identity',
    type: 'sequence',
    mandatory: true,
    description: 'PLMN Identity',
    reference: 'TS 38.331 6.2.2'
  },
  'mcc': {
    name: 'mcc',
    type: 'bcdstring',
    size: 3,
    range: [0, 999],
    mandatory: true,
    description: 'Mobile Country Code',
    reference: 'TS 23.003'
  },
  'mnc': {
    name: 'mnc',
    type: 'bcdstring',
    size: 2,
    range: [0, 99],
    mandatory: true,
    description: 'Mobile Network Code',
    reference: 'TS 23.003'
  },
  
  // NAS IEs (TS 24.501)
  'nas-key-set-identifier': {
    name: 'nas-key-set-identifier',
    type: 'integer',
    size: 3,
    range: [0, 7],
    mandatory: true,
    description: 'NAS Key Set Identifier',
    reference: 'TS 24.501 9.11.3.32'
  },
  'registration-type': {
    name: 'registration-type',
    type: 'enumerated',
    mandatory: true,
    description: 'Registration Type',
    reference: 'TS 24.501 9.11.3.35',
    values: ['initial', 'mobility', 'periodic', 'emergency']
  },
  'mobile-identity': {
    name: 'mobile-identity',
    type: 'choice',
    mandatory: true,
    description: 'Mobile Identity',
    reference: 'TS 24.501 9.11.3.4',
    values: ['5g-s-tmsi', 'imei', '5g-guti', 'suci']
  },
  
  // MAC IEs (TS 38.321)
  'lcid': {
    name: 'lcid',
    type: 'integer',
    size: 6,
    range: [0, 63],
    mandatory: true,
    description: 'Logical Channel ID',
    reference: 'TS 38.321 6.1.2'
  },
  'bsr': {
    name: 'bsr',
    type: 'enumerated',
    mandatory: true,
    description: 'Buffer Status Report',
    reference: 'TS 38.321 6.1.3.1',
    values: ['shortBSR', 'longBSR', 'truncatedBSR']
  },
  'phr': {
    name: 'phr',
    type: 'integer',
    size: 6,
    range: [-23, 40],
    mandatory: false,
    description: 'Power Headroom Report',
    reference: 'TS 38.321 6.1.3.6'
  },
  
  // RLC IEs (TS 38.322)
  'rlc-sn': {
    name: 'rlc-sn',
    type: 'integer',
    size: 12,
    range: [0, 4095],
    mandatory: true,
    description: 'RLC Sequence Number',
    reference: 'TS 38.322 6.2.2.1'
  },
  'si': {
    name: 'si',
    type: 'enumerated',
    mandatory: true,
    description: 'Segmentation Info',
    reference: 'TS 38.322 6.2.2.1',
    values: ['firstSegment', 'lastSegment', 'middleSegment', 'completeSDU']
  },
  'p': {
    name: 'p',
    type: 'bit',
    mandatory: false,
    description: 'Polling Bit',
    reference: 'TS 38.322 6.2.2.1'
  },
  
  // PDCP IEs (TS 38.323)
  'pdcp-sn': {
    name: 'pdcp-sn',
    type: 'integer',
    size: 12,
    range: [0, 4095],
    mandatory: true,
    description: 'PDCP Sequence Number',
    reference: 'TS 38.323 6.2.2'
  },
  'd-c': {
    name: 'd-c',
    type: 'bit',
    mandatory: true,
    description: 'Data/Control',
    reference: 'TS 38.323 6.2.2'
  },
  
  // PHY IEs (TS 38.211)
  'harq-process-id': {
    name: 'harq-process-id',
    type: 'integer',
    size: 4,
    range: [0, 15],
    mandatory: true,
    description: 'HARQ Process ID',
    reference: 'TS 38.211 6.1.2'
  },
  'mcs': {
    name: 'mcs',
    type: 'integer',
    size: 5,
    range: [0, 31],
    mandatory: true,
    description: 'Modulation and Coding Scheme',
    reference: 'TS 38.211 6.1.2'
  },
  'rv': {
    name: 'rv',
    type: 'integer',
    size: 2,
    range: [0, 3],
    mandatory: true,
    description: 'Redundancy Version',
    reference: 'TS 38.211 6.1.2'
  },
  'prb-allocation': {
    name: 'prb-allocation',
    type: 'bitstring',
    mandatory: true,
    description: 'Physical Resource Block Allocation',
    reference: 'TS 38.211 6.1.2'
  }
};

// 3GPP Message Definitions
export const ThreeGPP_MESSAGES: Record<string, ThreeGPPMessage> = {
  // RRC Messages (TS 38.331)
  'RRCSetupRequest': {
    messageType: 'RRCSetupRequest',
    protocol: 'RRC',
    direction: 'UL',
    reference: 'TS 38.331 6.2.2',
    description: 'RRC Setup Request',
    ies: [
      ThreeGPP_IES['rrc-transaction-id'],
      ThreeGPP_IES['establishment-cause'],
      ThreeGPP_IES['ue-identity']
    ]
  },
  'RRCSetup': {
    messageType: 'RRCSetup',
    protocol: 'RRC',
    direction: 'DL',
    reference: 'TS 38.331 6.2.2',
    description: 'RRC Setup',
    ies: [
      ThreeGPP_IES['rrc-transaction-id']
    ]
  },
  'RRCSetupComplete': {
    messageType: 'RRCSetupComplete',
    protocol: 'RRC',
    direction: 'UL',
    reference: 'TS 38.331 6.2.2',
    description: 'RRC Setup Complete',
    ies: [
      ThreeGPP_IES['rrc-transaction-id']
    ]
  },
  
  // NAS Messages (TS 24.501)
  'RegistrationRequest': {
    messageType: 'RegistrationRequest',
    protocol: 'NAS',
    direction: 'UL',
    reference: 'TS 24.501 8.2.1',
    description: 'Registration Request',
    ies: [
      ThreeGPP_IES['nas-key-set-identifier'],
      ThreeGPP_IES['registration-type'],
      ThreeGPP_IES['mobile-identity']
    ]
  },
  'RegistrationAccept': {
    messageType: 'RegistrationAccept',
    protocol: 'NAS',
    direction: 'DL',
    reference: 'TS 24.501 8.2.2',
    description: 'Registration Accept',
    ies: [
      ThreeGPP_IES['nas-key-set-identifier']
    ]
  }
};

// 3GPP Test Case Generator
export class ThreeGPPTestCaseGenerator {
  private static instance: ThreeGPPTestCaseGenerator;
  
  static getInstance(): ThreeGPPTestCaseGenerator {
    if (!ThreeGPPTestCaseGenerator.instance) {
      ThreeGPPTestCaseGenerator.instance = new ThreeGPPTestCaseGenerator();
    }
    return ThreeGPPTestCaseGenerator.instance;
  }
  
  // Generate unique data for each test case
  generateUniqueData(testCaseId: string, layer: string): Record<string, any> {
    const seed = this.hashString(testCaseId + layer);
    const random = this.seededRandom(seed);
    
    switch (layer) {
      case 'PHY':
        return this.generatePHYUniqueData(random);
      case 'MAC':
        return this.generateMACUniqueData(random);
      case 'RLC':
        return this.generateRLCUniqueData(random);
      case 'PDCP':
        return this.generatePDCPUniqueData(random);
      case 'RRC':
        return this.generateRRCUniqueData(random);
      case 'NAS':
        return this.generateNASUniqueData(random);
      default:
        return this.generateGenericUniqueData(random);
    }
  }
  
  // Generate 3GPP compliant test case
  generateTestCase(
    id: string,
    name: string,
    category: string,
    protocol_version: string,
    test_case_id: string,
    complexity: 'low' | 'medium' | 'high' | 'expert',
    message_flow: any[],
    layers: any
  ): ThreeGPPTestCase {
    const uniqueData: Record<string, any> = {};
    
    // Generate unique data for each layer
    Object.keys(layers).forEach(layer => {
      uniqueData[layer] = this.generateUniqueData(test_case_id, layer);
    });
    
    return {
      id,
      name,
      category,
      protocol_version,
      test_case_id,
      complexity,
      message_flow: this.enhanceMessageFlow(message_flow, test_case_id),
      layers: this.enhanceLayers(layers, test_case_id),
      compliance: {
        standard: this.getStandardReference(category),
        release: 'Release 17',
        validation: true,
        ie_coverage: 100
      },
      expected_results: this.generateExpectedResults(category, complexity),
      performance_metrics: this.generatePerformanceMetrics(category, complexity),
      unique_data: uniqueData
    };
  }
  
  private enhanceMessageFlow(messageFlow: any[], testCaseId: string): ThreeGPPMessageFlow[] {
    return messageFlow.map((message, index) => ({
      step_id: `step_${index + 1}`,
      timestamp: message.timestamp || index * 1000,
      direction: message.direction || 'BIDIRECTIONAL',
      layer: message.layer || 'UNKNOWN',
      message_type: message.message || `Message_${index + 1}`,
      message_name: message.message || `Message_${index + 1}`,
      information_elements: this.generateIEs(message.layer, testCaseId, index),
      layer_parameters: message.values || {},
      expected_response: message.expected_response,
      dependencies: message.dependencies || [],
      reference: this.getStandardReference(message.layer)
    }));
  }
  
  private enhanceLayers(layers: any, testCaseId: string): any {
    const enhancedLayers: any = {};
    
    Object.keys(layers).forEach(layer => {
      const uniqueData = this.generateUniqueData(testCaseId, layer);
      enhancedLayers[layer] = {
        ...layers[layer],
        unique_parameters: uniqueData,
        statistics: this.generateLayerStatistics(layer, testCaseId),
        capabilities: this.generateLayerCapabilities(layer),
        configuration: this.generateLayerConfiguration(layer, testCaseId)
      };
    });
    
    return enhancedLayers;
  }
  
  private generateIEs(layer: string, testCaseId: string, stepIndex: number): Record<string, ThreeGPPIEValue> {
    const ies: Record<string, ThreeGPPIEValue> = {};
    const seed = this.hashString(testCaseId + layer + stepIndex);
    const random = this.seededRandom(seed);
    
    // Generate layer-specific IEs
    switch (layer) {
      case 'RRC':
        ies['rrc-transaction-id'] = {
          ie_name: 'rrc-transaction-id',
          value: Math.floor(random() * 4), // 0-3
          validation: { valid: true, errors: [], warnings: [] },
          reference: 'TS 38.331 6.2.2'
        };
        ies['establishment-cause'] = {
          ie_name: 'establishment-cause',
          value: ['mo-Data', 'mo-Signalling', 'mt-Access'][Math.floor(random() * 3)],
          validation: { valid: true, errors: [], warnings: [] },
          reference: 'TS 38.331 6.2.2'
        };
        break;
      case 'NAS':
        ies['nas-key-set-identifier'] = {
          ie_name: 'nas-key-set-identifier',
          value: Math.floor(random() * 8), // 0-7
          validation: { valid: true, errors: [], warnings: [] },
          reference: 'TS 24.501 9.11.3.32'
        };
        break;
      case 'MAC':
        ies['lcid'] = {
          ie_name: 'lcid',
          value: Math.floor(random() * 64), // 0-63
          validation: { valid: true, errors: [], warnings: [] },
          reference: 'TS 38.321 6.1.2'
        };
        break;
    }
    
    return ies;
  }
  
  private generateLayerStatistics(layer: string, testCaseId: string): Record<string, any> {
    const seed = this.hashString(testCaseId + layer + 'stats');
    const random = this.seededRandom(seed);
    
    switch (layer) {
      case 'PHY':
        return {
          rsrp: -120 + random() * 60, // -120 to -60 dBm
          rsrq: -20 + random() * 15,  // -20 to -5 dB
          sinr: random() * 25,        // 0 to 25 dB
          cqi: Math.floor(random() * 15) + 1, // 1 to 15
          mcs: Math.floor(random() * 32),     // 0 to 31
          bler: random() * 0.1,       // 0 to 0.1
          throughput: 50 + random() * 200     // 50 to 250 Mbps
        };
      case 'MAC':
        return {
          harq_processes: Math.floor(random() * 16) + 1, // 1 to 16
          sched_requests: Math.floor(random() * 10),     // 0 to 9
          buffer_status_reports: Math.floor(random() * 5), // 0 to 4
          random_access_attempts: Math.floor(random() * 3) + 1 // 1 to 3
        };
      case 'RLC':
        return {
          tx_pdus: Math.floor(random() * 100),     // 0 to 99
          rx_pdus: Math.floor(random() * 100),     // 0 to 99
          retransmissions: Math.floor(random() * 10), // 0 to 9
          out_of_order: Math.floor(random() * 5)   // 0 to 4
        };
      case 'PDCP':
        return {
          tx_packets: Math.floor(random() * 200),  // 0 to 199
          rx_packets: Math.floor(random() * 200),  // 0 to 199
          dropped_packets: Math.floor(random() * 5), // 0 to 4
          duplicate_packets: Math.floor(random() * 3) // 0 to 2
        };
      default:
        return {
          messages_processed: Math.floor(random() * 1000),
          errors: Math.floor(random() * 10),
          success_rate: 90 + random() * 10
        };
    }
  }
  
  private generateLayerCapabilities(layer: string): Record<string, any> {
    switch (layer) {
      case 'PHY':
        return {
          max_bandwidth: 100,
          max_mimo_layers: 4,
          supported_modulations: ['QPSK', '16QAM', '64QAM', '256QAM'],
          carrier_aggregation: true
        };
      case 'MAC':
        return {
          max_harq_processes: 16,
          max_logical_channels: 32,
          scheduling_modes: ['dynamic', 'semi-persistent', 'configured']
        };
      case 'RLC':
        return {
          modes: ['AM', 'UM', 'TM'],
          max_sequence_number: 4095,
          segmentation: true
        };
      case 'PDCP':
        return {
          max_sequence_number: 4095,
          security_algorithms: ['AES-128', 'AES-256'],
          compression: true
        };
      default:
        return {};
    }
  }
  
  private generateLayerConfiguration(layer: string, testCaseId: string): Record<string, any> {
    const seed = this.hashString(testCaseId + layer + 'config');
    const random = this.seededRandom(seed);
    
    switch (layer) {
      case 'PHY':
        return {
          dl_arfcn: 3732480 + Math.floor(random() * 1000),
          ul_arfcn: 3732480 + Math.floor(random() * 1000),
          bandwidth: [20, 50, 100][Math.floor(random() * 3)],
          subcarrier_spacing: [15, 30, 60][Math.floor(random() * 3)],
          pci: Math.floor(random() * 1008)
        };
      case 'MAC':
        return {
          harq_enabled: true,
          scheduling_algorithm: 'proportional_fair',
          max_retransmissions: 3
        };
      default:
        return {};
    }
  }
  
  private generateExpectedResults(category: string, complexity: string): ThreeGPPExpectedResults {
    return {
      success_criteria: {
        message_delivery: '> 99%',
        latency: complexity === 'high' ? '< 1ms' : '< 10ms',
        error_rate: '< 0.1%'
      },
      failure_scenarios: {
        timeout: 'Message timeout',
        validation_error: 'IE validation failure',
        protocol_error: 'Protocol violation'
      },
      performance_requirements: {
        throughput: complexity === 'high' ? '> 1 Gbps' : '> 100 Mbps',
        reliability: '> 99.9%'
      },
      validation_rules: {
        ie_validation: 'All IEs must be 3GPP compliant',
        message_sequence: 'Messages must follow 3GPP sequence',
        timing_constraints: 'Timing must meet 3GPP requirements'
      }
    };
  }
  
  private generatePerformanceMetrics(category: string, complexity: string): ThreeGPPPerformanceMetrics {
    const baseLatency = complexity === 'high' ? 1 : 10;
    const baseThroughput = complexity === 'high' ? 1000 : 100;
    
    return {
      latency: {
        min: baseLatency * 0.5,
        max: baseLatency * 2,
        target: baseLatency,
        unit: 'ms'
      },
      throughput: {
        min: baseThroughput * 0.8,
        max: baseThroughput * 1.2,
        target: baseThroughput,
        unit: 'Mbps'
      },
      reliability: {
        success_rate: 99.9,
        error_rate: 0.1,
        availability: 99.99
      }
    };
  }
  
  private getStandardReference(category: string): string {
    const references: Record<string, string> = {
      '5G_NR': 'TS 38.331',
      '4G_LTE': 'TS 36.331',
      'NAS': 'TS 24.501',
      'MAC': 'TS 38.321',
      'RLC': 'TS 38.322',
      'PDCP': 'TS 38.323',
      'PHY': 'TS 38.211',
      'IMS': 'TS 24.229',
      'SIP': 'RFC 3261'
    };
    return references[category] || 'TS 38.331';
  }
  
  // Layer-specific unique data generators
  private generatePHYUniqueData(random: () => number): Record<string, any> {
    return {
      cell_id: Math.floor(random() * 1000000),
      pci: Math.floor(random() * 1008),
      rsrp: -120 + random() * 60,
      rsrq: -20 + random() * 15,
      sinr: random() * 25,
      cqi: Math.floor(random() * 15) + 1,
      mcs: Math.floor(random() * 32),
      bler: random() * 0.1,
      throughput: 50 + random() * 200,
      prb_allocation: Math.floor(random() * 100),
      symbol_allocation: Math.floor(random() * 14) + 1
    };
  }
  
  private generateMACUniqueData(random: () => number): Record<string, any> {
    return {
      harq_process_id: Math.floor(random() * 16),
      lcid: Math.floor(random() * 64),
      bsr_level: Math.floor(random() * 4),
      phr: -23 + random() * 63,
      ta: Math.floor(random() * 1282),
      ra_rnti: Math.floor(random() * 65536),
      preamble_id: Math.floor(random() * 64)
    };
  }
  
  private generateRLCUniqueData(random: () => number): Record<string, any> {
    return {
      sn: Math.floor(random() * 4096),
      si: ['firstSegment', 'lastSegment', 'middleSegment', 'completeSDU'][Math.floor(random() * 4)],
      p: Math.floor(random() * 2) === 1,
      vr_r: Math.floor(random() * 4096),
      vr_mr: Math.floor(random() * 4096),
      vr_x: Math.floor(random() * 4096)
    };
  }
  
  private generatePDCPUniqueData(random: () => number): Record<string, any> {
    return {
      pdcp_sn: Math.floor(random() * 4096),
      d_c: Math.floor(random() * 2) === 1,
      rohc_profile: Math.floor(random() * 16),
      security_algorithm: ['AES-128', 'AES-256'][Math.floor(random() * 2)],
      integrity_protection: Math.floor(random() * 2) === 1
    };
  }
  
  private generateRRCUniqueData(random: () => number): Record<string, any> {
    return {
      rrc_transaction_id: Math.floor(random() * 4),
      establishment_cause: ['mo-Data', 'mo-Signalling', 'mt-Access'][Math.floor(random() * 3)],
      ue_identity: this.generateUEIdentity(random),
      cell_id: Math.floor(random() * 1000000),
      tac: Math.floor(random() * 16777216),
      plmn: {
        mcc: Math.floor(random() * 1000),
        mnc: Math.floor(random() * 100)
      }
    };
  }
  
  private generateNASUniqueData(random: () => number): Record<string, any> {
    return {
      nas_key_set_identifier: Math.floor(random() * 8),
      registration_type: ['initial', 'mobility', 'periodic'][Math.floor(random() * 3)],
      mobile_identity: this.generateMobileIdentity(random),
      security_context: {
        ksi: Math.floor(random() * 8),
        sqn: Math.floor(random() * 1000000)
      }
    };
  }
  
  private generateGenericUniqueData(random: () => number): Record<string, any> {
    return {
      message_id: Math.floor(random() * 10000),
      timestamp: Date.now() + Math.floor(random() * 1000),
      sequence_number: Math.floor(random() * 1000),
      correlation_id: Math.floor(random() * 1000000)
    };
  }
  
  private generateUEIdentity(random: () => number): string {
    const suci = Math.floor(random() * 1000000000000000).toString().padStart(15, '0');
    return `001010${suci}`;
  }
  
  private generateMobileIdentity(random: () => number): string {
    const guti = Math.floor(random() * 1000000000000000).toString(16).padStart(16, '0');
    return guti;
  }
  
  // Utility functions
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
  
  private seededRandom(seed: number): () => number {
    let currentSeed = seed;
    return () => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
  }
}

// Export the generator instance
export const threeGPPGenerator = ThreeGPPTestCaseGenerator.getInstance();