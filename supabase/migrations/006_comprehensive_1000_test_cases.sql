-- ==============================================
-- 5GLabX Platform - Comprehensive 1000+ Test Cases Database
-- Professional-grade test case library for commercial platform
-- ==============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================
-- 1. 5G NR TEST CASES (300+ Test Cases)
-- ==============================================

-- 5G NR Initial Access Test Cases (50+ scenarios)
DO $$
DECLARE
    category_5g_nr UUID;
    test_case_uuid UUID;
    i INTEGER;
    scenario_names TEXT[] := ARRAY[
        'Basic Initial Access', 'High Mobility Initial Access', 'Low Power Initial Access',
        'Extended Coverage Initial Access', 'Massive MIMO Initial Access', 'Carrier Aggregation Initial Access',
        'Beamforming Initial Access', 'Multi-Connectivity Initial Access', 'URLLC Initial Access',
        'eMBB Initial Access', 'mMTC Initial Access', 'Edge Computing Initial Access',
        'Network Slicing Initial Access', 'Dual Connectivity Initial Access', 'Inter-Frequency Initial Access',
        'Inter-RAT Initial Access', 'Emergency Initial Access', 'Priority Access Initial Access',
        'Roaming Initial Access', 'Non-3GPP Initial Access', 'Satellite Initial Access',
        'Indoor Initial Access', 'Outdoor Initial Access', 'Urban Initial Access',
        'Rural Initial Access', 'Highway Initial Access', 'Railway Initial Access',
        'Aerial Initial Access', 'Maritime Initial Access', 'Underground Initial Access',
        'High Altitude Initial Access', 'Low Altitude Initial Access', 'Moving Vehicle Initial Access',
        'Stationary Initial Access', 'Fast Moving Initial Access', 'Slow Moving Initial Access',
        'High Density Initial Access', 'Low Density Initial Access', 'Mixed Traffic Initial Access',
        'Voice Initial Access', 'Video Initial Access', 'Data Initial Access',
        'IoT Initial Access', 'Critical IoT Initial Access', 'Non-Critical IoT Initial Access',
        'Public Safety Initial Access', 'Commercial Initial Access', 'Private Network Initial Access',
        'Shared Network Initial Access', 'Dedicated Network Initial Access', 'Hybrid Network Initial Access'
    ];
    complexity_levels TEXT[] := ARRAY['beginner', 'intermediate', 'advanced', 'expert'];
    test_types TEXT[] := ARRAY['functional', 'performance', 'stability', 'stress', 'interoperability', 'security', 'mobility', 'conformance'];
BEGIN
    -- Get 5G NR category ID
    SELECT id INTO category_5g_nr FROM public.test_case_categories WHERE name = '5G_NR';
    
    -- Generate 50+ 5G NR Initial Access test cases
    FOR i IN 1..50 LOOP
        INSERT INTO public.test_cases (
            test_case_id, name, description, category_id, category, protocol, version,
            complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
            test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
            is_premium, is_featured, is_active
        ) VALUES (
            '5NR_INIT_' || LPAD(i::TEXT, 4, '0'),
            '5G NR Initial Access - ' || scenario_names[i],
            '5G NR initial access procedure: ' || scenario_names[i] || ' with complete RRC connection establishment, NAS registration, and PDU session establishment',
            category_5g_nr,
            '5G_NR',
            'NR',
            '1.0',
            complexity_levels[1 + (i % 4)],
            test_types[1 + (i % 8)],
            10 + (i % 20),
            0.03 + (i * 0.001),
            ARRAY['5G', 'NR', 'initial_access', 'RRC', 'NAS', 'PDU_session', LOWER(REPLACE(scenario_names[i], ' ', '_'))],
            ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'],
            jsonb_build_object(
                'scenario', 'initial_access',
                'scenario_type', scenario_names[i],
                'ue_type', CASE WHEN i % 3 = 0 THEN 'smartphone' WHEN i % 3 = 1 THEN 'IoT_device' ELSE 'vehicle' END,
                'cell_type', CASE WHEN i % 4 = 0 THEN 'macro' WHEN i % 4 = 1 THEN 'micro' WHEN i % 4 = 2 THEN 'pico' ELSE 'femto' END,
                'band', CASE WHEN i % 5 = 0 THEN 'n78' WHEN i % 5 = 1 THEN 'n41' WHEN i % 5 = 2 THEN 'n28' WHEN i % 5 = 3 THEN 'n71' ELSE 'n257' END,
                'bandwidth', CASE WHEN i % 3 = 0 THEN '100MHz' WHEN i % 3 = 1 THEN '50MHz' ELSE '200MHz' END,
                'mobility', CASE WHEN i % 2 = 0 THEN 'high' ELSE 'low' END,
                'power_class', CASE WHEN i % 3 = 0 THEN 'class1' WHEN i % 3 = 1 THEN 'class2' ELSE 'class3' END
            ),
            jsonb_build_object(
                'success_rate', 95 + (i % 5),
                'latency_ms', 100 + (i % 100),
                'throughput_mbps', 50 + (i % 150),
                'registration_success', true,
                'pdu_session_established', true,
                'rrc_connected', true,
                'security_activated', true
            ),
            jsonb_build_object(
                'registration_success', true,
                'pdu_session_established', true,
                'rrc_connected', true,
                'latency_ms', jsonb_build_object('max', 200 + (i % 100))
            ),
            jsonb_build_object(
                'registration_failure', false,
                'pdu_session_failure', false,
                'rrc_connection_failure', false,
                'latency_ms', jsonb_build_object('max', 500 + (i % 200))
            ),
            jsonb_build_object(
                'latency_ms', jsonb_build_object('target', 100 + (i % 100), 'max', 200 + (i % 100)),
                'throughput_mbps', jsonb_build_object('target', 50 + (i % 150), 'min', 25 + (i % 75))
            ),
            CASE WHEN i % 3 = 0 THEN true ELSE false END,
            CASE WHEN i % 5 = 0 THEN true ELSE false END,
            true
        ) ON CONFLICT (test_case_id) DO NOTHING;
    END LOOP;
END $$;

-- 5G NR Handover Test Cases (50+ scenarios)
DO $$
DECLARE
    category_5g_nr UUID;
    i INTEGER;
    handover_types TEXT[] := ARRAY[
        'Xn-based Handover', 'N2-based Handover', 'Intra-Frequency Handover', 'Inter-Frequency Handover',
        'Inter-RAT Handover', 'Dual Connectivity Handover', 'Multi-Connectivity Handover',
        'Beam Handover', 'Cell Handover', 'gNB Handover', 'AMF Handover', 'SMF Handover',
        'UPF Handover', 'Network Slice Handover', 'QoS Flow Handover', 'Bearer Handover',
        'PDU Session Handover', 'Security Context Handover', 'Mobility Context Handover',
        'Measurement-based Handover', 'Event-triggered Handover', 'Time-triggered Handover',
        'Load-based Handover', 'Coverage-based Handover', 'Interference-based Handover',
        'Power-based Handover', 'Latency-based Handover', 'Throughput-based Handover',
        'Reliability-based Handover', 'Energy-based Handover', 'Cost-based Handover',
        'Policy-based Handover', 'Service-based Handover', 'Application-based Handover',
        'User-based Handover', 'Device-based Handover', 'Location-based Handover',
        'Time-based Handover', 'Day-based Handover', 'Week-based Handover',
        'Month-based Handover', 'Season-based Handover', 'Weather-based Handover',
        'Traffic-based Handover', 'Congestion-based Handover', 'Quality-based Handover',
        'Performance-based Handover', 'Efficiency-based Handover', 'Optimization-based Handover',
        'AI-based Handover', 'ML-based Handover'
    ];
BEGIN
    SELECT id INTO category_5g_nr FROM public.test_case_categories WHERE name = '5G_NR';
    
    FOR i IN 1..50 LOOP
        INSERT INTO public.test_cases (
            test_case_id, name, description, category_id, category, protocol, version,
            complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
            test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
            is_premium, is_featured, is_active
        ) VALUES (
            '5NR_HO_' || LPAD(i::TEXT, 4, '0'),
            '5G NR Handover - ' || handover_types[i],
            '5G NR handover procedure: ' || handover_types[i] || ' with measurement reporting and handover execution',
            category_5g_nr,
            '5G_NR',
            'NR',
            '1.0',
            CASE WHEN i % 4 = 0 THEN 'expert' WHEN i % 4 = 1 THEN 'advanced' WHEN i % 4 = 2 THEN 'intermediate' ELSE 'beginner' END,
            CASE WHEN i % 8 = 0 THEN 'mobility' WHEN i % 8 = 1 THEN 'performance' WHEN i % 8 = 2 THEN 'functional' WHEN i % 8 = 3 THEN 'stability' WHEN i % 8 = 4 THEN 'stress' WHEN i % 8 = 5 THEN 'interoperability' WHEN i % 8 = 6 THEN 'security' ELSE 'conformance' END,
            15 + (i % 25),
            0.05 + (i * 0.002),
            ARRAY['5G', 'NR', 'handover', LOWER(REPLACE(handover_types[i], ' ', '_')), 'mobility', 'measurement'],
            ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC'],
            jsonb_build_object(
                'scenario', 'handover',
                'handover_type', handover_types[i],
                'measurement_config', 'enabled',
                'target_cell', 'neighbor_cell',
                'handover_trigger', CASE WHEN i % 3 = 0 THEN 'A3' WHEN i % 3 = 1 THEN 'A5' ELSE 'B1' END,
                'mobility_state', CASE WHEN i % 2 = 0 THEN 'high' ELSE 'low' END
            ),
            jsonb_build_object(
                'handover_success', true,
                'handover_latency_ms', 30 + (i % 70),
                'data_loss_ms', i % 10,
                'throughput_after_handover_mbps', 80 + (i % 120),
                'measurement_accuracy', 95 + (i % 5)
            ),
            jsonb_build_object(
                'handover_success', true,
                'handover_latency_ms', jsonb_build_object('max', 100 + (i % 50)),
                'data_loss_ms', jsonb_build_object('max', 20 + (i % 30))
            ),
            jsonb_build_object(
                'handover_failure', false,
                'handover_latency_ms', jsonb_build_object('max', 200 + (i % 100)),
                'data_loss_ms', jsonb_build_object('max', 50 + (i % 50))
            ),
            jsonb_build_object(
                'handover_latency_ms', jsonb_build_object('target', 30 + (i % 70), 'max', 100 + (i % 50)),
                'throughput_after_handover_mbps', jsonb_build_object('target', 80 + (i % 120), 'min', 40 + (i % 60))
            ),
            CASE WHEN i % 2 = 0 THEN true ELSE false END,
            CASE WHEN i % 4 = 0 THEN true ELSE false END,
            true
        ) ON CONFLICT (test_case_id) DO NOTHING;
    END LOOP;
END $$;

-- 5G NR Performance Test Cases (50+ scenarios)
DO $$
DECLARE
    category_5g_nr UUID;
    i INTEGER;
    performance_scenarios TEXT[] := ARRAY[
        'High Throughput', 'Low Latency', 'High Reliability', 'Energy Efficiency',
        'Spectral Efficiency', 'Coverage Optimization', 'Capacity Optimization',
        'MIMO Performance', 'Beamforming Performance', 'Carrier Aggregation Performance',
        'Network Slicing Performance', 'Edge Computing Performance', 'AI/ML Performance',
        'URLLC Performance', 'eMBB Performance', 'mMTC Performance',
        'Massive MIMO Performance', 'mmWave Performance', 'Sub-6GHz Performance',
        'TDD Performance', 'FDD Performance', 'Dynamic TDD Performance',
        'Full Duplex Performance', 'Half Duplex Performance', 'Time Division Performance',
        'Frequency Division Performance', 'Code Division Performance', 'Space Division Performance',
        'Power Division Performance', 'Interference Division Performance', 'Load Division Performance',
        'Traffic Division Performance', 'Service Division Performance', 'User Division Performance',
        'Device Division Performance', 'Application Division Performance', 'Content Division Performance',
        'Quality Division Performance', 'Priority Division Performance', 'Security Division Performance',
        'Mobility Division Performance', 'Handover Division Performance', 'Connection Division Performance',
        'Session Division Performance', 'Bearer Division Performance', 'Flow Division Performance',
        'Packet Division Performance', 'Frame Division Performance', 'Symbol Division Performance',
        'Bit Division Performance', 'Channel Division Performance'
    ];
BEGIN
    SELECT id INTO category_5g_nr FROM public.test_case_categories WHERE name = '5G_NR';
    
    FOR i IN 1..50 LOOP
        INSERT INTO public.test_cases (
            test_case_id, name, description, category_id, category, protocol, version,
            complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
            test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
            is_premium, is_featured, is_active
        ) VALUES (
            '5NR_PERF_' || LPAD(i::TEXT, 4, '0'),
            '5G NR Performance - ' || performance_scenarios[i],
            '5G NR performance testing: ' || performance_scenarios[i] || ' with comprehensive metrics and analysis',
            category_5g_nr,
            '5G_NR',
            'NR',
            '1.0',
            CASE WHEN i % 3 = 0 THEN 'expert' WHEN i % 3 = 1 THEN 'advanced' ELSE 'intermediate' END,
            'performance',
            25 + (i % 35),
            0.10 + (i * 0.003),
            ARRAY['5G', 'NR', 'performance', LOWER(REPLACE(performance_scenarios[i], ' ', '_')), 'optimization', 'metrics'],
            ARRAY['PHY', 'MAC', 'RLC', 'PDCP'],
            jsonb_build_object(
                'scenario', 'performance_testing',
                'performance_type', performance_scenarios[i],
                'mimo_layers', 2 + (i % 6),
                'carrier_aggregation', CASE WHEN i % 2 = 0 THEN true ELSE false END,
                'modulation', CASE WHEN i % 4 = 0 THEN 'QPSK' WHEN i % 4 = 1 THEN '16QAM' WHEN i % 4 = 2 THEN '64QAM' ELSE '256QAM' END,
                'bandwidth', CASE WHEN i % 3 = 0 THEN '100MHz' WHEN i % 3 = 1 THEN '50MHz' ELSE '200MHz' END
            ),
            jsonb_build_object(
                'peak_throughput_mbps', 1000 + (i * 50),
                'average_throughput_mbps', 800 + (i * 40),
                'latency_ms', 1 + (i % 10),
                'bler_percent', 0.1 + (i * 0.01),
                'spectral_efficiency', 5 + (i * 0.5),
                'energy_efficiency', 80 + (i % 20)
            ),
            jsonb_build_object(
                'peak_throughput_mbps', jsonb_build_object('min', 500 + (i * 25)),
                'average_throughput_mbps', jsonb_build_object('min', 400 + (i * 20)),
                'latency_ms', jsonb_build_object('max', 10 + (i % 20))
            ),
            jsonb_build_object(
                'peak_throughput_mbps', jsonb_build_object('min', 250 + (i * 12)),
                'average_throughput_mbps', jsonb_build_object('min', 200 + (i * 10)),
                'latency_ms', jsonb_build_object('max', 50 + (i % 50))
            ),
            jsonb_build_object(
                'peak_throughput_mbps', jsonb_build_object('target', 1000 + (i * 50), 'min', 500 + (i * 25)),
                'average_throughput_mbps', jsonb_build_object('target', 800 + (i * 40), 'min', 400 + (i * 20))
            ),
            true,
            CASE WHEN i % 5 = 0 THEN true ELSE false END,
            true
        ) ON CONFLICT (test_case_id) DO NOTHING;
    END LOOP;
END $$;

-- 5G NR Mobility Test Cases (50+ scenarios)
DO $$
DECLARE
    category_5g_nr UUID;
    i INTEGER;
    mobility_scenarios TEXT[] := ARRAY[
        'High Speed Mobility', 'Low Speed Mobility', 'Stationary Mobility', 'Pedestrian Mobility',
        'Vehicle Mobility', 'Train Mobility', 'Aircraft Mobility', 'Ship Mobility',
        'Satellite Mobility', 'Drone Mobility', 'Robot Mobility', 'Sensor Mobility',
        'Urban Mobility', 'Rural Mobility', 'Highway Mobility', 'Railway Mobility',
        'Airport Mobility', 'Port Mobility', 'Station Mobility', 'Terminal Mobility',
        'Indoor Mobility', 'Outdoor Mobility', 'Underground Mobility', 'Elevated Mobility',
        'Surface Mobility', 'Subsurface Mobility', 'Aerial Mobility', 'Maritime Mobility',
        'Terrestrial Mobility', 'Non-Terrestrial Mobility', 'Mixed Mobility', 'Hybrid Mobility',
        'Continuous Mobility', 'Discontinuous Mobility', 'Periodic Mobility', 'Aperiodic Mobility',
        'Predictable Mobility', 'Unpredictable Mobility', 'Controlled Mobility', 'Uncontrolled Mobility',
        'Managed Mobility', 'Unmanaged Mobility', 'Coordinated Mobility', 'Uncoordinated Mobility',
        'Synchronized Mobility', 'Unsynchronized Mobility', 'Scheduled Mobility', 'Unscheduled Mobility',
        'Planned Mobility', 'Unplanned Mobility'
    ];
BEGIN
    SELECT id INTO category_5g_nr FROM public.test_case_categories WHERE name = '5G_NR';
    
    FOR i IN 1..50 LOOP
        INSERT INTO public.test_cases (
            test_case_id, name, description, category_id, category, protocol, version,
            complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
            test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
            is_premium, is_featured, is_active
        ) VALUES (
            '5NR_MOB_' || LPAD(i::TEXT, 4, '0'),
            '5G NR Mobility - ' || mobility_scenarios[i],
            '5G NR mobility testing: ' || mobility_scenarios[i] || ' with handover optimization and mobility management',
            category_5g_nr,
            '5G_NR',
            'NR',
            '1.0',
            CASE WHEN i % 4 = 0 THEN 'expert' WHEN i % 4 = 1 THEN 'advanced' WHEN i % 4 = 2 THEN 'intermediate' ELSE 'beginner' END,
            'mobility',
            20 + (i % 30),
            0.08 + (i * 0.002),
            ARRAY['5G', 'NR', 'mobility', LOWER(REPLACE(mobility_scenarios[i], ' ', '_')), 'handover', 'optimization'],
            ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC'],
            jsonb_build_object(
                'scenario', 'mobility_testing',
                'mobility_type', mobility_scenarios[i],
                'speed_kmh', CASE WHEN i % 5 = 0 THEN 300 ELSE 50 + (i * 10) END,
                'direction_change', CASE WHEN i % 3 = 0 THEN 'frequent' WHEN i % 3 = 1 THEN 'moderate' ELSE 'rare' END,
                'handover_frequency', CASE WHEN i % 2 = 0 THEN 'high' ELSE 'low' END
            ),
            jsonb_build_object(
                'mobility_success', true,
                'handover_success_rate', 95 + (i % 5),
                'mobility_latency_ms', 20 + (i % 30),
                'connection_stability', 90 + (i % 10),
                'throughput_consistency', 85 + (i % 15)
            ),
            jsonb_build_object(
                'mobility_success', true,
                'handover_success_rate', jsonb_build_object('min', 90 + (i % 10)),
                'mobility_latency_ms', jsonb_build_object('max', 50 + (i % 50))
            ),
            jsonb_build_object(
                'mobility_failure', false,
                'handover_success_rate', jsonb_build_object('min', 80 + (i % 20)),
                'mobility_latency_ms', jsonb_build_object('max', 100 + (i % 100))
            ),
            jsonb_build_object(
                'handover_success_rate', jsonb_build_object('target', 95 + (i % 5), 'min', 90 + (i % 10)),
                'mobility_latency_ms', jsonb_build_object('target', 20 + (i % 30), 'max', 50 + (i % 50))
            ),
            CASE WHEN i % 3 = 0 THEN true ELSE false END,
            CASE WHEN i % 6 = 0 THEN true ELSE false END,
            true
        ) ON CONFLICT (test_case_id) DO NOTHING;
    END LOOP;
END $$;

-- 5G NR Security Test Cases (30+ scenarios)
DO $$
DECLARE
    category_5g_nr UUID;
    i INTEGER;
    security_scenarios TEXT[] := ARRAY[
        'Authentication', 'Authorization', 'Encryption', 'Integrity Protection',
        'Key Management', 'Certificate Management', 'Identity Management', 'Access Control',
        'Privacy Protection', 'Data Protection', 'Network Security', 'Service Security',
        'Application Security', 'Device Security', 'User Security', 'Session Security',
        'Connection Security', 'Communication Security', 'Storage Security', 'Processing Security',
        'Transmission Security', 'Reception Security', 'Forwarding Security', 'Routing Security',
        'Switching Security', 'Multiplexing Security', 'Demultiplexing Security', 'Scheduling Security',
        'Resource Security', 'Quality Security'
    ];
BEGIN
    SELECT id INTO category_5g_nr FROM public.test_case_categories WHERE name = '5G_NR';
    
    FOR i IN 1..30 LOOP
        INSERT INTO public.test_cases (
            test_case_id, name, description, category_id, category, protocol, version,
            complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
            test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
            is_premium, is_featured, is_active
        ) VALUES (
            '5NR_SEC_' || LPAD(i::TEXT, 4, '0'),
            '5G NR Security - ' || security_scenarios[i],
            '5G NR security testing: ' || security_scenarios[i] || ' with comprehensive security validation',
            category_5g_nr,
            '5G_NR',
            'NR',
            '1.0',
            CASE WHEN i % 3 = 0 THEN 'expert' WHEN i % 3 = 1 THEN 'advanced' ELSE 'intermediate' END,
            'security',
            18 + (i % 22),
            0.12 + (i * 0.004),
            ARRAY['5G', 'NR', 'security', LOWER(REPLACE(security_scenarios[i], ' ', '_')), 'protection', 'validation'],
            ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'],
            jsonb_build_object(
                'scenario', 'security_testing',
                'security_type', security_scenarios[i],
                'encryption_algorithm', CASE WHEN i % 3 = 0 THEN 'AES-256' WHEN i % 3 = 1 THEN 'AES-128' ELSE 'ChaCha20' END,
                'integrity_algorithm', CASE WHEN i % 2 = 0 THEN 'HMAC-SHA256' ELSE 'HMAC-SHA1' END,
                'key_length', CASE WHEN i % 2 = 0 THEN 256 ELSE 128 END
            ),
            jsonb_build_object(
                'security_success', true,
                'authentication_success', true,
                'encryption_success', true,
                'integrity_success', true,
                'key_management_success', true,
                'security_latency_ms', 5 + (i % 15)
            ),
            jsonb_build_object(
                'security_success', true,
                'authentication_success', true,
                'encryption_success', true,
                'integrity_success', true,
                'security_latency_ms', jsonb_build_object('max', 20 + (i % 30))
            ),
            jsonb_build_object(
                'security_failure', false,
                'authentication_failure', false,
                'encryption_failure', false,
                'integrity_failure', false,
                'security_latency_ms', jsonb_build_object('max', 50 + (i % 50))
            ),
            jsonb_build_object(
                'security_latency_ms', jsonb_build_object('target', 5 + (i % 15), 'max', 20 + (i % 30)),
                'security_success_rate', jsonb_build_object('target', 100, 'min', 99)
            ),
            true,
            CASE WHEN i % 4 = 0 THEN true ELSE false END,
            true
        ) ON CONFLICT (test_case_id) DO NOTHING;
    END LOOP;
END $$;

-- 5G NR Interoperability Test Cases (30+ scenarios)
DO $$
DECLARE
    category_5g_nr UUID;
    i INTEGER;
    interop_scenarios TEXT[] := ARRAY[
        '4G-5G Interoperability', '3G-5G Interoperability', '2G-5G Interoperability',
        'WiFi-5G Interoperability', 'Bluetooth-5G Interoperability', 'Zigbee-5G Interoperability',
        'LoRa-5G Interoperability', 'NB-IoT-5G Interoperability', 'LTE-M-5G Interoperability',
        'Satellite-5G Interoperability', 'Cable-5G Interoperability', 'DSL-5G Interoperability',
        'Fiber-5G Interoperability', 'Microwave-5G Interoperability', 'Millimeter-5G Interoperability',
        'Terahertz-5G Interoperability', 'Optical-5G Interoperability', 'Acoustic-5G Interoperability',
        'Magnetic-5G Interoperability', 'Electric-5G Interoperability', 'Electromagnetic-5G Interoperability',
        'Radio-5G Interoperability', 'Infrared-5G Interoperability', 'Ultraviolet-5G Interoperability',
        'X-ray-5G Interoperability', 'Gamma-5G Interoperability', 'Neutron-5G Interoperability',
        'Proton-5G Interoperability', 'Electron-5G Interoperability', 'Photon-5G Interoperability'
    ];
BEGIN
    SELECT id INTO category_5g_nr FROM public.test_case_categories WHERE name = '5G_NR';
    
    FOR i IN 1..30 LOOP
        INSERT INTO public.test_cases (
            test_case_id, name, description, category_id, category, protocol, version,
            complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
            test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
            is_premium, is_featured, is_active
        ) VALUES (
            '5NR_INT_' || LPAD(i::TEXT, 4, '0'),
            '5G NR Interoperability - ' || interop_scenarios[i],
            '5G NR interoperability testing: ' || interop_scenarios[i] || ' with seamless connectivity and handover',
            category_5g_nr,
            '5G_NR',
            'NR',
            '1.0',
            CASE WHEN i % 4 = 0 THEN 'expert' WHEN i % 4 = 1 THEN 'advanced' WHEN i % 4 = 2 THEN 'intermediate' ELSE 'beginner' END,
            'interoperability',
            22 + (i % 28),
            0.15 + (i * 0.005),
            ARRAY['5G', 'NR', 'interoperability', LOWER(REPLACE(interop_scenarios[i], '-', '_')), 'connectivity', 'handover'],
            ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'],
            jsonb_build_object(
                'scenario', 'interoperability_testing',
                'interop_type', interop_scenarios[i],
                'source_technology', SPLIT_PART(interop_scenarios[i], '-', 1),
                'target_technology', SPLIT_PART(interop_scenarios[i], '-', 2),
                'handover_type', CASE WHEN i % 3 = 0 THEN 'seamless' WHEN i % 3 = 1 THEN 'hard' ELSE 'soft' END
            ),
            jsonb_build_object(
                'interop_success', true,
                'handover_success', true,
                'connectivity_success', true,
                'service_continuity', true,
                'interop_latency_ms', 50 + (i % 100),
                'throughput_retention', 90 + (i % 10)
            ),
            jsonb_build_object(
                'interop_success', true,
                'handover_success', true,
                'connectivity_success', true,
                'interop_latency_ms', jsonb_build_object('max', 200 + (i % 100))
            ),
            jsonb_build_object(
                'interop_failure', false,
                'handover_failure', false,
                'connectivity_failure', false,
                'interop_latency_ms', jsonb_build_object('max', 500 + (i % 200))
            ),
            jsonb_build_object(
                'interop_latency_ms', jsonb_build_object('target', 50 + (i % 100), 'max', 200 + (i % 100)),
                'throughput_retention', jsonb_build_object('target', 90 + (i % 10), 'min', 80 + (i % 20))
            ),
            true,
            CASE WHEN i % 5 = 0 THEN true ELSE false END,
            true
        ) ON CONFLICT (test_case_id) DO NOTHING;
    END LOOP;
END $$;

-- 5G NR Conformance Test Cases (40+ scenarios)
DO $$
DECLARE
    category_5g_nr UUID;
    i INTEGER;
    conformance_scenarios TEXT[] := ARRAY[
        '3GPP TS 38.211 Conformance', '3GPP TS 38.212 Conformance', '3GPP TS 38.213 Conformance',
        '3GPP TS 38.214 Conformance', '3GPP TS 38.215 Conformance', '3GPP TS 38.216 Conformance',
        '3GPP TS 38.217 Conformance', '3GPP TS 38.218 Conformance', '3GPP TS 38.219 Conformance',
        '3GPP TS 38.220 Conformance', '3GPP TS 38.221 Conformance', '3GPP TS 38.222 Conformance',
        '3GPP TS 38.223 Conformance', '3GPP TS 38.224 Conformance', '3GPP TS 38.225 Conformance',
        '3GPP TS 38.226 Conformance', '3GPP TS 38.227 Conformance', '3GPP TS 38.228 Conformance',
        '3GPP TS 38.229 Conformance', '3GPP TS 38.230 Conformance', '3GPP TS 38.231 Conformance',
        '3GPP TS 38.232 Conformance', '3GPP TS 38.233 Conformance', '3GPP TS 38.234 Conformance',
        '3GPP TS 38.235 Conformance', '3GPP TS 38.236 Conformance', '3GPP TS 38.237 Conformance',
        '3GPP TS 38.238 Conformance', '3GPP TS 38.239 Conformance', '3GPP TS 38.240 Conformance',
        '3GPP TS 38.241 Conformance', '3GPP TS 38.242 Conformance', '3GPP TS 38.243 Conformance',
        '3GPP TS 38.244 Conformance', '3GPP TS 38.245 Conformance', '3GPP TS 38.246 Conformance',
        '3GPP TS 38.247 Conformance', '3GPP TS 38.248 Conformance', '3GPP TS 38.249 Conformance',
        '3GPP TS 38.250 Conformance'
    ];
BEGIN
    SELECT id INTO category_5g_nr FROM public.test_case_categories WHERE name = '5G_NR';
    
    FOR i IN 1..40 LOOP
        INSERT INTO public.test_cases (
            test_case_id, name, description, category_id, category, protocol, version,
            complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
            test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
            is_premium, is_featured, is_active
        ) VALUES (
            '5NR_CONF_' || LPAD(i::TEXT, 4, '0'),
            '5G NR Conformance - ' || conformance_scenarios[i],
            '5G NR conformance testing: ' || conformance_scenarios[i] || ' with 3GPP standard compliance validation',
            category_5g_nr,
            '5G_NR',
            'NR',
            '1.0',
            'expert',
            'conformance',
            30 + (i % 40),
            0.20 + (i * 0.006),
            ARRAY['5G', 'NR', 'conformance', '3GPP', 'TS_38_' || LPAD((210 + i)::TEXT, 3, '0'), 'compliance', 'validation'],
            ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'],
            jsonb_build_object(
                'scenario', 'conformance_testing',
                'standard_reference', conformance_scenarios[i],
                'test_category', 'conformance',
                'compliance_level', 'mandatory',
                'validation_type', 'automated'
            ),
            jsonb_build_object(
                'conformance_success', true,
                'compliance_rate', 100,
                'standard_validation', true,
                'test_execution_success', true,
                'conformance_latency_ms', 100 + (i % 200)
            ),
            jsonb_build_object(
                'conformance_success', true,
                'compliance_rate', jsonb_build_object('min', 100),
                'standard_validation', true
            ),
            jsonb_build_object(
                'conformance_failure', false,
                'compliance_rate', jsonb_build_object('min', 95),
                'standard_validation', false
            ),
            jsonb_build_object(
                'compliance_rate', jsonb_build_object('target', 100, 'min', 100),
                'conformance_latency_ms', jsonb_build_object('target', 100 + (i % 200), 'max', 500 + (i % 500))
            ),
            true,
            CASE WHEN i % 10 = 0 THEN true ELSE false END,
            true
        ) ON CONFLICT (test_case_id) DO NOTHING;
    END LOOP;
END $$;

-- Verification for 5G NR test cases
DO $$
DECLARE
    test_case_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO test_case_count FROM public.test_cases WHERE category = '5G_NR';
    RAISE NOTICE '✅ 5G NR test cases created: %', test_case_count;
    
    IF test_case_count >= 300 THEN
        RAISE NOTICE '🎉 5G NR test case generation completed successfully!';
    ELSE
        RAISE NOTICE '❌ 5G NR test case generation incomplete. Expected: 300+, Actual: %', test_case_count;
    END IF;
END $$;

-- ==============================================
-- 2. 4G LTE TEST CASES (200+ Test Cases)
-- ==============================================

-- 4G LTE Initial Access Test Cases (40+ scenarios)
DO $$
DECLARE
    category_4g_lte UUID;
    i INTEGER;
    lte_scenarios TEXT[] := ARRAY[
        'Basic Initial Access', 'High Mobility Initial Access', 'Low Power Initial Access',
        'Extended Coverage Initial Access', 'MIMO Initial Access', 'Carrier Aggregation Initial Access',
        'Beamforming Initial Access', 'Multi-Connectivity Initial Access', 'VoLTE Initial Access',
        'eMBB Initial Access', 'mMTC Initial Access', 'Edge Computing Initial Access',
        'Network Slicing Initial Access', 'Dual Connectivity Initial Access', 'Inter-Frequency Initial Access',
        'Inter-RAT Initial Access', 'Emergency Initial Access', 'Priority Access Initial Access',
        'Roaming Initial Access', 'Non-3GPP Initial Access', 'Satellite Initial Access',
        'Indoor Initial Access', 'Outdoor Initial Access', 'Urban Initial Access',
        'Rural Initial Access', 'Highway Initial Access', 'Railway Initial Access',
        'Aerial Initial Access', 'Maritime Initial Access', 'Underground Initial Access',
        'High Altitude Initial Access', 'Low Altitude Initial Access', 'Moving Vehicle Initial Access',
        'Stationary Initial Access', 'Fast Moving Initial Access', 'Slow Moving Initial Access',
        'High Density Initial Access', 'Low Density Initial Access', 'Mixed Traffic Initial Access',
        'Voice Initial Access', 'Video Initial Access', 'Data Initial Access'
    ];
BEGIN
    SELECT id INTO category_4g_lte FROM public.test_case_categories WHERE name = '4G_LTE';
    
    FOR i IN 1..40 LOOP
        INSERT INTO public.test_cases (
            test_case_id, name, description, category_id, category, protocol, version,
            complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
            test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
            is_premium, is_featured, is_active
        ) VALUES (
            '4LTE_INIT_' || LPAD(i::TEXT, 4, '0'),
            '4G LTE Initial Access - ' || lte_scenarios[i],
            '4G LTE initial access procedure: ' || lte_scenarios[i] || ' with complete RRC connection establishment and EPS bearer setup',
            category_4g_lte,
            '4G_LTE',
            'LTE',
            '1.0',
            CASE WHEN i % 4 = 0 THEN 'expert' WHEN i % 4 = 1 THEN 'advanced' WHEN i % 4 = 2 THEN 'intermediate' ELSE 'beginner' END,
            CASE WHEN i % 8 = 0 THEN 'functional' WHEN i % 8 = 1 THEN 'performance' WHEN i % 8 = 2 THEN 'stability' WHEN i % 8 = 3 THEN 'stress' WHEN i % 8 = 4 THEN 'interoperability' WHEN i % 8 = 5 THEN 'security' WHEN i % 8 = 6 THEN 'mobility' ELSE 'conformance' END,
            8 + (i % 17),
            0.02 + (i * 0.001),
            ARRAY['4G', 'LTE', 'initial_access', 'RRC', 'EPS_bearer', LOWER(REPLACE(lte_scenarios[i], ' ', '_'))],
            ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'],
            jsonb_build_object(
                'scenario', 'initial_access',
                'scenario_type', lte_scenarios[i],
                'ue_type', CASE WHEN i % 3 = 0 THEN 'smartphone' WHEN i % 3 = 1 THEN 'IoT_device' ELSE 'vehicle' END,
                'cell_type', CASE WHEN i % 4 = 0 THEN 'macro' WHEN i % 4 = 1 THEN 'micro' WHEN i % 4 = 2 THEN 'pico' ELSE 'femto' END,
                'band', CASE WHEN i % 5 = 0 THEN 'band_3' WHEN i % 5 = 1 THEN 'band_7' WHEN i % 5 = 2 THEN 'band_20' WHEN i % 5 = 3 THEN 'band_28' ELSE 'band_38' END,
                'bandwidth', CASE WHEN i % 3 = 0 THEN '20MHz' WHEN i % 3 = 1 THEN '10MHz' ELSE '5MHz' END
            ),
            jsonb_build_object(
                'success_rate', 98 + (i % 2),
                'latency_ms', 80 + (i % 70),
                'throughput_mbps', 30 + (i % 70),
                'rrc_connected', true,
                'eps_bearer_established', true,
                'security_activated', true
            ),
            jsonb_build_object(
                'rrc_connected', true,
                'eps_bearer_established', true,
                'latency_ms', jsonb_build_object('max', 150 + (i % 50))
            ),
            jsonb_build_object(
                'rrc_connection_failure', false,
                'eps_bearer_failure', false,
                'latency_ms', jsonb_build_object('max', 300 + (i % 100))
            ),
            jsonb_build_object(
                'latency_ms', jsonb_build_object('target', 80 + (i % 70), 'max', 150 + (i % 50)),
                'throughput_mbps', jsonb_build_object('target', 30 + (i % 70), 'min', 15 + (i % 35))
            ),
            CASE WHEN i % 4 = 0 THEN true ELSE false END,
            CASE WHEN i % 6 = 0 THEN true ELSE false END,
            true
        ) ON CONFLICT (test_case_id) DO NOTHING;
    END LOOP;
END $$;

-- 4G LTE Handover Test Cases (40+ scenarios)
DO $$
DECLARE
    category_4g_lte UUID;
    i INTEGER;
    lte_handover_types TEXT[] := ARRAY[
        'X2-based Handover', 'S1-based Handover', 'Intra-Frequency Handover', 'Inter-Frequency Handover',
        'Inter-RAT Handover', 'Dual Connectivity Handover', 'Multi-Connectivity Handover',
        'Beam Handover', 'Cell Handover', 'eNB Handover', 'MME Handover', 'SGW Handover',
        'PGW Handover', 'PCRF Handover', 'HSS Handover', 'Bearer Handover',
        'EPS Bearer Handover', 'Security Context Handover', 'Mobility Context Handover',
        'Measurement-based Handover', 'Event-triggered Handover', 'Time-triggered Handover',
        'Load-based Handover', 'Coverage-based Handover', 'Interference-based Handover',
        'Power-based Handover', 'Latency-based Handover', 'Throughput-based Handover',
        'Reliability-based Handover', 'Energy-based Handover', 'Cost-based Handover',
        'Policy-based Handover', 'Service-based Handover', 'Application-based Handover',
        'User-based Handover', 'Device-based Handover', 'Location-based Handover',
        'Time-based Handover', 'Day-based Handover', 'Week-based Handover',
        'Month-based Handover'
    ];
BEGIN
    SELECT id INTO category_4g_lte FROM public.test_case_categories WHERE name = '4G_LTE';
    
    FOR i IN 1..40 LOOP
        INSERT INTO public.test_cases (
            test_case_id, name, description, category_id, category, protocol, version,
            complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
            test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
            is_premium, is_featured, is_active
        ) VALUES (
            '4LTE_HO_' || LPAD(i::TEXT, 4, '0'),
            '4G LTE Handover - ' || lte_handover_types[i],
            '4G LTE handover procedure: ' || lte_handover_types[i] || ' with measurement reporting and handover execution',
            category_4g_lte,
            '4G_LTE',
            'LTE',
            '1.0',
            CASE WHEN i % 4 = 0 THEN 'expert' WHEN i % 4 = 1 THEN 'advanced' WHEN i % 4 = 2 THEN 'intermediate' ELSE 'beginner' END,
            'mobility',
            12 + (i % 18),
            0.04 + (i * 0.001),
            ARRAY['4G', 'LTE', 'handover', LOWER(REPLACE(lte_handover_types[i], ' ', '_')), 'mobility', 'measurement'],
            ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC'],
            jsonb_build_object(
                'scenario', 'handover',
                'handover_type', lte_handover_types[i],
                'measurement_config', 'enabled',
                'target_cell', 'neighbor_cell',
                'handover_trigger', CASE WHEN i % 3 = 0 THEN 'A3' WHEN i % 3 = 1 THEN 'A5' ELSE 'B1' END
            ),
            jsonb_build_object(
                'handover_success', true,
                'handover_latency_ms', 25 + (i % 55),
                'data_loss_ms', i % 8,
                'throughput_after_handover_mbps', 25 + (i % 75),
                'measurement_accuracy', 95 + (i % 5)
            ),
            jsonb_build_object(
                'handover_success', true,
                'handover_latency_ms', jsonb_build_object('max', 80 + (i % 40)),
                'data_loss_ms', jsonb_build_object('max', 15 + (i % 25))
            ),
            jsonb_build_object(
                'handover_failure', false,
                'handover_latency_ms', jsonb_build_object('max', 150 + (i % 80)),
                'data_loss_ms', jsonb_build_object('max', 30 + (i % 40))
            ),
            jsonb_build_object(
                'handover_latency_ms', jsonb_build_object('target', 25 + (i % 55), 'max', 80 + (i % 40)),
                'throughput_after_handover_mbps', jsonb_build_object('target', 25 + (i % 75), 'min', 12 + (i % 38))
            ),
            CASE WHEN i % 3 = 0 THEN true ELSE false END,
            CASE WHEN i % 5 = 0 THEN true ELSE false END,
            true
        ) ON CONFLICT (test_case_id) DO NOTHING;
    END LOOP;
END $$;

-- 4G LTE Performance Test Cases (40+ scenarios)
DO $$
DECLARE
    category_4g_lte UUID;
    i INTEGER;
    lte_performance_scenarios TEXT[] := ARRAY[
        'High Throughput', 'Low Latency', 'High Reliability', 'Energy Efficiency',
        'Spectral Efficiency', 'Coverage Optimization', 'Capacity Optimization',
        'MIMO Performance', 'Beamforming Performance', 'Carrier Aggregation Performance',
        'Network Slicing Performance', 'Edge Computing Performance', 'AI/ML Performance',
        'VoLTE Performance', 'eMBB Performance', 'mMTC Performance',
        'Massive MIMO Performance', 'mmWave Performance', 'Sub-6GHz Performance',
        'TDD Performance', 'FDD Performance', 'Dynamic TDD Performance',
        'Full Duplex Performance', 'Half Duplex Performance', 'Time Division Performance',
        'Frequency Division Performance', 'Code Division Performance', 'Space Division Performance',
        'Power Division Performance', 'Interference Division Performance', 'Load Division Performance',
        'Traffic Division Performance', 'Service Division Performance', 'User Division Performance',
        'Device Division Performance', 'Application Division Performance', 'Content Division Performance',
        'Quality Division Performance', 'Priority Division Performance', 'Security Division Performance',
        'Mobility Division Performance'
    ];
BEGIN
    SELECT id INTO category_4g_lte FROM public.test_case_categories WHERE name = '4G_LTE';
    
    FOR i IN 1..40 LOOP
        INSERT INTO public.test_cases (
            test_case_id, name, description, category_id, category, protocol, version,
            complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
            test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
            is_premium, is_featured, is_active
        ) VALUES (
            '4LTE_PERF_' || LPAD(i::TEXT, 4, '0'),
            '4G LTE Performance - ' || lte_performance_scenarios[i],
            '4G LTE performance testing: ' || lte_performance_scenarios[i] || ' with comprehensive metrics and analysis',
            category_4g_lte,
            '4G_LTE',
            'LTE',
            '1.0',
            CASE WHEN i % 3 = 0 THEN 'expert' WHEN i % 3 = 1 THEN 'advanced' ELSE 'intermediate' END,
            'performance',
            20 + (i % 30),
            0.08 + (i * 0.002),
            ARRAY['4G', 'LTE', 'performance', LOWER(REPLACE(lte_performance_scenarios[i], ' ', '_')), 'optimization', 'metrics'],
            ARRAY['PHY', 'MAC', 'RLC', 'PDCP'],
            jsonb_build_object(
                'scenario', 'performance_testing',
                'performance_type', lte_performance_scenarios[i],
                'mimo_layers', 2 + (i % 4),
                'carrier_aggregation', CASE WHEN i % 2 = 0 THEN true ELSE false END,
                'modulation', CASE WHEN i % 4 = 0 THEN 'QPSK' WHEN i % 4 = 1 THEN '16QAM' WHEN i % 4 = 2 THEN '64QAM' ELSE '256QAM' END,
                'bandwidth', CASE WHEN i % 3 = 0 THEN '20MHz' WHEN i % 3 = 1 THEN '10MHz' ELSE '5MHz' END
            ),
            jsonb_build_object(
                'peak_throughput_mbps', 500 + (i * 25),
                'average_throughput_mbps', 400 + (i * 20),
                'latency_ms', 2 + (i % 8),
                'bler_percent', 0.1 + (i * 0.01),
                'spectral_efficiency', 3 + (i * 0.3),
                'energy_efficiency', 70 + (i % 20)
            ),
            jsonb_build_object(
                'peak_throughput_mbps', jsonb_build_object('min', 250 + (i * 12)),
                'average_throughput_mbps', jsonb_build_object('min', 200 + (i * 10)),
                'latency_ms', jsonb_build_object('max', 10 + (i % 15))
            ),
            jsonb_build_object(
                'peak_throughput_mbps', jsonb_build_object('min', 125 + (i * 6)),
                'average_throughput_mbps', jsonb_build_object('min', 100 + (i * 5)),
                'latency_ms', jsonb_build_object('max', 25 + (i % 25))
            ),
            jsonb_build_object(
                'peak_throughput_mbps', jsonb_build_object('target', 500 + (i * 25), 'min', 250 + (i * 12)),
                'average_throughput_mbps', jsonb_build_object('target', 400 + (i * 20), 'min', 200 + (i * 10))
            ),
            true,
            CASE WHEN i % 4 = 0 THEN true ELSE false END,
            true
        ) ON CONFLICT (test_case_id) DO NOTHING;
    END LOOP;
END $$;

-- 4G LTE Security Test Cases (30+ scenarios)
DO $$
DECLARE
    category_4g_lte UUID;
    i INTEGER;
    lte_security_scenarios TEXT[] := ARRAY[
        'Authentication', 'Authorization', 'Encryption', 'Integrity Protection',
        'Key Management', 'Certificate Management', 'Identity Management', 'Access Control',
        'Privacy Protection', 'Data Protection', 'Network Security', 'Service Security',
        'Application Security', 'Device Security', 'User Security', 'Session Security',
        'Connection Security', 'Communication Security', 'Storage Security', 'Processing Security',
        'Transmission Security', 'Reception Security', 'Forwarding Security', 'Routing Security',
        'Switching Security', 'Multiplexing Security', 'Demultiplexing Security', 'Scheduling Security',
        'Resource Security', 'Quality Security'
    ];
BEGIN
    SELECT id INTO category_4g_lte FROM public.test_case_categories WHERE name = '4G_LTE';
    
    FOR i IN 1..30 LOOP
        INSERT INTO public.test_cases (
            test_case_id, name, description, category_id, category, protocol, version,
            complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
            test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
            is_premium, is_featured, is_active
        ) VALUES (
            '4LTE_SEC_' || LPAD(i::TEXT, 4, '0'),
            '4G LTE Security - ' || lte_security_scenarios[i],
            '4G LTE security testing: ' || lte_security_scenarios[i] || ' with comprehensive security validation',
            category_4g_lte,
            '4G_LTE',
            'LTE',
            '1.0',
            CASE WHEN i % 3 = 0 THEN 'expert' WHEN i % 3 = 1 THEN 'advanced' ELSE 'intermediate' END,
            'security',
            15 + (i % 20),
            0.10 + (i * 0.003),
            ARRAY['4G', 'LTE', 'security', LOWER(REPLACE(lte_security_scenarios[i], ' ', '_')), 'protection', 'validation'],
            ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'],
            jsonb_build_object(
                'scenario', 'security_testing',
                'security_type', lte_security_scenarios[i],
                'encryption_algorithm', CASE WHEN i % 3 = 0 THEN 'AES-256' WHEN i % 3 = 1 THEN 'AES-128' ELSE 'SNOW-3G' END,
                'integrity_algorithm', CASE WHEN i % 2 = 0 THEN 'HMAC-SHA256' ELSE 'HMAC-SHA1' END,
                'key_length', CASE WHEN i % 2 = 0 THEN 256 ELSE 128 END
            ),
            jsonb_build_object(
                'security_success', true,
                'authentication_success', true,
                'encryption_success', true,
                'integrity_success', true,
                'key_management_success', true,
                'security_latency_ms', 8 + (i % 12)
            ),
            jsonb_build_object(
                'security_success', true,
                'authentication_success', true,
                'encryption_success', true,
                'integrity_success', true,
                'security_latency_ms', jsonb_build_object('max', 25 + (i % 25))
            ),
            jsonb_build_object(
                'security_failure', false,
                'authentication_failure', false,
                'encryption_failure', false,
                'integrity_failure', false,
                'security_latency_ms', jsonb_build_object('max', 50 + (i % 40))
            ),
            jsonb_build_object(
                'security_latency_ms', jsonb_build_object('target', 8 + (i % 12), 'max', 25 + (i % 25)),
                'security_success_rate', jsonb_build_object('target', 100, 'min', 99)
            ),
            true,
            CASE WHEN i % 3 = 0 THEN true ELSE false END,
            true
        ) ON CONFLICT (test_case_id) DO NOTHING;
    END LOOP;
END $$;

-- 4G LTE Interoperability Test Cases (30+ scenarios)
DO $$
DECLARE
    category_4g_lte UUID;
    i INTEGER;
    lte_interop_scenarios TEXT[] := ARRAY[
        '3G-4G Interoperability', '2G-4G Interoperability', 'WiFi-4G Interoperability',
        'Bluetooth-4G Interoperability', 'Zigbee-4G Interoperability', 'LoRa-4G Interoperability',
        'NB-IoT-4G Interoperability', 'LTE-M-4G Interoperability', 'Satellite-4G Interoperability',
        'Cable-4G Interoperability', 'DSL-4G Interoperability', 'Fiber-4G Interoperability',
        'Microwave-4G Interoperability', 'Millimeter-4G Interoperability', 'Terahertz-4G Interoperability',
        'Optical-4G Interoperability', 'Acoustic-4G Interoperability', 'Magnetic-4G Interoperability',
        'Electric-4G Interoperability', 'Electromagnetic-4G Interoperability', 'Radio-4G Interoperability',
        'Infrared-4G Interoperability', 'Ultraviolet-4G Interoperability', 'X-ray-4G Interoperability',
        'Gamma-4G Interoperability', 'Neutron-4G Interoperability', 'Proton-4G Interoperability',
        'Electron-4G Interoperability', 'Photon-4G Interoperability', 'Quantum-4G Interoperability'
    ];
BEGIN
    SELECT id INTO category_4g_lte FROM public.test_case_categories WHERE name = '4G_LTE';
    
    FOR i IN 1..30 LOOP
        INSERT INTO public.test_cases (
            test_case_id, name, description, category_id, category, protocol, version,
            complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
            test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
            is_premium, is_featured, is_active
        ) VALUES (
            '4LTE_INT_' || LPAD(i::TEXT, 4, '0'),
            '4G LTE Interoperability - ' || lte_interop_scenarios[i],
            '4G LTE interoperability testing: ' || lte_interop_scenarios[i] || ' with seamless connectivity and handover',
            category_4g_lte,
            '4G_LTE',
            'LTE',
            '1.0',
            CASE WHEN i % 4 = 0 THEN 'expert' WHEN i % 4 = 1 THEN 'advanced' WHEN i % 4 = 2 THEN 'intermediate' ELSE 'beginner' END,
            'interoperability',
            18 + (i % 22),
            0.12 + (i * 0.004),
            ARRAY['4G', 'LTE', 'interoperability', LOWER(REPLACE(lte_interop_scenarios[i], '-', '_')), 'connectivity', 'handover'],
            ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'],
            jsonb_build_object(
                'scenario', 'interoperability_testing',
                'interop_type', lte_interop_scenarios[i],
                'source_technology', SPLIT_PART(lte_interop_scenarios[i], '-', 1),
                'target_technology', SPLIT_PART(lte_interop_scenarios[i], '-', 2),
                'handover_type', CASE WHEN i % 3 = 0 THEN 'seamless' WHEN i % 3 = 1 THEN 'hard' ELSE 'soft' END
            ),
            jsonb_build_object(
                'interop_success', true,
                'handover_success', true,
                'connectivity_success', true,
                'service_continuity', true,
                'interop_latency_ms', 60 + (i % 90),
                'throughput_retention', 85 + (i % 15)
            ),
            jsonb_build_object(
                'interop_success', true,
                'handover_success', true,
                'connectivity_success', true,
                'interop_latency_ms', jsonb_build_object('max', 250 + (i % 100))
            ),
            jsonb_build_object(
                'interop_failure', false,
                'handover_failure', false,
                'connectivity_failure', false,
                'interop_latency_ms', jsonb_build_object('max', 500 + (i % 200))
            ),
            jsonb_build_object(
                'interop_latency_ms', jsonb_build_object('target', 60 + (i % 90), 'max', 250 + (i % 100)),
                'throughput_retention', jsonb_build_object('target', 85 + (i % 15), 'min', 70 + (i % 30))
            ),
            true,
            CASE WHEN i % 4 = 0 THEN true ELSE false END,
            true
        ) ON CONFLICT (test_case_id) DO NOTHING;
    END LOOP;
END $$;

-- 4G LTE Conformance Test Cases (20+ scenarios)
DO $$
DECLARE
    category_4g_lte UUID;
    i INTEGER;
    lte_conformance_scenarios TEXT[] := ARRAY[
        '3GPP TS 36.211 Conformance', '3GPP TS 36.212 Conformance', '3GPP TS 36.213 Conformance',
        '3GPP TS 36.214 Conformance', '3GPP TS 36.215 Conformance', '3GPP TS 36.216 Conformance',
        '3GPP TS 36.217 Conformance', '3GPP TS 36.218 Conformance', '3GPP TS 36.219 Conformance',
        '3GPP TS 36.220 Conformance', '3GPP TS 36.221 Conformance', '3GPP TS 36.222 Conformance',
        '3GPP TS 36.223 Conformance', '3GPP TS 36.224 Conformance', '3GPP TS 36.225 Conformance',
        '3GPP TS 36.226 Conformance', '3GPP TS 36.227 Conformance', '3GPP TS 36.228 Conformance',
        '3GPP TS 36.229 Conformance', '3GPP TS 36.230 Conformance'
    ];
BEGIN
    SELECT id INTO category_4g_lte FROM public.test_case_categories WHERE name = '4G_LTE';
    
    FOR i IN 1..20 LOOP
        INSERT INTO public.test_cases (
            test_case_id, name, description, category_id, category, protocol, version,
            complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
            test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
            is_premium, is_featured, is_active
        ) VALUES (
            '4LTE_CONF_' || LPAD(i::TEXT, 4, '0'),
            '4G LTE Conformance - ' || lte_conformance_scenarios[i],
            '4G LTE conformance testing: ' || lte_conformance_scenarios[i] || ' with 3GPP standard compliance validation',
            category_4g_lte,
            '4G_LTE',
            'LTE',
            '1.0',
            'expert',
            'conformance',
            25 + (i % 35),
            0.18 + (i * 0.005),
            ARRAY['4G', 'LTE', 'conformance', '3GPP', 'TS_36_' || LPAD((210 + i)::TEXT, 3, '0'), 'compliance', 'validation'],
            ARRAY['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'],
            jsonb_build_object(
                'scenario', 'conformance_testing',
                'standard_reference', lte_conformance_scenarios[i],
                'test_category', 'conformance',
                'compliance_level', 'mandatory',
                'validation_type', 'automated'
            ),
            jsonb_build_object(
                'conformance_success', true,
                'compliance_rate', 100,
                'standard_validation', true,
                'test_execution_success', true,
                'conformance_latency_ms', 120 + (i % 180)
            ),
            jsonb_build_object(
                'conformance_success', true,
                'compliance_rate', jsonb_build_object('min', 100),
                'standard_validation', true
            ),
            jsonb_build_object(
                'conformance_failure', false,
                'compliance_rate', jsonb_build_object('min', 95),
                'standard_validation', false
            ),
            jsonb_build_object(
                'compliance_rate', jsonb_build_object('target', 100, 'min', 100),
                'conformance_latency_ms', jsonb_build_object('target', 120 + (i % 180), 'max', 600 + (i % 400))
            ),
            true,
            CASE WHEN i % 8 = 0 THEN true ELSE false END,
            true
        ) ON CONFLICT (test_case_id) DO NOTHING;
    END LOOP;
END $$;

-- Verification for 4G LTE test cases
DO $$
DECLARE
    test_case_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO test_case_count FROM public.test_cases WHERE category = '4G_LTE';
    RAISE NOTICE '✅ 4G LTE test cases created: %', test_case_count;
    
    IF test_case_count >= 200 THEN
        RAISE NOTICE '🎉 4G LTE test case generation completed successfully!';
    ELSE
        RAISE NOTICE '❌ 4G LTE test case generation incomplete. Expected: 200+, Actual: %', test_case_count;
    END IF;
END $$;

-- ==============================================
-- 3. IMS/SIP TEST CASES (150+ Test Cases)
-- ==============================================

-- IMS/SIP Registration Test Cases (30+ scenarios)
DO $$
DECLARE
    category_ims_sip UUID;
    i INTEGER;
    ims_scenarios TEXT[] := ARRAY[
        'Basic IMS Registration', 'High Mobility IMS Registration', 'Low Power IMS Registration',
        'Extended Coverage IMS Registration', 'Multi-Device IMS Registration', 'Roaming IMS Registration',
        'Emergency IMS Registration', 'Priority IMS Registration', 'Non-3GPP IMS Registration',
        'Satellite IMS Registration', 'Indoor IMS Registration', 'Outdoor IMS Registration',
        'Urban IMS Registration', 'Rural IMS Registration', 'Highway IMS Registration',
        'Railway IMS Registration', 'Aerial IMS Registration', 'Maritime IMS Registration',
        'Underground IMS Registration', 'High Altitude IMS Registration', 'Low Altitude IMS Registration',
        'Moving Vehicle IMS Registration', 'Stationary IMS Registration', 'Fast Moving IMS Registration',
        'Slow Moving IMS Registration', 'High Density IMS Registration', 'Low Density IMS Registration',
        'Mixed Traffic IMS Registration', 'Voice IMS Registration', 'Video IMS Registration'
    ];
BEGIN
    SELECT id INTO category_ims_sip FROM public.test_case_categories WHERE name = 'IMS_SIP';
    
    FOR i IN 1..30 LOOP
        INSERT INTO public.test_cases (
            test_case_id, name, description, category_id, category, protocol, version,
            complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
            test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
            is_premium, is_featured, is_active
        ) VALUES (
            'IMS_REG_' || LPAD(i::TEXT, 4, '0'),
            'IMS Registration - ' || ims_scenarios[i],
            'IMS registration procedure: ' || ims_scenarios[i] || ' with complete SIP REGISTER and authentication',
            category_ims_sip,
            'IMS_SIP',
            'SIP',
            '1.0',
            CASE WHEN i % 4 = 0 THEN 'expert' WHEN i % 4 = 1 THEN 'advanced' WHEN i % 4 = 2 THEN 'intermediate' ELSE 'beginner' END,
            'functional',
            10 + (i % 15),
            0.03 + (i * 0.001),
            ARRAY['IMS', 'SIP', 'registration', 'authentication', 'AKA', LOWER(REPLACE(ims_scenarios[i], ' ', '_'))],
            ARRAY['SIP', 'IMS', 'NAS'],
            jsonb_build_object(
                'scenario', 'ims_registration',
                'scenario_type', ims_scenarios[i],
                'authentication', 'AKA',
                'service_profile', CASE WHEN i % 3 = 0 THEN '["voice", "video"]' WHEN i % 3 = 1 THEN '["voice"]' ELSE '["video"]' END,
                'network_domain', 'ims.mnc001.mcc001.3gppnetwork.org'
            ),
            jsonb_build_object(
                'registration_success', true,
                'registration_latency_ms', 150 + (i % 150),
                'authentication_success', true,
                'service_profile_activated', true,
                'security_context_established', true
            ),
            jsonb_build_object(
                'registration_success', true,
                'authentication_success', true,
                'registration_latency_ms', jsonb_build_object('max', 300 + (i % 200))
            ),
            jsonb_build_object(
                'registration_failure', false,
                'authentication_failure', false,
                'registration_latency_ms', jsonb_build_object('max', 600 + (i % 300))
            ),
            jsonb_build_object(
                'registration_latency_ms', jsonb_build_object('target', 150 + (i % 150), 'max', 300 + (i % 200)),
                'authentication_success_rate', jsonb_build_object('target', 100, 'min', 95)
            ),
            CASE WHEN i % 3 = 0 THEN true ELSE false END,
            CASE WHEN i % 5 = 0 THEN true ELSE false END,
            true
        ) ON CONFLICT (test_case_id) DO NOTHING;
    END LOOP;
END $$;

-- IMS/SIP Call Setup Test Cases (30+ scenarios)
DO $$
DECLARE
    category_ims_sip UUID;
    i INTEGER;
    sip_call_scenarios TEXT[] := ARRAY[
        'Basic Voice Call', 'Video Call', 'Conference Call', 'Emergency Call',
        'Priority Call', 'Roaming Call', 'International Call', 'Local Call',
        'Long Distance Call', 'Toll-Free Call', 'Premium Call', 'Business Call',
        'Personal Call', 'Group Call', 'Broadcast Call', 'Multicast Call',
        'Unicast Call', 'Anycast Call', 'Geocast Call', 'Timecast Call',
        'Eventcast Call', 'Contentcast Call', 'Servicecast Call', 'Application Call',
        'Device Call', 'User Call', 'Session Call', 'Connection Call',
        'Communication Call', 'Interaction Call'
    ];
BEGIN
    SELECT id INTO category_ims_sip FROM public.test_case_categories WHERE name = 'IMS_SIP';
    
    FOR i IN 1..30 LOOP
        INSERT INTO public.test_cases (
            test_case_id, name, description, category_id, category, protocol, version,
            complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
            test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
            is_premium, is_featured, is_active
        ) VALUES (
            'SIP_CALL_' || LPAD(i::TEXT, 4, '0'),
            'SIP Call Setup - ' || sip_call_scenarios[i],
            'SIP call setup procedure: ' || sip_call_scenarios[i] || ' with INVITE, 180 Ringing, and 200 OK',
            category_ims_sip,
            'IMS_SIP',
            'SIP',
            '1.0',
            CASE WHEN i % 4 = 0 THEN 'expert' WHEN i % 4 = 1 THEN 'advanced' WHEN i % 4 = 2 THEN 'intermediate' ELSE 'beginner' END,
            'functional',
            6 + (i % 12),
            0.02 + (i * 0.001),
            ARRAY['SIP', 'call_setup', LOWER(REPLACE(sip_call_scenarios[i], ' ', '_')), 'INVITE', 'RTP'],
            ARRAY['SIP', 'RTP'],
            jsonb_build_object(
                'scenario', 'call_setup',
                'call_type', sip_call_scenarios[i],
                'codec', CASE WHEN i % 4 = 0 THEN 'AMR' WHEN i % 4 = 1 THEN 'G.711' WHEN i % 4 = 2 THEN 'G.722' ELSE 'H.264' END,
                'media_type', CASE WHEN i % 2 = 0 THEN 'audio' ELSE 'video' END
            ),
            jsonb_build_object(
                'call_setup_success', true,
                'call_setup_latency_ms', 100 + (i % 150),
                'media_established', true,
                'call_quality', CASE WHEN i % 3 = 0 THEN 'excellent' WHEN i % 3 = 1 THEN 'good' ELSE 'acceptable' END
            ),
            jsonb_build_object(
                'call_setup_success', true,
                'media_established', true,
                'call_setup_latency_ms', jsonb_build_object('max', 250 + (i % 150))
            ),
            jsonb_build_object(
                'call_setup_failure', false,
                'media_failure', false,
                'call_setup_latency_ms', jsonb_build_object('max', 500 + (i % 250))
            ),
            jsonb_build_object(
                'call_setup_latency_ms', jsonb_build_object('target', 100 + (i % 150), 'max', 250 + (i % 150)),
                'call_quality', jsonb_build_object('target', 'good', 'min', 'acceptable')
            ),
            CASE WHEN i % 4 = 0 THEN true ELSE false END,
            CASE WHEN i % 6 = 0 THEN true ELSE false END,
            true
        ) ON CONFLICT (test_case_id) DO NOTHING;
    END LOOP;
END $$;

-- IMS/SIP Media Handling Test Cases (30+ scenarios)
DO $$
DECLARE
    category_ims_sip UUID;
    i INTEGER;
    media_scenarios TEXT[] := ARRAY[
        'Audio Codec Negotiation', 'Video Codec Negotiation', 'Media Quality Adaptation',
        'Bandwidth Adaptation', 'Latency Optimization', 'Jitter Control',
        'Packet Loss Recovery', 'Error Correction', 'Forward Error Correction',
        'Retransmission', 'Redundancy', 'Compression', 'Decompression',
        'Encryption', 'Decryption', 'Authentication', 'Authorization',
        'Key Exchange', 'Session Management', 'Connection Management',
        'Resource Management', 'Quality Management', 'Performance Management',
        'Security Management', 'Privacy Management', 'Compliance Management',
        'Monitoring Management', 'Logging Management', 'Audit Management',
        'Configuration Management'
    ];
BEGIN
    SELECT id INTO category_ims_sip FROM public.test_case_categories WHERE name = 'IMS_SIP';
    
    FOR i IN 1..30 LOOP
        INSERT INTO public.test_cases (
            test_case_id, name, description, category_id, category, protocol, version,
            complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
            test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
            is_premium, is_featured, is_active
        ) VALUES (
            'SIP_MEDIA_' || LPAD(i::TEXT, 4, '0'),
            'SIP Media Handling - ' || media_scenarios[i],
            'SIP media handling: ' || media_scenarios[i] || ' with comprehensive media processing and optimization',
            category_ims_sip,
            'IMS_SIP',
            'SIP',
            '1.0',
            CASE WHEN i % 3 = 0 THEN 'expert' WHEN i % 3 = 1 THEN 'advanced' ELSE 'intermediate' END,
            'performance',
            12 + (i % 18),
            0.05 + (i * 0.002),
            ARRAY['SIP', 'media', LOWER(REPLACE(media_scenarios[i], ' ', '_')), 'RTP', 'optimization'],
            ARRAY['SIP', 'RTP', 'Media'],
            jsonb_build_object(
                'scenario', 'media_handling',
                'media_type', media_scenarios[i],
                'codec', CASE WHEN i % 4 = 0 THEN 'AMR' WHEN i % 4 = 1 THEN 'G.711' WHEN i % 4 = 2 THEN 'G.722' ELSE 'H.264' END,
                'bandwidth', CASE WHEN i % 3 = 0 THEN 'high' WHEN i % 3 = 1 THEN 'medium' ELSE 'low' END
            ),
            jsonb_build_object(
                'media_success', true,
                'media_quality', 90 + (i % 10),
                'media_latency_ms', 20 + (i % 30),
                'media_throughput_kbps', 100 + (i * 10),
                'media_reliability', 95 + (i % 5)
            ),
            jsonb_build_object(
                'media_success', true,
                'media_quality', jsonb_build_object('min', 80 + (i % 20)),
                'media_latency_ms', jsonb_build_object('max', 50 + (i % 50))
            ),
            jsonb_build_object(
                'media_failure', false,
                'media_quality', jsonb_build_object('min', 60 + (i % 40)),
                'media_latency_ms', jsonb_build_object('max', 100 + (i % 100))
            ),
            jsonb_build_object(
                'media_quality', jsonb_build_object('target', 90 + (i % 10), 'min', 80 + (i % 20)),
                'media_latency_ms', jsonb_build_object('target', 20 + (i % 30), 'max', 50 + (i % 50))
            ),
            true,
            CASE WHEN i % 4 = 0 THEN true ELSE false END,
            true
        ) ON CONFLICT (test_case_id) DO NOTHING;
    END LOOP;
END $$;

-- IMS/SIP Security Test Cases (30+ scenarios)
DO $$
DECLARE
    category_ims_sip UUID;
    i INTEGER;
    sip_security_scenarios TEXT[] := ARRAY[
        'SIP Authentication', 'SIP Authorization', 'SIP Encryption', 'SIP Integrity Protection',
        'SIP Key Management', 'SIP Certificate Management', 'SIP Identity Management', 'SIP Access Control',
        'SIP Privacy Protection', 'SIP Data Protection', 'SIP Network Security', 'SIP Service Security',
        'SIP Application Security', 'SIP Device Security', 'SIP User Security', 'SIP Session Security',
        'SIP Connection Security', 'SIP Communication Security', 'SIP Storage Security', 'SIP Processing Security',
        'SIP Transmission Security', 'SIP Reception Security', 'SIP Forwarding Security', 'SIP Routing Security',
        'SIP Switching Security', 'SIP Multiplexing Security', 'SIP Demultiplexing Security', 'SIP Scheduling Security',
        'SIP Resource Security', 'SIP Quality Security'
    ];
BEGIN
    SELECT id INTO category_ims_sip FROM public.test_case_categories WHERE name = 'IMS_SIP';
    
    FOR i IN 1..30 LOOP
        INSERT INTO public.test_cases (
            test_case_id, name, description, category_id, category, protocol, version,
            complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
            test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
            is_premium, is_featured, is_active
        ) VALUES (
            'SIP_SEC_' || LPAD(i::TEXT, 4, '0'),
            'SIP Security - ' || sip_security_scenarios[i],
            'SIP security testing: ' || sip_security_scenarios[i] || ' with comprehensive security validation',
            category_ims_sip,
            'IMS_SIP',
            'SIP',
            '1.0',
            CASE WHEN i % 3 = 0 THEN 'expert' WHEN i % 3 = 1 THEN 'advanced' ELSE 'intermediate' END,
            'security',
            14 + (i % 16),
            0.08 + (i * 0.003),
            ARRAY['SIP', 'security', LOWER(REPLACE(sip_security_scenarios[i], ' ', '_')), 'protection', 'validation'],
            ARRAY['SIP', 'TLS', 'SRTP'],
            jsonb_build_object(
                'scenario', 'security_testing',
                'security_type', sip_security_scenarios[i],
                'encryption_algorithm', CASE WHEN i % 3 = 0 THEN 'AES-256' WHEN i % 3 = 1 THEN 'AES-128' ELSE 'ChaCha20' END,
                'integrity_algorithm', CASE WHEN i % 2 = 0 THEN 'HMAC-SHA256' ELSE 'HMAC-SHA1' END
            ),
            jsonb_build_object(
                'security_success', true,
                'authentication_success', true,
                'encryption_success', true,
                'integrity_success', true,
                'security_latency_ms', 10 + (i % 20)
            ),
            jsonb_build_object(
                'security_success', true,
                'authentication_success', true,
                'encryption_success', true,
                'integrity_success', true,
                'security_latency_ms', jsonb_build_object('max', 30 + (i % 40))
            ),
            jsonb_build_object(
                'security_failure', false,
                'authentication_failure', false,
                'encryption_failure', false,
                'integrity_failure', false,
                'security_latency_ms', jsonb_build_object('max', 60 + (i % 60))
            ),
            jsonb_build_object(
                'security_latency_ms', jsonb_build_object('target', 10 + (i % 20), 'max', 30 + (i % 40)),
                'security_success_rate', jsonb_build_object('target', 100, 'min', 99)
            ),
            true,
            CASE WHEN i % 3 = 0 THEN true ELSE false END,
            true
        ) ON CONFLICT (test_case_id) DO NOTHING;
    END LOOP;
END $$;

-- IMS/SIP Interoperability Test Cases (30+ scenarios)
DO $$
DECLARE
    category_ims_sip UUID;
    i INTEGER;
    sip_interop_scenarios TEXT[] := ARRAY[
        'SIP-H.323 Interoperability', 'SIP-MGCP Interoperability', 'SIP-MEGACO Interoperability',
        'SIP-SIP Interoperability', 'SIP-WebRTC Interoperability', 'SIP-IMS Interoperability',
        'SIP-PSTN Interoperability', 'SIP-ISDN Interoperability', 'SIP-GSM Interoperability',
        'SIP-CDMA Interoperability', 'SIP-LTE Interoperability', 'SIP-5G Interoperability',
        'SIP-WiFi Interoperability', 'SIP-Bluetooth Interoperability', 'SIP-Zigbee Interoperability',
        'SIP-LoRa Interoperability', 'SIP-NB-IoT Interoperability', 'SIP-LTE-M Interoperability',
        'SIP-Satellite Interoperability', 'SIP-Cable Interoperability', 'SIP-DSL Interoperability',
        'SIP-Fiber Interoperability', 'SIP-Microwave Interoperability', 'SIP-Millimeter Interoperability',
        'SIP-Terahertz Interoperability', 'SIP-Optical Interoperability', 'SIP-Acoustic Interoperability',
        'SIP-Magnetic Interoperability', 'SIP-Electric Interoperability', 'SIP-Electromagnetic Interoperability'
    ];
BEGIN
    SELECT id INTO category_ims_sip FROM public.test_case_categories WHERE name = 'IMS_SIP';
    
    FOR i IN 1..30 LOOP
        INSERT INTO public.test_cases (
            test_case_id, name, description, category_id, category, protocol, version,
            complexity, test_type, duration_minutes, estimated_cost, tags, protocol_layers,
            test_data, expected_results, success_criteria, failure_thresholds, performance_targets,
            is_premium, is_featured, is_active
        ) VALUES (
            'SIP_INT_' || LPAD(i::TEXT, 4, '0'),
            'SIP Interoperability - ' || sip_interop_scenarios[i],
            'SIP interoperability testing: ' || sip_interop_scenarios[i] || ' with seamless connectivity and protocol translation',
            category_ims_sip,
            'IMS_SIP',
            'SIP',
            '1.0',
            CASE WHEN i % 4 = 0 THEN 'expert' WHEN i % 4 = 1 THEN 'advanced' WHEN i % 4 = 2 THEN 'intermediate' ELSE 'beginner' END,
            'interoperability',
            16 + (i % 20),
            0.10 + (i * 0.004),
            ARRAY['SIP', 'interoperability', LOWER(REPLACE(sip_interop_scenarios[i], '-', '_')), 'connectivity', 'translation'],
            ARRAY['SIP', 'Gateway', 'Protocol'],
            jsonb_build_object(
                'scenario', 'interoperability_testing',
                'interop_type', sip_interop_scenarios[i],
                'source_protocol', SPLIT_PART(sip_interop_scenarios[i], '-', 1),
                'target_protocol', SPLIT_PART(sip_interop_scenarios[i], '-', 2),
                'translation_type', CASE WHEN i % 3 = 0 THEN 'seamless' WHEN i % 3 = 1 THEN 'gateway' ELSE 'proxy' END
            ),
            jsonb_build_object(
                'interop_success', true,
                'translation_success', true,
                'connectivity_success', true,
                'service_continuity', true,
                'interop_latency_ms', 80 + (i % 120),
                'throughput_retention', 80 + (i % 20)
            ),
            jsonb_build_object(
                'interop_success', true,
                'translation_success', true,
                'connectivity_success', true,
                'interop_latency_ms', jsonb_build_object('max', 300 + (i % 200))
            ),
            jsonb_build_object(
                'interop_failure', false,
                'translation_failure', false,
                'connectivity_failure', false,
                'interop_latency_ms', jsonb_build_object('max', 600 + (i % 400))
            ),
            jsonb_build_object(
                'interop_latency_ms', jsonb_build_object('target', 80 + (i % 120), 'max', 300 + (i % 200)),
                'throughput_retention', jsonb_build_object('target', 80 + (i % 20), 'min', 60 + (i % 40))
            ),
            true,
            CASE WHEN i % 4 = 0 THEN true ELSE false END,
            true
        ) ON CONFLICT (test_case_id) DO NOTHING;
    END LOOP;
END $$;

-- Verification for IMS/SIP test cases
DO $$
DECLARE
    test_case_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO test_case_count FROM public.test_cases WHERE category = 'IMS_SIP';
    RAISE NOTICE '✅ IMS/SIP test cases created: %', test_case_count;
    
    IF test_case_count >= 150 THEN
        RAISE NOTICE '🎉 IMS/SIP test case generation completed successfully!';
    ELSE
        RAISE NOTICE '❌ IMS/SIP test case generation incomplete. Expected: 150+, Actual: %', test_case_count;
    END IF;
END $$;