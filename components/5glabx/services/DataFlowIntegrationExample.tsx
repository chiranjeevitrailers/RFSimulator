/**
 * DataFlowIntegration Usage Examples
 * Demonstrates how to use the enhanced DataFlowProvider with DataFormatAdapter integration
 */

import React, { useEffect, useState } from 'react';
import { DataFlowProvider, useDataFlow } from './DataFlowIntegration';

// Example 1: Basic usage with DataFlowProvider
const BasicUsageExample: React.FC = () => {
  return (
    <DataFlowProvider>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Data Flow Integration Example</h2>
        <DataFlowStatus />
        <LayerDataDisplay />
        <TestCaseControls />
      </div>
    </DataFlowProvider>
  );
};

// Example 2: Data Flow Status Component
const DataFlowStatus: React.FC = () => {
  const { isConnected, adapterAvailable, getSupportedLayers } = useDataFlow();

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm mb-4">
      <h3 className="text-lg font-semibold mb-3">Data Flow Status</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">WebSocket: {isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${adapterAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">Data Adapter: {adapterAvailable ? 'Available' : 'Not Available'}</span>
        </div>
        <div className="col-span-2">
          <span className="text-sm text-gray-600">
            Supported Layers: {getSupportedLayers().join(', ')}
          </span>
        </div>
      </div>
    </div>
  );
};

// Example 3: Layer Data Display Component
const LayerDataDisplay: React.FC = () => {
  const { layerData, getLayerStatistics, subscribeToLayer } = useDataFlow();
  const [selectedLayer, setSelectedLayer] = useState<string>('PHY');
  const [layerStats, setLayerStats] = useState<any>({});

  useEffect(() => {
    // Subscribe to layer data updates
    const unsubscribe = subscribeToLayer(selectedLayer, (data) => {
      console.log(`Received data for ${selectedLayer}:`, data);
    });

    return unsubscribe;
  }, [selectedLayer, subscribeToLayer]);

  useEffect(() => {
    // Update layer statistics
    const stats = getLayerStatistics();
    setLayerStats(stats);
  }, [layerData, getLayerStatistics]);

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm mb-4">
      <h3 className="text-lg font-semibold mb-3">Layer Data Display</h3>
      
      {/* Layer Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Layer
        </label>
        <select
          value={selectedLayer}
          onChange={(e) => setSelectedLayer(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="PHY">PHY</option>
          <option value="MAC">MAC</option>
          <option value="RRC">RRC</option>
          <option value="NAS">NAS</option>
          <option value="IMS">IMS</option>
        </select>
      </div>

      {/* Layer Statistics */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Layer Statistics</h4>
        <div className="grid grid-cols-4 gap-2 text-sm">
          <div className="bg-gray-100 p-2 rounded">
            <div className="font-medium">Total</div>
            <div>{layerStats[selectedLayer]?.count || 0}</div>
          </div>
          <div className="bg-red-100 p-2 rounded">
            <div className="font-medium">Errors</div>
            <div>{layerStats[selectedLayer]?.errorCount || 0}</div>
          </div>
          <div className="bg-yellow-100 p-2 rounded">
            <div className="font-medium">Warnings</div>
            <div>{layerStats[selectedLayer]?.warningCount || 0}</div>
          </div>
          <div className="bg-blue-100 p-2 rounded">
            <div className="font-medium">Info</div>
            <div>{layerStats[selectedLayer]?.infoCount || 0}</div>
          </div>
        </div>
      </div>

      {/* Layer Data */}
      <div>
        <h4 className="font-medium mb-2">Current Layer Data</h4>
        <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
          {JSON.stringify(layerData[selectedLayer] || {}, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// Example 4: Test Case Controls Component
const TestCaseControls: React.FC = () => {
  const { startTestCase, stopTestCase, testCaseData } = useDataFlow();
  const [selectedTestCase, setSelectedTestCase] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartTest = async () => {
    if (!selectedTestCase) return;
    
    setIsLoading(true);
    try {
      await startTestCase(selectedTestCase);
      console.log(`Started test case: ${selectedTestCase}`);
    } catch (error) {
      console.error('Failed to start test case:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopTest = () => {
    stopTestCase();
    console.log('Stopped test case');
  };

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Test Case Controls</h3>
      
      <div className="space-y-4">
        {/* Test Case Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Test Case
          </label>
          <select
            value={selectedTestCase}
            onChange={(e) => setSelectedTestCase(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a test case...</option>
            <option value="NR-IA-F1">5G NR Initial Access - Free User</option>
            <option value="NR-IA-P1">5G NR Initial Access - Pro User</option>
            <option value="NR-IA-E1">5G NR Initial Access - Enterprise</option>
            <option value="LTE-IA-F1">LTE Initial Access - Free User</option>
            <option value="VOLTE-CALL-F1">VoLTE Call Setup - Free User</option>
          </select>
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleStartTest}
            disabled={!selectedTestCase || isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Starting...' : 'Start Test Case'}
          </button>
          
          <button
            onClick={handleStopTest}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Stop Test Case
          </button>
        </div>

        {/* Test Case Data Display */}
        {testCaseData && (
          <div>
            <h4 className="font-medium mb-2">Test Case Data</h4>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(testCaseData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

// Example 5: Real-time Data Processing Component
const RealTimeDataProcessor: React.FC = () => {
  const { realTimeData, processData, validateData, subscribeToLayer } = useDataFlow();
  const [processedData, setProcessedData] = useState<any>(null);
  const [validationResults, setValidationResults] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (realTimeData) {
      // Process the data using DataFormatAdapter
      const processed = processData(realTimeData, 'log');
      setProcessedData(processed);

      // Validate the data
      const isValid = validateData(realTimeData, 'log');
      setValidationResults(prev => ({
        ...prev,
        [Date.now().toString()]: isValid
      }));
    }
  }, [realTimeData, processData, validateData]);

  useEffect(() => {
    // Subscribe to PHY layer data
    const unsubscribe = subscribeToLayer('PHY', (data) => {
      console.log('PHY layer data received:', data);
    });

    return unsubscribe;
  }, [subscribeToLayer]);

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Real-time Data Processing</h3>
      
      <div className="space-y-4">
        {/* Real-time Data */}
        <div>
          <h4 className="font-medium mb-2">Real-time Data</h4>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-32">
            {JSON.stringify(realTimeData || {}, null, 2)}
          </pre>
        </div>

        {/* Processed Data */}
        {processedData && (
          <div>
            <h4 className="font-medium mb-2">Processed Data</h4>
            <pre className="bg-green-100 p-3 rounded text-xs overflow-auto max-h-32">
              {JSON.stringify(processedData, null, 2)}
            </pre>
          </div>
        )}

        {/* Validation Results */}
        <div>
          <h4 className="font-medium mb-2">Validation Results</h4>
          <div className="space-y-1">
            {Object.entries(validationResults).map(([timestamp, isValid]) => (
              <div key={timestamp} className="flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{new Date(parseInt(timestamp)).toLocaleTimeString()}</span>
                <span>{isValid ? 'Valid' : 'Invalid'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Example 6: Advanced Layer Monitoring Component
const AdvancedLayerMonitoring: React.FC = () => {
  const { layerData, getSupportedLayers, subscribeToLayer } = useDataFlow();
  const [monitoredLayers, setMonitoredLayers] = useState<string[]>(['PHY', 'MAC']);
  const [layerMetrics, setLayerMetrics] = useState<Record<string, any>>({});

  useEffect(() => {
    // Subscribe to multiple layers
    const unsubscribers = monitoredLayers.map(layer => 
      subscribeToLayer(layer, (data) => {
        setLayerMetrics(prev => ({
          ...prev,
          [layer]: {
            ...prev[layer],
            lastUpdate: Date.now(),
            dataCount: (prev[layer]?.dataCount || 0) + 1,
            latestData: data
          }
        }));
      })
    );

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [monitoredLayers, subscribeToLayer]);

  const addLayer = (layer: string) => {
    if (!monitoredLayers.includes(layer)) {
      setMonitoredLayers(prev => [...prev, layer]);
    }
  };

  const removeLayer = (layer: string) => {
    setMonitoredLayers(prev => prev.filter(l => l !== layer));
  };

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Advanced Layer Monitoring</h3>
      
      <div className="space-y-4">
        {/* Layer Selection */}
        <div>
          <h4 className="font-medium mb-2">Monitored Layers</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {monitoredLayers.map(layer => (
              <span
                key={layer}
                className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
              >
                <span>{layer}</span>
                <button
                  onClick={() => removeLayer(layer)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          
          <select
            onChange={(e) => {
              if (e.target.value) {
                addLayer(e.target.value);
                e.target.value = '';
              }
            }}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="">Add layer...</option>
            {getSupportedLayers()
              .filter(layer => !monitoredLayers.includes(layer))
              .map(layer => (
                <option key={layer} value={layer}>{layer}</option>
              ))}
          </select>
        </div>

        {/* Layer Metrics */}
        <div>
          <h4 className="font-medium mb-2">Layer Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {monitoredLayers.map(layer => {
              const metrics = layerMetrics[layer];
              return (
                <div key={layer} className="border border-gray-200 rounded p-3">
                  <h5 className="font-medium text-sm mb-2">{layer} Layer</h5>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>Data Count: {metrics?.dataCount || 0}</div>
                    <div>Last Update: {metrics?.lastUpdate ? new Date(metrics.lastUpdate).toLocaleTimeString() : 'Never'}</div>
                    <div>Status: {metrics?.latestData ? 'Active' : 'Inactive'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Complete Example Component
const DataFlowIntegrationCompleteExample: React.FC = () => {
  return (
    <DataFlowProvider>
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Data Flow Integration Examples</h1>
        
        <div className="space-y-6">
          <DataFlowStatus />
          <LayerDataDisplay />
          <TestCaseControls />
          <RealTimeDataProcessor />
          <AdvancedLayerMonitoring />
        </div>
      </div>
    </DataFlowProvider>
  );
};

export {
  BasicUsageExample,
  DataFlowStatus,
  LayerDataDisplay,
  TestCaseControls,
  RealTimeDataProcessor,
  AdvancedLayerMonitoring,
  DataFlowIntegrationCompleteExample
};

export default DataFlowIntegrationCompleteExample;