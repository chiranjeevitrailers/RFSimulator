-- Enhanced Professional Testing Platform Database Schema
-- Supports complete 5G NR SA and NSA test cases with comprehensive message flows

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enhanced Test Cases Table with SA/NSA support
CREATE TABLE test_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'InitialAccess', 'Handover', 'PDU_Session', 'Mobility', 'Security', 
        'Measurement', 'Power_Control', 'Scheduling', 'NSA', 'EN_DC', 'NE_DC', 
        'NGEN_DC', 'Multiple_Split_Bearer', '5G_NR', '4G_LTE', 'IMS', 'O_RAN', 
        'NB_IoT', 'V2X', 'NTN', 'VoLTE', 'VoNR', 'Conference_Call', 'Enhanced_IMS'
    )),
    subcategory VARCHAR(100),
    protocol VARCHAR(50) NOT NULL CHECK (protocol IN (
        '5G_NR', 'LTE', 'EN-DC', 'NE-DC', 'NGEN-DC', 'IMS_SIP', 'O_RAN', 
        'NB_IoT', 'V2X', 'NTN', 'VoLTE', 'VoNR'
    )),
    test_type VARCHAR(50) NOT NULL CHECK (test_type IN (
        'Functional', 'Performance', 'RF', 'Stability', 'Sanity', 'Stress', 
        'Interoperability', 'Security', 'Mobility', 'Conformance'
    )),
    complexity VARCHAR(20) NOT NULL CHECK (complexity IN ('beginner', 'intermediate', 'advanced', 'expert')),
    priority VARCHAR(10) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    estimated_duration INTEGER, -- in seconds
    preconditions TEXT,
    test_steps TEXT,
    expected_signaling_flow TEXT,
    expected_ies TEXT,
    layer_parameters TEXT,
    expected_result TEXT,
    three_gpp_ref TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Test Messages Table
CREATE TABLE test_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
    message_id VARCHAR(50) NOT NULL,
    message_name VARCHAR(255) NOT NULL,
    protocol VARCHAR(50) NOT NULL,
    layer VARCHAR(20) NOT NULL CHECK (layer IN (
        'PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS', 'SIP', 'NGAP', 
        'S1AP', 'X2AP', 'XnAP', 'PFCP', 'GTP', 'HTTP2'
    )),
    direction VARCHAR(20) NOT NULL CHECK (direction IN (
        'UE_to_gNB', 'gNB_to_UE', 'UE_to_eNodeB', 'eNodeB_to_UE', 
        'gNB_to_AMF', 'AMF_to_gNB', 'gNB_to_UPF', 'UPF_to_gNB',
        'BIDIR', 'UL', 'DL'
    )),
    message_type VARCHAR(100) NOT NULL,
    sequence_number INTEGER NOT NULL,
    timestamp_offset_ms INTEGER DEFAULT 0,
    message_payload JSONB,
    expected_response VARCHAR(100),
    timeout_ms INTEGER DEFAULT 5000,
    validation_rules JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Information Elements Table
CREATE TABLE information_elements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
    message_id UUID REFERENCES test_messages(id) ON DELETE CASCADE,
    ie_id VARCHAR(50) NOT NULL,
    ie_name VARCHAR(255) NOT NULL,
    ie_type VARCHAR(50) NOT NULL CHECK (ie_type IN ('MANDATORY', 'OPTIONAL', 'CONDITIONAL')),
    data_type VARCHAR(50) NOT NULL CHECK (data_type IN (
        'INTEGER', 'STRING', 'BOOLEAN', 'ENUM', 'BITSTRING', 'OCTETSTRING', 
        'SEQUENCE', 'CHOICE', 'SET', 'SEQUENCE_OF', 'SET_OF'
    )),
    ie_value JSONB,
    ie_description TEXT,
    validation_rules JSONB,
    dependencies JSONB,
    three_gpp_ref TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Layer Parameters Table
CREATE TABLE layer_parameters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
    layer VARCHAR(20) NOT NULL CHECK (layer IN (
        'PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS', 'NGAP', 
        'S1AP', 'X2AP', 'XnAP', 'PFCP', 'GTP', 'HTTP2'
    )),
    parameter_name VARCHAR(255) NOT NULL,
    parameter_type VARCHAR(50) NOT NULL CHECK (parameter_type IN (
        'CONFIG', 'MEASUREMENT', 'STATUS', 'CONTROL', 'TIMER', 'COUNTER'
    )),
    parameter_value JSONB,
    parameter_unit VARCHAR(50),
    min_value JSONB,
    max_value JSONB,
    default_value JSONB,
    description TEXT,
    three_gpp_ref TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Execution Table
CREATE TABLE test_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
    execution_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN (
        'PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'TIMEOUT'
    )),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    result_summary JSONB,
    execution_config JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Execution Logs Table
CREATE TABLE execution_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID REFERENCES test_executions(id) ON DELETE CASCADE,
    log_level VARCHAR(10) NOT NULL CHECK (log_level IN ('ERROR', 'WARN', 'INFO', 'DEBUG')),
    log_message TEXT NOT NULL,
    log_data JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    layer VARCHAR(20),
    component VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Results Table
CREATE TABLE test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID REFERENCES test_executions(id) ON DELETE CASCADE,
    test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
    result_type VARCHAR(50) NOT NULL CHECK (result_type IN (
        'MESSAGE_RESULT', 'LAYER_RESULT', 'PERFORMANCE_RESULT', 'ERROR_RESULT'
    )),
    result_data JSONB NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NSA Specific Tables
CREATE TABLE nsa_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
    nsa_type VARCHAR(20) NOT NULL CHECK (nsa_type IN ('EN-DC', 'NE-DC', 'NGEN-DC')),
    anchor_rat VARCHAR(10) NOT NULL CHECK (anchor_rat IN ('LTE', 'NR')),
    secondary_rat VARCHAR(10) NOT NULL CHECK (secondary_rat IN ('LTE', 'NR')),
    split_bearer_config JSONB,
    carrier_aggregation_config JSONB,
    measurement_config JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE split_bearers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nsa_config_id UUID REFERENCES nsa_configurations(id) ON DELETE CASCADE,
    bearer_id VARCHAR(50) NOT NULL,
    bearer_type VARCHAR(20) NOT NULL CHECK (bearer_type IN ('MCG', 'SCG', 'Split')),
    qos_parameters JSONB,
    pdcp_config JSONB,
    rlc_config JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Metrics Table
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID REFERENCES test_executions(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,6),
    metric_unit VARCHAR(50),
    metric_type VARCHAR(50) CHECK (metric_type IN (
        'LATENCY', 'THROUGHPUT', 'SUCCESS_RATE', 'ERROR_RATE', 'RESOURCE_UTILIZATION'
    )),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Indexes for better performance
CREATE INDEX idx_test_cases_category ON test_cases(category);
CREATE INDEX idx_test_cases_protocol ON test_cases(protocol);
CREATE INDEX idx_test_cases_test_type ON test_cases(test_type);
CREATE INDEX idx_test_cases_complexity ON test_cases(complexity);
CREATE INDEX idx_test_cases_priority ON test_cases(priority);
CREATE INDEX idx_test_cases_tags ON test_cases USING GIN(tags);
CREATE INDEX idx_test_cases_name_trgm ON test_cases USING GIN(name gin_trgm_ops);

CREATE INDEX idx_test_messages_test_case_id ON test_messages(test_case_id);
CREATE INDEX idx_test_messages_sequence ON test_messages(test_case_id, sequence_number);
CREATE INDEX idx_test_messages_layer ON test_messages(layer);
CREATE INDEX idx_test_messages_direction ON test_messages(direction);

CREATE INDEX idx_information_elements_test_case_id ON information_elements(test_case_id);
CREATE INDEX idx_information_elements_message_id ON information_elements(message_id);
CREATE INDEX idx_information_elements_ie_type ON information_elements(ie_type);

CREATE INDEX idx_layer_parameters_test_case_id ON layer_parameters(test_case_id);
CREATE INDEX idx_layer_parameters_layer ON layer_parameters(layer);
CREATE INDEX idx_layer_parameters_type ON layer_parameters(parameter_type);

CREATE INDEX idx_test_executions_test_case_id ON test_executions(test_case_id);
CREATE INDEX idx_test_executions_status ON test_executions(status);
CREATE INDEX idx_test_executions_started_at ON test_executions(started_at);

CREATE INDEX idx_execution_logs_execution_id ON execution_logs(execution_id);
CREATE INDEX idx_execution_logs_timestamp ON execution_logs(timestamp);
CREATE INDEX idx_execution_logs_level ON execution_logs(log_level);

CREATE INDEX idx_test_results_execution_id ON test_results(execution_id);
CREATE INDEX idx_test_results_test_case_id ON test_results(test_case_id);
CREATE INDEX idx_test_results_type ON test_results(result_type);

CREATE INDEX idx_nsa_configurations_test_case_id ON nsa_configurations(test_case_id);
CREATE INDEX idx_nsa_configurations_type ON nsa_configurations(nsa_type);

CREATE INDEX idx_split_bearers_nsa_config_id ON split_bearers(nsa_config_id);
CREATE INDEX idx_split_bearers_type ON split_bearers(bearer_type);

CREATE INDEX idx_performance_metrics_execution_id ON performance_metrics(execution_id);
CREATE INDEX idx_performance_metrics_name ON performance_metrics(metric_name);
CREATE INDEX idx_performance_metrics_type ON performance_metrics(metric_type);

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

CREATE TRIGGER update_test_executions_updated_at BEFORE UPDATE ON test_executions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enhanced Views for easier querying
CREATE VIEW test_case_summary AS
SELECT 
    tc.id,
    tc.test_case_id,
    tc.name,
    tc.category,
    tc.subcategory,
    tc.protocol,
    tc.test_type,
    tc.complexity,
    tc.priority,
    tc.estimated_duration,
    tc.three_gpp_ref,
    COUNT(tm.id) as message_count,
    COUNT(lp.id) as parameter_count,
    COUNT(ie.id) as ie_count
FROM test_cases tc
LEFT JOIN test_messages tm ON tc.id = tm.test_case_id
LEFT JOIN layer_parameters lp ON tc.id = lp.test_case_id
LEFT JOIN information_elements ie ON tc.id = ie.test_case_id
GROUP BY tc.id, tc.test_case_id, tc.name, tc.category, tc.subcategory, 
         tc.protocol, tc.test_type, tc.complexity, tc.priority, 
         tc.estimated_duration, tc.three_gpp_ref;

CREATE VIEW test_execution_summary AS
SELECT 
    te.execution_id,
    tc.test_case_id,
    tc.name as test_case_name,
    tc.category,
    tc.protocol,
    te.status,
    te.started_at,
    te.completed_at,
    te.duration_ms,
    te.result_summary,
    COUNT(el.id) as log_count,
    COUNT(tr.id) as result_count
FROM test_executions te
JOIN test_cases tc ON te.test_case_id = tc.id
LEFT JOIN execution_logs el ON te.id = el.execution_id
LEFT JOIN test_results tr ON te.id = tr.execution_id
GROUP BY te.execution_id, tc.test_case_id, tc.name, tc.category, tc.protocol,
         te.status, te.started_at, te.completed_at, te.duration_ms, te.result_summary;

CREATE VIEW nsa_test_summary AS
SELECT 
    tc.id,
    tc.test_case_id,
    tc.name,
    nc.nsa_type,
    nc.anchor_rat,
    nc.secondary_rat,
    COUNT(sb.id) as split_bearer_count
FROM test_cases tc
JOIN nsa_configurations nc ON tc.id = nc.test_case_id
LEFT JOIN split_bearers sb ON nc.id = sb.nsa_config_id
GROUP BY tc.id, tc.test_case_id, tc.name, nc.nsa_type, nc.anchor_rat, nc.secondary_rat;

-- Row Level Security (RLS) policies
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE information_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE layer_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE nsa_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE split_bearers ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your security requirements)
CREATE POLICY "Allow public read access to test_cases" ON test_cases FOR SELECT USING (true);
CREATE POLICY "Allow public read access to test_messages" ON test_messages FOR SELECT USING (true);
CREATE POLICY "Allow public read access to information_elements" ON information_elements FOR SELECT USING (true);
CREATE POLICY "Allow public read access to layer_parameters" ON layer_parameters FOR SELECT USING (true);
CREATE POLICY "Allow public read access to test_executions" ON test_executions FOR SELECT USING (true);
CREATE POLICY "Allow public read access to execution_logs" ON execution_logs FOR SELECT USING (true);
CREATE POLICY "Allow public read access to test_results" ON test_results FOR SELECT USING (true);
CREATE POLICY "Allow public read access to nsa_configurations" ON nsa_configurations FOR SELECT USING (true);
CREATE POLICY "Allow public read access to split_bearers" ON split_bearers FOR SELECT USING (true);
CREATE POLICY "Allow public read access to performance_metrics" ON performance_metrics FOR SELECT USING (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Sample data for 5G NR SA Initial Access test case
INSERT INTO test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES (
    'NR-IA-F1', 
    'SA Attach', 
    'Basic NR standalone initial access', 
    'InitialAccess', 
    'SA_Attach', 
    '5G_NR', 
    'Functional', 
    'intermediate', 
    'high', 
    120,
    'UE powered off, valid USIM, gNB with SIBs',
    '1.Power on UE;2.Cell sync;3.Decode MIB/SIB;4.RACH;5.RRC Setup;6.NAS Register',
    'RRCConnectionRequest->RRCConnectionSetup->RRCConnectionSetupComplete',
    'UE Identity,EstablishmentCause,5G-GUTI,IMSI,NSSAI',
    'PHY:SSB index,RSRP;MAC:RACH preamble;RRC:UE ID;NAS:Registration type',
    'UE registered,RRC connected',
    'TS 38.300,TS 24.501'
);

-- Sample data for NSA EN-DC test case
INSERT INTO test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES (
    'NR-NSA-F1', 
    'EN-DC Basic Attach', 
    'EN-DC initial access with LTE anchor and NR secondary', 
    'NSA', 
    'EN-DC_Basic_Attach', 
    'EN-DC', 
    'Functional', 
    'advanced', 
    'high', 
    180,
    'LTE eNB/gNB available, UE EN-DC capable',
    '1.Attach to LTE (EPS/EMM attach);2.EN-DC secondary cell addition;3.RRC reconfiguration for NR secondary',
    'EPS attach->EN-DC RRC add',
    'EN-DC capability,IuR/Meas IDs,Secondary cell info',
    'PHY:SSB,CarrierFreq;RRC:MeasConfig;NAS:Attach type',
    'UE in EN-DC dual connectivity',
    'TS 37.340,TS 23.501'
);

-- Get the NSA test case ID for foreign key references
DO $$
DECLARE
    nsa_test_case_uuid UUID;
BEGIN
    SELECT id INTO nsa_test_case_uuid FROM test_cases WHERE test_case_id = 'NR-NSA-F1';
    
    -- Insert NSA configuration
    INSERT INTO nsa_configurations (
        test_case_id, nsa_type, anchor_rat, secondary_rat, 
        split_bearer_config, carrier_aggregation_config, measurement_config
    ) VALUES (
        nsa_test_case_uuid, 'EN-DC', 'LTE', 'NR',
        '{"split_bearer_enabled": true, "pdcp_duplication": true}'::jsonb,
        '{"ca_enabled": false, "max_secondary_cells": 1}'::jsonb,
        '{"measurement_gaps": true, "cross_rat_measurements": true}'::jsonb
    );
    
    -- Insert split bearer configuration
    INSERT INTO split_bearers (
        nsa_config_id, bearer_id, bearer_type, qos_parameters, pdcp_config, rlc_config
    ) 
    SELECT 
        nc.id, 'DRB1', 'Split', 
        '{"qfi": 1, "5qi": 9, "gbr": false}'::jsonb,
        '{"duplication": true, "reordering": true}'::jsonb,
        '{"mode": "AM", "polling": true}'::jsonb
    FROM nsa_configurations nc WHERE nc.test_case_id = nsa_test_case_uuid;
END $$;