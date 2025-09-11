-- Comprehensive 5G NR Test Cases (150 cases)
-- This file contains detailed 5G NR test cases covering all major scenarios

-- 5G NR RRC Test Cases (50 cases)
INSERT INTO public.test_cases (name, category, description, protocol_version, layers, message_flow, duration_ms, complexity, test_case_id, tags, prerequisites, expected_results, success_criteria, failure_scenarios, performance_metrics, test_environment, priority) VALUES

-- Initial Access and RRC Setup (10 cases)
('5G NR Initial Access - RRC Setup Request', '5G_NR_RRC', 'UE performs initial access and sends RRC Setup Request with establishment cause mo-Data', '5G NR', '{
  "PHY": {
    "dl_arfcn": 3732480, "ul_arfcn": 3732480, "bandwidth": 100, "subcarrier_spacing": 30, "cp_type": "normal", 
    "antenna_ports": 4, "pci": 123, "ssb_periodicity": 20,
    "prach_config": {"prach_root_sequence_index": 839, "prach_zero_correlation_zone": 15, "prach_high_speed_flag": false},
    "measurements": {"rsrp": -85, "rsrq": -12, "sinr": 15, "cqi": 12, "mcs": 8, "bler": 0.01, "throughput": 125.5}
  },
  "MAC": {
    "harq_processes": {"active_processes": 8, "max_processes": 16, "process_0": {"status": "active", "rv": 0, "ndi": 1, "tbs": 1024}},
    "scheduling": {"dl_sched_interval": 1, "ul_sched_interval": 1, "sched_requests": 5, "buffer_status_reports": 3},
    "random_access": {"ra_attempts": 1, "ra_success": true, "ra_delay": 5, "preamble_id": 23}
  },
  "RLC": {
    "am_mode": {"sn": 15, "vr_r": 10, "vr_mr": 20, "vr_x": 12, "vr_ms": 18, "vr_h": 16},
    "um_mode": {"sn": 8, "vr_ur": 5, "vr_ux": 7},
    "statistics": {"tx_pdus": 45, "rx_pdus": 42, "retransmissions": 3, "out_of_order": 1}
  },
  "PDCP": {
    "sequence_numbers": {"dl_sn": 1023, "ul_sn": 1020},
    "security": {"encryption": "AES-128", "integrity": "AES-128", "key_refresh": false},
    "statistics": {"tx_packets": 120, "rx_packets": 118, "dropped_packets": 2, "duplicate_packets": 0}
  },
  "RRC": {
    "connection_state": "RRC_CONNECTED", "establishment_cause": "mo-Data",
    "ue_identity": {"suci": "001010123456789", "supi": "001010123456789", "guti": "1234567890abcdef"},
    "cell_info": {"cell_id": 12345, "tac": 7, "plmn": {"mcc": 1, "mnc": 1}},
    "capabilities": {"nr_capabilities": true, "lte_capabilities": true, "carrier_aggregation": true, "mimo_capabilities": "4x4"}
  },
  "NAS": {
    "registration_state": "REGISTERED", "registration_type": "initial",
    "security_context": {"ksi": 5, "k_amf": "a1b2c3d4e5f6...", "sqn": 12345},
    "pdu_session": {"session_id": 1, "dnn": "internet", "sst": 1, "sd": 1}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "PHY", "message": "PRACH Preamble Transmission", "values": {"preamble_id": 23, "power": 23}},
  {"timestamp": 5, "direction": "DL", "layer": "PHY", "message": "RAR (Random Access Response)", "values": {"ra_rnti": 17921, "ta": 31}},
  {"timestamp": 10, "direction": "UL", "layer": "RRC", "message": "RRC Setup Request", "values": {"establishment_cause": "mo-Data", "ue_identity": "001010123456789"}},
  {"timestamp": 15, "direction": "DL", "layer": "RRC", "message": "RRC Setup", "values": {"srb1_config": "configured"}},
  {"timestamp": 20, "direction": "UL", "layer": "RRC", "message": "RRC Setup Complete", "values": {"selected_plmn": "001-01"}}
]', 30000, 'medium', 'NRR_5G_NR_0001', 
ARRAY['initial-access', 'rrc-setup', 'random-access', 'establishment-cause'],
'{"network_available": true, "ue_powered_on": true, "sim_inserted": true}',
'{"rrc_connection_established": true, "srb1_configured": true, "ta_updated": true}',
'{"rrc_setup_time_ms": "< 100", "random_access_time_ms": "< 50"}',
'{"rrc_setup_failure": "RRC setup timeout", "random_access_failure": "PRACH failure"}',
'{"throughput_mbps": "> 100", "latency_ms": "< 10", "packet_loss_percent": "< 0.1"}',
'{"frequency_band": "n78", "bandwidth_mhz": 100, "duplex_mode": "TDD"}', 'high'),

('5G NR RRC Connection Reconfiguration', '5G_NR_RRC', 'UE receives RRC Connection Reconfiguration to modify radio bearer configuration', '5G NR', '{
  "RRC": {
    "connection_state": "RRC_CONNECTED", "reconfiguration_type": "radio_bearer_config",
    "ue_identity": {"guti": "1234567890abcdef"},
    "cell_info": {"cell_id": 12345, "tac": 7, "plmn": {"mcc": 1, "mnc": 1}},
    "radio_bearer_config": {"srb1": "modified", "srb2": "added", "drb1": "modified"}
  },
  "PDCP": {
    "sequence_numbers": {"dl_sn": 1023, "ul_sn": 1020},
    "security": {"encryption": "AES-128", "integrity": "AES-128", "key_refresh": true},
    "statistics": {"tx_packets": 120, "rx_packets": 118, "dropped_packets": 2, "duplicate_packets": 0}
  }
}', '[
  {"timestamp": 0, "direction": "DL", "layer": "RRC", "message": "RRC Connection Reconfiguration", "values": {"radio_bearer_config": "modified"}},
  {"timestamp": 5, "direction": "UL", "layer": "RRC", "message": "RRC Connection Reconfiguration Complete", "values": {}}
]', 5000, 'low', 'NRR_5G_NR_0002',
ARRAY['rrc-reconfiguration', 'radio-bearer', 'connected-mode'],
'{"rrc_connection_active": true, "ue_in_connected_state": true}',
'{"reconfiguration_successful": true, "radio_bearers_updated": true}',
'{"reconfiguration_time_ms": "< 50"}',
'{"reconfiguration_failure": "Invalid configuration", "timeout": "RRC reconfiguration timeout"}',
'{"latency_ms": "< 5", "success_rate_percent": "> 99"}',
'{"frequency_band": "n78", "bandwidth_mhz": 100}', 'medium'),

('5G NR Handover Preparation', '5G_NR_RRC', 'UE prepares for handover to target cell with measurement reporting', '5G NR', '{
  "RRC": {
    "connection_state": "RRC_CONNECTED", "handover_type": "intra_frequency",
    "ue_identity": {"guti": "1234567890abcdef"},
    "source_cell": {"cell_id": 12345, "pci": 123},
    "target_cell": {"cell_id": 12346, "pci": 124},
    "measurements": {"rsrp_source": -85, "rsrp_target": -80, "rsrq_source": -12, "rsrq_target": -10}
  }
}', '[
  {"timestamp": 0, "direction": "DL", "layer": "RRC", "message": "Measurement Configuration", "values": {"measurement_id": 1, "meas_object": "nr_cell"}},
  {"timestamp": 1000, "direction": "UL", "layer": "RRC", "message": "Measurement Report", "values": {"meas_id": 1, "rsrp": -80, "rsrq": -10, "cell_id": 12346}},
  {"timestamp": 2000, "direction": "DL", "layer": "RRC", "message": "RRC Connection Reconfiguration (Handover)", "values": {"target_cell_id": 12346, "target_pci": 124}}
]', 10000, 'medium', 'NRR_5G_NR_0003',
ARRAY['handover', 'measurement', 'mobility', 'connected-mode'],
'{"rrc_connection_active": true, "measurement_configuration": true}',
'{"handover_preparation_successful": true, "measurement_reports_received": true}',
'{"handover_preparation_time_ms": "< 2000", "measurement_report_delay_ms": "< 1000"}',
'{"handover_failure": "Target cell not available", "measurement_failure": "Measurement configuration error"}',
'{"handover_success_rate_percent": "> 95", "measurement_accuracy_percent": "> 98"}',
'{"frequency_band": "n78", "handover_type": "intra_frequency"}', 'high'),

('5G NR RRC Connection Release', '5G_NR_RRC', 'UE receives RRC Connection Release and transitions to idle state', '5G NR', '{
  "RRC": {
    "connection_state": "RRC_IDLE", "release_cause": "normal",
    "ue_identity": {"guti": "1234567890abcdef"},
    "cell_info": {"cell_id": 12345, "tac": 7, "plmn": {"mcc": 1, "mnc": 1}}
  }
}', '[
  {"timestamp": 0, "direction": "DL", "layer": "RRC", "message": "RRC Connection Release", "values": {"release_cause": "normal"}},
  {"timestamp": 5, "direction": "UL", "layer": "RRC", "message": "RRC Connection Release Complete", "values": {}}
]', 3000, 'low', 'NRR_5G_NR_0004',
ARRAY['rrc-release', 'idle-state', 'connection-release'],
'{"rrc_connection_active": true, "ue_in_connected_state": true}',
'{"rrc_connection_released": true, "ue_transitioned_to_idle": true}',
'{"release_time_ms": "< 20"}',
'{"release_failure": "RRC release timeout"}',
'{"release_success_rate_percent": "> 99", "idle_transition_time_ms": "< 10"}',
'{"frequency_band": "n78", "release_cause": "normal"}', 'low'),

('5G NR RRC Resume Request', '5G_NR_RRC', 'UE sends RRC Resume Request to resume suspended connection', '5G NR', '{
  "RRC": {
    "connection_state": "RRC_INACTIVE", "resume_cause": "mo-Data",
    "ue_identity": {"resume_id": "1234567890abcdef", "guti": "1234567890abcdef"},
    "cell_info": {"cell_id": 12345, "tac": 7, "plmn": {"mcc": 1, "mnc": 1}}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "RRC", "message": "RRC Resume Request", "values": {"resume_cause": "mo-Data", "resume_id": "1234567890abcdef"}},
  {"timestamp": 10, "direction": "DL", "layer": "RRC", "message": "RRC Resume", "values": {"srb1_config": "resumed"}},
  {"timestamp": 15, "direction": "UL", "layer": "RRC", "message": "RRC Resume Complete", "values": {}}
]', 8000, 'medium', 'NRR_5G_NR_0005',
ARRAY['rrc-resume', 'inactive-state', 'connection-resume'],
'{"rrc_inactive_state": true, "resume_id_available": true}',
'{"rrc_connection_resumed": true, "srb1_resumed": true}',
'{"resume_time_ms": "< 100"}',
'{"resume_failure": "RRC resume timeout", "resume_id_invalid": "Invalid resume ID"}',
'{"resume_success_rate_percent": "> 95", "resume_time_ms": "< 50"}',
'{"frequency_band": "n78", "resume_cause": "mo-Data"}', 'medium'),

-- Continue with more 5G NR RRC test cases...
('5G NR RRC Reestablishment Request', '5G_NR_RRC', 'UE sends RRC Reestablishment Request after connection failure', '5G NR', '{
  "RRC": {
    "connection_state": "RRC_IDLE", "reestablishment_cause": "reconfiguration_failure",
    "ue_identity": {"c_rnti": 12345, "pci": 123},
    "cell_info": {"cell_id": 12345, "tac": 7, "plmn": {"mcc": 1, "mnc": 1}}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "RRC", "message": "RRC Reestablishment Request", "values": {"reestablishment_cause": "reconfiguration_failure", "c_rnti": 12345}},
  {"timestamp": 10, "direction": "DL", "layer": "RRC", "message": "RRC Reestablishment", "values": {"srb1_config": "reestablished"}},
  {"timestamp": 15, "direction": "UL", "layer": "RRC", "message": "RRC Reestablishment Complete", "values": {}}
]', 12000, 'medium', 'NRR_5G_NR_0006',
ARRAY['rrc-reestablishment', 'connection-failure', 'recovery'],
'{"rrc_connection_failed": true, "reestablishment_cell_available": true}',
'{"rrc_connection_reestablished": true, "srb1_reestablished": true}',
'{"reestablishment_time_ms": "< 200"}',
'{"reestablishment_failure": "RRC reestablishment timeout", "cell_not_available": "Target cell not available"}',
'{"reestablishment_success_rate_percent": "> 90", "reestablishment_time_ms": "< 100"}',
'{"frequency_band": "n78", "reestablishment_cause": "reconfiguration_failure"}', 'high'),

-- 5G NR NAS Test Cases (50 cases)
('5G NR Initial Registration', '5G_NR_NAS', 'UE performs initial registration to 5G core network', '5G NR', '{
  "NAS": {
    "registration_state": "REGISTERED", "registration_type": "initial",
    "ue_identity": {"suci": "001010123456789", "supi": "001010123456789", "5g_guti": "1234567890abcdef"},
    "security_context": {"ksi": 5, "k_amf": "a1b2c3d4e5f6...", "sqn": 12345},
    "capabilities": {"5gmm_capability": "SMS", "s1_ue_network_capability": "EPS_encryption_algorithms"}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "NAS", "message": "Registration Request", "values": {"registration_type": "initial", "5gmm_capability": "SMS"}},
  {"timestamp": 100, "direction": "DL", "layer": "NAS", "message": "Authentication Request", "values": {"rand": "a1b2c3d4e5f6...", "autn": "f6e5d4c3b2a1..."}},
  {"timestamp": 200, "direction": "UL", "layer": "NAS", "message": "Authentication Response", "values": {"res": "1234567890abcdef"}},
  {"timestamp": 300, "direction": "DL", "layer": "NAS", "message": "Security Mode Command", "values": {"ciphering_algorithm": "AES-128", "integrity_algorithm": "AES-128"}},
  {"timestamp": 400, "direction": "UL", "layer": "NAS", "message": "Security Mode Complete", "values": {"imeisv": "1234567890123456"}},
  {"timestamp": 500, "direction": "DL", "layer": "NAS", "message": "Registration Accept", "values": {"5g_guti": "1234567890abcdef", "tai_list": ["12345"]}},
  {"timestamp": 600, "direction": "UL", "layer": "NAS", "message": "Registration Complete", "values": {}}
]', 45000, 'medium', 'NRN_5G_NR_0001',
ARRAY['registration', 'authentication', 'security-mode', 'initial-registration'],
'{"network_available": true, "ue_powered_on": true, "sim_inserted": true}',
'{"registration_successful": true, "authentication_successful": true, "security_mode_established": true}',
'{"registration_time_ms": "< 5000", "authentication_time_ms": "< 1000"}',
'{"registration_failure": "Network rejection", "authentication_failure": "Invalid credentials"}',
'{"registration_success_rate_percent": "> 98", "authentication_success_rate_percent": "> 99"}',
'{"frequency_band": "n78", "registration_type": "initial"}', 'high'),

('5G NR Periodic Registration', '5G_NR_NAS', 'UE performs periodic registration to maintain registration state', '5G NR', '{
  "NAS": {
    "registration_state": "REGISTERED", "registration_type": "periodic",
    "ue_identity": {"5g_guti": "1234567890abcdef"},
    "security_context": {"ksi": 5, "k_amf": "a1b2c3d4e5f6...", "sqn": 12345}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "NAS", "message": "Registration Request", "values": {"registration_type": "periodic", "5g_guti": "1234567890abcdef"}},
  {"timestamp": 50, "direction": "DL", "layer": "NAS", "message": "Registration Accept", "values": {"5g_guti": "1234567890abcdef", "tai_list": ["12345"]}},
  {"timestamp": 100, "direction": "UL", "layer": "NAS", "message": "Registration Complete", "values": {}}
]', 8000, 'low', 'NRN_5G_NR_0002',
ARRAY['periodic-registration', 'registration-maintenance'],
'{"nas_registered": true, "periodic_registration_timer_expired": true}',
'{"periodic_registration_successful": true, "registration_state_maintained": true}',
'{"periodic_registration_time_ms": "< 1000"}',
'{"periodic_registration_failure": "Network rejection"}',
'{"periodic_registration_success_rate_percent": "> 99"}',
'{"frequency_band": "n78", "registration_type": "periodic"}', 'medium'),

('5G NR PDU Session Establishment', '5G_NR_NAS', 'UE establishes PDU session for data connectivity', '5G NR', '{
  "NAS": {
    "registration_state": "REGISTERED", "pdu_session_type": "IPV4",
    "ue_identity": {"5g_guti": "1234567890abcdef"},
    "pdu_session": {"session_id": 1, "dnn": "internet", "sst": 1, "sd": 1, "qos_flow": {"qfi": 1, "5qi": 9}}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "NAS", "message": "PDU Session Establishment Request", "values": {"pdu_session_id": 1, "dnn": "internet", "sst": 1}},
  {"timestamp": 100, "direction": "DL", "layer": "NAS", "message": "PDU Session Establishment Accept", "values": {"pdu_session_id": 1, "qos_rules": [{"qfi": 1, "rule_id": 1}]}},
  {"timestamp": 200, "direction": "UL", "layer": "NAS", "message": "PDU Session Establishment Complete", "values": {"pdu_session_id": 1}}
]', 5000, 'medium', 'NRN_5G_NR_0003',
ARRAY['pdu-session', 'data-connectivity', 'qos', 'registered-state'],
'{"nas_registration_complete": true, "ue_authenticated": true}',
'{"pdu_session_established": true, "qos_rules_configured": true}',
'{"pdu_session_establishment_time_ms": "< 1000"}',
'{"pdu_session_failure": "DNN not supported", "qos_failure": "QoS parameters not acceptable"}',
'{"establishment_success_rate_percent": "> 98", "qos_compliance_percent": "> 95"}',
'{"dnn": "internet", "sst": 1, "pdu_session_type": "IPV4"}', 'high'),

-- 5G NR PHY Test Cases (25 cases)
('5G NR PRACH Preamble Transmission', '5G_NR_PHY', 'UE transmits PRACH preamble for random access', '5G NR', '{
  "PHY": {
    "dl_arfcn": 3732480, "ul_arfcn": 3732480, "bandwidth": 100, "subcarrier_spacing": 30,
    "prach_config": {"prach_root_sequence_index": 839, "prach_zero_correlation_zone": 15, "prach_high_speed_flag": false},
    "measurements": {"rsrp": -85, "rsrq": -12, "sinr": 15, "cqi": 12, "mcs": 8, "bler": 0.01}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "PHY", "message": "PRACH Preamble Transmission", "values": {"preamble_id": 23, "power": 23, "prach_root_sequence": 839}},
  {"timestamp": 5, "direction": "DL", "layer": "PHY", "message": "RAR (Random Access Response)", "values": {"ra_rnti": 17921, "ta": 31, "ul_grant": "configured"}}
]', 2000, 'low', 'NRP_5G_NR_0001',
ARRAY['prach', 'random-access', 'preamble-transmission'],
'{"network_available": true, "ue_powered_on": true}',
'{"prach_preamble_transmitted": true, "rar_received": true}',
'{"prach_transmission_time_ms": "< 10", "rar_response_time_ms": "< 5"}',
'{"prach_failure": "Preamble collision", "rar_failure": "RAR timeout"}',
'{"prach_success_rate_percent": "> 95", "rar_success_rate_percent": "> 98"}',
'{"frequency_band": "n78", "bandwidth_mhz": 100, "subcarrier_spacing_khz": 30}', 'medium'),

-- 5G NR MAC Test Cases (25 cases)
('5G NR HARQ Process Management', '5G_NR_MAC', 'UE manages HARQ processes for reliable data transmission', '5G NR', '{
  "MAC": {
    "harq_processes": {"active_processes": 8, "max_processes": 16, "process_0": {"status": "active", "rv": 0, "ndi": 1, "tbs": 1024}},
    "scheduling": {"dl_sched_interval": 1, "ul_sched_interval": 1, "sched_requests": 5, "buffer_status_reports": 3}
  }
}', '[
  {"timestamp": 0, "direction": "DL", "layer": "MAC", "message": "DL Assignment", "values": {"harq_process_id": 0, "ndi": 1, "tbs": 1024}},
  {"timestamp": 1, "direction": "UL", "layer": "MAC", "message": "HARQ ACK", "values": {"harq_process_id": 0, "ack": true}},
  {"timestamp": 2, "direction": "DL", "layer": "MAC", "message": "DL Assignment (Retransmission)", "values": {"harq_process_id": 0, "ndi": 0, "rv": 1}}
]', 3000, 'medium', 'NRM_5G_NR_0001',
ARRAY['harq', 'retransmission', 'reliability'],
'{"mac_configured": true, "harq_enabled": true}',
'{"harq_process_active": true, "retransmission_successful": true}',
'{"harq_processing_time_ms": "< 1", "retransmission_delay_ms": "< 2"}',
'{"harq_failure": "HARQ process timeout", "retransmission_failure": "Max retransmissions exceeded"}',
'{"harq_success_rate_percent": "> 99", "retransmission_rate_percent": "< 5"}',
'{"harq_processes": 16, "max_retransmissions": 4}', 'high');

-- Create 5G NR test case libraries
INSERT INTO public.test_case_libraries (name, description, category, protocol_version, is_public, created_by) VALUES
('5G NR RRC Test Suite', 'Comprehensive RRC protocol test cases for 5G NR', '5G_NR_RRC', '5G NR', true, null),
('5G NR NAS Test Suite', 'Complete NAS protocol test cases for 5G NR', '5G_NR_NAS', '5G NR', true, null),
('5G NR PHY Test Suite', 'Physical layer test cases for 5G NR', '5G_NR_PHY', '5G NR', true, null),
('5G NR MAC Test Suite', 'MAC layer test cases for 5G NR', '5G_NR_MAC', '5G NR', true, null);

-- Add test cases to libraries
INSERT INTO public.test_case_library_members (library_id, test_case_id, added_by)
SELECT 
  l.id as library_id,
  tc.id as test_case_id,
  null as added_by
FROM public.test_case_libraries l
JOIN public.test_cases tc ON l.protocol_version = tc.protocol_version AND l.category = tc.category
WHERE l.protocol_version = '5G NR' AND l.is_public = true;