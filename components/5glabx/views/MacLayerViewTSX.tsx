'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, BarChart3, Package, Layers, TrendingUp, 
  Monitor, Network, Grid, Zap 
} from 'lucide-react';
import { protocolLayerDataService, ProtocolLayerMessage, LayerSpecificData } from '../services/ProtocolLayerDataService';

const MacLayerViewTSX: React.FC<{
  appState?: any;
  onStateChange?: (state: any) => void;
}> = ({ appState, onStateChange }) => {
  const [macData, setMacData] = useState<LayerSpecificData>({});
  const [messages, setMessages] = useState<ProtocolLayerMessage[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentExecutionId, setCurrentExecutionId] = useState<string | null>(null);

  // Fetch real MAC layer data from Supabase
  const fetchMacLayerData = async (executionId: string) => {
    if (!executionId || executionId === currentExecutionId) return;
    
    setIsLoading(true);
    setCurrentExecutionId(executionId);
    
    try {
      console.log(`📦 MAC Layer TSX: Fetching real data for execution: ${executionId}`);
      
      const { messages: macMessages, stats, layerSpecificData } = 
        await protocolLayerDataService.fetchLayerData(executionId, 'MAC');
      
      setMessages(macMessages);
      setMacData(layerSpecificData);
      
      // Convert messages to logs for display
      const macLogs = macMessages.map((msg, idx) => ({
        id: msg.id,
        timestamp: new Date(msg.timestamp / 1000).toLocaleTimeString(),
        layer: 'MAC',
        message: `${msg.messageName}: ${JSON.stringify(msg.decodedData || {})}`,
        pduType: msg.messageType,
        direction: msg.direction,
        source: 'Supabase',
        validationStatus: msg.validationStatus,
        processingTime: msg.processingTime
      }));
      
      setLogs(macLogs);
      setIsConnected(true);
      
      console.log(`✅ MAC Layer TSX: Loaded ${macMessages.length} real MAC messages`);
      
    } catch (error) {
      console.error('❌ MAC Layer TSX: Error fetching real data:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('📦 MAC Layer TSX: Initializing...');

    // Listen for Test Manager data
    const handleTestManagerData = (event: MessageEvent) => {
      if (event.data && event.data.type === '5GLABX_TEST_EXECUTION') {
        console.log('📦 MAC Layer TSX: Received test manager data:', event.data.testCaseId);
        
        const { executionId, testCaseId } = event.data;
        
        // If we have an execution ID, fetch real data from Supabase
        if (executionId) {
          fetchMacLayerData(executionId);
        } else if (testCaseId) {
          // Fallback to test case data if no execution ID
          setIsConnected(true);
          const { testCaseData } = event.data;
          
          if (testCaseData && testCaseData.expectedMessages) {
            const macMessages = testCaseData.expectedMessages.filter((msg: any) => 
              msg.layer === 'MAC' || msg.messageType.includes('MAC') || 
              msg.messageType.includes('PDU') || msg.messageType.includes('Grant')
            );
            
            console.log(`📦 MAC Layer TSX: Processing ${macMessages.length} expected MAC messages`);
            
            // Add expected MAC logs
            const macLogs = macMessages.map((msg: any, idx: number) => ({
              id: Date.now() + idx,
              timestamp: new Date().toLocaleTimeString(),
              layer: 'MAC',
              message: `${msg.messageName}: ${JSON.stringify(msg.messagePayload || {})}`,
              pduType: msg.messageType,
              direction: msg.direction,
              source: 'Expected'
            }));
            
            setLogs(prev => [...macLogs, ...prev.slice(0, 19)]);
          }
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('message', handleTestManagerData);
      window.addEventListener('maclayerupdate', handleTestManagerData as EventListener);
      console.log('✅ MAC Layer TSX: Event listeners registered');
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', handleTestManagerData);
        window.removeEventListener('maclayerupdate', handleTestManagerData as EventListener);
      }
    };
  }, [currentExecutionId]);

  return (
    <div className="p-6 space-y-6" data-layer="MAC">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">MAC Layer Analysis</h1>
        <div className="flex items-center space-x-2">
          {isLoading && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-blue-600">Loading...</span>
            </div>
          )}
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? (currentExecutionId ? 'Real Data' : 'Expected Data') : 'Offline'}
          </span>
          {currentExecutionId && (
            <span className="text-xs text-gray-500">Exec: {currentExecutionId.slice(0, 8)}...</span>
          )}
        </div>
      </div>

      {/* MAC Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">HARQ</h3>
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Processes:</span>
              <span className="font-medium">{macData.harqStats?.processes || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Retransmissions:</span>
              <span className="font-medium">{macData.harqStats?.retransmissions || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Success Rate:</span>
              <span className="font-medium">{(macData.harqStats?.successRate || 0).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Scheduling</h3>
            <Grid className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">DL Grants:</span>
              <span className="font-medium">{macData.schedulingStats?.dlGrants || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">UL Grants:</span>
              <span className="font-medium">{macData.schedulingStats?.ulGrants || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Latency:</span>
              <span className="font-medium">{(macData.schedulingStats?.avgLatency || 0).toFixed(1)} ms</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Buffers</h3>
            <Layers className="w-6 h-6 text-purple-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">BSR:</span>
              <span className="font-medium">{macData.bufferStats?.bsr || 0} bytes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">DL Buffer:</span>
              <span className="font-medium">{macData.bufferStats?.dlBuffer || 0} bytes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">UL Buffer:</span>
              <span className="font-medium">{macData.bufferStats?.ulBuffer || 0} bytes</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Throughput</h3>
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">DL:</span>
              <span className="font-medium">{(macData.throughputStats?.dlThroughput || 0).toFixed(1)} Mbps</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">UL:</span>
              <span className="font-medium">{(macData.throughputStats?.ulThroughput || 0).toFixed(1)} Mbps</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Efficiency:</span>
              <span className="font-medium">{(macData.throughputStats?.efficiency || 0).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAC Logs */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">MAC Layer Messages</h3>
        </div>
        <div className="p-4">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No MAC messages yet. Run a test case to see MAC layer data.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="bg-gray-50 p-3 rounded border text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 font-mono">[{log.timestamp}]</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">MAC</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{log.direction}</span>
                      {log.validationStatus && (
                        <span className={`px-2 py-1 rounded text-xs ${
                          log.validationStatus === 'valid' ? 'bg-green-100 text-green-800' :
                          log.validationStatus === 'invalid' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {log.validationStatus}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {log.processingTime && (
                        <span className="text-xs text-gray-500">{log.processingTime}ms</span>
                      )}
                      <span className="text-xs text-gray-500">{log.source}</span>
                    </div>
                  </div>
                  <div className="mt-1 font-mono text-gray-900">{log.message}</div>
                  {log.pduType && (
                    <div className="mt-1 text-xs text-gray-600">PDU Type: {log.pduType}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MacLayerViewTSX;