-- ==============================================
-- 5GLabX Platform - Pre-Seed Schema Alignment
-- Ensures all required columns exist before seed data insertion (for 021)
-- Run this BEFORE running 021 seeds
-- ==============================================

-- ==============================================
-- 1. Align test_case_categories schema
-- ==============================================

ALTER TABLE public.test_case_categories 
ADD COLUMN IF NOT EXISTS display_name TEXT;

ALTER TABLE public.test_case_categories 
ADD COLUMN IF NOT EXISTS icon TEXT;

ALTER TABLE public.test_case_categories 
ADD COLUMN IF NOT EXISTS color TEXT;

ALTER TABLE public.test_case_categories 
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

ALTER TABLE public.test_case_categories 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

UPDATE public.test_case_categories 
SET display_name = COALESCE(display_name, name);

ALTER TABLE public.test_case_categories 
ALTER COLUMN display_name SET NOT NULL;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_test_case_categories_display_name ON public.test_case_categories(display_name);
CREATE INDEX IF NOT EXISTS idx_test_case_categories_sort_order ON public.test_case_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_test_case_categories_is_active ON public.test_case_categories(is_active);

-- ==============================================
-- 2. Align test_cases schema
-- ==============================================

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.test_case_categories(id);

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS subcategory TEXT;

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS layer TEXT DEFAULT 'Multi' CHECK (layer IN ('PHY','MAC','RLC','PDCP','RRC','NAS','IMS','E2','PC5','V2X','NTN','Multi'));

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS test_scenario TEXT;

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS test_objective TEXT;

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS prerequisites TEXT[];

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS test_environment JSONB DEFAULT '{}';

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS expected_outcomes JSONB DEFAULT '{}';

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS failure_criteria JSONB DEFAULT '{}';

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS test_data_requirements JSONB DEFAULT '{}';

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS measurement_points JSONB DEFAULT '{}';

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS kpi_requirements JSONB DEFAULT '{}';

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS standard_reference TEXT;

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS release_version TEXT;

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS automation_level TEXT DEFAULT 'manual' CHECK (automation_level IN ('manual', 'semi_automated', 'fully_automated'));

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS execution_priority INTEGER DEFAULT 5 CHECK (execution_priority BETWEEN 1 AND 10);

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS estimated_duration_minutes INTEGER DEFAULT 5;

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS resource_requirements JSONB DEFAULT '{}';

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS dependencies TEXT[];

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS related_test_cases UUID[];

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS version_history JSONB DEFAULT '{}';

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS last_updated_by UUID REFERENCES public.users(id);

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS review_status TEXT DEFAULT 'draft' CHECK (review_status IN ('draft', 'review', 'approved', 'deprecated'));

-- From base schema 001 - ensure core columns
ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS test_case_id TEXT;

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0';

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS test_type TEXT DEFAULT 'functional' CHECK (test_type IN ('functional', 'performance', 'stability', 'stress', 'interoperability', 'security', 'mobility', 'conformance'));

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 5;

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS estimated_cost DECIMAL(10,4) DEFAULT 0.01;

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS success_criteria JSONB DEFAULT '{}';

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS failure_thresholds JSONB DEFAULT '{}';

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS performance_targets JSONB DEFAULT '{}';

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;

ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_test_cases_layer ON public.test_cases(layer);
CREATE INDEX IF NOT EXISTS idx_test_cases_test_scenario ON public.test_cases(test_scenario);
CREATE INDEX IF NOT EXISTS idx_test_cases_execution_priority ON public.test_cases(execution_priority);
CREATE INDEX IF NOT EXISTS idx_test_cases_automation_level ON public.test_cases(automation_level);
CREATE INDEX IF NOT EXISTS idx_test_cases_review_status ON public.test_cases(review_status);
CREATE INDEX IF NOT EXISTS idx_test_cases_test_case_id ON public.test_cases(test_case_id);

-- ==============================================
-- 3. Validation
-- ==============================================

DO $$
DECLARE
    missing TEXT := '';
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='test_case_categories' AND column_name='display_name'
    ) THEN missing := missing || 'test_case_categories.display_name '; END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='test_cases' AND column_name='layer'
    ) THEN missing := missing || 'test_cases.layer '; END IF;

    IF missing <> '' THEN
        RAISE EXCEPTION 'Schema alignment failed, missing: %', missing;
    ELSE
        RAISE NOTICE 'Schema alignment successful.';
    END IF;
END $$;

