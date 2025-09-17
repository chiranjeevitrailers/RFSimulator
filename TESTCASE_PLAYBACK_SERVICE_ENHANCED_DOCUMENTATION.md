# TestCasePlaybackService Enhanced Documentation

## 🎯 **Overview**

The `TestCasePlaybackService` has been enhanced with `DataFormatAdapter` integration to provide consistent data formatting across the 5GLabX platform. This service streams test case data (messages, IEs, parameters) as if coming from live CLIs, with automatic data format adaptation.

## 📁 **Files Structure**

```
services/
├── TestCasePlaybackService.js              # Enhanced service with DataFormatAdapter
├── TestCasePlaybackServiceExample.js       # Usage examples and patterns
└── [other services...]
```

## 🔧 **Enhanced Features**

### **1. DataFormatAdapter Integration**
- ✅ **Automatic Data Formatting**: Uses DataFormatAdapter for consistent log entry formatting
- ✅ **Layer-Specific Processing**: Supports all protocol layers (PHY, MAC, RLC, PDCP, RRC, NAS, IMS)
- ✅ **Fallback Support**: Graceful fallback when DataFormatAdapter is not available
- ✅ **Data Validation**: Built-in validation using DataFormatAdapter methods

### **2. Enhanced Methods**
- ✅ **getLayerData()**: Get layer-specific data in adapted format
- ✅ **getAllProcessedLogs()**: Get all logs in DataFormatAdapter format
- ✅ **getFilteredLogs()**: Filter logs by various criteria
- ✅ **getPlaybackStatistics()**: Get comprehensive playback statistics
- ✅ **validateDataFormat()**: Validate data using DataFormatAdapter
- ✅ **getSupportedLayers()**: Get list of supported layers
- ✅ **isDataFormatAdapterAvailable()**: Check adapter availability

## 📋 **API Reference**

### **Constructor**

```javascript
new TestCasePlaybackService({
  databaseService,      // Database service for persistence
  websocketBroadcast,   // WebSocket broadcast function
  fetchImpl,           // Fetch implementation (optional)
  dataFormatAdapter    // DataFormatAdapter instance (optional)
})
```

### **Core Methods**

#### `startPlayback({ testCaseId, runId, apiBaseUrl, speed })`
Starts playback of a test case with enhanced data formatting.

**Parameters:**
- `testCaseId` (String): ID of the test case to play
- `runId` (String): Unique run identifier
- `apiBaseUrl` (String): API base URL (default: '/api')
- `speed` (Number): Playback speed multiplier (default: 1.0)

**Returns:**
- `Promise<Object>`: `{ success: true, runId: string, count: number }`

#### `stopPlayback()`
Stops the current playback.

**Returns:**
- `Promise<Object>`: `{ success: true, runId: string }`

#### `status()`
Gets current playback status.

**Returns:**
- `Object`: `{ playing: boolean, runId: string, testCaseId: string, position: string, startedAt: number, speed: number }`

### **Enhanced Methods**

#### `getLayerData(layer)`
Gets layer-specific data in adapted format.

**Parameters:**
- `layer` (String): Protocol layer (PHY, MAC, RRC, etc.)

**Returns:**
- `Array`: Array of adapted layer data objects

**Example:**
```javascript
const phyData = playbackService.getLayerData('PHY');
// Returns: [{ layer: 'PHY', metrics: { rsrp: -85, sinr: 15, ... }, ... }]
```

#### `getAllProcessedLogs()`
Gets all processed logs in DataFormatAdapter format.

**Returns:**
- `Array`: Array of adapted log entries

**Example:**
```javascript
const allLogs = playbackService.getAllProcessedLogs();
// Returns: [{ id: '...', timestamp: Date, level: 'info', ... }]
```

#### `getFilteredLogs(filters)`
Gets filtered logs based on criteria.

**Parameters:**
- `filters` (Object): Filter criteria
  - `level` (String): Log level filter
  - `layer` (String): Layer filter
  - `protocol` (String): Protocol filter
  - `direction` (String): Direction filter (UL/DL)
  - `source` (String): Source filter

**Returns:**
- `Array`: Filtered and adapted log entries

**Example:**
```javascript
const errorLogs = playbackService.getFilteredLogs({ level: 'error' });
const phyLogs = playbackService.getFilteredLogs({ layer: 'PHY' });
const uplinkLogs = playbackService.getFilteredLogs({ direction: 'UL' });
```

#### `getPlaybackStatistics()`
Gets comprehensive playback statistics.

**Returns:**
- `Object`: Statistics object with counts and progress

**Example:**
```javascript
const stats = playbackService.getPlaybackStatistics();
// Returns: {
//   total: 100,
//   byLevel: { info: 80, warning: 15, error: 5 },
//   byLayer: { PHY: 30, MAC: 25, RRC: 20, NAS: 25 },
//   byProtocol: { '5G-NR': 100 },
//   byDirection: { UL: 50, DL: 50 },
//   currentPosition: 45,
//   progress: 45.0
// }
```

#### `validateDataFormat(data, type, layer)`
Validates data format using DataFormatAdapter.

**Parameters:**
- `data` (Object): Data to validate
- `type` (String): Validation type ('log' or 'layer')
- `layer` (String): Layer name (for layer validation)

**Returns:**
- `Boolean`: Validation result

**Example:**
```javascript
const isValid = playbackService.validateDataFormat(logEntry, 'log');
const isLayerValid = playbackService.validateDataFormat(layerData, 'layer', 'PHY');
```

#### `getSupportedLayers()`
Gets list of supported layers from DataFormatAdapter.

**Returns:**
- `Array`: Array of supported layer names

**Example:**
```javascript
const layers = playbackService.getSupportedLayers();
// Returns: ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS', 'SIP', 'NGAP', ...]
```

#### `isDataFormatAdapterAvailable()`
Checks if DataFormatAdapter is available and functional.

**Returns:**
- `Boolean`: True if adapter is available and working

**Example:**
```javascript
if (playbackService.isDataFormatAdapterAvailable()) {
  console.log('Using enhanced data formatting');
} else {
  console.log('Using fallback data formatting');
}
```

## 🎨 **Usage Examples**

### **1. Basic Usage with DataFormatAdapter**

```javascript
import { TestCasePlaybackService } from './services/TestCasePlaybackService';
import { DataFormatAdapter } from './utils/DataFormatAdapter';

const playbackService = new TestCasePlaybackService({
  databaseService: myDatabaseService,
  websocketBroadcast: myWebSocketBroadcast,
  fetchImpl: fetch,
  dataFormatAdapter: DataFormatAdapter
});

// Start playback
const result = await playbackService.startPlayback({
  testCaseId: 'NR-IA-F1',
  runId: 'run_123',
  speed: 1.0
});

console.log('Playback started:', result);
```

### **2. Layer-Specific Data Processing**

```javascript
// Start playback first
await playbackService.startPlayback({
  testCaseId: 'NR-IA-F1',
  runId: 'run_123'
});

// Get layer-specific data
const phyData = playbackService.getLayerData('PHY');
const rrcData = playbackService.getLayerData('RRC');
const nasData = playbackService.getLayerData('NAS');

console.log('PHY Data:', phyData);
console.log('RRC Data:', rrcData);
console.log('NAS Data:', nasData);
```

### **3. Filtering and Statistics**

```javascript
// Get filtered logs
const errorLogs = playbackService.getFilteredLogs({ level: 'error' });
const phyLogs = playbackService.getFilteredLogs({ layer: 'PHY' });
const uplinkLogs = playbackService.getFilteredLogs({ direction: 'UL' });

// Get statistics
const stats = playbackService.getPlaybackStatistics();
console.log('Total messages:', stats.total);
console.log('Progress:', stats.progress + '%');
console.log('By layer:', stats.byLayer);
```

### **4. Integration with LogViewer**

```javascript
import { LogViewerWithAdapter } from './components/logs/LogViewerWithAdapter';

// Start playback
await playbackService.startPlayback({
  testCaseId: 'NR-IA-F1',
  runId: 'run_123'
});

// Get processed logs
const processedLogs = playbackService.getAllProcessedLogs();

// Create LogViewer with processed data
const logViewer = new LogViewerWithAdapter({
  rawLogs: processedLogs,
  onLogSelect: (log) => console.log('Selected:', log),
  showFilters: true,
  showExport: true
});
```

### **5. Integration with Layer Views**

```javascript
import { PhyLayerViewWithAdapter } from './components/views/PhyLayerViewWithAdapter';

// Start playback
await playbackService.startPlayback({
  testCaseId: 'NR-IA-F1',
  runId: 'run_123'
});

// Get PHY layer data
const phyData = playbackService.getLayerData('PHY');

// Create PHY layer view
const phyView = new PhyLayerViewWithAdapter();
phyView.setData(phyData);
```

### **6. Real-time Monitoring**

```javascript
// Start playback
await playbackService.startPlayback({
  testCaseId: 'NR-IA-F1',
  runId: 'run_123'
});

// Monitor progress
const monitorInterval = setInterval(() => {
  const status = playbackService.status();
  const stats = playbackService.getPlaybackStatistics();
  
  console.log('Status:', status);
  console.log('Progress:', stats.progress + '%');
  
  if (!status.playing) {
    clearInterval(monitorInterval);
    console.log('Playback completed');
  }
}, 1000);
```

### **7. Error Handling and Fallback**

```javascript
// Initialize without DataFormatAdapter (fallback mode)
const playbackService = new TestCasePlaybackService({
  databaseService: myDatabaseService,
  websocketBroadcast: myWebSocketBroadcast,
  fetchImpl: fetch
  // Note: No dataFormatAdapter passed
});

// Check adapter availability
if (!playbackService.isDataFormatAdapterAvailable()) {
  console.log('Using fallback data formatting');
}

// Start playback (will use fallback format)
try {
  const result = await playbackService.startPlayback({
    testCaseId: 'NR-IA-F1',
    runId: 'run_123'
  });
  console.log('Playback started:', result);
} catch (error) {
  console.error('Playback failed:', error);
}
```

## 🔄 **Data Flow**

```
Test Case Data → TestCasePlaybackService → DataFormatAdapter → Standardized Format → Components
     ↓                    ↓                      ↓                    ↓                ↓
Raw Messages    →    Timeline Building    →   Data Adaptation   →  LogViewer    →  LogViewer
Layer Data      →    Message Processing   →   Layer Processing  →  Layer Views  →  PHY/MAC/RRC
Statistics      →    Data Aggregation     →   Format Validation →  Dashboards   →  Real-time UI
```

## 📊 **Supported Data Formats**

### **Input Formats**
- ✅ **Test Case Messages**: Expected messages from test case definitions
- ✅ **Execution Templates**: Template-based message structures
- ✅ **Raw Protocol Data**: Direct protocol message data
- ✅ **Information Elements**: IE definitions and values

### **Output Formats**
- ✅ **LogViewer Format**: Standardized log entry format
- ✅ **Layer-Specific Format**: Adapted data for specific layers
- ✅ **Statistics Format**: Aggregated statistics and metrics
- ✅ **Filtered Format**: Filtered data based on criteria

## 🛠 **Configuration**

### **DataFormatAdapter Integration**
```javascript
// Automatic detection (recommended)
const playbackService = new TestCasePlaybackService({
  databaseService,
  websocketBroadcast,
  fetchImpl: fetch
  // DataFormatAdapter will be auto-detected
});

// Manual injection
const playbackService = new TestCasePlaybackService({
  databaseService,
  websocketBroadcast,
  fetchImpl: fetch,
  dataFormatAdapter: DataFormatAdapter
});
```

### **Playback Options**
```javascript
const options = {
  testCaseId: 'NR-IA-F1',        // Required: Test case ID
  runId: 'run_123',              // Optional: Custom run ID
  apiBaseUrl: '/api',            // Optional: API base URL
  speed: 1.0                     // Optional: Playback speed
};
```

## 🚀 **Performance Considerations**

### **Batch Processing**
- ✅ **Efficient Timeline Building**: Optimized timeline construction
- ✅ **Lazy Data Adaptation**: Data adapted only when requested
- ✅ **Memory Management**: Proper cleanup of completed runs

### **Real-time Performance**
- ✅ **Non-blocking Playback**: Asynchronous message emission
- ✅ **Configurable Speed**: Adjustable playback speed
- ✅ **Efficient Broadcasting**: Optimized WebSocket broadcasting

## 🔍 **Debugging**

### **Enable Debug Logging**
```javascript
// Add debug logging to see data adaptation
console.log('Original data:', rawData);
const adapted = playbackService.getLayerData('PHY');
console.log('Adapted data:', adapted);
```

### **Validation Errors**
```javascript
const isValid = playbackService.validateDataFormat(data, 'log');
if (!isValid) {
  console.error('Invalid data format:', data);
}
```

### **Adapter Status**
```javascript
if (!playbackService.isDataFormatAdapterAvailable()) {
  console.warn('DataFormatAdapter not available, using fallback');
}
```

## 📝 **Migration Guide**

### **From Original Service**

1. **Update Constructor:**
```javascript
// Before
const service = new TestCasePlaybackService({
  databaseService,
  websocketBroadcast,
  fetchImpl: fetch
});

// After
const service = new TestCasePlaybackService({
  databaseService,
  websocketBroadcast,
  fetchImpl: fetch,
  dataFormatAdapter: DataFormatAdapter // Optional but recommended
});
```

2. **Use Enhanced Methods:**
```javascript
// Before: Manual data processing
const logs = service.currentRun.timeline.map(item => ({
  id: item.id,
  timestamp: new Date(item.timestamp),
  // ... manual mapping
}));

// After: Use enhanced methods
const logs = service.getAllProcessedLogs();
const phyData = service.getLayerData('PHY');
```

3. **Update Component Integration:**
```javascript
// Before: Manual data formatting
<LogViewer logs={manuallyFormattedLogs} />

// After: Use enhanced service
<LogViewerWithAdapter rawLogs={service.getAllProcessedLogs()} />
```

## 🎯 **Best Practices**

1. **Use DataFormatAdapter**: Always pass DataFormatAdapter for consistent formatting
2. **Layer-Specific Processing**: Use `getLayerData()` for layer views
3. **Filtering**: Use `getFilteredLogs()` instead of manual filtering
4. **Statistics**: Use `getPlaybackStatistics()` for metrics
5. **Validation**: Validate data format when needed
6. **Error Handling**: Handle fallback scenarios gracefully
7. **Performance**: Use batch methods for multiple operations

## 🔮 **Future Enhancements**

- [ ] **Custom Field Mappings**: Configurable field mapping rules
- [ ] **Advanced Filtering**: More sophisticated filter criteria
- [ ] **Data Caching**: Cache adapted data for performance
- [ ] **Streaming Support**: Real-time streaming of adapted data
- [ ] **Custom Adapters**: Support for custom data adapters
- [ ] **Performance Metrics**: Detailed performance monitoring
- [ ] **Data Export**: Export adapted data in various formats

## 📞 **Support**

For issues or questions regarding the enhanced TestCasePlaybackService:

1. Check DataFormatAdapter availability with `isDataFormatAdapterAvailable()`
2. Validate data format with `validateDataFormat()`
3. Review the usage examples for integration patterns
4. Use debug logging to trace data transformation
5. Check the fallback behavior when adapter is not available

The enhanced TestCasePlaybackService provides consistent data formatting across all components while maintaining backward compatibility with existing implementations.