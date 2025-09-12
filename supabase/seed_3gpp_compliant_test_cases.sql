-- 3GPP Compliant Test Cases with Proper Information Elements and Unique Data
-- This file contains test cases that strictly follow 3GPP standards with correct IEs

-- Create enhanced test cases table with 3GPP compliance fields
CREATE TABLE IF NOT EXISTS public.enhanced_test_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  protocol_version VARCHAR(20) NOT NULL,
  test_case_id VARCHAR(50) UNIQUE NOT NULL,
  complexity VARCHAR(20) CHECK (complexity IN ('low', 'medium', 'high', 'expert')),
  
  -- 3GPP Message Flow with proper IEs
  message_flow JSONB NOT NULL,
  
  -- Layer configurations with unique data
  layers JSONB NOT NULL,
  
  -- 3GPP Compliance information
  compliance JSONB NOT NULL,
  
  -- Expected results with 3GPP validation
  expected_results JSONB NOT NULL,
  
  -- Performance metrics per 3GPP requirements
  performance_metrics JSONB NOT NULL,
  
  -- Unique data for each test case
  unique_data JSONB NOT NULL,
  
  -- Execution tracking
  execution_history JSONB DEFAULT '[]',
  performance_baseline JSONB DEFAULT '{}',
  validation_results JSONB DEFAULT '{}',
  layer_statistics JSONB DEFAULT '[]',
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  priority VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5G NR Test Cases with 3GPP Compliance
INSERT INTO public.enhanced_test_cases (
  name, category, description, protocol_version, test_case_id, complexity,
  message_flow, layers, compliance, expected_results, performance_metrics, unique_data
) VALUES

-- 5G NR Initial Access - RRC Setup Request (3GPP TS 38.331)
('5G NR Initial Access - RRC Setup Request', '5G_NR', 
 'UE performs initial access and sends RRC Setup Request with proper 3GPP IEs', '5G NR', 
 '3GPP_5G_NR_0001', 'medium',
 
 -- Message Flow with 3GPP IEs
 '[
   {
     "step_id": "step_1",
     "timestamp": 0,
     "direction": "UL",
     "layer": "PHY",
     "message_type": "PRACH_Preamble",
     "message_name": "PRACH Preamble Transmission",
     "information_elements": {
       "preamble_id": {
         "ie_name": "preamble_id",
         "value": 23,
         "validation": {"valid": true, "errors": [], "warnings": []},
         "reference": "TS 38.211 6.3.3.1"
       },
       "prach_root_sequence_index": {
         "ie_name": "prach_root_sequence_index",
         "value": 839,
         "validation": {"valid": true, "errors": [], "warnings": []},
         "reference": "TS 38.211 6.3.3.1"
       },
       "prach_zero_correlation_zone": {
         "ie_name": "prach_zero_correlation_zone",
         "value": 15,
         "validation": {"valid": true, "errors": [], "warnings": []},
         "reference": "TS 38.211 6.3.3.1"
       }
     },
     "layer_parameters": {
       "power": 23,
       "subcarrier_spacing": 15,
       "prach_config_index": 0
     },
     "reference": "TS 38.211 6.3.3.1"
   },
   {
     "step_id": "step_2",
     "timestamp": 5,
     "direction": "DL",
     "layer": "PHY",
     "message_type": "RAR",
     "message_name": "Random Access Response",
     "information_elements": {
       "ra_rnti": {
         "ie_name": "ra_rnti",
         "value": 17921,
         "validation": {"valid": true, "errors": [], "warnings": []},
         "reference": "TS 38.321 5.1.4"
       },
       "ta": {
         "ie_name": "ta",
         "value": 31,
         "validation": {"valid": true, "errors": [], "warnings": []},
         "reference": "TS 38.321 5.1.4"
       }
     },
     "layer_parameters": {
       "ra_response_window": 10,
       "backoff_indicator": 0
     },
     "reference": "TS 38.321 5.1.4"
   },
   {
     "step_id": "step_3",
     "timestamp": 10,
     "direction": "UL",
     "layer": "RRC",
     "message_type": "RRCSetupRequest",
     "message_name": "RRC Setup Request",
     "information_elements": {
       "rrc-transaction-id": {
         "ie_name": "rrc-transaction-id",
         "value": 0,
         "validation": {"valid": true, "errors": [], "warnings": []},
         "reference": "TS 38.331 6.2.2"
       },
       "establishment-cause": {
         "ie_name": "establishment-cause",
         "value": "mo-Data",
         "validation": {"valid": true, "errors": [], "warnings": []},
         "reference": "TS 38.331 6.2.2"
       },
       "ue-identity": {
         "ie_name": "ue-identity",
         "value": "001010123456789",
         "validation": {"valid": true, "errors": [], "warnings": []},
         "reference": "TS 38.331 6.2.2"
       }
     },
     "layer_parameters": {
       "selected_plmn": "001-01"
     },
     "reference": "TS 38.331 6.2.2"
   },
   {
     "step_id": "step_4",
     "timestamp": 15,
     "direction": "DL",
     "layer": "RRC",
     "message_type": "RRCSetup",
     "message_name": "RRC Setup",
     "information_elements": {
       "rrc-transaction-id": {
         "ie_name": "rrc-transaction-id",
         "value": 0,
         "validation": {"valid": true, "errors": [], "warnings": []},
         "reference": "TS 38.331 6.2.2"
       }
     },
     "layer_parameters": {
       "srb1_config": "configured"
     },
     "reference": "TS 38.331 6.2.2"
   },
   {
     "step_id": "step_5",
     "timestamp": 20,
     "direction": "UL",
     "layer": "RRC",
     "message_type": "RRCSetupComplete",
     "message_name": "RRC Setup Complete",
     "information_elements": {
       "rrc-transaction-id": {
         "ie_name": "rrc-transaction-id",
         "value": 0,
         "validation": {"valid": true, "errors": [], "warnings": []},
         "reference": "TS 38.331 6.2.2"
       }
     },
     "layer_parameters": {
       "selected_plmn": "001-01"
     },
     "reference": "TS 38.331 6.2.2"
   }
 ]',
 
 -- Layer configurations with unique data
 '{
   "PHY": {
     "parameters": {
       "dl_arfcn": 3732480,
       "ul_arfcn": 3732480,
       "bandwidth": 100,
       "subcarrier_spacing": 30,
       "cp_type": "normal",
       "antenna_ports": 4,
       "pci": 123,
       "ssb_periodicity": 20
     },
     "unique_parameters": {
       "cell_id": 12345,
       "pci": 123,
       "rsrp": -85.2,
       "rsrq": -12.1,
       "sinr": 15.3,
       "cqi": 12,
       "mcs": 8,
       "bler": 0.01,
       "throughput": 125.5,
       "prb_allocation": 50,
       "symbol_allocation": 7
     },
     "statistics": {
       "rsrp": -85.2,
       "rsrq": -12.1,
       "sinr": 15.3,
       "cqi": 12,
       "mcs": 8,
       "bler": 0.01,
       "throughput": 125.5
     },
     "capabilities": {
       "max_bandwidth": 100,
       "max_mimo_layers": 4,
       "supported_modulations": ["QPSK", "16QAM", "64QAM", "256QAM"],
       "carrier_aggregation": true
     },
     "configuration": {
       "dl_arfcn": 3732480,
       "ul_arfcn": 3732480,
       "bandwidth": 100,
       "subcarrier_spacing": 30,
       "pci": 123
     }
   },
   "MAC": {
     "parameters": {
       "harq_processes": {"active_processes": 8, "max_processes": 16},
       "scheduling": {"dl_sched_interval": 1, "ul_sched_interval": 1},
       "random_access": {"ra_attempts": 1, "ra_success": true}
     },
     "unique_parameters": {
       "harq_process_id": 8,
       "lcid": 1,
       "bsr_level": 2,
       "phr": 10,
       "ta": 31,
       "ra_rnti": 17921,
       "preamble_id": 23
     },
     "statistics": {
       "harq_processes": 8,
       "sched_requests": 5,
       "buffer_status_reports": 3,
       "random_access_attempts": 1
     },
     "capabilities": {
       "max_harq_processes": 16,
       "max_logical_channels": 32,
       "scheduling_modes": ["dynamic", "semi-persistent", "configured"]
     },
     "configuration": {
       "harq_enabled": true,
       "scheduling_algorithm": "proportional_fair",
       "max_retransmissions": 3
     }
   },
   "RLC": {
     "parameters": {
       "am_mode": {"sn": 15, "vr_r": 10, "vr_mr": 20},
       "um_mode": {"sn": 8, "vr_ur": 5, "vr_ux": 7}
     },
     "unique_parameters": {
       "sn": 15,
       "si": "completeSDU",
       "p": false,
       "vr_r": 10,
       "vr_mr": 20,
       "vr_x": 12
     },
     "statistics": {
       "tx_pdus": 45,
       "rx_pdus": 42,
       "retransmissions": 3,
       "out_of_order": 1
     },
     "capabilities": {
       "modes": ["AM", "UM", "TM"],
       "max_sequence_number": 4095,
       "segmentation": true
     },
     "configuration": {
       "mode": "AM",
       "max_retransmissions": 3,
       "polling_interval": 1000
     }
   },
   "PDCP": {
     "parameters": {
       "sequence_numbers": {"dl_sn": 1023, "ul_sn": 1020},
       "security": {"encryption": "AES-128", "integrity": "AES-128"}
     },
     "unique_parameters": {
       "pdcp_sn": 1023,
       "d_c": true,
       "rohc_profile": 0,
       "security_algorithm": "AES-128",
       "integrity_protection": true
     },
     "statistics": {
       "tx_packets": 120,
       "rx_packets": 118,
       "dropped_packets": 2,
       "duplicate_packets": 0
     },
     "capabilities": {
       "max_sequence_number": 4095,
       "security_algorithms": ["AES-128", "AES-256"],
       "compression": true
     },
     "configuration": {
       "security_enabled": true,
       "compression_enabled": true,
       "integrity_protection": true
     }
   },
   "RRC": {
     "parameters": {
       "connection_state": "RRC_CONNECTED",
       "establishment_cause": "mo-Data"
     },
     "unique_parameters": {
       "rrc_transaction_id": 0,
       "establishment_cause": "mo-Data",
       "ue_identity": "001010123456789",
       "cell_id": 12345,
       "tac": 7,
       "plmn": {"mcc": 1, "mnc": 1}
     },
     "statistics": {
       "connection_attempts": 1,
       "successful_connections": 1,
       "failed_connections": 0
     },
     "capabilities": {
       "nr_capabilities": true,
       "lte_capabilities": true,
       "carrier_aggregation": true,
       "mimo_capabilities": "4x4"
     },
     "configuration": {
       "connection_state": "RRC_CONNECTED",
       "establishment_cause": "mo-Data",
       "security_context": "active"
     }
   },
   "NAS": {
     "parameters": {
       "registration_state": "REGISTERED",
       "registration_type": "initial"
     },
     "unique_parameters": {
       "nas_key_set_identifier": 0,
       "registration_type": "initial",
       "mobile_identity": "1234567890abcdef",
       "security_context": {"ksi": 0, "sqn": 0}
     },
     "statistics": {
       "registration_attempts": 1,
       "successful_registrations": 1,
       "failed_registrations": 0
     },
     "capabilities": {
       "5g_capabilities": true,
       "security_capabilities": ["AES-128", "AES-256"],
       "mobility_capabilities": true
     },
     "configuration": {
       "registration_state": "REGISTERED",
       "security_context": "active",
       "pdu_session": {"session_id": 1, "dnn": "internet"}
     }
   }
 }',
 
 -- 3GPP Compliance information
 '{
   "standard": "TS 38.331",
   "release": "Release 17",
   "validation": true,
   "ie_coverage": 100,
   "message_types": ["RRCSetupRequest", "RRCSetup", "RRCSetupComplete"],
   "information_elements": ["rrc-transaction-id", "establishment-cause", "ue-identity", "preamble_id", "ra_rnti", "ta"],
   "validation_rules": {
     "ie_validation": "All IEs must be 3GPP compliant",
     "message_sequence": "Messages must follow 3GPP sequence",
     "timing_constraints": "Timing must meet 3GPP requirements"
   }
 }',
 
 -- Expected results with 3GPP validation
 '{
   "success_criteria": {
     "rrc_connection_established": true,
     "srb1_configured": true,
     "ta_updated": true,
     "ie_validation_passed": true
   },
   "failure_scenarios": {
     "rrc_setup_failure": "RRC setup timeout",
     "random_access_failure": "PRACH failure",
     "ie_validation_failure": "Invalid IE values"
   },
   "performance_requirements": {
     "rrc_setup_time_ms": "< 100",
     "random_access_time_ms": "< 50",
     "ie_validation_time_ms": "< 10"
   },
   "validation_rules": {
     "ie_validation": "All IEs must be 3GPP compliant",
     "message_sequence": "Messages must follow 3GPP sequence",
     "timing_constraints": "Timing must meet 3GPP requirements"
   }
 }',
 
 -- Performance metrics per 3GPP requirements
 '{
   "latency": {
     "min": 5,
     "max": 20,
     "target": 10,
     "unit": "ms"
   },
   "throughput": {
     "min": 80,
     "max": 120,
     "target": 100,
     "unit": "Mbps"
   },
   "reliability": {
     "success_rate": 99.9,
     "error_rate": 0.1,
     "availability": 99.99
   }
 }',
 
 -- Unique data for this test case
 '{
   "test_case_specific": {
     "unique_id": "3GPP_5G_NR_0001",
     "generation_seed": 12345,
     "unique_parameters": {
       "cell_id": 12345,
       "ue_identity": "001010123456789",
       "pci": 123,
       "tac": 7,
       "plmn": {"mcc": 1, "mnc": 1}
     }
   },
   "layer_unique_data": {
     "PHY": {
       "rsrp": -85.2,
       "rsrq": -12.1,
       "sinr": 15.3,
       "cqi": 12,
       "mcs": 8,
       "bler": 0.01,
       "throughput": 125.5
     },
     "MAC": {
       "harq_process_id": 8,
       "lcid": 1,
       "bsr_level": 2,
       "phr": 10,
       "ta": 31
     },
     "RLC": {
       "sn": 15,
       "si": "completeSDU",
       "p": false,
       "vr_r": 10,
       "vr_mr": 20
     },
     "PDCP": {
       "pdcp_sn": 1023,
       "d_c": true,
       "rohc_profile": 0,
       "security_algorithm": "AES-128"
     },
     "RRC": {
       "rrc_transaction_id": 0,
       "establishment_cause": "mo-Data",
       "ue_identity": "001010123456789"
     },
     "NAS": {
       "nas_key_set_identifier": 0,
       "registration_type": "initial",
       "mobile_identity": "1234567890abcdef"
     }
   }
 }'
),

-- 5G NR RRC Connection Reconfiguration (3GPP TS 38.331)
('5G NR RRC Connection Reconfiguration', '5G_NR',
 'UE receives RRC Connection Reconfiguration with proper 3GPP IEs', '5G NR',
 '3GPP_5G_NR_0002', 'low',
 
 -- Message Flow with 3GPP IEs
 '[
   {
     "step_id": "step_1",
     "timestamp": 0,
     "direction": "DL",
     "layer": "RRC",
     "message_type": "RRCReconfiguration",
     "message_name": "RRC Connection Reconfiguration",
     "information_elements": {
       "rrc-transaction-id": {
         "ie_name": "rrc-transaction-id",
         "value": 1,
         "validation": {"valid": true, "errors": [], "warnings": []},
         "reference": "TS 38.331 6.2.2"
       }
     },
     "layer_parameters": {
       "radio_bearer_config": "modified"
     },
     "reference": "TS 38.331 6.2.2"
   },
   {
     "step_id": "step_2",
     "timestamp": 5,
     "direction": "UL",
     "layer": "RRC",
     "message_type": "RRCReconfigurationComplete",
     "message_name": "RRC Connection Reconfiguration Complete",
     "information_elements": {
       "rrc-transaction-id": {
         "ie_name": "rrc-transaction-id",
         "value": 1,
         "validation": {"valid": true, "errors": [], "warnings": []},
         "reference": "TS 38.331 6.2.2"
       }
     },
     "layer_parameters": {},
     "reference": "TS 38.331 6.2.2"
   }
 ]',
 
 -- Layer configurations with unique data
 '{
   "RRC": {
     "parameters": {
       "connection_state": "RRC_CONNECTED",
       "reconfiguration_type": "radio_bearer_config"
     },
     "unique_parameters": {
       "rrc_transaction_id": 1,
       "establishment_cause": "mo-Data",
       "ue_identity": "001010123456789",
       "cell_id": 12345,
       "tac": 7,
       "plmn": {"mcc": 1, "mnc": 1}
     },
     "statistics": {
       "reconfiguration_attempts": 1,
       "successful_reconfigurations": 1,
       "failed_reconfigurations": 0
     },
     "capabilities": {
       "nr_capabilities": true,
       "lte_capabilities": true,
       "carrier_aggregation": true,
       "mimo_capabilities": "4x4"
     },
     "configuration": {
       "connection_state": "RRC_CONNECTED",
       "reconfiguration_type": "radio_bearer_config",
       "security_context": "active"
     }
   },
   "PDCP": {
     "parameters": {
       "sequence_numbers": {"dl_sn": 1023, "ul_sn": 1020},
       "security": {"encryption": "AES-128", "integrity": "AES-128", "key_refresh": true}
     },
     "unique_parameters": {
       "pdcp_sn": 1023,
       "d_c": true,
       "rohc_profile": 0,
       "security_algorithm": "AES-128",
       "integrity_protection": true
     },
     "statistics": {
       "tx_packets": 120,
       "rx_packets": 118,
       "dropped_packets": 2,
       "duplicate_packets": 0
     },
     "capabilities": {
       "max_sequence_number": 4095,
       "security_algorithms": ["AES-128", "AES-256"],
       "compression": true
     },
     "configuration": {
       "security_enabled": true,
       "compression_enabled": true,
       "integrity_protection": true,
       "key_refresh": true
     }
   }
 }',
 
 -- 3GPP Compliance information
 '{
   "standard": "TS 38.331",
   "release": "Release 17",
   "validation": true,
   "ie_coverage": 100,
   "message_types": ["RRCReconfiguration", "RRCReconfigurationComplete"],
   "information_elements": ["rrc-transaction-id"],
   "validation_rules": {
     "ie_validation": "All IEs must be 3GPP compliant",
     "message_sequence": "Messages must follow 3GPP sequence",
     "timing_constraints": "Timing must meet 3GPP requirements"
   }
 }',
 
 -- Expected results with 3GPP validation
 '{
   "success_criteria": {
     "reconfiguration_successful": true,
     "radio_bearers_updated": true,
     "ie_validation_passed": true
   },
   "failure_scenarios": {
     "reconfiguration_failure": "Invalid configuration",
     "timeout": "RRC reconfiguration timeout",
     "ie_validation_failure": "Invalid IE values"
   },
   "performance_requirements": {
     "reconfiguration_time_ms": "< 50",
     "ie_validation_time_ms": "< 5"
   },
   "validation_rules": {
     "ie_validation": "All IEs must be 3GPP compliant",
     "message_sequence": "Messages must follow 3GPP sequence",
     "timing_constraints": "Timing must meet 3GPP requirements"
   }
 }',
 
 -- Performance metrics per 3GPP requirements
 '{
   "latency": {
     "min": 2,
     "max": 8,
     "target": 5,
     "unit": "ms"
   },
   "throughput": {
     "min": 80,
     "max": 120,
     "target": 100,
     "unit": "Mbps"
   },
   "reliability": {
     "success_rate": 99.9,
     "error_rate": 0.1,
     "availability": 99.99
   }
 }',
 
 -- Unique data for this test case
 '{
   "test_case_specific": {
     "unique_id": "3GPP_5G_NR_0002",
     "generation_seed": 12346,
     "unique_parameters": {
       "cell_id": 12345,
       "ue_identity": "001010123456789",
       "pci": 123,
       "tac": 7,
       "plmn": {"mcc": 1, "mnc": 1}
     }
   },
   "layer_unique_data": {
     "RRC": {
       "rrc_transaction_id": 1,
       "establishment_cause": "mo-Data",
       "ue_identity": "001010123456789"
     },
     "PDCP": {
       "pdcp_sn": 1023,
       "d_c": true,
       "rohc_profile": 0,
       "security_algorithm": "AES-128"
     }
   }
 }'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_enhanced_test_cases_category ON public.enhanced_test_cases(category);
CREATE INDEX IF NOT EXISTS idx_enhanced_test_cases_protocol_version ON public.enhanced_test_cases(protocol_version);
CREATE INDEX IF NOT EXISTS idx_enhanced_test_cases_complexity ON public.enhanced_test_cases(complexity);
CREATE INDEX IF NOT EXISTS idx_enhanced_test_cases_test_case_id ON public.enhanced_test_cases(test_case_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_test_cases_is_active ON public.enhanced_test_cases(is_active);

-- Create GIN indexes for JSONB fields
CREATE INDEX IF NOT EXISTS idx_enhanced_test_cases_message_flow_gin ON public.enhanced_test_cases USING GIN(message_flow);
CREATE INDEX IF NOT EXISTS idx_enhanced_test_cases_layers_gin ON public.enhanced_test_cases USING GIN(layers);
CREATE INDEX IF NOT EXISTS idx_enhanced_test_cases_compliance_gin ON public.enhanced_test_cases USING GIN(compliance);
CREATE INDEX IF NOT EXISTS idx_enhanced_test_cases_unique_data_gin ON public.enhanced_test_cases USING GIN(unique_data);