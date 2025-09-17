/**
 * DataFormatAdapterIntegration - Examples and integration patterns
 * Shows how to integrate DataFormatAdapter with existing components
 */

import DataFormatAdapter from './DataFormatAdapter.js';

/**
 * Integration with LogViewer component
 */
export class LogViewerIntegration {
  /**
   * Process raw log data for LogViewer component
   */
  static processLogsForViewer(rawLogs) {
    if (!Array.isArray(rawLogs)) return [];
    
    return DataFormatAdapter.adaptLogsForViewer(rawLogs);
  }

  /**
   * Process single log entry for LogViewer
   */
  static processLogEntry(logEntry) {
    return DataFormatAdapter.adaptLogForViewer(logEntry);
  }

  /**
   * Filter logs by layer and adapt them
   */
  static getLayerLogs(rawLogs, layer) {
    const layerLogs = rawLogs.filter(log => 
      log.layer === layer || 
      log.fields?.layer === layer ||
      log.component === layer
    );
    
    return DataFormatAdapter.adaptLogsForViewer(layerLogs);
  }

  /**
   * Get logs with specific protocol and adapt them
   */
  static getProtocolLogs(rawLogs, protocol) {
    const protocolLogs = rawLogs.filter(log => 
      log.protocol === protocol ||
      log.fields?.protocol === protocol ||
      log.messageType === protocol
    );
    
    return DataFormatAdapter.adaptLogsForViewer(protocolLogs);
  }
}

/**
 * Integration with Layer View components
 */
export class LayerViewIntegration {
  /**
   * Process data for PHY layer view
   */
  static processPhyData(rawData) {
    return DataFormatAdapter.adaptForLayerView(rawData, 'PHY');
  }

  /**
   * Process data for MAC layer view
   */
  static processMacData(rawData) {
    return DataFormatAdapter.adaptForLayerView(rawData, 'MAC');
  }

  /**
   * Process data for RRC layer view
   */
  static processRrcData(rawData) {
    return DataFormatAdapter.adaptForLayerView(rawData, 'RRC');
  }

  /**
   * Process data for NAS layer view
   */
  static processNasData(rawData) {
    return DataFormatAdapter.adaptForLayerView(rawData, 'NAS');
  }

  /**
   * Process data for IMS/SIP layer view
   */
  static processImsData(rawData) {
    return DataFormatAdapter.adaptForLayerView(rawData, 'IMS');
  }

  /**
   * Process data for any layer view
   */
  static processLayerData(rawData, layer) {
    if (!DataFormatAdapter.isLayerSupported(layer)) {
      console.warn(`Layer ${layer} is not supported by DataFormatAdapter`);
      return rawData;
    }
    
    return DataFormatAdapter.adaptForLayerView(rawData, layer);
  }

  /**
   * Batch process multiple layer data entries
   */
  static processLayerDataBatch(rawDataArray, layer) {
    return DataFormatAdapter.adaptLayerDataBatch(rawDataArray, layer);
  }
}

/**
 * Integration with Test Case components
 */
export class TestCaseIntegration {
  /**
   * Process test case execution data
   */
  static processTestCaseData(testCaseData) {
    if (!testCaseData) return null;

    const processed = {
      ...testCaseData,
      logs: DataFormatAdapter.adaptLogsForViewer(testCaseData.logs || []),
      layerData: {}
    };

    // Process layer-specific data
    const layers = ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS'];
    layers.forEach(layer => {
      if (testCaseData[layer.toLowerCase() + 'Data']) {
        processed.layerData[layer] = DataFormatAdapter.adaptForLayerView(
          testCaseData[layer.toLowerCase() + 'Data'], 
          layer
        );
      }
    });

    return processed;
  }

  /**
   * Process test case results
   */
  static processTestCaseResults(results) {
    if (!results) return null;

    return {
      ...results,
      stepResults: results.stepResults?.map(step => ({
        ...step,
        logs: DataFormatAdapter.adaptLogsForViewer(step.logs || [])
      }))
    };
  }
}

/**
 * Integration with Real-time components
 */
export class RealTimeIntegration {
  /**
   * Process real-time log stream
   */
  static processRealTimeLogs(logStream) {
    return logStream.map(log => DataFormatAdapter.adaptLogForViewer(log));
  }

  /**
   * Process real-time layer data
   */
  static processRealTimeLayerData(dataStream, layer) {
    return dataStream.map(data => DataFormatAdapter.adaptForLayerView(data, layer));
  }

  /**
   * Create real-time data processor
   */
  static createRealTimeProcessor(layer) {
    return {
      layer,
      process: (data) => DataFormatAdapter.adaptForLayerView(data, layer),
      validate: (data) => DataFormatAdapter.validateLayerData(data, layer)
    };
  }
}

/**
 * Integration with ML components
 */
export class MLIntegration {
  /**
   * Process ML execution events
   */
  static processMLEvents(mlEvents) {
    return mlEvents.map(event => ({
      ...event,
      adaptedLog: DataFormatAdapter.adaptLogForViewer(event),
      layerData: event.layer ? DataFormatAdapter.adaptForLayerView(event, event.layer) : null
    }));
  }

  /**
   * Extract features for ML processing
   */
  static extractMLFeatures(data, layer) {
    const adaptedData = DataFormatAdapter.adaptForLayerView(data, layer);
    return adaptedData?.metrics || {};
  }
}

/**
 * Utility functions for common integration patterns
 */
export class IntegrationUtils {
  /**
   * Create a data processor for a specific component
   */
  static createProcessor(componentType, options = {}) {
    switch (componentType) {
      case 'LogViewer':
        return {
          process: (data) => LogViewerIntegration.processLogsForViewer(data),
          filter: (data, filter) => this.filterLogs(data, filter)
        };
      
      case 'LayerView':
        return {
          process: (data, layer) => LayerViewIntegration.processLayerData(data, layer),
          batchProcess: (data, layer) => LayerViewIntegration.processLayerDataBatch(data, layer)
        };
      
      case 'TestCase':
        return {
          process: (data) => TestCaseIntegration.processTestCaseData(data),
          processResults: (results) => TestCaseIntegration.processTestCaseResults(results)
        };
      
      case 'RealTime':
        return {
          processLogs: (stream) => RealTimeIntegration.processRealTimeLogs(stream),
          processLayerData: (stream, layer) => RealTimeIntegration.processRealTimeLayerData(stream, layer)
        };
      
      default:
        return {
          process: (data) => data
        };
    }
  }

  /**
   * Filter logs based on criteria
   */
  static filterLogs(logs, filter) {
    if (!filter) return logs;
    
    return logs.filter(log => {
      if (filter.level && log.level !== filter.level) return false;
      if (filter.layer && log.layer !== filter.layer) return false;
      if (filter.protocol && log.protocol !== filter.protocol) return false;
      if (filter.source && log.source !== filter.source) return false;
      if (filter.timeRange) {
        const logTime = new Date(log.timestamp);
        if (logTime < filter.timeRange.start || logTime > filter.timeRange.end) return false;
      }
      return true;
    });
  }

  /**
   * Validate data before processing
   */
  static validateData(data, type) {
    switch (type) {
      case 'log':
        return DataFormatAdapter.validateLogEntry(data);
      case 'layer':
        return (layer) => DataFormatAdapter.validateLayerData(data, layer);
      default:
        return data !== null && data !== undefined;
    }
  }

  /**
   * Get supported layers
   */
  static getSupportedLayers() {
    return DataFormatAdapter.getSupportedLayers();
  }

  /**
   * Get layer field mappings
   */
  static getLayerFieldMappings(layer) {
    return DataFormatAdapter.getLayerFieldMappings(layer);
  }
}

/**
 * React Hook for DataFormatAdapter integration
 */
export function useDataFormatAdapter() {
  const [adapter] = React.useState(() => DataFormatAdapter);
  
  const processLogs = React.useCallback((logs) => {
    return LogViewerIntegration.processLogsForViewer(logs);
  }, []);
  
  const processLayerData = React.useCallback((data, layer) => {
    return LayerViewIntegration.processLayerData(data, layer);
  }, []);
  
  const processTestCaseData = React.useCallback((data) => {
    return TestCaseIntegration.processTestCaseData(data);
  }, []);
  
  const validateData = React.useCallback((data, type) => {
    return IntegrationUtils.validateData(data, type);
  }, []);
  
  return {
    adapter,
    processLogs,
    processLayerData,
    processTestCaseData,
    validateData,
    getSupportedLayers: IntegrationUtils.getSupportedLayers,
    getLayerFieldMappings: IntegrationUtils.getLayerFieldMappings
  };
}

// Export all integration classes
export {
  LogViewerIntegration,
  LayerViewIntegration,
  TestCaseIntegration,
  RealTimeIntegration,
  MLIntegration,
  IntegrationUtils
};

export default {
  LogViewerIntegration,
  LayerViewIntegration,
  TestCaseIntegration,
  RealTimeIntegration,
  MLIntegration,
  IntegrationUtils,
  useDataFormatAdapter
};