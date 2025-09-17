/**
 * TestCasePlaybackService Usage Examples
 * Demonstrates how to use the enhanced service with DataFormatAdapter integration
 */

// Example 1: Basic usage with DataFormatAdapter
function basicUsageExample() {
  // Initialize the service with DataFormatAdapter
  const playbackService = new TestCasePlaybackService({
    databaseService: mockDatabaseService,
    websocketBroadcast: mockWebSocketBroadcast,
    fetchImpl: fetch,
    dataFormatAdapter: DataFormatAdapter // Pass the adapter instance
  });

  // Start playback
  playbackService.startPlayback({
    testCaseId: 'NR-IA-F1',
    runId: 'run_123',
    speed: 1.0
  }).then(result => {
    console.log('Playback started:', result);
  });
}

// Example 2: Using enhanced methods for layer-specific data
function layerSpecificDataExample() {
  const playbackService = new TestCasePlaybackService({
    databaseService: mockDatabaseService,
    websocketBroadcast: mockWebSocketBroadcast,
    fetchImpl: fetch
  });

  // Start playback first
  playbackService.startPlayback({
    testCaseId: 'NR-IA-F1',
    runId: 'run_123'
  }).then(() => {
    // Get PHY layer data
    const phyData = playbackService.getLayerData('PHY');
    console.log('PHY Layer Data:', phyData);

    // Get RRC layer data
    const rrcData = playbackService.getLayerData('RRC');
    console.log('RRC Layer Data:', rrcData);

    // Get all processed logs
    const allLogs = playbackService.getAllProcessedLogs();
    console.log('All Processed Logs:', allLogs);
  });
}

// Example 3: Filtering and statistics
function filteringAndStatisticsExample() {
  const playbackService = new TestCasePlaybackService({
    databaseService: mockDatabaseService,
    websocketBroadcast: mockWebSocketBroadcast,
    fetchImpl: fetch
  });

  playbackService.startPlayback({
    testCaseId: 'NR-IA-F1',
    runId: 'run_123'
  }).then(() => {
    // Get filtered logs
    const errorLogs = playbackService.getFilteredLogs({ level: 'error' });
    console.log('Error Logs:', errorLogs);

    const phyLogs = playbackService.getFilteredLogs({ layer: 'PHY' });
    console.log('PHY Logs:', phyLogs);

    const uplinkLogs = playbackService.getFilteredLogs({ direction: 'UL' });
    console.log('Uplink Logs:', uplinkLogs);

    // Get playback statistics
    const stats = playbackService.getPlaybackStatistics();
    console.log('Playback Statistics:', stats);
  });
}

// Example 4: Data validation
function dataValidationExample() {
  const playbackService = new TestCasePlaybackService({
    databaseService: mockDatabaseService,
    websocketBroadcast: mockWebSocketBroadcast,
    fetchImpl: fetch
  });

  // Check if DataFormatAdapter is available
  if (playbackService.isDataFormatAdapterAvailable()) {
    console.log('DataFormatAdapter is available');
    
    // Get supported layers
    const supportedLayers = playbackService.getSupportedLayers();
    console.log('Supported Layers:', supportedLayers);

    // Validate data format
    const testData = {
      id: 'test-123',
      timestamp: new Date(),
      level: 'info',
      source: 'testcase',
      layer: 'PHY',
      protocol: '5G-NR',
      message: 'Test message'
    };

    const isValid = playbackService.validateDataFormat(testData, 'log');
    console.log('Data is valid:', isValid);
  } else {
    console.log('DataFormatAdapter is not available');
  }
}

// Example 5: Integration with LogViewer component
function logViewerIntegrationExample() {
  const playbackService = new TestCasePlaybackService({
    databaseService: mockDatabaseService,
    websocketBroadcast: mockWebSocketBroadcast,
    fetchImpl: fetch
  });

  // Start playback
  playbackService.startPlayback({
    testCaseId: 'NR-IA-F1',
    runId: 'run_123'
  }).then(() => {
    // Get all processed logs for LogViewer
    const processedLogs = playbackService.getAllProcessedLogs();
    
    // Pass to LogViewer component
    const logViewer = new LogViewerWithAdapter({
      rawLogs: processedLogs, // Use rawLogs prop for automatic processing
      onLogSelect: (log) => {
        console.log('Selected log:', log);
      },
      showFilters: true,
      showExport: true
    });
  });
}

// Example 6: Integration with Layer View components
function layerViewIntegrationExample() {
  const playbackService = new TestCasePlaybackService({
    databaseService: mockDatabaseService,
    websocketBroadcast: mockWebSocketBroadcast,
    fetchImpl: fetch
  });

  playbackService.startPlayback({
    testCaseId: 'NR-IA-F1',
    runId: 'run_123'
  }).then(() => {
    // Get layer-specific data for different views
    const phyData = playbackService.getLayerData('PHY');
    const macData = playbackService.getLayerData('MAC');
    const rrcData = playbackService.getLayerData('RRC');

    // Create layer view components
    const phyView = new PhyLayerViewWithAdapter();
    const macView = new MacLayerViewWithAdapter();
    const rrcView = new RrcLayerViewWithAdapter();

    // Pass data to views (views will use DataFormatAdapter internally)
    phyView.setData(phyData);
    macView.setData(macData);
    rrcView.setData(rrcData);
  });
}

// Example 7: Real-time monitoring
function realTimeMonitoringExample() {
  const playbackService = new TestCasePlaybackService({
    databaseService: mockDatabaseService,
    websocketBroadcast: mockWebSocketBroadcast,
    fetchImpl: fetch
  });

  // Start playback
  playbackService.startPlayback({
    testCaseId: 'NR-IA-F1',
    runId: 'run_123'
  }).then(() => {
    // Monitor playback progress
    const monitorInterval = setInterval(() => {
      const status = playbackService.status();
      const stats = playbackService.getPlaybackStatistics();
      
      console.log('Playback Status:', status);
      console.log('Statistics:', stats);
      
      // Stop monitoring when playback is complete
      if (!status.playing) {
        clearInterval(monitorInterval);
        console.log('Playback completed');
      }
    }, 1000);
  });
}

// Example 8: Error handling and fallback
function errorHandlingExample() {
  const playbackService = new TestCasePlaybackService({
    databaseService: mockDatabaseService,
    websocketBroadcast: mockWebSocketBroadcast,
    fetchImpl: fetch
    // Note: Not passing dataFormatAdapter to test fallback behavior
  });

  // Check adapter availability
  if (!playbackService.isDataFormatAdapterAvailable()) {
    console.log('DataFormatAdapter not available, using fallback format');
  }

  // Start playback (will use fallback format if adapter not available)
  playbackService.startPlayback({
    testCaseId: 'NR-IA-F1',
    runId: 'run_123'
  }).then(result => {
    console.log('Playback started with fallback format:', result);
    
    // Get logs (will be in fallback format)
    const logs = playbackService.getAllProcessedLogs();
    console.log('Logs in fallback format:', logs);
  }).catch(error => {
    console.error('Playback failed:', error);
  });
}

// Mock services for examples
const mockDatabaseService = {
  saveLogEntry: (logEntry) => {
    console.log('Saving log entry to database:', logEntry);
  }
};

const mockWebSocketBroadcast = (type, source, data) => {
  console.log('Broadcasting:', { type, source, data });
};

// Export examples for use
export {
  basicUsageExample,
  layerSpecificDataExample,
  filteringAndStatisticsExample,
  dataValidationExample,
  logViewerIntegrationExample,
  layerViewIntegrationExample,
  realTimeMonitoringExample,
  errorHandlingExample
};

// Usage instructions
console.log(`
TestCasePlaybackService Enhanced Usage Examples:

1. Basic Usage:
   - Initialize with DataFormatAdapter for consistent formatting
   - Start playback with test case ID and options

2. Layer-Specific Data:
   - Use getLayerData() to get data for specific layers
   - Use getAllProcessedLogs() to get all adapted logs

3. Filtering and Statistics:
   - Use getFilteredLogs() with filter criteria
   - Use getPlaybackStatistics() for playback metrics

4. Data Validation:
   - Use validateDataFormat() to validate data
   - Use isDataFormatAdapterAvailable() to check adapter status

5. Component Integration:
   - Pass processed logs to LogViewer components
   - Use layer data for layer view components

6. Real-time Monitoring:
   - Monitor playback status and statistics
   - Handle playback completion events

7. Error Handling:
   - Graceful fallback when DataFormatAdapter not available
   - Proper error handling for failed operations

The enhanced service provides consistent data formatting across all components
while maintaining backward compatibility with existing implementations.
`);