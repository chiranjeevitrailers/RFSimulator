-- VoLTE & VoNR Database Schema
-- Comprehensive 3GPP-compliant database for VoLTE and VoNR test cases
-- Supports detailed signaling flows, IEs, and layer-wise parameters

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- VoLTE Test Cases Table
CREATE TABLE volte_test_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'CallSetup', 'CallRelease', 'CallHandover', 'Emergency', 'Supplementary'
    )),
    subcategory VARCHAR(100),
    test_type VARCHAR(50) NOT NULL CHECK (test_type IN (
        'Functional', 'Performance', 'RF', 'Stability', 'Sanity'
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

-- VoNR Test Cases Table
CREATE TABLE vonr_test_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'CallSetup', 'CallRelease', 'CallHandover', 'Emergency', 'Supplementary'
    )),
    subcategory VARCHAR(100),
    test_type VARCHAR(50) NOT NULL CHECK (test_type IN (
        'Functional', 'Performance', 'RF', 'Stability', 'Sanity'
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

-- SIP Messages Table (VoLTE/VoNR)
CREATE TABLE sip_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID, -- Can reference either volte_test_cases or vonr_test_cases
    message_id VARCHAR(50) NOT NULL,
    message_name VARCHAR(255) NOT NULL,
    message_type VARCHAR(50) NOT NULL CHECK (message_type IN (
        'INVITE', '100_Trying', '180_Ringing', '183_Session_Progress', '200_OK', 
        'ACK', 'BYE', 'CANCEL', 'REFER', 'UPDATE', 'INFO', 'MESSAGE', 'REGISTER',
        '401_Unauthorized', '403_Forbidden', '404_Not_Found', '486_Busy_Here',
        '487_Request_Terminated', '488_Not_Acceptable_Here', '500_Internal_Server_Error',
        '503_Service_Unavailable', 'NOTIFY', 'SUBSCRIBE', 'PUBLISH'
    )),
    direction VARCHAR(20) NOT NULL CHECK (direction IN (
        'UE_to_P-CSCF', 'P-CSCF_to_UE', 'P-CSCF_to_S-CSCF', 'S-CSCF_to_P-CSCF',
        'S-CSCF_to_I-CSCF', 'I-CSCF_to_S-CSCF', 'S-CSCF_to_AS', 'AS_to_S-CSCF',
        'BIDIR'
    )),
    sequence_number INTEGER NOT NULL,
    timestamp_offset_ms INTEGER DEFAULT 0,
    message_payload JSONB,
    expected_response VARCHAR(100),
    timeout_ms INTEGER DEFAULT 5000,
    validation_rules JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RTP/RTCP Messages Table
CREATE TABLE rtp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID,
    message_id VARCHAR(50) NOT NULL,
    message_name VARCHAR(255) NOT NULL,
    message_type VARCHAR(50) NOT NULL CHECK (message_type IN (
        'RTP_Audio', 'RTP_Video', 'RTCP_SR', 'RTCP_RR', 'RTCP_SDES', 'RTCP_BYE',
        'RTCP_APP', 'RTCP_XR', 'DTMF_RTP', 'DTMF_SIP'
    )),
    direction VARCHAR(20) NOT NULL CHECK (direction IN ('UL', 'DL', 'BIDIR')),
    sequence_number INTEGER NOT NULL,
    timestamp_offset_ms INTEGER DEFAULT 0,
    payload_type INTEGER,
    ssrc BIGINT,
    codec VARCHAR(50),
    bitrate INTEGER,
    packet_size INTEGER,
    validation_rules JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SDP Information Table
CREATE TABLE sdp_information (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID,
    message_id UUID REFERENCES sip_messages(id) ON DELETE CASCADE,
    sdp_type VARCHAR(50) NOT NULL CHECK (sdp_type IN ('offer', 'answer')),
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('audio', 'video', 'application')),
    codec VARCHAR(50),
    payload_type INTEGER,
    port INTEGER,
    protocol VARCHAR(20),
    bandwidth INTEGER,
    attributes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SIP Information Elements Table
CREATE TABLE sip_information_elements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID,
    message_id UUID REFERENCES sip_messages(id) ON DELETE CASCADE,
    ie_name VARCHAR(255) NOT NULL,
    ie_type VARCHAR(50) NOT NULL CHECK (ie_type IN ('MANDATORY', 'OPTIONAL', 'CONDITIONAL')),
    data_type VARCHAR(50) NOT NULL CHECK (data_type IN (
        'STRING', 'INTEGER', 'BOOLEAN', 'ENUM', 'URI', 'ADDRESS', 'TIMESTAMP'
    )),
    ie_value JSONB,
    ie_description TEXT,
    validation_rules JSONB,
    three_gpp_ref TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- VoLTE Layer Parameters Table
CREATE TABLE volte_layer_parameters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES volte_test_cases(id) ON DELETE CASCADE,
    layer VARCHAR(20) NOT NULL CHECK (layer IN (
        'PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'S1AP', 'GTP', 'IMS'
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

-- VoNR Layer Parameters Table
CREATE TABLE vonr_layer_parameters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES vonr_test_cases(id) ON DELETE CASCADE,
    layer VARCHAR(20) NOT NULL CHECK (layer IN (
        'PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'NGAP', 'PFCP', 'IMS'
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

-- VoLTE Call Flow Table
CREATE TABLE volte_call_flows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES volte_test_cases(id) ON DELETE CASCADE,
    flow_name VARCHAR(255) NOT NULL,
    flow_type VARCHAR(50) NOT NULL CHECK (flow_type IN (
        'Call_Setup', 'Call_Release', 'Call_Handover', 'Emergency', 'Supplementary'
    )),
    flow_sequence JSONB NOT NULL,
    expected_duration_ms INTEGER,
    success_criteria JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- VoNR Call Flow Table
CREATE TABLE vonr_call_flows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES vonr_test_cases(id) ON DELETE CASCADE,
    flow_name VARCHAR(255) NOT NULL,
    flow_type VARCHAR(50) NOT NULL CHECK (flow_type IN (
        'Call_Setup', 'Call_Release', 'Call_Handover', 'Emergency', 'Supplementary'
    )),
    flow_sequence JSONB NOT NULL,
    expected_duration_ms INTEGER,
    success_criteria JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Codec Configuration Table
CREATE TABLE codec_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID,
    codec_name VARCHAR(50) NOT NULL CHECK (codec_name IN (
        'AMR-NB', 'AMR-WB', 'EVS', 'G.711', 'G.722', 'G.729', 'OPUS'
    )),
    payload_type INTEGER,
    bitrate INTEGER,
    sample_rate INTEGER,
    frame_size INTEGER,
    codec_mode VARCHAR(50),
    dtx_enabled BOOLEAN DEFAULT false,
    plc_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QoS Configuration Table
CREATE TABLE qos_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID,
    qos_type VARCHAR(20) NOT NULL CHECK (qos_type IN ('QCI', '5QI')),
    qos_id INTEGER NOT NULL,
    qos_name VARCHAR(100),
    priority_level INTEGER,
    packet_delay_budget INTEGER,
    packet_error_rate DECIMAL(10,6),
    gbr_ul INTEGER,
    gbr_dl INTEGER,
    mbr_ul INTEGER,
    mbr_dl INTEGER,
    three_gpp_ref TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SRVCC Configuration Table
CREATE TABLE srvcc_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID,
    srvcc_type VARCHAR(20) NOT NULL CHECK (srvcc_type IN ('eSRVCC', 'SRVCC')),
    source_rat VARCHAR(10) NOT NULL CHECK (source_rat IN ('LTE', '5G_NR')),
    target_rat VARCHAR(10) NOT NULL CHECK (target_rat IN ('UMTS', 'GSM', 'LTE')),
    handover_type VARCHAR(20) NOT NULL CHECK (handover_type IN ('PS_to_CS', 'PS_to_PS')),
    configuration JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency Call Configuration Table
CREATE TABLE emergency_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID,
    emergency_type VARCHAR(50) NOT NULL CHECK (emergency_type IN (
        'Police', 'Fire', 'Medical', 'Maritime', 'Mountain_Rescue', 'Generic'
    )),
    emergency_number VARCHAR(20),
    location_required BOOLEAN DEFAULT true,
    priority_level INTEGER DEFAULT 1,
    psap_routing JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Metrics Table for VoLTE/VoNR
CREATE TABLE volte_vonr_performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID,
    metric_name VARCHAR(100) NOT NULL,
    metric_type VARCHAR(50) NOT NULL CHECK (metric_type IN (
        'Call_Setup_Time', 'Call_Release_Time', 'Handover_Time', 'Packet_Loss_Rate',
        'Jitter', 'Latency', 'Throughput', 'MOS_Score', 'Codec_Efficiency'
    )),
    metric_value DECIMAL(15,6),
    metric_unit VARCHAR(50),
    measurement_conditions JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Indexes for VoLTE/VoNR tables
CREATE INDEX idx_volte_test_cases_category ON volte_test_cases(category);
CREATE INDEX idx_volte_test_cases_test_type ON volte_test_cases(test_type);
CREATE INDEX idx_volte_test_cases_priority ON volte_test_cases(priority);

CREATE INDEX idx_vonr_test_cases_category ON vonr_test_cases(category);
CREATE INDEX idx_vonr_test_cases_test_type ON vonr_test_cases(test_type);
CREATE INDEX idx_vonr_test_cases_priority ON vonr_test_cases(priority);

CREATE INDEX idx_sip_messages_test_case_id ON sip_messages(test_case_id);
CREATE INDEX idx_sip_messages_message_type ON sip_messages(message_type);
CREATE INDEX idx_sip_messages_direction ON sip_messages(direction);

CREATE INDEX idx_rtp_messages_test_case_id ON rtp_messages(test_case_id);
CREATE INDEX idx_rtp_messages_message_type ON rtp_messages(message_type);
CREATE INDEX idx_rtp_messages_codec ON rtp_messages(codec);

CREATE INDEX idx_sdp_information_test_case_id ON sdp_information(test_case_id);
CREATE INDEX idx_sdp_information_media_type ON sdp_information(media_type);
CREATE INDEX idx_sdp_information_codec ON sdp_information(codec);

CREATE INDEX idx_sip_information_elements_test_case_id ON sip_information_elements(test_case_id);
CREATE INDEX idx_sip_information_elements_ie_name ON sip_information_elements(ie_name);
CREATE INDEX idx_sip_information_elements_ie_type ON sip_information_elements(ie_type);

CREATE INDEX idx_volte_layer_parameters_test_case_id ON volte_layer_parameters(test_case_id);
CREATE INDEX idx_volte_layer_parameters_layer ON volte_layer_parameters(layer);
CREATE INDEX idx_volte_layer_parameters_parameter_type ON volte_layer_parameters(parameter_type);

CREATE INDEX idx_vonr_layer_parameters_test_case_id ON vonr_layer_parameters(test_case_id);
CREATE INDEX idx_vonr_layer_parameters_layer ON vonr_layer_parameters(layer);
CREATE INDEX idx_vonr_layer_parameters_parameter_type ON vonr_layer_parameters(parameter_type);

CREATE INDEX idx_codec_configurations_test_case_id ON codec_configurations(test_case_id);
CREATE INDEX idx_codec_configurations_codec_name ON codec_configurations(codec_name);

CREATE INDEX idx_qos_configurations_test_case_id ON qos_configurations(test_case_id);
CREATE INDEX idx_qos_configurations_qos_type ON qos_configurations(qos_type);

CREATE INDEX idx_srvcc_configurations_test_case_id ON srvcc_configurations(test_case_id);
CREATE INDEX idx_srvcc_configurations_srvcc_type ON srvcc_configurations(srvcc_type);

CREATE INDEX idx_emergency_configurations_test_case_id ON emergency_configurations(test_case_id);
CREATE INDEX idx_emergency_configurations_emergency_type ON emergency_configurations(emergency_type);

CREATE INDEX idx_volte_vonr_performance_metrics_test_case_id ON volte_vonr_performance_metrics(test_case_id);
CREATE INDEX idx_volte_vonr_performance_metrics_metric_type ON volte_vonr_performance_metrics(metric_type);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_volte_test_cases_updated_at BEFORE UPDATE ON volte_test_cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vonr_test_cases_updated_at BEFORE UPDATE ON vonr_test_cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views for easier querying
CREATE VIEW volte_test_summary AS
SELECT 
    vtc.id,
    vtc.test_case_id,
    vtc.name,
    vtc.category,
    vtc.subcategory,
    vtc.test_type,
    vtc.complexity,
    vtc.priority,
    vtc.estimated_duration,
    vtc.three_gpp_ref,
    COUNT(sm.id) as sip_message_count,
    COUNT(rm.id) as rtp_message_count,
    COUNT(vlp.id) as layer_parameter_count
FROM volte_test_cases vtc
LEFT JOIN sip_messages sm ON vtc.id = sm.test_case_id
LEFT JOIN rtp_messages rm ON vtc.id = rm.test_case_id
LEFT JOIN volte_layer_parameters vlp ON vtc.id = vlp.test_case_id
GROUP BY vtc.id, vtc.test_case_id, vtc.name, vtc.category, vtc.subcategory, 
         vtc.test_type, vtc.complexity, vtc.priority, vtc.estimated_duration, vtc.three_gpp_ref;

CREATE VIEW vonr_test_summary AS
SELECT 
    vntc.id,
    vntc.test_case_id,
    vntc.name,
    vntc.category,
    vntc.subcategory,
    vntc.test_type,
    vntc.complexity,
    vntc.priority,
    vntc.estimated_duration,
    vntc.three_gpp_ref,
    COUNT(sm.id) as sip_message_count,
    COUNT(rm.id) as rtp_message_count,
    COUNT(vnlp.id) as layer_parameter_count
FROM vonr_test_cases vntc
LEFT JOIN sip_messages sm ON vntc.id = sm.test_case_id
LEFT JOIN rtp_messages rm ON vntc.id = rm.test_case_id
LEFT JOIN vonr_layer_parameters vnlp ON vntc.id = vnlp.test_case_id
GROUP BY vntc.id, vntc.test_case_id, vntc.name, vntc.category, vntc.subcategory, 
         vntc.test_type, vntc.complexity, vntc.priority, vntc.estimated_duration, vntc.three_gpp_ref;

-- Row Level Security (RLS) policies
ALTER TABLE volte_test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE vonr_test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE sip_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE rtp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sdp_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE sip_information_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE volte_layer_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE vonr_layer_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE volte_call_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE vonr_call_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE codec_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE qos_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE srvcc_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE volte_vonr_performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access to volte_test_cases" ON volte_test_cases FOR SELECT USING (true);
CREATE POLICY "Allow public read access to vonr_test_cases" ON vonr_test_cases FOR SELECT USING (true);
CREATE POLICY "Allow public read access to sip_messages" ON sip_messages FOR SELECT USING (true);
CREATE POLICY "Allow public read access to rtp_messages" ON rtp_messages FOR SELECT USING (true);
CREATE POLICY "Allow public read access to sdp_information" ON sdp_information FOR SELECT USING (true);
CREATE POLICY "Allow public read access to sip_information_elements" ON sip_information_elements FOR SELECT USING (true);
CREATE POLICY "Allow public read access to volte_layer_parameters" ON volte_layer_parameters FOR SELECT USING (true);
CREATE POLICY "Allow public read access to vonr_layer_parameters" ON vonr_layer_parameters FOR SELECT USING (true);
CREATE POLICY "Allow public read access to volte_call_flows" ON volte_call_flows FOR SELECT USING (true);
CREATE POLICY "Allow public read access to vonr_call_flows" ON vonr_call_flows FOR SELECT USING (true);
CREATE POLICY "Allow public read access to codec_configurations" ON codec_configurations FOR SELECT USING (true);
CREATE POLICY "Allow public read access to qos_configurations" ON qos_configurations FOR SELECT USING (true);
CREATE POLICY "Allow public read access to srvcc_configurations" ON srvcc_configurations FOR SELECT USING (true);
CREATE POLICY "Allow public read access to emergency_configurations" ON emergency_configurations FOR SELECT USING (true);
CREATE POLICY "Allow public read access to volte_vonr_performance_metrics" ON volte_vonr_performance_metrics FOR SELECT USING (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Sample data insertion for VoLTE test case
INSERT INTO volte_test_cases (
    test_case_id, name, description, category, subcategory, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES (
    'VoLTE-CS-001', 
    'Basic VoLTE call establishment between two UEs', 
    'Basic VoLTE call establishment between two UEs', 
    'CallSetup', 
    'Basic_Call_Setup', 
    'Functional', 
    'intermediate', 
    'high', 
    120,
    'Both UEs IMS-registered, QoS and EPS bearer (QCI=1) available',
    '1. UE A SIP INVITE->P-CSCF;2. P-CSCF->S-CSCF routing->P-CSCF->UE B INVITE;3. UE B 180/200 OK->ACK;4. RTP path established',
    'SDP with audio codecs,From,To,Call-ID,CSeq,Contact,Via,Supported',
    'PHY:RSRP>-100dBm,RRC:SRB/DRB for IMS,MAC:HARQ,RLC:AM/UM config,PDCP:ciphering,NAS:EPS Bearer ID,QCI=1,IMS:SIP signaling,SDP audio codecs',
    'Bidirectional RTP audio',
    'TS 24.229,TS 23.228'
);

-- Sample data insertion for VoNR test case
INSERT INTO vonr_test_cases (
    test_case_id, name, description, category, subcategory, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES (
    'VoNR-CS-001', 
    'Native 5G NR VoNR call establishment', 
    'Native 5G NR VoNR call establishment', 
    'CallSetup', 
    'Basic_Call_Setup', 
    'Functional', 
    'advanced', 
    'high', 
    150,
    'UE registered to 5G IMS,5QI=1 slice available',
    '1.UE establishes PDU session (5G QoS);2.IMS REGISTER if not done;3.SIP INVITE->200 OK->ACK',
    'SDP,5QI,QFI,PDU Session ID,DNN',
    'PHY:SSB,NR RSRP,MAC scheduling,RLC/PDCP settings,PDCP ciphering,NAS:5G-GUTI,PDU session params',
    'Bidirectional RTP over NR with conversational QoS',
    'TS 23.501,TS 24.501'
);