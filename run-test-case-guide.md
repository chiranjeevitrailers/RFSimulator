# 🧪 Test Case Execution Guide

## 📋 Available Test Cases

Based on the Test Manager, here are the available test cases:

1. **tc-001 - Attach** (eNodeB, High Priority)
2. **tc-002 - Detach** (eNodeB, Medium Priority) 
3. **tc-003 - Handover** (gNodeB, High Priority)
4. **tc-004 - Paging** (Core Network, Low Priority)
5. **tc-005 - Bearer Setup** (eNodeB, Medium Priority)
6. **tc-006 - Mobility Management** (gNodeB, High Priority)
7. **tc-007 - Authentication** (Core Network, High Priority)

## 🚀 Step-by-Step Execution

### Step 1: Open Test Manager
1. Navigate to the Test Manager interface
2. You should see the list of test cases above

### Step 2: Select a Test Case
**Recommended: tc-001 (Attach)** - This is a high-priority test case that will generate good data for observation.

### Step 3: Execute the Test
1. Click the "Execute" button next to tc-001
2. Watch the Test Manager logs for execution status
3. Monitor the browser console for event dispatching

### Step 4: Observe Frontend Logs
After execution, navigate to these views to see live data:

#### Protocol Layer Views:
- **PHY Layer** - Physical layer messages
- **MAC Layer** - Medium access control
- **RRC Layer** - Radio resource control
- **NAS Layer** - Non-access stratum

#### Enhanced Views:
- **Enhanced Logs** - Comprehensive log display
- **Layer Trace** - Multi-layer message tracing
- **Call Flow** - End-to-end call analysis

## 🔍 What to Look For

### In Test Manager Console:
```
🚀 TEST MANAGER: Starting test execution for: tc-001
📦 TEST MANAGER: API Response received: {...}
📡 TEST MANAGER: Dispatching 5GLABX_TEST_EXECUTION event
✅ TEST MANAGER: 5GLABX_TEST_EXECUTION event dispatched
```

### In 5GLabX Views Console:
```
🔥 LogsView: Received 5GLABX_TEST_EXECUTION event
📊 Processing 3 expected messages
✅ Added 3 logs from test case
```

### In Browser Network Tab:
- POST request to `/api/test-execution/simple/`
- Response with `testCaseData` containing `expectedMessages`

## 🎯 Expected Data Flow

1. **Test Manager** → API call to `/api/test-execution/simple/`
2. **API** → Fetches data from Supabase `test_cases` table
3. **API** → Returns structured `testCaseData` with `expectedMessages`
4. **Test Manager** → Dispatches `5GLABX_TEST_EXECUTION` event
5. **5GLabX Views** → Receive event and display live data

## 🐛 Troubleshooting

If you don't see data in the frontend views:

1. **Check Browser Console** for JavaScript errors
2. **Check Network Tab** for failed API calls
3. **Verify Event Dispatch** - look for "5GLABX_TEST_EXECUTION event dispatched"
4. **Check View Listeners** - ensure views are listening for events

## 📊 Success Indicators

✅ **Test Manager**: Shows "Running" status, then "Completed"
✅ **API Response**: Contains `testCaseData` with `expectedMessages`
✅ **Event Dispatch**: Console shows "5GLABX_TEST_EXECUTION event dispatched"
✅ **Frontend Views**: Display live data with green status indicators
✅ **Logs**: Show real-time message processing