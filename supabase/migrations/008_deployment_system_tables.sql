-- Deployment & CI/CD System Tables Migration
-- This migration creates tables for comprehensive deployment and CI/CD management

-- Deployment Configurations Table
CREATE TABLE IF NOT EXISTS deployment_configs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    environment TEXT NOT NULL CHECK (environment IN ('staging', 'production', 'development')),
    platform TEXT NOT NULL CHECK (platform IN ('netlify', 'vercel', 'aws', 'azure', 'gcp')),
    config JSONB NOT NULL DEFAULT '{}',
    monitoring JSONB NOT NULL DEFAULT '{}',
    security JSONB NOT NULL DEFAULT '{}',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Deployments Table
CREATE TABLE IF NOT EXISTS deployments (
    id TEXT PRIMARY KEY,
    config_id TEXT NOT NULL REFERENCES deployment_configs(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'building', 'deploying', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
    version TEXT NOT NULL,
    commit_hash TEXT NOT NULL,
    branch TEXT NOT NULL,
    environment TEXT NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- seconds
    url TEXT,
    error TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Environments Table
CREATE TABLE IF NOT EXISTS environments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('development', 'staging', 'production')),
    url TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'maintenance')) DEFAULT 'active',
    last_deployment TEXT REFERENCES deployments(id) ON DELETE SET NULL,
    version TEXT,
    health JSONB NOT NULL DEFAULT '{}',
    resources JSONB NOT NULL DEFAULT '{}',
    monitoring JSONB NOT NULL DEFAULT '{}',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Ensure column exists on re-runs
ALTER TABLE environments ADD COLUMN IF NOT EXISTS enabled BOOLEAN NOT NULL DEFAULT TRUE;

-- Deployment Pipelines Table
CREATE TABLE IF NOT EXISTS deployment_pipelines (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    stages JSONB NOT NULL DEFAULT '[]',
    triggers JSONB NOT NULL DEFAULT '{}',
    notifications JSONB NOT NULL DEFAULT '{}',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Deployment Logs Table
CREATE TABLE IF NOT EXISTS deployment_logs (
    id SERIAL PRIMARY KEY,
    deployment_id TEXT NOT NULL REFERENCES deployments(id) ON DELETE CASCADE,
    stage TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('info', 'warn', 'error', 'debug')) DEFAULT 'info',
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Deployment Metrics Table
CREATE TABLE IF NOT EXISTS deployment_metrics (
    id SERIAL PRIMARY KEY,
    deployment_id TEXT NOT NULL REFERENCES deployments(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    metric_unit TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- CI/CD Jobs Table
CREATE TABLE IF NOT EXISTS cicd_jobs (
    id TEXT PRIMARY KEY,
    pipeline_id TEXT NOT NULL REFERENCES deployment_pipelines(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
    stage TEXT NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- seconds
    logs TEXT,
    error TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Release Management Table
CREATE TABLE IF NOT EXISTS releases (
    id TEXT PRIMARY KEY,
    version TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'prerelease', 'release', 'deprecated')) DEFAULT 'draft',
    target_environment TEXT NOT NULL,
    deployment_id TEXT REFERENCES deployments(id) ON DELETE SET NULL,
    release_notes TEXT,
    changelog JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Rollback Plans Table
CREATE TABLE IF NOT EXISTS rollback_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    environment TEXT NOT NULL,
    triggers JSONB NOT NULL DEFAULT '{}',
    steps JSONB NOT NULL DEFAULT '[]',
    automated BOOLEAN NOT NULL DEFAULT FALSE,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deployment_configs_environment ON deployment_configs(environment);
CREATE INDEX IF NOT EXISTS idx_deployment_configs_platform ON deployment_configs(platform);
CREATE INDEX IF NOT EXISTS idx_deployment_configs_enabled ON deployment_configs(enabled);

CREATE INDEX IF NOT EXISTS idx_deployments_config_id ON deployments(config_id);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON deployments(status);
CREATE INDEX IF NOT EXISTS idx_deployments_environment ON deployments(environment);
CREATE INDEX IF NOT EXISTS idx_deployments_started_at ON deployments(started_at);
CREATE INDEX IF NOT EXISTS idx_deployments_completed_at ON deployments(completed_at);
CREATE INDEX IF NOT EXISTS idx_deployments_version ON deployments(version);

CREATE INDEX IF NOT EXISTS idx_environments_type ON environments(type);
CREATE INDEX IF NOT EXISTS idx_environments_status ON environments(status);
CREATE INDEX IF NOT EXISTS idx_environments_url ON environments(url);
CREATE INDEX IF NOT EXISTS idx_environments_enabled ON environments(enabled);

CREATE INDEX IF NOT EXISTS idx_deployment_pipelines_enabled ON deployment_pipelines(enabled);

CREATE INDEX IF NOT EXISTS idx_deployment_logs_deployment_id ON deployment_logs(deployment_id);
CREATE INDEX IF NOT EXISTS idx_deployment_logs_stage ON deployment_logs(stage);
CREATE INDEX IF NOT EXISTS idx_deployment_logs_level ON deployment_logs(level);
CREATE INDEX IF NOT EXISTS idx_deployment_logs_timestamp ON deployment_logs(timestamp);

CREATE INDEX IF NOT EXISTS idx_deployment_metrics_deployment_id ON deployment_metrics(deployment_id);
CREATE INDEX IF NOT EXISTS idx_deployment_metrics_name ON deployment_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_deployment_metrics_timestamp ON deployment_metrics(timestamp);

CREATE INDEX IF NOT EXISTS idx_cicd_jobs_pipeline_id ON cicd_jobs(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_cicd_jobs_status ON cicd_jobs(status);
CREATE INDEX IF NOT EXISTS idx_cicd_jobs_stage ON cicd_jobs(stage);
CREATE INDEX IF NOT EXISTS idx_cicd_jobs_started_at ON cicd_jobs(started_at);

CREATE INDEX IF NOT EXISTS idx_releases_version ON releases(version);
CREATE INDEX IF NOT EXISTS idx_releases_status ON releases(status);
CREATE INDEX IF NOT EXISTS idx_releases_environment ON releases(target_environment);
CREATE INDEX IF NOT EXISTS idx_releases_created_at ON releases(created_at);

CREATE INDEX IF NOT EXISTS idx_rollback_plans_environment ON rollback_plans(environment);
CREATE INDEX IF NOT EXISTS idx_rollback_plans_enabled ON rollback_plans(enabled);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_deployment_configs_updated_at 
    BEFORE UPDATE ON deployment_configs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_environments_updated_at 
    BEFORE UPDATE ON environments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deployment_pipelines_updated_at 
    BEFORE UPDATE ON deployment_pipelines 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_releases_updated_at 
    BEFORE UPDATE ON releases 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rollback_plans_updated_at 
    BEFORE UPDATE ON rollback_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE deployment_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployment_pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployment_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE cicd_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE rollback_plans ENABLE ROW LEVEL SECURITY;

-- Deployment Configs RLS Policies
CREATE POLICY "Admins can manage deployment configs" ON deployment_configs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Deployments RLS Policies
CREATE POLICY "Admins can view all deployments" ON deployments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can insert deployments" ON deployments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update deployments" ON deployments
    FOR UPDATE WITH CHECK (true);

-- Environments RLS Policies
CREATE POLICY "Admins can manage environments" ON environments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Deployment Pipelines RLS Policies
CREATE POLICY "Admins can manage deployment pipelines" ON deployment_pipelines
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Deployment Logs RLS Policies
CREATE POLICY "Admins can view deployment logs" ON deployment_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can insert deployment logs" ON deployment_logs
    FOR INSERT WITH CHECK (true);

-- Deployment Metrics RLS Policies
CREATE POLICY "Admins can view deployment metrics" ON deployment_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can insert deployment metrics" ON deployment_metrics
    FOR INSERT WITH CHECK (true);

-- CI/CD Jobs RLS Policies
CREATE POLICY "Admins can view cicd jobs" ON cicd_jobs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can insert cicd jobs" ON cicd_jobs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update cicd jobs" ON cicd_jobs
    FOR UPDATE WITH CHECK (true);

-- Releases RLS Policies
CREATE POLICY "Admins can manage releases" ON releases
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Rollback Plans RLS Policies
CREATE POLICY "Admins can manage rollback plans" ON rollback_plans
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Create function to get deployment statistics
CREATE OR REPLACE FUNCTION get_deployment_statistics(days INTEGER DEFAULT 30)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'totalDeployments', (SELECT COUNT(*) FROM deployments WHERE started_at > NOW() - INTERVAL '1 day' * days),
        'successfulDeployments', (SELECT COUNT(*) FROM deployments WHERE status = 'completed' AND started_at > NOW() - INTERVAL '1 day' * days),
        'failedDeployments', (SELECT COUNT(*) FROM deployments WHERE status = 'failed' AND started_at > NOW() - INTERVAL '1 day' * days),
        'runningDeployments', (SELECT COUNT(*) FROM deployments WHERE status IN ('pending', 'building', 'deploying')),
        'avgDeploymentTime', (
            SELECT AVG(duration) 
            FROM deployments 
            WHERE status = 'completed' 
            AND started_at > NOW() - INTERVAL '1 day' * days
        ),
        'totalEnvironments', (SELECT COUNT(*) FROM environments),
        'activeEnvironments', (SELECT COUNT(*) FROM environments WHERE status = 'active'),
        'totalPipelines', (SELECT COUNT(*) FROM deployment_pipelines),
        'activePipelines', (SELECT COUNT(*) FROM deployment_pipelines WHERE enabled = true),
        'totalReleases', (SELECT COUNT(*) FROM releases),
        'successRate', (
            SELECT CASE 
                WHEN COUNT(*) > 0 THEN 
                    CASE WHEN COUNT(*) = 0 THEN 0
                         ELSE (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*)) * 100
                    END 
                ELSE 0 
            END
            FROM deployments 
            WHERE started_at > NOW() - INTERVAL '1 day' * days
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to get deployment trends
CREATE OR REPLACE FUNCTION get_deployment_trends(environment TEXT, days INTEGER DEFAULT 7)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'environment', environment,
        'trends', (
            SELECT json_agg(
                json_build_object(
                    'date', DATE(started_at),
                    'totalDeployments', COUNT(*),
                    'successfulDeployments', COUNT(*) FILTER (WHERE status = 'completed'),
                    'failedDeployments', COUNT(*) FILTER (WHERE status = 'failed'),
                    'avgDuration', AVG(duration) FILTER (WHERE status = 'completed')
                )
            )
            FROM deployments 
            WHERE environment = $1
            AND started_at > NOW() - INTERVAL '1 day' * days
            GROUP BY DATE(started_at)
            ORDER BY DATE(started_at)
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to get environment health
CREATE OR REPLACE FUNCTION get_environment_health()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'environments', (
            SELECT json_agg(
                json_build_object(
                    'id', id,
                    'name', name,
                    'type', type,
                    'url', url,
                    'status', status,
                    'health', health,
                    'lastDeployment', last_deployment,
                    'version', version
                )
            )
            FROM environments
            ORDER BY type, name
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to clean up old deployment data
CREATE OR REPLACE FUNCTION cleanup_old_deployment_data()
RETURNS void AS $$
BEGIN
    -- Delete old completed deployments (older than 90 days)
    DELETE FROM deployments 
    WHERE status = 'completed' 
    AND completed_at < NOW() - INTERVAL '90 days';
    
    -- Delete old deployment logs (older than 90 days)
    DELETE FROM deployment_logs 
    WHERE timestamp < NOW() - INTERVAL '90 days';
    
    -- Delete old deployment metrics (older than 90 days)
    DELETE FROM deployment_metrics 
    WHERE timestamp < NOW() - INTERVAL '90 days';
    
    -- Delete old CI/CD jobs (older than 90 days)
    DELETE FROM cicd_jobs 
    WHERE completed_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Insert default deployment configurations
INSERT INTO deployment_configs (id, name, description, environment, platform, config, monitoring, security, enabled) VALUES
(
    'staging_config',
    'Staging Environment',
    'Staging deployment configuration for testing',
    'staging',
    'netlify',
    '{"buildCommand": "pnpm build", "outputDirectory": ".next", "environmentVariables": {"NODE_ENV": "staging", "NEXT_PUBLIC_API_URL": "https://staging-api.5glabx.com"}, "domain": "staging.5glabx.com", "ssl": true, "cdn": true, "compression": true, "caching": {"enabled": true, "ttl": 3600, "headers": {"Cache-Control": "public, max-age=3600"}}}',
    '{"enabled": true, "healthChecks": ["/api/health", "/api/status"], "uptimeMonitoring": true, "performanceMonitoring": true, "errorTracking": true}',
    '{"enabled": true, "headers": {"X-Frame-Options": "DENY", "X-Content-Type-Options": "nosniff", "X-XSS-Protection": "1; mode=block"}, "cors": {"enabled": true, "origins": ["https://staging.5glabx.com"]}, "rateLimiting": {"enabled": true, "requests": 1000, "window": 3600}}',
    true
),
(
    'production_config',
    'Production Environment',
    'Production deployment configuration',
    'production',
    'netlify',
    '{"buildCommand": "pnpm build", "outputDirectory": ".next", "environmentVariables": {"NODE_ENV": "production", "NEXT_PUBLIC_API_URL": "https://api.5glabx.com"}, "domain": "5glabx.com", "ssl": true, "cdn": true, "compression": true, "caching": {"enabled": true, "ttl": 86400, "headers": {"Cache-Control": "public, max-age=86400"}}}',
    '{"enabled": true, "healthChecks": ["/api/health", "/api/status", "/api/ready"], "uptimeMonitoring": true, "performanceMonitoring": true, "errorTracking": true}',
    '{"enabled": true, "headers": {"X-Frame-Options": "DENY", "X-Content-Type-Options": "nosniff", "X-XSS-Protection": "1; mode=block", "Strict-Transport-Security": "max-age=31536000; includeSubDomains"}, "cors": {"enabled": true, "origins": ["https://5glabx.com"]}, "rateLimiting": {"enabled": true, "requests": 5000, "window": 3600}}',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Insert default environments
INSERT INTO environments (id, name, description, type, url, status, health, resources, monitoring, enabled) VALUES
(
    'staging_env',
    'Staging',
    'Staging environment for testing',
    'staging',
    'https://staging.5glabx.com',
    'active',
    '{"status": "healthy", "lastCheck": "2024-01-01T00:00:00Z", "responseTime": 120, "uptime": 99.9}',
    '{"cpu": 2, "memory": 4, "storage": 20, "bandwidth": 100}',
    '{"enabled": true, "alerts": true, "logs": true, "metrics": true}',
    true
),
(
    'production_env',
    'Production',
    'Production environment',
    'production',
    'https://5glabx.com',
    'active',
    '{"status": "healthy", "lastCheck": "2024-01-01T00:00:00Z", "responseTime": 85, "uptime": 99.95}',
    '{"cpu": 8, "memory": 16, "storage": 100, "bandwidth": 1000}',
    '{"enabled": true, "alerts": true, "logs": true, "metrics": true}',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Insert default deployment pipeline
INSERT INTO deployment_pipelines (id, name, description, stages, triggers, notifications, enabled) VALUES
(
    'main_pipeline',
    'Main Deployment Pipeline',
    'Primary deployment pipeline for production releases',
    '[{"name": "Build", "type": "build", "order": 1, "enabled": true, "config": {"command": "pnpm build", "timeout": 600}}, {"name": "Test", "type": "test", "order": 2, "enabled": true, "config": {"command": "pnpm test", "coverage": true}}, {"name": "Deploy", "type": "deploy", "order": 3, "enabled": true, "config": {"environment": "production", "rollback": true}}, {"name": "Verify", "type": "verify", "order": 4, "enabled": true, "config": {"healthChecks": true, "smokeTests": true}}]',
    '{"branches": ["main"], "tags": ["v*"], "manual": true}',
    '{"slack": true, "email": true, "webhook": true}',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Insert default rollback plans
INSERT INTO rollback_plans (id, name, description, environment, triggers, steps, automated, enabled) VALUES
(
    'production_rollback',
    'Production Rollback Plan',
    'Automated rollback plan for production environment',
    'production',
    '{"errorRate": 5, "responseTime": 5000, "healthCheckFailures": 3}',
    '[{"name": "Stop Traffic", "description": "Stop routing traffic to current deployment", "estimatedTime": 30}, {"name": "Rollback Code", "description": "Deploy previous stable version", "estimatedTime": 300}, {"name": "Verify Rollback", "description": "Verify rollback was successful", "estimatedTime": 120}, {"name": "Resume Traffic", "description": "Resume normal traffic routing", "estimatedTime": 60}]',
    true,
    true
),
(
    'staging_rollback',
    'Staging Rollback Plan',
    'Manual rollback plan for staging environment',
    'staging',
    '{"manual": true}',
    '[{"name": "Stop Traffic", "description": "Stop routing traffic to current deployment", "estimatedTime": 30}, {"name": "Rollback Code", "description": "Deploy previous stable version", "estimatedTime": 180}, {"name": "Verify Rollback", "description": "Verify rollback was successful", "estimatedTime": 60}]',
    false,
    true
)
ON CONFLICT (id) DO NOTHING;