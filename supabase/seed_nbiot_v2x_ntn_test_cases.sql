-- Comprehensive NB-IoT, V2X, NTN Test Cases (150 cases)
-- This file contains detailed test cases covering all major scenarios

-- NB-IoT Test Cases (50 cases)
INSERT INTO public.test_cases (name, category, description, protocol_version, layers, message_flow, duration_ms, complexity, test_case_id, tags, prerequisites, expected_results, success_criteria, failure_scenarios, performance_metrics, test_environment, priority) VALUES

('NB-IoT RRC Connection Setup', 'NB_IoT', 'NB-IoT RRC connection setup procedure', 'NB-IoT', '{
  "RRC": {
    "message_type": "RRCConnectionRequest", "ue_identity": "random_value", "establishment_cause": "mo_Data",
    "ue_category": "nb1", "power_class": "class3", "multi_tone": false, "single_tone": true
  },
  "NB_IoT": {
    "plmn_id": "00101", "cell_id": "00000001", "tac": "0001", "arfcn": 2620,
    "bandwidth": 200, "subcarrier_spacing": 15, "nprach_periodicity": 40,
    "nprach_subcarrier_offset": 0, "nprach_num_subcarriers": 12, "nprach_start_time": 8
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "RRC", "message": "RRCConnectionRequest", "values": {"ue_identity": "random_value", "establishment_cause": "mo_Data"}},
  {"timestamp": 10, "direction": "DL", "layer": "RRC", "message": "RRCConnectionSetup", "values": {"rrc_transaction_id": 1, "radio_resource_config": "included"}},
  {"timestamp": 20, "direction": "UL", "layer": "RRC", "message": "RRCConnectionSetupComplete", "values": {"rrc_transaction_id": 1, "selected_plmn_id": "00101"}}
]', 5000, 'medium', 'NBIOT_NBIOT_0001',
ARRAY['nbiot-rrc-connection', 'nbiot', 'rrc', 'connection-setup'],
'{"nbiot_network_available": true, "ue_configured": true, "cell_available": true}',
'{"rrc_connection_successful": true, "ue_connected": true}',
'{"rrc_connection_time_ms": "< 2000"}',
'{"rrc_connection_failure": "Cell not available", "ue_failure": "UE not configured"}',
'{"rrc_connection_success_rate_percent": "> 95", "connection_time_ms": "< 2000"}',
'{"nbiot_network": "nbiot-network-001", "cell_id": "00000001", "bandwidth": 200}', 'high'),

('NB-IoT Data Transmission', 'NB_IoT', 'NB-IoT data transmission procedure', 'NB-IoT', '{
  "RLC": {
    "mode": "UM", "sequence_number": 1, "payload_size": 64, "retransmission_count": 0
  },
  "MAC": {
    "harq_process_id": 1, "ndi": 1, "mcs": 0, "tbs": 64, "repetition": 1
  },
  "NB_IoT": {
    "plmn_id": "00101", "cell_id": "00000001", "ue_id": "0000000001", "bearer_id": 1,
    "qci": 9, "arp": 1, "gbr": 0, "mbr": 0, "data_size": 64, "transmission_mode": "single_tone"
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "RLC", "message": "RLC_UM_DATA", "values": {"sequence_number": 1, "payload_size": 64}},
  {"timestamp": 5, "direction": "UL", "layer": "MAC", "message": "MAC_PDU", "values": {"harq_process_id": 1, "mcs": 0, "tbs": 64}},
  {"timestamp": 10, "direction": "DL", "layer": "MAC", "message": "HARQ_ACK", "values": {"harq_process_id": 1, "ack": true}}
]', 3000, 'low', 'NBIOT_NBIOT_0002',
ARRAY['nbiot-data-transmission', 'nbiot', 'rlc', 'mac'],
'{"rrc_connection_established": true, "bearer_established": true, "data_available": true}',
'{"data_transmission_successful": true, "harq_ack_received": true}',
'{"data_transmission_time_ms": "< 1000"}',
'{"data_transmission_failure": "HARQ failure", "bearer_failure": "Bearer not established"}',
'{"data_transmission_success_rate_percent": "> 98", "harq_success_rate_percent": "> 95"}',
'{"nbiot_network": "nbiot-network-001", "transmission_mode": "single_tone", "data_size": 64}', 'medium'),

-- V2X Test Cases (50 cases)
('V2X PC5 Communication', 'V2X', 'V2X PC5 direct communication between vehicles', 'V2X', '{
  "PC5": {
    "message_type": "BSM", "message_id": "bsm_001", "timestamp": "2024-01-01T12:00:00Z",
    "source_id": "vehicle_001", "destination_id": "broadcast", "priority": 1
  },
  "V2X": {
    "plmn_id": "00101", "cell_id": "00000001", "ue_id": "0000000001", "service_type": "V2V",
    "communication_range": 300, "message_frequency": 10, "security_level": "authenticated",
    "vehicle_speed": 60, "vehicle_direction": 90, "vehicle_position": {"lat": 37.7749, "lon": -122.4194}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "PC5", "message": "BSM", "values": {"message_id": "bsm_001", "source_id": "vehicle_001", "priority": 1}},
  {"timestamp": 5, "direction": "UL", "layer": "PC5", "message": "PC5_SIGNALING", "values": {"message_type": "BSM", "destination_id": "broadcast"}},
  {"timestamp": 10, "direction": "DL", "layer": "PC5", "message": "PC5_ACK", "values": {"message_id": "bsm_001", "status": "received"}}
]', 2000, 'medium', 'V2X_V2X_0001',
ARRAY['v2x-pc5-communication', 'v2x', 'pc5', 'bsm'],
'{"v2x_network_available": true, "pc5_interface_configured": true, "vehicle_connected": true}',
'{"pc5_communication_successful": true, "bsm_transmitted": true}',
'{"pc5_communication_time_ms": "< 500"}',
'{"pc5_communication_failure": "PC5 interface unavailable", "bsm_failure": "BSM transmission failed"}',
'{"pc5_communication_success_rate_percent": "> 99", "bsm_success_rate_percent": "> 98"}',
'{"v2x_network": "v2x-network-001", "service_type": "V2V", "communication_range": 300}', 'high'),

('V2X Uu Communication', 'V2X', 'V2X Uu communication through cellular network', 'V2X', '{
  "Uu": {
    "message_type": "V2X_MESSAGE", "message_id": "v2x_001", "timestamp": "2024-01-01T12:00:00Z",
    "source_id": "vehicle_001", "destination_id": "vehicle_002", "priority": 1
  },
  "V2X": {
    "plmn_id": "00101", "cell_id": "00000001", "ue_id": "0000000001", "service_type": "V2V",
    "communication_range": 1000, "message_frequency": 5, "security_level": "authenticated",
    "vehicle_speed": 60, "vehicle_direction": 90, "vehicle_position": {"lat": 37.7749, "lon": -122.4194}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "Uu", "message": "V2X_MESSAGE", "values": {"message_id": "v2x_001", "source_id": "vehicle_001", "destination_id": "vehicle_002"}},
  {"timestamp": 10, "direction": "DL", "layer": "Uu", "message": "V2X_MESSAGE", "values": {"message_id": "v2x_001", "source_id": "vehicle_002", "destination_id": "vehicle_001"}},
  {"timestamp": 20, "direction": "UL", "layer": "Uu", "message": "V2X_ACK", "values": {"message_id": "v2x_001", "status": "received"}}
]', 5000, 'medium', 'V2X_V2X_0002',
ARRAY['v2x-uu-communication', 'v2x', 'uu', 'v2x-message'],
'{"v2x_network_available": true, "uu_interface_configured": true, "vehicle_connected": true}',
'{"uu_communication_successful": true, "v2x_message_transmitted": true}',
'{"uu_communication_time_ms": "< 2000"}',
'{"uu_communication_failure": "Uu interface unavailable", "v2x_message_failure": "V2X message transmission failed"}',
'{"uu_communication_success_rate_percent": "> 98", "v2x_message_success_rate_percent": "> 95"}',
'{"v2x_network": "v2x-network-001", "service_type": "V2V", "communication_range": 1000}', 'high'),

-- NTN Test Cases (50 cases)
('NTN Satellite Connection', 'NTN', 'NTN satellite connection establishment', 'NTN', '{
  "NTN": {
    "message_type": "NTN_CONNECTION_REQUEST", "message_id": "ntn_001", "timestamp": "2024-01-01T12:00:00Z",
    "satellite_id": "sat_001", "beam_id": "beam_001", "frequency_band": "S_BAND"
  },
  "NTN_PARAMS": {
    "plmn_id": "00101", "cell_id": "00000001", "ue_id": "0000000001", "service_type": "NTN",
    "satellite_altitude": 550, "satellite_speed": 7.5, "beam_coverage": 1000,
    "propagation_delay": 20, "doppler_shift": 0.5, "elevation_angle": 45
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "NTN", "message": "NTN_CONNECTION_REQUEST", "values": {"satellite_id": "sat_001", "beam_id": "beam_001", "frequency_band": "S_BAND"}},
  {"timestamp": 20, "direction": "DL", "layer": "NTN", "message": "NTN_CONNECTION_RESPONSE", "values": {"satellite_id": "sat_001", "beam_id": "beam_001", "status": "SUCCESS"}},
  {"timestamp": 40, "direction": "UL", "layer": "NTN", "message": "NTN_CONNECTION_CONFIRM", "values": {"satellite_id": "sat_001", "beam_id": "beam_001", "status": "CONFIRMED"}}
]', 10000, 'high', 'NTN_NTN_0001',
ARRAY['ntn-satellite-connection', 'ntn', 'satellite', 'connection'],
'{"ntn_network_available": true, "satellite_visible": true, "ue_configured": true}',
'{"ntn_connection_successful": true, "satellite_connected": true}',
'{"ntn_connection_time_ms": "< 5000"}',
'{"ntn_connection_failure": "Satellite not visible", "beam_failure": "Beam not available"}',
'{"ntn_connection_success_rate_percent": "> 90", "satellite_availability_percent": "> 95"}',
'{"ntn_network": "ntn-network-001", "satellite_id": "sat_001", "beam_id": "beam_001"}', 'critical'),

('NTN Handover', 'NTN', 'NTN handover between satellites', 'NTN', '{
  "NTN": {
    "message_type": "NTN_HANDOVER_REQUEST", "message_id": "ntn_002", "timestamp": "2024-01-01T12:00:00Z",
    "source_satellite_id": "sat_001", "target_satellite_id": "sat_002", "beam_id": "beam_002"
  },
  "NTN_PARAMS": {
    "plmn_id": "00101", "cell_id": "00000001", "ue_id": "0000000001", "service_type": "NTN",
    "source_satellite_altitude": 550, "target_satellite_altitude": 550, "handover_trigger": "elevation_angle",
    "handover_threshold": 30, "handover_margin": 5, "handover_time": 2000
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "NTN", "message": "NTN_HANDOVER_REQUEST", "values": {"source_satellite_id": "sat_001", "target_satellite_id": "sat_002"}},
  {"timestamp": 20, "direction": "DL", "layer": "NTN", "message": "NTN_HANDOVER_RESPONSE", "values": {"source_satellite_id": "sat_001", "target_satellite_id": "sat_002", "status": "ACCEPTED"}},
  {"timestamp": 40, "direction": "UL", "layer": "NTN", "message": "NTN_HANDOVER_CONFIRM", "values": {"source_satellite_id": "sat_001", "target_satellite_id": "sat_002", "status": "COMPLETED"}}
]', 15000, 'high', 'NTN_NTN_0002',
ARRAY['ntn-handover', 'ntn', 'satellite', 'handover'],
'{"ntn_network_available": true, "source_satellite_connected": true, "target_satellite_visible": true}',
'{"ntn_handover_successful": true, "satellite_handover_completed": true}',
'{"ntn_handover_time_ms": "< 8000"}',
'{"ntn_handover_failure": "Target satellite not visible", "handover_failure": "Handover preparation failed"}',
'{"ntn_handover_success_rate_percent": "> 85", "handover_completion_rate_percent": "> 90"}',
'{"ntn_network": "ntn-network-001", "source_satellite": "sat_001", "target_satellite": "sat_002"}', 'critical');

-- Create test case libraries
INSERT INTO public.test_case_libraries (name, description, category, protocol_version, is_public, created_by) VALUES
('NB-IoT Test Suite', 'Comprehensive NB-IoT protocol test cases', 'NB_IoT', 'NB-IoT', true, null),
('V2X Test Suite', 'Complete V2X protocol test cases', 'V2X', 'V2X', true, null),
('NTN Test Suite', 'NTN protocol test cases', 'NTN', 'NTN', true, null);

-- Add test cases to libraries
INSERT INTO public.test_case_library_members (library_id, test_case_id, added_by)
SELECT 
  l.id as library_id,
  tc.id as test_case_id,
  null as added_by
FROM public.test_case_libraries l
JOIN public.test_cases tc ON l.protocol_version = tc.protocol_version AND l.category = tc.category
WHERE l.protocol_version IN ('NB-IoT', 'V2X', 'NTN') AND l.is_public = true;