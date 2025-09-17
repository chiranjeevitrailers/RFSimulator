# DataFormatAdapter Documentation

## 🎯 **Overview**

The `DataFormatAdapter` is a comprehensive utility designed to handle data format mismatches between backend services and frontend components in the 5GLabX platform. It ensures consistent data formatting across all layers and protocols.

## 📁 **Files Structure**

```
utils/
├── DataFormatAdapter.js                    # Core adapter utility
├── DataFormatAdapterIntegration.js         # Integration patterns and examples
components/
├── logs/
│   ├── LogViewer.tsx                       # Original LogViewer
│   └── LogViewerWithAdapter.tsx            # Updated LogViewer with adapter
└── views/
    ├── PhyLayerView.js                     # Original PHY layer view
    └── PhyLayerViewWithAdapter.js          # Updated PHY view with adapter
```

## 🔧 **Core Features**

### **1. Log Entry Adaptation**
- Converts various log formats to standardized LogViewer format
- Handles timestamp conversion, level mapping, and data extraction
- Supports nested data structures and information elements

### **2. Layer-Specific Data Processing**
- Processes data for specific protocol layers (PHY, MAC, RLC, PDCP, RRC, NAS, IMS)
- Extracts layer-specific metrics and parameters
- Provides fallback for unsupported layers

### **3. Data Validation**
- Validates adapted data formats
- Ensures required fields are present
- Provides error handling for malformed data

## 📋 **API Reference**

### **DataFormatAdapter Class**

#### **Static Methods**

##### `adaptLogForViewer(logEntry)`
Converts a log entry to LogViewer expected format.

**Parameters:**
- `logEntry` (Object): Raw log entry from backend

**Returns:**
- `Object`: Adapted log entry with standardized format

**Example:**
```javascript
const adaptedLog = DataFormatAdapter.adaptLogForViewer({
  id: 'log-123',
  timestamp: '2024-01-15T10:30:00Z',
  level: 'info',
  message: 'RRC connection established',
  fields: {
    protocol: 'RRC',
    layer: 'RRC',
    decoded: { rsrp: -85, rsrq: -10 }
  }
});
```

##### `adaptForLayerView(data, layer)`
Converts generic data to layer-specific format.

**Parameters:**
- `data` (Object): Raw data from backend
- `layer` (String): Target layer (PHY, MAC, RLC, PDCP, RRC, NAS, IMS)

**Returns:**
- `Object`: Layer-specific adapted data

**Example:**
```javascript
const phyData = DataFormatAdapter.adaptForLayerView(rawData, 'PHY');
// Returns: { layer: 'PHY', metrics: { rsrp: -85, sinr: 15, ... }, ... }
```

##### `extractPhyMetrics(data)`
Extracts PHY layer metrics from data.

**Returns:**
- `Object`: PHY metrics including RSRP, RSRQ, SINR, throughput, etc.

##### `extractMacMetrics(data)`
Extracts MAC layer metrics from data.

**Returns:**
- `Object`: MAC metrics including HARQ, scheduling, buffer status, etc.

##### `extractRrcMetrics(data)`
Extracts RRC layer metrics from data.

**Returns:**
- `Object`: RRC metrics including connection info, measurements, etc.

##### `extractNasMetrics(data)`
Extracts NAS layer metrics from data.

**Returns:**
- `Object`: NAS metrics including registration, identity, network info, etc.

##### `extractSipMetrics(data)`
Extracts SIP/IMS layer metrics from data.

**Returns:**
- `Object`: SIP metrics including method, response code, call info, etc.

##### `mapLogLevel(level)`
Maps various log level formats to standardized format.

**Parameters:**
- `level` (String): Raw log level

**Returns:**
- `String`: Standardized log level (debug, info, warning, error, critical)

##### `validateLogEntry(entry)`
Validates adapted log entry format.

**Parameters:**
- `entry` (Object): Log entry to validate

**Returns:**
- `Boolean`: True if valid, false otherwise

##### `validateLayerData(data, layer)`
Validates layer-specific data format.

**Parameters:**
- `data` (Object): Data to validate
- `layer` (String): Layer name

**Returns:**
- `Boolean`: True if valid, false otherwise

## 🔗 **Integration Classes**

### **LogViewerIntegration**
Handles integration with LogViewer components.

#### **Methods:**
- `processLogsForViewer(rawLogs)`: Process multiple logs
- `processLogEntry(logEntry)`: Process single log entry
- `getLayerLogs(rawLogs, layer)`: Filter and process layer-specific logs
- `getProtocolLogs(rawLogs, protocol)`: Filter and process protocol-specific logs

### **LayerViewIntegration**
Handles integration with layer view components.

#### **Methods:**
- `processPhyData(rawData)`: Process PHY layer data
- `processMacData(rawData)`: Process MAC layer data
- `processRrcData(rawData)`: Process RRC layer data
- `processNasData(rawData)`: Process NAS layer data
- `processImsData(rawData)`: Process IMS layer data
- `processLayerData(rawData, layer)`: Process any layer data
- `processLayerDataBatch(rawDataArray, layer)`: Batch process layer data

### **TestCaseIntegration**
Handles integration with test case components.

#### **Methods:**
- `processTestCaseData(testCaseData)`: Process test case data
- `processTestCaseResults(results)`: Process test case results

### **RealTimeIntegration**
Handles integration with real-time components.

#### **Methods:**
- `processRealTimeLogs(logStream)`: Process real-time log stream
- `processRealTimeLayerData(dataStream, layer)`: Process real-time layer data
- `createRealTimeProcessor(layer)`: Create real-time data processor

### **MLIntegration**
Handles integration with ML components.

#### **Methods:**
- `processMLEvents(mlEvents)`: Process ML execution events
- `extractMLFeatures(data, layer)`: Extract features for ML processing

## 🎨 **Usage Examples**

### **1. Basic Log Processing**

```javascript
import { LogViewerIntegration } from '@/utils/DataFormatAdapterIntegration';

// Process raw logs from backend
const rawLogs = [
  {
    id: 'log-1',
    timestamp: '2024-01-15T10:30:00Z',
    level: 'info',
    message: 'RRC connection established',
    fields: {
      protocol: 'RRC',
      layer: 'RRC',
      decoded: { rsrp: -85, rsrq: -10 }
    }
  }
];

const processedLogs = LogViewerIntegration.processLogsForViewer(rawLogs);
```

### **2. Layer-Specific Data Processing**

```javascript
import { LayerViewIntegration } from '@/utils/DataFormatAdapterIntegration';

// Process PHY layer data
const rawPhyData = {
  layer: 'PHY',
  messageType: 'PDSCH',
  fields: {
    decoded: {
      rsrp: -85,
      sinr: 15,
      throughput: 100
    }
  }
};

const phyData = LayerViewIntegration.processPhyData(rawPhyData);
```

### **3. React Hook Usage**

```javascript
import { useDataFormatAdapter } from '@/utils/DataFormatAdapterIntegration';

function MyComponent() {
  const { processLogs, processLayerData, validateData } = useDataFormatAdapter();
  
  const handleData = (rawData) => {
    if (validateData(rawData, 'log')) {
      const processed = processLogs([rawData]);
      // Use processed data
    }
  };
  
  return <div>...</div>;
}
```

### **4. Real-Time Processing**

```javascript
import { RealTimeIntegration } from '@/utils/DataFormatAdapterIntegration';

// Create real-time processor
const processor = RealTimeIntegration.createRealTimeProcessor('PHY');

// Process real-time data
const processedData = processor.process(rawData);
const isValid = processor.validate(processedData);
```

## 🔄 **Data Flow**

```
Backend Data → DataFormatAdapter → Standardized Format → Frontend Components
     ↓              ↓                    ↓                    ↓
Raw Logs    →  adaptLogForViewer  →  LogViewer Format  →  LogViewer
Layer Data  →  adaptForLayerView  →  Layer Format     →  Layer Views
Test Data   →  processTestCaseData → Test Format      →  Test Components
```

## 📊 **Supported Layers**

| Layer | Metrics Extracted | Special Features |
|-------|------------------|------------------|
| **PHY** | RSRP, RSRQ, SINR, Throughput, MCS, Rank | Power metrics, MIMO info |
| **MAC** | HARQ, Scheduling, Buffer Status | Retransmission tracking |
| **RLC** | Sequence Numbers, PDU Types | Mode-specific processing |
| **PDCP** | Sequence Numbers, Security | Ciphering and integrity |
| **RRC** | Connection Info, Measurements | State management |
| **NAS** | Registration, Identity, Network | 5G-specific parameters |
| **IMS/SIP** | Method, Response Code, Call Info | Call state tracking |

## 🛠 **Configuration**

### **Supported Log Levels**
- `critical` - Critical system errors
- `error` - Error conditions
- `warning` - Warning conditions
- `info` - Informational messages
- `debug` - Debug information

### **Supported Protocols**
- 5G_NR, LTE, EN-DC, NE-DC, NGEN-DC
- IMS_SIP, O_RAN, NB_IoT, V2X, NTN
- VoLTE, VoNR

### **Field Mappings**
The adapter automatically maps various field names to standardized formats:

```javascript
// RSRP field mappings
['rsrp', 'rsrpValue', 'power']

// SINR field mappings  
['sinr', 'sinrValue', 'snr']

// Throughput field mappings
['throughput', 'dataRate', 'bitRate']
```

## 🚀 **Performance Considerations**

### **Batch Processing**
Use batch processing methods for better performance:

```javascript
// Good: Batch process
const processedLogs = DataFormatAdapter.adaptLogsForViewer(rawLogs);

// Avoid: Individual processing in loops
rawLogs.forEach(log => {
  const processed = DataFormatAdapter.adaptLogForViewer(log);
});
```

### **Validation**
Enable validation only when needed:

```javascript
// Good: Validate only when required
if (needsValidation) {
  const isValid = DataFormatAdapter.validateLogEntry(entry);
}

// Avoid: Always validating
const isValid = DataFormatAdapter.validateLogEntry(entry); // Always called
```

## 🔍 **Debugging**

### **Enable Debug Logging**
```javascript
// Add debug logging to see adaptation process
console.log('Original data:', rawData);
const adapted = DataFormatAdapter.adaptForLayerView(rawData, 'PHY');
console.log('Adapted data:', adapted);
```

### **Validation Errors**
```javascript
const isValid = DataFormatAdapter.validateLogEntry(entry);
if (!isValid) {
  console.error('Invalid log entry:', entry);
  // Check required fields: id, timestamp, level, source, layer, protocol, message
}
```

## 📝 **Migration Guide**

### **From Original Components**

1. **Import the adapter:**
```javascript
import { LogViewerIntegration } from '@/utils/DataFormatAdapterIntegration';
```

2. **Replace manual data processing:**
```javascript
// Before
const processedLogs = logs.map(log => ({
  id: log.id,
  timestamp: new Date(log.timestamp),
  level: log.level,
  // ... manual mapping
}));

// After
const processedLogs = LogViewerIntegration.processLogsForViewer(logs);
```

3. **Update component props:**
```javascript
// Before
<LogViewer logs={manuallyProcessedLogs} />

// After
<LogViewerWithAdapter rawLogs={rawLogs} />
```

## 🎯 **Best Practices**

1. **Use Integration Classes**: Prefer integration classes over direct adapter usage
2. **Validate Data**: Always validate data before processing
3. **Handle Errors**: Implement proper error handling for malformed data
4. **Batch Processing**: Use batch methods for multiple items
5. **Layer-Specific Processing**: Use appropriate layer-specific methods
6. **Performance Monitoring**: Monitor performance with large datasets

## 🔮 **Future Enhancements**

- [ ] Support for additional protocols (HTTP/2, PFCP, etc.)
- [ ] Custom field mapping configuration
- [ ] Performance optimization for large datasets
- [ ] Real-time streaming optimization
- [ ] Machine learning feature extraction
- [ ] Custom validation rules
- [ ] Data transformation pipelines

## 📞 **Support**

For issues or questions regarding the DataFormatAdapter:

1. Check the validation methods for data format issues
2. Review the integration examples for usage patterns
3. Use debug logging to trace data transformation
4. Refer to the layer-specific documentation for metric details

The DataFormatAdapter ensures consistent data handling across the entire 5GLabX platform, making it easier to maintain and extend the system with new protocols and features.