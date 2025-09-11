-- Backup and Disaster Recovery Tables Migration
-- This migration creates tables for comprehensive backup and disaster recovery management

-- Backup Configurations Table
CREATE TABLE IF NOT EXISTS backup_configs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('full', 'incremental', 'differential')),
    schedule JSONB NOT NULL,
    retention JSONB NOT NULL,
    compression BOOLEAN NOT NULL DEFAULT TRUE,
    encryption BOOLEAN NOT NULL DEFAULT FALSE,
    encryption_key TEXT,
    storage JSONB NOT NULL,
    tables TEXT[] NOT NULL DEFAULT '{}',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Backup Jobs Table
CREATE TABLE IF NOT EXISTS backup_jobs (
    id TEXT PRIMARY KEY,
    config_id TEXT NOT NULL REFERENCES backup_configs(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
    type TEXT NOT NULL CHECK (type IN ('scheduled', 'manual', 'recovery')) DEFAULT 'manual',
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- milliseconds
    size BIGINT, -- bytes
    records INTEGER,
    error TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',
    storage JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Recovery Jobs Table
CREATE TABLE IF NOT EXISTS recovery_jobs (
    id TEXT PRIMARY KEY,
    backup_job_id TEXT NOT NULL REFERENCES backup_jobs(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
    type TEXT NOT NULL CHECK (type IN ('full', 'partial', 'point_in_time')),
    target_date TIMESTAMP WITH TIME ZONE,
    tables TEXT[] NOT NULL DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- milliseconds
    error TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Backup Validations Table
CREATE TABLE IF NOT EXISTS backup_validations (
    id TEXT PRIMARY KEY,
    backup_job_id TEXT NOT NULL REFERENCES backup_jobs(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'passed', 'failed')) DEFAULT 'pending',
    type TEXT NOT NULL CHECK (type IN ('integrity', 'restore', 'consistency')),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- milliseconds
    error TEXT,
    results JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Disaster Recovery Plans Table
CREATE TABLE IF NOT EXISTS disaster_recovery_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    rto INTEGER NOT NULL, -- Recovery Time Objective in minutes
    rpo INTEGER NOT NULL, -- Recovery Point Objective in minutes
    priority TEXT NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),
    components JSONB NOT NULL DEFAULT '[]',
    testing JSONB NOT NULL DEFAULT '{}',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Disaster Recovery Tests Table
CREATE TABLE IF NOT EXISTS disaster_recovery_tests (
    id TEXT PRIMARY KEY,
    plan_id TEXT NOT NULL REFERENCES disaster_recovery_plans(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
    type TEXT NOT NULL CHECK (type IN ('tabletop', 'simulation', 'full_test')),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- milliseconds
    results JSONB NOT NULL DEFAULT '{}',
    issues JSONB NOT NULL DEFAULT '[]',
    recommendations JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Backup Storage Locations Table
CREATE TABLE IF NOT EXISTS backup_storage_locations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('local', 's3', 'gcs', 'azure', 'ftp', 'sftp')),
    config JSONB NOT NULL DEFAULT '{}',
    credentials JSONB NOT NULL DEFAULT '{}',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Backup Retention Policies Table
CREATE TABLE IF NOT EXISTS backup_retention_policies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    policy JSONB NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Backup Metrics Table
CREATE TABLE IF NOT EXISTS backup_metrics (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    total_backups INTEGER NOT NULL DEFAULT 0,
    successful_backups INTEGER NOT NULL DEFAULT 0,
    failed_backups INTEGER NOT NULL DEFAULT 0,
    total_size BIGINT NOT NULL DEFAULT 0,
    avg_backup_duration DECIMAL(10,2), -- seconds
    total_recoveries INTEGER NOT NULL DEFAULT 0,
    successful_recoveries INTEGER NOT NULL DEFAULT 0,
    failed_recoveries INTEGER NOT NULL DEFAULT 0,
    avg_recovery_duration DECIMAL(10,2), -- seconds
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_backup_configs_type ON backup_configs(type);
CREATE INDEX IF NOT EXISTS idx_backup_configs_enabled ON backup_configs(enabled);
CREATE INDEX IF NOT EXISTS idx_backup_configs_created_at ON backup_configs(created_at);

CREATE INDEX IF NOT EXISTS idx_backup_jobs_config_id ON backup_jobs(config_id);
CREATE INDEX IF NOT EXISTS idx_backup_jobs_status ON backup_jobs(status);
CREATE INDEX IF NOT EXISTS idx_backup_jobs_type ON backup_jobs(type);
CREATE INDEX IF NOT EXISTS idx_backup_jobs_started_at ON backup_jobs(started_at);
CREATE INDEX IF NOT EXISTS idx_backup_jobs_completed_at ON backup_jobs(completed_at);

CREATE INDEX IF NOT EXISTS idx_recovery_jobs_backup_job_id ON recovery_jobs(backup_job_id);
CREATE INDEX IF NOT EXISTS idx_recovery_jobs_status ON recovery_jobs(status);
CREATE INDEX IF NOT EXISTS idx_recovery_jobs_type ON recovery_jobs(type);
CREATE INDEX IF NOT EXISTS idx_recovery_jobs_started_at ON recovery_jobs(started_at);

CREATE INDEX IF NOT EXISTS idx_backup_validations_backup_job_id ON backup_validations(backup_job_id);
CREATE INDEX IF NOT EXISTS idx_backup_validations_status ON backup_validations(status);
CREATE INDEX IF NOT EXISTS idx_backup_validations_type ON backup_validations(type);

CREATE INDEX IF NOT EXISTS idx_disaster_recovery_plans_priority ON disaster_recovery_plans(priority);
CREATE INDEX IF NOT EXISTS idx_disaster_recovery_plans_enabled ON disaster_recovery_plans(enabled);
CREATE INDEX IF NOT EXISTS idx_disaster_recovery_plans_created_at ON disaster_recovery_plans(created_at);

CREATE INDEX IF NOT EXISTS idx_disaster_recovery_tests_plan_id ON disaster_recovery_tests(plan_id);
CREATE INDEX IF NOT EXISTS idx_disaster_recovery_tests_status ON disaster_recovery_tests(status);
CREATE INDEX IF NOT EXISTS idx_disaster_recovery_tests_type ON disaster_recovery_tests(type);
CREATE INDEX IF NOT EXISTS idx_disaster_recovery_tests_started_at ON disaster_recovery_tests(started_at);

CREATE INDEX IF NOT EXISTS idx_backup_storage_locations_type ON backup_storage_locations(type);
CREATE INDEX IF NOT EXISTS idx_backup_storage_locations_enabled ON backup_storage_locations(enabled);

CREATE INDEX IF NOT EXISTS idx_backup_retention_policies_enabled ON backup_retention_policies(enabled);

CREATE INDEX IF NOT EXISTS idx_backup_metrics_timestamp ON backup_metrics(timestamp);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_backup_configs_updated_at 
    BEFORE UPDATE ON backup_configs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disaster_recovery_plans_updated_at 
    BEFORE UPDATE ON disaster_recovery_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_backup_storage_locations_updated_at 
    BEFORE UPDATE ON backup_storage_locations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_backup_retention_policies_updated_at 
    BEFORE UPDATE ON backup_retention_policies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE backup_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE disaster_recovery_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE disaster_recovery_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_storage_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_retention_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_metrics ENABLE ROW LEVEL SECURITY;

-- Backup Configs RLS Policies
CREATE POLICY "Admins can manage backup configs" ON backup_configs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Backup Jobs RLS Policies
CREATE POLICY "Admins can view all backup jobs" ON backup_jobs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can insert backup jobs" ON backup_jobs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update backup jobs" ON backup_jobs
    FOR UPDATE WITH CHECK (true);

-- Recovery Jobs RLS Policies
CREATE POLICY "Admins can view all recovery jobs" ON recovery_jobs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can insert recovery jobs" ON recovery_jobs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update recovery jobs" ON recovery_jobs
    FOR UPDATE WITH CHECK (true);

-- Backup Validations RLS Policies
CREATE POLICY "Admins can view all backup validations" ON backup_validations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can insert backup validations" ON backup_validations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update backup validations" ON backup_validations
    FOR UPDATE WITH CHECK (true);

-- Disaster Recovery Plans RLS Policies
CREATE POLICY "Admins can manage disaster recovery plans" ON disaster_recovery_plans
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Disaster Recovery Tests RLS Policies
CREATE POLICY "Admins can view all disaster recovery tests" ON disaster_recovery_tests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can insert disaster recovery tests" ON disaster_recovery_tests
    FOR INSERT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can update disaster recovery tests" ON disaster_recovery_tests
    FOR UPDATE WITH CHECK (true);

-- Backup Storage Locations RLS Policies
CREATE POLICY "Admins can manage backup storage locations" ON backup_storage_locations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Backup Retention Policies RLS Policies
CREATE POLICY "Admins can manage backup retention policies" ON backup_retention_policies
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Backup Metrics RLS Policies
CREATE POLICY "Admins can view backup metrics" ON backup_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can insert backup metrics" ON backup_metrics
    FOR INSERT WITH CHECK (true);

-- Create function to get backup statistics
CREATE OR REPLACE FUNCTION get_backup_statistics(days INTEGER DEFAULT 30)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'totalBackups', (SELECT COUNT(*) FROM backup_jobs WHERE started_at > NOW() - INTERVAL '1 day' * days),
        'successfulBackups', (SELECT COUNT(*) FROM backup_jobs WHERE status = 'completed' AND started_at > NOW() - INTERVAL '1 day' * days),
        'failedBackups', (SELECT COUNT(*) FROM backup_jobs WHERE status = 'failed' AND started_at > NOW() - INTERVAL '1 day' * days),
        'totalSize', (SELECT COALESCE(SUM(size), 0) FROM backup_jobs WHERE status = 'completed' AND started_at > NOW() - INTERVAL '1 day' * days),
        'avgDuration', (SELECT AVG(duration) FROM backup_jobs WHERE status = 'completed' AND started_at > NOW() - INTERVAL '1 day' * days),
        'totalRecoveries', (SELECT COUNT(*) FROM recovery_jobs WHERE started_at > NOW() - INTERVAL '1 day' * days),
        'successfulRecoveries', (SELECT COUNT(*) FROM recovery_jobs WHERE status = 'completed' AND started_at > NOW() - INTERVAL '1 day' * days),
        'failedRecoveries', (SELECT COUNT(*) FROM recovery_jobs WHERE status = 'failed' AND started_at > NOW() - INTERVAL '1 day' * days),
        'avgRecoveryDuration', (SELECT AVG(duration) FROM recovery_jobs WHERE status = 'completed' AND started_at > NOW() - INTERVAL '1 day' * days),
        'totalConfigs', (SELECT COUNT(*) FROM backup_configs),
        'enabledConfigs', (SELECT COUNT(*) FROM backup_configs WHERE enabled = true),
        'totalDRPlans', (SELECT COUNT(*) FROM disaster_recovery_plans),
        'enabledDRPlans', (SELECT COUNT(*) FROM disaster_recovery_plans WHERE enabled = true)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to get backup job details
CREATE OR REPLACE FUNCTION get_backup_job_details(job_id TEXT)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'job', (
            SELECT json_build_object(
                'id', id,
                'configId', config_id,
                'status', status,
                'type', type,
                'startedAt', started_at,
                'completedAt', completed_at,
                'duration', duration,
                'size', size,
                'records', records,
                'error', error,
                'metadata', metadata,
                'storage', storage
            )
            FROM backup_jobs
            WHERE id = job_id
        ),
        'config', (
            SELECT json_build_object(
                'id', id,
                'name', name,
                'description', description,
                'type', type,
                'schedule', schedule,
                'retention', retention,
                'compression', compression,
                'encryption', encryption,
                'storage', storage,
                'tables', tables,
                'enabled', enabled
            )
            FROM backup_configs
            WHERE id = (SELECT config_id FROM backup_jobs WHERE id = job_id)
        ),
        'validations', (
            SELECT json_agg(
                json_build_object(
                    'id', id,
                    'status', status,
                    'type', type,
                    'startedAt', started_at,
                    'completedAt', completed_at,
                    'duration', duration,
                    'error', error,
                    'results', results
                )
            )
            FROM backup_validations
            WHERE backup_job_id = job_id
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to clean up old backup data
CREATE OR REPLACE FUNCTION cleanup_old_backup_data()
RETURNS void AS $$
BEGIN
    -- Delete old completed backup jobs (older than 90 days)
    DELETE FROM backup_jobs 
    WHERE status = 'completed' 
    AND completed_at < NOW() - INTERVAL '90 days';
    
    -- Delete old failed backup jobs (older than 30 days)
    DELETE FROM backup_jobs 
    WHERE status = 'failed' 
    AND started_at < NOW() - INTERVAL '30 days';
    
    -- Delete old recovery jobs (older than 90 days)
    DELETE FROM recovery_jobs 
    WHERE completed_at < NOW() - INTERVAL '90 days';
    
    -- Delete old backup validations (older than 90 days)
    DELETE FROM backup_validations 
    WHERE completed_at < NOW() - INTERVAL '90 days';
    
    -- Delete old disaster recovery tests (older than 1 year)
    DELETE FROM disaster_recovery_tests 
    WHERE completed_at < NOW() - INTERVAL '1 year';
    
    -- Delete old backup metrics (older than 1 year)
    DELETE FROM backup_metrics 
    WHERE timestamp < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Insert default backup configurations
INSERT INTO backup_configs (id, name, description, type, schedule, retention, compression, encryption, storage, tables, enabled) VALUES
(
    'daily_full_backup',
    'Daily Full Backup',
    'Complete database backup every day',
    'full',
    '{"frequency": "daily", "time": "02:00", "timezone": "UTC"}',
    '{"daily": 7, "weekly": 4, "monthly": 12, "yearly": 2}',
    true,
    true,
    '{"type": "local", "config": {"path": "/backups"}}',
    ARRAY['users', 'test_cases', 'test_executions', 'user_activities', 'system_metrics', 'alerts', 'alert_rules', 'notification_channels', 'health_checks'],
    true
),
(
    'hourly_incremental',
    'Hourly Incremental Backup',
    'Incremental backup every hour',
    'incremental',
    '{"frequency": "hourly", "time": "00:00", "timezone": "UTC"}',
    '{"daily": 24, "weekly": 0, "monthly": 0, "yearly": 0}',
    true,
    false,
    '{"type": "local", "config": {"path": "/backups/incremental"}}',
    ARRAY['users', 'test_cases', 'test_executions', 'user_activities', 'system_metrics', 'alerts'],
    true
),
(
    'weekly_differential',
    'Weekly Differential Backup',
    'Differential backup every week',
    'differential',
    '{"frequency": "weekly", "time": "03:00", "days": [0], "timezone": "UTC"}',
    '{"daily": 0, "weekly": 8, "monthly": 0, "yearly": 0}',
    true,
    true,
    '{"type": "local", "config": {"path": "/backups/differential"}}',
    ARRAY['users', 'test_cases', 'test_executions', 'user_activities', 'system_metrics', 'alerts', 'alert_rules', 'notification_channels', 'health_checks'],
    true
)
ON CONFLICT (id) DO NOTHING;

-- Insert default disaster recovery plans
INSERT INTO disaster_recovery_plans (id, name, description, rto, rpo, priority, components, testing, enabled) VALUES
(
    'critical_system_recovery',
    'Critical System Recovery',
    'Recovery plan for critical system components',
    60,
    15,
    'critical',
    '[
        {
            "name": "Database",
            "type": "database",
            "dependencies": [],
            "recoverySteps": [
                {
                    "step": 1,
                    "action": "Restore from latest backup",
                    "command": "restore_database.sh",
                    "timeout": 1800,
                    "retryCount": 3
                },
                {
                    "step": 2,
                    "action": "Validate data integrity",
                    "command": "validate_database.sh",
                    "timeout": 300,
                    "retryCount": 2
                }
            ]
        },
        {
            "name": "Application Server",
            "type": "application",
            "dependencies": ["Database"],
            "recoverySteps": [
                {
                    "step": 1,
                    "action": "Start application server",
                    "command": "start_app.sh",
                    "timeout": 120,
                    "retryCount": 3
                },
                {
                    "step": 2,
                    "action": "Verify application health",
                    "command": "health_check.sh",
                    "timeout": 60,
                    "retryCount": 2
                }
            ]
        }
    ]',
    '{"frequency": "monthly", "nextTest": null}',
    true
),
(
    'application_recovery',
    'Application Recovery',
    'Recovery plan for application components',
    120,
    30,
    'high',
    '[
        {
            "name": "Web Application",
            "type": "application",
            "dependencies": ["Database"],
            "recoverySteps": [
                {
                    "step": 1,
                    "action": "Deploy application",
                    "command": "deploy_app.sh",
                    "timeout": 600,
                    "retryCount": 2
                },
                {
                    "step": 2,
                    "action": "Configure application",
                    "command": "configure_app.sh",
                    "timeout": 300,
                    "retryCount": 2
                }
            ]
        }
    ]',
    '{"frequency": "quarterly", "nextTest": null}',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Insert default backup storage locations
INSERT INTO backup_storage_locations (id, name, type, config, credentials, enabled) VALUES
(
    'local_storage',
    'Local Storage',
    'local',
    '{"path": "/backups", "maxSize": "100GB"}',
    '{}',
    true
),
(
    's3_storage',
    'AWS S3 Storage',
    's3',
    '{"bucket": "5glabx-backups", "region": "us-east-1", "prefix": "backups/"}',
    '{"accessKeyId": "", "secretAccessKey": ""}',
    false
)
ON CONFLICT (id) DO NOTHING;

-- Insert default backup retention policies
INSERT INTO backup_retention_policies (id, name, description, policy, enabled) VALUES
(
    'standard_retention',
    'Standard Retention Policy',
    'Standard backup retention policy for production systems',
    '{"daily": 7, "weekly": 4, "monthly": 12, "yearly": 2}',
    true
),
(
    'long_term_retention',
    'Long-term Retention Policy',
    'Long-term backup retention policy for compliance',
    '{"daily": 30, "weekly": 12, "monthly": 60, "yearly": 7}',
    false
)
ON CONFLICT (id) DO NOTHING;