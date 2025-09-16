# Real Testing Platform Data Flow Diagram

## 🔄 **Complete Data Flow Architecture**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SUPABASE DATABASE                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ Test Cases  │    │Test Messages│    │Information  │    │Layer        │     │
│  │             │    │             │    │Elements     │    │Parameters   │     │
│  │• Test ID    │    │• Message ID │    │• IE ID      │    │• Layer ID   │     │
│  │• Name       │    │• Protocol   │    │• IE Name    │    │• Parameters │     │
│  │• Category   │    │• Direction  │    │• IE Value   │    │• Values     │     │
│  │• Steps      │    │• Timestamp  │    │• IE Type    │    │• Ranges     │     │
│  │• Expected   │    │• Layer      │    │• Validation │    │• Defaults   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘     │
│         │                   │                   │                   │         │
│         └───────────────────┼───────────────────┼───────────────────┘         │
│                             │                   │                             │
│  ┌─────────────┐            │                   │                             │
│  │Test Results │            │                   │                             │
│  │             │            │                   │                             │
│  │• Execution  │            │                   │                             │
│  │• Status     │            │                   │                             │
│  │• Results    │            │                   │                             │
│  │• Metrics    │            │                   │                             │
│  └─────────────┘            │                   │                             │
└─────────────────────────────┼───────────────────┼─────────────────────────────┘
                               │                   │
                               ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              5GLABX BACKEND                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │Test Exec    │    │Protocol     │    │Message      │    │Layer        │     │
│  │API          │    │Engine       │    │Engine       │    │Engine       │     │
│  │             │    │             │    │             │    │             │     │
│  │• Start Test │    │• 3GPP Logic │    │• Message Gen│    │• PHY Params │     │
│  │• Stop Test  │    │• State      │    │• Message    │    │• MAC Params │     │
│  │• Get Status │    │  Machine    │    │  Parse      │    │• RLC Params │     │
│  │• Stream     │    │• Flow       │    │• IE Process │    │• RRC Params │     │
│  │  Results    │    │  Control    │    │• Timestamp  │    │• NAS Params │     │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘     │
│         │                   │                   │                   │         │
│         └───────────────────┼───────────────────┼───────────────────┘         │
│                             │                   │                             │
│  ┌─────────────┐            │                   │                             │
│  │Real-time    │            │                   │                             │
│  │Streaming    │            │                   │                             │
│  │             │            │                   │                             │
│  │• WebSocket  │            │                   │                             │
│  │• Event      │            │                   │                             │
│  │  Streaming  │            │                   │                             │
│  │• Data       │            │                   │                             │
│  │  Processing │            │                   │                             │
│  └─────────────┘            │                   │                             │
└─────────────────────────────┼───────────────────┼─────────────────────────────┘
                               │                   │
                               ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              5GLABX FRONTEND                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │Testing      │    │Log Viewer   │    │Enhanced Log │    │Protocol     │     │
│  │Platform     │    │             │    │Viewer       │    │Layers       │     │
│  │             │    │             │    │             │    │             │     │
│  │• Test       │    │• Real-time  │    │• Advanced   │    │• PHY Layer  │     │
│  │  Control    │    │  Logs       │    │  Filtering  │    │• MAC Layer  │     │
│  │• Progress   │    │• Timestamp  │    │• Analysis   │    │• RLC Layer  │     │
│  │• Results    │    │• Levels     │    │• Decoding   │    │• RRC Layer  │     │
│  │• Analytics  │    │• Export     │    │• Message    │    │• NAS Layer  │     │
│  │             │    │             │    │  Flow       │    │• IMS Layer  │     │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 **Test Execution Flow Sequence**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            TEST EXECUTION FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  1. USER SELECTS TEST CASE                                                     │
│     ┌─────────────┐                                                            │
│     │ Professional│                                                            │
│     │ Testing     │ ──────────────────────────────────────────────────────────┐ │
│     │ Platform    │                                                           │ │
│     └─────────────┘                                                           │ │
│                                                                                 │ │
│  2. FETCH TEST DATA FROM SUPABASE                                              │ │
│     ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │ │
│     │ Test Case   │    │ Messages    │    │ Information │    │ Layer       │   │ │
│     │ Data        │    │ Data        │    │ Elements    │    │ Parameters  │   │ │
│     └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘   │ │
│                                                                                 │ │
│  3. SEND TO 5GLABX BACKEND                                                     │ │
│     ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                     │ │
│     │ Test        │    │ Protocol    │    │ Message     │                     │ │
│     │ Execution   │    │ Engine      │    │ Engine      │                     │ │
│     │ API         │    │             │    │             │                     │ │
│     └─────────────┘    └─────────────┘    └─────────────┘                     │ │
│                                                                                 │ │
│  4. EXECUTE PROTOCOL MESSAGES                                                  │ │
│     ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                     │ │
│     │ Message 1   │    │ Message 2   │    │ Message N   │                     │ │
│     │ (RRC Setup  │    │ (RRC Setup  │    │ (Final      │                     │ │
│     │  Request)   │    │  Response)  │    │  Message)   │                     │ │
│     └─────────────┘    └─────────────┘    └─────────────┘                     │ │
│                                                                                 │ │
│  5. STREAM RESULTS TO FRONTEND                                                 │ │
│     ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                     │ │
│     │ Real-time   │    │ Log Data    │    │ Layer Data  │                     │ │
│     │ Execution   │    │ Stream      │    │ Stream      │                     │ │
│     │ Data        │    │             │    │             │                     │ │
│     └─────────────┘    └─────────────┘    └─────────────┘                     │ │
│                                                                                 │ │
│  6. DISPLAY IN REAL-TIME                                                       │ │
│     ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                     │ │
│     │ Testing     │    │ Log Viewer  │    │ Protocol    │                     │ │
│     │ Platform    │    │             │    │ Layers      │                     │ │
│     │ Display     │    │ Display     │    │ Display     │                     │ │
│     └─────────────┘    └─────────────┘    └─────────────┘                     │ │
│                                                                                 │ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 📊 **Message Flow Example: 5G NR Initial Access**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        5G NR INITIAL ACCESS MESSAGE FLOW                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  UE (User Equipment)                    gNodeB (5G Base Station)               │
│  ┌─────────────┐                       ┌─────────────┐                         │
│  │             │                       │             │                         │
│  │ 1. Cell     │ ────────────────────► │ 1. System   │                         │
│  │    Search   │                       │    Info     │                         │
│  │             │                       │    Broadcast│                         │
│  └─────────────┘                       └─────────────┘                         │
│         │                                       │                               │
│         │ 2. Random Access Request              │                               │
│         │ ──────────────────────────────────────► │                               │
│         │                                       │                               │
│         │ 3. Random Access Response             │                               │
│         │ ◄───────────────────────────────────── │                               │
│         │                                       │                               │
│         │ 4. RRC Setup Request                  │                               │
│         │ ──────────────────────────────────────► │                               │
│         │                                       │                               │
│         │ 5. RRC Setup                          │                               │
│         │ ◄───────────────────────────────────── │                               │
│         │                                       │                               │
│         │ 6. RRC Setup Complete                 │                               │
│         │ ──────────────────────────────────────► │                               │
│         │                                       │                               │
│         │ 7. Authentication Request             │                               │
│         │ ◄───────────────────────────────────── │                               │
│         │                                       │                               │
│         │ 8. Authentication Response            │                               │
│         │ ──────────────────────────────────────► │                               │
│         │                                       │                               │
│         │ 9. Security Mode Command              │                               │
│         │ ◄───────────────────────────────────── │                               │
│         │                                       │                               │
│         │ 10. Security Mode Complete            │                               │
│         │ ──────────────────────────────────────► │                               │
│         │                                       │                               │
│         │ 11. Initial UE Message                │                               │
│         │ ◄───────────────────────────────────── │                               │
│         │                                       │                               │
│         │ 12. Downlink NAS Transport            │                               │
│         │ ◄───────────────────────────────────── │                               │
│         │                                       │                               │
│         │ 13. Uplink NAS Transport              │                               │
│         │ ──────────────────────────────────────► │                               │
│         │                                       │                               │
│         │ 14. Initial Context Setup Request     │                               │
│         │ ◄───────────────────────────────────── │                               │
│         │                                       │                               │
│         │ 15. RRC Reconfiguration               │                               │
│         │ ◄───────────────────────────────────── │                               │
│         │                                       │                               │
│         │ 16. RRC Reconfiguration Complete      │                               │
│         │ ──────────────────────────────────────► │                               │
│         │                                       │                               │
│         │ 17. Initial Context Setup Response    │                               │
│         │ ──────────────────────────────────────► │                               │
│         │                                       │                               │
│         │ 18. UE Context Release                │                               │
│         │ ◄───────────────────────────────────── │                               │
│         │                                       │                               │
│  └─────────────┘                       └─────────────┘                         │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🔧 **Implementation Components**

### **1. Supabase Service Layer**
```javascript
// services/supabase/TestCaseService.js
class TestCaseService {
  async getTestCaseWithMessages(testCaseId) {
    const testCase = await supabase
      .from('test_cases')
      .select(`
        *,
        test_messages (
          *,
          information_elements (*)
        ),
        layer_parameters (*)
      `)
      .eq('id', testCaseId)
      .single();
    
    return testCase.data;
  }
  
  async saveTestExecutionResult(executionId, testCaseId, result) {
    await supabase
      .from('test_execution_results')
      .insert({
        execution_id: executionId,
        test_case_id: testCaseId,
        status: result.status,
        start_time: result.startTime,
        end_time: result.endTime,
        duration_ms: result.duration,
        result_summary: result.summary,
        message_results: result.messages,
        layer_results: result.layers,
        error_logs: result.errors,
        performance_metrics: result.metrics
      });
  }
}
```

### **2. Test Execution Engine**
```javascript
// services/testing/TestExecutionEngine.js
class TestExecutionEngine {
  constructor() {
    this.activeExecutions = new Map();
    this.messageEngine = new MessageEngine();
    this.protocolEngine = new ProtocolEngine();
  }
  
  async executeTestCase(testCaseId) {
    const executionId = generateUUID();
    const testCase = await this.testCaseService.getTestCaseWithMessages(testCaseId);
    
    // Initialize execution session
    this.activeExecutions.set(executionId, {
      testCase,
      status: 'RUNNING',
      startTime: new Date(),
      currentMessage: 0,
      results: []
    });
    
    // Start message execution
    await this.executeMessageSequence(executionId, testCase.test_messages);
    
    return executionId;
  }
  
  async executeMessageSequence(executionId, messages) {
    const execution = this.activeExecutions.get(executionId);
    
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      execution.currentMessage = i;
      
      // Generate message with IEs
      const generatedMessage = await this.messageEngine.generateMessage(message);
      
      // Send to protocol engine
      const response = await this.protocolEngine.processMessage(generatedMessage);
      
      // Validate response
      const validation = await this.validateMessageResponse(message, response);
      
      // Store result
      execution.results.push({
        messageId: message.id,
        request: generatedMessage,
        response: response,
        validation: validation,
        timestamp: new Date()
      });
      
      // Stream to frontend
      this.streamExecutionUpdate(executionId, {
        type: 'MESSAGE_COMPLETED',
        messageIndex: i,
        result: execution.results[i]
      });
      
      // Wait for next message timing
      if (message.timestamp_offset_ms) {
        await this.delay(message.timestamp_offset_ms);
      }
    }
    
    // Complete execution
    execution.status = 'COMPLETED';
    execution.endTime = new Date();
    this.streamExecutionUpdate(executionId, {
      type: 'EXECUTION_COMPLETED',
      result: execution
    });
  }
}
```

### **3. Real-time Streaming Service**
```javascript
// services/streaming/TestStreamingService.js
class TestStreamingService {
  constructor() {
    this.connections = new Map();
  }
  
  streamTestExecution(executionId, ws) {
    this.connections.set(executionId, ws);
    
    ws.on('close', () => {
      this.connections.delete(executionId);
    });
  }
  
  streamExecutionUpdate(executionId, update) {
    const ws = this.connections.get(executionId);
    if (ws) {
      ws.send(JSON.stringify(update));
    }
  }
  
  streamLogEntry(executionId, logEntry) {
    const ws = this.connections.get(executionId);
    if (ws) {
      ws.send(JSON.stringify({
        type: 'LOG_ENTRY',
        data: logEntry
      }));
    }
  }
}
```

## 🎯 **Expected Results**

### **Professional Testing Experience**
- ✅ Real 3GPP-compliant message flows
- ✅ Accurate protocol layer simulation
- ✅ Professional-grade test execution
- ✅ Comprehensive result analysis

### **Real-time Monitoring**
- ✅ Live message execution
- ✅ Protocol layer updates
- ✅ Performance metrics
- ✅ Error detection and reporting

### **QXDM/Keysight-like Features**
- ✅ Professional test case management
- ✅ Advanced protocol analysis
- ✅ Comprehensive logging
- ✅ Real-time visualization

This architecture will transform the 5GLabX platform into a professional testing tool that provides real 3GPP-compliant test execution with comprehensive protocol analysis capabilities.
