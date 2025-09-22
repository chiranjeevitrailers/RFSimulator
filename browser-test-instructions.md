# 🌐 Browser Test Instructions for 5GLabX Platform

## 🎯 Test Objective
Test the complete data flow from Test Manager to 5GLabX Platform using the browser interface.

## 📋 Step-by-Step Test Instructions

### 1. Open the Application
- **URL**: http://localhost:3000
- **Expected**: Marketing homepage loads successfully

### 2. Navigate to User Dashboard
- Click on "User Dashboard" or navigate to `/user-dashboard`
- **Expected**: Dashboard loads with tabs: Overview, Test Manager, 5GLabX Platform, Settings

### 3. Test Manager Tab
- Click on "Test Manager" tab
- **Expected**: Test Manager interface loads with test cases organized by category

### 4. Select and Run a Test Case
- Find a test case (e.g., "5G NR Initial Access Procedure" under 5G_NR category)
- Click the "Run" button for the test case
- **Expected**: 
  - Test execution starts
  - Automation log shows execution progress
  - Console logs show data fetching attempts

### 5. Switch to 5GLabX Platform Tab
- Click on "5GLabX Platform" tab
- **Expected**: 5GLabX platform loads with various views (Dashboard, Logs, Analytics, etc.)

### 6. Verify Data Flow
- Check the Dashboard view for test case data
- Check the Logs view for message processing
- Check Analytics view for data analysis
- **Expected**: Data from Test Manager appears in 5GLabX views

### 7. Check Console Logs
- Open browser Developer Tools (F12)
- Go to Console tab
- **Expected**: Detailed logs showing:
  - Test Manager execution
  - Data fetching from APIs
  - Data broadcasting to 5GLabX
  - Message processing and analysis

## 🔍 Expected Console Logs

### Test Manager Logs
```
INFO: Starting test execution: 5G-001 (Database ID: 5G-001)
INFO: Fetching test case data for 5G-001...
WARN: Simple execution API failed: 404, trying comprehensive...
WARN: Comprehensive execution API failed: 404
INFO: Using fallback test case data for 5G-001
INFO: ✅ Sent REAL Supabase data to 5GLabX via 5 methods
```

### 5GLabX Platform Logs
```
🎯 5GLabX Dashboard received test data: {type: "5GLABX_TEST_EXECUTION", testCaseId: "5G-001", ...}
📊 Test execution data details: {testCaseId: "5G-001", messagesCount: 3, ...}
📊 5GLabX log analysis: Message 1/3 - RRC Setup Request
📊 5GLabX log analysis: Message 2/3 - RRC Setup
📊 5GLabX log analysis: Message 3/3 - Registration Request
```

## ⚠️ Expected Behavior with Placeholder Credentials

Since `.env.local` contains placeholder Supabase credentials:
- **Supabase APIs will return 404** (this is expected)
- **Test Manager will use fallback data** (this is working correctly)
- **5GLabX will receive and process the fallback data** (this is working correctly)

## 🎉 Success Criteria

The test is successful if:
1. ✅ Server loads without errors
2. ✅ Test Manager interface is functional
3. ✅ Test execution can be initiated
4. ✅ 5GLabX Platform loads and displays data
5. ✅ Console logs show proper data flow
6. ✅ Data appears in 5GLabX views after test execution

## 🔧 Troubleshooting

### If Test Manager doesn't load:
- Check browser console for JavaScript errors
- Verify server is running on port 3000

### If 5GLabX doesn't receive data:
- Check console logs for PostMessage/CustomEvent errors
- Verify data broadcasting is working

### If no data appears in views:
- Check if test execution completed successfully
- Verify data format is correct
- Check for React component errors

## 📊 Test Data Structure

The platform should process:
- **Test Case**: 5G NR Initial Access Procedure
- **Messages**: 3 (RRC Setup Request, RRC Setup, Registration Request)
- **Layers**: RRC, NAS
- **Protocol**: 5G_NR
- **Information Elements**: 4
- **Layer Parameters**: 4

## 🚀 Next Steps After Testing

1. **For Production**: Configure real Supabase credentials
2. **For Development**: Continue using mock data for testing
3. **For Integration**: Test with real Supabase database
4. **For Deployment**: Deploy with proper environment variables