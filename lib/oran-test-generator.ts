import { TestCase } from './test-cases';

export interface ORANTestCaseTemplate {
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

export class ORANTestCaseGenerator {
  private static generateTestCaseId(category: string, index: number): string {
    const categoryPrefix = category.split('_').map(c => c.substring(0, 2)).join('');
    return `ORAN${categoryPrefix}_ORAN_${index.toString().padStart(4, '0')}`;
  }

  private static generateE2Layers(): any {
    return {
      "E2": {
        "interface_type": "E2AP",
        "message_type": ["E2SetupRequest", "E2SetupResponse", "RICindication", "RICcontrolRequest", "RICcontrolResponse", "E2ConnectionUpdate", "E2ConnectionUpdateAcknowledge"][Math.floor(Math.random() * 7)],
        "global_e2node_id": `e2node${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        "ran_functions": [
          {"id": Math.floor(Math.random() * 10) + 1, "revision": 1, "oid": `1.3.6.1.4.1.53148.1.1.2.${Math.floor(Math.random() * 10) + 1}`},
          {"id": Math.floor(Math.random() * 10) + 1, "revision": 1, "oid": `1.3.6.1.4.1.53148.1.1.2.${Math.floor(Math.random() * 10) + 1}`}
        ],
        "e2node_component_config": {
          "e2node_component_interface_type": ["NG", "Xn", "F1", "E1"][Math.floor(Math.random() * 4)],
          "e2node_component_id": `gnb${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        },
        "transport_layer_address": `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        "port": Math.floor(Math.random() * 10000) + 30000
      }
    };
  }

  private static generateA1Layers(): any {
    return {
      "A1": {
        "interface_type": "A1AP",
        "message_type": ["A1PolicyRequest", "A1PolicyResponse", "A1PolicyStatusQuery", "A1PolicyStatusResponse", "A1PolicyDelete", "A1PolicyDeleteResponse"][Math.floor(Math.random() * 6)],
        "policy_type_id": Math.floor(Math.random() * 10) + 1,
        "policy_instance_id": `policy_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        "policy_scope": `cell_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        "policy_parameters": {
          "max_ue_per_cell": Math.floor(Math.random() * 2000) + 500,
          "min_rsrp_threshold": Math.floor(Math.random() * 40) - 140,
          "handover_margin": Math.floor(Math.random() * 10) + 1,
          "load_balancing_threshold": Math.floor(Math.random() * 40) + 60,
          "energy_saving_mode": ["enabled", "disabled"][Math.floor(Math.random() * 2)]
        },
        "policy_priority": Math.floor(Math.random() * 5) + 1,
        "policy_validity_time": new Date().toISOString()
      }
    };
  }

  private static generateO1Layers(): any {
    return {
      "O1": {
        "interface_type": "O1AP",
        "message_type": ["ConfigurationRequest", "ConfigurationResponse", "PerformanceRequest", "PerformanceResponse", "FaultRequest", "FaultResponse"][Math.floor(Math.random() * 6)],
        "configuration_type": ["CELL_CONFIG", "GNB_CONFIG", "UE_CONFIG", "BEARER_CONFIG"][Math.floor(Math.random() * 4)],
        "configuration_id": `config_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        "configuration_parameters": {
          "cell_id": `${Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')}`,
          "pci": Math.floor(Math.random() * 1008) + 1,
          "arfcn_dl": Math.floor(Math.random() * 1000) + 3000,
          "arfcn_ul": Math.floor(Math.random() * 1000) + 3000,
          "bandwidth": [20, 50, 100, 200, 400][Math.floor(Math.random() * 5)],
          "subcarrier_spacing": [15, 30, 60, 120][Math.floor(Math.random() * 4)],
          "max_ue_per_cell": Math.floor(Math.random() * 2000) + 500,
          "power_control": {
            "p_max": Math.floor(Math.random() * 10) + 20,
            "p0_nominal_pusch": Math.floor(Math.random() * 20) - 100,
            "p0_nominal_pucch": Math.floor(Math.random() * 20) - 100
          }
        },
        "configuration_scope": ["cell", "gnb", "ue", "bearer"][Math.floor(Math.random() * 4)],
        "configuration_priority": Math.floor(Math.random() * 5) + 1
      }
    };
  }

  private static generateX2XnLayers(): any {
    return {
      "X2": {
        "interface_type": "X2AP",
        "message_type": ["HandoverRequest", "HandoverRequestAcknowledge", "HandoverPreparationFailure", "HandoverCancel", "HandoverCancelAcknowledge"][Math.floor(Math.random() * 5)],
        "source_gnb_id": `${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
        "target_gnb_id": `${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
        "ue_id": `${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
        "handover_type": ["INTRA_RAT", "INTER_RAT", "INTRA_FREQ", "INTER_FREQ"][Math.floor(Math.random() * 4)],
        "source_cell_id": `${Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')}`,
        "target_cell_id": `${Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')}`,
        "handover_cause": ["LOAD_BALANCING", "COVERAGE", "INTERFERENCE", "MOBILITY"][Math.floor(Math.random() * 4)],
        "handover_priority": Math.floor(Math.random() * 5) + 1
      }
    };
  }

  private static generateORANLayers(): any {
    return {
      "O_RAN": {
        "near_rt_ric_id": `near-rt-ric-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        "non_rt_ric_id": `non-rt-ric-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        "e2_node_id": `e2node${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        "o1_interface_id": `o1-interface-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        "plmn_id": `${Math.floor(Math.random() * 1000).toString().padStart(5, '0')}`,
        "gnb_id": `${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
        "gnb_cu_cp_id": `${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
        "gnb_cu_up_id": `${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
        "gnb_du_id": `${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
        "cell_global_id": `${Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')}`,
        "pci": Math.floor(Math.random() * 1008) + 1,
        "arfcn_dl": Math.floor(Math.random() * 1000) + 3000,
        "arfcn_ul": Math.floor(Math.random() * 1000) + 3000,
        "bandwidth": [20, 50, 100, 200, 400][Math.floor(Math.random() * 5)],
        "subcarrier_spacing": [15, 30, 60, 120][Math.floor(Math.random() * 4)],
        "ue_id": `${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
        "rsrp": Math.floor(Math.random() * 60) - 120,
        "rsrq": Math.floor(Math.random() * 20) - 20,
        "sinr": Math.floor(Math.random() * 30) + 5,
        "cqi": Math.floor(Math.random() * 15) + 1
      }
    };
  }

  // E2 Interface Test Cases (25 cases)
  static generateE2InterfaceTestCases(): ORANTestCaseTemplate[] {
    const testCases: ORANTestCaseTemplate[] = [];
    
    const e2Procedures = [
      'E2 Setup Request', 'E2 Setup Response', 'E2 Connection Update', 'E2 Connection Update Acknowledge',
      'RIC Indication', 'RIC Control Request', 'RIC Control Response', 'RIC Subscription Request',
      'RIC Subscription Response', 'RIC Subscription Delete Request', 'RIC Subscription Delete Response',
      'RIC Indication Failure', 'RIC Control Failure', 'E2 Setup Failure', 'E2 Connection Update Failure',
      'RIC Service Query', 'RIC Service Update', 'RIC Service Update Acknowledge', 'RIC Service Update Failure',
      'RIC Indication Acknowledge', 'RIC Control Acknowledge', 'RIC Indication Reject', 'RIC Control Reject',
      'E2 Node Configuration Update', 'E2 Node Configuration Update Acknowledge', 'E2 Node Configuration Update Failure'
    ];

    for (let i = 1; i <= 25; i++) {
      const procedure = e2Procedures[(i - 1) % e2Procedures.length];
      const layers = {
        ...this.generateE2Layers(),
        ...this.generateORANLayers()
      };

      testCases.push({
        name: `O-RAN ${procedure}`,
        category: 'O_RAN',
        description: `O-RAN E2 interface ${procedure.toLowerCase()} procedure`,
        protocol_version: 'O-RAN',
        test_case_id: this.generateTestCaseId('O_RAN', i),
        layers,
        message_flow: [
          {"timestamp": 0, "direction": "UL", "layer": "E2", "message": layers.E2.message_type, "values": {"global_e2node_id": layers.E2.global_e2node_id, "ran_functions": layers.E2.ran_functions.length}},
          {"timestamp": 10, "direction": "DL", "layer": "E2", "message": layers.E2.message_type.replace("Request", "Response"), "values": {"global_e2node_id": layers.E2.global_e2node_id, "status": "SUCCESS"}}
        ],
        duration_ms: Math.floor(Math.random() * 10000) + 2000,
        complexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        tags: [procedure.toLowerCase().replace(/\s+/g, '-'), 'e2-interface', 'oran'],
        prerequisites: {"e2_interface_available": true, "near_rt_ric_configured": true, "e2_node_configured": true},
        expected_results: {"e2_procedure_successful": true, "interface_established": true},
        success_criteria: {"e2_procedure_time_ms": "< 1000", "success_rate_percent": "> 95"},
        failure_scenarios: {"e2_procedure_failure": "E2 interface unavailable", "configuration_failure": "E2 node configuration failed"},
        performance_metrics: {"e2_procedure_success_rate_percent": "> 99", "response_time_ms": "< 500"},
        test_environment: {"near_rt_ric": layers.O_RAN.near_rt_ric_id, "e2_node": layers.O_RAN.e2_node_id, "transport": "SCTP", "port": layers.E2.port},
        priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical'
      });
    }

    return testCases;
  }

  // A1 Interface Test Cases (25 cases)
  static generateA1InterfaceTestCases(): ORANTestCaseTemplate[] {
    const testCases: ORANTestCaseTemplate[] = [];
    
    const a1Procedures = [
      'A1 Policy Request', 'A1 Policy Response', 'A1 Policy Status Query', 'A1 Policy Status Response',
      'A1 Policy Delete', 'A1 Policy Delete Response', 'A1 Policy Update', 'A1 Policy Update Response',
      'A1 Policy Validation', 'A1 Policy Validation Response', 'A1 Policy Deployment', 'A1 Policy Deployment Response',
      'A1 Policy Monitoring', 'A1 Policy Monitoring Response', 'A1 Policy Rollback', 'A1 Policy Rollback Response',
      'A1 Policy Conflict Resolution', 'A1 Policy Conflict Resolution Response', 'A1 Policy Optimization', 'A1 Policy Optimization Response',
      'A1 Policy Compliance Check', 'A1 Policy Compliance Check Response', 'A1 Policy Performance Analysis', 'A1 Policy Performance Analysis Response',
      'A1 Policy Lifecycle Management'
    ];

    for (let i = 1; i <= 25; i++) {
      const procedure = a1Procedures[(i - 1) % a1Procedures.length];
      const layers = {
        ...this.generateA1Layers(),
        ...this.generateORANLayers()
      };

      testCases.push({
        name: `O-RAN ${procedure}`,
        category: 'O_RAN',
        description: `O-RAN A1 interface ${procedure.toLowerCase()} procedure`,
        protocol_version: 'O-RAN',
        test_case_id: this.generateTestCaseId('O_RAN', i + 25),
        layers,
        message_flow: [
          {"timestamp": 0, "direction": "UL", "layer": "A1", "message": layers.A1.message_type, "values": {"policy_type_id": layers.A1.policy_type_id, "policy_instance_id": layers.A1.policy_instance_id}},
          {"timestamp": 50, "direction": "DL", "layer": "A1", "message": layers.A1.message_type.replace("Request", "Response"), "values": {"policy_instance_id": layers.A1.policy_instance_id, "policy_status": "SUCCESS"}}
        ],
        duration_ms: Math.floor(Math.random() * 15000) + 5000,
        complexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        tags: [procedure.toLowerCase().replace(/\s+/g, '-'), 'a1-interface', 'oran'],
        prerequisites: {"a1_interface_available": true, "non_rt_ric_configured": true, "near_rt_ric_configured": true},
        expected_results: {"a1_procedure_successful": true, "policy_managed": true},
        success_criteria: {"a1_procedure_time_ms": "< 2000", "success_rate_percent": "> 95"},
        failure_scenarios: {"a1_procedure_failure": "A1 interface unavailable", "policy_failure": "Policy validation failed"},
        performance_metrics: {"a1_procedure_success_rate_percent": "> 98", "policy_deployment_success_rate_percent": "> 95"},
        test_environment: {"non_rt_ric": layers.O_RAN.non_rt_ric_id, "near_rt_ric": layers.O_RAN.near_rt_ric_id, "policy_type": "load_balancing"},
        priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical'
      });
    }

    return testCases;
  }

  // O1 Interface Test Cases (25 cases)
  static generateO1InterfaceTestCases(): ORANTestCaseTemplate[] {
    const testCases: ORANTestCaseTemplate[] = [];
    
    const o1Procedures = [
      'O1 Configuration Management', 'O1 Performance Management', 'O1 Fault Management', 'O1 Security Management',
      'O1 Network Management', 'O1 Service Management', 'O1 Resource Management', 'O1 Quality Management',
      'O1 Capacity Management', 'O1 Availability Management', 'O1 Continuity Management', 'O1 Compliance Management',
      'O1 Risk Management', 'O1 Change Management', 'O1 Release Management', 'O1 Configuration Management',
      'O1 Service Level Management', 'O1 Supplier Management', 'O1 Incident Management', 'O1 Problem Management',
      'O1 Access Management', 'O1 Identity Management', 'O1 Event Management', 'O1 Request Fulfillment',
      'O1 Knowledge Management'
    ];

    for (let i = 1; i <= 25; i++) {
      const procedure = o1Procedures[(i - 1) % o1Procedures.length];
      const layers = {
        ...this.generateO1Layers(),
        ...this.generateORANLayers()
      };

      testCases.push({
        name: `O-RAN ${procedure}`,
        category: 'O_RAN',
        description: `O-RAN O1 interface ${procedure.toLowerCase()} procedure`,
        protocol_version: 'O-RAN',
        test_case_id: this.generateTestCaseId('O_RAN', i + 50),
        layers,
        message_flow: [
          {"timestamp": 0, "direction": "UL", "layer": "O1", "message": layers.O1.message_type, "values": {"configuration_type": layers.O1.configuration_type, "configuration_id": layers.O1.configuration_id}},
          {"timestamp": 100, "direction": "DL", "layer": "O1", "message": layers.O1.message_type.replace("Request", "Response"), "values": {"configuration_id": layers.O1.configuration_id, "configuration_status": "SUCCESS"}}
        ],
        duration_ms: Math.floor(Math.random() * 20000) + 5000,
        complexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        tags: [procedure.toLowerCase().replace(/\s+/g, '-'), 'o1-interface', 'oran'],
        prerequisites: {"o1_interface_available": true, "o1_interface_configured": true, "cell_available": true},
        expected_results: {"o1_procedure_successful": true, "configuration_applied": true},
        success_criteria: {"o1_procedure_time_ms": "< 3000", "success_rate_percent": "> 95"},
        failure_scenarios: {"o1_procedure_failure": "O1 interface unavailable", "configuration_failure": "Invalid configuration parameters"},
        performance_metrics: {"o1_procedure_success_rate_percent": "> 98", "configuration_accuracy_percent": "> 99"},
        test_environment: {"o1_interface": layers.O_RAN.o1_interface_id, "configuration_type": layers.O1.configuration_type, "scope": layers.O1.configuration_scope},
        priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical'
      });
    }

    return testCases;
  }

  // X2/Xn Interface Test Cases (25 cases)
  static generateX2XnInterfaceTestCases(): ORANTestCaseTemplate[] {
    const testCases: ORANTestCaseTemplate[] = [];
    
    const x2XnProcedures = [
      'X2 Handover Request', 'X2 Handover Request Acknowledge', 'X2 Handover Preparation Failure', 'X2 Handover Cancel',
      'X2 Handover Cancel Acknowledge', 'Xn Handover Request', 'Xn Handover Request Acknowledge', 'Xn Handover Preparation Failure',
      'Xn Handover Cancel', 'Xn Handover Cancel Acknowledge', 'X2 Load Information', 'X2 Load Information Response',
      'Xn Load Information', 'Xn Load Information Response', 'X2 Resource Status Request', 'X2 Resource Status Response',
      'Xn Resource Status Request', 'Xn Resource Status Response', 'X2 Handover Report', 'X2 Handover Report Acknowledge',
      'Xn Handover Report', 'Xn Handover Report Acknowledge', 'X2 Mobility Change Request', 'X2 Mobility Change Request Acknowledge',
      'Xn Mobility Change Request', 'Xn Mobility Change Request Acknowledge'
    ];

    for (let i = 1; i <= 25; i++) {
      const procedure = x2XnProcedures[(i - 1) % x2XnProcedures.length];
      const layers = {
        ...this.generateX2XnLayers(),
        ...this.generateORANLayers()
      };

      testCases.push({
        name: `O-RAN ${procedure}`,
        category: 'O_RAN',
        description: `O-RAN ${procedure.toLowerCase()} procedure`,
        protocol_version: 'O-RAN',
        test_case_id: this.generateTestCaseId('O_RAN', i + 75),
        layers,
        message_flow: [
          {"timestamp": 0, "direction": "UL", "layer": "X2", "message": layers.X2.message_type, "values": {"source_gnb_id": layers.X2.source_gnb_id, "target_gnb_id": layers.X2.target_gnb_id, "ue_id": layers.X2.ue_id}},
          {"timestamp": 20, "direction": "DL", "layer": "X2", "message": layers.X2.message_type.replace("Request", "Acknowledge"), "values": {"source_gnb_id": layers.X2.source_gnb_id, "target_gnb_id": layers.X2.target_gnb_id, "ue_id": layers.X2.ue_id, "status": "SUCCESS"}}
        ],
        duration_ms: Math.floor(Math.random() * 25000) + 5000,
        complexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        tags: [procedure.toLowerCase().replace(/\s+/g, '-'), 'x2-xn-interface', 'oran'],
        prerequisites: {"x2_xn_interface_available": true, "source_gnb_available": true, "target_gnb_available": true, "ue_connected": true},
        expected_results: {"x2_xn_procedure_successful": true, "handover_completed": true},
        success_criteria: {"x2_xn_procedure_time_ms": "< 5000", "success_rate_percent": "> 95"},
        failure_scenarios: {"x2_xn_procedure_failure": "X2/Xn interface unavailable", "handover_failure": "Target cell unavailable"},
        performance_metrics: {"x2_xn_procedure_success_rate_percent": "> 95", "handover_completion_rate_percent": "> 98"},
        test_environment: {"source_gnb": layers.X2.source_gnb_id, "target_gnb": layers.X2.target_gnb_id, "handover_type": layers.X2.handover_type},
        priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical'
      });
    }

    return testCases;
  }

  // Generate all O-RAN test cases
  static generateAllORANTestCases(): ORANTestCaseTemplate[] {
    return [
      ...this.generateE2InterfaceTestCases(),
      ...this.generateA1InterfaceTestCases(),
      ...this.generateO1InterfaceTestCases(),
      ...this.generateX2XnInterfaceTestCases()
    ];
  }

  // Convert template to TestCase format
  static convertToTestCase(template: ORANTestCaseTemplate): TestCase {
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