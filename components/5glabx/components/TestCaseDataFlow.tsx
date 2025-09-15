'use client';

import React, { useState, useEffect } from 'react';
import { useAPI } from '../services/APIIntegration';
import { useDataFlow } from '../services/DataFlowIntegration';
import { Play, Pause, Square, RefreshCw, Database, Layers, Activity } from 'lucide-react';

// Test Case Data Flow Component
// This component demonstrates how test case data flows from the database through all layers
const TestCaseDataFlow: React.FC = () => {
  const { fetchTestCases, fetchTestCase, executeTestCase, isLoading } = useAPI();
  const { startTestCase, stopTestCase, layerData, isConnected } = useDataFlow();
  
  const [testCases, setTestCases] = useState<any[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dataFlowStatus, setDataFlowStatus] = useState<Record<string, any>>({});

  // Load test cases on component mount
  useEffect(() => {
    const loadTestCases = async () => {
      try {
        const data = await fetchTestCases({ limit: 20 });
        setTestCases(data.testCases || []);
      } catch (error) {
        console.error('Error loading test cases:', error);
      }
    };

    loadTestCases();
  }, [fetchTestCases]);

  // Monitor data flow status
  useEffect(() => {
    const updateDataFlowStatus = () => {
      const status: Record<string, any> = {};
      
      // Check each layer for data
      Object.keys(layerData).forEach(layer => {
        const data = layerData[layer];
        status[layer] = {
          hasData: !!data,
          messageCount: Array.isArray(data) ? data.length : (data?.count || 0),
          lastUpdate: data?.timestamp || null,
          status: data ? 'active' : 'inactive'
        };
      });
      
      setDataFlowStatus(status);
    };

    updateDataFlowStatus();
  }, [layerData]);

  const handleTestCaseSelect = async (testCase: any) => {
    try {
      const data = await fetchTestCase(testCase.id, true);
      setSelectedTestCase(data);
    } catch (error) {
      console.error('Error loading test case:', error);
    }
  };

  const handleStartTestCase = async () => {
    if (!selectedTestCase) return;
    
    try {
      setIsPlaying(true);
      await startTestCase(selectedTestCase.id);
      console.log('Test case started:', selectedTestCase.name);
    } catch (error) {
      console.error('Error starting test case:', error);
      setIsPlaying(false);
    }
  };

  const handleStopTestCase = () => {
    stopTestCase();
    setIsPlaying(false);
    console.log('Test case stopped');
  };

  const layers = [
    { name: 'PHY', description: 'Physical Layer', color: 'bg-blue-500' },
    { name: 'MAC', description: 'Medium Access Control', color: 'bg-green-500' },
    { name: 'RLC', description: 'Radio Link Control', color: 'bg-yellow-500' },
    { name: 'PDCP', description: 'Packet Data Convergence Protocol', color: 'bg-purple-500' },
    { name: 'RRC', description: 'Radio Resource Control', color: 'bg-red-500' },
    { name: 'NAS', description: 'Non-Access Stratum', color: 'bg-indigo-500' },
    { name: 'SIP', description: 'Session Initiation Protocol', color: 'bg-pink-500' },
    { name: 'O-RAN', description: 'Open RAN', color: 'bg-orange-500' },
    { name: 'NB-IoT', description: 'Narrowband IoT', color: 'bg-teal-500' },
    { name: 'V2X', description: 'Vehicle-to-Everything', color: 'bg-cyan-500' },
    { name: 'NTN', description: 'Non-Terrestrial Network', color: 'bg-lime-500' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Test Case Data Flow</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Test Case Selection */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">Select Test Case</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testCases.map((testCase) => (
            <div
              key={testCase.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedTestCase?.id === testCase.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleTestCaseSelect(testCase)}
            >
              <h3 className="font-medium text-gray-900">{testCase.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{testCase.description}</p>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {testCase.protocol || '5G-NR'}
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {testCase.layer || 'Multi-layer'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Case Execution Controls */}
      {selectedTestCase && (
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Test Case Execution</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <h3 className="font-medium">{selectedTestCase.name}</h3>
              <p className="text-sm text-gray-600">{selectedTestCase.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              {!isPlaying ? (
                <button
                  onClick={handleStartTestCase}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  <span>Start</span>
                </button>
              ) : (
                <button
                  onClick={handleStopTestCase}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Pause className="w-4 h-4" />
                  <span>Stop</span>
                </button>
              )}
              <button
                onClick={() => setSelectedTestCase(null)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <Square className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Flow Visualization */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">Data Flow Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {layers.map((layer) => {
            const status = dataFlowStatus[layer.name];
            return (
              <div
                key={layer.name}
                className={`p-4 border rounded-lg ${
                  status?.status === 'active' ? 'border-green-200 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${layer.color} ${
                    status?.status === 'active' ? 'animate-pulse' : ''
                  }`}></div>
                  <h3 className="font-medium text-gray-900">{layer.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">{layer.description}</p>
                <div className="text-xs text-gray-500">
                  <div>Messages: {status?.messageCount || 0}</div>
                  <div>Status: {status?.status || 'inactive'}</div>
                  {status?.lastUpdate && (
                    <div>Last: {new Date(status.lastUpdate).toLocaleTimeString()}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Flow Diagram */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">Data Flow Architecture</h2>
        <div className="space-y-4">
          {/* Database Layer */}
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <Database className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-medium">Database Layer</h3>
              <p className="text-sm text-gray-600">1000+ 3GPP test cases stored in Supabase</p>
            </div>
          </div>

          {/* API Layer */}
          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
            <Activity className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-medium">API Layer</h3>
              <p className="text-sm text-gray-600">Next.js API routes for test case execution and data access</p>
            </div>
          </div>

          {/* Processing Layer */}
          <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
            <Layers className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-medium">Processing Layer</h3>
              <p className="text-sm text-gray-600">StreamProcessor, LogProcessor, MessageAnalyzer, LayerStatsService</p>
            </div>
          </div>

          {/* Frontend Layer */}
          <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
            <RefreshCw className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="font-medium">Frontend Layer</h3>
              <p className="text-sm text-gray-600">React components for each protocol layer and analysis view</p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Data Display */}
      {Object.keys(layerData).length > 0 && (
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Real-time Layer Data</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(layerData).map(([layer, data]) => (
              <div key={layer} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">{layer} Layer</h3>
                <pre className="text-xs text-gray-600 overflow-x-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCaseDataFlow;