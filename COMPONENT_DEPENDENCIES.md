# 🗂️ Component Dependency Map & File Structure

## 📁 Detailed File Structure

```
📦 Stable Components Architecture
├─ 🧪 components/testing/
│  ├─ ProfessionalTestManager.tsx ──────── MAIN TEST PLATFORM
│  ├─ ProfessionalTestingPlatform.tsx ─── Supporting platform
│  ├─ TestDashboard.tsx ──────────────── Dashboard component
│  ├─ BackendIntegration.js ─────────── Legacy backend integration
│  ├─ SupabaseIntegration.js ────────── Supabase connection
│  ├─ TestExecutionEngine.js ───────── Test execution logic
│  ├─ TestingPlatformConfig.js ─────── Platform configuration
│  │
│  └─ 📁 Test Case Builders (3 stable variants)/
│     ├─ TestCaseBuilder/
│     │  └─ TestCaseBuilder.tsx ──── Basic test case creation
│     ├─ ComprehensiveTestCaseBuilder/
│     │  └─ ComprehensiveTestCaseBuilder.tsx ── 1000+ test cases
│     ├─ EnhancedTestCaseBuilder/
│     │  └─ EnhancedTestCaseBuilder.tsx ── Call flow builder
│     └─ LTECellSearchBuilder/
│        └─ LTECellSearchBuilder.tsx ── LTE-specific builder
│
├─ 📡 components/5glabx/
│  ├─ Enhanced5GLabXPlatform.tsx ────── MAIN 5GLABX PLATFORM
│  │
│  ├─ 📁 providers/
│  │  └─ DataFlowProvider.tsx ───────── Central data management
│  │
│  ├─ 📁 services/
│  │  ├─ APIIntegration.tsx ─────────── API connection layer  
│  │  ├─ EventBridge.tsx ─────────────── Event system bridge
│  │  ├─ ProtocolLayerDataService.ts ── Protocol data handling
│  │  ├─ TestExecutionService.tsx ───── Test execution service
│  │  └─ TestExecutionWebSocketService.tsx ─ WebSocket handling
│  │
│  ├─ 📁 views/ (Main Analysis Views)
│  │  ├─ LogsView.tsx ────────────────── Real-time log streaming
│  │  ├─ AnalyticsView.tsx ──────────── Performance analytics  
│  │  ├─ CallFlowView.tsx ───────────── Call sequence analysis
│  │  ├─ LayerTraceView.tsx ─────────── Protocol stack tracing
│  │  ├─ TestSuitesView.tsx ─────────── Test suite management
│  │  ├─ LayerParameterMonitor.tsx ──── Layer parameter tracking
│  │  ├─ RealDataDirectView.tsx ─────── Direct data visualization
│  │  ├─ SimpleDirectDataView.tsx ───── Simplified data view
│  │  └─ ImsLayerView.tsx ──────────── IMS protocol analysis
│  │
│  ├─ 📁 views/ (Protocol Layer Views)
│  │  ├─ PhyLayerViewTSX.tsx ─────────── PHY layer analysis
│  │  ├─ PhyLayerViewEnhanced.tsx ───── Enhanced PHY analysis
│  │  ├─ MacLayerViewTSX.tsx ─────────── MAC layer monitoring
│  │  ├─ RlcLayerViewTSX.tsx ─────────── RLC layer analysis
│  │  ├─ PdcpLayerViewTSX.tsx ────────── PDCP layer monitoring
│  │  ├─ RrcLayerViewTSX.tsx ─────────── RRC signaling analysis
│  │  └─ NasLayerViewTSX.tsx ─────────── NAS messaging analysis
│  │
│  ├─ 📁 views/ (Technology Views)
│  │  ├─ OranView.tsx ────────────────── O-RAN analysis
│  │  ├─ NbiotView.tsx ───────────────── NB-IoT monitoring
│  │  ├─ V2xView.tsx ─────────────────── V2X communication
│  │  └─ NtnView.tsx ─────────────────── NTN satellite
│  │
│  └─ 📁 components/ (Supporting Components)
│     ├─ DataFlowDebugger.tsx ───────── Debug & monitoring
│     ├─ DirectDataInjector.tsx ─────── Data injection
│     ├─ IntegrationTester.tsx ──────── Integration testing
│     ├─ LayerParametersTracker.tsx ─── Parameter tracking
│     ├─ LayerStatisticsDashboard.tsx ─ Statistics dashboard
│     ├─ ProtocolLayerDataTest.tsx ──── Protocol data testing
│     ├─ SimpleDataDisplay.tsx ──────── Simple data display
│     ├─ TestDataGenerator.tsx ──────── Test data generation
│     └─ ThreeGPPComplianceDashboard.tsx ─ 3GPP compliance
│
└─ 🎛️ components/professional-log-analysis/
   └─ ProfessionalAnalysisPlatform.tsx ─ QXDM-style professional UI
```

## 🔗 Component Dependencies

### **ProfessionalTestManager Dependencies**
```
ProfessionalTestManager.tsx
├── 📚 External Libraries
│   ├── @/lib/supabase ──────────── Database connection
│   ├── lucide-react ───────────── UI icons
│   └── React hooks ────────────── State management
│
├── 🎨 Internal Components  
│   ├── RanComponentsSelector ──── RAN component selection
│   ├── TestSuitesHierarchy ───── Test suite tree view
│   ├── TestCaseGrid ──────────── Test case display grid
│   ├── ExecutionConsole ──────── Execution logging
│   └── ProfessionalStatusBar ─── Status information
│
├── 🗄️ Data Services
│   ├── SupabaseTestCaseLoader ── Load test cases from DB
│   ├── TestExecutionEngine ───── Execute test logic
│   ├── RealTimeLogger ────────── Live logging system
│   └── ResultsProcessor ──────── Process & store results
│
└── 🔄 Event System
    ├── TestExecutionEvents ───── Test lifecycle events
    ├── DataFlowBroadcasting ─── Broadcast to other platforms
    ├── ErrorHandling ─────────── Error management
    └── StatusUpdates ─────────── Real-time status updates
```

### **Enhanced5GLabXPlatform Dependencies**
```
Enhanced5GLabXPlatform.tsx
├── 🎛️ Core Framework
│   ├── DataFlowProvider ───────── Central data management
│   ├── React Context ──────────── State sharing
│   └── useDataFlow hook ──────── Data flow integration
│
├── 📊 Main Views
│   ├── LogsView ───────────────── Real-time log display
│   ├── AnalyticsView ─────────── Performance charts
│   ├── LayerTraceView ────────── Protocol stack trace
│   ├── CallFlowView ──────────── Call sequence diagram
│   └── TestSuitesView ────────── Test suite interface
│
├── 🔧 Protocol Analyzers
│   ├── PhyLayerViewTSX ───────── Physical layer
│   ├── MacLayerViewTSX ───────── MAC layer  
│   ├── RlcLayerViewTSX ───────── RLC layer
│   ├── PdcpLayerViewTSX ──────── PDCP layer
│   ├── RrcLayerViewTSX ───────── RRC layer
│   ├── NasLayerViewTSX ───────── NAS layer
│   └── ImsLayerView ──────────── IMS layer
│
├── 🌐 Technology Modules
│   ├── OranView ──────────────── O-RAN analysis
│   ├── NbiotView ─────────────── NB-IoT monitoring
│   ├─ V2xView ────────────────── V2X analysis
│   └── NtnView ───────────────── NTN satellite
│
├── 🏗️ Core Network
│   ├── AmfAnalyzer ───────────── AMF analysis
│   ├── SmfAnalyzer ───────────── SMF analysis  
│   ├── UpfAnalyzer ───────────── UPF analysis
│   ├── AusfAnalyzer ─────────── AUSF analysis
│   └── UdmAnalyzer ───────────── UDM analysis
│
└── 🔄 Services Layer
    ├── EventBridge ──────────── Event management
    ├── ProtocolLayerDataService ─ Data processing
    ├── TestExecutionService ─── Test orchestration
    └── APIIntegration ───────── External API calls
```

## 🔄 Data Flow Dependencies

### **Cross-Component Communication**
```
┌─────────────────────────────────────────────────────────────────────┐
│                    Component Communication Map                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────┐         ┌─────────────────────────────┐   │
│  │ ProfessionalTest    │ ────────▶│     DataFlowProvider       │   │
│  │ Manager             │         │                             │   │
│  │                     │ Events  │  • Event Broadcasting      │   │
│  │ • Test Execution    │ ──────▶ │  • State Management        │   │
│  │ • Result Processing │         │  • Data Transformation     │   │
│  │ • Status Updates    │         │  • Component Coordination  │   │
│  └─────────────────────┘         └─────────────────────────────┘   │
│           │                                     │                   │
│           ▼                                     ▼                   │
│  ┌─────────────────────┐         ┌─────────────────────────────┐   │
│  │    Supabase        │         │   Enhanced5GLabX           │   │
│  │    Database        │         │   Platform                  │   │
│  │                    │         │                             │   │
│  │ • test_cases       │         │ • LogsView                  │   │
│  │ • test_executions  │◀────────│ • AnalyticsView             │   │
│  │ • test_results     │ Results │ • Protocol Analyzers       │   │
│  │ • protocol_msgs    │ Storage │ • Technology Views          │   │
│  └─────────────────────┘         └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### **Service Dependencies**
```
┌─────────────────────────────────────────────────────────────────────┐
│                         Service Layer                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  DataFlowProvider.tsx                                               │
│  ├── EventBridge.tsx ─────────── Inter-component messaging        │
│  ├── ProtocolLayerDataService.ts ─ Protocol data processing       │
│  ├── TestExecutionService.tsx ── Test orchestration               │
│  └── APIIntegration.tsx ─────── External API management           │
│                                                                     │
│  Supporting Services:                                               │
│  ├── TestExecutionWebSocketService.tsx ─ Real-time connectivity   │
│  ├── DataFlowDebugger.tsx ──────────── Debug & monitoring         │
│  ├── IntegrationTester.tsx ─────────── Integration validation     │
│  └── TestDataGenerator.tsx ─────────── Test data simulation       │
└─────────────────────────────────────────────────────────────────────┘
```

## 🎯 Integration Architecture

### **Database Schema (Supabase)**
```
┌─────────────────────────────────────────────────────────────────────┐
│                      Supabase Schema                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📋 test_cases                                                      │
│  ├── id (uuid, primary key)                                        │
│  ├── name (text)                                                   │
│  ├── description (text)                                            │
│  ├── technology (text: 5G_NR, 4G_LTE, etc.)                      │
│  ├── category (text: PROTOCOL, PERFORMANCE, etc.)                 │
│  ├── expected_messages (jsonb)                                     │
│  ├── test_parameters (jsonb)                                       │
│  └── created_at, updated_at (timestamps)                           │
│                                                                     │
│  ⚡ test_executions                                                 │
│  ├── id (uuid, primary key)                                        │
│  ├── test_case_id (uuid, foreign key)                             │
│  ├── user_id (uuid)                                               │
│  ├── status (text: RUNNING, COMPLETED, FAILED)                    │
│  ├── start_time, end_time (timestamps)                            │
│  ├── execution_data (jsonb)                                        │
│  └── results (jsonb)                                              │
│                                                                     │
│  📊 protocol_messages                                               │
│  ├── id (uuid, primary key)                                        │
│  ├── execution_id (uuid, foreign key)                             │
│  ├── timestamp (timestamp)                                         │
│  ├── layer (text: PHY, MAC, RLC, etc.)                           │
│  ├── message_type (text)                                          │
│  ├── direction (text: UL, DL)                                     │
│  ├── content (jsonb)                                              │
│  └── decoded_data (jsonb)                                         │
└─────────────────────────────────────────────────────────────────────┘
```

### **Event System Architecture**
```
┌─────────────────────────────────────────────────────────────────────┐
│                        Event System                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Event Types:                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  TEST_EXECUTION_STARTED                                     │   │
│  │  ├── testCaseId: string                                     │   │
│  │  ├── executionId: string                                    │   │
│  │  ├── testCaseData: object                                   │   │
│  │  └── timestamp: number                                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  PROTOCOL_MESSAGE_RECEIVED                                  │   │
│  │  ├── layer: string (PHY, MAC, RLC, etc.)                   │   │
│  │  ├── messageType: string                                    │   │
│  │  ├── content: object                                        │   │
│  │  ├── direction: string (UL, DL)                            │   │
│  │  └── timestamp: number                                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  TEST_EXECUTION_COMPLETED                                   │   │
│  │  ├── executionId: string                                    │   │
│  │  ├── status: string (SUCCESS, FAILED)                      │   │
│  │  ├── results: object                                        │   │
│  │  └── metrics: object                                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## 🔧 Configuration & Setup

### **Environment Dependencies**
```
┌─────────────────────────────────────────────────────────────────────┐
│                    Required Configuration                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📦 Package Dependencies:                                           │
│  ├── @supabase/supabase-js ──── Database connectivity              │
│  ├── lucide-react ─────────── UI icons                            │
│  ├── tailwindcss ──────────── Styling framework                   │
│  └── next.js ──────────────── React framework                     │
│                                                                     │
│  ⚙️ Environment Variables:                                          │
│  ├── NEXT_PUBLIC_SUPABASE_URL ── Supabase project URL             │
│  ├── NEXT_PUBLIC_SUPABASE_ANON_KEY ─ Supabase API key            │
│  └── DATABASE_URL ─────────── Database connection string           │
│                                                                     │
│  🗂️ Required File Structure:                                       │
│  ├── /lib/supabase.ts ────── Supabase client setup               │
│  ├── /utils/DataFlowManager.ts ─ Data flow utilities             │
│  └── /styles/globals.css ─── Global styling                       │
└─────────────────────────────────────────────────────────────────────┘
```

This comprehensive map shows how all the stable components work together in a **production-ready architecture** with **proper separation of concerns** and **clear data flow**!