-- ==============================================
-- 5GLabX Platform - Comprehensive 1000 Test Cases Database
-- Complete database design for all 1000 test cases with messages, IEs, and parameters
-- ==============================================

-- ==============================================
-- 1. ENHANCED TEST CASE CATEGORIES
-- ==============================================

-- Test case categories for better organization
CREATE TABLE IF NOT EXISTS public.test_case_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_category_id UUID REFERENCES public.test_case_categories(id),
    protocol_focus TEXT[], -- ['5G-NR', 'LTE', '3G', '2G', 'IMS', 'SIP']
    layer_focus TEXT[], -- ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS']
    complexity_level TEXT CHECK (complexity_level IN ('basic', 'intermediate', 'advanced', 'expert')),
    standard_references TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure parent_category_id exists for legacy installs
ALTER TABLE public.test_case_categories
ADD COLUMN IF NOT EXISTS parent_category_id UUID REFERENCES public.test_case_categories(id);

-- Ensure new array/text columns exist for legacy installs
ALTER TABLE public.test_case_categories
ADD COLUMN IF NOT EXISTS protocol_focus TEXT[];

ALTER TABLE public.test_case_categories
ADD COLUMN IF NOT EXISTS layer_focus TEXT[];

ALTER TABLE public.test_case_categories
ADD COLUMN IF NOT EXISTS standard_references TEXT[];

-- Ensure complexity_level exists with valid values
ALTER TABLE public.test_case_categories
ADD COLUMN IF NOT EXISTS complexity_level TEXT CHECK (complexity_level IN ('basic', 'intermediate', 'advanced', 'expert'));

-- ==============================================
-- 2. ENHANCED TEST CASE DEFINITIONS
-- ==============================================

-- Add additional columns to test_cases for comprehensive coverage
ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.test_case_categories(id),
ADD COLUMN IF NOT EXISTS subcategory TEXT,
ADD COLUMN IF NOT EXISTS test_scenario TEXT,
ADD COLUMN IF NOT EXISTS test_objective TEXT,
ADD COLUMN IF NOT EXISTS prerequisites TEXT[],
ADD COLUMN IF NOT EXISTS test_environment JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS expected_outcomes JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS failure_criteria JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS test_data_requirements JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS measurement_points JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS kpi_requirements JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS automation_level TEXT DEFAULT 'manual' CHECK (automation_level IN ('manual', 'semi_automated', 'fully_automated')),
ADD COLUMN IF NOT EXISTS execution_priority INTEGER DEFAULT 5 CHECK (execution_priority BETWEEN 1 AND 10),
ADD COLUMN IF NOT EXISTS estimated_duration_minutes INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS resource_requirements JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS dependencies TEXT[],
ADD COLUMN IF NOT EXISTS related_test_cases UUID[],
ADD COLUMN IF NOT EXISTS version_history JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_updated_by UUID REFERENCES public.users(id),
ADD COLUMN IF NOT EXISTS review_status TEXT DEFAULT 'draft' CHECK (review_status IN ('draft', 'review', 'approved', 'deprecated'));

-- ==============================================
-- 3. COMPREHENSIVE MESSAGE TEMPLATES
-- ==============================================

-- Message templates for different protocols and layers
CREATE TABLE IF NOT EXISTS public.message_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_name TEXT NOT NULL,
    protocol TEXT NOT NULL,
    layer TEXT NOT NULL,
    message_type TEXT NOT NULL,
    message_name TEXT NOT NULL,
    message_description TEXT,
    direction TEXT NOT NULL CHECK (direction IN ('UL', 'DL', 'BIDIRECTIONAL')),
    standard_reference TEXT,
    release_version TEXT,
    message_structure JSONB NOT NULL, -- Complete message structure
    mandatory_fields JSONB DEFAULT '{}',
    optional_fields JSONB DEFAULT '{}',
    conditional_fields JSONB DEFAULT '{}',
    validation_rules JSONB DEFAULT '{}',
    example_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 4. COMPREHENSIVE INFORMATION ELEMENT LIBRARY
-- ==============================================

-- Comprehensive IE library for all protocols
CREATE TABLE IF NOT EXISTS public.information_element_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ie_name TEXT NOT NULL,
    ie_type TEXT NOT NULL,
    protocol TEXT NOT NULL,
    layer TEXT NOT NULL,
    message_types TEXT[] NOT NULL, -- Which message types use this IE
    ie_description TEXT,
    ie_structure JSONB NOT NULL, -- Complete IE structure
    data_type TEXT NOT NULL, -- 'integer', 'bit_string', 'enumerated', 'octet_string', 'object'
    size_bits INTEGER,
    size_bytes INTEGER,
    mandatory BOOLEAN DEFAULT false,
    conditional BOOLEAN DEFAULT false,
    condition_description TEXT,
    allowed_values JSONB DEFAULT '{}',
    value_range JSONB DEFAULT '{}',
    default_value JSONB,
    validation_rules JSONB DEFAULT '{}',
    standard_reference TEXT,
    release_version TEXT,
    ie_examples JSONB DEFAULT '{}',
    related_ies TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 5. COMPREHENSIVE LAYER PARAMETER LIBRARY
-- ==============================================

-- Comprehensive layer parameter library
CREATE TABLE IF NOT EXISTS public.layer_parameter_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parameter_name TEXT NOT NULL,
    parameter_type TEXT NOT NULL,
    layer TEXT NOT NULL,
    protocol TEXT NOT NULL,
    parameter_category TEXT, -- 'radio', 'security', 'mobility', 'configuration', 'measurement'
    parameter_description TEXT,
    data_type TEXT NOT NULL, -- 'integer', 'float', 'string', 'boolean', 'object', 'array'
    unit TEXT,
    default_value JSONB,
    min_value JSONB,
    max_value JSONB,
    allowed_values JSONB DEFAULT '{}',
    validation_rules JSONB DEFAULT '{}',
    measurement_method TEXT,
    accuracy_requirements JSONB DEFAULT '{}',
    standard_reference TEXT,
    release_version TEXT,
    parameter_examples JSONB DEFAULT '{}',
    related_parameters TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 6. ENHANCED TEST CASE MESSAGES
-- ==============================================

-- Add additional columns to test_case_messages
ALTER TABLE public.test_case_messages 
ADD COLUMN IF NOT EXISTS message_template_id UUID REFERENCES public.message_templates(id),
ADD COLUMN IF NOT EXISTS message_variant TEXT,
ADD COLUMN IF NOT EXISTS message_priority INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS retry_interval_ms INTEGER DEFAULT 1000,
ADD COLUMN IF NOT EXISTS success_criteria JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS failure_criteria JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS measurement_criteria JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS message_sequence_group TEXT,
ADD COLUMN IF NOT EXISTS parallel_execution BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS conditional_execution JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS message_payload JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS expected_response_time_ms INTEGER,
ADD COLUMN IF NOT EXISTS max_response_time_ms INTEGER,
ADD COLUMN IF NOT EXISTS message_size_bytes INTEGER,
ADD COLUMN IF NOT EXISTS compression_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS encryption_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS integrity_protection BOOLEAN DEFAULT false;

-- ==============================================
-- 7. ENHANCED TEST CASE INFORMATION ELEMENTS
-- ==============================================

-- Add additional columns to test_case_information_elements
ALTER TABLE public.test_case_information_elements 
ADD COLUMN IF NOT EXISTS ie_library_id UUID REFERENCES public.information_element_library(id),
ADD COLUMN IF NOT EXISTS ie_variant TEXT,
ADD COLUMN IF NOT EXISTS ie_priority INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS ie_condition JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ie_validation_rules JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ie_measurement_criteria JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ie_relationship JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ie_dependencies TEXT[],
ADD COLUMN IF NOT EXISTS ie_alternatives TEXT[],
ADD COLUMN IF NOT EXISTS ie_encoding TEXT,
ADD COLUMN IF NOT EXISTS ie_compression BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ie_encryption BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ie_integrity_protection BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ie_size_variable BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ie_size_expression TEXT,
ADD COLUMN IF NOT EXISTS ie_value_expression TEXT,
ADD COLUMN IF NOT EXISTS ie_validation_expression TEXT;

-- ==============================================
-- 8. ENHANCED TEST CASE LAYER PARAMETERS
-- ==============================================

-- Add additional columns to test_case_layer_parameters
ALTER TABLE public.test_case_layer_parameters 
ADD COLUMN IF NOT EXISTS parameter_library_id UUID REFERENCES public.layer_parameter_library(id),
ADD COLUMN IF NOT EXISTS parameter_variant TEXT,
ADD COLUMN IF NOT EXISTS parameter_priority INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS parameter_condition JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS parameter_validation_rules JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS parameter_measurement_criteria JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS parameter_relationship JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS parameter_dependencies TEXT[],
ADD COLUMN IF NOT EXISTS parameter_alternatives TEXT[],
ADD COLUMN IF NOT EXISTS parameter_accuracy DECIMAL(10,6),
ADD COLUMN IF NOT EXISTS parameter_precision DECIMAL(10,6),
ADD COLUMN IF NOT EXISTS parameter_resolution DECIMAL(10,6),
ADD COLUMN IF NOT EXISTS parameter_calibration JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS parameter_measurement_method TEXT,
ADD COLUMN IF NOT EXISTS parameter_measurement_interval_ms INTEGER,
ADD COLUMN IF NOT EXISTS parameter_thresholds JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS parameter_alarms JSONB DEFAULT '{}';

-- ==============================================
-- 9. TEST CASE EXECUTION TEMPLATES
-- ==============================================

-- Templates for test case execution
CREATE TABLE IF NOT EXISTS public.test_execution_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_name TEXT NOT NULL,
    template_description TEXT,
    protocol TEXT NOT NULL,
    layer TEXT NOT NULL,
    test_scenario TEXT NOT NULL,
    execution_sequence JSONB NOT NULL, -- Complete execution sequence
    message_flow JSONB NOT NULL, -- Message flow definition
    ie_requirements JSONB NOT NULL, -- IE requirements
    parameter_requirements JSONB NOT NULL, -- Parameter requirements
    validation_criteria JSONB NOT NULL, -- Validation criteria
    success_criteria JSONB NOT NULL, -- Success criteria
    failure_criteria JSONB NOT NULL, -- Failure criteria
    measurement_points JSONB NOT NULL, -- Measurement points
    kpi_requirements JSONB NOT NULL, -- KPI requirements
    execution_configuration JSONB DEFAULT '{}',
    resource_requirements JSONB DEFAULT '{}',
    estimated_duration_minutes INTEGER DEFAULT 5,
    complexity_score INTEGER DEFAULT 5 CHECK (complexity_score BETWEEN 1 AND 10),
    automation_level TEXT DEFAULT 'manual' CHECK (automation_level IN ('manual', 'semi_automated', 'fully_automated')),
    standard_reference TEXT,
    release_version TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 10. TEST CASE DEPENDENCIES
-- ==============================================

-- Test case dependencies and relationships
CREATE TABLE IF NOT EXISTS public.test_case_dependencies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_case_id UUID NOT NULL REFERENCES public.test_cases(id) ON DELETE CASCADE,
    depends_on_test_case_id UUID NOT NULL REFERENCES public.test_cases(id) ON DELETE CASCADE,
    dependency_type TEXT NOT NULL CHECK (dependency_type IN ('prerequisite', 'sequence', 'parallel', 'conditional', 'exclusive')),
    dependency_condition JSONB DEFAULT '{}',
    dependency_description TEXT,
    is_mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 11. TEST CASE VERSIONS
-- ==============================================

-- Version control for test cases
CREATE TABLE IF NOT EXISTS public.test_case_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_case_id UUID NOT NULL REFERENCES public.test_cases(id) ON DELETE CASCADE,
    version_number TEXT NOT NULL,
    version_description TEXT,
    changes_summary TEXT,
    created_by UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_current BOOLEAN DEFAULT false,
    version_data JSONB NOT NULL -- Complete test case data at this version
);

-- ==============================================
-- 12. COMPREHENSIVE INDEXES
-- ==============================================

-- Indexes for test case categories
CREATE INDEX IF NOT EXISTS idx_test_case_categories_name ON public.test_case_categories(name);
CREATE INDEX IF NOT EXISTS idx_test_case_categories_parent ON public.test_case_categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_test_case_categories_protocol ON public.test_case_categories USING GIN(protocol_focus);
CREATE INDEX IF NOT EXISTS idx_test_case_categories_layer ON public.test_case_categories USING GIN(layer_focus);

-- Indexes for message templates
CREATE INDEX IF NOT EXISTS idx_message_templates_protocol ON public.message_templates(protocol);
CREATE INDEX IF NOT EXISTS idx_message_templates_layer ON public.message_templates(layer);
CREATE INDEX IF NOT EXISTS idx_message_templates_message_type ON public.message_templates(message_type);
CREATE INDEX IF NOT EXISTS idx_message_templates_direction ON public.message_templates(direction);

-- Indexes for IE library
CREATE INDEX IF NOT EXISTS idx_ie_library_name ON public.information_element_library(ie_name);
CREATE INDEX IF NOT EXISTS idx_ie_library_protocol ON public.information_element_library(protocol);
CREATE INDEX IF NOT EXISTS idx_ie_library_layer ON public.information_element_library(layer);
CREATE INDEX IF NOT EXISTS idx_ie_library_message_types ON public.information_element_library USING GIN(message_types);
CREATE INDEX IF NOT EXISTS idx_ie_library_mandatory ON public.information_element_library(mandatory);

-- Indexes for layer parameter library
CREATE INDEX IF NOT EXISTS idx_layer_param_library_name ON public.layer_parameter_library(parameter_name);
CREATE INDEX IF NOT EXISTS idx_layer_param_library_layer ON public.layer_parameter_library(layer);
CREATE INDEX IF NOT EXISTS idx_layer_param_library_protocol ON public.layer_parameter_library(protocol);
CREATE INDEX IF NOT EXISTS idx_layer_param_library_category ON public.layer_parameter_library(parameter_category);

-- Indexes for test execution templates
CREATE INDEX IF NOT EXISTS idx_test_execution_templates_protocol ON public.test_execution_templates(protocol);
CREATE INDEX IF NOT EXISTS idx_test_execution_templates_layer ON public.test_execution_templates(layer);
CREATE INDEX IF NOT EXISTS idx_test_execution_templates_scenario ON public.test_execution_templates(test_scenario);
CREATE INDEX IF NOT EXISTS idx_test_execution_templates_complexity ON public.test_execution_templates(complexity_score);

-- Indexes for test case dependencies
CREATE INDEX IF NOT EXISTS idx_test_case_dependencies_test_case ON public.test_case_dependencies(test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_case_dependencies_depends_on ON public.test_case_dependencies(depends_on_test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_case_dependencies_type ON public.test_case_dependencies(dependency_type);

-- Indexes for test case versions
CREATE INDEX IF NOT EXISTS idx_test_case_versions_test_case ON public.test_case_versions(test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_case_versions_current ON public.test_case_versions(is_current);
CREATE INDEX IF NOT EXISTS idx_test_case_versions_created_by ON public.test_case_versions(created_by);

-- Enhanced indexes for test cases
CREATE INDEX IF NOT EXISTS idx_test_cases_category_id ON public.test_cases(category_id);
CREATE INDEX IF NOT EXISTS idx_test_cases_subcategory ON public.test_cases(subcategory);
CREATE INDEX IF NOT EXISTS idx_test_cases_scenario ON public.test_cases(test_scenario);
CREATE INDEX IF NOT EXISTS idx_test_cases_priority ON public.test_cases(execution_priority);
CREATE INDEX IF NOT EXISTS idx_test_cases_automation ON public.test_cases(automation_level);
CREATE INDEX IF NOT EXISTS idx_test_cases_review_status ON public.test_cases(review_status);

-- Enhanced indexes for test case messages
CREATE INDEX IF NOT EXISTS idx_test_case_messages_template ON public.test_case_messages(message_template_id);
CREATE INDEX IF NOT EXISTS idx_test_case_messages_sequence_group ON public.test_case_messages(message_sequence_group);
CREATE INDEX IF NOT EXISTS idx_test_case_messages_parallel ON public.test_case_messages(parallel_execution);

-- Enhanced indexes for test case IEs
CREATE INDEX IF NOT EXISTS idx_test_case_ies_library ON public.test_case_information_elements(ie_library_id);
CREATE INDEX IF NOT EXISTS idx_test_case_ies_priority ON public.test_case_information_elements(ie_priority);
CREATE INDEX IF NOT EXISTS idx_test_case_ies_condition ON public.test_case_information_elements USING GIN(ie_condition);

-- Enhanced indexes for test case layer parameters
CREATE INDEX IF NOT EXISTS idx_test_case_params_library ON public.test_case_layer_parameters(parameter_library_id);
CREATE INDEX IF NOT EXISTS idx_test_case_params_priority ON public.test_case_layer_parameters(parameter_priority);
CREATE INDEX IF NOT EXISTS idx_test_case_params_condition ON public.test_case_layer_parameters USING GIN(parameter_condition);

-- ==============================================
-- 13. ROW LEVEL SECURITY
-- ==============================================

-- Enable RLS on new tables
ALTER TABLE public.test_case_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.information_element_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.layer_parameter_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_execution_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for test_case_categories
CREATE POLICY "Users can view test case categories" ON public.test_case_categories
    FOR SELECT USING (true);

-- RLS Policies for message_templates
CREATE POLICY "Users can view message templates" ON public.message_templates
    FOR SELECT USING (true);

-- RLS Policies for information_element_library
CREATE POLICY "Users can view IE library" ON public.information_element_library
    FOR SELECT USING (true);

-- RLS Policies for layer_parameter_library
CREATE POLICY "Users can view layer parameter library" ON public.layer_parameter_library
    FOR SELECT USING (true);

-- RLS Policies for test_execution_templates
CREATE POLICY "Users can view execution templates" ON public.test_execution_templates
    FOR SELECT USING (true);

-- RLS Policies for test_case_dependencies
CREATE POLICY "Users can view test case dependencies" ON public.test_case_dependencies
    FOR SELECT USING (true);

-- RLS Policies for test_case_versions
CREATE POLICY "Users can view test case versions" ON public.test_case_versions
    FOR SELECT USING (true);

-- ==============================================
-- 14. UTILITY FUNCTIONS
-- ==============================================

-- Function to get test case with all related data
CREATE OR REPLACE FUNCTION get_test_case_with_data(test_case_uuid UUID)
RETURNS TABLE (
    test_case JSONB,
    messages JSONB,
    information_elements JSONB,
    layer_parameters JSONB,
    dependencies JSONB,
    versions JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        to_jsonb(tc.*) as test_case,
        COALESCE(
            (SELECT jsonb_agg(to_jsonb(tcm.*)) 
             FROM public.test_case_messages tcm 
             WHERE tcm.test_case_id = test_case_uuid 
             ORDER BY tcm.step_order), 
            '[]'::jsonb
        ) as messages,
        COALESCE(
            (SELECT jsonb_agg(to_jsonb(tcie.*)) 
             FROM public.test_case_information_elements tcie 
             WHERE tcie.test_case_id = test_case_uuid), 
            '[]'::jsonb
        ) as information_elements,
        COALESCE(
            (SELECT jsonb_agg(to_jsonb(tclp.*)) 
             FROM public.test_case_layer_parameters tclp 
             WHERE tclp.test_case_id = test_case_uuid), 
            '[]'::jsonb
        ) as layer_parameters,
        COALESCE(
            (SELECT jsonb_agg(to_jsonb(tcd.*)) 
             FROM public.test_case_dependencies tcd 
             WHERE tcd.test_case_id = test_case_uuid), 
            '[]'::jsonb
        ) as dependencies,
        COALESCE(
            (SELECT jsonb_agg(to_jsonb(tcv.*)) 
             FROM public.test_case_versions tcv 
             WHERE tcv.test_case_id = test_case_uuid 
             ORDER BY tcv.created_at DESC), 
            '[]'::jsonb
        ) as versions;
END;
$$ LANGUAGE plpgsql;

-- Function to get test cases by category
CREATE OR REPLACE FUNCTION get_test_cases_by_category(category_name TEXT)
RETURNS TABLE (
    test_case_id UUID,
    test_case_name TEXT,
    protocol TEXT,
    layer TEXT,
    complexity TEXT,
    message_count BIGINT,
    ie_count BIGINT,
    parameter_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tc.id,
        tc.name,
        tc.protocol,
        tc.layer,
        tc.complexity,
        COUNT(tcm.id) as message_count,
        COUNT(tcie.id) as ie_count,
        COUNT(tclp.id) as parameter_count
    FROM public.test_cases tc
    LEFT JOIN public.test_case_categories tcc ON tc.category_id = tcc.id
    LEFT JOIN public.test_case_messages tcm ON tc.id = tcm.test_case_id
    LEFT JOIN public.test_case_information_elements tcie ON tc.id = tcie.test_case_id
    LEFT JOIN public.test_case_layer_parameters tclp ON tc.id = tclp.test_case_id
    WHERE tcc.name = category_name
    GROUP BY tc.id, tc.name, tc.protocol, tc.layer, tc.complexity
    ORDER BY tc.name;
END;
$$ LANGUAGE plpgsql;

-- Function to get test cases by protocol and layer
CREATE OR REPLACE FUNCTION get_test_cases_by_protocol_layer(protocol_name TEXT, layer_name TEXT)
RETURNS TABLE (
    test_case_id UUID,
    test_case_name TEXT,
    category TEXT,
    complexity TEXT,
    message_count BIGINT,
    ie_count BIGINT,
    parameter_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tc.id,
        tc.name,
        tcc.name as category,
        tc.complexity,
        COUNT(tcm.id) as message_count,
        COUNT(tcie.id) as ie_count,
        COUNT(tclp.id) as parameter_count
    FROM public.test_cases tc
    LEFT JOIN public.test_case_categories tcc ON tc.category_id = tcc.id
    LEFT JOIN public.test_case_messages tcm ON tc.id = tcm.test_case_id
    LEFT JOIN public.test_case_information_elements tcie ON tc.id = tcie.test_case_id
    LEFT JOIN public.test_case_layer_parameters tclp ON tc.id = tclp.test_case_id
    WHERE tc.protocol = protocol_name AND tc.layer = layer_name
    GROUP BY tc.id, tc.name, tcc.name, tc.complexity
    ORDER BY tc.name;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- 15. GRANT PERMISSIONS
-- ==============================================

-- Grant permissions for new functions
GRANT EXECUTE ON FUNCTION get_test_case_with_data(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_test_cases_by_category(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_test_cases_by_protocol_layer(TEXT, TEXT) TO authenticated;

-- ==============================================
-- 16. COMMENTS
-- ==============================================

COMMENT ON TABLE public.test_case_categories IS 'Categories for organizing 1000 test cases';
COMMENT ON TABLE public.message_templates IS 'Templates for message structures across all protocols';
COMMENT ON TABLE public.information_element_library IS 'Comprehensive library of information elements';
COMMENT ON TABLE public.layer_parameter_library IS 'Comprehensive library of layer parameters';
COMMENT ON TABLE public.test_execution_templates IS 'Templates for test case execution sequences';
COMMENT ON TABLE public.test_case_dependencies IS 'Dependencies between test cases';
COMMENT ON TABLE public.test_case_versions IS 'Version control for test cases';

COMMENT ON FUNCTION get_test_case_with_data(UUID) IS 'Get complete test case data with all related information';
COMMENT ON FUNCTION get_test_cases_by_category(TEXT) IS 'Get test cases organized by category';
COMMENT ON FUNCTION get_test_cases_by_protocol_layer(TEXT, TEXT) IS 'Get test cases filtered by protocol and layer';

-- ==============================================
-- 17. SUCCESS MESSAGE
-- ==============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Comprehensive 1000 test cases database migration completed successfully!';
    RAISE NOTICE '📊 Created 7 new tables for comprehensive test case management';
    RAISE NOTICE '🔧 Enhanced existing tables with additional columns';
    RAISE NOTICE '📈 Created comprehensive indexes for performance';
    RAISE NOTICE '🔒 Enabled Row Level Security on all new tables';
    RAISE NOTICE '⚙️ Added utility functions for data retrieval';
    RAISE NOTICE '🎯 Database ready for 1000 test cases with complete message, IE, and parameter data!';
END $$;