-- ==============================================
-- 5GLabX Platform - Default Configurations Seed Data
-- Production-ready default configurations for all protocols
-- ==============================================

-- Insert default configurations for all test cases
DO $$
DECLARE
    test_case_record RECORD;
    config_id UUID;
BEGIN
    -- Loop through all test cases and create default configurations
    FOR test_case_record IN 
        SELECT id, test_case_id, category, protocol, name 
        FROM public.test_cases 
        WHERE is_active = true
    LOOP
        -- Generate configuration ID
        config_id := gen_random_uuid();
        
        -- Insert default configuration based on category
        CASE test_case_record.category
            WHEN '5G_NR' THEN
                INSERT INTO public.test_configurations (
                    id, name, description, test_case_id, user_id, category, protocol, version,
                    configuration_data, is_template, is_public, is_default, usage_count, rating
                ) VALUES (
                    config_id,
                    'Default 5G NR Configuration',
                    'Default configuration for 5G NR test cases with standard parameters',
                    test_case_record.id,
                    NULL, -- System default configuration
                    '5G_NR',
                    'NR',
                    '1.0',
                    '{
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
                            "cell": {"cellId": 123456, "pci": 123, "tac": 1, "arfcn": 3732480},
                            "frequency": {"dlFreq": 2100, "ulFreq": 1900, "bandwidth": 100, "subcarrierSpacing": 30},
                            "power": {"txPower": 23, "rxPower": -80, "rsrp": -85, "rsrq": -12, "sinr": 18}
                        },
                        "ue": {
                            "identity": {"imsi": "001010123456789", "imei": "123456789012345"},
                            "capabilities": {"maxBandwidth": 100, "maxMimoLayers": 4, "supportedModulations": ["QPSK", "16QAM", "64QAM", "256QAM"]},
                            "security": {"authentication": "5G-AKA", "encryption": "AES-128", "integrity": "AES-128"}
                        },
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
                        },
                        "testSpecific": {
                            "scenario": "default", "testType": "functional", "duration": 300, "iterations": 1,
                            "successCriteria": {}, "failureThresholds": {}, "performanceTargets": {}
                        },
                        "advanced": {
                            "debugMode": false, "traceLevel": "basic", "memoryLimit": 1024, "cpuLimit": 80,
                            "customParameters": {}
                        }
                    }',
                    true,
                    true,
                    true,
                    0,
                    0.0
                ) ON CONFLICT (name, user_id) DO NOTHING;
                
            WHEN '4G_LTE' THEN
                INSERT INTO public.test_configurations (
                    id, name, description, test_case_id, user_id, category, protocol, version,
                    configuration_data, is_template, is_public, is_default, usage_count, rating
                ) VALUES (
                    config_id,
                    'Default 4G LTE Configuration',
                    'Default configuration for 4G LTE test cases with standard parameters',
                    test_case_record.id,
                    NULL,
                    '4G_LTE',
                    'LTE',
                    '1.0',
                    '{
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
                            "cell": {"cellId": 123456, "pci": 123, "tac": 1, "earfcn": 1800},
                            "frequency": {"dlFreq": 2100, "ulFreq": 1900, "bandwidth": 20},
                            "power": {"txPower": 23, "rxPower": -80, "rsrp": -85, "rsrq": -12, "sinr": 18}
                        },
                        "ue": {
                            "identity": {"imsi": "001010123456789", "imei": "123456789012345"},
                            "capabilities": {"maxBandwidth": 20, "maxMimoLayers": 4, "supportedModulations": ["QPSK", "16QAM", "64QAM"]},
                            "security": {"authentication": "AKA", "encryption": "AES-128", "integrity": "AES-128"}
                        },
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
                        },
                        "testSpecific": {
                            "scenario": "default", "testType": "functional", "duration": 300, "iterations": 1,
                            "successCriteria": {}, "failureThresholds": {}, "performanceTargets": {}
                        },
                        "advanced": {
                            "debugMode": false, "traceLevel": "basic", "memoryLimit": 1024, "cpuLimit": 80,
                            "customParameters": {}
                        }
                    }',
                    true,
                    true,
                    true,
                    0,
                    0.0
                ) ON CONFLICT (name, user_id) DO NOTHING;
                
            WHEN 'IMS_SIP' THEN
                INSERT INTO public.test_configurations (
                    id, name, description, test_case_id, user_id, category, protocol, version,
                    configuration_data, is_template, is_public, is_default, usage_count, rating
                ) VALUES (
                    config_id,
                    'Default IMS/SIP Configuration',
                    'Default configuration for IMS/SIP test cases with standard parameters',
                    test_case_record.id,
                    NULL,
                    'IMS_SIP',
                    'SIP',
                    '1.0',
                    '{
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
                        },
                        "testSpecific": {
                            "scenario": "default", "testType": "functional", "duration": 300, "iterations": 1,
                            "successCriteria": {}, "failureThresholds": {}, "performanceTargets": {}
                        },
                        "advanced": {
                            "debugMode": false, "traceLevel": "basic", "memoryLimit": 1024, "cpuLimit": 80,
                            "customParameters": {}
                        }
                    }',
                    true,
                    true,
                    true,
                    0,
                    0.0
                ) ON CONFLICT (name, user_id) DO NOTHING;
                
            WHEN 'O_RAN' THEN
                INSERT INTO public.test_configurations (
                    id, name, description, test_case_id, user_id, category, protocol, version,
                    configuration_data, is_template, is_public, is_default, usage_count, rating
                ) VALUES (
                    config_id,
                    'Default O-RAN Configuration',
                    'Default configuration for O-RAN test cases with standard parameters',
                    test_case_record.id,
                    NULL,
                    'O_RAN',
                    'E2',
                    '1.0',
                    '{
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
                            "frequency": {"dlFreq": 2100, "ulFreq": 1900, "bandwidth": 100},
                            "power": {"txPower": 23, "rxPower": -80, "rsrp": -85, "rsrq": -12, "sinr": 18}
                        },
                        "ue": {
                            "identity": {"imsi": "001010123456789", "imei": "123456789012345"},
                            "capabilities": {"maxBandwidth": 100, "maxMimoLayers": 4, "supportedModulations": ["QPSK", "16QAM", "64QAM", "256QAM"]},
                            "security": {"authentication": "5G-AKA", "encryption": "AES-128", "integrity": "AES-128"}
                        },
                        "layers": {
                            "E2": {
                                "interface_type": "E2", "service_model": "E2SM-KPM", "node_type": "gNB",
                                "performance_metrics": ["throughput", "latency", "error_rate"],
                                "reporting_period": 1000, "subscription_type": "periodic"
                            }
                        },
                        "testSpecific": {
                            "scenario": "default", "testType": "interoperability", "duration": 300, "iterations": 1,
                            "successCriteria": {}, "failureThresholds": {}, "performanceTargets": {}
                        },
                        "advanced": {
                            "debugMode": false, "traceLevel": "basic", "memoryLimit": 1024, "cpuLimit": 80,
                            "customParameters": {}
                        }
                    }',
                    true,
                    true,
                    true,
                    0,
                    0.0
                ) ON CONFLICT (name, user_id) DO NOTHING;
                
            WHEN 'NB_IoT' THEN
                INSERT INTO public.test_configurations (
                    id, name, description, test_case_id, user_id, category, protocol, version,
                    configuration_data, is_template, is_public, is_default, usage_count, rating
                ) VALUES (
                    config_id,
                    'Default NB-IoT Configuration',
                    'Default configuration for NB-IoT test cases with standard parameters',
                    test_case_record.id,
                    NULL,
                    'NB_IoT',
                    'NB-IoT',
                    '1.0',
                    '{
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
                            "frequency": {"dlFreq": 900, "ulFreq": 900, "bandwidth": 0.2},
                            "power": {"txPower": 20, "rxPower": -100, "rsrp": -120, "rsrq": -15, "sinr": 10}
                        },
                        "ue": {
                            "identity": {"imsi": "001010123456789", "imei": "123456789012345"},
                            "capabilities": {"maxBandwidth": 0.2, "maxMimoLayers": 1, "supportedModulations": ["QPSK"]},
                            "security": {"authentication": "AKA", "encryption": "AES-128", "integrity": "AES-128"}
                        },
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
                        },
                        "testSpecific": {
                            "scenario": "default", "testType": "functional", "duration": 300, "iterations": 1,
                            "successCriteria": {}, "failureThresholds": {}, "performanceTargets": {}
                        },
                        "advanced": {
                            "debugMode": false, "traceLevel": "basic", "memoryLimit": 512, "cpuLimit": 60,
                            "customParameters": {}
                        }
                    }',
                    true,
                    true,
                    true,
                    0,
                    0.0
                ) ON CONFLICT (name, user_id) DO NOTHING;
                
            WHEN 'V2X' THEN
                INSERT INTO public.test_configurations (
                    id, name, description, test_case_id, user_id, category, protocol, version,
                    configuration_data, is_template, is_public, is_default, usage_count, rating
                ) VALUES (
                    config_id,
                    'Default V2X Configuration',
                    'Default configuration for V2X test cases with standard parameters',
                    test_case_record.id,
                    NULL,
                    'V2X',
                    'PC5',
                    '1.0',
                    '{
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
                            "frequency": {"dlFreq": 5900, "ulFreq": 5900, "bandwidth": 10},
                            "power": {"txPower": 23, "rxPower": -80, "rsrp": -85, "rsrq": -12, "sinr": 18}
                        },
                        "ue": {
                            "identity": {"imsi": "001010123456789", "imei": "123456789012345"},
                            "capabilities": {"maxBandwidth": 10, "maxMimoLayers": 2, "supportedModulations": ["QPSK", "16QAM"]},
                            "security": {"authentication": "AKA", "encryption": "AES-128", "integrity": "AES-128"}
                        },
                        "layers": {
                            "PC5": {
                                "communication_type": "PC5", "safety_application": "emergency_brake",
                                "distance_m": 100, "message_type": "CAM", "transmission_power": 23,
                                "frequency": 5900, "bandwidth": 10
                            }
                        },
                        "testSpecific": {
                            "scenario": "default", "testType": "functional", "duration": 300, "iterations": 1,
                            "successCriteria": {}, "failureThresholds": {}, "performanceTargets": {}
                        },
                        "advanced": {
                            "debugMode": false, "traceLevel": "basic", "memoryLimit": 1024, "cpuLimit": 80,
                            "customParameters": {}
                        }
                    }',
                    true,
                    true,
                    true,
                    0,
                    0.0
                ) ON CONFLICT (name, user_id) DO NOTHING;
                
            WHEN 'NTN' THEN
                INSERT INTO public.test_configurations (
                    id, name, description, test_case_id, user_id, category, protocol, version,
                    configuration_data, is_template, is_public, is_default, usage_count, rating
                ) VALUES (
                    config_id,
                    'Default NTN Configuration',
                    'Default configuration for NTN test cases with standard parameters',
                    test_case_record.id,
                    NULL,
                    'NTN',
                    'NTN',
                    '1.0',
                    '{
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
                            "frequency": {"dlFreq": 2100, "ulFreq": 1900, "bandwidth": 100},
                            "power": {"txPower": 30, "rxPower": -90, "rsrp": -95, "rsrq": -15, "sinr": 15}
                        },
                        "ue": {
                            "identity": {"imsi": "001010123456789", "imei": "123456789012345"},
                            "capabilities": {"maxBandwidth": 100, "maxMimoLayers": 4, "supportedModulations": ["QPSK", "16QAM", "64QAM", "256QAM"]},
                            "security": {"authentication": "5G-AKA", "encryption": "AES-128", "integrity": "AES-128"}
                        },
                        "layers": {
                            "NTN": {
                                "satellite_type": "LEO", "constellation": "Starlink", "altitude_km": 550,
                                "coverage_area": "global", "handover_type": "satellite_handover",
                                "propagation_delay_ms": 25, "doppler_shift_hz": 1000
                            }
                        },
                        "testSpecific": {
                            "scenario": "default", "testType": "functional", "duration": 300, "iterations": 1,
                            "successCriteria": {}, "failureThresholds": {}, "performanceTargets": {}
                        },
                        "advanced": {
                            "debugMode": false, "traceLevel": "basic", "memoryLimit": 1024, "cpuLimit": 80,
                            "customParameters": {}
                        }
                    }',
                    true,
                    true,
                    true,
                    0,
                    0.0
                ) ON CONFLICT (name, user_id) DO NOTHING;
                
            WHEN 'CUSTOM' THEN
                INSERT INTO public.test_configurations (
                    id, name, description, test_case_id, user_id, category, protocol, version,
                    configuration_data, is_template, is_public, is_default, usage_count, rating
                ) VALUES (
                    config_id,
                    'Default Custom Configuration',
                    'Default configuration for custom protocol test cases',
                    test_case_record.id,
                    NULL,
                    'CUSTOM',
                    'Custom',
                    '1.0',
                    '{
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
                        "layers": {
                            "Custom": {
                                "protocol_name": "user_defined", "custom_parameters": {},
                                "validation_rules": {}, "performance_metrics": {}
                            }
                        },
                        "testSpecific": {
                            "scenario": "default", "testType": "functional", "duration": 300, "iterations": 1,
                            "successCriteria": {}, "failureThresholds": {}, "performanceTargets": {}
                        },
                        "advanced": {
                            "debugMode": false, "traceLevel": "basic", "memoryLimit": 1024, "cpuLimit": 80,
                            "customParameters": {}
                        }
                    }',
                    true,
                    true,
                    true,
                    0,
                    0.0
                ) ON CONFLICT (name, user_id) DO NOTHING;
        END CASE;
    END LOOP;
END $$;

-- Insert additional template configurations
INSERT INTO public.test_configurations (
    name, description, test_case_id, user_id, category, protocol, version,
    configuration_data, is_template, is_public, is_default, usage_count, rating
) VALUES 
-- High Performance 5G NR Configuration
(
    'High Performance 5G NR Configuration',
    'Optimized 5G NR configuration for maximum performance testing',
    NULL,
    NULL,
    '5G_NR',
    'NR',
    '1.0',
    '{
        "general": {
            "executionMode": "realtime",
            "timeAcceleration": 10,
            "logLevel": "verbose",
            "captureMode": "performance",
            "outputFormat": "json",
            "autoStart": true,
            "autoStop": true,
            "timeout": 600000
        },
        "network": {
            "plmn": {"mcc": "001", "mnc": "01"},
            "cell": {"cellId": 123456, "pci": 123, "tac": 1, "arfcn": 3732480},
            "frequency": {"dlFreq": 2100, "ulFreq": 1900, "bandwidth": 100, "subcarrierSpacing": 30},
            "power": {"txPower": 30, "rxPower": -70, "rsrp": -75, "rsrq": -8, "sinr": 25}
        },
        "ue": {
            "identity": {"imsi": "001010123456789", "imei": "123456789012345"},
            "capabilities": {"maxBandwidth": 100, "maxMimoLayers": 8, "supportedModulations": ["QPSK", "16QAM", "64QAM", "256QAM", "1024QAM"]},
            "security": {"authentication": "5G-AKA", "encryption": "AES-256", "integrity": "AES-256"}
        },
        "layers": {
            "PHY": {
                "dlArfcn": 3732480, "ulArfcn": 3732480, "bandwidth": 100, "subcarrierSpacing": 30,
                "pci": 123, "cellId": 123456, "rsrp": -75, "rsrq": -8, "sinr": 25, "cqi": 15, "mcs": 28,
                "bler": 0.001, "mimoLayers": 8, "modulation": "1024QAM", "codingRate": 0.9,
                "powerControl": {"enabled": true, "algorithm": "advanced_closed_loop", "target": -70},
                "beamforming": {"enabled": true, "algorithm": "hybrid", "beams": 8}
            }
        },
        "testSpecific": {
            "scenario": "high_performance", "testType": "performance", "duration": 600, "iterations": 10,
            "successCriteria": {"throughput_mbps": {"min": 2000}}, "failureThresholds": {"throughput_mbps": {"min": 1500}},
            "performanceTargets": {"throughput_mbps": {"target": 2000, "min": 1500}}
        },
        "advanced": {
            "debugMode": true, "traceLevel": "full", "memoryLimit": 2048, "cpuLimit": 90,
            "customParameters": {"optimization_level": "maximum", "parallel_processing": true}
        }
    }',
    true,
    true,
    false,
    0,
    0.0
),

-- Debug Configuration
(
    'Debug Configuration',
    'Configuration optimized for debugging and troubleshooting',
    NULL,
    NULL,
    '5G_NR',
    'NR',
    '1.0',
    '{
        "general": {
            "executionMode": "simulation",
            "timeAcceleration": 0.1,
            "logLevel": "verbose",
            "captureMode": "full",
            "outputFormat": "json",
            "autoStart": false,
            "autoStop": false,
            "timeout": 1800000
        },
        "network": {
            "plmn": {"mcc": "001", "mnc": "01"},
            "cell": {"cellId": 123456, "pci": 123, "tac": 1, "arfcn": 3732480},
            "frequency": {"dlFreq": 2100, "ulFreq": 1900, "bandwidth": 100, "subcarrierSpacing": 30},
            "power": {"txPower": 23, "rxPower": -80, "rsrp": -85, "rsrq": -12, "sinr": 18}
        },
        "ue": {
            "identity": {"imsi": "001010123456789", "imei": "123456789012345"},
            "capabilities": {"maxBandwidth": 100, "maxMimoLayers": 4, "supportedModulations": ["QPSK", "16QAM", "64QAM", "256QAM"]},
            "security": {"authentication": "5G-AKA", "encryption": "AES-128", "integrity": "AES-128"}
        },
        "testSpecific": {
            "scenario": "debug", "testType": "functional", "duration": 1800, "iterations": 1,
            "successCriteria": {}, "failureThresholds": {}, "performanceTargets": {}
        },
        "advanced": {
            "debugMode": true, "traceLevel": "full", "memoryLimit": 4096, "cpuLimit": 95,
            "customParameters": {"detailed_logging": true, "step_by_step": true, "breakpoints": true}
        }
    }',
    true,
    true,
    false,
    0,
    0.0
)
ON CONFLICT (name, user_id) DO NOTHING;

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
    
    RAISE NOTICE '✅ Total configurations created: %', config_count;
    RAISE NOTICE '✅ Template configurations created: %', template_count;
    RAISE NOTICE '✅ Default configurations created: %', default_count;
    
    IF config_count >= 10 AND template_count >= 10 AND default_count >= 8 THEN
        RAISE NOTICE '🎉 Default configurations seed data created successfully!';
    ELSE
        RAISE NOTICE '❌ Some configuration data may be missing';
    END IF;
END $$;