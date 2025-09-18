-- ==============================================
-- 5GLabX Platform - Expected Artifacts Tables
-- Defines helper tables used by detailed test case migrations (024, 025, ...)
-- ==============================================

CREATE TABLE IF NOT EXISTS public.expected_message_flows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_case_id UUID NOT NULL REFERENCES public.test_cases(id) ON DELETE CASCADE,
    message_sequence INTEGER NOT NULL,
    message_type TEXT NOT NULL,
    message_name TEXT NOT NULL,
    protocol TEXT NOT NULL,
    layer TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('UL','DL','BIDIRECTIONAL')),
    delay_ms INTEGER DEFAULT 0,
    message_description TEXT,
    standard_reference TEXT,
    release_version TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(test_case_id, message_sequence)
);

CREATE TABLE IF NOT EXISTS public.expected_information_elements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_case_id UUID NOT NULL REFERENCES public.test_cases(id) ON DELETE CASCADE,
    message_sequence INTEGER NOT NULL,
    ie_name TEXT NOT NULL,
    ie_type TEXT NOT NULL,
    ie_value TEXT NOT NULL,
    ie_description TEXT,
    mandatory BOOLEAN DEFAULT false,
    standard_reference TEXT,
    release_version TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.expected_layer_parameters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_case_id UUID NOT NULL REFERENCES public.test_cases(id) ON DELETE CASCADE,
    layer TEXT NOT NULL,
    parameter_name TEXT NOT NULL,
    parameter_value TEXT NOT NULL,
    parameter_unit TEXT,
    parameter_description TEXT,
    standard_reference TEXT,
    release_version TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_expected_message_flows_test_case ON public.expected_message_flows(test_case_id);
CREATE INDEX IF NOT EXISTS idx_expected_information_elements_test_case ON public.expected_information_elements(test_case_id);
CREATE INDEX IF NOT EXISTS idx_expected_layer_parameters_test_case ON public.expected_layer_parameters(test_case_id);

-- Enable RLS for safety (read-only views in app)
ALTER TABLE public.expected_message_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expected_information_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expected_layer_parameters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view expected message flows" ON public.expected_message_flows
    FOR SELECT USING (true);

CREATE POLICY "Users can view expected IEs" ON public.expected_information_elements
    FOR SELECT USING (true);

CREATE POLICY "Users can view expected layer params" ON public.expected_layer_parameters
    FOR SELECT USING (true);

DO $$ BEGIN
    RAISE NOTICE '✅ Expected artifacts tables created (expected_message_flows, expected_information_elements, expected_layer_parameters).';
END $$;

