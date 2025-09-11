-- Security and Audit Tables Migration
-- This migration creates tables for security events, audit logs, and compliance tracking

-- Security Events Table
CREATE TABLE IF NOT EXISTS security_events (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('login_attempt', 'failed_login', 'suspicious_activity', 'data_access', 'system_change', 'security_violation')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}',
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    action_taken TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Audit Events Table
CREATE TABLE IF NOT EXISTS audit_events (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    resource_id TEXT,
    details JSONB NOT NULL DEFAULT '{}',
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    category TEXT NOT NULL CHECK (category IN ('authentication', 'authorization', 'data_access', 'data_modification', 'system_change', 'security', 'compliance')),
    outcome TEXT NOT NULL CHECK (outcome IN ('success', 'failure', 'error')),
    session_id TEXT,
    request_id TEXT
);

-- Compliance Reports Table
CREATE TABLE IF NOT EXISTS compliance_reports (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('GDPR', 'CCPA', 'SOX', 'HIPAA', 'PCI-DSS', 'ISO27001')),
    status TEXT NOT NULL CHECK (status IN ('compliant', 'non-compliant', 'partial')),
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    last_assessment TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    next_assessment TIMESTAMP WITH TIME ZONE NOT NULL,
    findings JSONB NOT NULL DEFAULT '[]',
    recommendations JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Blocked IPs Table
CREATE TABLE IF NOT EXISTS blocked_ips (
    id SERIAL PRIMARY KEY,
    ip_address INET NOT NULL UNIQUE,
    reason TEXT NOT NULL,
    blocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    blocked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Security Policies Table
CREATE TABLE IF NOT EXISTS security_policies (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    policy_type TEXT NOT NULL CHECK (policy_type IN ('password', 'session', 'rate_limit', 'access_control', 'data_protection')),
    config JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Security Violations Table
CREATE TABLE IF NOT EXISTS security_violations (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    violation_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    details JSONB NOT NULL DEFAULT '{}',
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_ip_address ON security_events(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_resolved ON security_events(resolved);

CREATE INDEX IF NOT EXISTS idx_audit_events_user_id ON audit_events(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON audit_events(action);
CREATE INDEX IF NOT EXISTS idx_audit_events_resource ON audit_events(resource);
CREATE INDEX IF NOT EXISTS idx_audit_events_category ON audit_events(category);
CREATE INDEX IF NOT EXISTS idx_audit_events_severity ON audit_events(severity);
CREATE INDEX IF NOT EXISTS idx_audit_events_timestamp ON audit_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_events_outcome ON audit_events(outcome);

CREATE INDEX IF NOT EXISTS idx_compliance_reports_type ON compliance_reports(type);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_status ON compliance_reports(status);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_last_assessment ON compliance_reports(last_assessment);

CREATE INDEX IF NOT EXISTS idx_blocked_ips_ip_address ON blocked_ips(ip_address);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_is_active ON blocked_ips(is_active);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_expires_at ON blocked_ips(expires_at);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_security_policies_policy_type ON security_policies(policy_type);
CREATE INDEX IF NOT EXISTS idx_security_policies_is_active ON security_policies(is_active);

CREATE INDEX IF NOT EXISTS idx_security_violations_user_id ON security_violations(user_id);
CREATE INDEX IF NOT EXISTS idx_security_violations_violation_type ON security_violations(violation_type);
CREATE INDEX IF NOT EXISTS idx_security_violations_severity ON security_violations(severity);
CREATE INDEX IF NOT EXISTS idx_security_violations_resolved ON security_violations(resolved);
CREATE INDEX IF NOT EXISTS idx_security_violations_created_at ON security_violations(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_security_events_updated_at 
    BEFORE UPDATE ON security_events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_reports_updated_at 
    BEFORE UPDATE ON compliance_reports 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_policies_updated_at 
    BEFORE UPDATE ON security_policies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_ips ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_violations ENABLE ROW LEVEL SECURITY;

-- Security Events RLS Policies
CREATE POLICY "Admins can view all security events" ON security_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Users can view their own security events" ON security_events
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert security events" ON security_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update security events" ON security_events
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Audit Events RLS Policies
CREATE POLICY "Admins can view all audit events" ON audit_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Users can view their own audit events" ON audit_events
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert audit events" ON audit_events
    FOR INSERT WITH CHECK (true);

-- Compliance Reports RLS Policies
CREATE POLICY "Admins can manage compliance reports" ON compliance_reports
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Blocked IPs RLS Policies
CREATE POLICY "Admins can manage blocked IPs" ON blocked_ips
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- User Sessions RLS Policies
CREATE POLICY "Users can view their own sessions" ON user_sessions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all sessions" ON user_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can manage sessions" ON user_sessions
    FOR ALL WITH CHECK (true);

-- Security Policies RLS Policies
CREATE POLICY "Admins can manage security policies" ON security_policies
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Security Violations RLS Policies
CREATE POLICY "Admins can view all security violations" ON security_violations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Users can view their own security violations" ON security_violations
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert security violations" ON security_violations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update security violations" ON security_violations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Insert default security policies
INSERT INTO security_policies (name, description, policy_type, config, is_active) VALUES
(
    'Default Password Policy',
    'Standard password requirements for all users',
    'password',
    '{
        "minLength": 8,
        "requireUppercase": true,
        "requireLowercase": true,
        "requireNumbers": true,
        "requireSpecialChars": true,
        "maxAge": 7776000000
    }',
    true
),
(
    'Default Session Policy',
    'Standard session management settings',
    'session',
    '{
        "timeout": 1800000,
        "maxConcurrent": 5,
        "requireReauth": false
    }',
    true
),
(
    'Default Rate Limit Policy',
    'Standard rate limiting for API requests',
    'rate_limit',
    '{
        "maxRequestsPerMinute": 100,
        "maxRequestsPerHour": 1000,
        "burstLimit": 20
    }',
    true
),
(
    'Default Access Control Policy',
    'Standard access control settings',
    'access_control',
    '{
        "requireMFA": false,
        "allowRememberMe": true,
        "maxFailedAttempts": 5,
        "lockoutDuration": 900000
    }',
    true
),
(
    'Default Data Protection Policy',
    'Standard data protection and privacy settings',
    'data_protection',
    '{
        "encryptAtRest": true,
        "encryptInTransit": true,
        "retentionPeriod": 2555,
        "anonymizeAfter": 365
    }',
    true
)
ON CONFLICT (name) DO NOTHING;

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    UPDATE user_sessions 
    SET is_active = false 
    WHERE expires_at < NOW() AND is_active = true;
    
    DELETE FROM user_sessions 
    WHERE expires_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Create function to clean up expired blocked IPs
CREATE OR REPLACE FUNCTION cleanup_expired_blocked_ips()
RETURNS void AS $$
BEGIN
    UPDATE blocked_ips 
    SET is_active = false 
    WHERE expires_at < NOW() AND is_active = true;
    
    DELETE FROM blocked_ips 
    WHERE expires_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create function to get security metrics
CREATE OR REPLACE FUNCTION get_security_metrics()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'totalEvents', (SELECT COUNT(*) FROM security_events),
        'criticalEvents', (SELECT COUNT(*) FROM security_events WHERE severity = 'critical'),
        'highSeverityEvents', (SELECT COUNT(*) FROM security_events WHERE severity = 'high'),
        'mediumSeverityEvents', (SELECT COUNT(*) FROM security_events WHERE severity = 'medium'),
        'lowSeverityEvents', (SELECT COUNT(*) FROM security_events WHERE severity = 'low'),
        'failedLoginAttempts', (SELECT COUNT(*) FROM security_events WHERE type = 'failed_login'),
        'suspiciousActivities', (SELECT COUNT(*) FROM security_events WHERE type = 'suspicious_activity'),
        'blockedIPs', (SELECT COUNT(*) FROM blocked_ips WHERE is_active = true),
        'activeThreats', (SELECT COUNT(*) FROM security_events WHERE resolved = false),
        'lastSecurityScan', NOW(),
        'complianceScore', 85
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to get audit statistics
CREATE OR REPLACE FUNCTION get_audit_stats(start_date TIMESTAMP WITH TIME ZONE, end_date TIMESTAMP WITH TIME ZONE)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'totalEvents', (SELECT COUNT(*) FROM audit_events WHERE timestamp BETWEEN start_date AND end_date),
        'eventsByCategory', (
            SELECT json_object_agg(category, count)
            FROM (
                SELECT category, COUNT(*) as count
                FROM audit_events
                WHERE timestamp BETWEEN start_date AND end_date
                GROUP BY category
            ) category_counts
        ),
        'eventsBySeverity', (
            SELECT json_object_agg(severity, count)
            FROM (
                SELECT severity, COUNT(*) as count
                FROM audit_events
                WHERE timestamp BETWEEN start_date AND end_date
                GROUP BY severity
            ) severity_counts
        ),
        'eventsByOutcome', (
            SELECT json_object_agg(outcome, count)
            FROM (
                SELECT outcome, COUNT(*) as count
                FROM audit_events
                WHERE timestamp BETWEEN start_date AND end_date
                GROUP BY outcome
            ) outcome_counts
        ),
        'topUsers', (
            SELECT json_agg(json_build_object('userId', user_id, 'count', count))
            FROM (
                SELECT user_id, COUNT(*) as count
                FROM audit_events
                WHERE timestamp BETWEEN start_date AND end_date
                AND user_id IS NOT NULL
                GROUP BY user_id
                ORDER BY count DESC
                LIMIT 10
            ) user_counts
        ),
        'topActions', (
            SELECT json_agg(json_build_object('action', action, 'count', count))
            FROM (
                SELECT action, COUNT(*) as count
                FROM audit_events
                WHERE timestamp BETWEEN start_date AND end_date
                GROUP BY action
                ORDER BY count DESC
                LIMIT 10
            ) action_counts
        ),
        'topResources', (
            SELECT json_agg(json_build_object('resource', resource, 'count', count))
            FROM (
                SELECT resource, COUNT(*) as count
                FROM audit_events
                WHERE timestamp BETWEEN start_date AND end_date
                GROUP BY resource
                ORDER BY count DESC
                LIMIT 10
            ) resource_counts
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;