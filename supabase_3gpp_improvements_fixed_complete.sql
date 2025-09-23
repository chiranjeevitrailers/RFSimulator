-- Update test case protocols to 3GPP standards
UPDATE test_cases 
SET protocol = CASE 
  WHEN protocol = 'E2' THEN 'O-RAN-E2'
  WHEN protocol = 'SIP' THEN 'SIP-RFC3261'
  WHEN protocol = 'VoLTE' THEN 'VoLTE-TS24229'
  WHEN protocol = 'VoNR' THEN 'VoNR-TS24229'
  WHEN protocol = 'IMS' THEN 'IMS-TS24229'
  WHEN protocol = 'PC5' THEN 'V2X-PC5-TS23303'
  WHEN protocol = 'NB-IoT' THEN 'NB-IoT-TS36331'
  WHEN protocol = 'NTN' THEN 'NTN-TS38821'
  WHEN protocol = 'Custom' THEN 'Custom-3GPP-Based'
  ELSE protocol
END
WHERE protocol IN ('E2', 'SIP', 'VoLTE', 'VoNR', 'IMS', 'PC5', 'NB-IoT', 'NTN', 'Custom');

-- Add 3GPP standard references column if not exists
ALTER TABLE test_cases 
ADD COLUMN IF NOT EXISTS standard_reference VARCHAR(100);

-- Update standard references based on protocol
UPDATE test_cases 
SET standard_reference = CASE 
  WHEN protocol LIKE '%5G-NR%' OR protocol LIKE '%NR%' THEN 'TS 38.331'
  WHEN protocol LIKE '%LTE%' THEN 'TS 36.331'
  WHEN protocol LIKE '%O-RAN%' THEN 'TS 38.463'
  WHEN protocol LIKE '%SIP%' THEN 'RFC 3261'
  WHEN protocol LIKE '%VoLTE%' OR protocol LIKE '%VoNR%' OR protocol LIKE '%IMS%' THEN 'TS 24.229'
  WHEN protocol LIKE '%V2X%' OR protocol LIKE '%PC5%' THEN 'TS 23.303'
  WHEN protocol LIKE '%NB-IoT%' THEN 'TS 36.331'
  WHEN protocol LIKE '%NTN%' THEN 'TS 38.821'
  ELSE 'Custom'
END;

-- Create enhanced test case messages table
CREATE TABLE IF NOT EXISTS test_case_messages_enhanced_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
  message_name VARCHAR(200) NOT NULL,
  message_type VARCHAR(100) NOT NULL,
  message_direction VARCHAR(10) NOT NULL CHECK (message_direction IN ('UL', 'DL')),
  message_layer VARCHAR(20) NOT NULL,
  message_protocol VARCHAR(50) NOT NULL,
  message_payload JSONB,
  standard_reference VARCHAR(100),
  step_order INTEGER,
  timestamp_ms INTEGER,
  is_3gpp_compliant BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for messages table
CREATE INDEX IF NOT EXISTS idx_test_case_messages_enhanced_v2_test_case_id 
ON test_case_messages_enhanced_v2(test_case_id);

CREATE INDEX IF NOT EXISTS idx_test_case_messages_enhanced_v2_protocol 
ON test_case_messages_enhanced_v2(message_protocol);

CREATE INDEX IF NOT EXISTS idx_test_case_messages_enhanced_v2_compliant 
ON test_case_messages_enhanced_v2(is_3gpp_compliant);

-- Create unique index for ON CONFLICT (messages)
CREATE UNIQUE INDEX IF NOT EXISTS uq_tcm_v2_case_type_step
ON test_case_messages_enhanced_v2(test_case_id, message_type, step_order);

-- Create enhanced information elements table
CREATE TABLE IF NOT EXISTS test_case_information_elements_enhanced_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
  ie_name VARCHAR(100) NOT NULL,
  ie_type VARCHAR(50) NOT NULL,
  ie_value VARCHAR(200),
  ie_size INTEGER,
  ie_unit VARCHAR(20),
  is_mandatory BOOLEAN DEFAULT false,
  standard_reference VARCHAR(100),
  is_3gpp_compliant BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for IEs table
CREATE INDEX IF NOT EXISTS idx_test_case_ies_enhanced_v2_test_case_id 
ON test_case_information_elements_enhanced_v2(test_case_id);

CREATE INDEX IF NOT EXISTS idx_test_case_ies_enhanced_v2_name 
ON test_case_information_elements_enhanced_v2(ie_name);

CREATE INDEX IF NOT EXISTS idx_test_case_ies_enhanced_v2_compliant 
ON test_case_information_elements_enhanced_v2(is_3gpp_compliant);

-- Create unique index for ON CONFLICT (IEs)
CREATE UNIQUE INDEX IF NOT EXISTS uq_tcie_v2_case_name
ON test_case_information_elements_enhanced_v2(test_case_id, ie_name);

-- Create enhanced layer parameters table
CREATE TABLE IF NOT EXISTS test_case_layer_parameters_enhanced_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
  parameter_name VARCHAR(100) NOT NULL,
  parameter_layer VARCHAR(20) NOT NULL,
  parameter_type VARCHAR(50) NOT NULL,
  parameter_value DECIMAL(10,4),
  parameter_unit VARCHAR(20),
  parameter_range_min DECIMAL(10,4),
  parameter_range_max DECIMAL(10,4),
  standard_reference VARCHAR(100),
  is_3gpp_compliant BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for parameters table
CREATE INDEX IF NOT EXISTS idx_test_case_params_enhanced_v2_test_case_id 
ON test_case_layer_parameters_enhanced_v2(test_case_id);

CREATE INDEX IF NOT EXISTS idx_test_case_params_enhanced_v2_layer 
ON test_case_layer_parameters_enhanced_v2(parameter_layer);

CREATE INDEX IF NOT EXISTS idx_test_case_params_enhanced_v2_compliant 
ON test_case_layer_parameters_enhanced_v2(is_3gpp_compliant);

-- Create unique index for ON CONFLICT (parameters)
CREATE UNIQUE INDEX IF NOT EXISTS uq_tclp_v2_case_param_layer
ON test_case_layer_parameters_enhanced_v2(test_case_id, parameter_name, parameter_layer);

-- Insert enhanced 5G-NR messages
INSERT INTO test_case_messages_enhanced_v2 (test_case_id, message_name, message_type, message_direction, message_layer, message_protocol, standard_reference, step_order, timestamp_ms, is_3gpp_compliant)
SELECT 
  tc.id,
  'RRC Setup Request',
  'RRCSetupRequest',
  'UL',
  'RRC',
  tc.protocol,
  'TS 38.331',
  1,
  1000,
  true
FROM test_cases tc 
WHERE tc.protocol LIKE '%5G-NR%' OR tc.protocol LIKE '%NR%'
ON CONFLICT (test_case_id, message_type, step_order) DO NOTHING;

INSERT INTO test_case_messages_enhanced_v2 (test_case_id, message_name, message_type, message_direction, message_layer, message_protocol, standard_reference, step_order, timestamp_ms, is_3gpp_compliant)
SELECT 
  tc.id,
  'RRC Setup',
  'RRCSetup',
  'DL',
  'RRC',
  tc.protocol,
  'TS 38.331',
  2,
  2000,
  true
FROM test_cases tc 
WHERE tc.protocol LIKE '%5G-NR%' OR tc.protocol LIKE '%NR%'
ON CONFLICT (test_case_id, message_type, step_order) DO NOTHING;

INSERT INTO test_case_messages_enhanced_v2 (test_case_id, message_name, message_type, message_direction, message_layer, message_protocol, standard_reference, step_order, timestamp_ms, is_3gpp_compliant)
SELECT 
  tc.id,
  'RRC Setup Complete',
  'RRCSetupComplete',
  'UL',
  'RRC',
  tc.protocol,
  'TS 38.331',
  3,
  3000,
  true
FROM test_cases tc 
WHERE tc.protocol LIKE '%5G-NR%' OR tc.protocol LIKE '%NR%'
ON CONFLICT (test_case_id, message_type, step_order) DO NOTHING;

-- Insert enhanced LTE messages
INSERT INTO test_case_messages_enhanced_v2 (test_case_id, message_name, message_type, message_direction, message_layer, message_protocol, standard_reference, step_order, timestamp_ms, is_3gpp_compliant)
SELECT 
  tc.id,
  'RRC Setup Request',
  'RRCSetupRequest',
  'UL',
  'RRC',
  tc.protocol,
  'TS 36.331',
  1,
  1000,
  true
FROM test_cases tc 
WHERE tc.protocol LIKE '%LTE%'
ON CONFLICT (test_case_id, message_type, step_order) DO NOTHING;

INSERT INTO test_case_messages_enhanced_v2 (test_case_id, message_name, message_type, message_direction, message_layer, message_protocol, standard_reference, step_order, timestamp_ms, is_3gpp_compliant)
SELECT 
  tc.id,
  'RRC Setup',
  'RRCSetup',
  'DL',
  'RRC',
  tc.protocol,
  'TS 36.331',
  2,
  2000,
  true
FROM test_cases tc 
WHERE tc.protocol LIKE '%LTE%'
ON CONFLICT (test_case_id, message_type, step_order) DO NOTHING;

-- Insert enhanced layer parameters
INSERT INTO test_case_layer_parameters_enhanced_v2 (test_case_id, parameter_name, parameter_layer, parameter_type, parameter_value, parameter_unit, parameter_range_min, parameter_range_max, standard_reference, is_3gpp_compliant)
SELECT 
  tc.id,
  'rrc-TransactionIdentifier',
  'RRC',
  'CONFIG',
  1,
  'integer',
  0,
  3,
  CASE WHEN tc.protocol LIKE '%5G-NR%' OR tc.protocol LIKE '%NR%' THEN 'TS 38.331' ELSE 'TS 36.331' END,
  true
FROM test_cases tc
ON CONFLICT (test_case_id, parameter_name, parameter_layer) DO NOTHING;

INSERT INTO test_case_layer_parameters_enhanced_v2 (test_case_id, parameter_name, parameter_layer, parameter_type, parameter_value, parameter_unit, parameter_range_min, parameter_range_max, standard_reference, is_3gpp_compliant)
SELECT 
  tc.id,
  'SS-RSRP',
  'PHY',
  'MEASUREMENT',
  -85,
  'dBm',
  -140,
  -44,
  'TS 38.215',
  true
FROM test_cases tc 
WHERE tc.protocol LIKE '%5G-NR%' OR tc.protocol LIKE '%NR%'
ON CONFLICT (test_case_id, parameter_name, parameter_layer) DO NOTHING;

INSERT INTO test_case_layer_parameters_enhanced_v2 (test_case_id, parameter_name, parameter_layer, parameter_type, parameter_value, parameter_unit, parameter_range_min, parameter_range_max, standard_reference, is_3gpp_compliant)
SELECT 
  tc.id,
  'SS-RSRQ',
  'PHY',
  'MEASUREMENT',
  -10,
  'dB',
  -19.5,
  -3,
  'TS 38.215',
  true
FROM test_cases tc 
WHERE tc.protocol LIKE '%5G-NR%' OR tc.protocol LIKE '%NR%'
ON CONFLICT (test_case_id, parameter_name, parameter_layer) DO NOTHING;

INSERT INTO test_case_layer_parameters_enhanced_v2 (test_case_id, parameter_name, parameter_layer, parameter_type, parameter_value, parameter_unit, parameter_range_min, parameter_range_max, standard_reference, is_3gpp_compliant)
SELECT 
  tc.id,
  'SS-SINR',
  'PHY',
  'MEASUREMENT',
  15,
  'dB',
  -23,
  40,
  'TS 38.215',
  true
FROM test_cases tc 
WHERE tc.protocol LIKE '%5G-NR%' OR tc.protocol LIKE '%NR%'
ON CONFLICT (test_case_id, parameter_name, parameter_layer) DO NOTHING;

INSERT INTO test_case_layer_parameters_enhanced_v2 (test_case_id, parameter_name, parameter_layer, parameter_type, parameter_value, parameter_unit, parameter_range_min, parameter_range_max, standard_reference, is_3gpp_compliant)
SELECT 
  tc.id,
  'RSRP',
  'PHY',
  'MEASUREMENT',
  -85,
  'dBm',
  -140,
  -44,
  'TS 36.214',
  true
FROM test_cases tc 
WHERE tc.protocol LIKE '%LTE%'
ON CONFLICT (test_case_id, parameter_name, parameter_layer) DO NOTHING;

INSERT INTO test_case_layer_parameters_enhanced_v2 (test_case_id, parameter_name, parameter_layer, parameter_type, parameter_value, parameter_unit, parameter_range_min, parameter_range_max, standard_reference, is_3gpp_compliant)
SELECT 
  tc.id,
  'RSRQ',
  'PHY',
  'MEASUREMENT',
  -10,
  'dB',
  -19.5,
  -3,
  'TS 36.214',
  true
FROM test_cases tc 
WHERE tc.protocol LIKE '%LTE%'
ON CONFLICT (test_case_id, parameter_name, parameter_layer) DO NOTHING;

-- Insert enhanced information elements
INSERT INTO test_case_information_elements_enhanced_v2 (test_case_id, ie_name, ie_type, ie_value, ie_size, is_mandatory, standard_reference, is_3gpp_compliant)
SELECT 
  tc.id,
  'ue-Identity',
  'BIT_STRING',
  '0x12345678',
  32,
  true,
  CASE WHEN tc.protocol LIKE '%5G-NR%' OR tc.protocol LIKE '%NR%' THEN 'TS 38.331' ELSE 'TS 36.331' END,
  true
FROM test_cases tc
ON CONFLICT (test_case_id, ie_name) DO NOTHING;

INSERT INTO test_case_information_elements_enhanced_v2 (test_case_id, ie_name, ie_type, ie_value, ie_size, is_mandatory, standard_reference, is_3gpp_compliant)
SELECT 
  tc.id,
  'establishmentCause',
  'ENUMERATED',
  'mo-Data',
  8,
  true,
  CASE WHEN tc.protocol LIKE '%5G-NR%' OR tc.protocol LIKE '%NR%' THEN 'TS 38.331' ELSE 'TS 36.331' END,
  true
FROM test_cases tc
ON CONFLICT (test_case_id, ie_name) DO NOTHING;

INSERT INTO test_case_information_elements_enhanced_v2 (test_case_id, ie_name, ie_type, ie_value, ie_size, is_mandatory, standard_reference, is_3gpp_compliant)
SELECT 
  tc.id,
  'rrc-TransactionIdentifier',
  'INTEGER',
  '1',
  8,
  true,
  CASE WHEN tc.protocol LIKE '%5G-NR%' OR tc.protocol LIKE '%NR%' THEN 'TS 38.331' ELSE 'TS 36.331' END,
  true
FROM test_cases tc
ON CONFLICT (test_case_id, ie_name) DO NOTHING;

-- Views (drop and recreate, avoiding duplicate columns)
DROP VIEW IF EXISTS test_cases_3gpp_compliance_v2;
DROP VIEW IF EXISTS test_cases_enhanced_v2;

CREATE OR REPLACE VIEW test_cases_enhanced_v2 AS
SELECT
  tc.*,
  COUNT(DISTINCT tcm.id) AS message_count,
  COUNT(DISTINCT tcie.id) AS ie_count,
  COUNT(DISTINCT tclp.id) AS parameter_count,
  BOOL_AND(COALESCE(tcm.is_3gpp_compliant, true)) AS messages_3gpp_compliant,
  BOOL_AND(COALESCE(tcie.is_3gpp_compliant, true)) AS ies_3gpp_compliant,
  BOOL_AND(COALESCE(tclp.is_3gpp_compliant, true)) AS parameters_3gpp_compliant
FROM test_cases tc
LEFT JOIN test_case_messages_enhanced_v2 tcm ON tc.id = tcm.test_case_id
LEFT JOIN test_case_information_elements_enhanced_v2 tcie ON tc.id = tcie.test_case_id
LEFT JOIN test_case_layer_parameters_enhanced_v2 tclp ON tc.id = tclp.test_case_id
GROUP BY tc.id;

CREATE OR REPLACE VIEW test_cases_3gpp_compliance_v2 AS
SELECT
  protocol,
  category,
  COUNT(*) AS total_test_cases,
  COUNT(*) FILTER (WHERE messages_3gpp_compliant = true) AS compliant_messages,
  COUNT(*) FILTER (WHERE ies_3gpp_compliant = true) AS compliant_ies,
  COUNT(*) FILTER (WHERE parameters_3gpp_compliant = true) AS compliant_parameters,
  ROUND(
    (COUNT(*) FILTER (WHERE messages_3gpp_compliant = true
                      AND ies_3gpp_compliant = true
                      AND parameters_3gpp_compliant = true) * 100.0 / COUNT(*)), 2
  ) AS overall_compliance_percentage
FROM test_cases_enhanced_v2
GROUP BY protocol, category
ORDER BY overall_compliance_percentage DESC;

