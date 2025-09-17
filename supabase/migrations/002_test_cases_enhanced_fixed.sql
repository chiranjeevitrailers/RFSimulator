-- Enhanced test cases table with comprehensive 3GPP protocol support
-- This migration extends the existing test_cases table with additional fields

-- Add new columns to existing test_cases table
ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS version text DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS prerequisites jsonb,
ADD COLUMN IF NOT EXISTS expected_results jsonb,
ADD COLUMN IF NOT EXISTS success_criteria jsonb,
ADD COLUMN IF NOT EXISTS failure_scenarios jsonb,
ADD COLUMN IF NOT EXISTS performance_metrics jsonb,
ADD COLUMN IF NOT EXISTS test_environment jsonb,
ADD COLUMN IF NOT EXISTS documentation_url text,
ADD COLUMN IF NOT EXISTS is_template boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS parent_test_case_id uuid REFERENCES public.test_cases(id),
ADD COLUMN IF NOT EXISTS execution_order integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS timeout_ms integer DEFAULT 300000,
ADD COLUMN IF NOT EXISTS retry_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Create test_case_executions table for tracking test runs
CREATE TABLE IF NOT EXISTS public.test_case_executions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  test_case_id uuid REFERENCES public.test_cases(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  execution_id uuid DEFAULT gen_random_uuid() NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled', 'timeout')),
  start_time timestamp with time zone DEFAULT now() NOT NULL,
  end_time timestamp with time zone,
  duration_ms integer,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  current_step text,
  total_steps integer DEFAULT 0,
  completed_steps integer DEFAULT 0,
  results jsonb,
  logs jsonb,
  errors jsonb,
  performance_data jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create test_case_results table for detailed results
CREATE TABLE IF NOT EXISTS public.test_case_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  execution_id uuid REFERENCES public.test_case_executions(id) ON DELETE CASCADE NOT NULL,
  step_name text NOT NULL,
  step_order integer NOT NULL,
  status text NOT NULL CHECK (status IN ('passed', 'failed', 'skipped', 'warning')),
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone,
  duration_ms integer,
  message text,
  details jsonb,
  metrics jsonb,
  screenshots jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create test_case_templates table for reusable test patterns
CREATE TABLE IF NOT EXISTS public.test_case_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  protocol text NOT NULL,
  template_data jsonb NOT NULL,
  parameters jsonb,
  is_public boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create test_case_libraries table for organizing test cases
CREATE TABLE IF NOT EXISTS public.test_case_libraries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  protocol text NOT NULL,
  is_public boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create test_case_library_members table for library membership
CREATE TABLE IF NOT EXISTS public.test_case_library_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  library_id uuid REFERENCES public.test_case_libraries(id) ON DELETE CASCADE NOT NULL,
  test_case_id uuid REFERENCES public.test_cases(id) ON DELETE CASCADE NOT NULL,
  added_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  added_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(library_id, test_case_id)
);

-- Create indexes for performance (using existing columns)
CREATE INDEX IF NOT EXISTS idx_test_cases_category ON public.test_cases (category);
CREATE INDEX IF NOT EXISTS idx_test_cases_protocol ON public.test_cases (protocol);
CREATE INDEX IF NOT EXISTS idx_test_cases_complexity ON public.test_cases (complexity);
CREATE INDEX IF NOT EXISTS idx_test_cases_priority ON public.test_cases (priority);
CREATE INDEX IF NOT EXISTS idx_test_cases_is_active ON public.test_cases (is_active);
CREATE INDEX IF NOT EXISTS idx_test_cases_tags ON public.test_cases USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_test_cases_test_case_id ON public.test_cases (test_case_id);

CREATE INDEX IF NOT EXISTS idx_test_case_executions_test_case_id ON public.test_case_executions (test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_user_id ON public.test_case_executions (user_id);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_status ON public.test_case_executions (status);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_start_time ON public.test_case_executions (start_time);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_execution_id ON public.test_case_executions (execution_id);

CREATE INDEX IF NOT EXISTS idx_test_case_results_execution_id ON public.test_case_results (execution_id);
CREATE INDEX IF NOT EXISTS idx_test_case_results_status ON public.test_case_results (status);
CREATE INDEX IF NOT EXISTS idx_test_case_results_step_order ON public.test_case_results (step_order);

CREATE INDEX IF NOT EXISTS idx_test_case_templates_category ON public.test_case_templates (category);
CREATE INDEX IF NOT EXISTS idx_test_case_templates_protocol ON public.test_case_templates (protocol);
CREATE INDEX IF NOT EXISTS idx_test_case_templates_is_public ON public.test_case_templates (is_public);

CREATE INDEX IF NOT EXISTS idx_test_case_libraries_category ON public.test_case_libraries (category);
CREATE INDEX IF NOT EXISTS idx_test_case_libraries_protocol ON public.test_case_libraries (protocol);
CREATE INDEX IF NOT EXISTS idx_test_case_libraries_is_public ON public.test_case_libraries (is_public);

-- Set up Row Level Security (RLS)
ALTER TABLE public.test_case_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_libraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_library_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for test_case_executions
CREATE POLICY "Users can view their own test executions" ON public.test_case_executions 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own test executions" ON public.test_case_executions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own test executions" ON public.test_case_executions 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all test executions" ON public.test_case_executions 
  FOR ALL TO service_role USING (true);

-- RLS Policies for test_case_results
CREATE POLICY "Users can view results of their executions" ON public.test_case_results 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.test_case_executions 
      WHERE id = test_case_results.execution_id 
      AND user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert results for their executions" ON public.test_case_results 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.test_case_executions 
      WHERE id = test_case_results.execution_id 
      AND user_id = auth.uid()
    )
  );
CREATE POLICY "Admins can manage all test results" ON public.test_case_results 
  FOR ALL TO service_role USING (true);

-- RLS Policies for test_case_templates
CREATE POLICY "Public templates are viewable by all" ON public.test_case_templates 
  FOR SELECT USING (is_public = true OR created_by = auth.uid());
CREATE POLICY "Users can create templates" ON public.test_case_templates 
  FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "Users can update their own templates" ON public.test_case_templates 
  FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Admins can manage all templates" ON public.test_case_templates 
  FOR ALL TO service_role USING (true);

-- RLS Policies for test_case_libraries
CREATE POLICY "Public libraries are viewable by all" ON public.test_case_libraries 
  FOR SELECT USING (is_public = true OR created_by = auth.uid());
CREATE POLICY "Users can create libraries" ON public.test_case_libraries 
  FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "Users can update their own libraries" ON public.test_case_libraries 
  FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Admins can manage all libraries" ON public.test_case_libraries 
  FOR ALL TO service_role USING (true);

-- RLS Policies for test_case_library_members
CREATE POLICY "Users can view library memberships" ON public.test_case_library_members 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.test_case_libraries 
      WHERE id = test_case_library_members.library_id 
      AND (is_public = true OR created_by = auth.uid())
    )
  );
CREATE POLICY "Users can manage memberships of their libraries" ON public.test_case_library_members 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.test_case_libraries 
      WHERE id = test_case_library_members.library_id 
      AND created_by = auth.uid()
    )
  );
CREATE POLICY "Admins can manage all library memberships" ON public.test_case_library_members 
  FOR ALL TO service_role USING (true);

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_test_case_executions_updated_at 
  BEFORE UPDATE ON public.test_case_executions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_case_templates_updated_at 
  BEFORE UPDATE ON public.test_case_templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_case_libraries_updated_at 
  BEFORE UPDATE ON public.test_case_libraries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique test case IDs
CREATE OR REPLACE FUNCTION generate_test_case_id(category text, protocol text)
RETURNS text AS $$
DECLARE
  prefix text;
  counter integer;
  test_case_id text;
BEGIN
  -- Generate prefix based on category and protocol
  prefix := upper(substring(category from 1 for 3)) || '_' || 
            upper(replace(protocol, ' ', '_')) || '_';
  
  -- Get next counter value
  SELECT COALESCE(MAX(CAST(substring(test_case_id from length(prefix) + 1) AS integer)), 0) + 1
  INTO counter
  FROM public.test_cases 
  WHERE test_case_id LIKE prefix || '%';
  
  -- Format with leading zeros
  test_case_id := prefix || lpad(counter::text, 4, '0');
  
  RETURN test_case_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate test case execution statistics
CREATE OR REPLACE FUNCTION get_test_case_stats(test_case_uuid uuid)
RETURNS jsonb AS $$
DECLARE
  stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_executions', COUNT(*),
    'successful_executions', COUNT(*) FILTER (WHERE status = 'completed'),
    'failed_executions', COUNT(*) FILTER (WHERE status = 'failed'),
    'average_duration_ms', AVG(duration_ms),
    'last_execution', MAX(start_time),
    'success_rate', ROUND(
      (COUNT(*) FILTER (WHERE status = 'completed')::float / NULLIF(COUNT(*), 0)) * 100, 2
    )
  )
  INTO stats
  FROM public.test_case_executions
  WHERE test_case_id = test_case_uuid;
  
  RETURN COALESCE(stats, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql;