#!/bin/bash

echo "🧪 Testing 5GLabX Test Case Execution"
echo "======================================"
echo ""

# Check if server is running
echo "📡 Checking if dev server is running..."
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "❌ Dev server is not running!"
    echo "💡 Please run: npm run dev"
    echo ""
    exit 1
fi
echo "✅ Dev server is running"
echo ""

# Step 1: Get a test case
echo "📋 Step 1: Fetching test cases..."
TEST_CASE_DATA=$(curl -s http://localhost:3000/api/test-cases/basic)
TEST_CASE_ID=$(echo "$TEST_CASE_DATA" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
TEST_CASE_NAME=$(echo "$TEST_CASE_DATA" | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$TEST_CASE_ID" ]; then
    echo "❌ Failed to fetch test cases"
    echo "Response: $TEST_CASE_DATA"
    exit 1
fi

echo "✅ Found test case:"
echo "   Name: $TEST_CASE_NAME"
echo "   ID: $TEST_CASE_ID"
echo ""

# Step 2: Execute the test case
echo "🚀 Step 2: Executing test case..."
EXECUTION_RESPONSE=$(curl -s -X POST http://localhost:3000/api/test-execution/simple \
  -H "Content-Type: application/json" \
  -d "{\"testCaseId\":\"$TEST_CASE_ID\",\"userId\":null}")

# Check if execution was successful
if echo "$EXECUTION_RESPONSE" | grep -q '"success":true'; then
    EXECUTION_ID=$(echo "$EXECUTION_RESPONSE" | grep -o '"executionId":"[^"]*"' | cut -d'"' -f4)
    MESSAGE_COUNT=$(echo "$EXECUTION_RESPONSE" | grep -o '"messageCount":[0-9]*' | cut -d':' -f2)
    
    echo "✅ Test execution successful!"
    echo "   Execution ID: $EXECUTION_ID"
    echo "   Messages generated: $MESSAGE_COUNT"
    echo ""
    
    echo "📊 Step 3: Data stored in database"
    echo "   Check Supabase Dashboard:"
    echo "   Table: test_case_executions"
    echo "   Execution ID: $EXECUTION_ID"
    echo ""
    
    echo "🎯 Step 4: View in frontend:"
    echo "   1. Open: http://localhost:3000/user-dashboard"
    echo "   2. Go to '5GLabX Platform' tab"
    echo "   3. Click 'Logs Viewer'"
    echo "   4. You should see:"
    echo "      🟢 'Receiving Real-Time Data'"
    echo "      📋 Log messages in table"
    echo ""
    echo "======================================"
    echo "✅ TEST EXECUTION SUCCESSFUL!"
    echo "🎉 Data flow is working!"
    echo "======================================"
else
    echo "❌ Test execution failed!"
    echo "Response: $EXECUTION_RESPONSE"
    exit 1
fi
