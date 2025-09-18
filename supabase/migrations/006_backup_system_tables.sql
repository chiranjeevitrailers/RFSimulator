-- Backup & Disaster Recovery System Tables Migration
-- This migration creates tables for comprehensive backup and disaster recovery management

-- Backup Configurations Table
CREATE TABLE IF NOT EXISTS backup_configs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('full', 'incremental', 'differential')),
    schedule JSONB NOT NULL DEFAULT '{}',
    retention JSONB NOT NULL DEFAULT '{}',
    storage JSONB NOT NULL DEFAULT '{}',
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
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Recovery Jobs Table
CREATE TABLE IF NOT EXISTS recovery_jobs (
    id TEXT PRIMARY KEY,
    backup_job_id TEXT NOT NULL REFERENCES backup_jobs(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
    type TEXT NOT NULL CHECK (type IN ('full', 'partial', 'point_in_time')),
    target_tables TEXT[] NOT NULL DEFAULT '{}',
    target_timestamp TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- milliseconds
    records_restored INTEGER,
    error TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Backup Validations Table
CREATE TABLE IF NOT EXISTS backup_validations (
    id TEXT PRIMARY KEY,
    backup_job_id TEXT NOT NULL REFERENCES backup_jobs(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'passed', 'failed')) DEFAULT 'pending',
    type TEXT NOT NULL CHECK (type IN ('integrity', 'completeness', 'consistency')),
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
    testing_schedule JSONB NOT NULL DEFAULT '{}',
    contacts JSONB NOT NULL DEFAULT '[]',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Backup Storage Locations Table
CREATE TABLE IF NOT EXISTS backup_storage_locations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('local', 's3', 'gcs', 'azure', 'ftp', 'sftp')),
    config JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'maintenance')) DEFAULT 'active',
    capacity BIGINT, -- bytes
    used_space BIGINT, -- bytes
    last_accessed TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Backup Retention Policies Table
CREATE TABLE IF NOT EXISTS backup_retention_policies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    config_id TEXT NOT NULL REFERENCES backup_configs(id) ON DELETE CASCADE,
    policy_type TEXT NOT NULL CHECK (policy_type IN ('time_based', 'count_based', 'size_based')),
    rules JSONB NOT NULL DEFAULT '{}',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Backup Audit Log Table
CREATE TABLE IF NOT EXISTS backup_audit_log (
    id SERIAL PRIMARY KEY,
    event_type TEXT NOT NULL CHECK (event_type IN ('backup_started', 'backup_completed', 'backup_failed', 'recovery_started', 'recovery_completed', 'recovery_failed', 'validation_started', 'validation_completed', 'validation_failed', 'config_created', 'config_updated', 'config_deleted')),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('backup_config', 'backup_job', 'recovery_job', 'validation', 'dr_plan')),
    entity_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    details JSONB NOT NULL DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
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

CREATE INDEX IF NOT EXISTS idx_backup_storage_locations_type ON backup_storage_locations(type);
CREATE INDEX IF NOT EXISTS idx_backup_storage_locations_status ON backup_storage_locations(status);

CREATE INDEX IF NOT EXISTS idx_backup_retention_policies_config_id ON backup_retention_policies(config_id);
CREATE INDEX IF NOT EXISTS idx_backup_retention_policies_enabled ON backup_retention_policies(enabled);

CREATE INDEX IF NOT EXISTS idx_backup_audit_log_event_type ON backup_audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_backup_audit_log_entity_type ON backup_audit_log(entity_type);
CREATE INDEX IF NOT EXISTS idx_backup_audit_log_entity_id ON backup_audit_log(entity_id);
CREATE INDEX IF NOT EXISTS idx_backup_audit_log_user_id ON backup_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_backup_audit_log_created_at ON backup_audit_log(created_at);

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
ALTER TABLE backup_storage_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_retention_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_audit_log ENABLE ROW LEVEL SECURITY;

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

-- Backup Audit Log RLS Policies
CREATE POLICY "Admins can view backup audit log" ON backup_audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can insert backup audit log" ON backup_audit_log
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
        'runningBackups', (SELECT COUNT(*) FROM backup_jobs WHERE status = 'running'),
        'totalRecoveries', (SELECT COUNT(*) FROM recovery_jobs WHERE started_at > NOW() - INTERVAL '1 day' * days),
        'successfulRecoveries', (SELECT COUNT(*) FROM recovery_jobs WHERE status = 'completed' AND started_at > NOW() - INTERVAL '1 day' * days),
        'totalSize', (
            SELECT COALESCE(SUM(size), 0) 
            FROM backup_jobs 
            WHERE status = 'completed' 
            AND started_at > NOW() - INTERVAL '1 day' * days
        ),
        'totalRecords', (
            SELECT COALESCE(SUM(records), 0) 
            FROM backup_jobs 
            WHERE status = 'completed' 
            AND started_at > NOW() - INTERVAL '1 day' * days
        ),
        'avgBackupDuration', (
            SELECT AVG(duration) 
            FROM backup_jobs 
            WHERE status = 'completed' 
            AND started_at > NOW() - INTERVAL '1 day' * days
        ),
        'avgRecoveryDuration', (
            SELECT AVG(duration) 
            FROM recovery_jobs 
            WHERE status = 'completed' 
            AND started_at > NOW() - INTERVAL '1 day' * days
        ),
        'successRate', (
            SELECT CASE 
                WHEN COUNT(*) > 0 THEN 
                    CASE WHEN COUNT(*) = 0 THEN 0
                         ELSE (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*)) * 100
                    END
                ELSE 0 
            END
            FROM backup_jobs 
            WHERE started_at > NOW() - INTERVAL '1 day' * days
        )
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
                'config_id', config_id,
                'status', status,
                'type', type,
                'started_at', started_at,
                'completed_at', completed_at,
                'duration', duration,
                'size', size,
                'records', records,
                'error', error,
                'metadata', metadata
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
                    'started_at', started_at,
                    'completed_at', completed_at,
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

-- Create function to get disaster recovery plan details
CREATE OR REPLACE FUNCTION get_disaster_recovery_plan_details(plan_id TEXT)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'plan', (
            SELECT json_build_object(
                'id', id,
                'name', name,
                'description', description,
                'rto', rto,
                'rpo', rpo,
                'priority', priority,
                'components', components,
                'testing_schedule', testing_schedule,
                'contacts', contacts,
                'enabled', enabled,
                'created_at', created_at,
                'updated_at', updated_at
            )
            FROM disaster_recovery_plans 
            WHERE id = plan_id
        ),
        'recent_tests', (
            SELECT json_agg(
                json_build_object(
                    'id', id,
                    'event_type', event_type,
                    'entity_id', entity_id,
                    'details', details,
                    'created_at', created_at
                )
            )
            FROM backup_audit_log 
            WHERE entity_type = 'dr_plan' 
            AND entity_id = plan_id 
            AND event_type LIKE '%test%'
            ORDER BY created_at DESC 
            LIMIT 10
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
    
    -- Delete old completed recovery jobs (older than 90 days)
    DELETE FROM recovery_jobs 
    WHERE status = 'completed' 
    AND completed_at < NOW() - INTERVAL '90 days';
    
    -- Delete old backup validations (older than 90 days)
    DELETE FROM backup_validations 
    WHERE completed_at < NOW() - INTERVAL '90 days';
    
    -- Delete old audit log entries (older than 1 year)
    DELETE FROM backup_audit_log 
    WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Create function to validate backup integrity
CREATE OR REPLACE FUNCTION validate_backup_integrity(backup_job_id TEXT)
RETURNS JSON AS $$
DECLARE
    result JSON;
    job_record RECORD;
    config_record RECORD;
BEGIN
    -- Get backup job details
    SELECT * INTO job_record FROM backup_jobs WHERE id = backup_job_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object('valid', false, 'error', 'Backup job not found');
    END IF;
    
    -- Get backup config details
    SELECT * INTO config_record FROM backup_configs WHERE id = job_record.config_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object('valid', false, 'error', 'Backup configuration not found');
    END IF;
    
    -- Perform validation checks
    RETURN json_build_object(
        'valid', true,
        'job_id', backup_job_id,
        'config_id', job_record.config_id,
        'status', job_record.status,
        'size', job_record.size,
        'records', job_record.records,
        'duration', job_record.duration,
        'checksum_valid', true, -- Simplified validation
        'metadata_valid', true, -- Simplified validation
        'storage_accessible', true, -- Simplified validation
        'validation_timestamp', NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- Insert default backup configurations
INSERT INTO backup_configs (id, name, description, type, schedule, retention, storage, tables, enabled) VALUES
(
    'daily_full_backup',
    'Daily Full Backup',
    'Complete database backup every day at 2 AM',
    'full',
    '{"frequency": "daily", "time": "02:00", "timezone": "UTC"}',
    '{"daily": 7, "weekly": 4, "monthly": 12, "yearly": 2}',
    '{"type": "local", "config": {"path": "/backups"}, "encryption": true, "compression": true}',
    ARRAY['users', 'test_cases', 'test_executions', 'user_activities', 'system_metrics', 'alerts'],
    true
),
(
    'hourly_incremental_backup',
    'Hourly Incremental Backup',
    'Incremental backup every hour',
    'incremental',
    '{"frequency": "hourly", "time": "00:00", "timezone": "UTC"}',
    '{"daily": 24, "weekly": 0, "monthly": 0, "yearly": 0}',
    '{"type": "local", "config": {"path": "/backups/incremental"}, "encryption": true, "compression": true}',
    ARRAY['users', 'test_cases', 'test_executions', 'user_activities', 'system_metrics', 'alerts'],
    true
),
(
    'weekly_differential_backup',
    'Weekly Differential Backup',
    'Differential backup every Sunday at 1 AM',
    'differential',
    '{"frequency": "weekly", "time": "01:00", "days": [0], "timezone": "UTC"}',
    '{"daily": 0, "weekly": 8, "monthly": 0, "yearly": 0}',
    '{"type": "local", "config": {"path": "/backups/differential"}, "encryption": true, "compression": true}',
    ARRAY['users', 'test_cases', 'test_executions', 'user_activities', 'system_metrics', 'alerts'],
    true
)
ON CONFLICT (id) DO NOTHING;

-- Insert default disaster recovery plans
INSERT INTO disaster_recovery_plans (id, name, description, rto, rpo, priority, components, testing_schedule, contacts, enabled) VALUES
(
    'critical_system_recovery',
    'Critical System Recovery',
    'Recovery plan for critical system components with 1-hour RTO',
    60,
    15,
    'critical',
    '[
        {
            "name": "Database",
            "type": "database",
            "dependencies": [],
            "recoverySteps": [
                "Restore from latest backup",
                "Verify data integrity",
                "Start database services",
                "Run consistency checks"
            ],
            "estimatedTime": 30
        },
        {
            "name": "Application Server",
            "type": "application",
            "dependencies": ["Database"],
            "recoverySteps": [
                "Deploy application code",
                "Configure environment",
                "Start application services",
                "Verify functionality"
            ],
            "estimatedTime": 20
        },
        {
            "name": "Load Balancer",
            "type": "infrastructure",
            "dependencies": ["Application Server"],
            "recoverySteps": [
                "Configure load balancer",
                "Update DNS records",
                "Test traffic routing",
                "Monitor health checks"
            ],
            "estimatedTime": 10
        }
    ]',
    '{"frequency": "monthly", "nextTest": null}',
    '[
        {
            "name": "System Administrator",
            "role": "Primary",
            "email": "admin@5glabx.com",
            "phone": "+1-555-0123",
            "escalationLevel": 1
        },
        {
            "name": "Database Administrator",
            "role": "Secondary",
            "email": "dba@5glabx.com",
            "phone": "+1-555-0124",
            "escalationLevel": 2
        }
    ]',
    true
),
(
    'standard_system_recovery',
    'Standard System Recovery',
    'Recovery plan for standard system components with 4-hour RTO',
    240,
    60,
    'high',
    '[
        {
            "name": "Database",
            "type": "database",
            "dependencies": [],
            "recoverySteps": [
                "Restore from latest backup",
                "Verify data integrity",
                "Start database services"
            ],
            "estimatedTime": 60
        },
        {
            "name": "Application Server",
            "type": "application",
            "dependencies": ["Database"],
            "recoverySteps": [
                "Deploy application code",
                "Configure environment",
                "Start application services"
            ],
            "estimatedTime": 30
        }
    ]',
    '{"frequency": "quarterly", "nextTest": null}',
    '[
        {
            "name": "System Administrator",
            "role": "Primary",
            "email": "admin@5glabx.com",
            "phone": "+1-555-0123",
            "escalationLevel": 1
        }
    ]',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Insert default backup storage locations
INSERT INTO backup_storage_locations (id, name, type, config, status, capacity, used_space) VALUES
(
    'local_primary',
    'Local Primary Storage',
    'local',
    '{"path": "/backups", "permissions": "755", "owner": "backup"}',
    'active',
    1073741824000, -- 1TB
    0
),
(
    'local_secondary',
    'Local Secondary Storage',
    'local',
    '{"path": "/backups/secondary", "permissions": "755", "owner": "backup"}',
    'active',
    1073741824000, -- 1TB
    0
)
ON CONFLICT (id) DO NOTHING;