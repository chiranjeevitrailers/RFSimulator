
# 🧪 REAL SUPABASE DATA VERIFICATION - User Testing Guide

## 🎯 Objective
Verify that when you run a test case, the data displayed comes from **REAL SUPABASE** database, not mock/synthetic data.

## 📋 Step-by-Step Verification

### Step 1: Open Developer Console
1. Open browser developer tools (F12)
2. Go to Console tab
3. Clear the console log

### Step 2: Navigate to Integrated Platform
1. Go to: `http://localhost:3001/user-dashboard`
2. Click "5GLabX + Test Manager" tab
3. Wait for platform to load

### Step 3: Monitor Real Data Loading
**Watch the console for these messages:**
- ✅ `🔍 Fetching real test cases from Supabase API...`
- ✅ `✅ Successfully fetched X real test cases from Supabase`
- ✅ `✅ Real Supabase query successful: X records`

**RED FLAGS (Should NOT see):**
- ❌ Any message containing "Mock" or "mock"
- ❌ `Mock implementation`
- ❌ `mockTestCases` or `mockDetails`

### Step 4: Execute Test Case
1. Select any test case in Test Manager sidebar
2. Click "Execute Test"
3. **Monitor console for:**
   - ✅ `🔍 Fetching real test case details for ID: [testId]`
   - ✅ `✅ Successfully fetched real test case details: [testName]`
   - ✅ `🚀 Starting REAL test execution`
   - ✅ `📊 Real data loaded: X messages, X IEs, X params`

### Step 5: Verify Data Display
**In Protocol Layers & Log Views, look for:**
- ✅ Messages with `source: 'RealSupabaseDecoded'`
- ✅ Data with `realData: true` flag
- ✅ Timestamps from actual database records

**RED FLAGS in Data:**
- ❌ `source: 'TestManagerBackend'` (mock)
- ❌ `source: 'ExpectedMessagesFallback'` (not real decoded)
- ❌ `realData: false`

### Step 6: Run Verification Script
**In browser console, run:**
```javascript
window.verifyRealData()
```

**Expected Result:**
```
📊 DATA SOURCE VERIFICATION REPORT
==================================================
✅ Real Data Operations: 15+
❌ Mock Data Operations: 0
```

## 🎯 SUCCESS CRITERIA

### ✅ PASS - Real Supabase Data Confirmed:
- All test cases loaded from `/api/test-cases/all`
- Test case details fetched from `/api/test-execution/comprehensive`
- Decoded messages from `/api/tests/runs/[id]/messages`
- Console shows "Real Supabase" operations
- No mock data operations detected

### ❌ FAIL - Mock Data Detected:
- Console shows mock operations
- Test cases from hardcoded arrays
- Data with mock identifiers
- `verifyRealData()` shows mock operations > 0

## 🚨 If Mock Data Detected

**You should see ONLY real Supabase data. If you see any mock data:**
1. The Test Manager backend needs to be updated
2. Mock implementations need to be replaced with API calls
3. Data flow is not using real database

## ✅ Expected User Experience

**When running a test case with REAL data:**
1. **Test Selection**: Shows actual test cases from your Supabase database
2. **Test Execution**: Uses real API endpoints and database records  
3. **Data Display**: Protocol layers show actual decoded messages from database
4. **Log Views**: Display real test execution results, not synthetic data
5. **No Mock Content**: Zero mock/fake/synthetic data in the flow

---
**This verification ensures the integration provides REAL data analysis, not simulated results.**
