-- Minimal Supabase Setup for 5GLabX Platform - GUARANTEED TO WORK
-- This script creates only the essential tables and will work in Supabase

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
-- PART 2: LAYER ANALYSIS TABLES
-- ==============================================

-- 7. Layer Statistics Table
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

-- 8. Signal Quality Measurements Table
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

-- 9. Performance Metrics Table
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
CREATE INDEX IF NOT EXISTS idx_events_ie_map ON events USING GIN (ie_map);
CREATE INDEX IF NOT EXISTS idx_sessions_test_case_id ON sessions(test_case_id);
CREATE INDEX IF NOT EXISTS idx_sessions_state ON sessions(session_state);
CREATE INDEX IF NOT EXISTS idx_metrics_session_id ON metrics_aggregates(session_id);
CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON metrics_aggregates(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_test_results_session_id ON test_results(session_id);
CREATE INDEX IF NOT EXISTS idx_layer_statistics_session_id ON layer_statistics(session_id);
CREATE INDEX IF NOT EXISTS idx_layer_statistics_layer ON layer_statistics(layer);
CREATE INDEX IF NOT EXISTS idx_signal_quality_session_id ON signal_quality(session_id);
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
ALTER TABLE signal_quality ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

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

-- ==============================================
-- PART 7: RLS POLICIES
-- ==============================================

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Allow all operations on ue_profiles" ON ue_profiles;
DROP POLICY IF EXISTS "Allow all operations on test_cases" ON test_cases;
DROP POLICY IF EXISTS "Allow all operations on sessions" ON sessions;
DROP POLICY IF EXISTS "Allow all operations on events" ON events;
DROP POLICY IF EXISTS "Allow all operations on metrics_aggregates" ON metrics_aggregates;
DROP POLICY IF EXISTS "Allow all operations on test_results" ON test_results;
DROP POLICY IF EXISTS "Allow all operations on layer_statistics" ON layer_statistics;
DROP POLICY IF EXISTS "Allow all operations on signal_quality" ON signal_quality;
DROP POLICY IF EXISTS "Allow all operations on performance_metrics" ON performance_metrics;

-- Create RLS policies
CREATE POLICY "Allow all operations on ue_profiles" ON ue_profiles FOR ALL USING (true);
CREATE POLICY "Allow all operations on test_cases" ON test_cases FOR ALL USING (true);
CREATE POLICY "Allow all operations on sessions" ON sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on events" ON events FOR ALL USING (true);
CREATE POLICY "Allow all operations on metrics_aggregates" ON metrics_aggregates FOR ALL USING (true);
CREATE POLICY "Allow all operations on test_results" ON test_results FOR ALL USING (true);
CREATE POLICY "Allow all operations on layer_statistics" ON layer_statistics FOR ALL USING (true);
CREATE POLICY "Allow all operations on signal_quality" ON signal_quality FOR ALL USING (true);
CREATE POLICY "Allow all operations on performance_metrics" ON performance_metrics FOR ALL USING (true);

-- ==============================================
-- COMPLETION MESSAGE
-- ==============================================

-- Display completion message
DO $$
BEGIN
    RAISE NOTICE '✅ Supabase database setup completed successfully!';
    RAISE NOTICE '📊 Created % tables for 5GLabX platform', 9;
    RAISE NOTICE '📈 All indexes and RLS policies configured';
    RAISE NOTICE '🎯 Ready for 5GLabX platform integration!';
END $$;