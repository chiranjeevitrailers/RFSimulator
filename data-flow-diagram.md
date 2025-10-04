# 5GLabX Platform Data Flow Architecture

## Overview
This document describes the comprehensive data flow architecture between Test Manager, 5GLabX Analysis, and UE Analysis platforms.

## Data Flow Manager
The `DataFlowManager` is a centralized singleton that manages all data flow between platforms.

### Key Features
- **Event-driven architecture** with subscription system
- **Data persistence** across platform switches
- **Real-time synchronization** between all platforms
- **Cross-platform analysis** capabilities
- **Backward compatibility** with legacy events

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Data Flow Architecture                                │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Test Manager  │    │   5GLabX        │    │  UE Analysis    │
│   (NewTestMgr1) │    │  (New5GLabX1)   │    │ (NewUEAnalysis1)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        DataFlowManager (Singleton)                             │
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │ Event System    │  │ Data Cache      │  │ Execution Mgmt  │                │
│  │ - Subscribe     │  │ - Test Data     │  │ - Start/Stop    │                │
│  │ - Dispatch      │  │ - UE Data       │  │ - Track Status  │                │
│  │ - Notify        │  │ - Network Data  │  │ - History       │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │ Data Conversion │  │ Cross-Platform  │  │ Data Persistence│                │
│  │ - Test → 5GLabX │  │ Analysis        │  │ - Cache         │                │
│  │ - Test → UE     │  │ - Correlation   │  │ - History       │                │
│  │ - Format Adapt  │  │ - Performance   │  │ - State Mgmt    │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────────────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Supabase      │    │   Real-time     │    │   Event Bus     │
│   Database      │    │   Updates       │    │   (Window)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Event Flow

### 1. Test Execution Flow
```
Test Manager → DataFlowManager → 5GLabX Analysis
                    ↓
              UE Analysis
```

**Events:**
- `TEST_EXECUTION_STARTED`
- `MESSAGE_TO_5GLABX`
- `MESSAGE_TO_UE_ANALYSIS`
- `LAYER_{LAYER}_UPDATE`
- `TEST_EXECUTION_COMPLETED`

### 2. Data Processing Flow
```
Supabase API → Test Manager → DataFlowManager → Platform Processing
                    ↓
              Data Format Conversion
                    ↓
              Real-time Distribution
```

**Data Types:**
- Test Messages
- Information Elements
- Layer Parameters
- UE Identity Data
- Signal Quality Data
- Performance Metrics

### 3. Cross-Platform Analysis
```
All Platforms → DataFlowManager → End-to-End Analysis
                    ↓
              Correlated Analysis
                    ↓
              Performance Correlation
```

## Event Types

### Test Manager Events
- `TEST_EXECUTION_STARTED` - Test execution begins
- `TEST_EXECUTION_COMPLETED` - Test execution completes
- `TEST_EXECUTION_STOPPED` - Test execution stopped
- `TEST_EXECUTION_FAILED` - Test execution fails

### 5GLabX Events
- `MESSAGE_TO_5GLABX` - Message sent to 5GLabX
- `LAYER_PHY_UPDATE` - PHY layer update
- `LAYER_MAC_UPDATE` - MAC layer update
- `LAYER_RLC_UPDATE` - RLC layer update
- `LAYER_PDCP_UPDATE` - PDCP layer update
- `LAYER_RRC_UPDATE` - RRC layer update
- `LAYER_NAS_UPDATE` - NAS layer update
- `LAYER_IMS_UPDATE` - IMS layer update

### UE Analysis Events
- `MESSAGE_TO_UE_ANALYSIS` - Message sent to UE Analysis
- `UE_CONNECTED` - UE connects
- `UE_DISCONNECTED` - UE disconnects
- `UE_REGISTRATION` - UE registration
- `UE_SERVICE_REQUEST` - UE service request
- `UE_HANDOVER` - UE handover
- `UE_CALL_SETUP` - UE call setup
- `UE_CALL_RELEASE` - UE call release
- `UE_MOBILITY_UPDATE` - UE mobility update
- `UE_SECURITY_EVENT` - UE security event
- `UE_PERFORMANCE_UPDATE` - UE performance update

### Cross-Platform Events
- `END_TO_END_ANALYSIS` - End-to-end analysis
- `CORRELATED_ANALYSIS` - Correlated analysis
- `PERFORMANCE_CORRELATION` - Performance correlation

## Data Structures

### TestExecutionData
```typescript
interface TestExecutionData {
  executionId: string;
  testCaseId: string;
  testCaseName: string;
  technology: string;
  category: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'STOPPED';
  startTime: Date;
  endTime?: Date;
  messages: TestMessage[];
  informationElements: InformationElement[];
  layerParameters: LayerParameter[];
}
```

### TestMessage
```typescript
interface TestMessage {
  id: string;
  timestamp: number;
  timestampMs: number;
  layer: string;
  protocol: string;
  messageType: string;
  messageName: string;
  direction: 'UL' | 'DL';
  messagePayload: any;
  informationElements?: InformationElement[];
  layerParameters?: LayerParameter[];
  standardReference?: string;
}
```

### UELogMessage
```typescript
interface UELogMessage extends TestMessage {
  ueIdentity: UEIdentity;
  ueLocation: UELocation;
  signalQuality: SignalQuality;
  capabilities: UECapabilities;
  batteryLevel: number;
  powerHeadroom: number;
  uplinkPower: number;
}
```

## Implementation Details

### DataFlowManager Methods
- `subscribe(eventType, callback)` - Subscribe to events
- `dispatch(event)` - Dispatch events
- `startTestExecution(testCaseId, testCaseData)` - Start test execution
- `stopTestExecution(executionId)` - Stop test execution
- `getCurrentExecution()` - Get current execution
- `getExecutionHistory()` - Get execution history
- `performEndToEndAnalysis()` - Perform cross-platform analysis

### Platform Integration
Each platform subscribes to relevant events and processes data according to its specific requirements:

1. **Test Manager**: Dispatches test execution events
2. **5GLabX Analysis**: Processes network analysis data
3. **UE Analysis**: Processes UE-specific data with 3GPP parameters

### Data Persistence
- Data is cached in DataFlowManager
- Execution history is maintained
- Data persists across platform switches
- Only cleared on new test execution

### Real-time Updates
- Events are dispatched immediately
- All platforms receive updates in real-time
- Data is synchronized across all platforms
- Status indicators show live data flow

## Benefits

1. **Centralized Management**: Single point of control for all data flow
2. **Real-time Synchronization**: All platforms stay in sync
3. **Data Persistence**: Data remains available across platform switches
4. **Cross-platform Analysis**: End-to-end analysis capabilities
5. **Backward Compatibility**: Legacy events still work
6. **Scalable Architecture**: Easy to add new platforms
7. **Type Safety**: TypeScript interfaces for all data structures
8. **Event-driven**: Reactive architecture for better performance

## Usage Example

```typescript
// Subscribe to events
const unsubscribe = dataFlowManager.subscribe('ALL', (event) => {
  console.log('Received event:', event.type, event.data);
});

// Dispatch event
dataFlowManager.dispatch({
  type: 'TEST_EXECUTION_STARTED',
  source: 'TEST_MANAGER',
  target: 'ALL',
  data: { testCaseId: '123', testCaseData: {...} },
  timestamp: Date.now()
});

// Start test execution
const executionId = dataFlowManager.startTestExecution('123', testCaseData);

// Stop test execution
dataFlowManager.stopTestExecution(executionId);
```