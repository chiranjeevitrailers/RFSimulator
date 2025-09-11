-- Load Testing & Scalability Tables Migration
-- This migration creates tables for comprehensive load testing and scalability analysis

-- Load Test Configurations Table
CREATE TABLE IF NOT EXISTS load_test_configs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('stress', 'spike', 'volume', 'endurance', 'scalability')),
    target JSONB NOT NULL DEFAULT '{}',
    load JSONB NOT NULL DEFAULT '{}',
    thresholds JSONB NOT NULL DEFAULT '{}',
    scenarios JSONB NOT NULL DEFAULT '[]',
    monitoring JSONB NOT NULL DEFAULT '{}',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Load Test Executions Table
CREATE TABLE IF NOT EXISTS load_test_executions (
    id TEXT PRIMARY KEY,
    config_id TEXT NOT NULL REFERENCES load_test_configs(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- seconds
    results JSONB NOT NULL DEFAULT '{}',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Performance Baselines Table
CREATE TABLE IF NOT EXISTS performance_baselines (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    baseline JSONB NOT NULL DEFAULT '{}',
    thresholds JSONB NOT NULL DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Scalability Tests Table
CREATE TABLE IF NOT EXISTS scalability_tests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('horizontal', 'vertical', 'auto-scaling')),
    target JSONB NOT NULL DEFAULT '{}',
    scaling JSONB NOT NULL DEFAULT '{}',
    metrics JSONB NOT NULL DEFAULT '{}',
    results JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')) DEFAULT 'pending',
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Load Test Metrics Table
CREATE TABLE IF NOT EXISTS load_test_metrics (
    id SERIAL PRIMARY KEY,
    execution_id TEXT NOT NULL REFERENCES load_test_executions(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    response_time DECIMAL(10,2) NOT NULL,
    throughput DECIMAL(10,2) NOT NULL,
    error_rate DECIMAL(5,2) NOT NULL,
    cpu_usage DECIMAL(5,2),
    memory_usage DECIMAL(5,2),
    disk_usage DECIMAL(5,2),
    network_usage DECIMAL(5,2),
    active_users INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Performance Test Results Table
CREATE TABLE IF NOT EXISTS performance_test_results (
    id SERIAL PRIMARY KEY,
    execution_id TEXT NOT NULL REFERENCES load_test_executions(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    total_requests INTEGER NOT NULL,
    successful_requests INTEGER NOT NULL,
    failed_requests INTEGER NOT NULL,
    average_response_time DECIMAL(10,2) NOT NULL,
    min_response_time DECIMAL(10,2) NOT NULL,
    max_response_time DECIMAL(10,2) NOT NULL,
    p50_response_time DECIMAL(10,2) NOT NULL,
    p90_response_time DECIMAL(10,2) NOT NULL,
    p95_response_time DECIMAL(10,2) NOT NULL,
    p99_response_time DECIMAL(10,2) NOT NULL,
    throughput DECIMAL(10,2) NOT NULL,
    error_rate DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Load Test Errors Table
CREATE TABLE IF NOT EXISTS load_test_errors (
    id SERIAL PRIMARY KEY,
    execution_id TEXT NOT NULL REFERENCES load_test_executions(id) ON DELETE CASCADE,
    error_type TEXT NOT NULL,
    error_message TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    percentage DECIMAL(5,2) NOT NULL,
    first_occurrence TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_occurrence TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Performance Benchmarks Table
CREATE TABLE IF NOT EXISTS performance_benchmarks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('api', 'database', 'frontend', 'system')),
    benchmark_type TEXT NOT NULL CHECK (benchmark_type IN ('response_time', 'throughput', 'resource_usage', 'scalability')),
    target_value DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('passing', 'warning', 'failing')) DEFAULT 'passing',
    last_measured TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    trend TEXT CHECK (trend IN ('improving', 'stable', 'degrading')),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_load_test_configs_type ON load_test_configs(type);
CREATE INDEX IF NOT EXISTS idx_load_test_configs_enabled ON load_test_configs(enabled);
CREATE INDEX IF NOT EXISTS idx_load_test_configs_created_at ON load_test_configs(created_at);

CREATE INDEX IF NOT EXISTS idx_load_test_executions_config_id ON load_test_executions(config_id);
CREATE INDEX IF NOT EXISTS idx_load_test_executions_status ON load_test_executions(status);
CREATE INDEX IF NOT EXISTS idx_load_test_executions_started_at ON load_test_executions(started_at);
CREATE INDEX IF NOT EXISTS idx_load_test_executions_completed_at ON load_test_executions(completed_at);

CREATE INDEX IF NOT EXISTS idx_performance_baselines_endpoint ON performance_baselines(endpoint);
CREATE INDEX IF NOT EXISTS idx_performance_baselines_method ON performance_baselines(method);
CREATE INDEX IF NOT EXISTS idx_performance_baselines_enabled ON performance_baselines(enabled);

CREATE INDEX IF NOT EXISTS idx_scalability_tests_type ON scalability_tests(type);
CREATE INDEX IF NOT EXISTS idx_scalability_tests_status ON scalability_tests(status);
CREATE INDEX IF NOT EXISTS idx_scalability_tests_started_at ON scalability_tests(started_at);

CREATE INDEX IF NOT EXISTS idx_load_test_metrics_execution_id ON load_test_metrics(execution_id);
CREATE INDEX IF NOT EXISTS idx_load_test_metrics_timestamp ON load_test_metrics(timestamp);

CREATE INDEX IF NOT EXISTS idx_performance_test_results_execution_id ON performance_test_results(execution_id);
CREATE INDEX IF NOT EXISTS idx_performance_test_results_endpoint ON performance_test_results(endpoint);

CREATE INDEX IF NOT EXISTS idx_load_test_errors_execution_id ON load_test_errors(execution_id);
CREATE INDEX IF NOT EXISTS idx_load_test_errors_type ON load_test_errors(error_type);

CREATE INDEX IF NOT EXISTS idx_performance_benchmarks_category ON performance_benchmarks(category);
CREATE INDEX IF NOT EXISTS idx_performance_benchmarks_type ON performance_benchmarks(benchmark_type);
CREATE INDEX IF NOT EXISTS idx_performance_benchmarks_status ON performance_benchmarks(status);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_load_test_configs_updated_at 
    BEFORE UPDATE ON load_test_configs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_performance_baselines_updated_at 
    BEFORE UPDATE ON performance_baselines 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scalability_tests_updated_at 
    BEFORE UPDATE ON scalability_tests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_performance_benchmarks_updated_at 
    BEFORE UPDATE ON performance_benchmarks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE load_test_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE load_test_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE scalability_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE load_test_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE load_test_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_benchmarks ENABLE ROW LEVEL SECURITY;

-- Load Test Configs RLS Policies
CREATE POLICY "Admins can manage load test configs" ON load_test_configs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Load Test Executions RLS Policies
CREATE POLICY "Admins can view all load test executions" ON load_test_executions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can insert load test executions" ON load_test_executions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update load test executions" ON load_test_executions
    FOR UPDATE WITH CHECK (true);

-- Performance Baselines RLS Policies
CREATE POLICY "Admins can manage performance baselines" ON performance_baselines
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Scalability Tests RLS Policies
CREATE POLICY "Admins can manage scalability tests" ON scalability_tests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Load Test Metrics RLS Policies
CREATE POLICY "Admins can view load test metrics" ON load_test_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can insert load test metrics" ON load_test_metrics
    FOR INSERT WITH CHECK (true);

-- Performance Test Results RLS Policies
CREATE POLICY "Admins can view performance test results" ON performance_test_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can insert performance test results" ON performance_test_results
    FOR INSERT WITH CHECK (true);

-- Load Test Errors RLS Policies
CREATE POLICY "Admins can view load test errors" ON load_test_errors
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can insert load test errors" ON load_test_errors
    FOR INSERT WITH CHECK (true);

-- Performance Benchmarks RLS Policies
CREATE POLICY "Admins can manage performance benchmarks" ON performance_benchmarks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Create function to get load testing statistics
CREATE OR REPLACE FUNCTION get_load_testing_statistics(days INTEGER DEFAULT 30)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'totalTests', (SELECT COUNT(*) FROM load_test_executions WHERE started_at > NOW() - INTERVAL '1 day' * days),
        'successfulTests', (SELECT COUNT(*) FROM load_test_executions WHERE status = 'completed' AND started_at > NOW() - INTERVAL '1 day' * days),
        'failedTests', (SELECT COUNT(*) FROM load_test_executions WHERE status = 'failed' AND started_at > NOW() - INTERVAL '1 day' * days),
        'runningTests', (SELECT COUNT(*) FROM load_test_executions WHERE status = 'running'),
        'avgResponseTime', (
            SELECT AVG((results->>'averageResponseTime')::DECIMAL) 
            FROM load_test_executions 
            WHERE status = 'completed' 
            AND started_at > NOW() - INTERVAL '1 day' * days
        ),
        'maxThroughput', (
            SELECT MAX((results->>'throughput')::DECIMAL) 
            FROM load_test_executions 
            WHERE status = 'completed' 
            AND started_at > NOW() - INTERVAL '1 day' * days
        ),
        'avgErrorRate', (
            SELECT AVG((results->>'errorRate')::DECIMAL) 
            FROM load_test_executions 
            WHERE status = 'completed' 
            AND started_at > NOW() - INTERVAL '1 day' * days
        ),
        'totalConfigs', (SELECT COUNT(*) FROM load_test_configs),
        'activeConfigs', (SELECT COUNT(*) FROM load_test_configs WHERE enabled = true),
        'totalBaselines', (SELECT COUNT(*) FROM performance_baselines),
        'activeBaselines', (SELECT COUNT(*) FROM performance_baselines WHERE enabled = true),
        'totalScalabilityTests', (SELECT COUNT(*) FROM scalability_tests),
        'completedScalabilityTests', (SELECT COUNT(*) FROM scalability_tests WHERE status = 'completed')
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to get performance trends
CREATE OR REPLACE FUNCTION get_performance_trends(endpoint TEXT, days INTEGER DEFAULT 7)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'endpoint', endpoint,
        'trends', (
            SELECT json_agg(
                json_build_object(
                    'date', DATE(started_at),
                    'avgResponseTime', (results->>'averageResponseTime')::DECIMAL,
                    'throughput', (results->>'throughput')::DECIMAL,
                    'errorRate', (results->>'errorRate')::DECIMAL,
                    'totalRequests', (results->>'totalRequests')::INTEGER
                )
            )
            FROM load_test_executions 
            WHERE status = 'completed' 
            AND (metadata->>'config'->>'target'->>'url') = endpoint
            AND started_at > NOW() - INTERVAL '1 day' * days
            ORDER BY started_at
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to get scalability analysis
CREATE OR REPLACE FUNCTION get_scalability_analysis(test_id TEXT)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'test', (
            SELECT json_build_object(
                'id', id,
                'name', name,
                'type', type,
                'status', status,
                'started_at', started_at,
                'completed_at', completed_at
            )
            FROM scalability_tests 
            WHERE id = test_id
        ),
        'metrics', (
            SELECT json_build_object(
                'responseTime', metrics->>'responseTime',
                'throughput', metrics->>'throughput',
                'resourceUsage', metrics->>'resourceUsage',
                'instanceCount', metrics->>'instanceCount'
            )
            FROM scalability_tests 
            WHERE id = test_id
        ),
        'results', (
            SELECT json_build_object(
                'optimalInstances', results->>'optimalInstances',
                'maxThroughput', results->>'maxThroughput',
                'bottlenecks', results->>'bottlenecks',
                'recommendations', results->>'recommendations'
            )
            FROM scalability_tests 
            WHERE id = test_id
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to clean up old load testing data
CREATE OR REPLACE FUNCTION cleanup_old_load_testing_data()
RETURNS void AS $$
BEGIN
    -- Delete old completed test executions (older than 90 days)
    DELETE FROM load_test_executions 
    WHERE status = 'completed' 
    AND completed_at < NOW() - INTERVAL '90 days';
    
    -- Delete old test metrics (older than 90 days)
    DELETE FROM load_test_metrics 
    WHERE timestamp < NOW() - INTERVAL '90 days';
    
    -- Delete old performance test results (older than 90 days)
    DELETE FROM performance_test_results 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- Delete old load test errors (older than 90 days)
    DELETE FROM load_test_errors 
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Insert default load test configurations
INSERT INTO load_test_configs (id, name, description, type, target, load, thresholds, scenarios, monitoring, enabled) VALUES
(
    'api_stress_test',
    'API Stress Test',
    'Stress test for main API endpoints with 100 virtual users',
    'stress',
    '{"url": "/api/test-cases", "method": "GET", "headers": {"Content-Type": "application/json"}, "timeout": 5000}',
    '{"virtualUsers": 100, "rampUpTime": 60, "duration": 300, "rampDownTime": 30, "thinkTime": 1}',
    '{"responseTime": 2000, "errorRate": 5, "throughput": 50, "cpuUsage": 80, "memoryUsage": 85}',
    '[{"name": "Browse Test Cases", "weight": 60, "steps": [{"action": "GET", "url": "/api/test-cases", "waitTime": 1}, {"action": "GET", "url": "/api/test-cases/1", "waitTime": 2}]}, {"name": "Create Test Case", "weight": 40, "steps": [{"action": "POST", "url": "/api/test-cases", "body": {"name": "Test Case"}, "waitTime": 3}]}]',
    '{"enabled": true, "metrics": ["response_time", "throughput", "error_rate"], "samplingRate": 100}',
    true
),
(
    'spike_test',
    'Spike Test',
    'Test system behavior under sudden load spikes with 200 virtual users',
    'spike',
    '{"url": "/api/simulations", "method": "POST", "headers": {"Content-Type": "application/json"}, "timeout": 10000}',
    '{"virtualUsers": 200, "rampUpTime": 10, "duration": 120, "rampDownTime": 10, "thinkTime": 0.5}',
    '{"responseTime": 5000, "errorRate": 10, "throughput": 100, "cpuUsage": 90, "memoryUsage": 90}',
    '[{"name": "Run Simulation", "weight": 100, "steps": [{"action": "POST", "url": "/api/simulations", "body": {"testCaseId": 1}, "waitTime": 2}]}]',
    '{"enabled": true, "metrics": ["response_time", "throughput", "error_rate", "cpu_usage"], "samplingRate": 100}',
    true
),
(
    'volume_test',
    'Volume Test',
    'Test system behavior under high volume of requests',
    'volume',
    '{"url": "/api/analytics", "method": "GET", "headers": {"Content-Type": "application/json"}, "timeout": 3000}',
    '{"virtualUsers": 50, "rampUpTime": 30, "duration": 600, "rampDownTime": 30, "thinkTime": 0.1}',
    '{"responseTime": 1000, "errorRate": 2, "throughput": 200, "cpuUsage": 70, "memoryUsage": 75}',
    '[{"name": "Analytics Query", "weight": 100, "steps": [{"action": "GET", "url": "/api/analytics", "waitTime": 0.1}]}]',
    '{"enabled": true, "metrics": ["response_time", "throughput", "error_rate"], "samplingRate": 100}',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Insert default performance baselines
INSERT INTO performance_baselines (id, name, description, endpoint, method, baseline, thresholds, enabled) VALUES
(
    'api_baseline',
    'API Performance Baseline',
    'Baseline performance metrics for API endpoints',
    '/api/test-cases',
    'GET',
    '{"averageResponseTime": 150, "p95ResponseTime": 300, "p99ResponseTime": 500, "throughput": 100, "errorRate": 0.1}',
    '{"responseTimeIncrease": 50, "throughputDecrease": 20, "errorRateIncrease": 2}',
    true
),
(
    'simulation_baseline',
    'Simulation Performance Baseline',
    'Baseline performance metrics for simulation endpoints',
    '/api/simulations',
    'POST',
    '{"averageResponseTime": 2000, "p95ResponseTime": 5000, "p99ResponseTime": 8000, "throughput": 20, "errorRate": 0.5}',
    '{"responseTimeIncrease": 100, "throughputDecrease": 30, "errorRateIncrease": 5}',
    true
),
(
    'analytics_baseline',
    'Analytics Performance Baseline',
    'Baseline performance metrics for analytics endpoints',
    '/api/analytics',
    'GET',
    '{"averageResponseTime": 500, "p95ResponseTime": 1000, "p99ResponseTime": 2000, "throughput": 50, "errorRate": 0.2}',
    '{"responseTimeIncrease": 50, "throughputDecrease": 25, "errorRateIncrease": 3}',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Insert default performance benchmarks
INSERT INTO performance_benchmarks (id, name, description, category, benchmark_type, target_value, current_value, unit, status, trend, enabled) VALUES
(
    'api_response_time',
    'API Response Time',
    'Average response time for API endpoints',
    'api',
    'response_time',
    200.00,
    150.00,
    'ms',
    'passing',
    'improving',
    true
),
(
    'api_throughput',
    'API Throughput',
    'Requests per second for API endpoints',
    'api',
    'throughput',
    100.00,
    120.00,
    'req/s',
    'passing',
    'improving',
    true
),
(
    'database_query_time',
    'Database Query Time',
    'Average database query execution time',
    'database',
    'response_time',
    50.00,
    35.00,
    'ms',
    'passing',
    'improving',
    true
),
(
    'frontend_load_time',
    'Frontend Load Time',
    'Page load time for frontend',
    'frontend',
    'response_time',
    2000.00,
    1500.00,
    'ms',
    'passing',
    'improving',
    true
),
(
    'system_cpu_usage',
    'System CPU Usage',
    'Average CPU usage during normal operation',
    'system',
    'resource_usage',
    70.00,
    45.00,
    '%',
    'passing',
    'stable',
    true
),
(
    'system_memory_usage',
    'System Memory Usage',
    'Average memory usage during normal operation',
    'system',
    'resource_usage',
    80.00,
    60.00,
    '%',
    'passing',
    'stable',
    true
)
ON CONFLICT (id) DO NOTHING;