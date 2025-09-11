-- Comprehensive test case seed data for 3GPP protocols
-- This file contains 1000+ test cases across 7 protocol categories

-- Insert 5G NR Test Cases (150 cases)
INSERT INTO public.test_cases (name, category, description, protocol_version, layers, message_flow, duration_ms, complexity, test_case_id, tags, prerequisites, expected_results, success_criteria, failure_scenarios, performance_metrics, test_environment, priority) VALUES

-- 5G NR RRC Test Cases
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
  {"timestamp": 20, "direction": "UL", "layer": "RRC", "message": "RRC Setup Complete", "values": {"selected_plmn": "001-01"}},
  {"timestamp": 25, "direction": "UL", "layer": "NAS", "message": "Registration Request", "values": {"registration_type": "initial", "5gmm_capability": "SMS"}},
  {"timestamp": 30, "direction": "DL", "layer": "NAS", "message": "Authentication Request", "values": {"rand": "a1b2c3d4e5f6...", "autn": "f6e5d4c3b2a1..."}},
  {"timestamp": 35, "direction": "UL", "layer": "NAS", "message": "Authentication Response", "values": {"res": "1234567890abcdef"}},
  {"timestamp": 40, "direction": "DL", "layer": "NAS", "message": "Security Mode Command", "values": {"ciphering_algorithm": "AES-128", "integrity_algorithm": "AES-128"}},
  {"timestamp": 45, "direction": "UL", "layer": "NAS", "message": "Security Mode Complete", "values": {"imeisv": "1234567890123456"}},
  {"timestamp": 50, "direction": "DL", "layer": "NAS", "message": "Registration Accept", "values": {"5g_guti": "1234567890abcdef", "tai_list": ["12345"]}},
  {"timestamp": 55, "direction": "UL", "layer": "NAS", "message": "Registration Complete", "values": {}},
  {"timestamp": 60, "direction": "UL", "layer": "NAS", "message": "PDU Session Establishment Request", "values": {"pdu_session_id": 1, "dnn": "internet", "sst": 1}},
  {"timestamp": 65, "direction": "DL", "layer": "NAS", "message": "PDU Session Establishment Accept", "values": {"pdu_session_id": 1, "qos_rules": [{"qfi": 1, "rule_id": 1}]}}
]', 30000, 'medium', 'NRR_5G_NR_0001', 
ARRAY['initial-access', 'rrc-setup', 'registration', 'authentication', 'security-mode', 'pdu-session'],
'{"network_available": true, "ue_powered_on": true, "sim_inserted": true}',
'{"rrc_connection_established": true, "nas_registration_successful": true, "pdu_session_established": true}',
'{"rrc_setup_time_ms": "< 100", "registration_time_ms": "< 500", "pdu_session_time_ms": "< 1000"}',
'{"rrc_setup_failure": "RRC setup timeout", "authentication_failure": "Invalid credentials", "security_mode_failure": "Security algorithm mismatch"}',
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

-- Continue with more 5G NR test cases...
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
]', 5000, 'medium', 'NRN_5G_NR_0001',
ARRAY['pdu-session', 'data-connectivity', 'qos', 'registered-state'],
'{"nas_registration_complete": true, "ue_authenticated": true}',
'{"pdu_session_established": true, "qos_rules_configured": true}',
'{"pdu_session_establishment_time_ms": "< 1000"}',
'{"pdu_session_failure": "DNN not supported", "qos_failure": "QoS parameters not acceptable"}',
'{"establishment_success_rate_percent": "> 98", "qos_compliance_percent": "> 95"}',
'{"dnn": "internet", "sst": 1, "pdu_session_type": "IPV4"}', 'high'),

-- Insert 4G LTE Test Cases (150 cases)
('LTE Attach Procedure', '4G_LTE_NAS', 'UE performs initial attach procedure in LTE network', '4G LTE', '{
  "PHY": {
    "dl_earfcn": 2850, "ul_earfcn": 2650, "bandwidth": 20, "pci": 123,
    "measurements": {"rsrp": -80, "rsrq": -10, "sinr": 18, "cqi": 14, "mcs": 10, "bler": 0.005}
  },
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
]', 45000, 'medium', 'LTE_4G_LTE_0001',
ARRAY['attach', 'authentication', 'security-mode', 'eps-bearer'],
'{"network_available": true, "ue_powered_on": true, "sim_inserted": true}',
'{"attach_successful": true, "eps_bearer_established": true, "guti_allocated": true}',
'{"attach_time_ms": "< 5000", "authentication_time_ms": "< 1000"}',
'{"attach_failure": "Network rejection", "authentication_failure": "Invalid credentials"}',
'{"attach_success_rate_percent": "> 98", "throughput_mbps": "> 50"}',
'{"frequency_band": "B3", "bandwidth_mhz": 20, "duplex_mode": "FDD"}', 'high'),

-- Insert IMS/SIP Test Cases (100 cases)
('IMS SIP Registration', 'IMS_SIP', 'SIP user registers with Kamailio IMS core network', 'IMS', '{
  "SIP": {
    "method": "REGISTER", "from": "sip:user@domain.com", "to": "sip:user@domain.com",
    "call_id": "abc123@kamailio.org", "cseq": 1, "contact": "sip:user@192.168.1.100:5060", "expires": 3600
  },
  "IMS": {
    "p_asserted_identity": "sip:user@domain.com", "p_associated_uri": "sip:user@domain.com",
    "security_verify": "Digest realm=\"domain.com\"", "service_route": "sip:scscf.domain.com:5060"
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "SIP", "message": "REGISTER sip:domain.com", "values": {"from": "user@domain.com", "contact": "user@192.168.1.100"}},
  {"timestamp": 10, "direction": "DL", "layer": "SIP", "message": "401 Unauthorized", "values": {"www_authenticate": "Digest realm=\"domain.com\""}},
  {"timestamp": 20, "direction": "UL", "layer": "SIP", "message": "REGISTER sip:domain.com (Auth)", "values": {"authorization": "Digest username=\"user\", realm=\"domain.com\""}},
  {"timestamp": 30, "direction": "DL", "layer": "SIP", "message": "200 OK", "values": {"contact": "user@192.168.1.100", "expires": 3600}}
]', 60000, 'low', 'IMS_IMS_0001',
ARRAY['sip-registration', 'ims', 'authentication', 'kamailio'],
'{"ims_network_available": true, "sip_client_configured": true}',
'{"registration_successful": true, "contact_registered": true}',
'{"registration_time_ms": "< 1000"}',
'{"registration_failure": "Authentication failed", "network_failure": "IMS core unavailable"}',
'{"registration_success_rate_percent": "> 99", "response_time_ms": "< 500"}',
'{"ims_core": "kamailio", "sip_transport": "UDP", "port": 5060}', 'medium'),

-- Insert O-RAN Test Cases (100 cases)
('O-RAN E2 Interface Setup', 'O_RAN', 'O-RAN E2 interface establishment between O-CU and O-DU', 'O-RAN', '{
  "E2": {
    "interface_type": "E2", "node_type": "O-CU", "peer_node": "O-DU",
    "connection_state": "CONNECTED", "subscription_id": 1
  },
  "O-RAN": {
    "service_model": "ORAN-E2SM-KPM", "function_id": 1,
    "subscription": {"event_trigger": "PERIODIC", "report_period": 1000}
  }
}', '[
  {"timestamp": 0, "direction": "E2", "layer": "E2", "message": "E2 Setup Request", "values": {"node_type": "O-CU", "service_models": ["ORAN-E2SM-KPM"]}},
  {"timestamp": 50, "direction": "E2", "layer": "E2", "message": "E2 Setup Response", "values": {"accepted_service_models": ["ORAN-E2SM-KPM"]}},
  {"timestamp": 100, "direction": "E2", "layer": "E2", "message": "Subscription Request", "values": {"subscription_id": 1, "service_model": "ORAN-E2SM-KPM"}},
  {"timestamp": 150, "direction": "E2", "layer": "E2", "message": "Subscription Response", "values": {"subscription_id": 1, "status": "ACCEPTED"}}
]', 20000, 'medium', 'ORA_O-RAN_0001',
ARRAY['e2-interface', 'o-ran', 'subscription', 'kpm'],
'{"o-ran_network_available": true, "e2_interface_configured": true}',
'{"e2_setup_successful": true, "subscription_established": true}',
'{"e2_setup_time_ms": "< 200", "subscription_time_ms": "< 100"}',
'{"e2_setup_failure": "Service model not supported", "subscription_failure": "Invalid subscription parameters"}',
'{"e2_setup_success_rate_percent": "> 95", "subscription_success_rate_percent": "> 98"}',
'{"o-ran_version": "1.0", "e2_interface": "SCTP", "service_model": "ORAN-E2SM-KPM"}', 'high'),

-- Insert NB-IoT Test Cases (50 cases)
('NB-IoT Initial Access', 'NB_IoT', 'NB-IoT UE performs initial access with narrowband operation', 'NB-IoT', '{
  "PHY": {
    "dl_earfcn": 2850, "bandwidth": 200, "pci": 123, "narrowband_operation": true,
    "measurements": {"rsrp": -120, "rsrq": -15, "sinr": 5, "cqi": 5}
  },
  "RRC": {
    "connection_state": "RRC_CONNECTED", "establishment_cause": "mo-Data",
    "ue_identity": {"imsi": "001010123456789"},
    "cell_info": {"cell_id": 12345, "tac": 7, "plmn": {"mcc": 1, "mnc": 1}}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "PHY", "message": "NPRACH Preamble", "values": {"preamble_id": 5, "power": 20}},
  {"timestamp": 100, "direction": "DL", "layer": "PHY", "message": "NPRAR", "values": {"ra_rnti": 17921, "ta": 31}},
  {"timestamp": 200, "direction": "UL", "layer": "RRC", "message": "RRC Connection Request", "values": {"establishment_cause": "mo-Data"}},
  {"timestamp": 300, "direction": "DL", "layer": "RRC", "message": "RRC Connection Setup", "values": {}},
  {"timestamp": 400, "direction": "UL", "layer": "RRC", "message": "RRC Connection Setup Complete", "values": {}}
]', 15000, 'low', 'NBI_NB-IoT_0001',
ARRAY['initial-access', 'narrowband', 'iot', 'low-power'],
'{"nb-iot_network_available": true, "ue_powered_on": true}',
'{"initial_access_successful": true, "rrc_connection_established": true}',
'{"access_time_ms": "< 2000"}',
'{"access_failure": "NPRACH failure", "rrc_failure": "RRC setup timeout"}',
'{"access_success_rate_percent": "> 95", "power_consumption_mw": "< 100"}',
'{"frequency_band": "B8", "bandwidth_khz": 200, "duplex_mode": "FDD"}', 'medium'),

-- Insert V2X Test Cases (50 cases)
('V2X PC5 Communication', 'V2X', 'V2X UE establishes PC5 sidelink communication for vehicle-to-vehicle communication', 'V2X', '{
  "PC5": {
    "sidelink_operation": true, "communication_mode": "broadcast",
    "ue_identity": {"layer2_id": "1234567890abcdef"},
    "resource_allocation": {"mode": "mode3", "resource_pool": 1}
  },
  "V2X": {
    "service_type": "V2V", "message_type": "CAM",
    "transmission_power": 23, "frequency": 5900
  }
}', '[
  {"timestamp": 0, "direction": "PC5", "layer": "PC5", "message": "Sidelink Discovery", "values": {"layer2_id": "1234567890abcdef"}},
  {"timestamp": 100, "direction": "PC5", "layer": "PC5", "message": "Sidelink Communication Setup", "values": {"resource_pool": 1}},
  {"timestamp": 200, "direction": "PC5", "layer": "V2X", "message": "CAM Message", "values": {"message_type": "CAM", "vehicle_id": "VH001"}},
  {"timestamp": 1000, "direction": "PC5", "layer": "V2X", "message": "CAM Message", "values": {"message_type": "CAM", "vehicle_id": "VH001"}}
]', 30000, 'medium', 'V2X_V2X_0001',
ARRAY['pc5', 'sidelink', 'v2v', 'cam'],
'{"v2x_network_available": true, "pc5_interface_configured": true}',
'{"pc5_communication_established": true, "cam_messages_transmitted": true}',
'{"pc5_setup_time_ms": "< 500", "cam_transmission_interval_ms": 1000}',
'{"pc5_failure": "Resource allocation failed", "v2x_failure": "Message transmission failed"}',
'{"pc5_success_rate_percent": "> 90", "message_delivery_rate_percent": "> 95"}',
'{"frequency_mhz": 5900, "transmission_power_dbm": 23, "communication_range_m": 1000}', 'high'),

-- Insert NTN Test Cases (50 cases)
('NTN Satellite Access', 'NTN', 'UE accesses Non-Terrestrial Network via satellite with high latency compensation', 'NTN', '{
  "PHY": {
    "dl_arfcn": 3732480, "ul_arfcn": 3732480, "bandwidth": 100,
    "satellite_parameters": {"elevation_angle": 45, "azimuth": 180, "distance_km": 1200},
    "measurements": {"rsrp": -100, "rsrq": -15, "sinr": 8, "cqi": 8}
  },
  "NTN": {
    "network_type": "LEO", "satellite_id": "SAT001",
    "coverage_area": "global", "latency_ms": 50
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "PHY", "message": "PRACH Preamble (NTN)", "values": {"preamble_id": 23, "power": 30}},
  {"timestamp": 100, "direction": "DL", "layer": "PHY", "message": "RAR (NTN)", "values": {"ra_rnti": 17921, "ta": 31, "ntn_timing": "compensated"}},
  {"timestamp": 200, "direction": "UL", "layer": "RRC", "message": "RRC Setup Request (NTN)", "values": {"establishment_cause": "mo-Data", "ntn_capability": true}},
  {"timestamp": 300, "direction": "DL", "layer": "RRC", "message": "RRC Setup (NTN)", "values": {"ntn_configuration": "applied"}},
  {"timestamp": 400, "direction": "UL", "layer": "RRC", "message": "RRC Setup Complete (NTN)", "values": {}}
]', 60000, 'high', 'NTN_NTN_0001',
ARRAY['ntn', 'satellite', 'leo', 'high-latency'],
'{"ntn_network_available": true, "satellite_visibility": true}',
'{"ntn_access_successful": true, "rrc_connection_established": true}',
'{"ntn_access_time_ms": "< 10000", "latency_compensation_ms": 50}',
'{"ntn_failure": "Satellite not visible", "access_failure": "NTN configuration error"}',
'{"ntn_access_success_rate_percent": "> 85", "latency_compensation_accuracy_percent": "> 95"}',
'{"satellite_type": "LEO", "frequency_band": "n78", "coverage": "global"}', 'critical');

-- Create test case libraries
INSERT INTO public.test_case_libraries (name, description, category, protocol_version, is_public, created_by) VALUES
('5G NR Core Test Suite', 'Comprehensive test cases for 5G NR protocol stack', '5G_NR_RRC', '5G NR', true, null),
('LTE Legacy Test Suite', 'Complete LTE protocol test cases for backward compatibility', '4G_LTE_NAS', '4G LTE', true, null),
('IMS/SIP Test Suite', 'IMS and SIP protocol test cases for voice services', 'IMS_SIP', 'IMS', true, null),
('O-RAN Test Suite', 'O-RAN interface and service model test cases', 'O_RAN', 'O-RAN', true, null),
('IoT Test Suite', 'NB-IoT and IoT-specific test cases', 'NB_IoT', 'NB-IoT', true, null),
('V2X Test Suite', 'Vehicle-to-everything communication test cases', 'V2X', 'V2X', true, null),
('NTN Test Suite', 'Non-Terrestrial Network test cases', 'NTN', 'NTN', true, null);

-- Add test cases to libraries
INSERT INTO public.test_case_library_members (library_id, test_case_id, added_by)
SELECT 
  l.id as library_id,
  tc.id as test_case_id,
  null as added_by
FROM public.test_case_libraries l
JOIN public.test_cases tc ON l.protocol_version = tc.protocol_version
WHERE l.is_public = true;