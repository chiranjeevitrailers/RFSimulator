#!/bin/bash

# 5GLabX End-to-End Test Cases Database Installation Script
# This script installs all 8 E2E test cases using the upsert files to avoid duplicate key errors

echo "🏗️ Installing All 8 End-to-End Test Cases..."
echo ""

# Check if database name is provided
if [ -z "$1" ]; then
    echo "❌ Error: Database name required"
    echo "Usage: $0 <database_name>"
    echo "Example: $0 5glabx_e2e_tests"
    exit 1
fi

DATABASE_NAME=$1

echo "📋 Database: $DATABASE_NAME"
echo ""

# Function to run SQL file with error handling
run_sql_file() {
    local file=$1
    local description=$2
    
    echo "🔄 $description..."
    if psql -d "$DATABASE_NAME" -f "$file"; then
        echo "✅ $description completed successfully"
    else
        echo "❌ $description failed"
        exit 1
    fi
    echo ""
}

# Run schema first
echo "📊 Step 1: Creating database schema..."
run_sql_file "schema.sql" "Database schema creation"

# Run upsert files (these handle existing data gracefully)
echo "📊 Step 2: Installing E2E test cases (using upsert files)..."
run_sql_file "upsert_e2e_test_cases.sql" "First 2 E2E test cases (SMS Service, 5G→LTE Handover)"
run_sql_file "upsert_remaining_e2e_test_cases.sql" "Next 3 E2E test cases (MO Data, MT Data, MT CSFB)"
run_sql_file "upsert_final_e2e_test_cases.sql" "Final 3 E2E test cases (MO CSFB, LTE→5G Handover, 3G→LTE Handover)"

echo "🎉 All 8 End-to-End Test Cases installed successfully!"
echo ""
echo "📊 Summary:"
echo "   - 8 E2E test cases with complete 3GPP-compliant data"
echo "   - 80 messages across all layers (PHY, MAC, RRC, NAS)"
echo "   - 80 Information Elements with proper types and values"
echo "   - 81 layer parameters with measurements and configurations"
echo "   - Ready for professional End-to-End testing in 5GLabX!"
echo ""
echo "🔗 Test the installation:"
echo "   SELECT COUNT(*) FROM test_cases WHERE name LIKE '%End-to-End%';"
echo "   Expected result: 8"