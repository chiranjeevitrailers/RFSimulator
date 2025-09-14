# 5GLabX Protocol Analyzer - Corrected Workflow

## 🔄 **Actual Tool Workflow**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        🎯 5GLabX Tool Workflow                                │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              🌐 FRONTEND LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Test Suites   │  │   Test Runner   │  │Enhanced Log View│  │   Results   │ │
│  │                 │  │                 │  │                 │  │   Display   │ │
│  │ • Select Test   │  │ • Run Test      │  │ • PHY Group     │  │ • Pass/Fail │ │
│  │ • 1000+ Tests   │  │ • Execute       │  │ • MAC Group     │  │ • Assertions│ │
│  │ • Filter/Search │  │ • Monitor       │  │ • RLC Group     │  │ • KPIs      │ │
│  │ • Bulk Select   │  │ • Progress      │  │ • PDCP Group    │  │ • Reports   │ │
│  │                 │  │                 │  │ • RRC Group     │  │             │ │
│  │                 │  │                 │  │ • NAS Group     │  │             │ │
│  │                 │  │                 │  │ • IMS Group     │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              🔌 API LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │Test Selection│  │Test Execution│  │Message Fetch│  │Layer Mapping│  │Results  │ │
│  │API           │  │API           │  │API          │  │API          │  │API      │ │
│  │             │  │             │  │             │  │             │  │         │ │
│  │ • Get Tests │  │ • Start Run │  │ • Fetch IEs │  │ • Parse     │  │ • Get    │ │
│  │ • Filter    │  │ • Monitor   │  │ • Fetch Params│  │ • Map Layers│  │ Results │ │
│  │ • Search    │  │ • Cancel    │  │ • Fetch Msgs│  │ • Validate  │  │ • Export │ │
│  │ • Details   │  │ • Status    │  │ • Timestamps│  │ • Process   │  │ • Share  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            ⚙️ BACKEND PROCESSING                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                           WORKFLOW STEPS                                   │ │
│  │                                                                             │ │
│  │  1. SELECT TEST CASE                                                       │ │
│  │     ┌─────────────┐                                                        │ │
│  │     │ User selects│                                                        │ │
│  │     │ test case   │                                                        │ │
│  │     │ from 1000+  │                                                        │ │
│  │     │ available   │                                                        │ │
│  │     └─────────────┘                                                        │ │
│  │             │                                                              │ │
│  │             ▼                                                              │ │
│  │  2. RUN TEST                                                               │ │
│  │     ┌─────────────┐                                                        │ │
│  │     │ Execute test│                                                        │ │
│  │     │ case logic  │                                                        │ │
│  │     │ & generate  │                                                        │ │
│  │     │ messages    │                                                        │ │
│  │     └─────────────┘                                                        │ │
│  │             │                                                              │ │
│  │             ▼                                                              │ │
│  │  3. FETCH STORED DATA                                                      │ │
│  │     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                    │ │
│  │     │ Messages    │  │Information  │  │ Parameters  │                    │ │
│  │     │ from        │  │Elements     │  │ from        │                    │ │
│  │     │ Supabase    │  │ from        │  │ Supabase    │                    │ │
│  │     │             │  │ Supabase    │  │             │                    │ │
│  │     └─────────────┘  └─────────────┘  └─────────────┘                    │ │
│  │             │                                                              │ │
│  │             ▼                                                              │ │
│  │  4. PARSE & LAYER MAPPING                                                  │ │
│  │     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                    │ │
│  │     │ Parse       │  │ Layer       │  │ Validate    │                    │ │
│  │     │ Messages    │  │ Mapping     │  │ Messages    │                    │ │
│  │     │ & IEs       │  │ Utility     │  │ & IEs       │                    │ │
│  │     │             │  │ (PHY-IMS)   │  │             │                    │ │
│  │     └─────────────┘  └─────────────┘  └─────────────┘                    │ │
│  │             │                                                              │ │
│  │             ▼                                                              │ │
│  │  5. ASSERTIONS                                                             │ │
│  │     ┌─────────────┐                                                        │ │
│  │     │ Run test    │                                                        │ │
│  │     │ assertions  │                                                        │ │
│  │     │ & validate  │                                                        │ │
│  │     │ results     │                                                        │ │
│  │     └─────────────┘                                                        │ │
│  │             │                                                              │ │
│  │             ▼                                                              │ │
│  │  6. RESULTS & DISPLAY                                                      │ │
│  │     ┌─────────────┐                                                        │ │
│  │     │ Generate    │                                                        │ │
│  │     │ results &   │                                                        │ │
│  │     │ display in  │                                                        │ │
│  │     │ Enhanced    │                                                        │ │
│  │     │ Log View    │                                                        │ │
│  │     └─────────────┘                                                        │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              🗄️ DATABASE LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                           SUPABASE STORAGE                                 │ │
│  │                                                                             │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │ │
│  │  │Test Cases   │  │Messages     │  │Information  │  │Layer        │      │ │
│  │  │             │  │             │  │Elements     │  │Parameters   │      │ │
│  │  │ • 1000+     │  │ • Stored    │  │ • IEs       │  │ • Layer     │      │ │
│  │  │ • Categories│  │ • Parsed    │  │ • Types     │  │   Configs   │      │ │
│  │  │ • Protocols │  │ • Timestamp │  │ • Values    │  │ • Metrics   │      │ │
│  │  │ • Flows     │  │ • Direction │  │ • Validation│  │ • Context   │      │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘      │ │
│  │                                                                             │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │ │
│  │  │Test         │  │Results      │  │Assertions   │  │Layer        │      │ │
│  │  │Executions   │  │             │  │             │  │Mappings     │      │ │
│  │  │             │  │ • Pass/Fail │  │ • Rules     │  │             │      │ │
│  │  │ • Runs      │  │ • KPIs      │  │ • Validation│  │ • PHY       │      │ │
│  │  │ • Status    │  │ • Metrics   │  │ • Results   │  │ • MAC       │      │ │
│  │  │ • Progress  │  │ • Reports   │  │ • Errors    │  │ • RLC       │      │ │
│  │  │ • Logs      │  │ • Export    │  │ • Warnings  │  │ • PDCP      │      │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │ • RRC       │      │ │
│  │                                                     │ • NAS       │      │ │
│  │                                                     │ • IMS       │      │ │
│  │                                                     └─────────────┘      │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 **Detailed Workflow Steps**

### **Step 1: Select Test Case**
```
User Interface → Test Suites Dashboard
├── Browse 1000+ test cases
├── Filter by category (5G_NR, 4G_LTE, IMS_SIP, etc.)
├── Search by name/description
└── Select test case(s) to run
```

### **Step 2: Run Test**
```
Test Execution API → Backend Processing
├── Initialize test execution
├── Generate test messages based on test case logic
├── Create execution record in database
└── Start processing workflow
```

### **Step 3: Fetch Stored Data from Supabase**
```
Database Query → Supabase
├── Fetch test_case_messages (message flow)
├── Fetch test_case_information_elements (IEs)
├── Fetch test_case_layer_parameters (layer configs)
└── Fetch test_case_executions (execution context)
```

### **Step 4: Parse & Layer Mapping (Backend)**
```
Layer Mapping Utility → Message Processing
├── Parse raw messages and IEs
├── Map to protocol layers (PHY → IMS)
├── Extract layer-specific parameters
├── Validate message structure
└── Store decoded_messages in database
```

### **Step 5: Assertions**
```
Test Assertion Engine → Validation
├── Run test case assertions
├── Validate message flows
├── Check IE values and ranges
├── Verify layer interactions
└── Generate pass/fail results
```

### **Step 6: Results & Frontend Display**
```
Enhanced Log View → Results Display
├── Group messages by layer (PHY, MAC, RLC, PDCP, RRC, NAS, IMS)
├── Display timeline view
├── Show tree view of message hierarchy
├── Display pass/fail status
├── Show KPIs and metrics
└── Export results
```

## 🎯 **Key Components in Corrected Workflow**

### **Frontend Components**
- **Test Suites Dashboard**: Select from 1000+ test cases
- **Test Runner**: Execute selected tests
- **Enhanced Log View**: Display results with PHY-IMS grouping
- **Results Display**: Show pass/fail, assertions, KPIs

### **Backend Processing**
- **Test Execution Engine**: Run test case logic
- **Layer Mapping Utility**: Parse and map messages to layers
- **Assertion Engine**: Validate test results
- **Message Parser**: Process stored messages and IEs

### **Database Storage (Supabase)**
- **test_cases**: 1000+ test case definitions
- **test_case_messages**: Message flows for each test
- **test_case_information_elements**: IEs for each message
- **test_case_layer_parameters**: Layer configurations
- **decoded_messages**: Parsed and mapped messages
- **test_case_executions**: Execution records and results

## 🔄 **Data Flow Summary**

```
1. User selects test case from 1000+ available tests
2. System runs test case logic and generates messages
3. Backend fetches stored messages/IEs/parameters from Supabase
4. Layer Mapping Utility parses and maps messages to PHY-IMS layers
5. Assertion engine validates results against test criteria
6. Enhanced Log View displays results grouped by protocol layers
```

This corrected workflow shows the actual 5GLabX tool flow: **Select Test → Run → Fetch Stored Data → Parse/Layer Mapping → Assertions → Results Display** with the Enhanced Log View showing PHY-IMS grouping.