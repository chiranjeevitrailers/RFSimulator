-- ==============================================
-- 5GLabX Platform - ML System Schema
-- Machine Learning for execution issue detection and recommendations
-- ==============================================

-- ==============================================
-- 1. ML EXECUTION TRACKING
-- ==============================================

-- Raw execution events (ingest)
CREATE TABLE IF NOT EXISTS public.ml_execution_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL,
    user_id UUID REFERENCES public.users(id),
    test_case_id TEXT NOT NULL,
    tech TEXT, -- e.g., NR, LTE, IMS
    stage TEXT, -- setup, execute, teardown
    event_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    level TEXT, -- info, warn, error
    code TEXT, -- error code or message key
    message TEXT,
    payload JSONB
);

-- Feature snapshots per run
CREATE TABLE IF NOT EXISTS public.ml_execution_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID UNIQUE NOT NULL,
    user_id UUID REFERENCES public.users(id),
    test_case_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    features JSONB NOT NULL
);

-- Labels/outcomes per run
CREATE TABLE IF NOT EXISTS public.ml_execution_labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID UNIQUE NOT NULL,
    outcome TEXT NOT NULL, -- pass, fail, timeout
    failure_class TEXT, -- e.g., auth_failure, rrc_timeout
    root_cause TEXT, -- optional curated root cause
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 2. ML MODEL REGISTRY
-- ==============================================

-- Model registry
CREATE TABLE IF NOT EXISTS public.ml_model_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name TEXT NOT NULL,
    version TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metrics JSONB, -- precision, recall, etc.
    artifact_url TEXT NOT NULL,
    active BOOLEAN DEFAULT FALSE
);

-- ==============================================
-- 3. ML RECOMMENDATIONS
-- ==============================================

-- Recommendations generated for runs
CREATE TABLE IF NOT EXISTS public.ml_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    recommendation TEXT NOT NULL,
    confidence NUMERIC,
    rationale TEXT,
    applied BOOLEAN DEFAULT FALSE,
    helpful BOOLEAN,
    metadata JSONB
);

-- ==============================================
-- 4. ML INDEXES FOR PERFORMANCE
-- ==============================================

-- ML execution events indexes
CREATE INDEX IF NOT EXISTS idx_ml_events_run ON public.ml_execution_events(run_id);
CREATE INDEX IF NOT EXISTS idx_ml_events_tc ON public.ml_execution_events(test_case_id);
CREATE INDEX IF NOT EXISTS idx_ml_events_user ON public.ml_execution_events(user_id);
CREATE INDEX IF NOT EXISTS idx_ml_events_time ON public.ml_execution_events(event_time);
CREATE INDEX IF NOT EXISTS idx_ml_events_level ON public.ml_execution_events(level);

-- ML execution features indexes
CREATE INDEX IF NOT EXISTS idx_ml_features_run ON public.ml_execution_features(run_id);
CREATE INDEX IF NOT EXISTS idx_ml_features_user ON public.ml_execution_features(user_id);
CREATE INDEX IF NOT EXISTS idx_ml_features_tc ON public.ml_execution_features(test_case_id);

-- ML execution labels indexes
CREATE INDEX IF NOT EXISTS idx_ml_labels_run ON public.ml_execution_labels(run_id);
CREATE INDEX IF NOT EXISTS idx_ml_labels_outcome ON public.ml_execution_labels(outcome);
CREATE INDEX IF NOT EXISTS idx_ml_labels_failure_class ON public.ml_execution_labels(failure_class);

-- ML model registry indexes
CREATE INDEX IF NOT EXISTS idx_ml_models_name ON public.ml_model_registry(model_name);
CREATE INDEX IF NOT EXISTS idx_ml_models_active ON public.ml_model_registry(active);
CREATE INDEX IF NOT EXISTS idx_ml_models_version ON public.ml_model_registry(version);

-- ML recommendations indexes
CREATE INDEX IF NOT EXISTS idx_ml_recommendations_run ON public.ml_recommendations(run_id);
CREATE INDEX IF NOT EXISTS idx_ml_recommendations_confidence ON public.ml_recommendations(confidence);
CREATE INDEX IF NOT EXISTS idx_ml_recommendations_helpful ON public.ml_recommendations(helpful);
CREATE INDEX IF NOT EXISTS idx_ml_recommendations_applied ON public.ml_recommendations(applied);

-- ==============================================
-- 5. ML ROW LEVEL SECURITY (RLS)
-- ==============================================

-- Enable RLS on ML tables
ALTER TABLE public.ml_execution_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_execution_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_execution_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_model_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_recommendations ENABLE ROW LEVEL SECURITY;

-- ML execution events policies
CREATE POLICY "Users can view their own ML events" ON public.ml_execution_events 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own ML events" ON public.ml_execution_events 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all ML events" ON public.ml_execution_events 
    FOR ALL TO service_role USING (true);

-- ML execution features policies
CREATE POLICY "Users can view their own ML features" ON public.ml_execution_features 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own ML features" ON public.ml_execution_features 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all ML features" ON public.ml_execution_features 
    FOR ALL TO service_role USING (true);

-- ML execution labels policies
CREATE POLICY "Users can view their own ML labels" ON public.ml_execution_labels 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.ml_execution_features 
            WHERE run_id = ml_execution_labels.run_id 
            AND user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert their own ML labels" ON public.ml_execution_labels 
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.ml_execution_features 
            WHERE run_id = ml_execution_labels.run_id 
            AND user_id = auth.uid()
        )
    );
CREATE POLICY "Admins can manage all ML labels" ON public.ml_execution_labels 
    FOR ALL TO service_role USING (true);

-- ML model registry policies (admin only)
CREATE POLICY "Admins can manage ML models" ON public.ml_model_registry 
    FOR ALL TO service_role USING (true);

-- ML recommendations policies
CREATE POLICY "Users can view their own ML recommendations" ON public.ml_recommendations 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.ml_execution_features 
            WHERE run_id = ml_recommendations.run_id 
            AND user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update their own ML recommendations" ON public.ml_recommendations 
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.ml_execution_features 
            WHERE run_id = ml_recommendations.run_id 
            AND user_id = auth.uid()
        )
    );
CREATE POLICY "Admins can manage all ML recommendations" ON public.ml_recommendations 
    FOR ALL TO service_role USING (true);

-- ==============================================
-- 6. ML FUNCTIONS
-- ==============================================

-- Function to extract features from execution events
CREATE OR REPLACE FUNCTION extract_ml_features(run_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    events_count INTEGER;
    errors_count INTEGER;
    warnings_count INTEGER;
    has_auth_failure BOOLEAN;
    has_timer_timeout BOOLEAN;
    has_rrc_reconfig BOOLEAN;
    first_error_code TEXT;
    features JSONB;
BEGIN
    -- Count events
    SELECT COUNT(*) INTO events_count
    FROM public.ml_execution_events
    WHERE run_id = run_uuid;
    
    -- Count errors and warnings
    SELECT 
        COUNT(*) FILTER (WHERE level = 'error'),
        COUNT(*) FILTER (WHERE level = 'warn' OR level = 'warning')
    INTO errors_count, warnings_count
    FROM public.ml_execution_events
    WHERE run_id = run_uuid;
    
    -- Check for specific patterns
    SELECT 
        EXISTS(SELECT 1 WHERE code = 'AUTH_FAILURE' OR message ILIKE '%auth%fail%'),
        EXISTS(SELECT 1 WHERE message ILIKE '%timeout%' OR message ILIKE '%T%d+%'),
        EXISTS(SELECT 1 WHERE message ILIKE '%rrc%reconfig%')
    INTO has_auth_failure, has_timer_timeout, has_rrc_reconfig
    FROM public.ml_execution_events
    WHERE run_id = run_uuid;
    
    -- Get first error code
    SELECT code INTO first_error_code
    FROM public.ml_execution_events
    WHERE run_id = run_uuid AND level = 'error'
    ORDER BY event_time
    LIMIT 1;
    
    -- Build features JSON
    features := jsonb_build_object(
        'num_events', events_count,
        'num_errors', errors_count,
        'num_warnings', warnings_count,
        'has_auth_failure', CASE WHEN has_auth_failure THEN 1 ELSE 0 END,
        'has_timer_timeout', CASE WHEN has_timer_timeout THEN 1 ELSE 0 END,
        'has_rrc_reconfig', CASE WHEN has_rrc_reconfig THEN 1 ELSE 0 END,
        'first_error_code', COALESCE(first_error_code, 'none')
    );
    
    RETURN features;
END;
$$ LANGUAGE plpgsql;

-- Function to get ML recommendations for a run
CREATE OR REPLACE FUNCTION get_ml_recommendations(run_uuid UUID)
RETURNS TABLE (
    recommendation_id UUID,
    recommendation TEXT,
    confidence NUMERIC,
    rationale TEXT,
    applied BOOLEAN,
    helpful BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.recommendation,
        r.confidence,
        r.rationale,
        r.applied,
        r.helpful
    FROM public.ml_recommendations r
    WHERE r.run_id = run_uuid
    ORDER BY r.confidence DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to mark recommendation as helpful
CREATE OR REPLACE FUNCTION mark_recommendation_helpful(rec_id UUID, is_helpful BOOLEAN)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.ml_recommendations
    SET helpful = is_helpful
    WHERE id = rec_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- 7. ML GRANT PERMISSIONS
-- ==============================================

-- Grant permissions for ML tables
GRANT SELECT, INSERT, UPDATE ON public.ml_execution_events TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.ml_execution_features TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.ml_execution_labels TO authenticated;
GRANT SELECT ON public.ml_model_registry TO authenticated;
GRANT SELECT, UPDATE ON public.ml_recommendations TO authenticated;

-- Grant all permissions to service role
GRANT ALL ON public.ml_execution_events TO service_role;
GRANT ALL ON public.ml_execution_features TO service_role;
GRANT ALL ON public.ml_execution_labels TO service_role;
GRANT ALL ON public.ml_model_registry TO service_role;
GRANT ALL ON public.ml_recommendations TO service_role;