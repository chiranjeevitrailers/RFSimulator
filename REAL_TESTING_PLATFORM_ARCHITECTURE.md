# Real Testing Platform Architecture - QXDM/Keysight-like Implementation

## 🎯 **Overview**

This document outlines the architecture for creating a real testing platform where test cases are stored in Supabase with actual 3GPP-compliant message flows, Information Elements (IEs), and layer parameters. When a test runs, the data flows from Supabase → 5GLabX Backend → Frontend Display, creating a professional testing experience like QXDM/Keysight.

## 🏗️ **System Architecture**

### **Data Flow Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                        SUPABASE DATABASE                        │
├─────────────────────────────────────────────────────────────────┤
│  Test Cases │ Test Messages │ Information Elements │ Layer Params │
│             │               │                     │              │
│ • Test ID   │ • Message ID  │ • IE ID            │ • Layer ID   │
│ • Name      │ • Protocol    │ • IE Name          │ • Parameters │
│ • Category  │ • Direction   │ • IE Value         │ • Values     │
│ • Steps     │ • Timestamp   │ • IE Type          │ • Ranges     │
│ • Expected  │ • Layer       │ • Validation       │ • Defaults   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      5GLABX BACKEND                            │
├─────────────────────────────────────────────────────────────────┤
│  Test Execution API │ Protocol Engine │ Message Engine │ Layer Engine │
│                     │                 │                │              │
│ • Start Test        │ • 3GPP Logic    │ • Message Gen  │ • PHY Params │
│ • Stop Test         │ • State Machine │ • Message Parse│ • MAC Params │
│ • Get Status        │ • Flow Control  │ • IE Processing│ • RLC Params │
│ • Stream Results    │ • Validation    │ • Timestamping │ • RRC Params │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      5GLABX FRONTEND                           │
├─────────────────────────────────────────────────────────────────┤
│ Testing Platform │ Log Viewer │ Enhanced Log │ Protocol Layers │
│                  │            │ Viewer       │                 │
│ • Test Control   │ • Real-time│ • Advanced   │ • PHY Layer     │
│ • Progress       │   Logs     │   Filtering  │ • MAC Layer     │
│ • Results        │ • Timestamp│ • Analysis   │ • RLC Layer     │
│ • Analytics      │ • Levels   │ • Decoding   │ • RRC Layer     │
│                  │            │              │ • NAS Layer     │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 **Supabase Database Schema**

### **1. Test Cases Table**
```sql
CREATE TABLE test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_case_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- '5G_NR', '4G_LTE', 'IMS'
    protocol VARCHAR(50) NOT NULL, -- '5G_NR', 'LTE', 'IMS_SIP'
    test_type VARCHAR(50) NOT NULL, -- 'functional', 'performance', 'conformance'
    complexity VARCHAR(20) NOT NULL, -- 'beginner', 'intermediate', 'advanced', 'expert'
    duration_seconds INTEGER,
    priority VARCHAR(10) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    tags TEXT[], -- Array of tags
    expected_result TEXT,
    prerequisites TEXT,
    test_steps JSONB, -- Array of test steps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **2. Test Messages Table**
```sql
CREATE TABLE test_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
    message_id VARCHAR(50) NOT NULL,
    message_name VARCHAR(255) NOT NULL,
    protocol VARCHAR(50) NOT NULL, -- '5G_NR', 'LTE', 'IMS_SIP'
    layer VARCHAR(20) NOT NULL, -- 'PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS'
    direction VARCHAR(10) NOT NULL, -- 'UL', 'DL', 'BIDIR'
    message_type VARCHAR(100) NOT NULL, -- 'RRC_SETUP_REQUEST', 'ATTACH_REQUEST', etc.
    sequence_order INTEGER NOT NULL,
    timestamp_offset_ms INTEGER, -- Offset from test start
    message_payload JSONB, -- Complete message structure
    expected_response VARCHAR(100), -- Expected response message
    timeout_ms INTEGER,
    validation_rules JSONB, -- Validation criteria
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **3. Information Elements Table**
```sql
CREATE TABLE information_elements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES test_messages(id) ON DELETE CASCADE,
    ie_id VARCHAR(50) NOT NULL,
    ie_name VARCHAR(255) NOT NULL,
    ie_type VARCHAR(50) NOT NULL, -- 'MANDATORY', 'OPTIONAL', 'CONDITIONAL'
    data_type VARCHAR(50) NOT NULL, -- 'INTEGER', 'STRING', 'BOOLEAN', 'ENUM', 'BITSTRING'
    ie_value JSONB, -- The actual IE value
    ie_description TEXT,
    validation_rules JSONB, -- Validation criteria for this IE
    dependencies JSONB, -- Other IEs this depends on
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **4. Layer Parameters Table**
```sql
CREATE TABLE layer_parameters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
    layer VARCHAR(20) NOT NULL, -- 'PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'
    parameter_name VARCHAR(255) NOT NULL,
    parameter_type VARCHAR(50) NOT NULL, -- 'CONFIG', 'MEASUREMENT', 'STATUS'
    parameter_value JSONB, -- The parameter value
    parameter_unit VARCHAR(50), -- 'dBm', 'ms', 'Hz', etc.
    min_value JSONB, -- Minimum allowed value
    max_value JSONB, -- Maximum allowed value
    default_value JSONB, -- Default value
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **5. Test Execution Results Table**
```sql
CREATE TABLE test_execution_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
    execution_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED'
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    result_summary JSONB, -- Overall test result
    message_results JSONB, -- Results for each message
    layer_results JSONB, -- Results for each layer
    error_logs JSONB, -- Any errors encountered
    performance_metrics JSONB, -- Performance data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔄 **Test Execution Flow**

### **Phase 1: Test Case Selection**
1. User selects test case from Professional Testing Platform
2. Frontend sends request to 5GLabX Backend API
3. Backend fetches test case data from Supabase
4. Backend validates test case and prepares execution environment

### **Phase 2: Data Preparation**
1. Backend fetches all related test messages for the test case
2. Backend fetches all information elements for each message
3. Backend fetches all layer parameters for the test case
4. Backend prepares message flow sequence and timing

### **Phase 3: Test Execution**
1. Backend starts test execution and creates execution session
2. Backend streams test messages according to sequence and timing
3. Backend processes each message through protocol engines
4. Backend validates responses against expected results
5. Backend collects performance metrics and layer data

### **Phase 4: Real-time Display**
1. Backend streams execution data to frontend via WebSocket
2. Frontend displays real-time logs in Log Viewer
3. Frontend shows enhanced analysis in Enhanced Log Viewer
4. Frontend updates protocol layer displays (PHY, MAC, RLC, RRC, NAS)
5. Frontend shows progress and results in Testing Platform

## 🛠️ **Implementation Components**

### **1. Supabase Integration Service**
```javascript
// services/supabase/TestCaseService.js
class TestCaseService {
  async getTestCase(testCaseId) {
    // Fetch test case with all related data
  }
  
  async getTestMessages(testCaseId) {
    // Fetch all messages for test case
  }
  
  async getInformationElements(messageId) {
    // Fetch all IEs for message
  }
  
  async getLayerParameters(testCaseId) {
    // Fetch all layer parameters
  }
  
  async saveTestResult(executionId, result) {
    // Save test execution results
  }
}
```

### **2. Test Execution Engine**
```javascript
// services/testing/TestExecutionEngine.js
class TestExecutionEngine {
  async executeTestCase(testCaseId) {
    // Main test execution logic
  }
  
  async processMessage(message, context) {
    // Process individual message
  }
  
  async validateResponse(message, response) {
    // Validate message response
  }
  
  async collectMetrics() {
    // Collect performance metrics
  }
}
```

### **3. Protocol Message Engine**
```javascript
// services/protocol/MessageEngine.js
class MessageEngine {
  generateMessage(messageTemplate, parameters) {
    // Generate 3GPP-compliant message
  }
  
  parseMessage(rawMessage, protocol) {
    // Parse received message
  }
  
  validateMessage(message, validationRules) {
    // Validate message structure
  }
}
```

### **4. Real-time Streaming Service**
```javascript
// services/streaming/TestStreamingService.js
class TestStreamingService {
  streamTestExecution(executionId, callback) {
    // Stream test execution data
  }
  
  streamLogs(executionId, callback) {
    // Stream log data
  }
  
  streamLayerData(executionId, layer, callback) {
    // Stream layer-specific data
  }
}
```

## 📱 **Frontend Components**

### **1. Enhanced Testing Platform**
- Real-time test execution monitoring
- Progress tracking with detailed status
- Test case selection with preview
- Results visualization and analytics

### **2. Advanced Log Viewer**
- Real-time log streaming
- Message-level filtering and search
- Protocol-specific log formatting
- Export capabilities

### **3. Enhanced Log Viewer**
- Advanced message analysis
- Information element inspection
- Message flow visualization
- Performance metrics display

### **4. Protocol Layer Displays**
- **PHY Layer**: Signal quality, measurements, channel conditions
- **MAC Layer**: Scheduling, resource allocation, HARQ
- **RLC Layer**: Segmentation, reassembly, ARQ
- **RRC Layer**: Connection management, mobility, security
- **NAS Layer**: Session management, mobility, security

## 🔧 **Backend API Endpoints**

### **Test Case Management**
```
GET /api/test-cases                    # List all test cases
GET /api/test-cases/:id                # Get specific test case
GET /api/test-cases/:id/messages       # Get test case messages
GET /api/test-cases/:id/parameters     # Get layer parameters
```

### **Test Execution**
```
POST /api/test-execution/start         # Start test execution
GET /api/test-execution/:id/status     # Get execution status
POST /api/test-execution/:id/stop      # Stop test execution
GET /api/test-execution/:id/results    # Get execution results
```

### **Real-time Streaming**
```
WS /ws/test-execution/:id              # WebSocket for execution data
WS /ws/logs/:executionId               # WebSocket for log data
WS /ws/layers/:executionId/:layer      # WebSocket for layer data
```

## 📊 **Sample Test Case Data**

### **5G NR Initial Access Test Case**
```json
{
  "test_case_id": "TC_5G_NR_INITIAL_ACCESS_001",
  "name": "5G NR Initial Access Procedure",
  "category": "5G_NR",
  "protocol": "5G_NR",
  "test_type": "functional",
  "messages": [
    {
      "message_id": "MSG_001",
      "message_name": "RRC Setup Request",
      "layer": "RRC",
      "direction": "UL",
      "sequence_order": 1,
      "timestamp_offset_ms": 0,
      "information_elements": [
        {
          "ie_id": "ue_Identity",
          "ie_name": "UE Identity",
          "ie_type": "MANDATORY",
          "data_type": "BITSTRING",
          "ie_value": "0000000000000001"
        },
        {
          "ie_id": "establishmentCause",
          "ie_name": "Establishment Cause",
          "ie_type": "MANDATORY",
          "data_type": "ENUM",
          "ie_value": "mo_Data"
        }
      ]
    }
  ],
  "layer_parameters": [
    {
      "layer": "PHY",
      "parameter_name": "RSRP",
      "parameter_type": "MEASUREMENT",
      "parameter_value": -85,
      "parameter_unit": "dBm",
      "min_value": -140,
      "max_value": -44
    }
  ]
}
```

## 🚀 **Implementation Roadmap**

### **Phase 1: Database Setup (Week 1-2)**
- [ ] Create Supabase database schema
- [ ] Populate with sample test cases
- [ ] Create database access services
- [ ] Implement data validation

### **Phase 2: Backend Integration (Week 3-4)**
- [ ] Implement test execution engine
- [ ] Create protocol message engine
- [ ] Implement real-time streaming
- [ ] Add WebSocket support

### **Phase 3: Frontend Enhancement (Week 5-6)**
- [ ] Enhance testing platform UI
- [ ] Implement real-time log viewer
- [ ] Add protocol layer displays
- [ ] Create analytics dashboard

### **Phase 4: Testing & Optimization (Week 7-8)**
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] User acceptance testing
- [ ] Documentation and training

## 🎯 **Expected Outcomes**

### **Professional Testing Experience**
- Real 3GPP-compliant message flows
- Accurate protocol layer simulation
- Professional-grade test execution
- Comprehensive result analysis

### **QXDM/Keysight-like Features**
- Real-time message monitoring
- Advanced protocol analysis
- Professional test case management
- Comprehensive reporting

### **Scalable Architecture**
- Database-driven test cases
- Real-time data streaming
- Modular protocol engines
- Extensible frontend components

This architecture will transform the 5GLabX platform into a professional testing tool that rivals QXDM and Keysight, with real 3GPP-compliant test cases and comprehensive protocol analysis capabilities.
