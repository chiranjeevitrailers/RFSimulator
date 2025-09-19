-- ==============================================
-- 5GLabX Platform - Auth User Provisioning & Sync
-- Smooth logins: auto-provision public.users on signup and sync email updates
-- Idempotent and RLS-safe (SECURITY DEFINER)
-- ==============================================

-- Create upsert function to provision a row in public.users when a new auth.users row is created
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Insert minimal row; defaults fill the rest. If exists, update email.
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, COALESCE(NEW.email, ''))
    ON CONFLICT (id) DO UPDATE
      SET email = EXCLUDED.email;

    RETURN NEW;
END;
$$;

-- Ensure trigger exists to call the provisioning function after a signup
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'on_auth_user_created'
    ) THEN
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();
    END IF;
END $$;

-- Create email sync function to keep public.users.email aligned with auth.users.email changes
CREATE OR REPLACE FUNCTION public.handle_auth_user_email_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.email IS DISTINCT FROM OLD.email THEN
        UPDATE public.users
        SET email = COALESCE(NEW.email, '')
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$;

-- Ensure trigger exists to sync email on auth.users updates
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'on_auth_user_updated_email'
    ) THEN
        CREATE TRIGGER on_auth_user_updated_email
        AFTER UPDATE OF email ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_email_change();
    END IF;
END $$;

-- Grants (not strictly required for triggers, but safe to expose for diagnostics if needed)
GRANT EXECUTE ON FUNCTION public.handle_new_auth_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_auth_user_email_change() TO authenticated;

-- Success notice
DO $$ BEGIN
    RAISE NOTICE '✅ Auth provisioning & email sync installed (040)';
END $$;

