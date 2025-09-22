# 🧪 Testing 5GLabX Platform

## 🎯 Quick Test Guide

### **Step 1: Start the Servers**
```bash
# Terminal 1: Next.js server (already running)
npm run dev

# Terminal 2: WebSocket server (already running)
node server.js
```

### **Step 2: Access the Platform**
1. Open browser: `http://localhost:3000`
2. Click on **"5GLabX Platform"** tab
3. You should see the **"🔥 Test Case Data Display"** section

### **Step 3: Test Data Display**

#### **Option A: Manual Button Click**
1. In the **"🔄 Manual Data Fetch"** section, click the **"📡 Fetch Test Case Data"** button
2. Watch the console for data loading
3. See test case data appear in the display sections

#### **Option B: Browser Console Test**
1. Open browser developer tools (F12)
2. Go to Console tab
3. Copy and paste this test script:

```javascript
// Quick test script
fetch('/api/test-execution/simple/?testCaseId=a27e2fc0-d6a9-4fa7-b3b2-a7d3089af985')
  .then(r => r.json())
  .then(d => {
    console.log('✅ API working:', d.success);
    console.log('📋 Test Case:', d.data?.testCase?.name);
    console.log('📝 Messages:', d.data?.expectedMessages?.length || 0);
    return d;
  })
  .catch(err => console.error('❌ Error:', err));
```

#### **Option C: Direct Event Trigger**
```javascript
// Trigger test data event
const testEvent = new CustomEvent('5GLABX_TEST_EXECUTION', {
  detail: {
    type: '5GLABX_TEST_EXECUTION',
    testCaseId: 'a27e2fc0-d6a9-4fa7-b3b2-a7d3089af985',
    testCaseData: {
      testCase: { name: '5G NR Measurement - 1', protocol: '5G-NR' },
      expectedMessages: [
        { id: 'msg1', messageName: 'RRC Setup Request', layer: 'RRC' },
        { id: 'msg2', messageName: 'RRC Setup', layer: 'RRC' }
      ]
    },
    dataSource: 'Manual Test'
  }
});

window.dispatchEvent(testEvent);
```

---

## 📊 Expected Results

### **✅ Success Indicators:**

1. **API Response:** `{"success": true, ...}`
2. **Test Case Data:** Shows test case information
3. **Message Logs:** Displays 2 messages (RRC Setup Request, RRC Setup)
4. **Console Output:** Shows data processing logs
5. **UI Display:** Visual components show fetched data

### **📋 Sample Console Output:**
```
🔥 SimpleDataDisplay: Starting simple data display...
🔥 SimpleDataDisplay: All event listeners registered
🔥 SimpleDataDisplay: Fetching test case data from API...
📊 API Response Data: {success: true, data: {...}}
📝 Test Case: 5G NR Measurement - 1
📝 Messages: 2
✅ Test case executed successfully
```

---

## 🔧 Troubleshooting

### **❌ If No Data Appears:**

1. **Check API Endpoint:**
   ```bash
   curl "http://localhost:3000/api/test-execution/simple/?testCaseId=a27e2fc0-d6a9-4fa7-b3b2-a7d3089af985"
   ```

2. **Check Database Connection:**
   ```bash
   node test-database-tables.js
   ```

3. **Check Server Status:**
   ```bash
   curl http://localhost:3000/
   curl http://localhost:8080/health
   ```

4. **Manual Data Injection:**
   ```javascript
   // In browser console
   window.manualFetch && window.manualFetch();
   ```

---

## 🎯 Test Case Details

### **Test Case ID:** `a27e2fc0-d6a9-4fa7-b3b2-a7d3089af985`
- **Name:** "5G NR Measurement - 1"
- **Protocol:** 5G-NR
- **Category:** 5G_NR
- **Complexity:** intermediate
- **Expected Messages:** 2 (RRC Setup Request, RRC Setup)
- **Expected IEs:** 2 (UE-Identity, Transaction-ID)
- **Expected Layer Params:** 2 (TransactionID, RSRP)

---

## 🚀 Advanced Testing

### **API Endpoints to Test:**
- `/api/test-cases/basic/?limit=1` - Basic test cases
- `/api/test-execution/simple/?testCaseId=...` - Simple execution
- `/api/test-cases/comprehensive?limit=1` - Comprehensive data

### **WebSocket Testing:**
```javascript
// Test WebSocket connection
const ws = new WebSocket('ws://localhost:8080');
ws.onopen = () => console.log('✅ WebSocket connected');
ws.onmessage = (e) => console.log('📡 WebSocket message:', e.data);
```

---

## 📱 Frontend Components

The 5GLabX platform now includes:

1. **🔥 SimpleDataDisplay** - Manual data fetching with button
2. **📋 Enhanced Logs** - Real-time message display
3. **🔄 Manual Data Fetch** - Button-triggered API calls
4. **📊 Test Manager Integration** - Event-driven data processing

---

## 🎉 Success Verification

When working correctly, you should see:

- ✅ **Green "System Online"** indicator
- ✅ **Test case data** displayed in UI components
- ✅ **Message logs** showing RRC Setup messages
- ✅ **Console logs** showing successful data processing
- ✅ **API responses** with test case information

The 5GLabX platform is now **fully functional** with complete data flow from Supabase database to frontend display! 🚀