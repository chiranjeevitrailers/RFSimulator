-- Insert Remaining 6 End-to-End Test Cases
-- This file contains the data for the remaining E2E test cases

-- 3. MO Data End-to-End Test Case
INSERT INTO test_cases (
    id, name, description, protocol, category, test_type, complexity,
    execution_priority, tags, test_data, expected_results, duration_minutes,
    estimated_duration_minutes, automation_level, review_status, layer,
    standard_reference, is_active, is_premium, is_featured
) VALUES (
    'a5131c90-ae41-4f5c-a2cb-2d4148022fb2',
    'MO Data End-to-End: PDP Activation → Data Transfer',
    'Complete Mobile Originated data flow with PDP context activation and data transfer',
    'LTE',
    '4G_LTE',
    'conformance',
    'expert',
    5,
    ARRAY['MO', 'Data', 'PDP', 'E2E', 'Activation', 'Transfer'],
    '{
        "scenario": "mo_data_e2e",
        "test_category": "end_to_end",
        "validation_type": "automated",
        "compliance_level": "mandatory",
        "standard_reference": "3GPP TS 23.401",
        "flow_type": "MO_DATA",
        "services": ["Data"],
        "network_elements": ["UE", "eNodeB", "MME", "SGW", "PGW", "PCRF"],
        "test_steps": [
            {"step": 1, "layer": "PHY", "message": "PSS", "direction": "DL", "description": "Primary Synchronization Signal detection"},
            {"step": 2, "layer": "PHY", "message": "SSS", "direction": "DL", "description": "Secondary Synchronization Signal detection"},
            {"step": 3, "layer": "PHY", "message": "PBCH", "direction": "DL", "description": "Physical Broadcast Channel decoding"},
            {"step": 4, "layer": "MAC", "message": "PRACH", "direction": "UL", "description": "Physical Random Access Channel transmission"},
            {"step": 5, "layer": "MAC", "message": "RAR", "direction": "DL", "description": "Random Access Response reception"},
            {"step": 6, "layer": "RRC", "message": "RRCConnectionRequest", "direction": "UL", "description": "RRC connection establishment request"},
            {"step": 7, "layer": "RRC", "message": "RRCConnectionSetup", "direction": "DL", "description": "RRC connection setup configuration"},
            {"step": 8, "layer": "RRC", "message": "RRCConnectionSetupComplete", "direction": "UL", "description": "RRC connection setup completion"},
            {"step": 9, "layer": "NAS", "message": "PDNConnectivityRequest", "direction": "UL", "description": "PDP context activation request"},
            {"step": 10, "layer": "NAS", "message": "ActivateDefaultEPSBearerContextRequest", "direction": "DL", "description": "Default EPS bearer activation"}
        ],
        "information_elements": [
            {"name": "UE-Identity", "type": "MANDATORY", "value": "0x12345678", "size": 32, "mandatory": true},
            {"name": "Transaction-ID", "type": "MANDATORY", "value": 1, "size": 8, "mandatory": true},
            {"name": "Cell-ID", "type": "MANDATORY", "value": 12345, "size": 16, "mandatory": true},
            {"name": "RSRP", "type": "MEASUREMENT", "value": -85.5, "size": 8, "mandatory": false},
            {"name": "RSRQ", "type": "MEASUREMENT", "value": -10.2, "size": 8, "mandatory": false},
            {"name": "System-Bandwidth", "type": "CONFIG", "value": 20, "size": 4, "mandatory": true},
            {"name": "PHICH-Config", "type": "CONFIG", "value": 1, "size": 3, "mandatory": true},
            {"name": "Preamble-ID", "type": "MANDATORY", "value": 5, "size": 6, "mandatory": true},
            {"name": "RA-RNTI", "type": "MANDATORY", "value": "0x1234", "size": 16, "mandatory": true},
            {"name": "Timing-Advance", "type": "CONFIG", "value": 12, "size": 6, "mandatory": true}
        ],
        "layer_parameters": [
            {"layer": "PHY", "name": "RSRP", "type": "MEASUREMENT", "value": -85.5, "unit": "dBm"},
            {"layer": "PHY", "name": "RSRQ", "type": "MEASUREMENT", "value": -10.2, "unit": "dB"},
            {"layer": "PHY", "name": "System-Bandwidth", "type": "CONFIG", "value": 20, "unit": "MHz"},
            {"layer": "PHY", "name": "Cell-ID", "type": "CONFIG", "value": 12345, "unit": "integer"},
            {"layer": "MAC", "name": "Preamble-ID", "type": "CONFIG", "value": 5, "unit": "integer"},
            {"layer": "MAC", "name": "RA-RNTI", "type": "CONFIG", "value": "0x1234", "unit": "hex"},
            {"layer": "MAC", "name": "Timing-Advance", "type": "CONFIG", "value": 12, "unit": "TA units"},
            {"layer": "RRC", "name": "Transaction-ID", "type": "CONFIG", "value": 1, "unit": "integer"},
            {"layer": "RRC", "name": "UE-Identity", "type": "CONFIG", "value": "0x12345678", "unit": "hex"},
            {"layer": "NAS", "name": "IMSI", "type": "CONFIG", "value": "310150123456789", "unit": "string"}
        ]
    }',
    '{
        "success_criteria": "Successful PDP context activation and data transfer",
        "validation_points": [
            "PDP context activation",
            "Default bearer establishment",
            "Data transfer initiation",
            "QoS parameter validation"
        ],
        "performance_metrics": {
            "activation_time": "< 5 seconds",
            "success_rate": "> 99%",
            "throughput": "> 10 Mbps"
        }
    }',
    30, 30, 'manual', 'approved', 'Multi', '3GPP TS 23.401',
    true, false, false
);

-- 4. MT Data End-to-End Test Case
INSERT INTO test_cases (
    id, name, description, protocol, category, test_type, complexity,
    execution_priority, tags, test_data, expected_results, duration_minutes,
    estimated_duration_minutes, automation_level, review_status, layer,
    standard_reference, is_active, is_premium, is_featured
) VALUES (
    'd2aa6348-aa78-476a-aaa8-fbf7113d6b0b',
    'MT Data End-to-End: Paging → Data Delivery',
    'Complete Mobile Terminated data flow with paging and data delivery',
    'LTE',
    '4G_LTE',
    'conformance',
    'expert',
    5,
    ARRAY['MT', 'Data', 'Paging', 'E2E', 'Delivery'],
    '{
        "scenario": "mt_data_e2e",
        "test_category": "end_to_end",
        "validation_type": "automated",
        "compliance_level": "mandatory",
        "standard_reference": "3GPP TS 23.401",
        "flow_type": "MT_DATA",
        "services": ["Data"],
        "network_elements": ["UE", "eNodeB", "MME", "SGW", "PGW", "PCRF"],
        "test_steps": [
            {"step": 1, "layer": "PHY", "message": "PSS", "direction": "DL", "description": "Primary Synchronization Signal detection"},
            {"step": 2, "layer": "PHY", "message": "SSS", "direction": "DL", "description": "Secondary Synchronization Signal detection"},
            {"step": 3, "layer": "PHY", "message": "PBCH", "direction": "DL", "description": "Physical Broadcast Channel decoding"},
            {"step": 4, "layer": "MAC", "message": "Paging", "direction": "DL", "description": "Paging message reception"},
            {"step": 5, "layer": "MAC", "message": "PRACH", "direction": "UL", "description": "Physical Random Access Channel transmission"},
            {"step": 6, "layer": "MAC", "message": "RAR", "direction": "DL", "description": "Random Access Response reception"},
            {"step": 7, "layer": "RRC", "message": "RRCConnectionRequest", "direction": "UL", "description": "RRC connection establishment request"},
            {"step": 8, "layer": "RRC", "message": "RRCConnectionSetup", "direction": "DL", "description": "RRC connection setup configuration"},
            {"step": 9, "layer": "RRC", "message": "RRCConnectionSetupComplete", "direction": "UL", "description": "RRC connection setup completion"},
            {"step": 10, "layer": "NAS", "message": "ServiceRequest", "direction": "UL", "description": "Service request for data delivery"}
        ],
        "information_elements": [
            {"name": "UE-Identity", "type": "MANDATORY", "value": "0x12345678", "size": 32, "mandatory": true},
            {"name": "Transaction-ID", "type": "MANDATORY", "value": 1, "size": 8, "mandatory": true},
            {"name": "Cell-ID", "type": "MANDATORY", "value": 12345, "size": 16, "mandatory": true},
            {"name": "RSRP", "type": "MEASUREMENT", "value": -85.5, "size": 8, "mandatory": false},
            {"name": "RSRQ", "type": "MEASUREMENT", "value": -10.2, "size": 8, "mandatory": false},
            {"name": "System-Bandwidth", "type": "CONFIG", "value": 20, "size": 4, "mandatory": true},
            {"name": "PHICH-Config", "type": "CONFIG", "value": 1, "size": 3, "mandatory": true},
            {"name": "Preamble-ID", "type": "MANDATORY", "value": 5, "size": 6, "mandatory": true},
            {"name": "RA-RNTI", "type": "MANDATORY", "value": "0x1234", "size": 16, "mandatory": true},
            {"name": "Timing-Advance", "type": "CONFIG", "value": 12, "size": 6, "mandatory": true}
        ],
        "layer_parameters": [
            {"layer": "PHY", "name": "RSRP", "type": "MEASUREMENT", "value": -85.5, "unit": "dBm"},
            {"layer": "PHY", "name": "RSRQ", "type": "MEASUREMENT", "value": -10.2, "unit": "dB"},
            {"layer": "PHY", "name": "System-Bandwidth", "type": "CONFIG", "value": 20, "unit": "MHz"},
            {"layer": "PHY", "name": "Cell-ID", "type": "CONFIG", "value": 12345, "unit": "integer"},
            {"layer": "MAC", "name": "Preamble-ID", "type": "CONFIG", "value": 5, "unit": "integer"},
            {"layer": "MAC", "name": "RA-RNTI", "type": "CONFIG", "value": "0x1234", "unit": "hex"},
            {"layer": "MAC", "name": "Timing-Advance", "type": "CONFIG", "value": 12, "unit": "TA units"},
            {"layer": "RRC", "name": "Transaction-ID", "type": "CONFIG", "value": 1, "unit": "integer"},
            {"layer": "RRC", "name": "UE-Identity", "type": "CONFIG", "value": "0x12345678", "unit": "hex"},
            {"layer": "NAS", "name": "IMSI", "type": "CONFIG", "value": "310150123456789", "unit": "string"}
        ]
    }',
    '{
        "success_criteria": "Successful paging and data delivery to MT UE",
        "validation_points": [
            "Paging message reception",
            "Service request processing",
            "Data delivery completion",
            "Connection maintenance"
        ],
        "performance_metrics": {
            "paging_time": "< 2 seconds",
            "success_rate": "> 99%",
            "delivery_time": "< 5 seconds"
        }
    }',
    30, 30, 'manual', 'approved', 'Multi', '3GPP TS 23.401',
    true, false, false
);

-- 5. MT CSFB End-to-End Test Case
INSERT INTO test_cases (
    id, name, description, protocol, category, test_type, complexity,
    execution_priority, tags, test_data, expected_results, duration_minutes,
    estimated_duration_minutes, automation_level, review_status, layer,
    standard_reference, is_active, is_premium, is_featured
) VALUES (
    '5eabd3f3-8c8a-4a0c-b3a6-b5dccc704966',
    'MT CSFB End-to-End: Voice Call → Fallback → Connection',
    'Complete Mobile Terminated Circuit Switched Fallback flow for voice calls',
    'LTE',
    '4G_LTE',
    'conformance',
    'expert',
    5,
    ARRAY['MT', 'CSFB', 'Voice', 'E2E', 'Fallback', 'Connection'],
    '{
        "scenario": "mt_csfb_e2e",
        "test_category": "end_to_end",
        "validation_type": "automated",
        "compliance_level": "mandatory",
        "standard_reference": "3GPP TS 23.272",
        "flow_type": "MT_CSFB",
        "services": ["Voice"],
        "network_elements": ["UE", "eNodeB", "MME", "MSC", "HSS"],
        "test_steps": [
            {"step": 1, "layer": "PHY", "message": "PSS", "direction": "DL", "description": "Primary Synchronization Signal detection"},
            {"step": 2, "layer": "PHY", "message": "SSS", "direction": "DL", "description": "Secondary Synchronization Signal detection"},
            {"step": 3, "layer": "PHY", "message": "PBCH", "direction": "DL", "description": "Physical Broadcast Channel decoding"},
            {"step": 4, "layer": "MAC", "message": "Paging", "direction": "DL", "description": "Paging message for voice call"},
            {"step": 5, "layer": "MAC", "message": "PRACH", "direction": "UL", "description": "Physical Random Access Channel transmission"},
            {"step": 6, "layer": "MAC", "message": "RAR", "direction": "DL", "description": "Random Access Response reception"},
            {"step": 7, "layer": "RRC", "message": "RRCConnectionRequest", "direction": "UL", "description": "RRC connection establishment request"},
            {"step": 8, "layer": "RRC", "message": "RRCConnectionSetup", "direction": "DL", "description": "RRC connection setup configuration"},
            {"step": 9, "layer": "RRC", "message": "RRCConnectionSetupComplete", "direction": "UL", "description": "RRC connection setup completion"},
            {"step": 10, "layer": "NAS", "message": "ServiceRequest", "direction": "UL", "description": "Service request for CSFB"}
        ],
        "information_elements": [
            {"name": "UE-Identity", "type": "MANDATORY", "value": "0x12345678", "size": 32, "mandatory": true},
            {"name": "Transaction-ID", "type": "MANDATORY", "value": 1, "size": 8, "mandatory": true},
            {"name": "Cell-ID", "type": "MANDATORY", "value": 12345, "size": 16, "mandatory": true},
            {"name": "RSRP", "type": "MEASUREMENT", "value": -85.5, "size": 8, "mandatory": false},
            {"name": "RSRQ", "type": "MEASUREMENT", "value": -10.2, "size": 8, "mandatory": false},
            {"name": "System-Bandwidth", "type": "CONFIG", "value": 20, "size": 4, "mandatory": true},
            {"name": "PHICH-Config", "type": "CONFIG", "value": 1, "size": 3, "mandatory": true},
            {"name": "Preamble-ID", "type": "MANDATORY", "value": 5, "size": 6, "mandatory": true},
            {"name": "RA-RNTI", "type": "MANDATORY", "value": "0x1234", "size": 16, "mandatory": true},
            {"name": "Timing-Advance", "type": "CONFIG", "value": 12, "size": 6, "mandatory": true}
        ],
        "layer_parameters": [
            {"layer": "PHY", "name": "RSRP", "type": "MEASUREMENT", "value": -85.5, "unit": "dBm"},
            {"layer": "PHY", "name": "RSRQ", "type": "MEASUREMENT", "value": -10.2, "unit": "dB"},
            {"layer": "PHY", "name": "System-Bandwidth", "type": "CONFIG", "value": 20, "unit": "MHz"},
            {"layer": "PHY", "name": "Cell-ID", "type": "CONFIG", "value": 12345, "unit": "integer"},
            {"layer": "MAC", "name": "Preamble-ID", "type": "CONFIG", "value": 5, "unit": "integer"},
            {"layer": "MAC", "name": "RA-RNTI", "type": "CONFIG", "value": "0x1234", "unit": "hex"},
            {"layer": "MAC", "name": "Timing-Advance", "type": "CONFIG", "value": 12, "unit": "TA units"},
            {"layer": "RRC", "name": "Transaction-ID", "type": "CONFIG", "value": 1, "unit": "integer"},
            {"layer": "RRC", "name": "UE-Identity", "type": "CONFIG", "value": "0x12345678", "unit": "hex"},
            {"layer": "NAS", "name": "IMSI", "type": "CONFIG", "value": "310150123456789", "unit": "string"}
        ]
    }',
    '{
        "success_criteria": "Successful CSFB for MT voice call",
        "validation_points": [
            "Paging for voice call",
            "CSFB initiation",
            "3G/2G fallback",
            "Voice call establishment"
        ],
        "performance_metrics": {
            "fallback_time": "< 3 seconds",
            "success_rate": "> 99%",
            "call_setup_time": "< 5 seconds"
        }
    }',
    30, 30, 'manual', 'approved', 'Multi', '3GPP TS 23.272',
    true, false, false
);

-- Continue with remaining 3 test cases in next file...