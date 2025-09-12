-- Detailed Test Case Seed Data
-- This file contains comprehensive 3GPP-compliant test cases with detailed messages, IEs, and layer parameters

-- ==============================================
-- 1. 5G NR INITIAL ACCESS TEST CASE
-- ==============================================

-- Insert the main test case
INSERT INTO public.test_cases (
    name, category, description, complexity, protocol_layers, test_data, expected_results,
    test_case_id, version, tags, priority, is_active
) VALUES (
    '5G NR Initial Access - Complete Flow',
    '5G_NR',
    'Complete 5G NR initial access procedure including RRC connection establishment, NAS registration, and PDU session establishment',
    'intermediate',
    ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'],
    '{"scenario": "initial_access", "ue_type": "smartphone", "cell_type": "macro", "band": "n78"}',
    '{"success_rate": 95, "latency_ms": 150, "throughput_mbps": 100}',
    '5NR_INIT_0001',
    '1.0',
    ARRAY['5G', 'NR', 'initial_access', 'RRC', 'NAS'],
    'high',
    true
) ON CONFLICT (test_case_id) DO NOTHING;

-- Get the test case ID for foreign key references
DO $$
DECLARE
    test_case_uuid UUID;
BEGIN
    SELECT id INTO test_case_uuid FROM public.test_cases WHERE test_case_id = '5NR_INIT_0001';
    
    -- Insert detailed messages for the test case
    INSERT INTO public.test_case_messages (
        test_case_id, step_id, step_order, timestamp_ms, direction, layer, protocol,
        message_type, message_name, message_description, standard_reference, release_version,
        dependencies, expected_response_step_id, timeout_ms, validation_criteria
    ) VALUES 
    -- Step 1: Random Access Preamble
    (test_case_uuid, 'step_1', 1, 0, 'UL', 'PHY', 'NR-PHY',
     'RandomAccessPreamble', 'RA Preamble', 'Random Access Preamble transmission',
     'TS 38.211 6.1.1', 'Release 17', '{}', 'step_2', 1000,
     '{"preamble_id": {"min": 0, "max": 63}, "ra_rnti": {"min": 1, "max": 65536}}'),
    
    -- Step 2: Random Access Response
    (test_case_uuid, 'step_2', 2, 1000, 'DL', 'PHY', 'NR-PHY',
     'RandomAccessResponse', 'RA Response', 'Random Access Response from gNB',
     'TS 38.211 6.1.2', 'Release 17', '{"step_1"}', 'step_3', 2000,
     '{"ra_rnti": {"min": 1, "max": 65536}, "ta": {"min": 0, "max": 1282}}'),
    
    -- Step 3: RRC Setup Request
    (test_case_uuid, 'step_3', 3, 2000, 'UL', 'RRC', 'NR-RRC',
     'RRCSetupRequest', 'RRC Setup Request', 'RRC Connection Setup Request',
     'TS 38.331 6.2.2', 'Release 17', '{"step_2"}', 'step_4', 5000,
     '{"establishment_cause": {"values": ["mo-Data", "mo-Signalling", "mt-Access"]}}'),
    
    -- Step 4: RRC Setup
    (test_case_uuid, 'step_4', 4, 3000, 'DL', 'RRC', 'NR-RRC',
     'RRCSetup', 'RRC Setup', 'RRC Connection Setup from gNB',
     'TS 38.331 6.2.2', 'Release 17', '{"step_3"}', 'step_5', 5000,
     '{"rrc_transaction_id": {"min": 0, "max": 3}}'),
    
    -- Step 5: RRC Setup Complete
    (test_case_uuid, 'step_5', 5, 4000, 'UL', 'RRC', 'NR-RRC',
     'RRCSetupComplete', 'RRC Setup Complete', 'RRC Connection Setup Complete',
     'TS 38.331 6.2.2', 'Release 17', '{"step_4"}', 'step_6', 5000,
     '{"rrc_transaction_id": {"min": 0, "max": 3}}'),
    
    -- Step 6: Registration Request
    (test_case_uuid, 'step_6', 6, 5000, 'UL', 'NAS', '5G-NAS',
     'RegistrationRequest', 'NAS Registration Request', '5G NAS Registration Request',
     'TS 24.501 8.2.1', 'Release 17', '{"step_5"}', 'step_7', 10000,
     '{"registration_type": {"values": ["initial", "mobility", "periodic"]}}'),
    
    -- Step 7: Registration Accept
    (test_case_uuid, 'step_7', 7, 6000, 'DL', 'NAS', '5G-NAS',
     'RegistrationAccept', 'NAS Registration Accept', '5G NAS Registration Accept',
     'TS 24.501 8.2.2', 'Release 17', '{"step_6"}', 'step_8', 10000,
     '{"nas_key_set_identifier": {"min": 0, "max": 7}}'),
    
    -- Step 8: PDU Session Establishment Request
    (test_case_uuid, 'step_8', 8, 7000, 'UL', 'NAS', '5G-NAS',
     'PDUSessionEstablishmentRequest', 'PDU Session Request', 'PDU Session Establishment Request',
     'TS 24.501 8.3.1', 'Release 17', '{"step_7"}', 'step_9', 15000,
     '{"pdu_session_id": {"min": 1, "max": 15}}'),
    
    -- Step 9: PDU Session Establishment Accept
    (test_case_uuid, 'step_9', 9, 8000, 'DL', 'NAS', '5G-NAS',
     'PDUSessionEstablishmentAccept', 'PDU Session Accept', 'PDU Session Establishment Accept',
     'TS 24.501 8.3.2', 'Release 17', '{"step_8"}', NULL, 15000,
     '{"pdu_session_id": {"min": 1, "max": 15}}')
    ON CONFLICT (test_case_id, step_id) DO NOTHING;
    
    -- Insert Information Elements for each message
    -- Step 1: Random Access Preamble IEs
    INSERT INTO public.test_case_information_elements (
        message_id, ie_name, ie_type, ie_size, ie_range, ie_value, ie_value_hex,
        mandatory, standard_reference, ie_description, validation_result, is_valid
    ) 
    SELECT 
        tcm.id,
        'preamble_id',
        'integer',
        6,
        '{"min": 0, "max": 63}',
        '{"value": 15}',
        '0F',
        true,
        'TS 38.211 6.1.1',
        'Random Access Preamble ID',
        '{"valid": true, "errors": [], "warnings": []}',
        true
    FROM public.test_case_messages tcm
    WHERE tcm.test_case_id = test_case_uuid AND tcm.step_id = 'step_1';
    
    INSERT INTO public.test_case_information_elements (
        message_id, ie_name, ie_type, ie_size, ie_range, ie_value, ie_value_hex,
        mandatory, standard_reference, ie_description, validation_result, is_valid
    ) 
    SELECT 
        tcm.id,
        'ra_rnti',
        'integer',
        16,
        '{"min": 1, "max": 65536}',
        '{"value": 12345}',
        '3039',
        true,
        'TS 38.211 6.1.1',
        'Random Access RNTI',
        '{"valid": true, "errors": [], "warnings": []}',
        true
    FROM public.test_case_messages tcm
    WHERE tcm.test_case_id = test_case_uuid AND tcm.step_id = 'step_1';
    
    -- Step 3: RRC Setup Request IEs
    INSERT INTO public.test_case_information_elements (
        message_id, ie_name, ie_type, ie_size, ie_range, ie_value, ie_value_hex,
        mandatory, standard_reference, ie_description, validation_result, is_valid
    ) 
    SELECT 
        tcm.id,
        'rrc_transaction_id',
        'integer',
        2,
        '{"min": 0, "max": 3}',
        '{"value": 1}',
        '01',
        true,
        'TS 38.331 6.2.2',
        'RRC Transaction Identifier',
        '{"valid": true, "errors": [], "warnings": []}',
        true
    FROM public.test_case_messages tcm
    WHERE tcm.test_case_id = test_case_uuid AND tcm.step_id = 'step_3';
    
    INSERT INTO public.test_case_information_elements (
        message_id, ie_name, ie_type, ie_size, ie_range, ie_value, ie_value_hex,
        mandatory, standard_reference, ie_description, validation_result, is_valid
    ) 
    SELECT 
        tcm.id,
        'establishment_cause',
        'enumerated',
        NULL,
        '{"values": ["mo-Data", "mo-Signalling", "mt-Access", "mo-VoiceCall", "mo-VideoCall"]}',
        '{"value": "mo-Data"}',
        '00',
        true,
        'TS 38.331 6.2.2',
        'Establishment Cause',
        '{"valid": true, "errors": [], "warnings": []}',
        true
    FROM public.test_case_messages tcm
    WHERE tcm.test_case_id = test_case_uuid AND tcm.step_id = 'step_3';
    
    INSERT INTO public.test_case_information_elements (
        message_id, ie_name, ie_type, ie_size, ie_range, ie_value, ie_value_hex,
        mandatory, standard_reference, ie_description, validation_result, is_valid
    ) 
    SELECT 
        tcm.id,
        'ue_identity',
        'choice',
        NULL,
        '{"choices": ["s-TMSI", "randomValue"]}',
        '{"choice": "s-TMSI", "value": "0010101234567890"}',
        '0010101234567890',
        true,
        'TS 38.331 6.2.2',
        'UE Identity',
        '{"valid": true, "errors": [], "warnings": []}',
        true
    FROM public.test_case_messages tcm
    WHERE tcm.test_case_id = test_case_uuid AND tcm.step_id = 'step_3';
    
    -- Insert Layer Parameters
    INSERT INTO public.test_case_layer_parameters (
        test_case_id, layer, layer_configuration, layer_capabilities, performance_parameters,
        expected_statistics, performance_metrics, standard_reference, compliance_level
    ) VALUES 
    -- PHY Layer Parameters
    (test_case_uuid, 'PHY', 
     '{"dl_arfcn": 3732480, "ul_arfcn": 3732480, "bandwidth": 100, "subcarrier_spacing": 30, "pci": 123, "cell_id": 123456}',
     '{"max_bandwidth": 100, "max_mimo_layers": 4, "supported_modulations": ["QPSK", "16QAM", "64QAM", "256QAM"], "carrier_aggregation": true}',
     '{"rsrp_target": -80, "rsrq_target": -10, "sinr_target": 15, "cqi_target": 12}',
     '{"rsrp": -85, "rsrq": -12, "sinr": 18, "cqi": 13, "mcs": 20, "bler": 0.01, "throughput": 150}',
     '{"latency_ms": 1, "throughput_mbps": 150, "reliability": 99.9}',
     'TS 38.211', 'full'),
    
    -- MAC Layer Parameters
    (test_case_uuid, 'MAC',
     '{"harq_enabled": true, "scheduling_algorithm": "proportional_fair", "max_retransmissions": 3, "max_harq_processes": 16}',
     '{"max_harq_processes": 16, "max_logical_channels": 32, "scheduling_modes": ["dynamic", "semi-persistent", "configured"]}',
     '{"harq_process_id": 5, "lcid": 1, "bsr_level": 2, "phr": 10}',
     '{"harq_processes": 8, "sched_requests": 2, "buffer_status_reports": 1, "random_access_attempts": 1}',
     '{"latency_ms": 2, "throughput_mbps": 150, "reliability": 99.8}',
     'TS 38.321', 'full'),
    
    -- RLC Layer Parameters
    (test_case_uuid, 'RLC',
     '{"rlc_mode": "AM", "max_retransmissions": 3, "polling_interval": 100, "window_size": 1024}',
     '{"modes": ["AM", "UM", "TM"], "max_sequence_number": 4095, "segmentation": true}',
     '{"sn": 100, "si": "completeSDU", "p": false}',
     '{"tx_pdus": 50, "rx_pdus": 50, "retransmissions": 2, "out_of_order": 0}',
     '{"latency_ms": 3, "throughput_mbps": 150, "reliability": 99.7}',
     'TS 38.322', 'full'),
    
    -- PDCP Layer Parameters
    (test_case_uuid, 'PDCP',
     '{"pdcp_mode": "AM", "security_enabled": true, "integrity_protection": true, "ciphering": true}',
     '{"max_sequence_number": 4095, "security_algorithms": ["AES-128", "AES-256"], "compression": true}',
     '{"pdcp_sn": 200, "d_c": true, "rohc_profile": 1}',
     '{"tx_packets": 100, "rx_packets": 100, "dropped_packets": 0, "duplicate_packets": 0}',
     '{"latency_ms": 4, "throughput_mbps": 150, "reliability": 99.6}',
     'TS 38.323', 'full'),
    
    -- RRC Layer Parameters
    (test_case_uuid, 'RRC',
     '{"rrc_state": "RRC_CONNECTED", "security_activated": true, "mobility_management": "enabled"}',
     '{"states": ["RRC_IDLE", "RRC_INACTIVE", "RRC_CONNECTED"], "security_algorithms": ["AES-128", "AES-256"]}',
     '{"rrc_transaction_id": 1, "establishment_cause": "mo-Data", "ue_identity": "0010101234567890"}',
     '{"rrc_setup_requests": 1, "rrc_setup_complete": 1, "rrc_reconfigurations": 0}',
     '{"latency_ms": 5, "throughput_mbps": 150, "reliability": 99.5}',
     'TS 38.331', 'full'),
    
    -- NAS Layer Parameters
    (test_case_uuid, 'NAS',
     '{"nas_state": "REGISTERED", "security_context": "activated", "mobility_management": "enabled"}',
     '{"states": ["DEREGISTERED", "REGISTERED", "DEREGISTERED_INITIATED"], "security_algorithms": ["AES-128", "AES-256"]}',
     '{"nas_key_set_identifier": 1, "registration_type": "initial", "mobile_identity": "0010101234567890"}',
     '{"registration_requests": 1, "registration_accepts": 1, "pdu_session_requests": 1}',
     '{"latency_ms": 10, "throughput_mbps": 150, "reliability": 99.4}',
     'TS 24.501', 'full')
    ON CONFLICT (test_case_id, layer) DO NOTHING;
    
    -- Insert Protocol Specific Data
    INSERT INTO public.test_case_rrc_data (
        test_case_id, rrc_configuration, rrc_procedures, rrc_timers, rrc_counters,
        initial_rrc_state, final_rrc_state, state_transitions, rrc_messages, rrc_measurements,
        standard_reference, release_version
    ) VALUES (
        test_case_uuid,
        '{"rrc_state": "RRC_CONNECTED", "security_activated": true, "mobility_management": "enabled", "measurement_config": "enabled"}',
        '{"rrc_setup": "completed", "rrc_reconfiguration": "pending", "rrc_release": "not_initiated"}',
        '{"t300": 1000, "t301": 1000, "t310": 1000, "t311": 1000}',
        '{"rrc_setup_requests": 1, "rrc_setup_complete": 1, "rrc_reconfigurations": 0}',
        'RRC_IDLE',
        'RRC_CONNECTED',
        '{"RRC_IDLE": {"timestamp": 0}, "RRC_CONNECTED": {"timestamp": 4000}}',
        '{"RRCSetupRequest": {"timestamp": 2000}, "RRCSetup": {"timestamp": 3000}, "RRCSetupComplete": {"timestamp": 4000}}',
        '{"rsrp": -85, "rsrq": -12, "sinr": 18, "cqi": 13}',
        'TS 38.331',
        'Release 17'
    ) ON CONFLICT (test_case_id) DO NOTHING;
    
    INSERT INTO public.test_case_nas_data (
        test_case_id, nas_configuration, nas_procedures, nas_security, nas_mobility,
        initial_nas_state, final_nas_state, state_transitions, nas_messages, nas_identities,
        standard_reference, release_version
    ) VALUES (
        test_case_uuid,
        '{"nas_state": "REGISTERED", "security_context": "activated", "mobility_management": "enabled"}',
        '{"registration": "completed", "pdu_session_establishment": "completed", "deregistration": "not_initiated"}',
        '{"security_activated": true, "integrity_protection": true, "ciphering": true, "nas_key_set_identifier": 1}',
        '{"tracking_area": "123456", "plmn": {"mcc": "001", "mnc": "01"}, "cell_id": "123456"}',
        'DEREGISTERED',
        'REGISTERED',
        '{"DEREGISTERED": {"timestamp": 0}, "REGISTERED": {"timestamp": 6000}}',
        '{"RegistrationRequest": {"timestamp": 5000}, "RegistrationAccept": {"timestamp": 6000}, "PDUSessionEstablishmentRequest": {"timestamp": 7000}}',
        '{"5g_guti": "0010101234567890", "suci": "0010101234567890", "supi": "0010101234567890"}',
        'TS 24.501',
        'Release 17'
    ) ON CONFLICT (test_case_id) DO NOTHING;
    
END $$;

-- ==============================================
-- 2. 4G LTE HANDOVER TEST CASE
-- ==============================================

-- Insert 4G LTE Handover test case
INSERT INTO public.test_cases (
    name, category, description, complexity, protocol_layers, test_data, expected_results,
    test_case_id, version, tags, priority, is_active
) VALUES (
    '4G LTE Intra-eNB Handover',
    '4G_LTE',
    'Intra-eNodeB handover procedure for 4G LTE networks with detailed message flow',
    'intermediate',
    ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC'],
    '{"scenario": "handover", "handover_type": "intra_enb", "mobility": "medium", "band": "B3"}',
    '{"success_rate": 98, "handover_time_ms": 50, "interruption_time_ms": 10}',
    '4LT_HO_0001',
    '1.0',
    ARRAY['4G', 'LTE', 'handover', 'mobility', 'RRC'],
    'high',
    true
) ON CONFLICT (test_case_id) DO NOTHING;

-- Get the test case ID for 4G LTE handover
DO $$
DECLARE
    test_case_uuid UUID;
BEGIN
    SELECT id INTO test_case_uuid FROM public.test_cases WHERE test_case_id = '4LT_HO_0001';
    
    -- Insert detailed messages for 4G LTE handover
    INSERT INTO public.test_case_messages (
        test_case_id, step_id, step_order, timestamp_ms, direction, layer, protocol,
        message_type, message_name, message_description, standard_reference, release_version,
        dependencies, expected_response_step_id, timeout_ms, validation_criteria
    ) VALUES 
    -- Step 1: Measurement Report
    (test_case_uuid, 'step_1', 1, 0, 'UL', 'RRC', 'LTE-RRC',
     'MeasurementReport', 'Measurement Report', 'Measurement Report from UE',
     'TS 36.331 6.2.2', 'Release 15', '{}', 'step_2', 5000,
     '{"meas_id": {"min": 1, "max": 32}, "rsrp": {"min": -140, "max": -44}}'),
    
    -- Step 2: RRC Connection Reconfiguration
    (test_case_uuid, 'step_2', 2, 1000, 'DL', 'RRC', 'LTE-RRC',
     'RRCConnectionReconfiguration', 'RRC Reconfiguration', 'RRC Connection Reconfiguration for Handover',
     'TS 36.331 6.2.2', 'Release 15', '{"step_1"}', 'step_3', 10000,
     '{"rrc_transaction_id": {"min": 0, "max": 3}}'),
    
    -- Step 3: RRC Connection Reconfiguration Complete
    (test_case_uuid, 'step_3', 3, 2000, 'UL', 'RRC', 'LTE-RRC',
     'RRCConnectionReconfigurationComplete', 'RRC Reconfig Complete', 'RRC Connection Reconfiguration Complete',
     'TS 36.331 6.2.2', 'Release 15', '{"step_2"}', NULL, 10000,
     '{"rrc_transaction_id": {"min": 0, "max": 3}}')
    ON CONFLICT (test_case_id, step_id) DO NOTHING;
    
    -- Insert Information Elements for 4G LTE handover
    INSERT INTO public.test_case_information_elements (
        message_id, ie_name, ie_type, ie_size, ie_range, ie_value, ie_value_hex,
        mandatory, standard_reference, ie_description, validation_result, is_valid
    ) 
    SELECT 
        tcm.id,
        'meas_id',
        'integer',
        5,
        '{"min": 1, "max": 32}',
        '{"value": 1}',
        '01',
        true,
        'TS 36.331 6.2.2',
        'Measurement ID',
        '{"valid": true, "errors": [], "warnings": []}',
        true
    FROM public.test_case_messages tcm
    WHERE tcm.test_case_id = test_case_uuid AND tcm.step_id = 'step_1';
    
    INSERT INTO public.test_case_information_elements (
        message_id, ie_name, ie_type, ie_size, ie_range, ie_value, ie_value_hex,
        mandatory, standard_reference, ie_description, validation_result, is_valid
    ) 
    SELECT 
        tcm.id,
        'rsrp',
        'integer',
        7,
        '{"min": -140, "max": -44}',
        '{"value": -85}',
        'AB',
        true,
        'TS 36.331 6.2.2',
        'Reference Signal Received Power',
        '{"valid": true, "errors": [], "warnings": []}',
        true
    FROM public.test_case_messages tcm
    WHERE tcm.test_case_id = test_case_uuid AND tcm.step_id = 'step_1';
    
    -- Insert Layer Parameters for 4G LTE
    INSERT INTO public.test_case_layer_parameters (
        test_case_id, layer, layer_configuration, layer_capabilities, performance_parameters,
        expected_statistics, performance_metrics, standard_reference, compliance_level
    ) VALUES 
    -- PHY Layer Parameters for 4G LTE
    (test_case_uuid, 'PHY', 
     '{"dl_earfcn": 1800, "ul_earfcn": 1800, "bandwidth": 20, "pci": 123, "cell_id": 123456}',
     '{"max_bandwidth": 20, "max_mimo_layers": 4, "supported_modulations": ["QPSK", "16QAM", "64QAM"], "carrier_aggregation": true}',
     '{"rsrp_target": -80, "rsrq_target": -10, "sinr_target": 15, "cqi_target": 12}',
     '{"rsrp": -85, "rsrq": -12, "sinr": 18, "cqi": 13, "mcs": 20, "bler": 0.01, "throughput": 100}',
     '{"latency_ms": 1, "throughput_mbps": 100, "reliability": 99.9}',
     'TS 36.211', 'full'),
    
    -- RRC Layer Parameters for 4G LTE
    (test_case_uuid, 'RRC',
     '{"rrc_state": "RRC_CONNECTED", "security_activated": true, "mobility_management": "enabled"}',
     '{"states": ["RRC_IDLE", "RRC_CONNECTED"], "security_algorithms": ["AES-128", "AES-256"]}',
     '{"rrc_transaction_id": 1, "meas_id": 1, "rsrp": -85}',
     '{"measurement_reports": 1, "rrc_reconfigurations": 1, "handover_complete": 1}',
     '{"latency_ms": 5, "throughput_mbps": 100, "reliability": 99.5}',
     'TS 36.331', 'full')
    ON CONFLICT (test_case_id, layer) DO NOTHING;
    
END $$;

-- ==============================================
-- 3. IMS SIP REGISTRATION TEST CASE
-- ==============================================

-- Insert IMS SIP Registration test case
INSERT INTO public.test_cases (
    name, category, description, complexity, protocol_layers, test_data, expected_results,
    test_case_id, version, tags, priority, is_active
) VALUES (
    'IMS SIP User Registration',
    'IMS_SIP',
    'IMS SIP user registration procedure with detailed SIP message flow',
    'intermediate',
    ARRAY['SIP', 'IMS', 'DIAMETER'],
    '{"scenario": "sip_registration", "ue_type": "voip_client", "network": "ims", "service": "voice"}',
    '{"success_rate": 99, "registration_time_ms": 200, "authentication": "successful"}',
    'IMS_REG_0001',
    '1.0',
    ARRAY['IMS', 'SIP', 'registration', 'voip', 'DIAMETER'],
    'high',
    true
) ON CONFLICT (test_case_id) DO NOTHING;

-- Get the test case ID for IMS SIP registration
DO $$
DECLARE
    test_case_uuid UUID;
BEGIN
    SELECT id INTO test_case_uuid FROM public.test_cases WHERE test_case_id = 'IMS_REG_0001';
    
    -- Insert detailed messages for IMS SIP registration
    INSERT INTO public.test_case_messages (
        test_case_id, step_id, step_order, timestamp_ms, direction, layer, protocol,
        message_type, message_name, message_description, standard_reference, release_version,
        dependencies, expected_response_step_id, timeout_ms, validation_criteria
    ) VALUES 
    -- Step 1: SIP REGISTER Request
    (test_case_uuid, 'step_1', 1, 0, 'UL', 'SIP', 'SIP',
     'REGISTER', 'SIP REGISTER', 'SIP REGISTER Request',
     'RFC 3261 10.1', 'RFC 3261', '{}', 'step_2', 30000,
     '{"method": "REGISTER", "uri": "sip:ims.mnc001.mcc001.3gppnetwork.org"}'),
    
    -- Step 2: SIP 401 Unauthorized
    (test_case_uuid, 'step_2', 2, 1000, 'DL', 'SIP', 'SIP',
     '401 Unauthorized', 'SIP 401', 'SIP 401 Unauthorized Response',
     'RFC 3261 10.4.2', 'RFC 3261', '{"step_1"}', 'step_3', 30000,
     '{"status_code": 401, "reason_phrase": "Unauthorized"}'),
    
    -- Step 3: SIP REGISTER with Authentication
    (test_case_uuid, 'step_3', 3, 2000, 'UL', 'SIP', 'SIP',
     'REGISTER', 'SIP REGISTER Auth', 'SIP REGISTER with Authentication',
     'RFC 3261 10.1', 'RFC 3261', '{"step_2"}', 'step_4', 30000,
     '{"method": "REGISTER", "authorization": "Digest"}'),
    
    -- Step 4: SIP 200 OK
    (test_case_uuid, 'step_4', 4, 3000, 'DL', 'SIP', 'SIP',
     '200 OK', 'SIP 200 OK', 'SIP 200 OK Response',
     'RFC 3261 10.2.2', 'RFC 3261', '{"step_3"}', NULL, 30000,
     '{"status_code": 200, "reason_phrase": "OK"}')
    ON CONFLICT (test_case_id, step_id) DO NOTHING;
    
    -- Insert Information Elements for IMS SIP
    INSERT INTO public.test_case_information_elements (
        message_id, ie_name, ie_type, ie_size, ie_range, ie_value, ie_value_hex,
        mandatory, standard_reference, ie_description, validation_result, is_valid
    ) 
    SELECT 
        tcm.id,
        'method',
        'enumerated',
        NULL,
        '{"values": ["REGISTER", "INVITE", "BYE", "CANCEL", "ACK", "OPTIONS"]}',
        '{"value": "REGISTER"}',
        'REGISTER',
        true,
        'RFC 3261 7.1',
        'SIP Method',
        '{"valid": true, "errors": [], "warnings": []}',
        true
    FROM public.test_case_messages tcm
    WHERE tcm.test_case_id = test_case_uuid AND tcm.step_id = 'step_1';
    
    INSERT INTO public.test_case_information_elements (
        message_id, ie_name, ie_type, ie_size, ie_range, ie_value, ie_value_hex,
        mandatory, standard_reference, ie_description, validation_result, is_valid
    ) 
    SELECT 
        tcm.id,
        'uri',
        'octetstring',
        NULL,
        '{"format": "sip:domain"}',
        '{"value": "sip:ims.mnc001.mcc001.3gppnetwork.org"}',
        'sip:ims.mnc001.mcc001.3gppnetwork.org',
        true,
        'RFC 3261 19.1',
        'SIP URI',
        '{"valid": true, "errors": [], "warnings": []}',
        true
    FROM public.test_case_messages tcm
    WHERE tcm.test_case_id = test_case_uuid AND tcm.step_id = 'step_1';
    
    -- Insert Layer Parameters for IMS SIP
    INSERT INTO public.test_case_layer_parameters (
        test_case_id, layer, layer_configuration, layer_capabilities, performance_parameters,
        expected_statistics, performance_metrics, standard_reference, compliance_level
    ) VALUES 
    -- SIP Layer Parameters
    (test_case_uuid, 'SIP',
     '{"sip_version": "2.0", "transport": "UDP", "port": 5060, "authentication": "Digest"}',
     '{"methods": ["REGISTER", "INVITE", "BYE", "CANCEL", "ACK", "OPTIONS"], "extensions": ["100rel", "replaces"]}',
     '{"registration_interval": 3600, "max_forwards": 70, "session_timer": 1800}',
     '{"register_requests": 1, "register_responses": 1, "authentication_challenges": 1}',
     '{"latency_ms": 200, "throughput_mbps": 1, "reliability": 99.9}',
     'RFC 3261', 'full'),
    
    -- IMS Layer Parameters
    (test_case_uuid, 'IMS',
     '{"ims_version": "3GPP Release 15", "service_profile": "voice", "authentication": "AKA"}',
     '{"services": ["voice", "video", "messaging"], "authentication_methods": ["AKA", "Digest"]}',
     '{"registration_interval": 3600, "session_timer": 1800, "max_registrations": 10}',
     '{"registrations": 1, "authentication_success": 1, "service_activation": 1}',
     '{"latency_ms": 200, "throughput_mbps": 1, "reliability": 99.9}',
     'TS 24.229', 'full')
    ON CONFLICT (test_case_id, layer) DO NOTHING;
    
END $$;

-- ==============================================
-- 4. VERIFICATION
-- ==============================================

-- Verify the detailed test case data
DO $$
DECLARE
    test_case_count INTEGER;
    message_count INTEGER;
    ie_count INTEGER;
    layer_param_count INTEGER;
BEGIN
    -- Count test cases
    SELECT COUNT(*) INTO test_case_count
    FROM public.test_cases
    WHERE test_case_id IN ('5NR_INIT_0001', '4LT_HO_0001', 'IMS_REG_0001');
    
    -- Count messages
    SELECT COUNT(*) INTO message_count
    FROM public.test_case_messages tcm
    JOIN public.test_cases tc ON tcm.test_case_id = tc.id
    WHERE tc.test_case_id IN ('5NR_INIT_0001', '4LT_HO_0001', 'IMS_REG_0001');
    
    -- Count information elements
    SELECT COUNT(*) INTO ie_count
    FROM public.test_case_information_elements tcie
    JOIN public.test_case_messages tcm ON tcie.message_id = tcm.id
    JOIN public.test_cases tc ON tcm.test_case_id = tc.id
    WHERE tc.test_case_id IN ('5NR_INIT_0001', '4LT_HO_0001', 'IMS_REG_0001');
    
    -- Count layer parameters
    SELECT COUNT(*) INTO layer_param_count
    FROM public.test_case_layer_parameters tclp
    JOIN public.test_cases tc ON tclp.test_case_id = tc.id
    WHERE tc.test_case_id IN ('5NR_INIT_0001', '4LT_HO_0001', 'IMS_REG_0001');
    
    RAISE NOTICE '✅ Detailed test case data verification:';
    RAISE NOTICE '   Test Cases: %', test_case_count;
    RAISE NOTICE '   Messages: %', message_count;
    RAISE NOTICE '   Information Elements: %', ie_count;
    RAISE NOTICE '   Layer Parameters: %', layer_param_count;
    
    IF test_case_count >= 3 AND message_count >= 10 AND ie_count >= 15 AND layer_param_count >= 8 THEN
        RAISE NOTICE '🎉 All detailed test case data created successfully!';
    ELSE
        RAISE NOTICE '❌ Some detailed test case data may be missing';
    END IF;
END $$;