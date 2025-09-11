-- Alert Management Tables Migration
-- This migration creates tables for advanced alert management features

-- Alert Templates Table
CREATE TABLE IF NOT EXISTS alert_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('system', 'application', 'database', 'network', 'security')),
    metric TEXT NOT NULL,
    condition TEXT NOT NULL CHECK (condition IN ('greater_than', 'less_than', 'equals', 'not_equals')),
    threshold DECIMAL(10,2) NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    cooldown INTEGER NOT NULL DEFAULT 5, -- minutes
    tags TEXT[] NOT NULL DEFAULT '{}',
    notification_channels TEXT[] NOT NULL DEFAULT '{}',
    escalation_policy JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Alert Actions Table
CREATE TABLE IF NOT EXISTS alert_actions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('webhook', 'script', 'email', 'slack', 'pagerduty')),
    config JSONB NOT NULL DEFAULT '{}',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    conditions JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Alert Suppressions Table
CREATE TABLE IF NOT EXISTS alert_suppressions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    rules JSONB NOT NULL DEFAULT '[]',
    schedule JSONB,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Alert Correlations Table
CREATE TABLE IF NOT EXISTS alert_correlations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    rules JSONB NOT NULL DEFAULT '[]',
    correlation_window INTEGER NOT NULL DEFAULT 10, -- minutes
    action TEXT NOT NULL CHECK (action IN ('suppress', 'escalate', 'combine')),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Alert Escalations Table
CREATE TABLE IF NOT EXISTS alert_escalations (
    id TEXT PRIMARY KEY,
    alert_id TEXT NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
    level INTEGER NOT NULL DEFAULT 1,
    triggered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    channels TEXT[] NOT NULL DEFAULT '{}',
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    message TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Alert Notifications Table
CREATE TABLE IF NOT EXISTS alert_notifications (
    id TEXT PRIMARY KEY,
    alert_id TEXT NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
    channel_id TEXT NOT NULL,
    channel_type TEXT NOT NULL CHECK (channel_type IN ('email', 'slack', 'webhook', 'sms')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed', 'delivered')) DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER NOT NULL DEFAULT 3,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Alert Metrics Table
CREATE TABLE IF NOT EXISTS alert_metrics (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    total_alerts INTEGER NOT NULL DEFAULT 0,
    active_alerts INTEGER NOT NULL DEFAULT 0,
    resolved_alerts INTEGER NOT NULL DEFAULT 0,
    acknowledged_alerts INTEGER NOT NULL DEFAULT 0,
    critical_alerts INTEGER NOT NULL DEFAULT 0,
    high_alerts INTEGER NOT NULL DEFAULT 0,
    medium_alerts INTEGER NOT NULL DEFAULT 0,
    low_alerts INTEGER NOT NULL DEFAULT 0,
    avg_resolution_time DECIMAL(10,2), -- minutes
    total_notifications_sent INTEGER NOT NULL DEFAULT 0,
    failed_notifications INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_alert_templates_category ON alert_templates(category);
CREATE INDEX IF NOT EXISTS idx_alert_templates_severity ON alert_templates(severity);
CREATE INDEX IF NOT EXISTS idx_alert_templates_metric ON alert_templates(metric);
CREATE INDEX IF NOT EXISTS idx_alert_templates_enabled ON alert_templates(enabled);

CREATE INDEX IF NOT EXISTS idx_alert_actions_type ON alert_actions(type);
CREATE INDEX IF NOT EXISTS idx_alert_actions_enabled ON alert_actions(enabled);

CREATE INDEX IF NOT EXISTS idx_alert_suppressions_enabled ON alert_suppressions(enabled);
CREATE INDEX IF NOT EXISTS idx_alert_suppressions_schedule ON alert_suppressions USING GIN(schedule);

CREATE INDEX IF NOT EXISTS idx_alert_correlations_enabled ON alert_correlations(enabled);
CREATE INDEX IF NOT EXISTS idx_alert_correlations_action ON alert_correlations(action);

CREATE INDEX IF NOT EXISTS idx_alert_escalations_alert_id ON alert_escalations(alert_id);
CREATE INDEX IF NOT EXISTS idx_alert_escalations_level ON alert_escalations(level);
CREATE INDEX IF NOT EXISTS idx_alert_escalations_triggered_at ON alert_escalations(triggered_at);

CREATE INDEX IF NOT EXISTS idx_alert_notifications_alert_id ON alert_notifications(alert_id);
CREATE INDEX IF NOT EXISTS idx_alert_notifications_status ON alert_notifications(status);
CREATE INDEX IF NOT EXISTS idx_alert_notifications_channel_type ON alert_notifications(channel_type);
CREATE INDEX IF NOT EXISTS idx_alert_notifications_sent_at ON alert_notifications(sent_at);

CREATE INDEX IF NOT EXISTS idx_alert_metrics_timestamp ON alert_metrics(timestamp);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_alert_templates_updated_at 
    BEFORE UPDATE ON alert_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alert_actions_updated_at 
    BEFORE UPDATE ON alert_actions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alert_suppressions_updated_at 
    BEFORE UPDATE ON alert_suppressions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alert_correlations_updated_at 
    BEFORE UPDATE ON alert_correlations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE alert_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_suppressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_correlations ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_metrics ENABLE ROW LEVEL SECURITY;

-- Alert Templates RLS Policies
CREATE POLICY "Admins can manage alert templates" ON alert_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Alert Actions RLS Policies
CREATE POLICY "Admins can manage alert actions" ON alert_actions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Alert Suppressions RLS Policies
CREATE POLICY "Admins can manage alert suppressions" ON alert_suppressions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Alert Correlations RLS Policies
CREATE POLICY "Admins can manage alert correlations" ON alert_correlations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Alert Escalations RLS Policies
CREATE POLICY "Admins can view alert escalations" ON alert_escalations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can insert alert escalations" ON alert_escalations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update alert escalations" ON alert_escalations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Alert Notifications RLS Policies
CREATE POLICY "Admins can view alert notifications" ON alert_notifications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can insert alert notifications" ON alert_notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update alert notifications" ON alert_notifications
    FOR UPDATE WITH CHECK (true);

-- Alert Metrics RLS Policies
CREATE POLICY "Admins can view alert metrics" ON alert_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can insert alert metrics" ON alert_metrics
    FOR INSERT WITH CHECK (true);

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
        ),
        'totalTemplates', (SELECT COUNT(*) FROM alert_templates),
        'activeTemplates', (SELECT COUNT(*) FROM alert_templates WHERE enabled = true),
        'totalActions', (SELECT COUNT(*) FROM alert_actions),
        'activeActions', (SELECT COUNT(*) FROM alert_actions WHERE enabled = true),
        'totalSuppressions', (SELECT COUNT(*) FROM alert_suppressions),
        'activeSuppressions', (SELECT COUNT(*) FROM alert_suppressions WHERE enabled = true),
        'totalCorrelations', (SELECT COUNT(*) FROM alert_correlations),
        'activeCorrelations', (SELECT COUNT(*) FROM alert_correlations WHERE enabled = true)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to get alert template statistics
CREATE OR REPLACE FUNCTION get_alert_template_statistics()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'totalTemplates', (SELECT COUNT(*) FROM alert_templates),
        'templatesByCategory', (
            SELECT json_object_agg(category, count)
            FROM (
                SELECT category, COUNT(*) as count
                FROM alert_templates
                GROUP BY category
            ) category_counts
        ),
        'templatesBySeverity', (
            SELECT json_object_agg(severity, count)
            FROM (
                SELECT severity, COUNT(*) as count
                FROM alert_templates
                GROUP BY severity
            ) severity_counts
        ),
        'enabledTemplates', (SELECT COUNT(*) FROM alert_templates WHERE enabled = true),
        'disabledTemplates', (SELECT COUNT(*) FROM alert_templates WHERE enabled = false)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to get notification statistics
CREATE OR REPLACE FUNCTION get_notification_statistics(days INTEGER DEFAULT 7)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'totalNotifications', (SELECT COUNT(*) FROM alert_notifications WHERE created_at > NOW() - INTERVAL '1 day' * days),
        'sentNotifications', (SELECT COUNT(*) FROM alert_notifications WHERE status = 'sent' AND created_at > NOW() - INTERVAL '1 day' * days),
        'failedNotifications', (SELECT COUNT(*) FROM alert_notifications WHERE status = 'failed' AND created_at > NOW() - INTERVAL '1 day' * days),
        'deliveredNotifications', (SELECT COUNT(*) FROM alert_notifications WHERE status = 'delivered' AND created_at > NOW() - INTERVAL '1 day' * days),
        'pendingNotifications', (SELECT COUNT(*) FROM alert_notifications WHERE status = 'pending'),
        'notificationsByChannel', (
            SELECT json_object_agg(channel_type, count)
            FROM (
                SELECT channel_type, COUNT(*) as count
                FROM alert_notifications
                WHERE created_at > NOW() - INTERVAL '1 day' * days
                GROUP BY channel_type
            ) channel_counts
        ),
        'avgDeliveryTime', (
            SELECT AVG(EXTRACT(EPOCH FROM (delivered_at - sent_at)))
            FROM alert_notifications
            WHERE status = 'delivered'
            AND created_at > NOW() - INTERVAL '1 day' * days
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to clean up old alert data
CREATE OR REPLACE FUNCTION cleanup_old_alert_data()
RETURNS void AS $$
BEGIN
    -- Delete old resolved alerts (older than 30 days)
    DELETE FROM alerts 
    WHERE status = 'resolved' 
    AND resolved_at < NOW() - INTERVAL '30 days';
    
    -- Delete old alert escalations (older than 30 days)
    DELETE FROM alert_escalations 
    WHERE triggered_at < NOW() - INTERVAL '30 days';
    
    -- Delete old alert notifications (older than 30 days)
    DELETE FROM alert_notifications 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    -- Delete old alert metrics (older than 90 days)
    DELETE FROM alert_metrics 
    WHERE timestamp < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Insert default alert templates
INSERT INTO alert_templates (id, name, description, category, metric, condition, threshold, severity, cooldown, tags, notification_channels) VALUES
(
    'cpu_high_template',
    'High CPU Usage',
    'CPU usage exceeds threshold',
    'system',
    'cpu.usage',
    'greater_than',
    80.00,
    'high',
    5,
    ARRAY['system', 'performance'],
    ARRAY['email_default']
),
(
    'memory_high_template',
    'High Memory Usage',
    'Memory usage exceeds threshold',
    'system',
    'memory.usage',
    'greater_than',
    85.00,
    'high',
    5,
    ARRAY['system', 'performance'],
    ARRAY['email_default']
),
(
    'disk_high_template',
    'High Disk Usage',
    'Disk usage exceeds threshold',
    'system',
    'disk.usage',
    'greater_than',
    90.00,
    'critical',
    10,
    ARRAY['system', 'storage'],
    ARRAY['email_default']
),
(
    'response_time_high_template',
    'High Response Time',
    'Application response time exceeds threshold',
    'application',
    'application.responseTime',
    'greater_than',
    2000.00,
    'medium',
    5,
    ARRAY['application', 'performance'],
    ARRAY['email_default']
),
(
    'error_rate_high_template',
    'High Error Rate',
    'Application error rate exceeds threshold',
    'application',
    'application.errorRate',
    'greater_than',
    5.00,
    'high',
    5,
    ARRAY['application', 'errors'],
    ARRAY['email_default']
)
ON CONFLICT (id) DO NOTHING;

-- Insert default alert actions
INSERT INTO alert_actions (id, name, type, config, enabled, conditions) VALUES
(
    'email_notification',
    'Email Notification',
    'email',
    '{"to": "admin@5glabx.com", "subject": "Alert: {{alert.title}}", "template": "alert_email_template"}',
    true,
    '[]'
),
(
    'slack_notification',
    'Slack Notification',
    'slack',
    '{"webhook_url": "", "channel": "#alerts", "username": "5GLabX Monitor"}',
    false,
    '[{"field": "severity", "operator": "greater_than", "value": "medium"}]'
)
ON CONFLICT (id) DO NOTHING;

-- Insert default alert suppressions
INSERT INTO alert_suppressions (id, name, description, rules, schedule, enabled) VALUES
(
    'maintenance_window',
    'Maintenance Window',
    'Suppress alerts during maintenance window',
    '[{"field": "tags", "operator": "contains", "value": "maintenance"}]',
    '{"timezone": "UTC", "days": [0, 6], "startTime": "02:00", "endTime": "06:00"}',
    false
)
ON CONFLICT (id) DO NOTHING;

-- Insert default alert correlations
INSERT INTO alert_correlations (id, name, description, rules, correlation_window, action, enabled) VALUES
(
    'system_correlation',
    'System Resource Correlation',
    'Correlate system resource alerts',
    '[{"metric": "cpu.usage", "condition": "greater_than", "threshold": 80, "timeWindow": 5}, {"metric": "memory.usage", "condition": "greater_than", "threshold": 85, "timeWindow": 5}]',
    10,
    'combine',
    true
)
ON CONFLICT (id) DO NOTHING;