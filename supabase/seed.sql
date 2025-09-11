-- Seed data for 5GLabX Protocol Simulator

-- Insert sample test cases for 4G LTE
INSERT INTO test_cases (name, description, category, subcategory, complexity, duration, protocol_layers, test_data, expected_results, tags) VALUES
('LTE RRC Connection Setup', 'UE performs initial RRC connection establishment with eNB', '4G_LTE', 'RRC', 'beginner', 30, ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC'], 
'{"scenario": "initial_access", "ue_id": "001010123456789", "cell_id": 12345, "mcc": 1, "mnc": 1, "tac": 7}',
'{"success": true, "connection_time": "< 5s", "messages": ["RRC Connection Request", "RRC Connection Setup", "RRC Connection Setup Complete"]}',
ARRAY['4G', 'LTE', 'RRC', 'Connection', 'Setup']),

('LTE NAS Attach Procedure', 'UE performs EPS attach procedure with MME', '4G_LTE', 'NAS', 'intermediate', 45, ARRAY['NAS', 'RRC', 'S1AP'],
'{"scenario": "eps_attach", "ue_id": "001010123456789", "imsi": "001010123456789", "apn": "internet", "qci": 9}',
'{"success": true, "attach_time": "< 10s", "bearer_established": true, "ip_address": "192.168.1.100"}',
ARRAY['4G', 'LTE', 'NAS', 'Attach', 'EPS']),

('LTE Handover Procedure', 'UE performs handover from source to target eNB', '4G_LTE', 'Mobility', 'advanced', 60, ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'S1AP'],
'{"scenario": "handover", "source_cell": 12345, "target_cell": 12346, "handover_type": "X2", "ue_id": "001010123456789"}',
'{"success": true, "handover_time": "< 15s", "interruption_time": "< 100ms", "data_loss": false}',
ARRAY['4G', 'LTE', 'Handover', 'Mobility', 'X2']);

-- Insert sample test cases for 5G NR
INSERT INTO test_cases (name, description, category, subcategory, complexity, duration, protocol_layers, test_data, expected_results, tags) VALUES
('5G NR Initial Access', 'UE performs initial access to 5G network', '5G_NR', 'RRC', 'beginner', 35, ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC'],
'{"scenario": "initial_access", "ue_id": "001010123456789", "cell_id": 54321, "mcc": 1, "mnc": 1, "tac": 15, "band": "n78"}',
'{"success": true, "access_time": "< 5s", "messages": ["RRC Setup Request", "RRC Setup", "RRC Setup Complete"]}',
ARRAY['5G', 'NR', 'RRC', 'Initial', 'Access']),

('5G NR Registration', 'UE performs registration with 5G core network', '5G_NR', 'NAS', 'intermediate', 50, ARRAY['NAS', 'RRC', 'NGAP'],
'{"scenario": "registration", "ue_id": "001010123456789", "supi": "001010123456789", "dnn": "internet", "sst": 1}',
'{"success": true, "registration_time": "< 10s", "pdu_session_established": true, "ip_address": "192.168.1.101"}',
ARRAY['5G', 'NR', 'NAS', 'Registration', 'Core']),

('5G NR Beam Management', 'UE performs beam management and tracking', '5G_NR', 'PHY', 'advanced', 40, ARRAY['PHY', 'MAC', 'RRC'],
'{"scenario": "beam_management", "ue_id": "001010123456789", "beam_count": 64, "beam_switching": true}',
'{"success": true, "beam_switching_time": "< 5ms", "beam_tracking_accuracy": "> 95%", "throughput": "> 1Gbps"}',
ARRAY['5G', 'NR', 'Beam', 'Management', 'PHY']);

-- Insert sample test cases for IMS/SIP
INSERT INTO test_cases (name, description, category, subcategory, complexity, duration, protocol_layers, test_data, expected_results, tags) VALUES
('SIP Registration', 'UE performs SIP registration with IMS core', 'IMS_SIP', 'SIP', 'beginner', 25, ARRAY['SIP', 'IMS'],
'{"scenario": "sip_registration", "user_id": "user@domain.com", "domain": "domain.com", "registrar": "sip:registrar.domain.com"}',
'{"success": true, "registration_time": "< 3s", "expires": 3600, "contact": "sip:user@192.168.1.100:5060"}',
ARRAY['IMS', 'SIP', 'Registration', 'Core']),

('SIP Call Establishment', 'UE establishes SIP call with another user', 'IMS_SIP', 'SIP', 'intermediate', 35, ARRAY['SIP', 'IMS', 'RTP'],
'{"scenario": "call_establishment", "caller": "user1@domain.com", "callee": "user2@domain.com", "media": "audio"}',
'{"success": true, "call_setup_time": "< 5s", "media_established": true, "codec": "G.711"}',
ARRAY['IMS', 'SIP', 'Call', 'Establishment', 'RTP']),

('SIP Call Transfer', 'UE performs SIP call transfer', 'IMS_SIP', 'SIP', 'advanced', 45, ARRAY['SIP', 'IMS'],
'{"scenario": "call_transfer", "original_caller": "user1@domain.com", "transfer_target": "user3@domain.com"}',
'{"success": true, "transfer_time": "< 8s", "original_call_terminated": true, "new_call_established": true}',
ARRAY['IMS', 'SIP', 'Call', 'Transfer', 'Advanced']);

-- Insert sample test cases for O-RAN
INSERT INTO test_cases (name, description, category, subcategory, complexity, duration, protocol_layers, test_data, expected_results, tags) VALUES
('O-RAN F1 Interface Setup', 'O-RAN F1 interface establishment between O-DU and O-CU', 'O_RAN', 'F1', 'intermediate', 40, ARRAY['F1AP', 'SCTP'],
'{"scenario": "f1_setup", "o_du_id": "DU001", "o_cu_id": "CU001", "f1_interface": "F1-C"}',
'{"success": true, "setup_time": "< 10s", "f1_interface_active": true, "sctp_association": "established"}',
ARRAY['O-RAN', 'F1', 'Interface', 'Setup', 'O-DU', 'O-CU']),

('O-RAN E2 Interface', 'O-RAN E2 interface between O-CU and SMO', 'O_RAN', 'E2', 'advanced', 50, ARRAY['E2AP', 'SCTP'],
'{"scenario": "e2_interface", "o_cu_id": "CU001", "smo_id": "SMO001", "e2_interface": "E2"}',
'{"success": true, "interface_time": "< 15s", "e2_interface_active": true, "xapps_connected": true}',
ARRAY['O-RAN', 'E2', 'Interface', 'SMO', 'xApps']);

-- Insert sample test cases for NB-IoT
INSERT INTO test_cases (name, description, category, subcategory, complexity, duration, protocol_layers, test_data, expected_results, tags) VALUES
('NB-IoT Coverage Enhancement', 'NB-IoT UE with coverage enhancement procedures', 'NB_IoT', 'Coverage', 'intermediate', 60, ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC'],
'{"scenario": "coverage_enhancement", "ue_id": "001010123456789", "ce_level": 2, "repetitions": 8}',
'{"success": true, "coverage_enhancement": "active", "repetitions": 8, "power_boost": "6dB"}',
ARRAY['NB-IoT', 'Coverage', 'Enhancement', 'IoT']),

('NB-IoT Power Saving', 'NB-IoT UE power saving mode procedures', 'NB_IoT', 'Power', 'beginner', 30, ARRAY['RRC', 'NAS'],
'{"scenario": "power_saving", "ue_id": "001010123456789", "psm_enabled": true, "edrx_enabled": true}',
'{"success": true, "psm_active": true, "edrx_active": true, "power_consumption": "reduced"}',
ARRAY['NB-IoT', 'Power', 'Saving', 'PSM', 'eDRX']);

-- Insert sample test cases for V2X
INSERT INTO test_cases (name, description, category, subcategory, complexity, duration, protocol_layers, test_data, expected_results, tags) VALUES
('V2V Communication', 'Vehicle-to-Vehicle communication using sidelink', 'V2X', 'V2V', 'advanced', 45, ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'PC5'],
'{"scenario": "v2v_communication", "vehicle1_id": "V001", "vehicle2_id": "V002", "sidelink": true, "distance": "100m"}',
'{"success": true, "v2v_established": true, "sidelink_active": true, "latency": "< 10ms"}',
ARRAY['V2X', 'V2V', 'Sidelink', 'Communication']),

('V2I Communication', 'Vehicle-to-Infrastructure communication', 'V2X', 'V2I', 'intermediate', 35, ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC'],
'{"scenario": "v2i_communication", "vehicle_id": "V001", "rsu_id": "RSU001", "infrastructure": true}',
'{"success": true, "v2i_established": true, "rsu_connected": true, "latency": "< 20ms"}',
ARRAY['V2X', 'V2I', 'RSU', 'Infrastructure']);

-- Insert sample test cases for NTN
INSERT INTO test_cases (name, description, category, subcategory, complexity, duration, protocol_layers, test_data, expected_results, tags) VALUES
('NTN Satellite Access', 'UE access via Non-Terrestrial Network satellite', 'NTN', 'Satellite', 'advanced', 80, ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC'],
'{"scenario": "satellite_access", "ue_id": "001010123456789", "satellite_type": "LEO", "altitude": "550km", "delay": "20ms"}',
'{"success": true, "satellite_connected": true, "propagation_delay": "20ms", "doppler_compensation": "active"}',
ARRAY['NTN', 'Satellite', 'LEO', 'Access']),

('NTN Handover', 'Handover between terrestrial and non-terrestrial networks', 'NTN', 'Handover', 'expert', 90, ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'],
'{"scenario": "ntn_handover", "ue_id": "001010123456789", "from_network": "terrestrial", "to_network": "satellite"}',
'{"success": true, "handover_completed": true, "network_switch": "seamless", "service_continuity": "maintained"}',
ARRAY['NTN', 'Handover', 'Terrestrial', 'Satellite', 'Seamless']);

-- Update the created_by field for all test cases to reference the admin user
UPDATE test_cases SET created_by = (SELECT id FROM users WHERE email = 'admin@5glabx.com' LIMIT 1);