-- Migration to add GCF and PTCRB categories to the testing platform
-- This migration adds support for GCF and PTCRB certification test categories

-- Update the category constraint to include GCF and PTCRB
ALTER TABLE test_cases 
DROP CONSTRAINT IF EXISTS test_cases_category_check;

ALTER TABLE test_cases 
ADD CONSTRAINT test_cases_category_check 
CHECK (category IN ('5G_NR', '4G_LTE', 'IMS', 'O_RAN', 'NB_IoT', 'V2X', 'NTN', 'GCF', 'PTCRB'));

-- Update the protocol constraint to include GCF and PTCRB
ALTER TABLE test_cases 
DROP CONSTRAINT IF EXISTS test_cases_protocol_check;

ALTER TABLE test_cases 
ADD CONSTRAINT test_cases_protocol_check 
CHECK (protocol IN ('5G_NR', 'LTE', 'IMS_SIP', 'O_RAN', 'NB_IoT', 'V2X', 'NTN', 'GCF', 'PTCRB'));

-- Insert GCF test cases
INSERT INTO test_cases (
    test_case_id, name, description, category, protocol, test_type, complexity, 
    duration_seconds, priority, tags, expected_result, prerequisites, test_steps
) VALUES 
-- GCF 3GPP Conformance Tests
('GCF-001', 'GCF RRC Connection Establishment', 'Test RRC connection establishment procedure according to GCF conformance requirements', 'GCF', 'GCF', 'conformance', 'intermediate', 300, 'high', 
 ARRAY['GCF', '3GPP', 'RRC', 'Connection', 'Conformance'], 'RRC Connection established successfully', 'UE in RRC_IDLE state', 
 '{"steps": ["Send RRC Connection Request", "Verify RRC Connection Setup", "Confirm RRC Connection Complete"]}'::jsonb),

('GCF-002', 'GCF NAS Authentication', 'Test NAS authentication procedure for GCF device certification', 'GCF', 'GCF', 'conformance', 'intermediate', 240, 'high',
 ARRAY['GCF', 'NAS', 'Authentication', 'Security', 'Certification'], 'Authentication successful with valid credentials', 'UE registered with network', 
 '{"steps": ["Send Authentication Request", "Process Authentication Challenge", "Verify Authentication Response"]}'::jsonb),

('GCF-003', 'GCF RF Transmitter Test', 'Test RF transmitter characteristics according to GCF certification requirements', 'GCF', 'GCF', 'performance', 'advanced', 600, 'critical',
 ARRAY['GCF', 'RF', 'Transmitter', 'Performance', 'EMC'], 'Transmitter meets GCF power and spectral requirements', 'RF test equipment calibrated', 
 '{"steps": ["Configure transmitter power", "Measure output power", "Verify spectral mask compliance", "Check spurious emissions"]}'::jsonb),

('GCF-004', 'GCF RF Receiver Sensitivity', 'Test RF receiver sensitivity performance for GCF certification', 'GCF', 'GCF', 'performance', 'advanced', 450, 'critical',
 ARRAY['GCF', 'RF', 'Receiver', 'Sensitivity', 'Performance'], 'Receiver sensitivity meets GCF requirements', 'Calibrated RF signal generator', 
 '{"steps": ["Set minimum signal level", "Verify data reception", "Measure BER/FER", "Validate sensitivity thresholds"]}'::jsonb),

('GCF-005', 'GCF Handover Conformance', 'Test handover procedures according to GCF conformance specifications', 'GCF', 'GCF', 'conformance', 'intermediate', 420, 'high',
 ARRAY['GCF', 'Handover', 'Mobility', 'Conformance', '3GPP'], 'Handover completed successfully within time limits', 'Multi-cell test environment', 
 '{"steps": ["Establish connection in source cell", "Trigger handover", "Verify handover execution", "Confirm connection in target cell"]}'::jsonb),

-- PTCRB Test Cases  
('PTCRB-001', 'PTCRB RRC Protocol Conformance', 'Test RRC protocol conformance for PTCRB North American carrier certification', 'PTCRB', 'PTCRB', 'conformance', 'intermediate', 350, 'high',
 ARRAY['PTCRB', 'RRC', 'Protocol', 'Conformance', 'North America'], 'RRC procedures comply with PTCRB requirements', 'PTCRB test environment setup', 
 '{"steps": ["Initialize RRC state machine", "Execute RRC procedures", "Verify protocol compliance", "Validate message sequences"]}'::jsonb),

('PTCRB-002', 'PTCRB NAS EMM Procedures', 'Test NAS EMM procedures for PTCRB carrier acceptance testing', 'PTCRB', 'PTCRB', 'conformance', 'intermediate', 320, 'high',
 ARRAY['PTCRB', 'NAS', 'EMM', 'Procedures', 'Carrier'], 'EMM procedures execute according to PTCRB specifications', 'Core network simulator', 
 '{"steps": ["Attach procedure test", "TAU procedure verification", "Detach procedure validation", "Service request testing"]}'::jsonb),

('PTCRB-003', 'PTCRB Band-Specific RF Tests', 'Test RF performance for specific frequency bands required by North American carriers', 'PTCRB', 'PTCRB', 'performance', 'expert', 720, 'critical',
 ARRAY['PTCRB', 'RF', 'Band-specific', 'Performance', 'Frequency'], 'RF performance meets band-specific PTCRB requirements', 'Multi-band RF test setup', 
 '{"steps": ["Configure band-specific parameters", "Measure transmit power per band", "Verify receive sensitivity per band", "Check intermodulation performance"]}'::jsonb),

('PTCRB-004', 'PTCRB SAR Compliance Test', 'Test Specific Absorption Rate (SAR) compliance for PTCRB certification', 'PTCRB', 'PTCRB', 'performance', 'expert', 900, 'critical',
 ARRAY['PTCRB', 'SAR', 'Compliance', 'Safety', 'Radiation'], 'SAR levels within PTCRB/FCC limits', 'SAR measurement system', 
 '{"steps": ["Setup SAR measurement phantom", "Configure maximum power transmission", "Measure SAR at multiple positions", "Verify compliance with limits"]}'::jsonb),

('PTCRB-005', 'PTCRB Spurious Emissions Test', 'Test spurious emissions compliance for PTCRB North American certification', 'PTCRB', 'PTCRB', 'performance', 'advanced', 540, 'critical',
 ARRAY['PTCRB', 'Spurious', 'Emissions', 'Compliance', 'Spectrum'], 'Spurious emissions within PTCRB limits', 'Spectrum analyzer and EMC chamber', 
 '{"steps": ["Configure transmitter for maximum power", "Measure spurious emissions across spectrum", "Apply appropriate limits per frequency", "Verify compliance margins"]}'::jsonb),

('PTCRB-006', 'PTCRB VoLTE IMS Conformance', 'Test VoLTE IMS procedures for PTCRB carrier acceptance', 'PTCRB', 'PTCRB', 'conformance', 'advanced', 480, 'high',
 ARRAY['PTCRB', 'VoLTE', 'IMS', 'Voice', 'Conformance'], 'VoLTE call setup and procedures meet PTCRB requirements', 'IMS test network', 
 '{"steps": ["IMS registration test", "VoLTE call establishment", "Voice quality verification", "Call termination procedures"]}'::jsonb),

-- Additional GCF Tests
('GCF-006', 'GCF EMC Compatibility Test', 'Test electromagnetic compatibility according to GCF certification requirements', 'GCF', 'GCF', 'performance', 'expert', 800, 'critical',
 ARRAY['GCF', 'EMC', 'Compatibility', 'Interference', 'Certification'], 'Device meets EMC compatibility requirements', 'EMC test chamber and equipment', 
 '{"steps": ["Radiated emissions test", "Conducted emissions test", "Immunity testing", "Harmonic distortion measurement"]}'::jsonb),

('GCF-007', 'GCF Interoperability Test', 'Test device interoperability with multiple network vendors for GCF certification', 'GCF', 'GCF', 'interoperability', 'advanced', 600, 'high',
 ARRAY['GCF', 'Interoperability', 'Multi-vendor', 'Network', 'Compatibility'], 'Device operates correctly with different network implementations', 'Multi-vendor test network', 
 '{"steps": ["Test with vendor A network", "Test with vendor B network", "Verify seamless operation", "Check feature compatibility"]}'::jsonb),

-- Additional PTCRB Tests
('PTCRB-007', 'PTCRB Carrier Aggregation Test', 'Test carrier aggregation functionality for PTCRB certification', 'PTCRB', 'PTCRB', 'performance', 'advanced', 420, 'high',
 ARRAY['PTCRB', 'Carrier Aggregation', 'CA', 'Performance', 'Multi-band'], 'Carrier aggregation meets PTCRB performance requirements', 'Multi-carrier test setup', 
 '{"steps": ["Configure primary carrier", "Add secondary carriers", "Verify aggregated throughput", "Test carrier management"]}'::jsonb),

('PTCRB-008', 'PTCRB Emergency Call Test', 'Test emergency call procedures for PTCRB North American certification', 'PTCRB', 'PTCRB', 'functional', 'intermediate', 300, 'critical',
 ARRAY['PTCRB', 'Emergency', '911', 'Safety', 'Call'], 'Emergency calls connect successfully per PTCRB requirements', 'Emergency services simulator', 
 '{"steps": ["Initiate emergency call", "Verify priority handling", "Check location services", "Confirm call establishment"]}'::jsonb);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_test_cases_gcf_category ON test_cases(category) WHERE category = 'GCF';
CREATE INDEX IF NOT EXISTS idx_test_cases_ptcrb_category ON test_cases(category) WHERE category = 'PTCRB';
CREATE INDEX IF NOT EXISTS idx_test_cases_gcf_protocol ON test_cases(protocol) WHERE protocol = 'GCF';
CREATE INDEX IF NOT EXISTS idx_test_cases_ptcrb_protocol ON test_cases(protocol) WHERE protocol = 'PTCRB';

-- Update any existing test suite configurations to include GCF and PTCRB
INSERT INTO test_suites (
    name, description, test_case_ids, created_by, is_active, suite_type, estimated_duration_minutes
) VALUES 
('GCF Certification Suite', 'Complete GCF certification test suite for device certification', 
 ARRAY(SELECT id FROM test_cases WHERE category = 'GCF'), 'system', true, 'certification', 480),
('PTCRB Certification Suite', 'Complete PTCRB certification test suite for North American carrier acceptance', 
 ARRAY(SELECT id FROM test_cases WHERE category = 'PTCRB'), 'system', true, 'certification', 540)
ON CONFLICT (name) DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE test_cases IS 'Test cases table now supports GCF and PTCRB certification categories as per 3GPP standards';
COMMENT ON CONSTRAINT test_cases_category_check ON test_cases IS 'Category constraint updated to include GCF and PTCRB certification categories';
COMMENT ON CONSTRAINT test_cases_protocol_check ON test_cases IS 'Protocol constraint updated to include GCF and PTCRB certification protocols';