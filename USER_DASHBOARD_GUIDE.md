# 🎯 User Dashboard - Test Manager Data Flow Guide

## 📋 **Step-by-Step Navigation Guide**

### **1. Access User Dashboard**
```
URL: http://localhost:3000/user-dashboard
```

### **2. Navigate to Test Manager Tab**
1. Open the user dashboard in your browser
2. Click on the **"Test Manager"** tab in the navigation bar
3. You'll see the Professional Test Manager interface

### **3. Select and Run a Test Case**

#### **Available Test Cases:**
- **5G NR Tests:**
  - `5G-001`: 5G NR Initial Access Procedure
  - `5G-002`: 5G NR Handover Test  
  - `5G-003`: 5G NR PDU Session Establishment

- **4G LTE Tests:**
  - `LTE-001`: LTE Attach Procedure
  - `LTE-002`: LTE Handover Test
  - `LTE-003`: LTE Bearer Management

- **IMS/VoLTE Tests:**
  - `IMS-001`: VoLTE Call Setup
  - `IMS-002`: VoNR Call Establishment
  - `IMS-003`: SIP Registration Test

#### **How to Run a Test:**
1. **Select a Test Case** from the table
2. **Click the "Run" button** (green button with play icon)
3. **Observe the execution** in the logs section
4. **Switch to 5GLabX Platform tab** to see real-time data

### **4. Observe Data Flow**

#### **Expected Data Flow:**
```
Test Manager → API Call → Backend Server → WebSocket → 5GLabX Platform
```

#### **What to Look For:**
1. **Test Manager Logs:**
   - Test execution start message
   - API call status
   - WebSocket connection status

2. **5GLabX Platform:**
   - Real-time message updates
   - Protocol layer data
   - Test execution status

3. **Browser Console:**
   - WebSocket connection logs
   - API response data
   - Event handling logs

## 🔍 **Detailed Test Execution Process**

### **Test Case Execution Flow:**

#### **1. Test Manager Triggers Execution**
```javascript
const handleRunTest = async (id: string) => {
  setIsRunning(true);
  
  // Find the test case to get real database ID if available
  const testCase = testCases.find(tc => tc.id === id);
  const realId = (testCase as any)?.realDatabaseId || id;
  
  addLog('INFO', `Starting test execution: ${id} (Database ID: ${realId})`);
  
  // 1. Start test execution via API
  let executionResponse;
  // ... API calls to start test execution
}
```

#### **2. API Endpoints Called:**
- `/api/tests/run` - Start test execution
- `/api/test-execution/simple` - Simple test execution
- `/api/test-execution/enhanced` - Enhanced test execution
- `/api/test-execution/comprehensive` - Comprehensive test execution

#### **3. Backend Server Processing:**
- Receives test execution request
- Processes test case data
- Sends data to WebSocket server (port 8082)
- Updates database with execution status

#### **4. WebSocket Data Streaming:**
- Test execution data sent to `ws://localhost:8082`
- Real-time message updates
- Protocol layer information
- Test status updates

#### **5. 5GLabX Platform Reception:**
- Receives WebSocket data
- Displays real-time updates
- Shows protocol analysis
- Updates test execution status

## 📊 **Test Case Examples**

### **Example 1: 5G NR Initial Access Procedure**
```json
{
  "id": "5G-001",
  "name": "5G NR Initial Access Procedure",
  "component": "5G_NR",
  "status": "Not Started",
  "priority": "High",
  "expectedMessages": [
    "Random Access Preamble",
    "Random Access Response", 
    "RRC Setup Request",
    "RRC Setup",
    "RRC Setup Complete"
  ]
}
```

### **Example 2: LTE Attach Procedure**
```json
{
  "id": "LTE-001", 
  "name": "LTE Attach Procedure",
  "component": "4G_LTE",
  "status": "Not Started",
  "priority": "High",
  "expectedMessages": [
    "Attach Request",
    "Authentication Request",
    "Authentication Response",
    "Security Mode Command",
    "Attach Accept"
  ]
}
```

## 🎯 **What to Observe During Test Execution**

### **1. Test Manager Interface:**
- ✅ Test case selection
- ✅ Run button activation
- ✅ Execution status updates
- ✅ Log messages in the logs section

### **2. 5GLabX Platform:**
- ✅ Real-time message reception
- ✅ Protocol layer visualization
- ✅ Test execution progress
- ✅ Data analysis results

### **3. Browser Console:**
- ✅ WebSocket connection logs
- ✅ API call responses
- ✅ Event handling logs
- ✅ Error messages (if any)

### **4. Network Tab:**
- ✅ API requests to test execution endpoints
- ✅ WebSocket connection to port 8082
- ✅ Real-time data streaming

## 🚀 **Quick Test Execution Steps**

1. **Open Browser**: Navigate to `http://localhost:3000/user-dashboard`
2. **Click Test Manager Tab**: Switch to the Test Manager interface
3. **Select Test Case**: Choose any test case (e.g., "5G-001: 5G NR Initial Access Procedure")
4. **Click Run Button**: Click the green "Run" button
5. **Switch to 5GLabX Tab**: Click "5GLabX Platform" tab
6. **Observe Data Flow**: Watch real-time updates in the 5GLabX interface
7. **Check Console**: Open browser developer tools to see detailed logs

## 🔧 **Troubleshooting**

### **If Test Execution Fails:**
1. Check browser console for error messages
2. Verify backend server is running on ports 8080, 8081, 8082
3. Check WebSocket connection status
4. Verify API endpoints are accessible

### **If No Data Appears in 5GLabX:**
1. Check WebSocket connection to port 8082
2. Verify environment variables are set correctly
3. Check browser console for connection errors
4. Ensure 5GLabX Platform tab is active

---

**Status: ✅ Ready for Test Execution** - The user dashboard is fully functional with Test Manager and 5GLabX Platform integration.