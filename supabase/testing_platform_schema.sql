-- Professional Testing Platform Database Schema
-- This schema supports real 3GPP-compliant test cases with message flows, IEs, and layer parameters

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Test Cases Table
CREATE TABLE test_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('5G_NR', '4G_LTE', 'IMS', 'O_RAN', 'NB_IoT', 'V2X', 'NTN')),
    protocol VARCHAR(50) NOT NULL CHECK (protocol IN ('5G_NR', 'LTE', 'IMS_SIP', 'O_RAN', 'NB_IoT', 'V2X', 'NTN')),
    test_type VARCHAR(50) NOT NULL CHECK (test_type IN ('functional', 'performance', 'stability', 'stress', 'interoperability', 'security', 'mobility', 'conformance')),
    complexity VARCHAR(20) NOT NULL CHECK (complexity IN ('beginner', 'intermediate', 'advanced', 'expert')),
    duration_seconds INTEGER,
    priority VARCHAR(10) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    tags TEXT[],
    expected_result TEXT,
    prerequisites TEXT,
    test_steps JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Messages Table
CREATE TABLE test_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
    message_id VARCHAR(50) NOT NULL,
    message_name VARCHAR(255) NOT NULL,
    protocol VARCHAR(50) NOT NULL,
    layer VARCHAR(20) NOT NULL CHECK (layer IN ('PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS', 'SIP')),
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('UL', 'DL', 'BIDIR')),
    message_type VARCHAR(100) NOT NULL,
    sequence_order INTEGER NOT NULL,
    timestamp_offset_ms INTEGER DEFAULT 0,
    message_payload JSONB,
    expected_response VARCHAR(100),
    timeout_ms INTEGER DEFAULT 5000,
    validation_rules JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Information Elements Table
CREATE TABLE information_elements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES test_messages(id) ON DELETE CASCADE,
    ie_id VARCHAR(50) NOT NULL,
    ie_name VARCHAR(255) NOT NULL,
    ie_type VARCHAR(50) NOT NULL CHECK (ie_type IN ('MANDATORY', 'OPTIONAL', 'CONDITIONAL')),
    data_type VARCHAR(50) NOT NULL CHECK (data_type IN ('INTEGER', 'STRING', 'BOOLEAN', 'ENUM', 'BITSTRING', 'OCTETSTRING', 'SEQUENCE')),
    ie_value JSONB,
    ie_description TEXT,
    validation_rules JSONB,
    dependencies JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Layer Parameters Table
CREATE TABLE layer_parameters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
    layer VARCHAR(20) NOT NULL CHECK (layer IN ('PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS')),
    parameter_name VARCHAR(255) NOT NULL,
    parameter_type VARCHAR(50) NOT NULL CHECK (parameter_type IN ('CONFIG', 'MEASUREMENT', 'STATUS', 'CONTROL')),
    parameter_value JSONB,
    parameter_unit VARCHAR(50),
    min_value JSONB,
    max_value JSONB,
    default_value JSONB,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Execution Results Table
CREATE TABLE test_execution_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
    execution_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'TIMEOUT')),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    result_summary JSONB,
    message_results JSONB,
    layer_results JSONB,
    error_logs JSONB,
    performance_metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Execution Logs Table
CREATE TABLE test_execution_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID NOT NULL,
    log_level VARCHAR(10) NOT NULL CHECK (log_level IN ('ERROR', 'WARN', 'INFO', 'DEBUG')),
    log_message TEXT NOT NULL,
    log_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message_id UUID REFERENCES test_messages(id),
    layer VARCHAR(20),
    component VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_test_cases_category ON test_cases(category);
CREATE INDEX idx_test_cases_protocol ON test_cases(protocol);
CREATE INDEX idx_test_cases_test_type ON test_cases(test_type);
CREATE INDEX idx_test_messages_test_case_id ON test_messages(test_case_id);
CREATE INDEX idx_test_messages_sequence ON test_messages(test_case_id, sequence_order);
CREATE INDEX idx_information_elements_message_id ON information_elements(message_id);
CREATE INDEX idx_layer_parameters_test_case_id ON layer_parameters(test_case_id);
CREATE INDEX idx_layer_parameters_layer ON layer_parameters(layer);
CREATE INDEX idx_test_execution_results_execution_id ON test_execution_results(execution_id);
CREATE INDEX idx_test_execution_results_test_case_id ON test_execution_results(test_case_id);
CREATE INDEX idx_test_execution_logs_execution_id ON test_execution_logs(execution_id);
CREATE INDEX idx_test_execution_logs_timestamp ON test_execution_logs(log_timestamp);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_test_cases_updated_at BEFORE UPDATE ON test_cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data insertion
INSERT INTO test_cases (test_case_id, name, description, category, protocol, test_type, complexity, duration_seconds, priority, tags, expected_result, test_steps) VALUES
('TC_5G_NR_INITIAL_ACCESS_001', '5G NR Initial Access Procedure', 'Complete 5G NR initial access procedure including random access, RRC setup, and authentication', '5G_NR', '5G_NR', 'functional', 'intermediate', 120, 'high', 
 ARRAY['5G', 'NR', 'Initial_Access', 'Random_Access', 'RRC_Setup', 'Authentication'], 
 'successful_initial_access',
 '[
   {"step": 1, "description": "UE performs cell search and synchronization", "layer": "PHY", "duration_ms": 1000},
   {"step": 2, "description": "UE receives system information", "layer": "RRC", "duration_ms": 500},
   {"step": 3, "description": "UE performs random access procedure", "layer": "MAC", "duration_ms": 2000},
   {"step": 4, "description": "gNodeB responds with Random Access Response", "layer": "MAC", "duration_ms": 100},
   {"step": 5, "description": "UE sends RRC Setup Request", "layer": "RRC", "duration_ms": 100},
   {"step": 6, "description": "gNodeB sends RRC Setup", "layer": "RRC", "duration_ms": 100},
   {"step": 7, "description": "UE sends RRC Setup Complete", "layer": "RRC", "duration_ms": 100},
   {"step": 8, "description": "gNodeB initiates authentication", "layer": "NAS", "duration_ms": 500},
   {"step": 9, "description": "UE responds with authentication response", "layer": "NAS", "duration_ms": 100},
   {"step": 10, "description": "gNodeB sends security mode command", "layer": "RRC", "duration_ms": 100},
   {"step": 11, "description": "UE responds with security mode complete", "layer": "RRC", "duration_ms": 100}
 ]'::jsonb);

-- Get the test case ID for foreign key references
DO $$
DECLARE
    test_case_uuid UUID;
BEGIN
    SELECT id INTO test_case_uuid FROM test_cases WHERE test_case_id = 'TC_5G_NR_INITIAL_ACCESS_001';
    
    -- Insert test messages
    INSERT INTO test_messages (test_case_id, message_id, message_name, protocol, layer, direction, message_type, sequence_order, timestamp_offset_ms, message_payload, expected_response, timeout_ms) VALUES
    (test_case_uuid, 'MSG_001', 'RRC Setup Request', '5G_NR', 'RRC', 'UL', 'RRC_SETUP_REQUEST', 1, 0, 
     '{"messageType": "RRC_SETUP_REQUEST", "protocolVersion": "16.0.0"}'::jsonb, 'RRC_SETUP', 5000),
    (test_case_uuid, 'MSG_002', 'RRC Setup', '5G_NR', 'RRC', 'DL', 'RRC_SETUP', 2, 100, 
     '{"messageType": "RRC_SETUP", "protocolVersion": "16.0.0"}'::jsonb, 'RRC_SETUP_COMPLETE', 5000),
    (test_case_uuid, 'MSG_003', 'RRC Setup Complete', '5G_NR', 'RRC', 'UL', 'RRC_SETUP_COMPLETE', 3, 200, 
     '{"messageType": "RRC_SETUP_COMPLETE", "protocolVersion": "16.0.0"}'::jsonb, 'INITIAL_UE_MESSAGE', 5000),
    (test_case_uuid, 'MSG_004', 'Authentication Request', '5G_NR', 'NAS', 'DL', 'AUTHENTICATION_REQUEST', 4, 300, 
     '{"messageType": "AUTHENTICATION_REQUEST", "protocolVersion": "16.0.0"}'::jsonb, 'AUTHENTICATION_RESPONSE', 5000),
    (test_case_uuid, 'MSG_005', 'Authentication Response', '5G_NR', 'NAS', 'UL', 'AUTHENTICATION_RESPONSE', 5, 400, 
     '{"messageType": "AUTHENTICATION_RESPONSE", "protocolVersion": "16.0.0"}'::jsonb, 'SECURITY_MODE_COMMAND', 5000);
    
    -- Insert information elements for RRC Setup Request
    INSERT INTO information_elements (message_id, ie_id, ie_name, ie_type, data_type, ie_value, ie_description, validation_rules) 
    SELECT m.id, 'ue_Identity', 'UE Identity', 'MANDATORY', 'BITSTRING', '"0000000000000001"', 'UE identity for RRC setup', '{"minLength": 16, "maxLength": 16}'
    FROM test_messages m WHERE m.message_id = 'MSG_001';
    
    INSERT INTO information_elements (message_id, ie_id, ie_name, ie_type, data_type, ie_value, ie_description, validation_rules) 
    SELECT m.id, 'establishmentCause', 'Establishment Cause', 'MANDATORY', 'ENUM', '"mo_Data"', 'Establishment cause for RRC setup', '{"allowedValues": ["mo_Data", "mo_Signalling", "mt_Access", "emergency"]}'
    FROM test_messages m WHERE m.message_id = 'MSG_001';
    
    INSERT INTO information_elements (message_id, ie_id, ie_name, ie_type, data_type, ie_value, ie_description, validation_rules) 
    SELECT m.id, 'ng_ksi', 'NG KSI', 'MANDATORY', 'ENUM', '"no_key_is_available"', 'NG KSI for security context', '{"allowedValues": ["no_key_is_available", "ksi_0", "ksi_1", "ksi_2", "ksi_3", "ksi_4", "ksi_5", "ksi_6", "ksi_7"]}'
    FROM test_messages m WHERE m.message_id = 'MSG_001';
    
    -- Insert layer parameters
    INSERT INTO layer_parameters (test_case_id, layer, parameter_name, parameter_type, parameter_value, parameter_unit, min_value, max_value, default_value, description) VALUES
    (test_case_uuid, 'PHY', 'RSRP', 'MEASUREMENT', '-85', 'dBm', '-140', '-44', '-85', 'Reference Signal Received Power'),
    (test_case_uuid, 'PHY', 'RSRQ', 'MEASUREMENT', '-10', 'dB', '-19.5', '-3', '-10', 'Reference Signal Received Quality'),
    (test_case_uuid, 'PHY', 'SINR', 'MEASUREMENT', '15', 'dB', '-10', '30', '15', 'Signal to Interference plus Noise Ratio'),
    (test_case_uuid, 'MAC', 'RA_Preamble', 'CONFIG', '1', 'index', '0', '63', '1', 'Random Access Preamble Index'),
    (test_case_uuid, 'MAC', 'RA_Response_Window', 'CONFIG', '10', 'ms', '1', '40', '10', 'Random Access Response Window'),
    (test_case_uuid, 'RRC', 'RRC_Transaction_ID', 'CONFIG', '1', 'index', '0', '3', '1', 'RRC Transaction Identifier'),
    (test_case_uuid, 'RRC', 'Security_Algorithm', 'CONFIG', 'AES', 'algorithm', null, null, 'AES', 'Security Algorithm'),
    (test_case_uuid, 'NAS', 'Authentication_Vector', 'CONFIG', 'AUTN', 'vector', null, null, 'AUTN', 'Authentication Vector');
END $$;

-- Insert LTE test case
INSERT INTO test_cases (test_case_id, name, description, category, protocol, test_type, complexity, duration_seconds, priority, tags, expected_result, test_steps) VALUES
('TC_LTE_ATTACH_001', 'LTE Attach Procedure', 'Complete LTE attach procedure including authentication and bearer establishment', '4G_LTE', 'LTE', 'functional', 'intermediate', 150, 'high', 
 ARRAY['LTE', 'Attach', 'Authentication', 'Bearer_Establishment'], 
 'successful_attach',
 '[
   {"step": 1, "description": "UE sends RRC Connection Request", "layer": "RRC", "duration_ms": 100},
   {"step": 2, "description": "eNodeB responds with RRC Connection Setup", "layer": "RRC", "duration_ms": 100},
   {"step": 3, "description": "UE sends RRC Connection Setup Complete", "layer": "RRC", "duration_ms": 100},
   {"step": 4, "description": "UE sends Attach Request", "layer": "NAS", "duration_ms": 100},
   {"step": 5, "description": "eNodeB forwards to MME", "layer": "S1AP", "duration_ms": 200},
   {"step": 6, "description": "MME initiates authentication", "layer": "NAS", "duration_ms": 500},
   {"step": 7, "description": "UE responds with authentication response", "layer": "NAS", "duration_ms": 100},
   {"step": 8, "description": "MME sends security mode command", "layer": "NAS", "duration_ms": 100},
   {"step": 9, "description": "UE responds with security mode complete", "layer": "NAS", "duration_ms": 100},
   {"step": 10, "description": "MME sends attach accept", "layer": "NAS", "duration_ms": 100},
   {"step": 11, "description": "UE sends attach complete", "layer": "NAS", "duration_ms": 100}
 ]'::jsonb);

-- Views for easier querying
CREATE VIEW test_case_summary AS
SELECT 
    tc.id,
    tc.test_case_id,
    tc.name,
    tc.category,
    tc.protocol,
    tc.test_type,
    tc.complexity,
    tc.priority,
    tc.duration_seconds,
    COUNT(tm.id) as message_count,
    COUNT(lp.id) as parameter_count
FROM test_cases tc
LEFT JOIN test_messages tm ON tc.id = tm.test_case_id
LEFT JOIN layer_parameters lp ON tc.id = lp.test_case_id
GROUP BY tc.id, tc.test_case_id, tc.name, tc.category, tc.protocol, tc.test_type, tc.complexity, tc.priority, tc.duration_seconds;

CREATE VIEW test_execution_summary AS
SELECT 
    ter.execution_id,
    tc.test_case_id,
    tc.name as test_case_name,
    ter.status,
    ter.start_time,
    ter.end_time,
    ter.duration_ms,
    ter.result_summary
FROM test_execution_results ter
JOIN test_cases tc ON ter.test_case_id = tc.id;

-- Row Level Security (RLS) policies
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE information_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE layer_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_execution_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_execution_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your security requirements)
CREATE POLICY "Allow public read access to test_cases" ON test_cases FOR SELECT USING (true);
CREATE POLICY "Allow public read access to test_messages" ON test_messages FOR SELECT USING (true);
CREATE POLICY "Allow public read access to information_elements" ON information_elements FOR SELECT USING (true);
CREATE POLICY "Allow public read access to layer_parameters" ON layer_parameters FOR SELECT USING (true);
CREATE POLICY "Allow public read access to test_execution_results" ON test_execution_results FOR SELECT USING (true);
CREATE POLICY "Allow public read access to test_execution_logs" ON test_execution_logs FOR SELECT USING (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
