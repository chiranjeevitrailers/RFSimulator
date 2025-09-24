-- Insert Final 3 End-to-End Test Cases
-- This file contains the data for the final E2E test cases

-- 6. MO CSFB End-to-End Test Case
INSERT INTO test_cases (
    id, name, description, protocol, category, test_type, complexity,
    execution_priority, tags, test_data, expected_results, duration_minutes,
    estimated_duration_minutes, automation_level, review_status, layer,
    standard_reference, is_active, is_premium, is_featured
) VALUES (
    'ed22fcf5-2a2b-47a2-9f3c-ef858acc7695',
    'MO CSFB End-to-End: Voice Attempt → Fallback → Connection',
    'Complete Mobile Originated Circuit Switched Fallback flow for voice calls',
    'LTE',
    '4G_LTE',
    'conformance',
    'expert',
    5,
    ARRAY['MO', 'CSFB', 'Voice', 'E2E', 'Fallback', 'Connection'],
    '{
        "scenario": "mo_csfb_e2e",
        "test_category": "end_to_end",
        "validation_type": "automated",
        "compliance_level": "mandatory",
        "standard_reference": "3GPP TS 23.272",
        "flow_type": "MO_CSFB",
        "services": ["Voice"],
        "network_elements": ["UE", "eNodeB", "MME", "MSC", "HSS"],
        "test_steps": [
            {"step": 1, "layer": "PHY", "message": "PSS", "direction": "DL", "description": "Primary Synchronization Signal detection"},
            {"step": 2, "layer": "PHY", "message": "SSS", "direction": "DL", "description": "Secondary Synchronization Signal detection"},
            {"step": 3, "layer": "PHY", "message": "PBCH", "direction": "DL", "description": "Physical Broadcast Channel decoding"},
            {"step": 4, "layer": "MAC", "message": "PRACH", "direction": "UL", "description": "Physical Random Access Channel transmission"},
            {"step": 5, "layer": "MAC", "message": "RAR", "direction": "DL", "description": "Random Access Response reception"},
            {"step": 6, "layer": "RRC", "message": "RRCConnectionRequest", "direction": "UL", "description": "RRC connection establishment request"},
            {"step": 7, "layer": "RRC", "message": "RRCConnectionSetup", "direction": "DL", "description": "RRC connection setup configuration"},
            {"step": 8, "layer": "RRC", "message": "RRCConnectionSetupComplete", "direction": "UL", "description": "RRC connection setup completion"},
            {"step": 9, "layer": "NAS", "message": "ServiceRequest", "direction": "UL", "description": "Service request for voice call"},
            {"step": 10, "layer": "NAS", "message": "CSFBRequest", "direction": "UL", "description": "CSFB request for voice call"}
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
        "success_criteria": "Successful CSFB for MO voice call",
        "validation_points": [
            "Voice call initiation",
            "CSFB request processing",
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

-- 7. LTE→5G Handover End-to-End Test Case
INSERT INTO test_cases (
    id, name, description, protocol, category, test_type, complexity,
    execution_priority, tags, test_data, expected_results, duration_minutes,
    estimated_duration_minutes, automation_level, review_status, layer,
    standard_reference, is_active, is_premium, is_featured
) VALUES (
    '3df4003d-9e18-4a69-bdc3-4f1dc6c33afc',
    'LTE→5G Handover End-to-End: Measurement → Handover → QoS Update',
    'Complete LTE to 5G handover flow with measurement, handover command, and QoS update',
    'Multi',
    '4G_LTE',
    'conformance',
    'expert',
    5,
    ARRAY['LTE', '5G', 'Handover', 'E2E', 'Measurement', 'QoS'],
    '{
        "scenario": "lte_5g_handover_e2e",
        "test_category": "end_to_end",
        "validation_type": "automated",
        "compliance_level": "mandatory",
        "standard_reference": "3GPP TS 36.331 & 38.331",
        "flow_type": "HANDOVER_LTE_5G",
        "services": ["Data", "Voice"],
        "network_elements": ["UE", "eNodeB", "gNB", "MME", "AMF", "SGW", "SMF", "PGW", "UPF"],
        "test_steps": [
            {"step": 1, "layer": "PHY", "message": "PSS", "direction": "DL", "description": "LTE PSS measurement"},
            {"step": 2, "layer": "PHY", "message": "SSS", "direction": "DL", "description": "LTE SSS measurement"},
            {"step": 3, "layer": "RRC", "message": "MeasurementReport", "direction": "UL", "description": "LTE measurement report"},
            {"step": 4, "layer": "RRC", "message": "HandoverCommand", "direction": "DL", "description": "LTE handover command"},
            {"step": 5, "layer": "PHY", "message": "SSB", "direction": "DL", "description": "5G SSB detection"},
            {"step": 6, "layer": "PHY", "message": "CSI-RS", "direction": "DL", "description": "5G CSI-RS detection"},
            {"step": 7, "layer": "RRC", "message": "RRCReconfiguration", "direction": "DL", "description": "5G RRC reconfiguration"},
            {"step": 8, "layer": "RRC", "message": "RRCReconfigurationComplete", "direction": "UL", "description": "5G RRC reconfiguration complete"},
            {"step": 9, "layer": "NAS", "message": "RegistrationRequest", "direction": "UL", "description": "5G registration request"},
            {"step": 10, "layer": "NAS", "message": "RegistrationAccept", "direction": "DL", "description": "5G registration accept"}
        ],
        "information_elements": [
            {"name": "LTE-GUTI", "type": "MANDATORY", "value": "0x1234567890ABCDEF", "size": 64, "mandatory": true},
            {"name": "Measurement-ID", "type": "MANDATORY", "value": 1, "size": 8, "mandatory": true},
            {"name": "RSRP-LTE", "type": "MEASUREMENT", "value": -82.1, "size": 8, "mandatory": false},
            {"name": "RSRQ-LTE", "type": "MEASUREMENT", "value": -9.5, "size": 8, "mandatory": false},
            {"name": "RSRP-5G", "type": "MEASUREMENT", "value": -78.5, "size": 8, "mandatory": false},
            {"name": "RSRQ-5G", "type": "MEASUREMENT", "value": -8.2, "size": 8, "mandatory": false},
            {"name": "Handover-Type", "type": "CONFIG", "value": "LTE_TO_5G", "size": 4, "mandatory": true},
            {"name": "Target-Cell-ID", "type": "MANDATORY", "value": 54321, "size": 16, "mandatory": true},
            {"name": "Bearer-Context", "type": "CONFIG", "value": "ACTIVE", "size": 8, "mandatory": true},
            {"name": "QoS-Parameters", "type": "CONFIG", "value": "5QI_9", "size": 8, "mandatory": true}
        ],
        "layer_parameters": [
            {"layer": "PHY", "name": "RSRP-LTE", "type": "MEASUREMENT", "value": -82.1, "unit": "dBm"},
            {"layer": "PHY", "name": "RSRQ-LTE", "type": "MEASUREMENT", "value": -9.5, "unit": "dB"},
            {"layer": "PHY", "name": "RSRP-5G", "type": "MEASUREMENT", "value": -78.5, "unit": "dBm"},
            {"layer": "PHY", "name": "RSRQ-5G", "type": "MEASUREMENT", "value": -8.2, "unit": "dB"},
            {"layer": "RRC", "name": "Handover-Type", "type": "CONFIG", "value": "LTE_TO_5G", "unit": "string"},
            {"layer": "RRC", "name": "Target-Cell-ID", "type": "CONFIG", "value": 54321, "unit": "integer"},
            {"layer": "RRC", "name": "Measurement-ID", "type": "CONFIG", "value": 1, "unit": "integer"},
            {"layer": "NAS", "name": "LTE-GUTI", "type": "CONFIG", "value": "0x1234567890ABCDEF", "unit": "hex"},
            {"layer": "NAS", "name": "Tracking-Area-Code", "type": "CONFIG", "value": 123, "unit": "integer"},
            {"layer": "NAS", "name": "Bearer-Context", "type": "CONFIG", "value": "ACTIVE", "unit": "string"},
            {"layer": "NAS", "name": "QoS-Parameters", "type": "CONFIG", "value": "5QI_9", "unit": "string"}
        ]
    }',
    '{
        "success_criteria": "Successful LTE to 5G handover with QoS continuity",
        "validation_points": [
            "LTE measurement reporting",
            "Handover decision",
            "5G cell detection",
            "Bearer context transfer",
            "Registration completion"
        ],
        "performance_metrics": {
            "handover_time": "< 100ms",
            "success_rate": "> 99%",
            "data_loss": "< 0.1%"
        }
    }',
    30, 30, 'manual', 'approved', 'Multi', '3GPP TS 36.331 & 38.331',
    true, false, false
);

-- 8. 3G→LTE Handover End-to-End Test Case
INSERT INTO test_cases (
    id, name, description, protocol, category, test_type, complexity,
    execution_priority, tags, test_data, expected_results, duration_minutes,
    estimated_duration_minutes, automation_level, review_status, layer,
    standard_reference, is_active, is_premium, is_featured
) VALUES (
    '06816abe-0c38-403e-84f0-49b73fd81cbf',
    '3G→LTE Handover End-to-End: Measurement → Relocation → Bearer Update',
    'Complete 3G to LTE handover flow with measurement, relocation, and bearer update',
    'Multi',
    '4G_LTE',
    'conformance',
    'expert',
    5,
    ARRAY['3G', 'LTE', 'Handover', 'E2E', 'Relocation', 'Bearer'],
    '{
        "scenario": "3g_lte_handover_e2e",
        "test_category": "end_to_end",
        "validation_type": "automated",
        "compliance_level": "mandatory",
        "standard_reference": "3GPP TS 25.331 & 36.331",
        "flow_type": "HANDOVER_3G_LTE",
        "services": ["Data", "Voice"],
        "network_elements": ["UE", "NodeB", "eNodeB", "RNC", "MME", "SGSN", "SGW", "GGSN", "PGW"],
        "test_steps": [
            {"step": 1, "layer": "PHY", "message": "CPICH", "direction": "DL", "description": "3G CPICH measurement"},
            {"step": 2, "layer": "PHY", "message": "P-CCPCH", "direction": "DL", "description": "3G P-CCPCH measurement"},
            {"step": 3, "layer": "RRC", "message": "MeasurementReport", "direction": "UL", "description": "3G measurement report"},
            {"step": 4, "layer": "RRC", "message": "HandoverCommand", "direction": "DL", "description": "3G handover command"},
            {"step": 5, "layer": "PHY", "message": "PSS", "direction": "DL", "description": "LTE PSS detection"},
            {"step": 6, "layer": "PHY", "message": "SSS", "direction": "DL", "description": "LTE SSS detection"},
            {"step": 7, "layer": "RRC", "message": "RRCConnectionReconfiguration", "direction": "DL", "description": "LTE RRC reconfiguration"},
            {"step": 8, "layer": "RRC", "message": "RRCConnectionReconfigurationComplete", "direction": "UL", "description": "LTE RRC reconfiguration complete"},
            {"step": 9, "layer": "NAS", "message": "TrackingAreaUpdate", "direction": "UL", "description": "LTE TAU request"},
            {"step": 10, "layer": "NAS", "message": "TrackingAreaUpdateAccept", "direction": "DL", "description": "LTE TAU accept"}
        ],
        "information_elements": [
            {"name": "3G-GUTI", "type": "MANDATORY", "value": "0x1234567890ABCDEF", "size": 64, "mandatory": true},
            {"name": "Measurement-ID", "type": "MANDATORY", "value": 1, "size": 8, "mandatory": true},
            {"name": "CPICH-RSCP", "type": "MEASUREMENT", "value": -85.2, "size": 8, "mandatory": false},
            {"name": "CPICH-EcNo", "type": "MEASUREMENT", "value": -12.5, "size": 8, "mandatory": false},
            {"name": "RSRP-LTE", "type": "MEASUREMENT", "value": -82.1, "size": 8, "mandatory": false},
            {"name": "RSRQ-LTE", "type": "MEASUREMENT", "value": -9.5, "size": 8, "mandatory": false},
            {"name": "Handover-Type", "type": "CONFIG", "value": "3G_TO_LTE", "size": 4, "mandatory": true},
            {"name": "Target-Cell-ID", "type": "MANDATORY", "value": 54321, "size": 16, "mandatory": true},
            {"name": "Bearer-Context", "type": "CONFIG", "value": "ACTIVE", "size": 8, "mandatory": true},
            {"name": "QoS-Parameters", "type": "CONFIG", "value": "QCI_9", "size": 8, "mandatory": true}
        ],
        "layer_parameters": [
            {"layer": "PHY", "name": "CPICH-RSCP", "type": "MEASUREMENT", "value": -85.2, "unit": "dBm"},
            {"layer": "PHY", "name": "CPICH-EcNo", "type": "MEASUREMENT", "value": -12.5, "unit": "dB"},
            {"layer": "PHY", "name": "RSRP-LTE", "type": "MEASUREMENT", "value": -82.1, "unit": "dBm"},
            {"layer": "PHY", "name": "RSRQ-LTE", "type": "MEASUREMENT", "value": -9.5, "unit": "dB"},
            {"layer": "RRC", "name": "Handover-Type", "type": "CONFIG", "value": "3G_TO_LTE", "unit": "string"},
            {"layer": "RRC", "name": "Target-Cell-ID", "type": "CONFIG", "value": 54321, "unit": "integer"},
            {"layer": "RRC", "name": "Measurement-ID", "type": "CONFIG", "value": 1, "unit": "integer"},
            {"layer": "NAS", "name": "3G-GUTI", "type": "CONFIG", "value": "0x1234567890ABCDEF", "unit": "hex"},
            {"layer": "NAS", "name": "Tracking-Area-Code", "type": "CONFIG", "value": 123, "unit": "integer"},
            {"layer": "NAS", "name": "Bearer-Context", "type": "CONFIG", "value": "ACTIVE", "unit": "string"},
            {"layer": "NAS", "name": "QoS-Parameters", "type": "CONFIG", "value": "QCI_9", "unit": "string"}
        ]
    }',
    '{
        "success_criteria": "Successful 3G to LTE handover with bearer continuity",
        "validation_points": [
            "3G measurement reporting",
            "Handover decision",
            "LTE cell detection",
            "Bearer context transfer",
            "TAU completion"
        ],
        "performance_metrics": {
            "handover_time": "< 200ms",
            "success_rate": "> 99%",
            "data_loss": "< 0.1%"
        }
    }',
    30, 30, 'manual', 'approved', 'Multi', '3GPP TS 25.331 & 36.331',
    true, false, false
);