# DataFormatAdapter Integration Guide

## 🎯 **Overview**

This guide provides comprehensive instructions for integrating the DataFormatAdapter across the 5GLabX platform to ensure consistent data formatting and processing.

## 📁 **Integration Points**

### **1. Core Services**
- ✅ **TestCasePlaybackService**: Enhanced with DataFormatAdapter integration
- ✅ **ServiceIntegration**: Updated to initialize DataFormatAdapter
- ✅ **5GLabX Platform**: Main platform component with adapter integration

### **2. Components**
- ✅ **LogViewer**: Enhanced with adapter integration
- ✅ **Layer Views**: PHY, MAC, RRC, NAS, IMS views with adapter support
- ✅ **Dashboard Components**: Statistics and metrics with consistent formatting

## 🔧 **Integration Steps**

### **Step 1: Import DataFormatAdapter**

```javascript
// In your component or service
import { DataFormatAdapter } from '@/utils/DataFormatAdapter';
import { useDataFormatAdapter } from '@/utils/DataFormatAdapterIntegration';
```

### **Step 2: Initialize Services with Adapter**

```javascript
// Enhanced service initialization
const playbackService = new TestCasePlaybackService({
  databaseService: myDatabaseService,
  websocketBroadcast: myWebSocketBroadcast,
  fetchImpl: fetch,
  dataFormatAdapter: DataFormatAdapter // Pass the adapter
});
```

### **Step 3: Use Enhanced Methods**

```javascript
// Get processed logs
const processedLogs = playbackService.getAllProcessedLogs();

// Get layer-specific data
const phyData = playbackService.getLayerData('PHY');

// Get filtered logs
const errorLogs = playbackService.getFilteredLogs({ level: 'error' });
```

### **Step 4: Integrate with Components**

```javascript
// LogViewer integration
<LogViewerWithAdapter
  rawLogs={processedLogs}
  onLogSelect={(log) => console.log('Selected:', log)}
  showFilters={true}
  showExport={true}
/>

// Layer view integration
<PhyLayerViewWithAdapter data={phyData} />
```

## 📋 **Component Integration Examples**

### **1. LogViewer Integration**

```javascript
import LogViewerWithAdapter from '@/components/logs/LogViewerWithAdapter';

function MyComponent() {
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    // Get processed logs from service
    const processedLogs = playbackService.getAllProcessedLogs();
    setLogs(processedLogs);
  }, []);

  return (
    <LogViewerWithAdapter
      rawLogs={logs}
      onLogSelect={(log) => handleLogSelect(log)}
      showFilters={true}
      showExport={true}
      maxHeight="600px"
    />
  );
}
```

### **2. Layer View Integration**

```javascript
import PhyLayerViewWithAdapter from '@/components/views/PhyLayerViewWithAdapter';

function MyComponent() {
  const [phyData, setPhyData] = useState([]);
  
  useEffect(() => {
    // Get PHY layer data
    const data = playbackService.getLayerData('PHY');
    setPhyData(data);
  }, []);

  return <PhyLayerViewWithAdapter data={phyData} />;
}
```

### **3. Dashboard Integration**

```javascript
import { useDataFormatAdapter } from '@/utils/DataFormatAdapterIntegration';

function DashboardComponent() {
  const { processLogs, getSupportedLayers } = useDataFormatAdapter();
  const [stats, setStats] = useState({});
  
  useEffect(() => {
    // Process logs for statistics
    const processedLogs = processLogs(rawLogs);
    const layerStats = getSupportedLayers().reduce((acc, layer) => {
      acc[layer] = processedLogs.filter(log => log.layer === layer).length;
      return acc;
    }, {});
    
    setStats(layerStats);
  }, [rawLogs]);

  return (
    <div>
      {Object.entries(stats).map(([layer, count]) => (
        <div key={layer}>
          {layer}: {count} messages
        </div>
      ))}
    </div>
  );
}
```

## 🔄 **Data Flow Integration**

### **1. Service Layer Integration**

```javascript
// Enhanced service with adapter
class MyService {
  constructor({ dataFormatAdapter }) {
    this.dataFormatAdapter = dataFormatAdapter;
  }
  
  processData(rawData) {
    if (this.dataFormatAdapter) {
      return this.dataFormatAdapter.adaptLogForViewer(rawData);
    }
    return rawData; // Fallback
  }
}
```

### **2. Component Layer Integration**

```javascript
// Component with adapter hook
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

### **3. Real-time Integration**

```javascript
// Real-time data processing
function RealTimeComponent() {
  const { processLogs } = useDataFormatAdapter();
  
  useEffect(() => {
    const handleRealTimeData = (data) => {
      const processed = processLogs(data);
      // Update UI with processed data
    };
    
    // Subscribe to real-time data
    websocketService.subscribe(handleRealTimeData);
  }, []);
  
  return <div>...</div>;
}
```

## 🛠 **Configuration Options**

### **1. Adapter Configuration**

```javascript
// Global adapter configuration
const adapterConfig = {
  enableValidation: true,
  enableFallback: true,
  supportedLayers: ['PHY', 'MAC', 'RRC', 'NAS', 'IMS'],
  logLevel: 'info'
};

// Initialize with config
const adapter = new DataFormatAdapter(adapterConfig);
```

### **2. Service Configuration**

```javascript
// Service with adapter configuration
const service = new TestCasePlaybackService({
  databaseService,
  websocketBroadcast,
  fetchImpl: fetch,
  dataFormatAdapter: adapter,
  adapterConfig: {
    enableValidation: true,
    enableFallback: true
  }
});
```

### **3. Component Configuration**

```javascript
// Component with adapter configuration
<LogViewerWithAdapter
  rawLogs={logs}
  adapterConfig={{
    enableValidation: true,
    enableFallback: true,
    supportedLayers: ['PHY', 'MAC', 'RRC']
  }}
/>
```

## 📊 **Performance Optimization**

### **1. Batch Processing**

```javascript
// Efficient batch processing
const processBatch = (dataArray) => {
  return dataArray.map(data => 
    dataFormatAdapter.adaptLogForViewer(data)
  );
};
```

### **2. Lazy Loading**

```javascript
// Lazy load adapter when needed
const getAdapter = () => {
  if (!adapter) {
    adapter = new DataFormatAdapter();
  }
  return adapter;
};
```

### **3. Caching**

```javascript
// Cache processed data
const cache = new Map();

const getProcessedData = (key, rawData) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const processed = dataFormatAdapter.adaptLogForViewer(rawData);
  cache.set(key, processed);
  return processed;
};
```

## 🔍 **Debugging and Troubleshooting**

### **1. Enable Debug Logging**

```javascript
// Enable debug logging
const adapter = new DataFormatAdapter({
  debug: true,
  logLevel: 'debug'
});
```

### **2. Validation Errors**

```javascript
// Check validation errors
const isValid = adapter.validateLogEntry(data);
if (!isValid) {
  console.error('Invalid data format:', data);
}
```

### **3. Adapter Status**

```javascript
// Check adapter status
if (service.isDataFormatAdapterAvailable()) {
  console.log('Adapter is available');
} else {
  console.log('Using fallback mode');
}
```

## 📝 **Migration Checklist**

### **For Existing Components**

- [ ] Import DataFormatAdapter
- [ ] Update service initialization
- [ ] Replace manual data processing with adapter methods
- [ ] Update component props to use processed data
- [ ] Test fallback behavior
- [ ] Update error handling

### **For New Components**

- [ ] Use DataFormatAdapter from the start
- [ ] Implement proper error handling
- [ ] Add validation where needed
- [ ] Test with various data formats
- [ ] Document integration points

## 🎯 **Best Practices**

### **1. Always Use Adapter**

```javascript
// Good: Use adapter for consistent formatting
const processed = dataFormatAdapter.adaptLogForViewer(rawData);

// Avoid: Manual data formatting
const processed = {
  id: rawData.id,
  timestamp: new Date(rawData.timestamp),
  // ... manual mapping
};
```

### **2. Handle Fallback**

```javascript
// Good: Handle fallback gracefully
const processed = adapter ? 
  adapter.adaptLogForViewer(rawData) : 
  rawData;

// Avoid: Assuming adapter is always available
const processed = adapter.adaptLogForViewer(rawData);
```

### **3. Validate Data**

```javascript
// Good: Validate before processing
if (adapter.validateLogEntry(rawData)) {
  const processed = adapter.adaptLogForViewer(rawData);
  // Use processed data
}

// Avoid: Processing without validation
const processed = adapter.adaptLogForViewer(rawData);
```

### **4. Use Batch Methods**

```javascript
// Good: Batch processing
const processed = adapter.adaptLogsForViewer(rawDataArray);

// Avoid: Individual processing in loops
rawDataArray.forEach(data => {
  const processed = adapter.adaptLogForViewer(data);
});
```

## 🔮 **Future Enhancements**

- [ ] **Custom Field Mappings**: Configurable field mapping rules
- [ ] **Advanced Validation**: More sophisticated validation rules
- [ ] **Performance Monitoring**: Built-in performance metrics
- [ ] **Data Caching**: Automatic data caching for performance
- [ ] **Streaming Support**: Real-time streaming of processed data
- [ ] **Custom Adapters**: Support for custom data adapters

## 📞 **Support**

For integration issues:

1. Check DataFormatAdapter availability
2. Validate data format before processing
3. Review error logs for validation failures
4. Test fallback behavior
5. Use debug logging for troubleshooting

The DataFormatAdapter ensures consistent data formatting across the entire 5GLabX platform while maintaining backward compatibility and providing robust error handling.