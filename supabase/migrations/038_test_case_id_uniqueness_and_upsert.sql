-- ==============================================
-- 5GLabX Platform - Test Case ID Uniqueness & Safe Upsert
-- Ensures collision-proof test_case_id generation and repairs existing data
-- ==============================================

-- Safety: required for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================
-- 1) Helper: collision-proof generator for test_case_id
-- ==============================================
CREATE OR REPLACE FUNCTION public.generate_unique_test_case_id(prefix TEXT DEFAULT 'TC')
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
BEGIN
    LOOP
        -- Time-based + random suffix for readability and uniqueness
        new_id := prefix || '-' || to_char(CLOCK_TIMESTAMP(), 'YYYYMMDDHH24MISSMS')
                 || '-' || substring(md5(gen_random_uuid()::text) from 1 for 6);

        -- Ensure uniqueness against current data
        IF NOT EXISTS (
            SELECT 1 FROM public.test_cases WHERE test_case_id = new_id
        ) THEN
            RETURN new_id;
        END IF;
        -- Retry with a new random suffix
    END LOOP;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- ==============================================
-- 2) Replace trigger function to use robust generator
-- ==============================================
CREATE OR REPLACE FUNCTION public.generate_test_case_id_if_missing()
RETURNS TRIGGER AS $$
DECLARE
    prefix TEXT;
BEGIN
    IF NEW.test_case_id IS NULL OR NEW.test_case_id = '' THEN
        prefix := CASE NEW.category
            WHEN '5G_NR' THEN 'NR'
            WHEN '4G_LTE' THEN 'LTE'
            WHEN 'IMS_SIP' THEN 'IMS'
            WHEN 'O_RAN' THEN 'ORAN'
            WHEN 'NB_IoT' THEN 'NBIOT'
            WHEN 'V2X' THEN 'V2X'
            WHEN 'NTN' THEN 'NTN'
            ELSE 'TC'
        END;
        NEW.test_case_id := public.generate_unique_test_case_id(prefix);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger to ensure it points to the updated function (idempotent)
DROP TRIGGER IF EXISTS trigger_generate_test_case_id ON public.test_cases;
CREATE TRIGGER trigger_generate_test_case_id
    BEFORE INSERT ON public.test_cases
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_test_case_id_if_missing();

-- ==============================================
-- 3) Data repair: fix duplicates and NULL/empty IDs without deleting rows
-- ==============================================
DO $$
DECLARE
    rec RECORD;
    fix_count INTEGER := 0;
    mapped_prefix TEXT;
BEGIN
    RAISE NOTICE '=== Test Case ID cleanup started ===';

    -- Repair duplicate groups: keep earliest by created_at, update others
    FOR rec IN (
        SELECT test_case_id, array_agg(id ORDER BY created_at, id) AS ids
        FROM public.test_cases
        WHERE COALESCE(test_case_id, '') <> ''
        GROUP BY test_case_id
        HAVING COUNT(*) > 1
    ) LOOP
        IF array_length(rec.ids, 1) > 1 THEN
            FOR fix_count IN 2..array_length(rec.ids, 1) LOOP
                UPDATE public.test_cases t
                SET test_case_id = public.generate_unique_test_case_id(
                    CASE t.category
                        WHEN '5G_NR' THEN 'NR'
                        WHEN '4G_LTE' THEN 'LTE'
                        WHEN 'IMS_SIP' THEN 'IMS'
                        WHEN 'O_RAN' THEN 'ORAN'
                        WHEN 'NB_IoT' THEN 'NBIOT'
                        WHEN 'V2X' THEN 'V2X'
                        WHEN 'NTN' THEN 'NTN'
                        ELSE 'TC'
                    END
                )
                WHERE t.id = rec.ids[fix_count];
            END LOOP;
        END IF;
    END LOOP;

    -- Assign IDs to NULL/empty values
    UPDATE public.test_cases t
    SET test_case_id = public.generate_unique_test_case_id(
        CASE t.category
            WHEN '5G_NR' THEN 'NR'
            WHEN '4G_LTE' THEN 'LTE'
            WHEN 'IMS_SIP' THEN 'IMS'
            WHEN 'O_RAN' THEN 'ORAN'
            WHEN 'NB_IoT' THEN 'NBIOT'
            WHEN 'V2X' THEN 'V2X'
            WHEN 'NTN' THEN 'NTN'
            ELSE 'TC'
        END
    )
    WHERE t.test_case_id IS NULL OR t.test_case_id = '';

    -- Final validation
    IF EXISTS (
        SELECT 1 FROM (
            SELECT test_case_id
            FROM public.test_cases
            GROUP BY test_case_id
            HAVING COUNT(*) > 1
        ) d
    ) THEN
        RAISE WARNING 'Duplicate test_case_id still present after repair — manual review may be required.';
    ELSE
        RAISE NOTICE '✅ Test Case ID cleanup completed successfully.';
    END IF;
END $$;

-- ==============================================
-- 4) Optional: Safe upsert helper for future seeds/inserts
-- ==============================================
CREATE OR REPLACE FUNCTION public.safe_insert_test_case(
    p_name TEXT,
    p_description TEXT,
    p_category_name TEXT,
    p_category TEXT,
    p_protocol TEXT,
    p_layer TEXT DEFAULT 'Multi',
    p_complexity TEXT DEFAULT 'intermediate',
    p_test_type TEXT DEFAULT 'functional',
    p_test_scenario TEXT DEFAULT NULL,
    p_test_objective TEXT DEFAULT NULL,
    p_standard_reference TEXT DEFAULT NULL,
    p_release_version TEXT DEFAULT NULL,
    p_duration_minutes INTEGER DEFAULT 5,
    p_execution_priority INTEGER DEFAULT 5,
    p_automation_level TEXT DEFAULT 'manual',
    p_test_data_requirements JSONB DEFAULT '{}',
    p_kpi_requirements JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    category_id_val UUID;
    new_id UUID;
    prefix TEXT;
BEGIN
    SELECT id INTO category_id_val
    FROM public.test_case_categories
    WHERE name = p_category_name;

    prefix := CASE p_category
        WHEN '5G_NR' THEN 'NR'
        WHEN '4G_LTE' THEN 'LTE'
        WHEN 'IMS_SIP' THEN 'IMS'
        WHEN 'O_RAN' THEN 'ORAN'
        WHEN 'NB_IoT' THEN 'NBIOT'
        WHEN 'V2X' THEN 'V2X'
        WHEN 'NTN' THEN 'NTN'
        ELSE 'TC'
    END;

    INSERT INTO public.test_cases (
        test_case_id, name, description, category_id, category, protocol,
        layer, complexity, test_type, test_scenario, test_objective,
        standard_reference, release_version, duration_minutes,
        execution_priority, automation_level, test_data_requirements, kpi_requirements
    ) VALUES (
        public.generate_unique_test_case_id(prefix), p_name, p_description, category_id_val, p_category, p_protocol,
        p_layer, p_complexity, p_test_type, p_test_scenario, p_test_objective,
        p_standard_reference, p_release_version, p_duration_minutes,
        p_execution_priority, p_automation_level, p_test_data_requirements, p_kpi_requirements
    )
    ON CONFLICT (test_case_id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        category_id = EXCLUDED.category_id,
        category = EXCLUDED.category,
        protocol = EXCLUDED.protocol,
        layer = EXCLUDED.layer,
        complexity = EXCLUDED.complexity,
        test_type = EXCLUDED.test_type,
        test_scenario = EXCLUDED.test_scenario,
        test_objective = EXCLUDED.test_objective,
        standard_reference = EXCLUDED.standard_reference,
        release_version = EXCLUDED.release_version,
        duration_minutes = EXCLUDED.duration_minutes,
        execution_priority = EXCLUDED.execution_priority,
        automation_level = EXCLUDED.automation_level,
        test_data_requirements = EXCLUDED.test_data_requirements,
        kpi_requirements = EXCLUDED.kpi_requirements,
        updated_at = NOW()
    RETURNING id INTO new_id;

    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.generate_unique_test_case_id(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.safe_insert_test_case(
    TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER, TEXT, JSONB, JSONB
) TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Applied test_case_id uniqueness fix and helpers.';
END $$;

