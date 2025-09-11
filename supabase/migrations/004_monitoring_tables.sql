-- Monitoring and Alerting Tables Migration
-- This migration creates tables for system monitoring, alerting, and health checks

-- System Metrics Table
CREATE TABLE IF NOT EXISTS system_metrics (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    cpu_usage DECIMAL(5,2) NOT NULL,
    memory_usage DECIMAL(5,2) NOT NULL,
    disk_usage DECIMAL(5,2) NOT NULL,
    network_bytes_in BIGINT NOT NULL DEFAULT 0,
    network_bytes_out BIGINT NOT NULL DEFAULT 0,
    database_connections INTEGER NOT NULL DEFAULT 0,
    application_requests INTEGER NOT NULL DEFAULT 0,
    application_response_time DECIMAL(10,2) NOT NULL DEFAULT 0,
    application_error_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Alert Rules Table
CREATE TABLE IF NOT EXISTS alert_rules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    metric TEXT NOT NULL,
    condition TEXT NOT NULL CHECK (condition IN ('greater_than', 'less_than', 'equals', 'not_equals')),
    threshold DECIMAL(10,2) NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    cooldown INTEGER NOT NULL DEFAULT 5, -- minutes
    notification_channels TEXT[] NOT NULL DEFAULT '{}',
    tags TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    rule_id TEXT NOT NULL REFERENCES alert_rules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL CHECK (status IN ('active', 'resolved', 'acknowledged')) DEFAULT 'active',
    triggered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    acknowledged_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    metadata JSONB NOT NULL DEFAULT '{}',
    notifications JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Notification Channels Table
CREATE TABLE IF NOT EXISTS notification_channels (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('email', 'slack', 'webhook', 'sms')),
    config JSONB NOT NULL DEFAULT '{}',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Health Checks Table
CREATE TABLE IF NOT EXISTS health_checks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('http', 'tcp', 'database', 'custom')),
    config JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL CHECK (status IN ('healthy', 'unhealthy', 'unknown')) DEFAULT 'unknown',
    last_check TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    response_time INTEGER NOT NULL DEFAULT 0, -- milliseconds
    error TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Monitoring Configuration Table
CREATE TABLE IF NOT EXISTS monitoring_config (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp ON system_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_metrics_cpu_usage ON system_metrics(cpu_usage);
CREATE INDEX IF NOT EXISTS idx_system_metrics_memory_usage ON system_metrics(memory_usage);
CREATE INDEX IF NOT EXISTS idx_system_metrics_disk_usage ON system_metrics(disk_usage);

CREATE INDEX IF NOT EXISTS idx_alert_rules_enabled ON alert_rules(enabled);
CREATE INDEX IF NOT EXISTS idx_alert_rules_severity ON alert_rules(severity);
CREATE INDEX IF NOT EXISTS idx_alert_rules_metric ON alert_rules(metric);
CREATE INDEX IF NOT EXISTS idx_alert_rules_created_at ON alert_rules(created_at);

CREATE INDEX IF NOT EXISTS idx_alerts_rule_id ON alerts(rule_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_triggered_at ON alerts(triggered_at);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved_at ON alerts(resolved_at);

CREATE INDEX IF NOT EXISTS idx_notification_channels_type ON notification_channels(type);
CREATE INDEX IF NOT EXISTS idx_notification_channels_enabled ON notification_channels(enabled);

CREATE INDEX IF NOT EXISTS idx_health_checks_type ON health_checks(type);
CREATE INDEX IF NOT EXISTS idx_health_checks_status ON health_checks(status);
CREATE INDEX IF NOT EXISTS idx_health_checks_last_check ON health_checks(last_check);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_alert_rules_updated_at 
    BEFORE UPDATE ON alert_rules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_channels_updated_at 
    BEFORE UPDATE ON notification_channels 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_checks_updated_at 
    BEFORE UPDATE ON health_checks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monitoring_config_updated_at 
    BEFORE UPDATE ON monitoring_config 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_config ENABLE ROW LEVEL SECURITY;

-- System Metrics RLS Policies
CREATE POLICY "Admins can view all system metrics" ON system_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can insert metrics" ON system_metrics
    FOR INSERT WITH CHECK (true);

-- Alert Rules RLS Policies
CREATE POLICY "Admins can manage alert rules" ON alert_rules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Alerts RLS Policies
CREATE POLICY "Admins can view all alerts" ON alerts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can insert alerts" ON alerts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update alerts" ON alerts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Notification Channels RLS Policies
CREATE POLICY "Admins can manage notification channels" ON notification_channels
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Health Checks RLS Policies
CREATE POLICY "Admins can manage health checks" ON health_checks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Monitoring Config RLS Policies
CREATE POLICY "Admins can manage monitoring config" ON monitoring_config
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Insert default monitoring configuration
INSERT INTO monitoring_config (key, value, description) VALUES
(
    'metrics_interval',
    '30',
    'Interval in seconds for collecting system metrics'
),
(
    'health_check_interval',
    '60',
    'Interval in seconds for running health checks'
),
(
    'alert_evaluation_interval',
    '60',
    'Interval in seconds for evaluating alert rules'
),
(
    'retention_period',
    '30',
    'Number of days to retain metrics data'
),
(
    'enable_real_time',
    'true',
    'Enable real-time monitoring'
),
(
    'enable_historical_data',
    'true',
    'Enable historical data storage'
),
(
    'max_metrics_per_batch',
    '100',
    'Maximum number of metrics to process in a batch'
)
ON CONFLICT (key) DO NOTHING;

-- Create function to clean up old metrics
CREATE OR REPLACE FUNCTION cleanup_old_metrics()
RETURNS void AS $$
DECLARE
    retention_days INTEGER;
BEGIN
    -- Get retention period from config
    SELECT (value::text)::INTEGER INTO retention_days
    FROM monitoring_config 
    WHERE key = 'retention_period';
    
    -- Default to 30 days if not found
    IF retention_days IS NULL THEN
        retention_days := 30;
    END IF;
    
    -- Delete old metrics
    DELETE FROM system_metrics 
    WHERE timestamp < NOW() - INTERVAL '1 day' * retention_days;
    
    -- Delete old resolved alerts
    DELETE FROM alerts 
    WHERE status = 'resolved' 
    AND resolved_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Create function to get system metrics summary
CREATE OR REPLACE FUNCTION get_system_metrics_summary(hours INTEGER DEFAULT 24)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'totalMetrics', (SELECT COUNT(*) FROM system_metrics WHERE timestamp > NOW() - INTERVAL '1 hour' * hours),
        'avgCpuUsage', (SELECT AVG(cpu_usage) FROM system_metrics WHERE timestamp > NOW() - INTERVAL '1 hour' * hours),
        'avgMemoryUsage', (SELECT AVG(memory_usage) FROM system_metrics WHERE timestamp > NOW() - INTERVAL '1 hour' * hours),
        'avgDiskUsage', (SELECT AVG(disk_usage) FROM system_metrics WHERE timestamp > NOW() - INTERVAL '1 hour' * hours),
        'maxCpuUsage', (SELECT MAX(cpu_usage) FROM system_metrics WHERE timestamp > NOW() - INTERVAL '1 hour' * hours),
        'maxMemoryUsage', (SELECT MAX(memory_usage) FROM system_metrics WHERE timestamp > NOW() - INTERVAL '1 hour' * hours),
        'maxDiskUsage', (SELECT MAX(disk_usage) FROM system_metrics WHERE timestamp > NOW() - INTERVAL '1 hour' * hours),
        'totalNetworkBytes', (
            SELECT SUM(network_bytes_in + network_bytes_out) 
            FROM system_metrics 
            WHERE timestamp > NOW() - INTERVAL '1 hour' * hours
        ),
        'avgResponseTime', (SELECT AVG(application_response_time) FROM system_metrics WHERE timestamp > NOW() - INTERVAL '1 hour' * hours),
        'avgErrorRate', (SELECT AVG(application_error_rate) FROM system_metrics WHERE timestamp > NOW() - INTERVAL '1 hour' * hours)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to get alert statistics
CREATE OR REPLACE FUNCTION get_alert_statistics(days INTEGER DEFAULT 7)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'totalAlerts', (SELECT COUNT(*) FROM alerts WHERE triggered_at > NOW() - INTERVAL '1 day' * days),
        'activeAlerts', (SELECT COUNT(*) FROM alerts WHERE status = 'active'),
        'resolvedAlerts', (SELECT COUNT(*) FROM alerts WHERE status = 'resolved' AND triggered_at > NOW() - INTERVAL '1 day' * days),
        'acknowledgedAlerts', (SELECT COUNT(*) FROM alerts WHERE status = 'acknowledged' AND triggered_at > NOW() - INTERVAL '1 day' * days),
        'criticalAlerts', (SELECT COUNT(*) FROM alerts WHERE severity = 'critical' AND triggered_at > NOW() - INTERVAL '1 day' * days),
        'highAlerts', (SELECT COUNT(*) FROM alerts WHERE severity = 'high' AND triggered_at > NOW() - INTERVAL '1 day' * days),
        'mediumAlerts', (SELECT COUNT(*) FROM alerts WHERE severity = 'medium' AND triggered_at > NOW() - INTERVAL '1 day' * days),
        'lowAlerts', (SELECT COUNT(*) FROM alerts WHERE severity = 'low' AND triggered_at > NOW() - INTERVAL '1 day' * days),
        'avgResolutionTime', (
            SELECT AVG(EXTRACT(EPOCH FROM (resolved_at - triggered_at))/60) 
            FROM alerts 
            WHERE status = 'resolved' 
            AND triggered_at > NOW() - INTERVAL '1 day' * days
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to get health check summary
CREATE OR REPLACE FUNCTION get_health_check_summary()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'totalChecks', (SELECT COUNT(*) FROM health_checks),
        'healthyChecks', (SELECT COUNT(*) FROM health_checks WHERE status = 'healthy'),
        'unhealthyChecks', (SELECT COUNT(*) FROM health_checks WHERE status = 'unhealthy'),
        'unknownChecks', (SELECT COUNT(*) FROM health_checks WHERE status = 'unknown'),
        'avgResponseTime', (SELECT AVG(response_time) FROM health_checks WHERE status = 'healthy'),
        'checksByType', (
            SELECT json_object_agg(type, count)
            FROM (
                SELECT type, COUNT(*) as count
                FROM health_checks
                GROUP BY type
            ) type_counts
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;