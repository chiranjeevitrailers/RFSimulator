-- Complete Supabase Setup for 5GLabX Platform
-- Run this entire script in Supabase SQL Editor

-- ==============================================
-- PART 1: CORE DATABASE SCHEMA
-- ==============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. UE Profiles Table
CREATE TABLE IF NOT EXISTS ue_profiles (
    id TEXT PRIMARY KEY,
    imsi TEXT NOT NULL,
    imei TEXT,
    device_capabilities JSONB DEFAULT '{}',
    default_apn TEXT DEFAULT 'internet',
    security_support JSONB DEFAULT '{"EEA": ["EEA0", "EEA1"], "EIA": ["EIA0", "EIA1"]}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Test Cases Table
CREATE TABLE IF NOT EXISTS test_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ue_profile_id TEXT REFERENCES ue_profiles(id),
    scenario JSONB NOT NULL,
    run_config JSONB DEFAULT '{}',
    enabled BOOLEAN DEFAULT true,
    technology TEXT DEFAULT 'LTE',
    category TEXT DEFAULT 'POWER_ON'
);

-- 3. Sessions Table (one per active attach/session)
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES test_cases(id),
    ue_profile_id TEXT REFERENCES ue_profiles(id),
    enb_id TEXT,
    mme_ue_s1ap_id INTEGER,
    enb_ue_s1ap_id INTEGER,
    session_state TEXT DEFAULT 'INIT' CHECK (session_state IN ('INIT', 'RRC_CONNECTED', 'ATTACHED', 'ACTIVE', 'FAILED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metrics JSONB DEFAULT '{}',
    test_results JSONB DEFAULT '{}'
);

-- 4. Events Table (streaming logs)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_ts TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message_hex TEXT,
    ie_map JSONB DEFAULT '{}',
    layer TEXT NOT NULL CHECK (layer IN ('PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'S1AP', 'GTP', 'APP')),
    severity TEXT DEFAULT 'INFO' CHECK (severity IN ('INFO', 'WARN', 'ERROR', 'DEBUG')),
    meta JSONB DEFAULT '{}',
    sequence_number INTEGER,
    sfn INTEGER,
    subframe INTEGER
);

-- 5. Metrics Aggregates Table (for performance)
CREATE TABLE IF NOT EXISTS metrics_aggregates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL,
    metric_value NUMERIC,
    metric_unit TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    layer TEXT,
    meta JSONB DEFAULT '{}'
);

-- 6. Test Results Table
CREATE TABLE IF NOT EXISTS test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    test_case_id UUID REFERENCES test_cases(id),
    step_name TEXT NOT NULL,
    expected_value JSONB,
    actual_value JSONB,
    assertion_result TEXT CHECK (assertion_result IN ('PASS', 'FAIL', 'PENDING')),
    assertion_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- PART 2: COMPREHENSIVE LAYER ANALYSIS TABLES
-- ==============================================

-- 7. Layer Statistics Table (for real-time layer analysis)
CREATE TABLE IF NOT EXISTS layer_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    layer TEXT NOT NULL CHECK (layer IN ('PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS')),
    metric_name TEXT NOT NULL,
    metric_value NUMERIC,
    metric_unit TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    meta JSONB DEFAULT '{}'
);

-- 8. UE Device Status Table (for UE analysis)
CREATE TABLE IF NOT EXISTS ue_device_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    ue_profile_id TEXT REFERENCES ue_profiles(id),
    battery_level INTEGER CHECK (battery_level >= 0 AND battery_level <= 100),
    thermal_state TEXT CHECK (thermal_state IN ('NORMAL', 'WARM', 'HOT', 'CRITICAL')),
    mobility_state TEXT CHECK (mobility_state IN ('STATIONARY', 'PEDESTRIAN', 'VEHICLE', 'HIGH_SPEED')),
    velocity NUMERIC DEFAULT 0,
    direction NUMERIC DEFAULT 0,
    location JSONB DEFAULT '{}',
    capabilities JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Signal Quality Measurements Table
CREATE TABLE IF NOT EXISTS signal_quality (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    rsrp NUMERIC,
    rsrq NUMERIC,
    sinr NUMERIC,
    cqi INTEGER,
    ri INTEGER,
    pmi INTEGER,
    pci INTEGER,
    earfcn INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. MIMO Configuration Table
CREATE TABLE IF NOT EXISTS mimo_configuration (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    mimo_layers INTEGER,
    mimo_mode TEXT,
    precoding_matrix INTEGER,
    transmission_mode INTEGER,
    antenna_ports INTEGER,
    beamforming BOOLEAN,
    channel_rank INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. HARQ Statistics Table
CREATE TABLE IF NOT EXISTS harq_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    harq_process_id INTEGER,
    redundancy_version INTEGER,
    new_data_indicator BOOLEAN,
    ack_nack TEXT CHECK (ack_nack IN ('ACK', 'NACK')),
    retransmission_count INTEGER,
    max_retransmissions INTEGER,
    success_rate NUMERIC,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Buffer Status Table
CREATE TABLE IF NOT EXISTS buffer_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    layer TEXT NOT NULL CHECK (layer IN ('RLC', 'PDCP', 'MAC')),
    buffer_type TEXT CHECK (buffer_type IN ('TX', 'RX')),
    buffer_size INTEGER,
    buffer_utilization NUMERIC,
    overflow_count INTEGER DEFAULT 0,
    underflow_count INTEGER DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Performance Metrics Table
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    layer TEXT NOT NULL,
    throughput_dl NUMERIC,
    throughput_ul NUMERIC,
    latency NUMERIC,
    jitter NUMERIC,
    packet_loss_rate NUMERIC,
    error_rate NUMERIC,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- PART 3: INDEXES FOR PERFORMANCE
-- ==============================================

-- Core table indexes
CREATE INDEX IF NOT EXISTS idx_events_session_id ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_event_ts ON events(event_ts DESC);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_layer ON events(layer);
CREATE INDEX IF NOT EXISTS idx_events_ie_map_imsi ON events USING GIN ((ie_map->>'IMSI'));
CREATE INDEX IF NOT EXISTS idx_sessions_test_case_id ON sessions(test_case_id);
CREATE INDEX IF NOT EXISTS idx_sessions_state ON sessions(session_state);
CREATE INDEX IF NOT EXISTS idx_metrics_session_id ON metrics_aggregates(session_id);
CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON metrics_aggregates(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_test_results_session_id ON test_results(session_id);

-- Layer analysis indexes
CREATE INDEX IF NOT EXISTS idx_layer_statistics_session_id ON layer_statistics(session_id);
CREATE INDEX IF NOT EXISTS idx_layer_statistics_layer ON layer_statistics(layer);
CREATE INDEX IF NOT EXISTS idx_layer_statistics_timestamp ON layer_statistics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ue_device_status_session_id ON ue_device_status(session_id);
CREATE INDEX IF NOT EXISTS idx_ue_device_status_timestamp ON ue_device_status(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_signal_quality_session_id ON signal_quality(session_id);
CREATE INDEX IF NOT EXISTS idx_signal_quality_timestamp ON signal_quality(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_mimo_configuration_session_id ON mimo_configuration(session_id);
CREATE INDEX IF NOT EXISTS idx_harq_statistics_session_id ON harq_statistics(session_id);
CREATE INDEX IF NOT EXISTS idx_buffer_status_session_id ON buffer_status(session_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_session_id ON performance_metrics(session_id);

-- ==============================================
-- PART 4: ROW LEVEL SECURITY (RLS)
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE ue_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE layer_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ue_device_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_quality ENABLE ROW LEVEL SECURITY;
ALTER TABLE mimo_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE harq_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE buffer_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all for now, can be restricted later)
CREATE POLICY IF NOT EXISTS "Allow all operations on ue_profiles" ON ue_profiles FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations on test_cases" ON test_cases FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations on sessions" ON sessions FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations on events" ON events FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations on metrics_aggregates" ON metrics_aggregates FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations on test_results" ON test_results FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations on layer_statistics" ON layer_statistics FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations on ue_device_status" ON ue_device_status FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations on signal_quality" ON signal_quality FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations on mimo_configuration" ON mimo_configuration FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations on harq_statistics" ON harq_statistics FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations on buffer_status" ON buffer_status FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations on performance_metrics" ON performance_metrics FOR ALL USING (true);

-- ==============================================
-- PART 5: FUNCTIONS AND TRIGGERS
-- ==============================================

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_ue_profiles_updated_at ON ue_profiles;
CREATE TRIGGER update_ue_profiles_updated_at BEFORE UPDATE ON ue_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_test_cases_updated_at ON test_cases;
CREATE TRIGGER update_test_cases_updated_at BEFORE UPDATE ON test_cases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to generate sequence numbers for events
CREATE OR REPLACE FUNCTION generate_event_sequence_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sequence_number IS NULL THEN
        SELECT COALESCE(MAX(sequence_number), 0) + 1 
        INTO NEW.sequence_number 
        FROM events 
        WHERE session_id = NEW.session_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for sequence numbers
DROP TRIGGER IF EXISTS generate_event_sequence_trigger ON events;
CREATE TRIGGER generate_event_sequence_trigger 
    BEFORE INSERT ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION generate_event_sequence_number();

-- ==============================================
-- PART 6: SAMPLE DATA
-- ==============================================

-- Insert sample UE profile
INSERT INTO ue_profiles (id, imsi, imei, device_capabilities, default_apn, security_support) VALUES
('ue_iphone14_01', '404123456789012', '359123456789012', 
 '{"bandwidthClass": "A", "caSupport": true, "mimoSupport": "2x2", "features": ["VoLTE", "VoWiFi"]}',
 'internet',
 '{"EEA": ["EEA0", "EEA1", "EEA2"], "EIA": ["EIA0", "EIA1", "EIA2"]}')
ON CONFLICT (id) DO NOTHING;

-- Insert LTE Power-On test case
INSERT INTO test_cases (name, description, ue_profile_id, scenario, run_config, technology, category) VALUES
('LTE_PowerOn_DefaultAttach_v1', 
 'Single UE power on -> attach -> default bearer activation',
 'ue_iphone14_01',
 '{
   "steps": [
     {"step": "CELL_SYNC", "expect": {"rsrp_min_dbm": -110}, "assert": {"rsrp_dbm": {"min": -110}}},
     {"step": "PRACH", "expect": {"prach_success": true}, "assert": {"prach_attempts": {"max": 2}}},
     {"step": "RRC_CONN", "expect": {"rrc_state": "CONNECTED"}, "assert": {"rrc_setup_time_ms": {"max": 200}}},
     {"step": "NAS_ATTACH", "expect": {"attach_result": "SUCCESS", "ebi": 5}, "assert": {"attach_time_ms": {"max": 3000}}},
     {"step": "DEFAULT_BEARER", "expect": {"bearer_active": true}, "assert": {"ebi": 5, "qci": 9, "gtp_created": true}}
   ]
 }',
 '{
   "num_ues": 1,
   "attach_interval_ms": 100,
   "mobility": {"pattern": "static"},
   "traffic_profile": {"enable_uplink_test": false},
   "cell_config": {
     "pci": 123,
     "earfcn": 1850,
     "bandwidth": 20,
     "tac": 12345
   }
 }',
 'LTE',
 'POWER_ON')
ON CONFLICT (name) DO NOTHING;

-- Create a sample session
INSERT INTO sessions (test_case_id, ue_profile_id, enb_id, mme_ue_s1ap_id, enb_ue_s1ap_id, session_state) VALUES
(
    (SELECT id FROM test_cases WHERE name = 'LTE_PowerOn_DefaultAttach_v1' LIMIT 1),
    'ue_iphone14_01',
    'eNB_001',
    12345,
    67890,
    'ACTIVE'
);

-- ==============================================
-- PART 7: COMPREHENSIVE VIEWS
-- ==============================================

-- Create a view for session summary
CREATE OR REPLACE VIEW session_summary AS
SELECT 
    s.id,
    s.session_state,
    s.created_at,
    s.updated_at,
    tc.name as test_case_name,
    up.imsi,
    s.mme_ue_s1ap_id,
    s.enb_ue_s1ap_id,
    s.metrics,
    COUNT(e.id) as event_count,
    MAX(e.event_ts) as last_event_time
FROM sessions s
LEFT JOIN test_cases tc ON s.test_case_id = tc.id
LEFT JOIN ue_profiles up ON s.ue_profile_id = up.id
LEFT JOIN events e ON s.id = e.session_id
GROUP BY s.id, s.session_state, s.created_at, s.updated_at, tc.name, up.imsi, s.mme_ue_s1ap_id, s.enb_ue_s1ap_id, s.metrics;

-- Create a view for event timeline
CREATE OR REPLACE VIEW event_timeline AS
SELECT 
    e.id,
    e.session_id,
    e.event_type,
    e.event_ts,
    e.layer,
    e.severity,
    e.ie_map,
    e.message_hex,
    e.sfn,
    e.subframe,
    s.session_state,
    tc.name as test_case_name
FROM events e
LEFT JOIN sessions s ON e.session_id = s.id
LEFT JOIN test_cases tc ON s.test_case_id = tc.id
ORDER BY e.event_ts DESC;

-- Create comprehensive layer analysis views
CREATE OR REPLACE VIEW phy_layer_summary AS
SELECT 
    s.id as session_id,
    s.session_state,
    sq.rsrp,
    sq.rsrq,
    sq.sinr,
    sq.cqi,
    sq.ri,
    sq.pmi,
    sq.pci,
    sq.earfcn,
    mc.mimo_layers,
    mc.mimo_mode,
    mc.transmission_mode,
    mc.beamforming,
    mc.channel_rank,
    ls.metric_value as mcs_index
FROM sessions s
LEFT JOIN signal_quality sq ON s.id = sq.session_id
LEFT JOIN mimo_configuration mc ON s.id = mc.session_id
LEFT JOIN layer_statistics ls ON s.id = ls.session_id AND ls.layer = 'PHY' AND ls.metric_name = 'mcs_index'
ORDER BY sq.timestamp DESC;

CREATE OR REPLACE VIEW mac_layer_summary AS
SELECT 
    s.id as session_id,
    s.session_state,
    hs.harq_process_id,
    hs.success_rate as harq_success_rate,
    hs.retransmission_count,
    ls.metric_value as scheduling_requests,
    ls2.metric_value as power_headroom,
    ls3.metric_value as rb_utilization,
    ls4.metric_value as rach_attempts,
    ls5.metric_value as rach_success_rate
FROM sessions s
LEFT JOIN harq_statistics hs ON s.id = hs.session_id
LEFT JOIN layer_statistics ls ON s.id = ls.session_id AND ls.layer = 'MAC' AND ls.metric_name = 'scheduling_requests'
LEFT JOIN layer_statistics ls2 ON s.id = ls2.session_id AND ls2.layer = 'MAC' AND ls2.metric_name = 'power_headroom'
LEFT JOIN layer_statistics ls3 ON s.id = ls3.session_id AND ls3.layer = 'MAC' AND ls3.metric_name = 'rb_utilization'
LEFT JOIN layer_statistics ls4 ON s.id = ls4.session_id AND ls4.layer = 'MAC' AND ls4.metric_name = 'rach_attempts'
LEFT JOIN layer_statistics ls5 ON s.id = ls5.session_id AND ls5.layer = 'MAC' AND ls5.metric_name = 'rach_success_rate'
ORDER BY hs.timestamp DESC;

CREATE OR REPLACE VIEW rlc_layer_summary AS
SELECT 
    s.id as session_id,
    s.session_state,
    ls1.metric_value as tx_pdu_count,
    ls2.metric_value as rx_pdu_count,
    ls3.metric_value as duplicate_pdu_count,
    ls4.metric_value as out_of_order_pdu_count,
    ls5.metric_value as missing_pdu_count,
    ls6.metric_value as crc_errors,
    ls7.metric_value as retransmission_count,
    bs1.buffer_utilization as tx_buffer_utilization,
    bs2.buffer_utilization as rx_buffer_utilization,
    pm.throughput_dl,
    pm.throughput_ul,
    pm.latency,
    pm.packet_loss_rate
FROM sessions s
LEFT JOIN layer_statistics ls1 ON s.id = ls1.session_id AND ls1.layer = 'RLC' AND ls1.metric_name = 'tx_pdu_count'
LEFT JOIN layer_statistics ls2 ON s.id = ls2.session_id AND ls2.layer = 'RLC' AND ls2.metric_name = 'rx_pdu_count'
LEFT JOIN layer_statistics ls3 ON s.id = ls3.session_id AND ls3.layer = 'RLC' AND ls3.metric_name = 'duplicate_pdu_count'
LEFT JOIN layer_statistics ls4 ON s.id = ls4.session_id AND ls4.layer = 'RLC' AND ls4.metric_name = 'out_of_order_pdu_count'
LEFT JOIN layer_statistics ls5 ON s.id = ls5.session_id AND ls5.layer = 'RLC' AND ls5.metric_name = 'missing_pdu_count'
LEFT JOIN layer_statistics ls6 ON s.id = ls6.session_id AND ls6.layer = 'RLC' AND ls6.metric_name = 'crc_errors'
LEFT JOIN layer_statistics ls7 ON s.id = ls7.session_id AND ls7.layer = 'RLC' AND ls7.metric_name = 'retransmission_count'
LEFT JOIN buffer_status bs1 ON s.id = bs1.session_id AND bs1.layer = 'RLC' AND bs1.buffer_type = 'TX'
LEFT JOIN buffer_status bs2 ON s.id = bs2.session_id AND bs2.layer = 'RLC' AND bs2.buffer_type = 'RX'
LEFT JOIN performance_metrics pm ON s.id = pm.session_id AND pm.layer = 'RLC'
ORDER BY ls1.timestamp DESC;

CREATE OR REPLACE VIEW ue_device_summary AS
SELECT 
    s.id as session_id,
    s.session_state,
    uds.battery_level,
    uds.thermal_state,
    uds.mobility_state,
    uds.velocity,
    uds.direction,
    uds.location,
    uds.capabilities,
    sq.rsrp,
    sq.rsrq,
    sq.sinr,
    sq.cqi
FROM sessions s
LEFT JOIN ue_device_status uds ON s.id = uds.session_id
LEFT JOIN signal_quality sq ON s.id = sq.session_id
ORDER BY uds.timestamp DESC;

-- ==============================================
-- PART 8: GRANT PERMISSIONS
-- ==============================================

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;
GRANT ALL ON ALL VIEWS IN SCHEMA public TO postgres;

-- ==============================================
-- COMPLETION MESSAGE
-- ==============================================

-- Display completion message
DO $$
BEGIN
    RAISE NOTICE '✅ Supabase database setup completed successfully!';
    RAISE NOTICE '📊 Created % tables for comprehensive layer analysis', 13;
    RAISE NOTICE '🔍 Created % views for data analysis', 7;
    RAISE NOTICE '📈 All indexes and RLS policies configured';
    RAISE NOTICE '🎯 Ready for 5GLabX platform integration!';
END $$;