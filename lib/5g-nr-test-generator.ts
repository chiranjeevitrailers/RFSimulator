import { TestCase } from './test-cases';

export interface NRTestCaseTemplate {
  name: string;
  category: string;
  description: string;
  protocol_version: string;
  layers: any;
  message_flow: any[];
  duration_ms: number;
  complexity: 'low' | 'medium' | 'high';
  tags: string[];
  prerequisites: any;
  expected_results: any;
  success_criteria: any;
  failure_scenarios: any;
  performance_metrics: any;
  test_environment: any;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export class NRTestCaseGenerator {
  private static generateTestCaseId(category: string, index: number): string {
    const categoryPrefix = category.split('_').map(c => c.substring(0, 2)).join('');
    return `NR${categoryPrefix}_5G_NR_${index.toString().padStart(4, '0')}`;
  }

  private static generatePHYLayers(): any {
    return {
      "PHY": {
        "dl_arfcn": 3732480 + Math.floor(Math.random() * 1000),
        "ul_arfcn": 3732480 + Math.floor(Math.random() * 1000),
        "bandwidth": [20, 50, 100, 200][Math.floor(Math.random() * 4)],
        "subcarrier_spacing": [15, 30, 60, 120][Math.floor(Math.random() * 4)],
        "cp_type": "normal",
        "antenna_ports": [2, 4, 8][Math.floor(Math.random() * 3)],
        "pci": Math.floor(Math.random() * 1000),
        "ssb_periodicity": [5, 10, 20, 40, 80, 160][Math.floor(Math.random() * 6)],
        "prach_config": {
          "prach_root_sequence_index": Math.floor(Math.random() * 1000),
          "prach_zero_correlation_zone": Math.floor(Math.random() * 20),
          "prach_high_speed_flag": Math.random() > 0.5
        },
        "measurements": {
          "rsrp": -120 + Math.random() * 40,
          "rsrq": -20 + Math.random() * 10,
          "sinr": Math.random() * 30,
          "cqi": Math.floor(Math.random() * 15) + 1,
          "mcs": Math.floor(Math.random() * 28),
          "bler": Math.random() * 0.1,
          "throughput": Math.random() * 200
        }
      }
    };
  }

  private static generateMACLayers(): any {
    return {
      "MAC": {
        "harq_processes": {
          "active_processes": Math.floor(Math.random() * 16) + 1,
          "max_processes": 16,
          "process_0": {
            "status": "active",
            "rv": Math.floor(Math.random() * 4),
            "ndi": Math.floor(Math.random() * 2),
            "tbs": Math.floor(Math.random() * 2000) + 100
          }
        },
        "scheduling": {
          "dl_sched_interval": 1,
          "ul_sched_interval": 1,
          "sched_requests": Math.floor(Math.random() * 10),
          "buffer_status_reports": Math.floor(Math.random() * 5)
        },
        "random_access": {
          "ra_attempts": Math.floor(Math.random() * 5) + 1,
          "ra_success": Math.random() > 0.1,
          "ra_delay": Math.floor(Math.random() * 20),
          "preamble_id": Math.floor(Math.random() * 64)
        }
      }
    };
  }

  private static generateRLCLayers(): any {
    return {
      "RLC": {
        "am_mode": {
          "sn": Math.floor(Math.random() * 32),
          "vr_r": Math.floor(Math.random() * 32),
          "vr_mr": Math.floor(Math.random() * 32),
          "vr_x": Math.floor(Math.random() * 32),
          "vr_ms": Math.floor(Math.random() * 32),
          "vr_h": Math.floor(Math.random() * 32)
        },
        "um_mode": {
          "sn": Math.floor(Math.random() * 16),
          "vr_ur": Math.floor(Math.random() * 16),
          "vr_ux": Math.floor(Math.random() * 16)
        },
        "statistics": {
          "tx_pdus": Math.floor(Math.random() * 100),
          "rx_pdus": Math.floor(Math.random() * 100),
          "retransmissions": Math.floor(Math.random() * 10),
          "out_of_order": Math.floor(Math.random() * 5)
        }
      }
    };
  }

  private static generatePDCPLayers(): any {
    return {
      "PDCP": {
        "sequence_numbers": {
          "dl_sn": Math.floor(Math.random() * 4096),
          "ul_sn": Math.floor(Math.random() * 4096)
        },
        "security": {
          "encryption": ["AES-128", "AES-256", "SNOW-3G"][Math.floor(Math.random() * 3)],
          "integrity": ["AES-128", "AES-256", "SNOW-3G"][Math.floor(Math.random() * 3)],
          "key_refresh": Math.random() > 0.5
        },
        "statistics": {
          "tx_packets": Math.floor(Math.random() * 200),
          "rx_packets": Math.floor(Math.random() * 200),
          "dropped_packets": Math.floor(Math.random() * 10),
          "duplicate_packets": Math.floor(Math.random() * 5)
        }
      }
    };
  }

  private static generateRRCLayers(): any {
    return {
      "RRC": {
        "connection_state": ["RRC_IDLE", "RRC_CONNECTED", "RRC_INACTIVE"][Math.floor(Math.random() * 3)],
        "establishment_cause": ["mo-Data", "mo-Signalling", "mt-Access", "emergency"][Math.floor(Math.random() * 4)],
        "ue_identity": {
          "suci": "001010" + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0'),
          "supi": "001010" + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0'),
          "guti": Math.random().toString(36).substring(2, 18)
        },
        "cell_info": {
          "cell_id": Math.floor(Math.random() * 100000),
          "tac": Math.floor(Math.random() * 1000),
          "plmn": {
            "mcc": Math.floor(Math.random() * 1000),
            "mnc": Math.floor(Math.random() * 1000)
          }
        },
        "capabilities": {
          "nr_capabilities": true,
          "lte_capabilities": Math.random() > 0.5,
          "carrier_aggregation": Math.random() > 0.3,
          "mimo_capabilities": ["2x2", "4x4", "8x8"][Math.floor(Math.random() * 3)]
        }
      }
    };
  }

  private static generateNASLayers(): any {
    return {
      "NAS": {
        "registration_state": ["REGISTERED", "NOT_REGISTERED", "REGISTRATION_PENDING"][Math.floor(Math.random() * 3)],
        "registration_type": ["initial", "mobility", "periodic", "emergency"][Math.floor(Math.random() * 4)],
        "security_context": {
          "ksi": Math.floor(Math.random() * 7),
          "k_amf": Math.random().toString(36).substring(2, 18),
          "sqn": Math.floor(Math.random() * 100000)
        },
        "pdu_session": {
          "session_id": Math.floor(Math.random() * 16),
          "dnn": ["internet", "ims", "emergency"][Math.floor(Math.random() * 3)],
          "sst": Math.floor(Math.random() * 256),
          "sd": Math.floor(Math.random() * 16777216)
        }
      }
    };
  }

  // RRC Test Cases (50 cases)
  static generateRRCTestCases(): NRTestCaseTemplate[] {
    const testCases: NRTestCaseTemplate[] = [];
    
    // Initial Access and RRC Setup (10 cases)
    const initialAccessCases = [
      {
        name: "5G NR Initial Access - RRC Setup Request",
        description: "UE performs initial access and sends RRC Setup Request with establishment cause mo-Data",
        message_flow: [
          {"timestamp": 0, "direction": "UL", "layer": "PHY", "message": "PRACH Preamble Transmission", "values": {"preamble_id": 23, "power": 23}},
          {"timestamp": 5, "direction": "DL", "layer": "PHY", "message": "RAR (Random Access Response)", "values": {"ra_rnti": 17921, "ta": 31}},
          {"timestamp": 10, "direction": "UL", "layer": "RRC", "message": "RRC Setup Request", "values": {"establishment_cause": "mo-Data", "ue_identity": "001010123456789"}},
          {"timestamp": 15, "direction": "DL", "layer": "RRC", "message": "RRC Setup", "values": {"srb1_config": "configured"}},
          {"timestamp": 20, "direction": "UL", "layer": "RRC", "message": "RRC Setup Complete", "values": {"selected_plmn": "001-01"}}
        ],
        duration_ms: 30000,
        complexity: 'medium' as const,
        tags: ['initial-access', 'rrc-setup', 'random-access', 'establishment-cause'],
        priority: 'high' as const
      },
      {
        name: "5G NR RRC Connection Reconfiguration",
        description: "UE receives RRC Connection Reconfiguration to modify radio bearer configuration",
        message_flow: [
          {"timestamp": 0, "direction": "DL", "layer": "RRC", "message": "RRC Connection Reconfiguration", "values": {"radio_bearer_config": "modified"}},
          {"timestamp": 5, "direction": "UL", "layer": "RRC", "message": "RRC Connection Reconfiguration Complete", "values": {}}
        ],
        duration_ms: 5000,
        complexity: 'low' as const,
        tags: ['rrc-reconfiguration', 'radio-bearer', 'connected-mode'],
        priority: 'medium' as const
      }
    ];

    initialAccessCases.forEach((template, index) => {
      const layers = {
        ...this.generatePHYLayers(),
        ...this.generateMACLayers(),
        ...this.generateRLCLayers(),
        ...this.generatePDCPLayers(),
        ...this.generateRRCLayers()
      };

      testCases.push({
        ...template,
        category: '5G_NR_RRC',
        protocol_version: '5G NR',
        test_case_id: this.generateTestCaseId('5G_NR_RRC', index + 1),
        layers,
        prerequisites: {"network_available": true, "ue_powered_on": true, "sim_inserted": true},
        expected_results: {"rrc_connection_established": true, "srb1_configured": true, "ta_updated": true},
        success_criteria: {"rrc_setup_time_ms": "< 100", "random_access_time_ms": "< 50"},
        failure_scenarios: {"rrc_setup_failure": "RRC setup timeout", "random_access_failure": "PRACH failure"},
        performance_metrics: {"throughput_mbps": "> 100", "latency_ms": "< 10", "packet_loss_percent": "< 0.1"},
        test_environment: {"frequency_band": "n78", "bandwidth_mhz": 100, "duplex_mode": "TDD"}
      });
    });

    // Generate additional RRC test cases
    for (let i = 3; i <= 50; i++) {
      const rrcProcedures = [
        'Handover Preparation', 'RRC Connection Release', 'RRC Resume Request', 'RRC Reestablishment Request',
        'Measurement Configuration', 'Measurement Report', 'UE Capability Information', 'UE Information Request',
        'Security Mode Command', 'RRC Connection Reconfiguration', 'RRC Connection Setup', 'RRC Connection Reject',
        'RRC Connection Release', 'RRC Resume', 'RRC Reestablishment', 'RRC Reestablishment Reject',
        'UE Capability Enquiry', 'UE Capability Information', 'UE Information Request', 'UE Information Response',
        'Counter Check', 'Counter Check Response', 'UE Assistance Information', 'UE Assistance Information Response',
        'RRC Reconfiguration', 'RRC Reconfiguration Complete', 'RRC Reconfiguration Failure', 'RRC Reestablishment Request',
        'RRC Reestablishment', 'RRC Reestablishment Complete', 'RRC Reestablishment Reject', 'RRC Resume Request',
        'RRC Resume', 'RRC Resume Complete', 'RRC Resume Reject', 'RRC Setup Request', 'RRC Setup', 'RRC Setup Complete',
        'RRC Setup Reject', 'RRC Reject', 'RRC Release', 'RRC Release Complete', 'RRC Release Request', 'RRC Release Response',
        'RRC Release Indication', 'RRC Release Indication Response', 'RRC Release Indication Complete'
      ];

      const procedure = rrcProcedures[(i - 3) % rrcProcedures.length];
      const layers = {
        ...this.generatePHYLayers(),
        ...this.generateMACLayers(),
        ...this.generateRLCLayers(),
        ...this.generatePDCPLayers(),
        ...this.generateRRCLayers()
      };

      testCases.push({
        name: `5G NR ${procedure}`,
        category: '5G_NR_RRC',
        description: `UE performs ${procedure.toLowerCase()} procedure in 5G NR network`,
        protocol_version: '5G NR',
        test_case_id: this.generateTestCaseId('5G_NR_RRC', i),
        layers,
        message_flow: [
          {"timestamp": 0, "direction": "UL", "layer": "RRC", "message": procedure, "values": {"procedure_type": procedure.toLowerCase()}},
          {"timestamp": 10, "direction": "DL", "layer": "RRC", "message": `${procedure} Response`, "values": {"status": "success"}}
        ],
        duration_ms: Math.floor(Math.random() * 20000) + 5000,
        complexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        tags: [procedure.toLowerCase().replace(/\s+/g, '-'), 'rrc', 'connected-mode'],
        prerequisites: {"network_available": true, "ue_powered_on": true, "sim_inserted": true},
        expected_results: {"procedure_successful": true, "rrc_state_updated": true},
        success_criteria: {"procedure_time_ms": "< 1000", "success_rate_percent": "> 95"},
        failure_scenarios: {"procedure_failure": "Timeout", "invalid_configuration": "Configuration error"},
        performance_metrics: {"latency_ms": "< 50", "success_rate_percent": "> 95"},
        test_environment: {"frequency_band": "n78", "bandwidth_mhz": 100, "duplex_mode": "TDD"},
        priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical'
      });
    }

    return testCases;
  }

  // NAS Test Cases (50 cases)
  static generateNASTestCases(): NRTestCaseTemplate[] {
    const testCases: NRTestCaseTemplate[] = [];
    
    const nasProcedures = [
      'Initial Registration', 'Periodic Registration', 'Mobility Registration', 'Emergency Registration',
      'PDU Session Establishment', 'PDU Session Modification', 'PDU Session Release', 'Service Request',
      'Authentication Request', 'Authentication Response', 'Security Mode Command', 'Security Mode Complete',
      'Identity Request', 'Identity Response', 'Configuration Update Command', 'Configuration Update Complete',
      'UE Configuration Update', 'UE Configuration Update Complete', 'UE Configuration Update Failure',
      'UE Capability Information', 'UE Capability Information Response', 'UE Information Request',
      'UE Information Response', 'UE Information Failure', 'UE Assistance Information',
      'UE Assistance Information Response', 'UE Assistance Information Failure', 'UE Policy Association',
      'UE Policy Association Response', 'UE Policy Association Failure', 'UE Policy Disassociation',
      'UE Policy Disassociation Response', 'UE Policy Disassociation Failure', 'UE Policy Update',
      'UE Policy Update Response', 'UE Policy Update Failure', 'UE Policy Provisioning',
      'UE Policy Provisioning Response', 'UE Policy Provisioning Failure', 'UE Policy Retrieval',
      'UE Policy Retrieval Response', 'UE Policy Retrieval Failure', 'UE Policy Validation',
      'UE Policy Validation Response', 'UE Policy Validation Failure', 'UE Policy Enforcement',
      'UE Policy Enforcement Response', 'UE Policy Enforcement Failure', 'UE Policy Monitoring',
      'UE Policy Monitoring Response', 'UE Policy Monitoring Failure'
    ];

    for (let i = 1; i <= 50; i++) {
      const procedure = nasProcedures[(i - 1) % nasProcedures.length];
      const layers = {
        ...this.generatePDCPLayers(),
        ...this.generateRRCLayers(),
        ...this.generateNASLayers()
      };

      testCases.push({
        name: `5G NR ${procedure}`,
        category: '5G_NR_NAS',
        description: `UE performs ${procedure.toLowerCase()} procedure in 5G NR network`,
        protocol_version: '5G NR',
        test_case_id: this.generateTestCaseId('5G_NR_NAS', i),
        layers,
        message_flow: [
          {"timestamp": 0, "direction": "UL", "layer": "NAS", "message": procedure, "values": {"procedure_type": procedure.toLowerCase()}},
          {"timestamp": 100, "direction": "DL", "layer": "NAS", "message": `${procedure} Response`, "values": {"status": "success"}}
        ],
        duration_ms: Math.floor(Math.random() * 30000) + 5000,
        complexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        tags: [procedure.toLowerCase().replace(/\s+/g, '-'), 'nas', '5gmm'],
        prerequisites: {"network_available": true, "ue_powered_on": true, "sim_inserted": true},
        expected_results: {"procedure_successful": true, "nas_state_updated": true},
        success_criteria: {"procedure_time_ms": "< 5000", "success_rate_percent": "> 95"},
        failure_scenarios: {"procedure_failure": "Network rejection", "authentication_failure": "Invalid credentials"},
        performance_metrics: {"latency_ms": "< 100", "success_rate_percent": "> 95"},
        test_environment: {"frequency_band": "n78", "registration_type": "initial"},
        priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical'
      });
    }

    return testCases;
  }

  // PHY Test Cases (25 cases)
  static generatePHYTestCases(): NRTestCaseTemplate[] {
    const testCases: NRTestCaseTemplate[] = [];
    
    const phyProcedures = [
      'PRACH Preamble Transmission', 'RAR Reception', 'PUSCH Transmission', 'PDSCH Reception',
      'PUCCH Transmission', 'PDCCH Reception', 'SRS Transmission', 'CSI-RS Reception',
      'SSB Reception', 'PBCH Reception', 'PSS/SSS Reception', 'DMRS Transmission',
      'PTRS Transmission', 'PTRS Reception', 'TRS Reception', 'BWP Configuration',
      'Carrier Aggregation', 'MIMO Configuration', 'Beam Management', 'Power Control',
      'Timing Advance', 'Frequency Offset', 'Channel Estimation', 'Equalization',
      'Modulation/Demodulation'
    ];

    for (let i = 1; i <= 25; i++) {
      const procedure = phyProcedures[(i - 1) % phyProcedures.length];
      const layers = this.generatePHYLayers();

      testCases.push({
        name: `5G NR ${procedure}`,
        category: '5G_NR_PHY',
        description: `UE performs ${procedure.toLowerCase()} procedure in 5G NR physical layer`,
        protocol_version: '5G NR',
        test_case_id: this.generateTestCaseId('5G_NR_PHY', i),
        layers,
        message_flow: [
          {"timestamp": 0, "direction": "UL", "layer": "PHY", "message": procedure, "values": {"procedure_type": procedure.toLowerCase()}},
          {"timestamp": 1, "direction": "DL", "layer": "PHY", "message": `${procedure} Response`, "values": {"status": "success"}}
        ],
        duration_ms: Math.floor(Math.random() * 5000) + 1000,
        complexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        tags: [procedure.toLowerCase().replace(/\s+/g, '-'), 'phy', 'physical-layer'],
        prerequisites: {"network_available": true, "ue_powered_on": true, "rf_configured": true},
        expected_results: {"procedure_successful": true, "phy_parameters_updated": true},
        success_criteria: {"procedure_time_ms": "< 100", "success_rate_percent": "> 95"},
        failure_scenarios: {"procedure_failure": "PHY error", "rf_failure": "RF configuration error"},
        performance_metrics: {"latency_ms": "< 10", "success_rate_percent": "> 95"},
        test_environment: {"frequency_band": "n78", "bandwidth_mhz": 100, "subcarrier_spacing_khz": 30},
        priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical'
      });
    }

    return testCases;
  }

  // MAC Test Cases (25 cases)
  static generateMACTestCases(): NRTestCaseTemplate[] {
    const testCases: NRTestCaseTemplate[] = [];
    
    const macProcedures = [
      'HARQ Process Management', 'Scheduling Request', 'Buffer Status Report', 'Power Headroom Report',
      'Random Access Procedure', 'UL Grant Processing', 'DL Assignment Processing', 'HARQ ACK/NACK',
      'HARQ Retransmission', 'MAC PDU Construction', 'MAC PDU Deconstruction', 'Logical Channel Prioritization',
      'Multiplexing', 'Demultiplexing', 'Padding', 'MAC Control Element', 'MAC Header Processing',
      'MAC Payload Processing', 'MAC CRC Check', 'MAC Sequence Number', 'MAC Timing Advance',
      'MAC Power Control', 'MAC Beam Management', 'MAC Carrier Aggregation', 'MAC MIMO Configuration'
    ];

    for (let i = 1; i <= 25; i++) {
      const procedure = macProcedures[(i - 1) % macProcedures.length];
      const layers = {
        ...this.generatePHYLayers(),
        ...this.generateMACLayers()
      };

      testCases.push({
        name: `5G NR ${procedure}`,
        category: '5G_NR_MAC',
        description: `UE performs ${procedure.toLowerCase()} procedure in 5G NR MAC layer`,
        protocol_version: '5G NR',
        test_case_id: this.generateTestCaseId('5G_NR_MAC', i),
        layers,
        message_flow: [
          {"timestamp": 0, "direction": "UL", "layer": "MAC", "message": procedure, "values": {"procedure_type": procedure.toLowerCase()}},
          {"timestamp": 1, "direction": "DL", "layer": "MAC", "message": `${procedure} Response`, "values": {"status": "success"}}
        ],
        duration_ms: Math.floor(Math.random() * 3000) + 1000,
        complexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        tags: [procedure.toLowerCase().replace(/\s+/g, '-'), 'mac', 'medium-access-control'],
        prerequisites: {"network_available": true, "ue_powered_on": true, "mac_configured": true},
        expected_results: {"procedure_successful": true, "mac_parameters_updated": true},
        success_criteria: {"procedure_time_ms": "< 50", "success_rate_percent": "> 95"},
        failure_scenarios: {"procedure_failure": "MAC error", "scheduling_failure": "Scheduling error"},
        performance_metrics: {"latency_ms": "< 5", "success_rate_percent": "> 95"},
        test_environment: {"frequency_band": "n78", "bandwidth_mhz": 100, "duplex_mode": "TDD"},
        priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical'
      });
    }

    return testCases;
  }

  // Generate all 5G NR test cases
  static generateAllNRTestCases(): NRTestCaseTemplate[] {
    return [
      ...this.generateRRCTestCases(),
      ...this.generateNASTestCases(),
      ...this.generatePHYTestCases(),
      ...this.generateMACTestCases()
    ];
  }

  // Convert template to TestCase format
  static convertToTestCase(template: NRTestCaseTemplate): TestCase {
    return {
      id: '', // Will be generated by database
      name: template.name,
      category: template.category,
      description: template.description,
      protocol_version: template.protocol_version,
      layers: template.layers,
      message_flow: template.message_flow,
      duration_ms: template.duration_ms,
      complexity: template.complexity,
      test_case_id: template.test_case_id,
      tags: template.tags,
      prerequisites: template.prerequisites,
      expected_results: template.expected_results,
      success_criteria: template.success_criteria,
      failure_scenarios: template.failure_scenarios,
      performance_metrics: template.performance_metrics,
      test_environment: template.test_environment,
      is_active: true,
      priority: template.priority,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}