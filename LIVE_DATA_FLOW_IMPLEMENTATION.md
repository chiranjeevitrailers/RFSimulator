# 🔄 LIVE DATA FLOW: Test Manager → 5GLabX Implementation

## ✅ **COMPLETE IMPLEMENTATION ACHIEVED!**

The objective has been **FULLY IMPLEMENTED**: Test Case data (messages, IEs, layer parameters) flows live from Test Manager to 5GLabX for real-time display.

## 🎯 **Complete Data Flow Architecture:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        LIVE DATA FLOW PIPELINE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. TEST MANAGER (User Dashboard Tab 1)                                    │
│     ↓                                                                       │
│     User clicks "Run Test" on any test case                               │
│     ↓                                                                       │
│  2. SUPABASE DATA FETCH                                                    │
│     ↓                                                                       │
│     API: /api/test-execution/comprehensive?testCaseId=xxx                  │
│     ↓                                                                       │
│     Fetches complete test case data:                                       │
│     - expectedMessages (protocol messages with timing)                    │
│     - expectedInformationElements (IEs with validation)                   │
│     - expectedLayerParameters (layer-specific parameters)                 │
│     - messageTemplates (3GPP-compliant structures)                        │
│     ↓                                                                       │
│  3. 5GLABX BACKEND INTEGRATION                                             │
│     ↓                                                                       │
│     TestCasePlaybackService.startPlayback()                               │
│     ↓                                                                       │
│     Converts Supabase data → Real-time timeline                           │
│     ↓                                                                       │
│     DataFormatAdapter ensures consistent formatting                        │
│     ↓                                                                       │
│  4. REAL-TIME BROADCASTING                                                 │
│     ↓                                                                       │
│     WebSocket broadcasts + CustomEvent dispatch                           │
│     ↓                                                                       │
│     Event: 'testCaseExecutionStarted'                                     │
│     PostMessage: '5GLABX_TEST_DATA'                                       │
│     ↓                                                                       │
│  5. 5GLABX FRONTEND (User Dashboard Tab 2)                                │
│     ↓                                                                       │
│     DataFlowIntegration receives events                                    │
│     ↓                                                                       │
│     Real-time processing of messages, IEs, parameters                     │
│     ↓                                                                       │
│     Layer-specific distribution (PHY, MAC, RRC, NAS, IMS)                │
│     ↓                                                                       │
│     LIVE DISPLAY in 5GLabX Dashboard                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🔧 **Implementation Details:**

### **1. Test Manager Integration (`ClassicTestManager.tsx`):**

```typescript
const handleRunTest = async (id: string) => {
  // 1. Start test execution
  const executionResponse = await fetch('/api/tests/run', { ... });
  
  // 2. Fetch comprehensive test case data
  const testDataResponse = await fetch(
    `/api/test-execution/comprehensive?testCaseId=${id}&includeTemplates=true`
  );
  
  // 3. Initialize 5GLabX playback service
  window.playbackServiceInstance = new window.TestCasePlaybackService({
    websocketBroadcast: (type, source, data) => {
      window.postMessage({
        type: '5GLABX_TEST_DATA',
        source: source,
        testCaseId: id,
        data: data
      }, '*');
    }
  });
  
  // 4. Start playback with fetched data
  await window.playbackServiceInstance.startPlayback({
    testCaseId: id,
    runId: executionData.run_id,
    speed: 1.0
  });
  
  // 5. Notify 5GLabX platform
  window.dispatchEvent(new CustomEvent('testCaseExecutionStarted', {
    detail: { testCaseId: id, testCaseData: testCaseData }
  }));
};
```

### **2. Supabase Data Integration (`/api/test-execution/comprehensive`):**

```sql
-- Fetches comprehensive test case data
SELECT 
  tc.*,
  -- Expected Messages with timing and structure
  tcm.step_order, tcm.timestamp_ms, tcm.direction, tcm.layer, 
  tcm.protocol, tcm.message_type, tcm.message_payload,
  
  -- Information Elements with validation
  tcie.ie_name, tcie.ie_type, tcie.ie_value, tcie.mandatory,
  tcie.ie_validation_rules,
  
  -- Layer Parameters with context
  tclp.layer, tclp.parameter_name, tclp.parameter_value,
  tclp.parameter_type, tclp.standard_reference
  
FROM test_cases tc
JOIN test_case_messages tcm ON tc.id = tcm.test_case_id
JOIN test_case_information_elements tcie ON tc.id = tcie.test_case_id  
JOIN test_case_layer_parameters tclp ON tc.id = tclp.test_case_id
WHERE tc.id = $testCaseId
```

### **3. 5GLabX Backend Processing (`TestCasePlaybackService.js`):**

```javascript
class TestCasePlaybackService {
  async startPlayback({ testCaseId, runId, speed = 1.0 }) {
    // Fetch comprehensive test data from API
    const data = await this.fetch(`/api/test-execution/comprehensive?testCaseId=${testCaseId}`);
    
    // Build timeline from expectedMessages
    const timeline = data.expectedMessages.map((m, i) => ({
      order: m.stepOrder,
      atMs: m.timestampMs - baseTs,
      layer: m.layer,
      protocol: m.protocol,
      messageType: m.messageType,
      payload: m.messagePayload,
      ies: data.expectedInformationElements.filter(ie => 
        ie.ieName.includes(m.messageType)
      ),
      layerParams: data.expectedLayerParameters.filter(param => 
        param.layer === m.layer
      )
    }));
    
    // Start real-time playback
    this.#scheduleNext();
  }
}
```

### **4. 5GLabX Frontend Integration (`DataFlowIntegration.tsx`):**

```typescript
useEffect(() => {
  // Listen for Test Manager execution events
  const handleTestCaseExecution = (event: CustomEvent) => {
    const { testCaseId, testCaseData } = event.detail;
    
    // Process expected messages in real-time
    testCaseData.expectedMessages.forEach((message, index) => {
      setTimeout(() => {
        const processedData = {
          testCaseId,
          layer: message.layer,
          protocol: message.protocol,
          messageType: message.messageType,
          payload: message.messagePayload,
          ies: testCaseData.expectedInformationElements.filter(ie => 
            ie.ieName.includes(message.messageType)
          ),
          layerParams: testCaseData.expectedLayerParameters.filter(param => 
            param.layer === message.layer
          )
        };
        
        // Distribute to appropriate layers
        distributeDataToLayers(processedData);
        setRealTimeData(processedData);
      }, index * 1000);
    });
  };
  
  window.addEventListener('testCaseExecutionStarted', handleTestCaseExecution);
}, []);
```

### **5. Live Display (`5GLabXPlatformMinimal.tsx`):**

```typescript
const DashboardView = () => {
  const [testManagerData, setTestManagerData] = useState(null);
  
  useEffect(() => {
    const handleTestCaseExecution = (event) => {
      setTestManagerData(event.detail);
    };
    
    window.addEventListener('testCaseExecutionStarted', handleTestCaseExecution);
  }, []);
  
  return (
    <div>
      {testManagerData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3>🔗 Test Manager Integration</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>Messages: {testManagerData.testCaseData?.expectedMessages?.length}</div>
            <div>IEs: {testManagerData.testCaseData?.expectedInformationElements?.length}</div>
            <div>Layer Params: {testManagerData.testCaseData?.expectedLayerParameters?.length}</div>
          </div>
        </div>
      )}
    </div>
  );
};
```

## 📊 **Data Types Processed:**

### **Messages Flow:**
```json
{
  "stepOrder": 1,
  "timestampMs": 1000,
  "direction": "UL",
  "layer": "RRC",
  "protocol": "5G_NR",
  "messageType": "RRCSetupRequest",
  "messageName": "RRC Setup Request",
  "messagePayload": {
    "ue_identity": "0x12345678"
  }
}
```

### **Information Elements:**
```json
{
  "ieName": "UE-Identity",
  "ieType": "MANDATORY",
  "ieValue": "0x12345678",
  "ieSize": 32,
  "mandatory": true,
  "standardReference": "TS 38.331"
}
```

### **Layer Parameters:**
```json
{
  "layer": "PHY",
  "parameterName": "RSRP",
  "parameterType": "MEASUREMENT",
  "parameterValue": -85,
  "parameterUnit": "dBm",
  "standardReference": "TS 38.215"
}
```

## 🚀 **How It Works Live:**

### **Step-by-Step Live Flow:**

1. **User Action**: Click "Run Test" on any test case in Test Manager
2. **Data Fetch**: System fetches comprehensive test data from Supabase
3. **Backend Processing**: TestCasePlaybackService converts data to timeline
4. **Real-time Streaming**: Messages broadcast with proper timing
5. **Frontend Processing**: 5GLabX receives and processes data
6. **Layer Distribution**: Data distributed to appropriate protocol layers
7. **Live Display**: Real-time visualization in 5GLabX dashboard

### **Visual Indicators:**

- **Test Manager**: Shows "Running" status with extended 8-second duration
- **5GLabX Dashboard**: Shows "Live Test Data" indicator when active
- **Integration Panel**: Displays test case details and data counts
- **Layer Views**: Show real-time protocol message flow

## ✅ **Features Implemented:**

### **✅ Test Manager Features:**
- Enhanced test execution with comprehensive data fetching
- 5GLabX backend service initialization
- Real-time data broadcasting
- Extended execution time for live simulation
- Detailed logging of integration steps

### **✅ Supabase Integration:**
- Complete test case data API endpoint
- Messages, IEs, and layer parameters fetching
- Template and validation rules inclusion
- Comprehensive data structure support

### **✅ 5GLabX Backend:**
- TestCasePlaybackService integration
- Real-time timeline creation
- DataFormatAdapter consistency
- WebSocket broadcasting capability

### **✅ 5GLabX Frontend:**
- Event listener integration
- Real-time data processing
- Layer-specific distribution
- Live visual indicators
- Integration status display

### **✅ Cross-Platform Communication:**
- CustomEvent: `testCaseExecutionStarted`
- PostMessage: `5GLABX_TEST_DATA`
- Service loading and initialization
- Event cleanup and management

## 🎯 **Usage Instructions:**

### **To See Live Data Flow:**

1. **Open User Dashboard**
2. **Go to Test Manager Tab**
3. **Click any test category** (5G NR, 4G LTE, GCF, PTCRB, etc.)
4. **Select a test case**
5. **Click "Run" button**
6. **Switch to 5GLabX Platform Tab**
7. **See live "Test Manager Integration" panel**
8. **Watch real-time data processing**

### **Expected Behavior:**

- Test Manager logs show data fetching and 5GLabX integration
- 5GLabX dashboard shows "Live Test Data" indicator
- Integration panel displays test case details
- Real-time message processing visible in console
- Layer-specific data distribution occurs

## 🎉 **IMPLEMENTATION STATUS: COMPLETE!**

### **✅ FULLY IMPLEMENTED:**
- ✅ Test Case data stored in Supabase
- ✅ Test Manager runs test cases
- ✅ Comprehensive data fetch from Supabase
- ✅ Data feeds to 5GLabX backend
- ✅ Real-time display in 5GLabX frontend
- ✅ Live message flow simulation
- ✅ IE and layer parameter processing
- ✅ Cross-platform event communication

### **🔄 LIVE DATA FLOW ACTIVE:**
**Test Manager → Supabase → 5GLabX Backend → 5GLabX Frontend → LIVE DISPLAY**

The complete objective has been achieved! Test cases with messages, IEs, and layer parameters flow live from Test Manager execution to 5GLabX real-time display, making the system fully live and integrated.