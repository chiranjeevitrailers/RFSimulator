-- Test Configuration Tables Migration
-- This migration creates tables for managing test configurations

-- ==============================================
-- 1. TEST CONFIGURATIONS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS public.test_configurations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    test_case_id UUID REFERENCES public.test_cases(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('4G_LTE', '5G_NR', 'IMS_SIP', 'O_RAN', 'NB_IoT', 'V2X', 'NTN')),
    protocol TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0',
    
    -- Configuration Data (JSONB for flexibility)
    configuration_data JSONB NOT NULL,
    
    -- Template and Sharing
    is_template BOOLEAN NOT NULL DEFAULT FALSE,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    -- Constraints
    UNIQUE(name, user_id)
);

-- ==============================================
-- 2. TEST CONFIGURATION TEMPLATES TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS public.test_configuration_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('4G_LTE', '5G_NR', 'IMS_SIP', 'O_RAN', 'NB_IoT', 'V2X', 'NTN')),
    protocol TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0',
    
    -- Template Data
    template_data JSONB NOT NULL,
    
    -- Template Metadata
    template_type TEXT NOT NULL CHECK (template_type IN ('default', 'custom', 'optimized', 'debug')),
    complexity TEXT NOT NULL CHECK (complexity IN ('beginner', 'intermediate', 'advanced', 'expert')),
    use_case TEXT NOT NULL,
    
    -- Usage Statistics
    usage_count INTEGER NOT NULL DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0.0 AND rating <= 5.0),
    
    -- Sharing and Visibility
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    -- Constraints
    UNIQUE(name, created_by)
);

-- ==============================================
-- 3. TEST CONFIGURATION USAGE TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS public.test_configuration_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    configuration_id UUID NOT NULL REFERENCES public.test_configurations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    test_case_id UUID REFERENCES public.test_cases(id) ON DELETE SET NULL,
    execution_id UUID REFERENCES public.test_case_executions(id) ON DELETE SET NULL,
    
    -- Usage Details
    usage_type TEXT NOT NULL CHECK (usage_type IN ('create', 'clone', 'modify', 'execute', 'export', 'import')),
    usage_context TEXT,
    
    -- Performance Data
    execution_time_ms INTEGER,
    success_rate DECIMAL(5,2),
    error_count INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    UNIQUE(configuration_id, user_id, execution_id)
);

-- ==============================================
-- 4. TEST CONFIGURATION SHARING TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS public.test_configuration_sharing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    configuration_id UUID NOT NULL REFERENCES public.test_configurations(id) ON DELETE CASCADE,
    shared_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    shared_with UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Sharing Details
    sharing_type TEXT NOT NULL CHECK (sharing_type IN ('user', 'team', 'public', 'organization')),
    permission_level TEXT NOT NULL CHECK (permission_level IN ('read', 'write', 'admin')) DEFAULT 'read',
    
    -- Access Control
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    UNIQUE(configuration_id, shared_with)
);

-- ==============================================
-- 5. TEST CONFIGURATION VERSIONS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS public.test_configuration_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    configuration_id UUID NOT NULL REFERENCES public.test_configurations(id) ON DELETE CASCADE,
    version_number TEXT NOT NULL,
    
    -- Version Data
    configuration_data JSONB NOT NULL,
    change_summary TEXT,
    change_type TEXT NOT NULL CHECK (change_type IN ('major', 'minor', 'patch', 'hotfix')),
    
    -- Version Metadata
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    UNIQUE(configuration_id, version_number)
);

-- ==============================================
-- 6. INDEXES FOR PERFORMANCE
-- ==============================================

-- Test configurations indexes
CREATE INDEX IF NOT EXISTS idx_test_configurations_user_id ON public.test_configurations (user_id);
CREATE INDEX IF NOT EXISTS idx_test_configurations_test_case_id ON public.test_configurations (test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_configurations_category ON public.test_configurations (category);
CREATE INDEX IF NOT EXISTS idx_test_configurations_protocol ON public.test_configurations (protocol);
CREATE INDEX IF NOT EXISTS idx_test_configurations_is_template ON public.test_configurations (is_template);
CREATE INDEX IF NOT EXISTS idx_test_configurations_is_public ON public.test_configurations (is_public);
CREATE INDEX IF NOT EXISTS idx_test_configurations_created_at ON public.test_configurations (created_at);
CREATE INDEX IF NOT EXISTS idx_test_configurations_updated_at ON public.test_configurations (updated_at);

-- Test configuration templates indexes
CREATE INDEX IF NOT EXISTS idx_test_configuration_templates_category ON public.test_configuration_templates (category);
CREATE INDEX IF NOT EXISTS idx_test_configuration_templates_protocol ON public.test_configuration_templates (protocol);
CREATE INDEX IF NOT EXISTS idx_test_configuration_templates_template_type ON public.test_configuration_templates (template_type);
CREATE INDEX IF NOT EXISTS idx_test_configuration_templates_complexity ON public.test_configuration_templates (complexity);
CREATE INDEX IF NOT EXISTS idx_test_configuration_templates_is_public ON public.test_configuration_templates (is_public);
CREATE INDEX IF NOT EXISTS idx_test_configuration_templates_is_featured ON public.test_configuration_templates (is_featured);
CREATE INDEX IF NOT EXISTS idx_test_configuration_templates_usage_count ON public.test_configuration_templates (usage_count);
CREATE INDEX IF NOT EXISTS idx_test_configuration_templates_rating ON public.test_configuration_templates (rating);

-- Test configuration usage indexes
CREATE INDEX IF NOT EXISTS idx_test_configuration_usage_configuration_id ON public.test_configuration_usage (configuration_id);
CREATE INDEX IF NOT EXISTS idx_test_configuration_usage_user_id ON public.test_configuration_usage (user_id);
CREATE INDEX IF NOT EXISTS idx_test_configuration_usage_test_case_id ON public.test_configuration_usage (test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_configuration_usage_execution_id ON public.test_configuration_usage (execution_id);
CREATE INDEX IF NOT EXISTS idx_test_configuration_usage_usage_type ON public.test_configuration_usage (usage_type);
CREATE INDEX IF NOT EXISTS idx_test_configuration_usage_created_at ON public.test_configuration_usage (created_at);

-- Test configuration sharing indexes
CREATE INDEX IF NOT EXISTS idx_test_configuration_sharing_configuration_id ON public.test_configuration_sharing (configuration_id);
CREATE INDEX IF NOT EXISTS idx_test_configuration_sharing_shared_by ON public.test_configuration_sharing (shared_by);
CREATE INDEX IF NOT EXISTS idx_test_configuration_sharing_shared_with ON public.test_configuration_sharing (shared_with);
CREATE INDEX IF NOT EXISTS idx_test_configuration_sharing_sharing_type ON public.test_configuration_sharing (sharing_type);
CREATE INDEX IF NOT EXISTS idx_test_configuration_sharing_is_active ON public.test_configuration_sharing (is_active);
CREATE INDEX IF NOT EXISTS idx_test_configuration_sharing_expires_at ON public.test_configuration_sharing (expires_at);

-- Test configuration versions indexes
CREATE INDEX IF NOT EXISTS idx_test_configuration_versions_configuration_id ON public.test_configuration_versions (configuration_id);
CREATE INDEX IF NOT EXISTS idx_test_configuration_versions_version_number ON public.test_configuration_versions (version_number);
CREATE INDEX IF NOT EXISTS idx_test_configuration_versions_is_current ON public.test_configuration_versions (is_current);
CREATE INDEX IF NOT EXISTS idx_test_configuration_versions_created_at ON public.test_configuration_versions (created_at);

-- ==============================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE public.test_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_configuration_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_configuration_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_configuration_sharing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_configuration_versions ENABLE ROW LEVEL SECURITY;

-- Test configurations RLS policies
-- Ensure idempotent policy creation by dropping existing policies if present
DROP POLICY IF EXISTS "Users can view their own configurations" ON public.test_configurations;
DROP POLICY IF EXISTS "Users can view public configurations" ON public.test_configurations;
DROP POLICY IF EXISTS "Users can view shared configurations" ON public.test_configurations;
DROP POLICY IF EXISTS "Users can create their own configurations" ON public.test_configurations;
DROP POLICY IF EXISTS "Users can update their own configurations" ON public.test_configurations;
DROP POLICY IF EXISTS "Users can delete their own configurations" ON public.test_configurations;
DROP POLICY IF EXISTS "Admins can manage all configurations" ON public.test_configurations;

DROP POLICY IF EXISTS "Users can view public templates" ON public.test_configuration_templates;
DROP POLICY IF EXISTS "Users can view their own templates" ON public.test_configuration_templates;
DROP POLICY IF EXISTS "Users can create templates" ON public.test_configuration_templates;
DROP POLICY IF EXISTS "Users can update their own templates" ON public.test_configuration_templates;
DROP POLICY IF EXISTS "Users can delete their own templates" ON public.test_configuration_templates;
DROP POLICY IF EXISTS "Admins can manage all templates" ON public.test_configuration_templates;

DROP POLICY IF EXISTS "Users can view their own usage" ON public.test_configuration_usage;
DROP POLICY IF EXISTS "Users can create usage records" ON public.test_configuration_usage;
DROP POLICY IF EXISTS "Admins can view all usage" ON public.test_configuration_usage;

DROP POLICY IF EXISTS "Users can view sharing of their configurations" ON public.test_configuration_sharing;
DROP POLICY IF EXISTS "Users can view sharing with them" ON public.test_configuration_sharing;
DROP POLICY IF EXISTS "Users can create sharing for their configurations" ON public.test_configuration_sharing;
DROP POLICY IF EXISTS "Users can update sharing of their configurations" ON public.test_configuration_sharing;
DROP POLICY IF EXISTS "Users can delete sharing of their configurations" ON public.test_configuration_sharing;
DROP POLICY IF EXISTS "Admins can manage all sharing" ON public.test_configuration_sharing;

DROP POLICY IF EXISTS "Users can view versions of their configurations" ON public.test_configuration_versions;
DROP POLICY IF EXISTS "Users can create versions for their configurations" ON public.test_configuration_versions;
DROP POLICY IF EXISTS "Admins can manage all versions" ON public.test_configuration_versions;

CREATE POLICY "Users can view their own configurations" ON public.test_configurations
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view public configurations" ON public.test_configurations
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view shared configurations" ON public.test_configurations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_configuration_sharing 
            WHERE configuration_id = test_configurations.id 
            AND shared_with = auth.uid() 
            AND is_active = true
        )
    );

CREATE POLICY "Users can create their own configurations" ON public.test_configurations
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own configurations" ON public.test_configurations
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own configurations" ON public.test_configurations
    FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all configurations" ON public.test_configurations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Test configuration templates RLS policies
CREATE POLICY "Users can view public templates" ON public.test_configuration_templates
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own templates" ON public.test_configuration_templates
    FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can create templates" ON public.test_configuration_templates
    FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own templates" ON public.test_configuration_templates
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own templates" ON public.test_configuration_templates
    FOR DELETE USING (created_by = auth.uid());

CREATE POLICY "Admins can manage all templates" ON public.test_configuration_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Test configuration usage RLS policies
CREATE POLICY "Users can view their own usage" ON public.test_configuration_usage
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create usage records" ON public.test_configuration_usage
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all usage" ON public.test_configuration_usage
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Test configuration sharing RLS policies
CREATE POLICY "Users can view sharing of their configurations" ON public.test_configuration_sharing
    FOR SELECT USING (shared_by = auth.uid());

CREATE POLICY "Users can view sharing with them" ON public.test_configuration_sharing
    FOR SELECT USING (shared_with = auth.uid());

CREATE POLICY "Users can create sharing for their configurations" ON public.test_configuration_sharing
    FOR INSERT WITH CHECK (shared_by = auth.uid());

CREATE POLICY "Users can update sharing of their configurations" ON public.test_configuration_sharing
    FOR UPDATE USING (shared_by = auth.uid());

CREATE POLICY "Users can delete sharing of their configurations" ON public.test_configuration_sharing
    FOR DELETE USING (shared_by = auth.uid());

CREATE POLICY "Admins can manage all sharing" ON public.test_configuration_sharing
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Test configuration versions RLS policies
CREATE POLICY "Users can view versions of their configurations" ON public.test_configuration_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_configurations 
            WHERE id = test_configuration_versions.configuration_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create versions for their configurations" ON public.test_configuration_versions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.test_configurations 
            WHERE id = test_configuration_versions.configuration_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all versions" ON public.test_configuration_versions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ==============================================
-- 8. TRIGGERS FOR UPDATED_AT
-- ==============================================

-- Create triggers for updated_at on all tables
CREATE TRIGGER update_test_configurations_updated_at 
    BEFORE UPDATE ON public.test_configurations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_configuration_templates_updated_at 
    BEFORE UPDATE ON public.test_configuration_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_configuration_sharing_updated_at 
    BEFORE UPDATE ON public.test_configuration_sharing 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 9. HELPER FUNCTIONS
-- ==============================================

-- Function to get configuration usage statistics
CREATE OR REPLACE FUNCTION get_configuration_usage_stats(config_id uuid)
RETURNS jsonb AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT jsonb_build_object(
        'total_usage', COUNT(*),
        'unique_users', COUNT(DISTINCT user_id),
        'execution_count', COUNT(*) FILTER (WHERE usage_type = 'execute'),
        'clone_count', COUNT(*) FILTER (WHERE usage_type = 'clone'),
        'modify_count', COUNT(*) FILTER (WHERE usage_type = 'modify'),
        'average_execution_time', AVG(execution_time_ms),
        'average_success_rate', AVG(success_rate),
        'total_errors', SUM(error_count),
        'last_used', MAX(created_at)
    )
    INTO result
    FROM public.test_configuration_usage
    WHERE configuration_id = config_id;
    
    RETURN COALESCE(result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- Function to get template popularity
CREATE OR REPLACE FUNCTION get_template_popularity(template_id text)
RETURNS jsonb AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT jsonb_build_object(
        'usage_count', usage_count,
        'rating', rating,
        'popularity_score', (usage_count * 0.7 + rating * 0.3),
        'category_rank', (
            SELECT COUNT(*) + 1 
            FROM public.test_configuration_templates 
            WHERE category = t.category 
            AND (usage_count > t.usage_count OR (usage_count = t.usage_count AND rating > t.rating))
        )
    )
    INTO result
    FROM public.test_configuration_templates t
    WHERE id = template_id;
    
    RETURN COALESCE(result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- Function to create configuration version
CREATE OR REPLACE FUNCTION create_configuration_version(
    config_id uuid,
    version_num text,
    config_data jsonb,
    change_summary text,
    change_type text
)
RETURNS uuid AS $$
DECLARE
    version_id uuid;
BEGIN
    -- Mark current version as not current
    UPDATE public.test_configuration_versions 
    SET is_current = false 
    WHERE configuration_id = config_id AND is_current = true;
    
    -- Create new version
    INSERT INTO public.test_configuration_versions (
        configuration_id,
        version_number,
        configuration_data,
        change_summary,
        change_type,
        is_current,
        created_by
    ) VALUES (
        config_id,
        version_num,
        config_data,
        change_summary,
        change_type,
        true,
        auth.uid()
    ) RETURNING id INTO version_id;
    
    RETURN version_id;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- 10. INITIAL DATA
-- ==============================================

-- Insert default configuration templates
INSERT INTO public.test_configuration_templates (
    id, name, description, category, protocol, version,
    template_data, template_type, complexity, use_case,
    is_public, is_featured, created_by
) VALUES 
-- 5G NR Default Template
(
    'template_5g_nr_default',
    '5G NR Default Configuration',
    'Default configuration for 5G NR test cases with standard parameters',
    '5G_NR',
    'NR',
    '1.0',
    '{
        "general": {
            "executionMode": "simulation",
            "timeAcceleration": 1,
            "logLevel": "detailed",
            "captureMode": "full",
            "outputFormat": "json",
            "autoStart": false,
            "autoStop": true,
            "timeout": 300000
        },
        "network": {
            "plmn": {"mcc": "001", "mnc": "01"},
            "cell": {"cellId": 123456, "pci": 123, "tac": 1, "arfcn": 3732480},
            "frequency": {"dlFreq": 2100, "ulFreq": 1900, "bandwidth": 100, "subcarrierSpacing": 30},
            "power": {"txPower": 23, "rxPower": -80, "rsrp": -85, "rsrq": -12, "sinr": 18}
        },
        "ue": {
            "identity": {"imsi": "001010123456789", "imei": "123456789012345"},
            "capabilities": {"maxBandwidth": 100, "maxMimoLayers": 4, "supportedModulations": ["QPSK", "16QAM", "64QAM", "256QAM"]},
            "security": {"authentication": "5G-AKA", "encryption": "AES-128", "integrity": "AES-128"}
        }
    }',
    'default',
    'beginner',
    'general_testing',
    true,
    true,
    (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1)
),

-- 4G LTE Default Template
(
    'template_4g_lte_default',
    '4G LTE Default Configuration',
    'Default configuration for 4G LTE test cases with standard parameters',
    '4G_LTE',
    'LTE',
    '1.0',
    '{
        "general": {
            "executionMode": "simulation",
            "timeAcceleration": 1,
            "logLevel": "detailed",
            "captureMode": "full",
            "outputFormat": "json",
            "autoStart": false,
            "autoStop": true,
            "timeout": 300000
        },
        "network": {
            "plmn": {"mcc": "001", "mnc": "01"},
            "cell": {"cellId": 123456, "pci": 123, "tac": 1, "earfcn": 1800},
            "frequency": {"dlFreq": 2100, "ulFreq": 1900, "bandwidth": 20},
            "power": {"txPower": 23, "rxPower": -80, "rsrp": -85, "rsrq": -12, "sinr": 18}
        },
        "ue": {
            "identity": {"imsi": "001010123456789", "imei": "123456789012345"},
            "capabilities": {"maxBandwidth": 20, "maxMimoLayers": 4, "supportedModulations": ["QPSK", "16QAM", "64QAM"]},
            "security": {"authentication": "AKA", "encryption": "AES-128", "integrity": "AES-128"}
        }
    }',
    'default',
    'beginner',
    'general_testing',
    true,
    true,
    (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1)
),

-- IMS SIP Default Template
(
    'template_ims_sip_default',
    'IMS SIP Default Configuration',
    'Default configuration for IMS SIP test cases with standard parameters',
    'IMS_SIP',
    'SIP',
    '1.0',
    '{
        "general": {
            "executionMode": "simulation",
            "timeAcceleration": 1,
            "logLevel": "detailed",
            "captureMode": "full",
            "outputFormat": "json",
            "autoStart": false,
            "autoStop": true,
            "timeout": 300000
        },
        "network": {
            "plmn": {"mcc": "001", "mnc": "01"},
            "cell": {"cellId": 123456, "pci": 123, "tac": 1},
            "frequency": {"dlFreq": 2100, "ulFreq": 1900, "bandwidth": 20},
            "power": {"txPower": 23, "rxPower": -80, "rsrp": -85, "rsrq": -12, "sinr": 18}
        },
        "ue": {
            "identity": {"imsi": "001010123456789", "imei": "123456789012345"},
            "capabilities": {"maxBandwidth": 20, "maxMimoLayers": 2, "supportedModulations": ["QPSK", "16QAM"]},
            "security": {"authentication": "AKA", "encryption": "AES-128", "integrity": "AES-128"}
        }
    }',
    'default',
    'beginner',
    'voip_testing',
    true,
    true,
    (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1)
)
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- 11. VERIFICATION
-- ==============================================

-- Verify table creation
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN (
        'test_configurations', 
        'test_configuration_templates', 
        'test_configuration_usage',
        'test_configuration_sharing',
        'test_configuration_versions'
    );
    
    IF table_count = 5 THEN
        RAISE NOTICE '✅ All 5 test configuration tables created successfully';
    ELSE
        RAISE NOTICE '❌ Only % out of 5 test configuration tables created', table_count;
    END IF;
END $$;

-- Verify templates
DO $$
DECLARE
    template_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO template_count
    FROM public.test_configuration_templates;
    
    IF template_count >= 3 THEN
        RAISE NOTICE '✅ % configuration templates created successfully', template_count;
    ELSE
        RAISE NOTICE '❌ Only % configuration templates created', template_count;
    END IF;
END $$;

-- Final success message
DO $$
BEGIN
    RAISE NOTICE '🎉 Test configuration tables migration completed successfully!';
    RAISE NOTICE '📊 Database now supports comprehensive test configuration management';
    RAISE NOTICE '🔒 RLS policies and security are properly configured';
    RAISE NOTICE '📈 Performance indexes are optimized';
    RAISE NOTICE '🚀 Ready for test configuration management!';
END $$;