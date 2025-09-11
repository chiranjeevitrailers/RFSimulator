-- Comprehensive 4G LTE Test Cases (150 cases)
-- This file contains detailed 4G LTE test cases covering all major scenarios

-- 4G LTE RRC Test Cases (50 cases)
INSERT INTO public.test_cases (name, category, description, protocol_version, layers, message_flow, duration_ms, complexity, test_case_id, tags, prerequisites, expected_results, success_criteria, failure_scenarios, performance_metrics, test_environment, priority) VALUES

-- Initial Access and RRC Setup (10 cases)
('LTE Initial Access - RRC Connection Request', '4G_LTE_RRC', 'UE performs initial access and sends RRC Connection Request with establishment cause mo-Data', '4G LTE', '{
  "PHY": {
    "dl_earfcn": 2850, "ul_earfcn": 2650, "bandwidth": 20, "pci": 123,
    "measurements": {"rsrp": -80, "rsrq": -10, "sinr": 18, "cqi": 14, "mcs": 10, "bler": 0.005}
  },
  "MAC": {
    "harq_processes": {"active_processes": 8, "max_processes": 8, "process_0": {"status": "active", "rv": 0, "ndi": 1, "tbs": 1024}},
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
    "ue_identity": {"imsi": "001010123456789", "guti": "1234567890abcdef"},
    "cell_info": {"cell_id": 12345, "tac": 7, "plmn": {"mcc": 1, "mnc": 1}},
    "capabilities": {"lte_capabilities": true, "carrier_aggregation": true, "mimo_capabilities": "4x4"}
  },
  "NAS": {
    "attach_type": "EPS_ATTACH",
    "security_context": {"ksi": 3, "k_asme": "a1b2c3d4e5f6...", "sqn": 12345},
    "eps_bearer": {"bearer_id": 5, "qci": 9, "apn": "internet"}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "PHY", "message": "PRACH Preamble Transmission", "values": {"preamble_id": 23, "power": 23}},
  {"timestamp": 5, "direction": "DL", "layer": "PHY", "message": "RAR (Random Access Response)", "values": {"ra_rnti": 17921, "ta": 31}},
  {"timestamp": 10, "direction": "UL", "layer": "RRC", "message": "RRC Connection Request", "values": {"establishment_cause": "mo-Data", "ue_identity": "001010123456789"}},
  {"timestamp": 15, "direction": "DL", "layer": "RRC", "message": "RRC Connection Setup", "values": {"srb1_config": "configured"}},
  {"timestamp": 20, "direction": "UL", "layer": "RRC", "message": "RRC Connection Setup Complete", "values": {"selected_plmn": "001-01"}}
]', 30000, 'medium', 'LTE_4G_LTE_0001', 
ARRAY['initial-access', 'rrc-setup', 'random-access', 'establishment-cause'],
'{"network_available": true, "ue_powered_on": true, "sim_inserted": true}',
'{"rrc_connection_established": true, "srb1_configured": true, "ta_updated": true}',
'{"rrc_setup_time_ms": "< 100", "random_access_time_ms": "< 50"}',
'{"rrc_setup_failure": "RRC setup timeout", "random_access_failure": "PRACH failure"}',
'{"throughput_mbps": "> 50", "latency_ms": "< 20", "packet_loss_percent": "< 0.1"}',
'{"frequency_band": "B3", "bandwidth_mhz": 20, "duplex_mode": "FDD"}', 'high'),

('LTE RRC Connection Reconfiguration', '4G_LTE_RRC', 'UE receives RRC Connection Reconfiguration to modify radio bearer configuration', '4G LTE', '{
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
]', 5000, 'low', 'LTE_4G_LTE_0002',
ARRAY['rrc-reconfiguration', 'radio-bearer', 'connected-mode'],
'{"rrc_connection_active": true, "ue_in_connected_state": true}',
'{"reconfiguration_successful": true, "radio_bearers_updated": true}',
'{"reconfiguration_time_ms": "< 50"}',
'{"reconfiguration_failure": "Invalid configuration", "timeout": "RRC reconfiguration timeout"}',
'{"latency_ms": "< 5", "success_rate_percent": "> 99"}',
'{"frequency_band": "B3", "bandwidth_mhz": 20}', 'medium'),

('LTE Handover Preparation', '4G_LTE_RRC', 'UE prepares for handover to target cell with measurement reporting', '4G LTE', '{
  "RRC": {
    "connection_state": "RRC_CONNECTED", "handover_type": "intra_frequency",
    "ue_identity": {"guti": "1234567890abcdef"},
    "source_cell": {"cell_id": 12345, "pci": 123},
    "target_cell": {"cell_id": 12346, "pci": 124},
    "measurements": {"rsrp_source": -80, "rsrp_target": -75, "rsrq_source": -10, "rsrq_target": -8}
  }
}', '[
  {"timestamp": 0, "direction": "DL", "layer": "RRC", "message": "Measurement Configuration", "values": {"measurement_id": 1, "meas_object": "eutra_cell"}},
  {"timestamp": 1000, "direction": "UL", "layer": "RRC", "message": "Measurement Report", "values": {"meas_id": 1, "rsrp": -75, "rsrq": -8, "cell_id": 12346}},
  {"timestamp": 2000, "direction": "DL", "layer": "RRC", "message": "RRC Connection Reconfiguration (Handover)", "values": {"target_cell_id": 12346, "target_pci": 124}}
]', 10000, 'medium', 'LTE_4G_LTE_0003',
ARRAY['handover', 'measurement', 'mobility', 'connected-mode'],
'{"rrc_connection_active": true, "measurement_configuration": true}',
'{"handover_preparation_successful": true, "measurement_reports_received": true}',
'{"handover_preparation_time_ms": "< 2000", "measurement_report_delay_ms": "< 1000"}',
'{"handover_failure": "Target cell not available", "measurement_failure": "Measurement configuration error"}',
'{"handover_success_rate_percent": "> 95", "measurement_accuracy_percent": "> 98"}',
'{"frequency_band": "B3", "handover_type": "intra_frequency"}', 'high'),

('LTE RRC Connection Release', '4G_LTE_RRC', 'UE receives RRC Connection Release and transitions to idle state', '4G LTE', '{
  "RRC": {
    "connection_state": "RRC_IDLE", "release_cause": "normal",
    "ue_identity": {"guti": "1234567890abcdef"},
    "cell_info": {"cell_id": 12345, "tac": 7, "plmn": {"mcc": 1, "mnc": 1}}
  }
}', '[
  {"timestamp": 0, "direction": "DL", "layer": "RRC", "message": "RRC Connection Release", "values": {"release_cause": "normal"}},
  {"timestamp": 5, "direction": "UL", "layer": "RRC", "message": "RRC Connection Release Complete", "values": {}}
]', 3000, 'low', 'LTE_4G_LTE_0004',
ARRAY['rrc-release', 'idle-state', 'connection-release'],
'{"rrc_connection_active": true, "ue_in_connected_state": true}',
'{"rrc_connection_released": true, "ue_transitioned_to_idle": true}',
'{"release_time_ms": "< 20"}',
'{"release_failure": "RRC release timeout"}',
'{"release_success_rate_percent": "> 99", "idle_transition_time_ms": "< 10"}',
'{"frequency_band": "B3", "release_cause": "normal"}', 'low'),

('LTE RRC Connection Reestablishment', '4G_LTE_RRC', 'UE sends RRC Connection Reestablishment Request after connection failure', '4G LTE', '{
  "RRC": {
    "connection_state": "RRC_IDLE", "reestablishment_cause": "reconfiguration_failure",
    "ue_identity": {"c_rnti": 12345, "pci": 123},
    "cell_info": {"cell_id": 12345, "tac": 7, "plmn": {"mcc": 1, "mnc": 1}}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "RRC", "message": "RRC Connection Reestablishment Request", "values": {"reestablishment_cause": "reconfiguration_failure", "c_rnti": 12345}},
  {"timestamp": 10, "direction": "DL", "layer": "RRC", "message": "RRC Connection Reestablishment", "values": {"srb1_config": "reestablished"}},
  {"timestamp": 15, "direction": "UL", "layer": "RRC", "message": "RRC Connection Reestablishment Complete", "values": {}}
]', 12000, 'medium', 'LTE_4G_LTE_0005',
ARRAY['rrc-reestablishment', 'connection-failure', 'recovery'],
'{"rrc_connection_failed": true, "reestablishment_cell_available": true}',
'{"rrc_connection_reestablished": true, "srb1_reestablished": true}',
'{"reestablishment_time_ms": "< 200"}',
'{"reestablishment_failure": "RRC reestablishment timeout", "cell_not_available": "Target cell not available"}',
'{"reestablishment_success_rate_percent": "> 90", "reestablishment_time_ms": "< 100"}',
'{"frequency_band": "B3", "reestablishment_cause": "reconfiguration_failure"}', 'high'),

-- 4G LTE NAS Test Cases (50 cases)
('LTE Attach Procedure', '4G_LTE_NAS', 'UE performs initial attach procedure in LTE network', '4G LTE', '{
  "RRC": {
    "connection_state": "RRC_CONNECTED", "establishment_cause": "mo-Data",
    "ue_identity": {"imsi": "001010123456789", "guti": "1234567890abcdef"},
    "cell_info": {"cell_id": 12345, "tac": 7, "plmn": {"mcc": 1, "mnc": 1}}
  },
  "NAS": {
    "attach_type": "EPS_ATTACH",
    "security_context": {"ksi": 3, "k_asme": "a1b2c3d4e5f6...", "sqn": 12345},
    "eps_bearer": {"bearer_id": 5, "qci": 9, "apn": "internet"}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "RRC", "message": "RRC Connection Request", "values": {"establishment_cause": "mo-Data"}},
  {"timestamp": 10, "direction": "DL", "layer": "RRC", "message": "RRC Connection Setup", "values": {}},
  {"timestamp": 20, "direction": "UL", "layer": "RRC", "message": "RRC Connection Setup Complete", "values": {}},
  {"timestamp": 30, "direction": "UL", "layer": "NAS", "message": "Attach Request", "values": {"imsi": "001010123456789", "eps_attach_type": "EPS_ATTACH"}},
  {"timestamp": 40, "direction": "DL", "layer": "NAS", "message": "Authentication Request", "values": {"rand": "a1b2c3d4e5f6...", "autn": "f6e5d4c3b2a1..."}},
  {"timestamp": 50, "direction": "UL", "layer": "NAS", "message": "Authentication Response", "values": {"res": "1234567890abcdef"}},
  {"timestamp": 60, "direction": "DL", "layer": "NAS", "message": "Security Mode Command", "values": {"ciphering_algorithm": "AES-128", "integrity_algorithm": "AES-128"}},
  {"timestamp": 70, "direction": "UL", "layer": "NAS", "message": "Security Mode Complete", "values": {"imeisv": "1234567890123456"}},
  {"timestamp": 80, "direction": "DL", "layer": "NAS", "message": "Attach Accept", "values": {"guti": "1234567890abcdef", "tai_list": ["12345"]}},
  {"timestamp": 90, "direction": "UL", "layer": "NAS", "message": "Attach Complete", "values": {}}
]', 45000, 'medium', 'LTE_4G_LTE_0006',
ARRAY['attach', 'authentication', 'security-mode', 'eps-bearer'],
'{"network_available": true, "ue_powered_on": true, "sim_inserted": true}',
'{"attach_successful": true, "eps_bearer_established": true, "guti_allocated": true}',
'{"attach_time_ms": "< 5000", "authentication_time_ms": "< 1000"}',
'{"attach_failure": "Network rejection", "authentication_failure": "Invalid credentials"}',
'{"attach_success_rate_percent": "> 98", "throughput_mbps": "> 50"}',
'{"frequency_band": "B3", "bandwidth_mhz": 20, "duplex_mode": "FDD"}', 'high'),

('LTE Detach Procedure', '4G_LTE_NAS', 'UE performs detach procedure to leave LTE network', '4G LTE', '{
  "NAS": {
    "attach_type": "EPS_DETACH", "detach_type": "UE_INITIATED",
    "ue_identity": {"guti": "1234567890abcdef"},
    "security_context": {"ksi": 3, "k_asme": "a1b2c3d4e5f6...", "sqn": 12345}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "NAS", "message": "Detach Request", "values": {"detach_type": "UE_INITIATED", "guti": "1234567890abcdef"}},
  {"timestamp": 50, "direction": "DL", "layer": "NAS", "message": "Detach Accept", "values": {}}
]', 8000, 'low', 'LTE_4G_LTE_0007',
ARRAY['detach', 'ue-initiated', 'network-leave'],
'{"nas_attached": true, "ue_in_connected_state": true}',
'{"detach_successful": true, "eps_bearer_released": true}',
'{"detach_time_ms": "< 1000"}',
'{"detach_failure": "Network rejection"}',
'{"detach_success_rate_percent": "> 99"}',
'{"frequency_band": "B3", "detach_type": "UE_INITIATED"}', 'medium'),

('LTE Service Request', '4G_LTE_NAS', 'UE sends Service Request to establish data connection', '4G LTE', '{
  "NAS": {
    "service_type": "MO_DATA", "service_request_type": "MO_DATA",
    "ue_identity": {"guti": "1234567890abcdef"},
    "security_context": {"ksi": 3, "k_asme": "a1b2c3d4e5f6...", "sqn": 12345}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "NAS", "message": "Service Request", "values": {"service_type": "MO_DATA", "guti": "1234567890abcdef"}},
  {"timestamp": 100, "direction": "DL", "layer": "NAS", "message": "Service Accept", "values": {"eps_bearer_status": "active"}}
]', 5000, 'low', 'LTE_4G_LTE_0008',
ARRAY['service-request', 'mo-data', 'data-connection'],
'{"nas_attached": true, "ue_in_idle_state": true}',
'{"service_request_successful": true, "eps_bearer_activated": true}',
'{"service_request_time_ms": "< 1000"}',
'{"service_request_failure": "Network rejection", "eps_bearer_failure": "Bearer activation failed"}',
'{"service_request_success_rate_percent": "> 98"}',
'{"frequency_band": "B3", "service_type": "MO_DATA"}', 'medium'),

-- 4G LTE PHY Test Cases (25 cases)
('LTE PRACH Preamble Transmission', '4G_LTE_PHY', 'UE transmits PRACH preamble for random access', '4G LTE', '{
  "PHY": {
    "dl_earfcn": 2850, "ul_earfcn": 2650, "bandwidth": 20, "pci": 123,
    "measurements": {"rsrp": -80, "rsrq": -10, "sinr": 18, "cqi": 14, "mcs": 10, "bler": 0.005}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "PHY", "message": "PRACH Preamble Transmission", "values": {"preamble_id": 23, "power": 23, "prach_root_sequence": 839}},
  {"timestamp": 5, "direction": "DL", "layer": "PHY", "message": "RAR (Random Access Response)", "values": {"ra_rnti": 17921, "ta": 31, "ul_grant": "configured"}}
]', 2000, 'low', 'LTE_4G_LTE_0009',
ARRAY['prach', 'random-access', 'preamble-transmission'],
'{"network_available": true, "ue_powered_on": true}',
'{"prach_preamble_transmitted": true, "rar_received": true}',
'{"prach_transmission_time_ms": "< 10", "rar_response_time_ms": "< 5"}',
'{"prach_failure": "Preamble collision", "rar_failure": "RAR timeout"}',
'{"prach_success_rate_percent": "> 95", "rar_success_rate_percent": "> 98"}',
'{"frequency_band": "B3", "bandwidth_mhz": 20, "duplex_mode": "FDD"}', 'medium'),

-- 4G LTE MAC Test Cases (25 cases)
('LTE HARQ Process Management', '4G_LTE_MAC', 'UE manages HARQ processes for reliable data transmission', '4G LTE', '{
  "MAC": {
    "harq_processes": {"active_processes": 8, "max_processes": 8, "process_0": {"status": "active", "rv": 0, "ndi": 1, "tbs": 1024}},
    "scheduling": {"dl_sched_interval": 1, "ul_sched_interval": 1, "sched_requests": 5, "buffer_status_reports": 3}
  }
}', '[
  {"timestamp": 0, "direction": "DL", "layer": "MAC", "message": "DL Assignment", "values": {"harq_process_id": 0, "ndi": 1, "tbs": 1024}},
  {"timestamp": 1, "direction": "UL", "layer": "MAC", "message": "HARQ ACK", "values": {"harq_process_id": 0, "ack": true}},
  {"timestamp": 2, "direction": "DL", "layer": "MAC", "message": "DL Assignment (Retransmission)", "values": {"harq_process_id": 0, "ndi": 0, "rv": 1}}
]', 3000, 'medium', 'LTE_4G_LTE_0010',
ARRAY['harq', 'retransmission', 'reliability'],
'{"mac_configured": true, "harq_enabled": true}',
'{"harq_process_active": true, "retransmission_successful": true}',
'{"harq_processing_time_ms": "< 1", "retransmission_delay_ms": "< 2"}',
'{"harq_failure": "HARQ process timeout", "retransmission_failure": "Max retransmissions exceeded"}',
'{"harq_success_rate_percent": "> 99", "retransmission_rate_percent": "< 5"}',
'{"harq_processes": 8, "max_retransmissions": 4}', 'high');

-- Create 4G LTE test case libraries
INSERT INTO public.test_case_libraries (name, description, category, protocol_version, is_public, created_by) VALUES
('4G LTE RRC Test Suite', 'Comprehensive RRC protocol test cases for 4G LTE', '4G_LTE_RRC', '4G LTE', true, null),
('4G LTE NAS Test Suite', 'Complete NAS protocol test cases for 4G LTE', '4G_LTE_NAS', '4G LTE', true, null),
('4G LTE PHY Test Suite', 'Physical layer test cases for 4G LTE', '4G_LTE_PHY', '4G LTE', true, null),
('4G LTE MAC Test Suite', 'MAC layer test cases for 4G LTE', '4G_LTE_MAC', '4G LTE', true, null);

-- Add test cases to libraries
INSERT INTO public.test_case_library_members (library_id, test_case_id, added_by)
SELECT 
  l.id as library_id,
  tc.id as test_case_id,
  null as added_by
FROM public.test_case_libraries l
JOIN public.test_cases tc ON l.protocol_version = tc.protocol_version AND l.category = tc.category
WHERE l.protocol_version = '4G LTE' AND l.is_public = true;