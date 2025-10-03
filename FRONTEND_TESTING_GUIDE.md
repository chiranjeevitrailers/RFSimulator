# 🧪 Frontend Testing Guide - Test Case Execution

## 🎯 **Quick Start - Run a Test Case**

### **Option 1: Use the Test Case Runner (Recommended)**
1. Open `test-case-runner.html` in your browser
2. Click "Run Test" on **tc-001 (Attach)**
3. Watch the execution logs in real-time
4. Navigate to 5GLabX views to see live data

### **Option 2: Use the Test Manager Interface**
1. Open your 5GLabX application
2. Navigate to the Test Manager
3. Find **tc-001 (Attach)** in the test cases list
4. Click the "Execute" button
5. Watch the browser console for logs

## 🔍 **What to Observe**

### **1. Test Manager Console Logs**
Look for these messages in the browser console:
```
🚀 TEST MANAGER: Starting test execution for: tc-001
📦 TEST MANAGER: API Response received: {...}
📡 TEST MANAGER: Dispatching 5GLABX_TEST_EXECUTION event
✅ TEST MANAGER: 5GLABX_TEST_EXECUTION event dispatched
```

### **2. 5GLabX Views Console Logs**
Navigate to any 5GLabX view and check console:
```
🔥 LogsView: Received 5GLABX_TEST_EXECUTION event
📊 Processing 4 expected messages
✅ Added 4 logs from test case
```

### **3. Network Tab**
Check the browser Network tab for:
- POST request to `/api/test-execution/simple/`
- Response containing `testCaseData` with `expectedMessages`

### **4. Live Data Display**
Navigate to these views to see live data:
- **Enhanced Logs** - Should show all messages
- **PHY Layer** - Should show PHY messages (PDSCH)
- **MAC Layer** - Should show MAC messages (MAC_CE)
- **RRC Layer** - Should show RRC messages (RRC_SETUP_REQUEST)
- **NAS Layer** - Should show NAS messages (REGISTRATION_REQUEST)

## 📊 **Expected Data Flow**

### **Step 1: Test Manager**
- User clicks "Execute" on tc-001
- API call to `/api/test-execution/simple/`
- Receives response with test case data

### **Step 2: API Processing**
- Fetches data from Supabase `test_cases` table
- Processes `expected_results` or `test_data`
- Returns structured `testCaseData`

### **Step 3: Event Dispatch**
- Test Manager dispatches `5GLABX_TEST_EXECUTION` event
- Event contains complete test case data
- All 5GLabX views receive the event

### **Step 4: Frontend Display**
- Views filter relevant messages by layer
- Real-time display with status indicators
- Live data updates in all specialized views

## 🐛 **Troubleshooting**

### **If you don't see data in frontend views:**

1. **Check Browser Console** for JavaScript errors
2. **Check Network Tab** for failed API calls
3. **Verify Event Dispatch** - look for "5GLABX_TEST_EXECUTION event dispatched"
4. **Check View Listeners** - ensure views are listening for events

### **Common Issues:**

- **API Error**: Check if `/api/test-execution/simple/` is accessible
- **Event Not Dispatched**: Check Test Manager console logs
- **Views Not Updating**: Check if views are listening for `5GLABX_TEST_EXECUTION`
- **No Data in Views**: Check if message filtering is working correctly

## 🎉 **Success Indicators**

✅ **Test Manager**: Shows "Running" then "Completed" status
✅ **API Response**: Contains `testCaseData` with `expectedMessages`
✅ **Event Dispatch**: Console shows "5GLABX_TEST_EXECUTION event dispatched"
✅ **Frontend Views**: Display live data with green status indicators
✅ **Logs**: Show real-time message processing

## 🚀 **Next Steps**

Once you see the data flowing:

1. **Navigate between different views** to see layer-specific data
2. **Check status indicators** (green dots, timestamps)
3. **Observe real-time updates** as messages are processed
4. **Try different test cases** (tc-002, tc-003) to see varied data

**The complete data flow from Supabase → Test Manager → 5GLabX Frontend is now ready for testing!** 🎉