-- LTE Power-On Test Procedure - Supabase Schema
-- Complete database schema for LTE Power-On test case implementation

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. UE Profiles Table
CREATE TABLE ue_profiles (
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
CREATE TABLE test_cases (
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
CREATE TABLE sessions (
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
CREATE TABLE events (
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
CREATE TABLE metrics_aggregates (
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
CREATE TABLE test_results (
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

-- Indexes for performance
CREATE INDEX idx_events_session_id ON events(session_id);
CREATE INDEX idx_events_event_ts ON events(event_ts DESC);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_layer ON events(layer);
CREATE INDEX idx_events_ie_map_imsi ON events USING GIN ((ie_map->>'IMSI'));
CREATE INDEX idx_sessions_test_case_id ON sessions(test_case_id);
CREATE INDEX idx_sessions_state ON sessions(session_state);
CREATE INDEX idx_metrics_session_id ON metrics_aggregates(session_id);
CREATE INDEX idx_metrics_timestamp ON metrics_aggregates(timestamp DESC);
CREATE INDEX idx_test_results_session_id ON test_results(session_id);

-- Row Level Security (RLS) policies
ALTER TABLE ue_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all for now, can be restricted later)
CREATE POLICY "Allow all operations on ue_profiles" ON ue_profiles FOR ALL USING (true);
CREATE POLICY "Allow all operations on test_cases" ON test_cases FOR ALL USING (true);
CREATE POLICY "Allow all operations on sessions" ON sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on events" ON events FOR ALL USING (true);
CREATE POLICY "Allow all operations on metrics_aggregates" ON metrics_aggregates FOR ALL USING (true);
CREATE POLICY "Allow all operations on test_results" ON test_results FOR ALL USING (true);

-- Insert sample UE profile
INSERT INTO ue_profiles (id, imsi, imei, device_capabilities, default_apn, security_support) VALUES
('ue_iphone14_01', '404123456789012', '359123456789012', 
 '{"bandwidthClass": "A", "caSupport": true, "mimoSupport": "2x2", "features": ["VoLTE", "VoWiFi"]}',
 'internet',
 '{"EEA": ["EEA0", "EEA1", "EEA2"], "EIA": ["EIA0", "EIA1", "EIA2"]}');

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
 'POWER_ON');

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_ue_profiles_updated_at BEFORE UPDATE ON ue_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_test_cases_updated_at BEFORE UPDATE ON test_cases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
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
CREATE TRIGGER generate_event_sequence_trigger 
    BEFORE INSERT ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION generate_event_sequence_number();

-- Create a view for session summary
CREATE VIEW session_summary AS
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
CREATE VIEW event_timeline AS
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

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;