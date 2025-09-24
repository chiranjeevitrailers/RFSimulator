# 🚨 QUICK FIX: Duplicate Key Error Solution

## Problem
You're getting this error:
```
ERROR: 23505: duplicate key value violates unique constraint "test_cases_pkey"
DETAIL: Key (id)=(e2482966-76f0-433b-bcf6-2473595f5792) already exists.
```

## Root Cause
You're using the **original `insert_*` files** instead of the **new `upsert_*` files**. The original files don't handle existing data and cause duplicate key errors.

## ✅ Solution: Use the Upsert Files

### Option 1: Use the Installation Script (Recommended)
```bash
cd database
./install_all_e2e_test_cases.sh your_database_name
```

### Option 2: Run Upsert Files Manually
```bash
# Use these files instead of the insert_* files:
psql -d your_database_name -f upsert_e2e_test_cases.sql
psql -d your_database_name -f upsert_remaining_e2e_test_cases.sql
psql -d your_database_name -f upsert_final_e2e_test_cases.sql
```

## ❌ Don't Use These Files (They Cause Errors)
```bash
# These files will cause duplicate key errors:
# psql -d your_database_name -f insert_e2e_test_cases.sql
# psql -d your_database_name -f insert_remaining_e2e_test_cases.sql
# psql -d your_database_name -f insert_final_e2e_test_cases.sql
```

## Key Difference

### Original Files (insert_*):
```sql
INSERT INTO test_cases (...) VALUES (...);
-- ❌ Fails if record already exists
```

### New Files (upsert_*):
```sql
INSERT INTO test_cases (...) VALUES (...)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    test_data = EXCLUDED.test_data,
    -- ... updates all fields
    updated_at = NOW();
-- ✅ Works whether record exists or not
```

## Verification
After running the upsert files, verify with:
```sql
SELECT COUNT(*) FROM test_cases WHERE name LIKE '%End-to-End%';
-- Should return: 8
```

## Summary
- **Use `upsert_*` files** - they handle existing data gracefully
- **Don't use `insert_*` files** - they cause duplicate key errors
- **The upsert files are safe to run multiple times**