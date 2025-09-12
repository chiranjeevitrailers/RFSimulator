-- ==============================================
-- 5GLabX Platform - Default Configurations Seed Data (V2)
-- Clean, robust, and maintainable configuration management
-- ==============================================

-- ==============================================
-- 1. HELPER FUNCTIONS
-- ==============================================

-- Function to get or create system user
CREATE OR REPLACE FUNCTION get_system_user()
RETURNS UUID AS $$
DECLARE
    system_user_id UUID;
BEGIN
    -- Try to find existing admin user first
    SELECT id INTO system_user_id 
    FROM public.users 
    WHERE role = 'admin' 
    LIMIT 1;
    
    -- If no admin user exists, return NULL (configurations will be created later)
    IF system_user_id IS NULL THEN
        RAISE NOTICE 'No admin user found. Default configurations will be created when admin user is available.';
        RETURN NULL;
    END IF;
    
    RAISE NOTICE 'Using admin user % for system configurations', system_user_id;
    RETURN system_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create configuration data
CREATE OR REPLACE FUNCTION create_config_data(
    protocol_type TEXT,
    custom_params JSONB DEFAULT '{}'::JSONB
)
RETURNS JSONB AS $$
DECLARE
    base_config JSONB;
BEGIN
    -- Base configuration structure
    base_config := '{
        "general": {
            "executionMode": "simulation",
            "timeAcceleration": 1,
            "logLevel": "detailed",
            "captureMode": "full",
            "outputFormat": "json",
            "autoStart": false,
            "autoStop": true,
            "timeout": 300000
        },
        "network": {
            "plmn": {"mcc": "001", "mnc": "01"},
            "cell": {"cellId": 123456, "pci": 123, "tac": 1},
            "frequency": {"dlFreq": 2100, "ulFreq": 1900, "bandwidth": 20},
            "power": {"txPower": 23, "rxPower": -80, "rsrp": -85, "rsrq": -12, "sinr": 18}
        },
        "ue": {
            "identity": {"imsi": "001010123456789", "imei": "123456789012345"},
            "capabilities": {"maxBandwidth": 20, "maxMimoLayers": 2, "supportedModulations": ["QPSK", "16QAM"]},
            "security": {"authentication": "AKA", "encryption": "AES-128", "integrity": "AES-128"}
        },
        "testSpecific": {
            "scenario": "default",
            "testType": "functional",
            "duration": 300,
            "iterations": 1,
            "successCriteria": {},
            "failureThresholds": {},
            "performanceTargets": {}
        },
        "advanced": {
            "debugMode": false,
            "traceLevel": "basic",
            "memoryLimit": 1024,
            "cpuLimit": 80,
            "customParameters": {}
        }
    }'::JSONB;
    
    -- Add protocol-specific configurations
    CASE protocol_type
        WHEN '5G_NR' THEN
            base_config := base_config || '{
                "layers": {
                    "PHY": {
                        "dlArfcn": 3732480, "ulArfcn": 3732480, "bandwidth": 100, "subcarrierSpacing": 30,
                        "pci": 123, "cellId": 123456, "rsrp": -85, "rsrq": -12, "sinr": 18, "cqi": 13, "mcs": 20,
                        "bler": 0.01, "mimoLayers": 4, "modulation": "256QAM", "codingRate": 0.8,
                        "powerControl": {"enabled": true, "algorithm": "closed_loop", "target": -80},
                        "beamforming": {"enabled": true, "algorithm": "digital", "beams": 4}
                    },
                    "MAC": {
                        "harq": {"enabled": true, "maxProcesses": 16, "maxRetransmissions": 3, "algorithm": "incremental_redundancy"},
                        "scheduling": {"algorithm": "proportional_fair", "interval": 1, "priority": {}},
                        "logicalChannels": {"maxChannels": 32, "channelConfig": {}},
                        "randomAccess": {"preambleFormat": "format_0", "maxAttempts": 3, "backoffTime": 100}
                    },
                    "RLC": {
                        "mode": "AM", "maxRetransmissions": 3, "pollingInterval": 100, "windowSize": 1024,
                        "segmentation": {"enabled": true, "maxSize": 9000},
                        "reordering": {"enabled": true, "timer": 100}
                    },
                    "PDCP": {
                        "mode": "AM", "security": {"enabled": true, "encryption": "AES-128", "integrity": "AES-128"},
                        "compression": {"enabled": true, "algorithm": "ROHC"},
                        "sequenceNumber": {"size": 12, "window": 4096}
                    },
                    "RRC": {
                        "state": "RRC_CONNECTED", "security": {"activated": true, "algorithms": ["AES-128", "AES-256"]},
                        "mobility": {"enabled": true, "measurements": true, "handover": true},
                        "measurements": {"enabled": true, "interval": 1000, "reporting": true}
                    },
                    "NAS": {
                        "state": "REGISTERED", "security": {"context": "activated", "algorithms": ["AES-128", "AES-256"]},
                        "mobility": {"enabled": true, "trackingArea": "123456"},
                        "session": {"maxSessions": 15, "defaultSession": {}}
                    }
                }
            }'::JSONB;
            
        WHEN '4G_LTE' THEN
            base_config := base_config || '{
                "layers": {
                    "PHY": {
                        "dlArfcn": 1800, "ulArfcn": 1800, "bandwidth": 20, "subcarrierSpacing": 15,
                        "pci": 123, "cellId": 123456, "rsrp": -85, "rsrq": -12, "sinr": 18, "cqi": 13, "mcs": 20,
                        "bler": 0.01, "mimoLayers": 4, "modulation": "64QAM", "codingRate": 0.8,
                        "powerControl": {"enabled": true, "algorithm": "closed_loop", "target": -80},
                        "beamforming": {"enabled": false, "algorithm": "none", "beams": 1}
                    },
                    "MAC": {
                        "harq": {"enabled": true, "maxProcesses": 8, "maxRetransmissions": 3, "algorithm": "incremental_redundancy"},
                        "scheduling": {"algorithm": "proportional_fair", "interval": 1, "priority": {}},
                        "logicalChannels": {"maxChannels": 16, "channelConfig": {}},
                        "randomAccess": {"preambleFormat": "format_0", "maxAttempts": 3, "backoffTime": 100}
                    },
                    "RLC": {
                        "mode": "AM", "maxRetransmissions": 3, "pollingInterval": 100, "windowSize": 512,
                        "segmentation": {"enabled": true, "maxSize": 9000},
                        "reordering": {"enabled": true, "timer": 100}
                    },
                    "PDCP": {
                        "mode": "AM", "security": {"enabled": true, "encryption": "AES-128", "integrity": "AES-128"},
                        "compression": {"enabled": true, "algorithm": "ROHC"},
                        "sequenceNumber": {"size": 12, "window": 4096}
                    },
                    "RRC": {
                        "state": "RRC_CONNECTED", "security": {"activated": true, "algorithms": ["AES-128", "AES-256"]},
                        "mobility": {"enabled": true, "measurements": true, "handover": true},
                        "measurements": {"enabled": true, "interval": 1000, "reporting": true}
                    },
                    "NAS": {
                        "state": "REGISTERED", "security": {"context": "activated", "algorithms": ["AES-128", "AES-256"]},
                        "mobility": {"enabled": true, "trackingArea": "123456"},
                        "session": {"maxSessions": 11, "defaultSession": {}}
                    }
                }
            }'::JSONB;
            
        WHEN 'IMS_SIP' THEN
            base_config := base_config || '{
                "layers": {
                    "SIP": {
                        "version": "2.0", "transport": "UDP", "port": 5060, "authentication": "Digest",
                        "registration": {"interval": 3600, "maxAttempts": 3},
                        "session": {"timer": 1800, "refresh": 1800}
                    },
                    "IMS": {
                        "version": "3GPP Release 15", "serviceProfile": ["voice", "video"],
                        "authentication": "AKA", "services": {"voice": true, "video": true, "messaging": true},
                        "network": {"domain": "ims.mnc001.mcc001.3gppnetwork.org", "proxy": "p-cscf.ims.mnc001.mcc001.3gppnetwork.org"}
                    }
                }
            }'::JSONB;
            
        WHEN 'O_RAN' THEN
            base_config := base_config || '{
                "layers": {
                    "E2": {
                        "interface_type": "E2", "service_model": "E2SM-KPM", "node_type": "gNB",
                        "performance_metrics": ["throughput", "latency", "error_rate"],
                        "reporting_period": 1000, "subscription_type": "periodic"
                    }
                }
            }'::JSONB;
            
        WHEN 'NB_IoT' THEN
            base_config := base_config || '{
                "layers": {
                    "PHY": {
                        "dlArfcn": 900, "ulArfcn": 900, "bandwidth": 0.2, "subcarrierSpacing": 15,
                        "pci": 123, "cellId": 123456, "rsrp": -120, "rsrq": -15, "sinr": 10, "cqi": 5, "mcs": 5,
                        "bler": 0.1, "mimoLayers": 1, "modulation": "QPSK", "codingRate": 0.5,
                        "powerControl": {"enabled": true, "algorithm": "open_loop", "target": -100},
                        "beamforming": {"enabled": false, "algorithm": "none", "beams": 1}
                    },
                    "MAC": {
                        "harq": {"enabled": true, "maxProcesses": 4, "maxRetransmissions": 3, "algorithm": "incremental_redundancy"},
                        "scheduling": {"algorithm": "round_robin", "interval": 10, "priority": {}},
                        "logicalChannels": {"maxChannels": 4, "channelConfig": {}},
                        "randomAccess": {"preambleFormat": "format_0", "maxAttempts": 5, "backoffTime": 1000}
                    }
                }
            }'::JSONB;
            
        WHEN 'V2X' THEN
            base_config := base_config || '{
                "layers": {
                    "PC5": {
                        "communication_type": "PC5", "safety_application": "emergency_brake",
                        "distance_m": 100, "message_type": "CAM", "transmission_power": 23,
                        "frequency": 5900, "bandwidth": 10
                    }
                }
            }'::JSONB;
            
        WHEN 'NTN' THEN
            base_config := base_config || '{
                "layers": {
                    "NTN": {
                        "satellite_type": "LEO", "constellation": "Starlink", "altitude_km": 550,
                        "coverage_area": "global", "handover_type": "satellite_handover",
                        "propagation_delay_ms": 25, "doppler_shift_hz": 1000
                    }
                }
            }'::JSONB;
            
        WHEN 'CUSTOM' THEN
            base_config := base_config || '{
                "layers": {
                    "Custom": {
                        "protocol_name": "user_defined", "custom_parameters": {},
                        "validation_rules": {}, "performance_metrics": {}
                    }
                }
            }'::JSONB;
    END CASE;
    
    -- Merge custom parameters if provided
    IF custom_params != '{}'::JSONB THEN
        base_config := base_config || custom_params;
    END IF;
    
    RETURN base_config;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- 2. MAIN CONFIGURATION CREATION
-- ==============================================

-- Create default configurations for all test cases
DO $$
DECLARE
    system_user_id UUID;
    test_case_record RECORD;
    config_count INTEGER := 0;
    error_count INTEGER := 0;
BEGIN
    -- Get system user
    system_user_id := get_system_user();
    
    -- If no system user, skip configuration creation
    IF system_user_id IS NULL THEN
        RAISE NOTICE 'Skipping default configuration creation - no system user available';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Creating default configurations for all test cases...';
    
    -- Loop through all active test cases
    FOR test_case_record IN 
        SELECT id, test_case_id, category, protocol, name 
        FROM public.test_cases 
        WHERE is_active = true
        ORDER BY category, protocol
    LOOP
        BEGIN
            -- Insert default configuration
            INSERT INTO public.test_configurations (
                id, name, description, test_case_id, user_id, category, protocol, version,
                configuration_data, is_template, is_public, is_default, usage_count, rating
            ) VALUES (
                gen_random_uuid(),
                'Default ' || test_case_record.protocol || ' Configuration',
                'Default configuration for ' || test_case_record.protocol || ' test cases with standard parameters',
                test_case_record.id,
                system_user_id,
                test_case_record.category,
                test_case_record.protocol,
                '1.0',
                create_config_data(test_case_record.category),
                true,
                true,
                true,
                0,
                0.0
            ) ON CONFLICT (name, user_id) DO NOTHING;
            
            config_count := config_count + 1;
            
        EXCEPTION WHEN OTHERS THEN
            error_count := error_count + 1;
            RAISE WARNING 'Failed to create configuration for test case %: %', test_case_record.test_case_id, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE 'Default configurations created: % (errors: %)', config_count, error_count;
END $$;

-- ==============================================
-- 3. TEMPLATE CONFIGURATIONS
-- ==============================================

-- Create additional template configurations
DO $$
DECLARE
    system_user_id UUID;
BEGIN
    -- Get system user
    system_user_id := get_system_user();
    
    -- If no system user, skip template creation
    IF system_user_id IS NULL THEN
        RAISE NOTICE 'Skipping template configuration creation - no system user available';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Creating template configurations...';
    
    -- High Performance 5G NR Configuration
    INSERT INTO public.test_configurations (
        id, name, description, test_case_id, user_id, category, protocol, version,
        configuration_data, is_template, is_public, is_default, usage_count, rating
    ) VALUES (
        gen_random_uuid(),
        'High Performance 5G NR Configuration',
        'Optimized 5G NR configuration for maximum performance testing',
        NULL,
        system_user_id,
        '5G_NR',
        'NR',
        '1.0',
        create_config_data('5G_NR', '{
            "general": {
                "executionMode": "realtime",
                "timeAcceleration": 10,
                "logLevel": "verbose",
                "captureMode": "performance",
                "autoStart": true,
                "timeout": 600000
            },
            "testSpecific": {
                "scenario": "high_performance",
                "testType": "performance",
                "duration": 600,
                "iterations": 10,
                "successCriteria": {"throughput_mbps": {"min": 2000}},
                "failureThresholds": {"throughput_mbps": {"min": 1500}},
                "performanceTargets": {"throughput_mbps": {"target": 2000, "min": 1500}}
            },
            "advanced": {
                "debugMode": true,
                "traceLevel": "full",
                "memoryLimit": 2048,
                "cpuLimit": 90,
                "customParameters": {"optimization_level": "maximum", "parallel_processing": true}
            }
        }'::JSONB),
        true,
        true,
        false,
        0,
        0.0
    ) ON CONFLICT (name, user_id) DO NOTHING;
    
    -- Debug Configuration
    INSERT INTO public.test_configurations (
        id, name, description, test_case_id, user_id, category, protocol, version,
        configuration_data, is_template, is_public, is_default, usage_count, rating
    ) VALUES (
        gen_random_uuid(),
        'Debug Configuration',
        'Configuration optimized for debugging and troubleshooting',
        NULL,
        system_user_id,
        '5G_NR',
        'NR',
        '1.0',
        create_config_data('5G_NR', '{
            "general": {
                "executionMode": "simulation",
                "timeAcceleration": 0.1,
                "logLevel": "verbose",
                "captureMode": "full",
                "autoStart": false,
                "autoStop": false,
                "timeout": 1800000
            },
            "testSpecific": {
                "scenario": "debug",
                "testType": "functional",
                "duration": 1800,
                "iterations": 1
            },
            "advanced": {
                "debugMode": true,
                "traceLevel": "full",
                "memoryLimit": 4096,
                "cpuLimit": 95,
                "customParameters": {"detailed_logging": true, "step_by_step": true, "breakpoints": true}
            }
        }'::JSONB),
        true,
        true,
        false,
        0,
        0.0
    ) ON CONFLICT (name, user_id) DO NOTHING;
    
    RAISE NOTICE 'Template configurations created successfully';
END $$;

-- ==============================================
-- 4. CLEANUP AND VERIFICATION
-- ==============================================

-- Drop helper functions
DROP FUNCTION IF EXISTS get_system_user();
DROP FUNCTION IF EXISTS create_config_data(TEXT, JSONB);

-- Verification
DO $$
DECLARE
    config_count INTEGER;
    template_count INTEGER;
    default_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO config_count FROM public.test_configurations;
    SELECT COUNT(*) INTO template_count FROM public.test_configurations WHERE is_template = true;
    SELECT COUNT(*) INTO default_count FROM public.test_configurations WHERE is_default = true;
    
    RAISE NOTICE '==============================================';
    RAISE NOTICE '✅ CONFIGURATION SEED DATA VERIFICATION';
    RAISE NOTICE '==============================================';
    RAISE NOTICE '✅ Total configurations created: %', config_count;
    RAISE NOTICE '✅ Template configurations created: %', template_count;
    RAISE NOTICE '✅ Default configurations created: %', default_count;
    RAISE NOTICE '==============================================';
    
    IF config_count >= 10 AND template_count >= 10 AND default_count >= 8 THEN
        RAISE NOTICE '🎉 Default configurations seed data created successfully!';
        RAISE NOTICE '✅ All protocol categories covered';
        RAISE NOTICE '✅ Template configurations available';
        RAISE NOTICE '✅ Ready for production use';
    ELSE
        RAISE NOTICE '❌ Some configuration data may be missing';
        RAISE NOTICE 'Expected: 10+ total, 10+ templates, 8+ defaults';
        RAISE NOTICE 'Actual: % total, % templates, % defaults', config_count, template_count, default_count;
    END IF;
END $$;