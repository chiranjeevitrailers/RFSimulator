-- ==============================================
-- 5GLabX Platform - Comprehensive Test Cases Seed Data
-- Production-ready test cases for commercial launch
-- ==============================================

-- Get category IDs for foreign key references
DO $$
DECLARE
    category_5g_nr UUID;
    category_4g_lte UUID;
    category_ims_sip UUID;
    category_oran UUID;
    category_nbiot UUID;
    category_v2x UUID;
    category_ntn UUID;
    category_custom UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO category_5g_nr FROM public.test_case_categories WHERE name = '5G_NR';
    SELECT id INTO category_4g_lte FROM public.test_case_categories WHERE name = '4G_LTE';
    SELECT id INTO category_ims_sip FROM public.test_case_categories WHERE name = 'IMS_SIP';
    SELECT id INTO category_oran FROM public.test_case_categories WHERE name = 'O_RAN';
    SELECT id INTO category_nbiot FROM public.test_case_categories WHERE name = 'NB_IoT';
    SELECT id INTO category_v2x FROM public.test_case_categories WHERE name = 'V2X';
    SELECT id INTO category_ntn FROM public.test_case_categories WHERE name = 'NTN';
    SELECT id INTO category_custom FROM public.test_case_categories WHERE name = 'CUSTOM';

    -- ==============================================
    -- 1. 5G NR TEST CASES
    -- ==============================================

    -- 5G NR Initial Access Test Case
    INSERT INTO public.test_cases (
        test_case_id, name, description, category_id, category, protocol, version,
        complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
        test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
        is_premium, is_featured, is_active
    ) VALUES (
        '5NR_INIT_0001',
        '5G NR Initial Access - Complete Flow',
        'Complete 5G NR initial access procedure including RRC connection establishment, NAS registration, and PDU session establishment',
        category_5g_nr,
        '5G_NR',
        'NR',
        '1.0',
        'intermediate',
        'functional',
        15,
        0.05,
        ARRAY['5G', 'NR', 'initial_access', 'RRC', 'NAS', 'PDU_session'],
        ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'],
        '{"scenario": "initial_access", "ue_type": "smartphone", "cell_type": "macro", "band": "n78", "bandwidth": "100MHz"}',
        '{"success_rate": 95, "latency_ms": 150, "throughput_mbps": 100, "registration_success": true, "pdu_session_established": true}',
        '{"registration_success": true, "pdu_session_established": true, "latency_ms": {"max": 200}}',
        '{"registration_failure": false, "pdu_session_failure": false, "latency_ms": {"max": 500}}',
        '{"latency_ms": {"target": 150, "max": 200}, "throughput_mbps": {"target": 100, "min": 50}}',
        false,
        true,
        true
    ) ON CONFLICT (test_case_id) DO NOTHING;

    -- 5G NR Handover Test Case
    INSERT INTO public.test_cases (
        test_case_id, name, description, category_id, category, protocol, version,
        complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
        test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
        is_premium, is_featured, is_active
    ) VALUES (
        '5NR_HO_0001',
        '5G NR Handover - Xn-based Handover',
        '5G NR Xn-based handover procedure with measurement reporting and handover execution',
        category_5g_nr,
        '5G_NR',
        'NR',
        '1.0',
        'advanced',
        'mobility',
        20,
        0.08,
        ARRAY['5G', 'NR', 'handover', 'Xn', 'mobility', 'measurement'],
        ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC'],
        '{"scenario": "handover", "handover_type": "Xn_based", "measurement_config": "enabled", "target_cell": "neighbor_cell"}',
        '{"handover_success": true, "handover_latency_ms": 50, "data_loss_ms": 0, "throughput_after_handover_mbps": 95}',
        '{"handover_success": true, "handover_latency_ms": {"max": 100}, "data_loss_ms": {"max": 10}}',
        '{"handover_failure": false, "handover_latency_ms": {"max": 200}, "data_loss_ms": {"max": 50}}',
        '{"handover_latency_ms": {"target": 50, "max": 100}, "throughput_after_handover_mbps": {"target": 95, "min": 80}}',
        true,
        true,
        true
    ) ON CONFLICT (test_case_id) DO NOTHING;

    -- 5G NR Performance Test Case
    INSERT INTO public.test_cases (
        test_case_id, name, description, category_id, category, protocol, version,
        complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
        test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
        is_premium, is_featured, is_active
    ) VALUES (
        '5NR_PERF_0001',
        '5G NR Performance - High Throughput',
        '5G NR high throughput performance testing with MIMO and carrier aggregation',
        category_5g_nr,
        '5G_NR',
        'NR',
        '1.0',
        'expert',
        'performance',
        30,
        0.15,
        ARRAY['5G', 'NR', 'performance', 'throughput', 'MIMO', 'carrier_aggregation'],
        ARRAY['PHY', 'MAC', 'RLC', 'PDCP'],
        '{"scenario": "high_throughput", "mimo_layers": 4, "carrier_aggregation": true, "modulation": "256QAM", "bandwidth": "100MHz"}',
        '{"peak_throughput_mbps": 2000, "average_throughput_mbps": 1800, "latency_ms": 1, "bler_percent": 0.1}',
        '{"peak_throughput_mbps": {"min": 1500}, "average_throughput_mbps": {"min": 1200}, "latency_ms": {"max": 5}}',
        '{"peak_throughput_mbps": {"min": 1000}, "average_throughput_mbps": {"min": 800}, "latency_ms": {"max": 20}}',
        '{"peak_throughput_mbps": {"target": 2000, "min": 1500}, "average_throughput_mbps": {"target": 1800, "min": 1200}}',
        true,
        true,
        true
    ) ON CONFLICT (test_case_id) DO NOTHING;

    -- ==============================================
    -- 2. 4G LTE TEST CASES
    -- ==============================================

    -- 4G LTE Initial Access Test Case
    INSERT INTO public.test_cases (
        test_case_id, name, description, category_id, category, protocol, version,
        complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
        test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
        is_premium, is_featured, is_active
    ) VALUES (
        '4LTE_INIT_0001',
        '4G LTE Initial Access - Complete Flow',
        'Complete 4G LTE initial access procedure including RRC connection establishment and EPS bearer setup',
        category_4g_lte,
        '4G_LTE',
        'LTE',
        '1.0',
        'beginner',
        'functional',
        10,
        0.03,
        ARRAY['4G', 'LTE', 'initial_access', 'RRC', 'EPS_bearer'],
        ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'],
        '{"scenario": "initial_access", "ue_type": "smartphone", "cell_type": "macro", "band": "band_3", "bandwidth": "20MHz"}',
        '{"success_rate": 98, "latency_ms": 100, "throughput_mbps": 50, "rrc_connected": true, "eps_bearer_established": true}',
        '{"rrc_connected": true, "eps_bearer_established": true, "latency_ms": {"max": 150}}',
        '{"rrc_connection_failure": false, "eps_bearer_failure": false, "latency_ms": {"max": 300}}',
        '{"latency_ms": {"target": 100, "max": 150}, "throughput_mbps": {"target": 50, "min": 30}}',
        false,
        true,
        true
    ) ON CONFLICT (test_case_id) DO NOTHING;

    -- 4G LTE Handover Test Case
    INSERT INTO public.test_cases (
        test_case_id, name, description, category_id, category, protocol, version,
        complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
        test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
        is_premium, is_featured, is_active
    ) VALUES (
        '4LTE_HO_0001',
        '4G LTE Handover - X2-based Handover',
        '4G LTE X2-based handover procedure with measurement reporting and handover execution',
        category_4g_lte,
        '4G_LTE',
        'LTE',
        '1.0',
        'intermediate',
        'mobility',
        15,
        0.06,
        ARRAY['4G', 'LTE', 'handover', 'X2', 'mobility', 'measurement'],
        ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC'],
        '{"scenario": "handover", "handover_type": "X2_based", "measurement_config": "enabled", "target_cell": "neighbor_cell"}',
        '{"handover_success": true, "handover_latency_ms": 40, "data_loss_ms": 0, "throughput_after_handover_mbps": 45}',
        '{"handover_success": true, "handover_latency_ms": {"max": 80}, "data_loss_ms": {"max": 5}}',
        '{"handover_failure": false, "handover_latency_ms": {"max": 150}, "data_loss_ms": {"max": 20}}',
        '{"handover_latency_ms": {"target": 40, "max": 80}, "throughput_after_handover_mbps": {"target": 45, "min": 35}}',
        true,
        false,
        true
    ) ON CONFLICT (test_case_id) DO NOTHING;

    -- ==============================================
    -- 3. IMS/SIP TEST CASES
    -- ==============================================

    -- IMS Registration Test Case
    INSERT INTO public.test_cases (
        test_case_id, name, description, category_id, category, protocol, version,
        complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
        test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
        is_premium, is_featured, is_active
    ) VALUES (
        'IMS_REG_0001',
        'IMS Registration - Complete Flow',
        'Complete IMS registration procedure including SIP REGISTER and authentication',
        category_ims_sip,
        'IMS_SIP',
        'SIP',
        '1.0',
        'intermediate',
        'functional',
        12,
        0.04,
        ARRAY['IMS', 'SIP', 'registration', 'authentication', 'AKA'],
        ARRAY['SIP', 'IMS', 'NAS'],
        '{"scenario": "ims_registration", "authentication": "AKA", "service_profile": ["voice", "video"], "network_domain": "ims.mnc001.mcc001.3gppnetwork.org"}',
        '{"registration_success": true, "registration_latency_ms": 200, "authentication_success": true, "service_profile_activated": true}',
        '{"registration_success": true, "authentication_success": true, "registration_latency_ms": {"max": 300}}',
        '{"registration_failure": false, "authentication_failure": false, "registration_latency_ms": {"max": 600}}',
        '{"registration_latency_ms": {"target": 200, "max": 300}, "authentication_success_rate": {"target": 100, "min": 95}}',
        true,
        true,
        true
    ) ON CONFLICT (test_case_id) DO NOTHING;

    -- SIP Call Setup Test Case
    INSERT INTO public.test_cases (
        test_case_id, name, description, category_id, category, protocol, version,
        complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
        test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
        is_premium, is_featured, is_active
    ) VALUES (
        'SIP_CALL_0001',
        'SIP Call Setup - Voice Call',
        'SIP voice call setup procedure including INVITE, 180 Ringing, and 200 OK',
        category_ims_sip,
        'IMS_SIP',
        'SIP',
        '1.0',
        'beginner',
        'functional',
        8,
        0.03,
        ARRAY['SIP', 'call_setup', 'voice', 'INVITE', 'RTP'],
        ARRAY['SIP', 'RTP'],
        '{"scenario": "voice_call", "call_type": "voice", "codec": "AMR", "media_type": "audio"}',
        '{"call_setup_success": true, "call_setup_latency_ms": 150, "media_established": true, "call_quality": "good"}',
        '{"call_setup_success": true, "media_established": true, "call_setup_latency_ms": {"max": 250}}',
        '{"call_setup_failure": false, "media_failure": false, "call_setup_latency_ms": {"max": 500}}',
        '{"call_setup_latency_ms": {"target": 150, "max": 250}, "call_quality": {"target": "good", "min": "acceptable"}}',
        false,
        true,
        true
    ) ON CONFLICT (test_case_id) DO NOTHING;

    -- ==============================================
    -- 4. O-RAN TEST CASES
    -- ==============================================

    -- O-RAN E2 Interface Test Case
    INSERT INTO public.test_cases (
        test_case_id, name, description, category_id, category, protocol, version,
        complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
        test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
        is_premium, is_featured, is_active
    ) VALUES (
        'ORAN_E2_0001',
        'O-RAN E2 Interface - Service Model Testing',
        'O-RAN E2 interface testing with service model validation and performance monitoring',
        category_oran,
        'O_RAN',
        'E2',
        '1.0',
        'expert',
        'interoperability',
        25,
        0.12,
        ARRAY['O-RAN', 'E2', 'service_model', 'interoperability', 'performance'],
        ARRAY['E2', 'RRC', 'MAC', 'PHY'],
        '{"scenario": "e2_interface", "service_model": "E2SM-KPM", "interface_type": "E2", "performance_metrics": ["throughput", "latency", "error_rate"]}',
        '{"e2_interface_success": true, "service_model_validation": true, "performance_monitoring": true, "latency_ms": 10}',
        '{"e2_interface_success": true, "service_model_validation": true, "latency_ms": {"max": 20}}',
        '{"e2_interface_failure": false, "service_model_validation_failure": false, "latency_ms": {"max": 50}}',
        '{"latency_ms": {"target": 10, "max": 20}, "service_model_compliance": {"target": 100, "min": 95}}',
        true,
        true,
        true
    ) ON CONFLICT (test_case_id) DO NOTHING;

    -- ==============================================
    -- 5. NB-IoT TEST CASES
    -- ==============================================

    -- NB-IoT Initial Access Test Case
    INSERT INTO public.test_cases (
        test_case_id, name, description, category_id, category, protocol, version,
        complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
        test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
        is_premium, is_featured, is_active
    ) VALUES (
        'NBIOT_INIT_0001',
        'NB-IoT Initial Access - Complete Flow',
        'NB-IoT initial access procedure optimized for IoT devices with extended coverage',
        category_nbiot,
        'NB_IoT',
        'NB-IoT',
        '1.0',
        'intermediate',
        'functional',
        18,
        0.07,
        ARRAY['NB-IoT', 'IoT', 'initial_access', 'coverage_extension', 'power_saving'],
        ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'],
        '{"scenario": "nbiot_initial_access", "device_type": "sensor", "coverage_class": "extended", "power_saving": "enabled"}',
        '{"access_success": true, "access_latency_ms": 500, "coverage_extension": true, "power_saving_active": true}',
        '{"access_success": true, "coverage_extension": true, "access_latency_ms": {"max": 1000}}',
        '{"access_failure": false, "coverage_extension_failure": false, "access_latency_ms": {"max": 2000}}',
        '{"access_latency_ms": {"target": 500, "max": 1000}, "power_efficiency": {"target": "high", "min": "medium"}}',
        true,
        false,
        true
    ) ON CONFLICT (test_case_id) DO NOTHING;

    -- ==============================================
    -- 6. V2X TEST CASES
    -- ==============================================

    -- V2X PC5 Communication Test Case
    INSERT INTO public.test_cases (
        test_case_id, name, description, category_id, category, protocol, version,
        complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
        test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
        is_premium, is_featured, is_active
    ) VALUES (
        'V2X_PC5_0001',
        'V2X PC5 Communication - Vehicle-to-Vehicle',
        'V2X PC5 direct communication between vehicles for safety applications',
        category_v2x,
        'V2X',
        'PC5',
        '1.0',
        'advanced',
        'functional',
        22,
        0.10,
        ARRAY['V2X', 'PC5', 'vehicle_to_vehicle', 'safety', 'direct_communication'],
        ARRAY['PC5', 'MAC', 'PHY'],
        '{"scenario": "v2v_communication", "communication_type": "PC5", "safety_application": "emergency_brake", "distance_m": 100}',
        '{"communication_success": true, "message_delivery_latency_ms": 20, "safety_application_triggered": true, "distance_accuracy_m": 5}',
        '{"communication_success": true, "safety_application_triggered": true, "message_delivery_latency_ms": {"max": 50}}',
        '{"communication_failure": false, "safety_application_failure": false, "message_delivery_latency_ms": {"max": 100}}',
        '{"message_delivery_latency_ms": {"target": 20, "max": 50}, "distance_accuracy_m": {"target": 5, "max": 10}}',
        true,
        true,
        true
    ) ON CONFLICT (test_case_id) DO NOTHING;

    -- ==============================================
    -- 7. NTN TEST CASES
    -- ==============================================

    -- NTN Satellite Communication Test Case
    INSERT INTO public.test_cases (
        test_case_id, name, description, category_id, category, protocol, version,
        complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
        test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
        is_premium, is_featured, is_active
    ) VALUES (
        'NTN_SAT_0001',
        'NTN Satellite Communication - LEO Constellation',
        'Non-Terrestrial Network communication via LEO satellite constellation',
        category_ntn,
        'NTN',
        'NTN',
        '1.0',
        'expert',
        'functional',
        35,
        0.18,
        ARRAY['NTN', 'satellite', 'LEO', 'constellation', 'coverage'],
        ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'],
        '{"scenario": "ntn_communication", "satellite_type": "LEO", "constellation": "Starlink", "altitude_km": 550, "coverage_area": "global"}',
        '{"communication_success": true, "handover_success": true, "latency_ms": 25, "coverage_availability": 95}',
        '{"communication_success": true, "handover_success": true, "latency_ms": {"max": 50}}',
        '{"communication_failure": false, "handover_failure": false, "latency_ms": {"max": 100}}',
        '{"latency_ms": {"target": 25, "max": 50}, "coverage_availability": {"target": 95, "min": 90}}',
        true,
        true,
        true
    ) ON CONFLICT (test_case_id) DO NOTHING;

    -- ==============================================
    -- 8. CUSTOM TEST CASES
    -- ==============================================

    -- Custom Protocol Test Case
    INSERT INTO public.test_cases (
        test_case_id, name, description, category_id, category, protocol, version,
        complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
        test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
        is_premium, is_featured, is_active
    ) VALUES (
        'CUSTOM_0001',
        'Custom Protocol - User Defined',
        'Custom protocol testing framework for user-defined protocols and scenarios',
        category_custom,
        'CUSTOM',
        'Custom',
        '1.0',
        'expert',
        'functional',
        60,
        0.30,
        ARRAY['custom', 'user_defined', 'protocol', 'framework'],
        ARRAY['Custom'],
        '{"scenario": "custom_protocol", "protocol_name": "user_defined", "custom_parameters": {}, "validation_rules": {}}',
        '{"custom_validation_success": true, "protocol_compliance": true, "performance_metrics": {}}',
        '{"custom_validation_success": true, "protocol_compliance": true}',
        '{"custom_validation_failure": false, "protocol_compliance_failure": false}',
        '{"custom_performance": {"target": "user_defined", "min": "user_defined"}}',
        true,
        false,
        true
    ) ON CONFLICT (test_case_id) DO NOTHING;

END $$;

-- ==============================================
-- INSERT DETAILED MESSAGES FOR TEST CASES
-- ==============================================

-- Insert messages for 5G NR Initial Access Test Case
DO $$
DECLARE
    test_case_uuid UUID;
BEGIN
    SELECT id INTO test_case_uuid FROM public.test_cases WHERE test_case_id = '5NR_INIT_0001';
    
    IF test_case_uuid IS NOT NULL THEN
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
         'RRCSetupRequest', 'RRC Setup Request', 'RRC Setup Request from UE',
         'TS 38.331 6.2.2', 'Release 17', '{"step_2"}', 'step_4', 5000,
         '{"ue_identity": {"type": "random_value"}, "establishment_cause": {"values": ["mo_Data", "mo_Signalling"]}}'),
        
        -- Step 4: RRC Setup
        (test_case_uuid, 'step_4', 4, 3000, 'DL', 'RRC', 'NR-RRC',
         'RRCSetup', 'RRC Setup', 'RRC Setup from gNB',
         'TS 38.331 6.2.2', 'Release 17', '{"step_3"}', 'step_5', 5000,
         '{"rrc_transaction_id": {"min": 0, "max": 3}, "radio_bearer_config": {"required": true}}'),
        
        -- Step 5: RRC Setup Complete
        (test_case_uuid, 'step_5', 5, 4000, 'UL', 'RRC', 'NR-RRC',
         'RRCSetupComplete', 'RRC Setup Complete', 'RRC Setup Complete from UE',
         'TS 38.331 6.2.2', 'Release 17', '{"step_4"}', 'step_6', 5000,
         '{"rrc_transaction_id": {"min": 0, "max": 3}, "selected_plmn_identity": {"required": true}}'),
        
        -- Step 6: Registration Request
        (test_case_uuid, 'step_6', 6, 5000, 'UL', 'NAS', '5G-NAS',
         'RegistrationRequest', 'Registration Request', '5G NAS Registration Request',
         'TS 24.501 8.2.1', 'Release 17', '{"step_5"}', 'step_7', 10000,
         '{"registration_type": {"values": ["initial", "mobility", "periodic"]}, "5g_s_tmsi": {"required": false}}'),
        
        -- Step 7: Registration Accept
        (test_case_uuid, 'step_7', 7, 6000, 'DL', 'NAS', '5G-NAS',
         'RegistrationAccept', 'Registration Accept', '5G NAS Registration Accept',
         'TS 24.501 8.2.2', 'Release 17', '{"step_6"}', 'step_8', 10000,
         '{"5g_guti": {"required": true}, "allowed_nssai": {"required": true}}'),
        
        -- Step 8: PDU Session Establishment Request
        (test_case_uuid, 'step_8', 8, 7000, 'UL', 'NAS', '5G-NAS',
         'PDUSessionEstablishmentRequest', 'PDU Session Establishment Request', 'PDU Session Establishment Request',
         'TS 24.501 8.3.1', 'Release 17', '{"step_7"}', 'step_9', 15000,
         '{"pdu_session_id": {"min": 1, "max": 15}, "request_type": {"values": ["initial", "existing"]}}'),
        
        -- Step 9: PDU Session Establishment Accept
        (test_case_uuid, 'step_9', 9, 8000, 'DL', 'NAS', '5G-NAS',
         'PDUSessionEstablishmentAccept', 'PDU Session Establishment Accept', 'PDU Session Establishment Accept',
         'TS 24.501 8.3.2', 'Release 17', '{"step_8"}', null, 15000,
         '{"pdu_session_id": {"min": 1, "max": 15}, "qos_rules": {"required": true}}')
        ON CONFLICT (test_case_id, step_id) DO NOTHING;
    END IF;
END $$;

-- Insert layer parameters for 5G NR Initial Access Test Case
DO $$
DECLARE
    test_case_uuid UUID;
BEGIN
    SELECT id INTO test_case_uuid FROM public.test_cases WHERE test_case_id = '5NR_INIT_0001';
    
    IF test_case_uuid IS NOT NULL THEN
        INSERT INTO public.test_case_layer_parameters (
            test_case_id, layer, layer_configuration, layer_capabilities, performance_metrics
        ) VALUES 
        -- PHY Layer Parameters
        (test_case_uuid, 'PHY', 
         '{"dl_arfcn": 3732480, "ul_arfcn": 3732480, "bandwidth": 100, "subcarrier_spacing": 30, "pci": 123, "cell_id": 123456, "rsrp": -85, "rsrq": -12, "sinr": 18, "cqi": 13, "mcs": 20, "bler": 0.01}',
         '{"max_bandwidth": 100, "max_mimo_layers": 4, "supported_modulations": ["QPSK", "16QAM", "64QAM", "256QAM"], "carrier_aggregation": true}',
         '{"throughput_mbps": 100, "latency_ms": 1, "error_rate": 0.01}'),
        
        -- MAC Layer Parameters
        (test_case_uuid, 'MAC',
         '{"harq_enabled": true, "max_processes": 16, "max_retransmissions": 3, "scheduling_algorithm": "proportional_fair", "max_logical_channels": 32}',
         '{"max_harq_processes": 16, "max_logical_channels": 32, "scheduling_modes": ["dynamic", "semi-persistent", "configured"]}',
         '{"throughput_mbps": 95, "latency_ms": 2, "error_rate": 0.02}'),
        
        -- RLC Layer Parameters
        (test_case_uuid, 'RLC',
         '{"rlc_mode": "AM", "max_retransmissions": 3, "polling_interval": 100, "window_size": 1024, "segmentation_enabled": true}',
         '{"modes": ["AM", "UM", "TM"], "max_sequence_number": 4095, "segmentation": true}',
         '{"throughput_mbps": 90, "latency_ms": 3, "error_rate": 0.03}'),
        
        -- PDCP Layer Parameters
        (test_case_uuid, 'PDCP',
         '{"pdcp_mode": "AM", "security_enabled": true, "integrity_protection": true, "ciphering": true, "compression_enabled": true}',
         '{"max_sequence_number": 4095, "security_algorithms": ["AES-128", "AES-256"], "compression": true}',
         '{"throughput_mbps": 85, "latency_ms": 4, "error_rate": 0.04}'),
        
        -- RRC Layer Parameters
        (test_case_uuid, 'RRC',
         '{"rrc_state": "RRC_CONNECTED", "security_activated": true, "mobility_management": "enabled", "measurements_enabled": true}',
         '{"states": ["RRC_IDLE", "RRC_INACTIVE", "RRC_CONNECTED"], "security_algorithms": ["AES-128", "AES-256"]}',
         '{"throughput_mbps": 80, "latency_ms": 8, "error_rate": 0.05}'),
        
        -- NAS Layer Parameters
        (test_case_uuid, 'NAS',
         '{"nas_state": "REGISTERED", "security_context": "activated", "mobility_management": "enabled", "max_sessions": 15}',
         '{"states": ["DEREGISTERED", "REGISTERED", "DEREGISTERED_INITIATED"], "security_algorithms": ["AES-128", "AES-256"]}',
         '{"throughput_mbps": 75, "latency_ms": 15, "error_rate": 0.06}')
        ON CONFLICT (test_case_id, layer) DO NOTHING;
    END IF;
END $$;

-- Insert information elements for 5G NR Initial Access Test Case
DO $$
DECLARE
    test_case_uuid UUID;
    message_uuid UUID;
BEGIN
    SELECT id INTO test_case_uuid FROM public.test_cases WHERE test_case_id = '5NR_INIT_0001';
    
    IF test_case_uuid IS NOT NULL THEN
        -- Get message IDs
        SELECT id INTO message_uuid FROM public.test_case_messages WHERE test_case_id = test_case_uuid AND step_id = 'step_1';
        
        IF message_uuid IS NOT NULL THEN
            INSERT INTO public.test_case_information_elements (
                test_case_id, message_id, step_id, ie_name, ie_type, ie_value, ie_value_hex, ie_value_binary,
                ie_size, mandatory, is_valid, standard_reference
            ) VALUES 
            -- Random Access Preamble IEs
            (test_case_uuid, message_uuid, 'step_1', 'preamble_id', 'integer', '15', '0F', '001111', 6, true, true, 'TS 38.211 6.1.1'),
            (test_case_uuid, message_uuid, 'step_1', 'ra_rnti', 'integer', '12345', '3039', '0011000000111001', 16, true, true, 'TS 38.211 6.1.1'),
            (test_case_uuid, message_uuid, 'step_1', 'prach_config_index', 'integer', '0', '00', '00000000', 8, true, true, 'TS 38.211 6.1.1')
            ON CONFLICT DO NOTHING;
        END IF;
        
        -- Get message IDs for other steps
        SELECT id INTO message_uuid FROM public.test_case_messages WHERE test_case_id = test_case_uuid AND step_id = 'step_3';
        
        IF message_uuid IS NOT NULL THEN
            INSERT INTO public.test_case_information_elements (
                test_case_id, message_id, step_id, ie_name, ie_type, ie_value, ie_value_hex, ie_value_binary,
                ie_size, mandatory, is_valid, standard_reference
            ) VALUES 
            -- RRC Setup Request IEs
            (test_case_uuid, message_uuid, 'step_3', 'ue_identity', 'bit_string', '{"type": "random_value", "value": "1234567890123456"}', '1234567890123456', '0001001000110100010101100111100010010000100100010011000100110010', 64, true, true, 'TS 38.331 6.2.2'),
            (test_case_uuid, message_uuid, 'step_3', 'establishment_cause', 'enumerated', 'mo_Data', '00', '00', 2, true, true, 'TS 38.331 6.2.2'),
            (test_case_uuid, message_uuid, 'step_3', 'spare', 'bit_string', '0', '0', '0', 1, false, true, 'TS 38.331 6.2.2')
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
END $$;

-- Verification
DO $$
DECLARE
    test_case_count INTEGER;
    message_count INTEGER;
    ie_count INTEGER;
    layer_param_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO test_case_count FROM public.test_cases;
    SELECT COUNT(*) INTO message_count FROM public.test_case_messages;
    SELECT COUNT(*) INTO ie_count FROM public.test_case_information_elements;
    SELECT COUNT(*) INTO layer_param_count FROM public.test_case_layer_parameters;
    
    RAISE NOTICE '✅ Test cases created: %', test_case_count;
    RAISE NOTICE '✅ Test case messages created: %', message_count;
    RAISE NOTICE '✅ Information elements created: %', ie_count;
    RAISE NOTICE '✅ Layer parameters created: %', layer_param_count;
    
    IF test_case_count >= 10 AND message_count >= 9 AND ie_count >= 6 AND layer_param_count >= 6 THEN
        RAISE NOTICE '🎉 Comprehensive test case seed data created successfully!';
    ELSE
        RAISE NOTICE '❌ Some test case data may be missing';
    END IF;
END $$;