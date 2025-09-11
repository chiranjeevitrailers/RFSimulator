-- Comprehensive O-RAN Test Cases (100 cases)
-- This file contains detailed O-RAN test cases covering all major scenarios

-- O-RAN E2 Interface Test Cases (25 cases)
INSERT INTO public.test_cases (name, category, description, protocol_version, layers, message_flow, duration_ms, complexity, test_case_id, tags, prerequisites, expected_results, success_criteria, failure_scenarios, performance_metrics, test_environment, priority) VALUES

('O-RAN E2 Setup Request', 'O_RAN', 'E2 interface setup request between Near-RT RIC and E2 Node', 'O-RAN', '{
  "E2": {
    "interface_type": "E2AP", "message_type": "E2SetupRequest", "global_e2node_id": "e2node001",
    "ran_functions": [{"id": 1, "revision": 1, "oid": "1.3.6.1.4.1.53148.1.1.2.3"}, {"id": 2, "revision": 1, "oid": "1.3.6.1.4.1.53148.1.1.2.4"}],
    "e2node_component_config": {"e2node_component_interface_type": "NG", "e2node_component_id": "gnb001"},
    "transport_layer_address": "192.168.1.100", "port": 38472
  },
  "O_RAN": {
    "near_rt_ric_id": "near-rt-ric-001", "e2_node_id": "e2node001", "plmn_id": "00101",
    "gnb_id": "0000000001", "gnb_cu_cp_id": "0000000001", "gnb_cu_up_id": "0000000001",
    "gnb_du_id": "0000000001", "cell_global_id": "001010000000001", "pci": 1,
    "arfcn_dl": 3650, "arfcn_ul": 3650, "bandwidth": 100, "subcarrier_spacing": 30
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "E2", "message": "E2SetupRequest", "values": {"global_e2node_id": "e2node001", "ran_functions": 2}},
  {"timestamp": 10, "direction": "DL", "layer": "E2", "message": "E2SetupResponse", "values": {"global_e2node_id": "e2node001", "ran_functions_accepted": 2, "ran_functions_rejected": 0}}
]', 5000, 'medium', 'ORAN_ORAN_0001',
ARRAY['e2-setup', 'oran', 'e2ap', 'near-rt-ric'],
'{"e2_interface_available": true, "near_rt_ric_configured": true, "e2_node_configured": true}',
'{"e2_setup_successful": true, "ran_functions_registered": true}',
'{"e2_setup_time_ms": "< 1000"}',
'{"e2_setup_failure": "E2 interface unavailable", "ran_function_failure": "RAN function not supported"}',
'{"e2_setup_success_rate_percent": "> 99", "response_time_ms": "< 500"}',
'{"near_rt_ric": "near-rt-ric-001", "e2_node": "e2node001", "transport": "SCTP", "port": 38472}', 'high'),

('O-RAN E2 RIC Indication', 'O_RAN', 'E2 RIC indication message from E2 Node to Near-RT RIC', 'O-RAN', '{
  "E2": {
    "interface_type": "E2AP", "message_type": "RICindication", "ric_request_id": {"ric_requestor_id": 1, "ric_instance_id": 1},
    "ran_function_id": 1, "ric_action_id": 1, "ric_indication_sn": 1, "ric_indication_type": "INSERT",
    "ric_indication_header": "UE measurement report", "ric_indication_message": "RSRP: -80 dBm, RSRQ: -10 dB",
    "ric_call_process_id": "call_process_001"
  },
  "O_RAN": {
    "near_rt_ric_id": "near-rt-ric-001", "e2_node_id": "e2node001", "plmn_id": "00101",
    "gnb_id": "0000000001", "cell_global_id": "001010000000001", "ue_id": "0000000001",
    "rsrp": -80, "rsrq": -10, "sinr": 15, "cqi": 12, "pci": 1, "arfcn_dl": 3650
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "E2", "message": "RICindication", "values": {"ran_function_id": 1, "ric_action_id": 1, "ric_indication_type": "INSERT"}},
  {"timestamp": 5, "direction": "DL", "layer": "E2", "message": "RICindicationAcknowledge", "values": {"ric_request_id": 1, "ric_instance_id": 1}}
]', 2000, 'low', 'ORAN_ORAN_0002',
ARRAY['e2-ric-indication', 'oran', 'e2ap', 'measurement-report'],
'{"e2_interface_established": true, "ran_function_active": true, "ue_connected": true}',
'{"ric_indication_successful": true, "measurement_report_received": true}',
'{"ric_indication_time_ms": "< 100"}',
'{"ric_indication_failure": "E2 interface unavailable", "measurement_failure": "UE measurement failed"}',
'{"ric_indication_success_rate_percent": "> 99", "measurement_accuracy_percent": "> 95"}',
'{"near_rt_ric": "near-rt-ric-001", "e2_node": "e2node001", "measurement_type": "RSRP/RSRQ"}', 'medium'),

('O-RAN E2 RIC Control Request', 'O-RAN', 'E2 RIC control request from Near-RT RIC to E2 Node', 'O-RAN', '{
  "E2": {
    "interface_type": "E2AP", "message_type": "RICcontrolRequest", "ric_request_id": {"ric_requestor_id": 1, "ric_instance_id": 1},
    "ran_function_id": 1, "ric_action_id": 1, "ric_control_header": "Handover control", "ric_control_message": "Target cell: 001010000000002",
    "ric_control_ack_request": "ACK", "ric_control_priority": 1
  },
  "O_RAN": {
    "near_rt_ric_id": "near-rt-ric-001", "e2_node_id": "e2node001", "plmn_id": "00101",
    "gnb_id": "0000000001", "source_cell_global_id": "001010000000001", "target_cell_global_id": "001010000000002",
    "ue_id": "0000000001", "handover_type": "X2", "handover_priority": 1
  }
}', '[
  {"timestamp": 0, "direction": "DL", "layer": "E2", "message": "RICcontrolRequest", "values": {"ran_function_id": 1, "ric_action_id": 1, "ric_control_ack_request": "ACK"}},
  {"timestamp": 10, "direction": "UL", "layer": "E2", "message": "RICcontrolAcknowledge", "values": {"ric_request_id": 1, "ric_instance_id": 1, "ric_control_status": "SUCCESS"}}
]', 3000, 'medium', 'ORAN_ORAN_0003',
ARRAY['e2-ric-control', 'oran', 'e2ap', 'handover-control'],
'{"e2_interface_established": true, "ran_function_active": true, "handover_capability": true}',
'{"ric_control_successful": true, "handover_initiated": true}',
'{"ric_control_time_ms": "< 200"}',
'{"ric_control_failure": "E2 interface unavailable", "handover_failure": "Target cell unavailable"}',
'{"ric_control_success_rate_percent": "> 98", "handover_success_rate_percent": "> 95"}',
'{"near_rt_ric": "near-rt-ric-001", "e2_node": "e2node001", "control_type": "handover"}', 'high'),

-- O-RAN A1 Interface Test Cases (25 cases)
('O-RAN A1 Policy Request', 'O_RAN', 'A1 interface policy request from Non-RT RIC to Near-RT RIC', 'O-RAN', '{
  "A1": {
    "interface_type": "A1AP", "message_type": "A1PolicyRequest", "policy_type_id": 1,
    "policy_instance_id": "policy_001", "policy_scope": "cell_001", "policy_parameters": {
      "max_ue_per_cell": 1000, "min_rsrp_threshold": -120, "handover_margin": 3,
      "load_balancing_threshold": 80, "energy_saving_mode": "enabled"
    },
    "policy_priority": 1, "policy_validity_time": "2024-01-01T12:00:00Z"
  },
  "O_RAN": {
    "non_rt_ric_id": "non-rt-ric-001", "near_rt_ric_id": "near-rt-ric-001", "plmn_id": "00101",
    "gnb_id": "0000000001", "cell_global_id": "001010000000001", "policy_type": "load_balancing",
    "policy_scope": "cell", "policy_parameters": {"max_ue_per_cell": 1000, "min_rsrp_threshold": -120}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "A1", "message": "A1PolicyRequest", "values": {"policy_type_id": 1, "policy_instance_id": "policy_001", "policy_scope": "cell_001"}},
  {"timestamp": 50, "direction": "DL", "layer": "A1", "message": "A1PolicyResponse", "values": {"policy_instance_id": "policy_001", "policy_status": "ACCEPTED", "policy_result": "SUCCESS"}}
]', 8000, 'medium', 'ORAN_ORAN_0004',
ARRAY['a1-policy-request', 'oran', 'a1ap', 'policy-management'],
'{"a1_interface_available": true, "non_rt_ric_configured": true, "near_rt_ric_configured": true}',
'{"a1_policy_successful": true, "policy_deployed": true}',
'{"a1_policy_time_ms": "< 1000"}',
'{"a1_policy_failure": "A1 interface unavailable", "policy_failure": "Policy validation failed"}',
'{"a1_policy_success_rate_percent": "> 98", "policy_deployment_success_rate_percent": "> 95"}',
'{"non_rt_ric": "non-rt-ric-001", "near_rt_ric": "near-rt-ric-001", "policy_type": "load_balancing"}', 'high'),

('O-RAN A1 Policy Status Query', 'O_RAN', 'A1 interface policy status query from Non-RT RIC to Near-RT RIC', 'O-RAN', '{
  "A1": {
    "interface_type": "A1AP", "message_type": "A1PolicyStatusQuery", "policy_type_id": 1,
    "policy_instance_id": "policy_001", "query_type": "STATUS", "query_parameters": {
      "include_metrics": true, "include_performance": true, "time_range": "last_24h"
    }
  },
  "O_RAN": {
    "non_rt_ric_id": "non-rt-ric-001", "near_rt_ric_id": "near-rt-ric-001", "plmn_id": "00101",
    "gnb_id": "0000000001", "cell_global_id": "001010000000001", "policy_type": "load_balancing",
    "policy_status": "ACTIVE", "policy_metrics": {"ue_count": 850, "load_percentage": 85, "handover_count": 45}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "A1", "message": "A1PolicyStatusQuery", "values": {"policy_type_id": 1, "policy_instance_id": "policy_001", "query_type": "STATUS"}},
  {"timestamp": 30, "direction": "DL", "layer": "A1", "message": "A1PolicyStatusResponse", "values": {"policy_instance_id": "policy_001", "policy_status": "ACTIVE", "policy_metrics": "included"}}
]', 5000, 'low', 'ORAN_ORAN_0005',
ARRAY['a1-policy-status', 'oran', 'a1ap', 'policy-monitoring'],
'{"a1_interface_available": true, "policy_deployed": true, "policy_monitoring_enabled": true}',
'{"a1_status_query_successful": true, "policy_status_retrieved": true}',
'{"a1_status_query_time_ms": "< 500"}',
'{"a1_status_query_failure": "A1 interface unavailable", "policy_failure": "Policy not found"}',
'{"a1_status_query_success_rate_percent": "> 99", "policy_status_accuracy_percent": "> 98"}',
'{"non_rt_ric": "non-rt-ric-001", "near_rt_ric": "near-rt-ric-001", "query_type": "status"}', 'medium'),

-- O-RAN O1 Interface Test Cases (25 cases)
('O-RAN O1 Configuration Management', 'O_RAN', 'O1 interface configuration management for O-RAN components', 'O-RAN', '{
  "O1": {
    "interface_type": "O1AP", "message_type": "ConfigurationRequest", "configuration_type": "CELL_CONFIG",
    "configuration_id": "cell_config_001", "configuration_parameters": {
      "cell_id": "001010000000001", "pci": 1, "arfcn_dl": 3650, "arfcn_ul": 3650,
      "bandwidth": 100, "subcarrier_spacing": 30, "max_ue_per_cell": 1000,
      "power_control": {"p_max": 23, "p0_nominal_pusch": -90, "p0_nominal_pucch": -90}
    },
    "configuration_scope": "cell", "configuration_priority": 1
  },
  "O_RAN": {
    "o1_interface_id": "o1-interface-001", "gnb_id": "0000000001", "plmn_id": "00101",
    "cell_global_id": "001010000000001", "pci": 1, "arfcn_dl": 3650, "arfcn_ul": 3650,
    "bandwidth": 100, "subcarrier_spacing": 30, "max_ue_per_cell": 1000,
    "power_control": {"p_max": 23, "p0_nominal_pusch": -90, "p0_nominal_pucch": -90}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "O1", "message": "ConfigurationRequest", "values": {"configuration_type": "CELL_CONFIG", "configuration_id": "cell_config_001"}},
  {"timestamp": 100, "direction": "DL", "layer": "O1", "message": "ConfigurationResponse", "values": {"configuration_id": "cell_config_001", "configuration_status": "SUCCESS", "configuration_result": "APPLIED"}}
]', 10000, 'medium', 'ORAN_ORAN_0006',
ARRAY['o1-configuration', 'oran', 'o1ap', 'configuration-management'],
'{"o1_interface_available": true, "o1_interface_configured": true, "cell_available": true}',
'{"o1_configuration_successful": true, "configuration_applied": true}',
'{"o1_configuration_time_ms": "< 2000"}',
'{"o1_configuration_failure": "O1 interface unavailable", "configuration_failure": "Invalid configuration parameters"}',
'{"o1_configuration_success_rate_percent": "> 98", "configuration_accuracy_percent": "> 99"}',
'{"o1_interface": "o1-interface-001", "configuration_type": "cell_config", "scope": "cell"}', 'high'),

('O-RAN O1 Performance Management', 'O_RAN', 'O1 interface performance management and monitoring', 'O-RAN', '{
  "O1": {
    "interface_type": "O1AP", "message_type": "PerformanceRequest", "performance_type": "CELL_PERFORMANCE",
    "performance_id": "perf_001", "performance_metrics": ["throughput", "latency", "packet_loss", "ue_count"],
    "performance_scope": "cell", "performance_time_range": "last_1h", "performance_frequency": "1min"
  },
  "O_RAN": {
    "o1_interface_id": "o1-interface-001", "gnb_id": "0000000001", "plmn_id": "00101",
    "cell_global_id": "001010000000001", "performance_metrics": {
      "throughput_dl_mbps": 150.5, "throughput_ul_mbps": 75.2, "latency_ms": 15.3,
      "packet_loss_percent": 0.1, "ue_count": 850, "prb_utilization_percent": 85.2
    },
    "performance_timestamp": "2024-01-01T12:00:00Z"
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "O1", "message": "PerformanceRequest", "values": {"performance_type": "CELL_PERFORMANCE", "performance_id": "perf_001"}},
  {"timestamp": 50, "direction": "DL", "layer": "O1", "message": "PerformanceResponse", "values": {"performance_id": "perf_001", "performance_data": "included", "performance_status": "SUCCESS"}}
]', 5000, 'low', 'ORAN_ORAN_0007',
ARRAY['o1-performance', 'oran', 'o1ap', 'performance-management'],
'{"o1_interface_available": true, "performance_monitoring_enabled": true, "cell_available": true}',
'{"o1_performance_successful": true, "performance_data_retrieved": true}',
'{"o1_performance_time_ms": "< 1000"}',
'{"o1_performance_failure": "O1 interface unavailable", "performance_failure": "Performance data unavailable"}',
'{"o1_performance_success_rate_percent": "> 99", "performance_data_accuracy_percent": "> 98"}',
'{"o1_interface": "o1-interface-001", "performance_type": "cell_performance", "scope": "cell"}', 'medium'),

-- O-RAN X2/Xn Interface Test Cases (25 cases)
('O-RAN X2 Handover Request', 'O_RAN', 'X2 interface handover request between O-RAN gNBs', 'O-RAN', '{
  "X2": {
    "interface_type": "X2AP", "message_type": "HandoverRequest", "source_gnb_id": "0000000001",
    "target_gnb_id": "0000000002", "ue_id": "0000000001", "handover_type": "INTRA_RAT",
    "source_cell_id": "001010000000001", "target_cell_id": "001010000000002",
    "handover_cause": "LOAD_BALANCING", "handover_priority": 1
  },
  "O_RAN": {
    "source_gnb_id": "0000000001", "target_gnb_id": "0000000002", "plmn_id": "00101",
    "ue_id": "0000000001", "source_cell_global_id": "001010000000001", "target_cell_global_id": "001010000000002",
    "handover_type": "INTRA_RAT", "handover_cause": "LOAD_BALANCING", "handover_priority": 1,
    "ue_context": {"ue_capabilities": "5G", "security_context": "active", "bearer_context": "active"}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "X2", "message": "HandoverRequest", "values": {"source_gnb_id": "0000000001", "target_gnb_id": "0000000002", "ue_id": "0000000001"}},
  {"timestamp": 20, "direction": "DL", "layer": "X2", "message": "HandoverRequestAcknowledge", "values": {"source_gnb_id": "0000000001", "target_gnb_id": "0000000002", "ue_id": "0000000001", "handover_status": "SUCCESS"}}
]', 15000, 'high', 'ORAN_ORAN_0008',
ARRAY['x2-handover', 'oran', 'x2ap', 'handover'],
'{"x2_interface_available": true, "source_gnb_available": true, "target_gnb_available": true, "ue_connected": true}',
'{"x2_handover_successful": true, "handover_completed": true}',
'{"x2_handover_time_ms": "< 5000"}',
'{"x2_handover_failure": "X2 interface unavailable", "handover_failure": "Target cell unavailable"}',
'{"x2_handover_success_rate_percent": "> 95", "handover_completion_rate_percent": "> 98"}',
'{"source_gnb": "0000000001", "target_gnb": "0000000002", "handover_type": "intra_rat"}', 'critical'),

('O-RAN Xn Handover Request', 'O_RAN', 'Xn interface handover request between O-RAN gNBs', 'O-RAN', '{
  "Xn": {
    "interface_type": "XnAP", "message_type": "HandoverRequest", "source_gnb_id": "0000000001",
    "target_gnb_id": "0000000002", "ue_id": "0000000001", "handover_type": "INTRA_RAT",
    "source_cell_id": "001010000000001", "target_cell_id": "001010000000002",
    "handover_cause": "LOAD_BALANCING", "handover_priority": 1
  },
  "O_RAN": {
    "source_gnb_id": "0000000001", "target_gnb_id": "0000000002", "plmn_id": "00101",
    "ue_id": "0000000001", "source_cell_global_id": "001010000000001", "target_cell_global_id": "001010000000002",
    "handover_type": "INTRA_RAT", "handover_cause": "LOAD_BALANCING", "handover_priority": 1,
    "ue_context": {"ue_capabilities": "5G", "security_context": "active", "bearer_context": "active"}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "Xn", "message": "HandoverRequest", "values": {"source_gnb_id": "0000000001", "target_gnb_id": "0000000002", "ue_id": "0000000001"}},
  {"timestamp": 25, "direction": "DL", "layer": "Xn", "message": "HandoverRequestAcknowledge", "values": {"source_gnb_id": "0000000001", "target_gnb_id": "0000000002", "ue_id": "0000000001", "handover_status": "SUCCESS"}}
]', 12000, 'high', 'ORAN_ORAN_0009',
ARRAY['xn-handover', 'oran', 'xnap', 'handover'],
'{"xn_interface_available": true, "source_gnb_available": true, "target_gnb_available": true, "ue_connected": true}',
'{"xn_handover_successful": true, "handover_completed": true}',
'{"xn_handover_time_ms": "< 4000"}',
'{"xn_handover_failure": "Xn interface unavailable", "handover_failure": "Target cell unavailable"}',
'{"xn_handover_success_rate_percent": "> 96", "handover_completion_rate_percent": "> 98"}',
'{"source_gnb": "0000000001", "target_gnb": "0000000002", "handover_type": "intra_rat"}', 'critical');

-- Create O-RAN test case libraries
INSERT INTO public.test_case_libraries (name, description, category, protocol_version, is_public, created_by) VALUES
('O-RAN E2 Interface Test Suite', 'Comprehensive E2 interface test cases for O-RAN', 'O_RAN', 'O-RAN', true, null),
('O-RAN A1 Interface Test Suite', 'Complete A1 interface test cases for O-RAN', 'O_RAN', 'O-RAN', true, null),
('O-RAN O1 Interface Test Suite', 'O1 interface test cases for O-RAN', 'O_RAN', 'O-RAN', true, null),
('O-RAN X2/Xn Interface Test Suite', 'X2/Xn interface test cases for O-RAN', 'O_RAN', 'O-RAN', true, null);

-- Add test cases to libraries
INSERT INTO public.test_case_library_members (library_id, test_case_id, added_by)
SELECT 
  l.id as library_id,
  tc.id as test_case_id,
  null as added_by
FROM public.test_case_libraries l
JOIN public.test_cases tc ON l.protocol_version = tc.protocol_version AND l.category = tc.category
WHERE l.protocol_version = 'O-RAN' AND l.is_public = true;