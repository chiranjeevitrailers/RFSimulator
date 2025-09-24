-- 5GLabX End-to-End Test Cases Database Schema
-- This file contains the complete database schema for all E2E test cases

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Test Cases Table
CREATE TABLE IF NOT EXISTS test_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    protocol VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    test_type VARCHAR(50) DEFAULT 'conformance',
    complexity VARCHAR(50) DEFAULT 'expert',
    execution_priority INTEGER DEFAULT 5,
    tags TEXT[] DEFAULT '{}',
    test_data JSONB DEFAULT '{}',
    expected_results JSONB DEFAULT '{}',
    duration_minutes INTEGER DEFAULT 30,
    estimated_duration_minutes INTEGER DEFAULT 30,
    automation_level VARCHAR(50) DEFAULT 'manual',
    review_status VARCHAR(50) DEFAULT 'approved',
    layer VARCHAR(50) DEFAULT 'Multi',
    standard_reference VARCHAR(255) DEFAULT '3GPP TS',
    is_active BOOLEAN DEFAULT true,
    is_premium BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Case Messages Table
CREATE TABLE IF NOT EXISTS test_case_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    timestamp_ms INTEGER NOT NULL,
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('UL', 'DL')),
    layer VARCHAR(20) NOT NULL,
    protocol VARCHAR(20) NOT NULL,
    message_type VARCHAR(100) NOT NULL,
    message_name VARCHAR(255) NOT NULL,
    message_description TEXT,
    message_payload JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Case Information Elements Table
CREATE TABLE IF NOT EXISTS test_case_information_elements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
    ie_name VARCHAR(255) NOT NULL,
    ie_type VARCHAR(50) NOT NULL,
    ie_value TEXT,
    ie_size INTEGER DEFAULT 0,
    mandatory BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Case Layer Parameters Table
CREATE TABLE IF NOT EXISTS test_case_layer_parameters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
    layer VARCHAR(20) NOT NULL,
    parameter_name VARCHAR(255) NOT NULL,
    parameter_type VARCHAR(50) NOT NULL,
    parameter_value TEXT,
    parameter_unit VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Case Executions Table
CREATE TABLE IF NOT EXISTS test_case_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
    run_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'running',
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    execution_data JSONB DEFAULT '{}',
    results JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_cases_protocol ON test_cases(protocol);
CREATE INDEX IF NOT EXISTS idx_test_cases_category ON test_cases(category);
CREATE INDEX IF NOT EXISTS idx_test_cases_active ON test_cases(is_active);
CREATE INDEX IF NOT EXISTS idx_test_case_messages_test_case_id ON test_case_messages(test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_case_messages_layer ON test_case_messages(layer);
CREATE INDEX IF NOT EXISTS idx_test_case_ies_test_case_id ON test_case_information_elements(test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_case_ies_type ON test_case_information_elements(ie_type);
CREATE INDEX IF NOT EXISTS idx_test_case_params_test_case_id ON test_case_layer_parameters(test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_case_params_layer ON test_case_layer_parameters(layer);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_test_case_id ON test_case_executions(test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_status ON test_case_executions(status);

-- Constraints
ALTER TABLE test_cases ADD CONSTRAINT test_cases_automation_level_check 
    CHECK (automation_level IN ('manual', 'semi-automated', 'fully-automated'));

ALTER TABLE test_cases ADD CONSTRAINT test_cases_test_type_check 
    CHECK (test_type IN ('conformance', 'functional', 'performance', 'regression'));

ALTER TABLE test_cases ADD CONSTRAINT test_cases_category_check 
    CHECK (category IN ('4G_LTE', '5G_NR', 'Multi', 'End-to-End'));

ALTER TABLE test_cases ADD CONSTRAINT test_cases_complexity_check 
    CHECK (complexity IN ('easy', 'medium', 'expert'));

ALTER TABLE test_cases ADD CONSTRAINT test_cases_review_status_check 
    CHECK (review_status IN ('draft', 'pending_review', 'approved', 'rejected'));

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_test_cases_updated_at BEFORE UPDATE ON test_cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_case_messages_updated_at BEFORE UPDATE ON test_case_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_case_information_elements_updated_at BEFORE UPDATE ON test_case_information_elements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_case_layer_parameters_updated_at BEFORE UPDATE ON test_case_layer_parameters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_case_executions_updated_at BEFORE UPDATE ON test_case_executions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();