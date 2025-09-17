-- ML Schema for Execution Issue Learning

-- Raw execution events (ingest)
CREATE TABLE IF NOT EXISTS ml_execution_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  user_id UUID,
  test_case_id TEXT NOT NULL,
  tech TEXT, -- e.g., NR, LTE, IMS
  stage TEXT, -- setup, execute, teardown
  event_time TIMESTAMPTZ DEFAULT NOW(),
  level TEXT, -- info, warn, error
  code TEXT, -- error code or message key
  message TEXT,
  payload JSONB
);

-- Feature snapshots per run
CREATE TABLE IF NOT EXISTS ml_execution_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID UNIQUE NOT NULL,
  user_id UUID,
  test_case_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  features JSONB NOT NULL
);

-- Labels/outcomes per run
CREATE TABLE IF NOT EXISTS ml_execution_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID UNIQUE NOT NULL,
  outcome TEXT NOT NULL, -- pass, fail, timeout
  failure_class TEXT, -- e.g., auth_failure, rrc_timeout
  root_cause TEXT, -- optional curated root cause
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Model registry
CREATE TABLE IF NOT EXISTS ml_model_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name TEXT NOT NULL,
  version TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metrics JSONB, -- precision, recall, etc.
  artifact_url TEXT NOT NULL,
  active BOOLEAN DEFAULT FALSE
);

-- Recommendations generated for runs
CREATE TABLE IF NOT EXISTS ml_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  recommendation TEXT NOT NULL,
  confidence NUMERIC,
  rationale TEXT,
  applied BOOLEAN DEFAULT FALSE,
  helpful BOOLEAN,
  metadata JSONB
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_ml_events_run ON ml_execution_events(run_id);
CREATE INDEX IF NOT EXISTS idx_ml_events_tc ON ml_execution_events(test_case_id);
CREATE INDEX IF NOT EXISTS idx_ml_features_run ON ml_execution_features(run_id);
CREATE INDEX IF NOT EXISTS idx_ml_labels_outcome ON ml_execution_labels(outcome);

