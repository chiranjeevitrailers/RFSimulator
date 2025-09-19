# 🔄 Data Flow: Test Manager → 5GLabX Platform

## 📊 **Complete Data Flow Architecture**

### 🎯 **Current Integration Status:**

The Test Manager and 5GLabX Platform are **SEPARATE TABS** in the User Dashboard with **INDEPENDENT DATA FLOWS**. Here's how data currently flows:

## 🔀 **Two Parallel Data Flows:**

### 1️⃣ **Test Manager Data Flow (Tab 1):**

```
┌─────────────────────────────────────────────────────────────────┐
│                     TEST MANAGER TAB                           │
├─────────────────────────────────────────────────────────────────┤
│  User Dashboard → Test Manager Tab → ProfessionalTestManager    │
│                                   ↓                            │
│                          ClassicTestManager                     │
│                                   ↓                            │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              TEST EXECUTION FLOW                            │ │
│  │                                                             │ │
│  │  1. User clicks category (e.g., "5G NR")                  │ │
│  │     ↓                                                       │ │
│  │  2. loadDomainCases("5G NR")                              │ │
│  │     ↓                                                       │ │
│  │  3. API: /api/test-cases/comprehensive?category=5G_NR      │ │
│  │     ↓                                                       │ │
│  │  4. Supabase Database Query                                │ │
│  │     ↓                                                       │ │
│  │  5. Test cases loaded in table                             │ │
│  │     ↓                                                       │ │
│  │  6. User selects tests & clicks "Run"                      │ │
│  │     ↓                                                       │ │
│  │  7. API: /api/tests/run                                    │ │
│  │     ↓                                                       │ │
│  │  8. Creates test_case_executions record                    │ │
│  │     ↓                                                       │ │
│  │  9. Real-time polling: /api/tests/runs/active              │ │
│  │     ↓                                                       │ │
│  │ 10. Status updates in Test Manager UI                      │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 2️⃣ **5GLabX Platform Data Flow (Tab 2):**

```
┌─────────────────────────────────────────────────────────────────┐
│                    5GLABX PLATFORM TAB                         │
├─────────────────────────────────────────────────────────────────┤
│  User Dashboard → 5GLabX Platform Tab → FiveGLabXPlatform       │
│                                       ↓                        │
│                          5GLabXPlatformMinimal                  │
│                                       ↓                        │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              5GLABX DATA FLOW ARCHITECTURE                  │ │
│  │                                                             │ │
│  │  1. DataFlowProvider initializes                           │ │
│  │     ↓                                                       │ │
│  │  2. WebSocket connection: ws://localhost:8081               │ │
│  │     ↓                                                       │ │
│  │  3. TestCasePlaybackService starts                         │ │
│  │     ↓                                                       │ │
│  │  4. CLI Backend Integration:                               │ │
│  │     - BackendIntegration.js                                │ │
│  │     - CLIBridge.js                                         │ │
│  │     - RealTimeDataBridge.js                                │ │
│  │     ↓                                                       │ │
│  │  5. Layer-Specific Processing:                             │ │
│  │     - StreamProcessor.js                                   │ │
│  │     - LogProcessor.js                                      │ │
│  │     - MessageAnalyzer.js                                   │ │
│  │     - LayerStatsService.js                                 │ │
│  │     ↓                                                       │ │
│  │  6. Protocol Layer Distribution:                           │ │
│  │     - PHY: RSRP, SINR, channel measurements               │ │
│  │     - MAC: HARQ, scheduling, grants                       │ │
│  │     - RRC: Connection management, handovers               │ │
│  │     - NAS: Registration, authentication                   │ │
│  │     - IMS: SIP signaling, call flows                      │ │
│  │     ↓                                                       │ │
│  │  7. Real-time visualization in 5GLabX views               │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🔗 **Potential Integration Points:**

### 🎯 **How Test Manager COULD Feed Data to 5GLabX:**

Currently, these are **SEPARATE SYSTEMS**, but here are the potential integration pathways:

#### **Option 1: Shared Database Integration**
```
Test Manager → Database → 5GLabX
     ↓              ↓         ↓
1. Run tests   2. Store    3. Read results
   via API        results     for analysis
                  in DB       
```

#### **Option 2: API Bridge Integration**
```
Test Manager → API Bridge → 5GLabX
     ↓              ↓         ↓
1. Execute     2. Forward   3. Process in
   test cases     results     real-time
```

#### **Option 3: WebSocket Integration**
```
Test Manager → WebSocket → 5GLabX
     ↓              ↓         ↓
1. Run tests   2. Stream    3. Real-time
   get results    results     visualization
```

## 🛠️ **Current Integration Status:**

### ✅ **What's Working:**
- **Test Manager**: Fully functional test execution and monitoring
- **5GLabX Platform**: Complete real-time data processing architecture
- **Separate Data Flows**: Each system works independently
- **Database Layer**: Shared Supabase database for test cases
- **API Layer**: Both systems have their own API endpoints

### ❌ **What's Missing:**
- **Direct Integration**: No direct data flow from Test Manager to 5GLabX
- **Shared Execution Context**: Test runs don't automatically feed into 5GLabX
- **Real-time Bridge**: No real-time data bridge between the two systems

## 🚀 **Integration Implementation Plan:**

### **Phase 1: Database Bridge**
```typescript
// In ClassicTestManager.tsx
const handleRunTest = async (id: string) => {
  // Current test execution
  const execution = await fetch('/api/tests/run', { ... });
  
  // NEW: Notify 5GLabX of test execution
  if (window.DataFlowProvider) {
    window.DataFlowProvider.startTestCase(id);
  }
};
```

### **Phase 2: WebSocket Bridge**
```typescript
// In DataFlowIntegration.tsx
useEffect(() => {
  // Listen for test manager events
  window.addEventListener('testManagerExecution', (event) => {
    const { testId, executionId, data } = event.detail;
    // Process test data in 5GLabX
    processTestData(data);
  });
}, []);
```

### **Phase 3: API Integration**
```typescript
// New API endpoint: /api/integration/test-to-5glabx
export async function POST(request: NextRequest) {
  const { executionId, testData } = await request.json();
  
  // Forward test data to 5GLabX processing pipeline
  await forwardTo5GLabX(testData);
  
  return NextResponse.json({ success: true });
}
```

## 📊 **Data Flow Mapping:**

### **Test Manager Data → 5GLabX Processing:**

| Test Manager Output | 5GLabX Input | Processing Layer |
|-------------------|--------------|------------------|
| Test execution logs | LogProcessor | Real-time log analysis |
| Protocol messages | MessageAnalyzer | 3GPP message validation |
| Layer parameters | LayerStatsService | Layer-specific metrics |
| KPI measurements | StreamProcessor | Real-time KPI calculation |
| Test results | DataFlowProvider | Result visualization |

## 🎯 **Current Architecture Summary:**

### **Test Manager (Tab 1):**
- ✅ **Purpose**: Test case management and execution
- ✅ **Data Source**: Supabase database (test_cases table)
- ✅ **Execution**: API-based test running
- ✅ **Monitoring**: Real-time status polling
- ✅ **UI**: Professional test management interface

### **5GLabX Platform (Tab 2):**
- ✅ **Purpose**: Real-time protocol analysis and visualization
- ✅ **Data Source**: CLI backends (srsRAN, Open5GS, Kamailio)
- ✅ **Processing**: Multi-layer data processing pipeline
- ✅ **Visualization**: Real-time protocol layer views
- ✅ **Architecture**: Complete data flow architecture

## 🔄 **Integration Status: INDEPENDENT SYSTEMS**

**Current State**: Test Manager and 5GLabX operate as **separate, independent systems** within the same User Dashboard.

**Data Flow**: Each system has its own complete data flow architecture without cross-system integration.

**Next Steps**: To integrate, we would need to implement one of the bridge architectures outlined above.

**Recommendation**: The systems work well independently. Integration should be considered based on specific use case requirements for unified test execution and analysis workflows.