-- Comprehensive Layer Views - Supabase Schema Extensions
-- Additional tables and data for comprehensive layer analysis

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Layer Statistics Table (for real-time layer analysis)
CREATE TABLE layer_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    layer TEXT NOT NULL CHECK (layer IN ('PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS')),
    metric_name TEXT NOT NULL,
    metric_value NUMERIC,
    metric_unit TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    meta JSONB DEFAULT '{}'
);

-- 2. UE Device Status Table (for UE analysis)
CREATE TABLE ue_device_status (
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

-- 3. Signal Quality Measurements Table
CREATE TABLE signal_quality (
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

-- 4. MIMO Configuration Table
CREATE TABLE mimo_configuration (
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

-- 5. HARQ Statistics Table
CREATE TABLE harq_statistics (
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

-- 6. Buffer Status Table
CREATE TABLE buffer_status (
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

-- 7. Performance Metrics Table
CREATE TABLE performance_metrics (
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

-- Indexes for performance
CREATE INDEX idx_layer_statistics_session_id ON layer_statistics(session_id);
CREATE INDEX idx_layer_statistics_layer ON layer_statistics(layer);
CREATE INDEX idx_layer_statistics_timestamp ON layer_statistics(timestamp DESC);
CREATE INDEX idx_ue_device_status_session_id ON ue_device_status(session_id);
CREATE INDEX idx_ue_device_status_timestamp ON ue_device_status(timestamp DESC);
CREATE INDEX idx_signal_quality_session_id ON signal_quality(session_id);
CREATE INDEX idx_signal_quality_timestamp ON signal_quality(timestamp DESC);
CREATE INDEX idx_mimo_configuration_session_id ON mimo_configuration(session_id);
CREATE INDEX idx_harq_statistics_session_id ON harq_statistics(session_id);
CREATE INDEX idx_buffer_status_session_id ON buffer_status(session_id);
CREATE INDEX idx_performance_metrics_session_id ON performance_metrics(session_id);

-- Row Level Security (RLS) policies
ALTER TABLE layer_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ue_device_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_quality ENABLE ROW LEVEL SECURITY;
ALTER TABLE mimo_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE harq_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE buffer_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all for now)
CREATE POLICY "Allow all operations on layer_statistics" ON layer_statistics FOR ALL USING (true);
CREATE POLICY "Allow all operations on ue_device_status" ON ue_device_status FOR ALL USING (true);
CREATE POLICY "Allow all operations on signal_quality" ON signal_quality FOR ALL USING (true);
CREATE POLICY "Allow all operations on mimo_configuration" ON mimo_configuration FOR ALL USING (true);
CREATE POLICY "Allow all operations on harq_statistics" ON harq_statistics FOR ALL USING (true);
CREATE POLICY "Allow all operations on buffer_status" ON buffer_status FOR ALL USING (true);
CREATE POLICY "Allow all operations on performance_metrics" ON performance_metrics FOR ALL USING (true);

-- Insert sample data for testing
-- Sample UE device status
INSERT INTO ue_device_status (session_id, ue_profile_id, battery_level, thermal_state, mobility_state, velocity, direction, location, capabilities) VALUES
(
    (SELECT id FROM sessions LIMIT 1),
    'ue_iphone14_01',
    85,
    'NORMAL',
    'STATIONARY',
    0,
    0,
    '{"latitude": 37.7749, "longitude": -122.4194, "accuracy": 5.0}',
    '{"mimo_capability": 2, "ca_capable": true, "ca_bands": ["B1", "B3", "B7"], "beamforming_capable": true}'
);

-- Sample signal quality data
INSERT INTO signal_quality (session_id, rsrp, rsrq, sinr, cqi, ri, pmi, pci, earfcn) VALUES
(
    (SELECT id FROM sessions LIMIT 1),
    -95.2,
    -10.5,
    15.3,
    12,
    1,
    0,
    123,
    1850
);

-- Sample MIMO configuration
INSERT INTO mimo_configuration (session_id, mimo_layers, mimo_mode, precoding_matrix, transmission_mode, antenna_ports, beamforming, channel_rank) VALUES
(
    (SELECT id FROM sessions LIMIT 1),
    2,
    'MULTI_LAYER',
    1,
    4,
    2,
    true,
    2
);

-- Sample HARQ statistics
INSERT INTO harq_statistics (session_id, harq_process_id, redundancy_version, new_data_indicator, ack_nack, retransmission_count, max_retransmissions, success_rate) VALUES
(
    (SELECT id FROM sessions LIMIT 1),
    0,
    0,
    true,
    'ACK',
    0,
    4,
    1.0
);

-- Sample buffer status
INSERT INTO buffer_status (session_id, layer, buffer_type, buffer_size, buffer_utilization, overflow_count, underflow_count) VALUES
(
    (SELECT id FROM sessions LIMIT 1),
    'RLC',
    'TX',
    1024,
    0.15,
    0,
    0
),
(
    (SELECT id FROM sessions LIMIT 1),
    'RLC',
    'RX',
    1024,
    0.12,
    0,
    0
);

-- Sample performance metrics
INSERT INTO performance_metrics (session_id, layer, throughput_dl, throughput_ul, latency, jitter, packet_loss_rate, error_rate) VALUES
(
    (SELECT id FROM sessions LIMIT 1),
    'PHY',
    45.2,
    12.8,
    15.3,
    2.1,
    0.001,
    0.005
),
(
    (SELECT id FROM sessions LIMIT 1),
    'MAC',
    44.8,
    12.5,
    16.1,
    2.3,
    0.002,
    0.008
),
(
    (SELECT id FROM sessions LIMIT 1),
    'RLC',
    44.5,
    12.2,
    17.2,
    2.5,
    0.003,
    0.012
);

-- Sample layer statistics
INSERT INTO layer_statistics (session_id, layer, metric_name, metric_value, metric_unit, meta) VALUES
-- PHY Layer Statistics
((SELECT id FROM sessions LIMIT 1), 'PHY', 'rsrp', -95.2, 'dBm', '{"trend": "stable"}'),
((SELECT id FROM sessions LIMIT 1), 'PHY', 'rsrq', -10.5, 'dB', '{"trend": "stable"}'),
((SELECT id FROM sessions LIMIT 1), 'PHY', 'sinr', 15.3, 'dB', '{"trend": "stable"}'),
((SELECT id FROM sessions LIMIT 1), 'PHY', 'cqi', 12, 'index', '{"trend": "stable"}'),
((SELECT id FROM sessions LIMIT 1), 'PHY', 'pci', 123, 'id', '{"trend": "stable"}'),
((SELECT id FROM sessions LIMIT 1), 'PHY', 'mimo_layers', 2, 'layers', '{"trend": "stable"}'),
((SELECT id FROM sessions LIMIT 1), 'PHY', 'mcs_index', 15, 'index', '{"trend": "stable"}'),

-- MAC Layer Statistics
((SELECT id FROM sessions LIMIT 1), 'MAC', 'harq_success_rate', 0.98, 'ratio', '{"trend": "stable"}'),
((SELECT id FROM sessions LIMIT 1), 'MAC', 'scheduling_requests', 5, 'count', '{"trend": "increasing"}'),
((SELECT id FROM sessions LIMIT 1), 'MAC', 'power_headroom', 2.5, 'dB', '{"trend": "stable"}'),
((SELECT id FROM sessions LIMIT 1), 'MAC', 'rb_utilization', 0.05, 'ratio', '{"trend": "stable"}'),
((SELECT id FROM sessions LIMIT 1), 'MAC', 'rach_attempts', 1, 'count', '{"trend": "stable"}'),
((SELECT id FROM sessions LIMIT 1), 'MAC', 'rach_success_rate', 1.0, 'ratio', '{"trend": "stable"}'),

-- RLC Layer Statistics
((SELECT id FROM sessions LIMIT 1), 'RLC', 'tx_pdu_count', 1250, 'count', '{"trend": "increasing"}'),
((SELECT id FROM sessions LIMIT 1), 'RLC', 'rx_pdu_count', 1180, 'count', '{"trend": "increasing"}'),
((SELECT id FROM sessions LIMIT 1), 'RLC', 'duplicate_pdu_count', 2, 'count', '{"trend": "stable"}'),
((SELECT id FROM sessions LIMIT 1), 'RLC', 'out_of_order_pdu_count', 1, 'count', '{"trend": "stable"}'),
((SELECT id FROM sessions LIMIT 1), 'RLC', 'missing_pdu_count', 0, 'count', '{"trend": "stable"}'),
((SELECT id FROM sessions LIMIT 1), 'RLC', 'crc_errors', 0, 'count', '{"trend": "stable"}'),
((SELECT id FROM sessions LIMIT 1), 'RLC', 'retransmission_count', 0, 'count', '{"trend": "stable"}'),
((SELECT id FROM sessions LIMIT 1), 'RLC', 'tx_buffer_utilization', 0.15, 'ratio', '{"trend": "stable"}'),
((SELECT id FROM sessions LIMIT 1), 'RLC', 'rx_buffer_utilization', 0.12, 'ratio', '{"trend": "stable"}');

-- Create views for comprehensive layer analysis
CREATE VIEW phy_layer_summary AS
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

CREATE VIEW mac_layer_summary AS
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

CREATE VIEW rlc_layer_summary AS
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

CREATE VIEW ue_device_summary AS
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

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;
GRANT ALL ON ALL VIEWS IN SCHEMA public TO postgres;