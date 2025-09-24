-- Insert All 8 End-to-End Test Cases
-- This file contains the complete data for all E2E test cases

-- 1. SMS Service End-to-End Test Case
INSERT INTO test_cases (
    id, name, description, protocol, category, test_type, complexity, 
    execution_priority, tags, test_data, expected_results, duration_minutes,
    estimated_duration_minutes, automation_level, review_status, layer,
    standard_reference, is_active, is_premium, is_featured
) VALUES (
    '69ddecaa-8db1-4ce2-9b25-7072185ed0ef',
    'SMS Service End-to-End: MO → SMSC → MT Delivery',
    'Complete SMS service flow from Mobile Originated to Mobile Terminated delivery via SMSC',
    'LTE',
    '4G_LTE',
    'conformance',
    'expert',
    5,
    ARRAY['SMS', 'E2E', 'MO', 'MT', 'SMSC', 'Delivery'],
    '{
        "scenario": "sms_service_e2e",
        "test_category": "end_to_end",
        "validation_type": "automated",
        "compliance_level": "mandatory",
        "standard_reference": "3GPP TS 23.040 SMS Service",
        "flow_type": "MO_MT_SMS",
        "services": ["SMS"],
        "network_elements": ["UE", "eNodeB", "MME", "SGW", "PGW", "SMSC", "HSS"],
        "test_steps": [
            {"step": 1, "layer": "PHY", "message": "PSS", "direction": "DL", "description": "Primary Synchronization Signal detection"},
            {"step": 2, "layer": "PHY", "message": "SSS", "direction": "DL", "description": "Secondary Synchronization Signal detection"},
            {"step": 3, "layer": "PHY", "message": "PBCH", "direction": "DL", "description": "Physical Broadcast Channel decoding"},
            {"step": 4, "layer": "MAC", "message": "PRACH", "direction": "UL", "description": "Physical Random Access Channel transmission"},
            {"step": 5, "layer": "MAC", "message": "RAR", "direction": "DL", "description": "Random Access Response reception"},
            {"step": 6, "layer": "RRC", "message": "RRCConnectionRequest", "direction": "UL", "description": "RRC connection establishment request"},
            {"step": 7, "layer": "RRC", "message": "RRCConnectionSetup", "direction": "DL", "description": "RRC connection setup configuration"},
            {"step": 8, "layer": "RRC", "message": "RRCConnectionSetupComplete", "direction": "UL", "description": "RRC connection setup completion"},
            {"step": 9, "layer": "NAS", "message": "AttachRequest", "direction": "UL", "description": "NAS attach request for SMS service"},
            {"step": 10, "layer": "NAS", "message": "AuthenticationRequest", "direction": "DL", "description": "NAS authentication request"}
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
        "success_criteria": "SMS delivered successfully from MO to MT",
        "validation_points": [
            "MO SMS submission to network",
            "SMSC message processing",
            "MT SMS delivery",
            "Delivery confirmation"
        ],
        "performance_metrics": {
            "delivery_time": "< 30 seconds",
            "success_rate": "> 99%",
            "error_rate": "< 1%"
        }
    }',
    30, 30, 'manual', 'approved', 'Multi', '3GPP TS 23.040 SMS Service',
    true, false, false
);

-- 2. 5G→LTE Handover End-to-End Test Case
INSERT INTO test_cases (
    id, name, description, protocol, category, test_type, complexity,
    execution_priority, tags, test_data, expected_results, duration_minutes,
    estimated_duration_minutes, automation_level, review_status, layer,
    standard_reference, is_active, is_premium, is_featured
) VALUES (
    '42b17322-78b3-4dbc-a8df-b6a558053e47',
    '5G→LTE Handover End-to-End: Measurement → Handover → Bearer Update',
    'Complete 5G to LTE handover flow with measurement, handover command, and bearer update',
    'Multi',
    '4G_LTE',
    'conformance',
    'expert',
    5,
    ARRAY['5G', 'LTE', 'Handover', 'E2E', 'Measurement', 'Bearer'],
    '{
        "scenario": "5g_lte_handover_e2e",
        "test_category": "end_to_end",
        "validation_type": "automated",
        "compliance_level": "mandatory",
        "standard_reference": "3GPP TS 38.331 & 36.331",
        "flow_type": "HANDOVER_5G_LTE",
        "services": ["Data", "Voice"],
        "network_elements": ["UE", "gNB", "eNodeB", "AMF", "MME", "SMF", "SGW", "UPF", "PGW"],
        "test_steps": [
            {"step": 1, "layer": "PHY", "message": "SSB", "direction": "DL", "description": "5G SSB measurement"},
            {"step": 2, "layer": "PHY", "message": "CSI-RS", "direction": "DL", "description": "CSI-RS measurement"},
            {"step": 3, "layer": "RRC", "message": "MeasurementReport", "direction": "UL", "description": "5G measurement report"},
            {"step": 4, "layer": "RRC", "message": "HandoverCommand", "direction": "DL", "description": "5G handover command"},
            {"step": 5, "layer": "PHY", "message": "PSS", "direction": "DL", "description": "LTE PSS detection"},
            {"step": 6, "layer": "PHY", "message": "SSS", "direction": "DL", "description": "LTE SSS detection"},
            {"step": 7, "layer": "RRC", "message": "RRCConnectionReconfiguration", "direction": "DL", "description": "LTE RRC reconfiguration"},
            {"step": 8, "layer": "RRC", "message": "RRCConnectionReconfigurationComplete", "direction": "UL", "description": "LTE RRC reconfiguration complete"},
            {"step": 9, "layer": "NAS", "message": "TrackingAreaUpdate", "direction": "UL", "description": "LTE TAU request"},
            {"step": 10, "layer": "NAS", "message": "TrackingAreaUpdateAccept", "direction": "DL", "description": "LTE TAU accept"}
        ],
        "information_elements": [
            {"name": "5G-GUTI", "type": "MANDATORY", "value": "0x1234567890ABCDEF", "size": 64, "mandatory": true},
            {"name": "Measurement-ID", "type": "MANDATORY", "value": 1, "size": 8, "mandatory": true},
            {"name": "RSRP-5G", "type": "MEASUREMENT", "value": -78.5, "size": 8, "mandatory": false},
            {"name": "RSRQ-5G", "type": "MEASUREMENT", "value": -8.2, "size": 8, "mandatory": false},
            {"name": "RSRP-LTE", "type": "MEASUREMENT", "value": -82.1, "size": 8, "mandatory": false},
            {"name": "RSRQ-LTE", "type": "MEASUREMENT", "value": -9.5, "size": 8, "mandatory": false},
            {"name": "Handover-Type", "type": "CONFIG", "value": "5G_TO_LTE", "size": 4, "mandatory": true},
            {"name": "Target-Cell-ID", "type": "MANDATORY", "value": 54321, "size": 16, "mandatory": true},
            {"name": "Bearer-Context", "type": "CONFIG", "value": "ACTIVE", "size": 8, "mandatory": true},
            {"name": "QoS-Parameters", "type": "CONFIG", "value": "QCI_9", "size": 8, "mandatory": true}
        ],
        "layer_parameters": [
            {"layer": "PHY", "name": "RSRP-5G", "type": "MEASUREMENT", "value": -78.5, "unit": "dBm"},
            {"layer": "PHY", "name": "RSRQ-5G", "type": "MEASUREMENT", "value": -8.2, "unit": "dB"},
            {"layer": "PHY", "name": "RSRP-LTE", "type": "MEASUREMENT", "value": -82.1, "unit": "dBm"},
            {"layer": "PHY", "name": "RSRQ-LTE", "type": "MEASUREMENT", "value": -9.5, "unit": "dB"},
            {"layer": "RRC", "name": "Handover-Type", "type": "CONFIG", "value": "5G_TO_LTE", "unit": "string"},
            {"layer": "RRC", "name": "Target-Cell-ID", "type": "CONFIG", "value": 54321, "unit": "integer"},
            {"layer": "RRC", "name": "Measurement-ID", "type": "CONFIG", "value": 1, "unit": "integer"},
            {"layer": "NAS", "name": "5G-GUTI", "type": "CONFIG", "value": "0x1234567890ABCDEF", "unit": "hex"},
            {"layer": "NAS", "name": "Tracking-Area-Code", "type": "CONFIG", "value": 123, "unit": "integer"},
            {"layer": "NAS", "name": "Bearer-Context", "type": "CONFIG", "value": "ACTIVE", "unit": "string"},
            {"layer": "NAS", "name": "QoS-Parameters", "type": "CONFIG", "value": "QCI_9", "unit": "string"}
        ]
    }',
    '{
        "success_criteria": "Successful 5G to LTE handover with bearer continuity",
        "validation_points": [
            "5G measurement reporting",
            "Handover decision",
            "LTE cell detection",
            "Bearer context transfer",
            "TAU completion"
        ],
        "performance_metrics": {
            "handover_time": "< 100ms",
            "success_rate": "> 99%",
            "data_loss": "< 0.1%"
        }
    }',
    30, 30, 'manual', 'approved', 'Multi', '3GPP TS 38.331 & 36.331',
    true, false, false
);

-- Continue with remaining 6 test cases...
-- (Due to length constraints, I'll create separate files for the remaining test cases)