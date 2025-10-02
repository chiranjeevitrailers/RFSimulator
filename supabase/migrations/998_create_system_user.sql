-- ==============================================
-- Create system user for automated test executions
-- This allows test executions without a real authenticated user
-- ==============================================

-- Create a system user in the users table (not in auth.users)
-- This is used for automated/background test executions
INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    subscription_tier,
    subscription_status,
    is_active,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    'system@5glabx.internal',
    'System User',
    'admin',
    'enterprise',
    'active',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = NOW();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ System user created successfully!';
    RAISE NOTICE '🤖 System user ID: 00000000-0000-0000-0000-000000000000';
    RAISE NOTICE '📧 System email: system@5glabx.internal';
END $$;
