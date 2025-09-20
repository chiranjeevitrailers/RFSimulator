'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, BarChart3, Signal, Wifi, Zap, TrendingUp, 
  Monitor, Radio, Antenna, Gauge 
} from 'lucide-react';
import { protocolLayerDataService, ProtocolLayerMessage, LayerSpecificData } from '../services/ProtocolLayerDataService';

const PhyLayerViewEnhanced: React.FC<{
  appState?: any;
  onStateChange?: (state: any) => void;
}> = ({ appState, onStateChange }) => {
  const [phyData, setPhyData] = useState<LayerSpecificData>({});
  const [messages, setMessages] = useState<ProtocolLayerMessage[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentExecutionId, setCurrentExecutionId] = useState<string | null>(null);

  // Fetch real PHY layer data from Supabase
  const fetchPhyLayerData = async (executionId: string) => {
    if (!executionId || executionId === currentExecutionId) return;
    
    setIsLoading(true);
    setCurrentExecutionId(executionId);
    
    try {
      console.log(`📡 PHY Layer Enhanced: Fetching real data for execution: ${executionId}`);
      
      const { messages: phyMessages, stats, layerSpecificData } = 
        await protocolLayerDataService.fetchLayerData(executionId, 'PHY');
      
      setMessages(phyMessages);
      setPhyData(layerSpecificData);
      
      // Convert messages to logs for display
      const phyLogs = phyMessages.map((msg, idx) => ({
        id: msg.id,
        timestamp: new Date(msg.timestamp / 1000).toLocaleTimeString(),
        layer: 'PHY',
        message: `${msg.messageName}: ${JSON.stringify(msg.decodedData || {})}`,
        channel: msg.messageType,
        direction: msg.direction,
        source: 'Supabase',
        validationStatus: msg.validationStatus,
        processingTime: msg.processingTime
      }));
      
      setLogs(phyLogs);
      setIsConnected(true);
      
      console.log(`✅ PHY Layer Enhanced: Loaded ${phyMessages.length} real PHY messages`);
      
    } catch (error) {
      console.error('❌ PHY Layer Enhanced: Error fetching real data:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('📡 PHY Layer Enhanced: Initializing...');

    // Enhanced data loading with fallback mechanisms
    const loadPhyData = () => {
      console.log('🔍 PHY Layer Enhanced: Attempting to load data from multiple sources...');

      // Method 1: Check global variable
      if ((window as any).latestTestCaseData) {
        console.log('✅ PHY Layer Enhanced: Found data in global variable');
        processPhyData((window as any).latestTestCaseData);
        return;
      }

      // Method 2: Check localStorage
      try {
        const storedData = localStorage.getItem('5glabx_test_data');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          console.log('✅ PHY Layer Enhanced: Found data in localStorage');
          processPhyData(parsedData);
          return;
        }
      } catch (e) {
        console.warn('⚠️ PHY Layer Enhanced: Failed to parse localStorage data:', e);
      }

      console.log('⚠️ PHY Layer Enhanced: No test data found in fallback sources');
    };

    // Process PHY data
    const processPhyData = (data: any) => {
      try {
        if (data && data.type === '5GLABX_TEST_EXECUTION' && data.testCaseData) {
          console.log('📡 PHY Layer Enhanced processing test case data:', {
            testCaseId: data.testCaseId,
            testCaseName: data.testCaseData.testCase?.name,
            messageCount: data.testCaseData.expectedMessages?.length || 0
          });

          const { testCaseData } = data;

          if (testCaseData.expectedMessages && Array.isArray(testCaseData.expectedMessages)) {
            const phyMessages = testCaseData.expectedMessages.filter((msg: any) =>
              msg.layer === 'PHY' || msg.messageType?.includes('PHY') ||
              msg.messageType?.includes('PDSCH') || msg.messageType?.includes('PUSCH')
            );

            console.log(`📡 PHY Layer Enhanced: Processing ${phyMessages.length} expected PHY messages`);

            // Add expected PHY logs
            const phyLogs = phyMessages.map((msg: any, idx: number) => ({
              id: Date.now() + idx,
              timestamp: new Date().toLocaleTimeString(),
              layer: 'PHY',
              message: `${msg.messageName || 'Unknown Message'}: ${JSON.stringify(msg.messagePayload || {})}`,
              channel: msg.messageType || 'GENERIC',
              direction: msg.direction || 'DL',
              source: 'Expected'
            }));

            setLogs(prev => [...phyLogs, ...prev.slice(0, 19)]);
            setIsConnected(true);
          } else {
            console.warn('⚠️ PHY Layer Enhanced: No expectedMessages found in testCaseData');
          }
        } else {
          console.warn('⚠️ PHY Layer Enhanced: Invalid data format received');
        }
      } catch (error) {
        console.error('❌ PHY Layer Enhanced: Error processing test data:', error);
      }
    };

    // Listen for Test Manager data
    const handleTestManagerData = (event: MessageEvent) => {
      try {
        if (event.data && event.data.type === '5GLABX_TEST_EXECUTION') {
          console.log('📡 PHY Layer Enhanced: Received test manager data:', event.data.testCaseId);
          processPhyData(event.data);

          const { executionId } = event.data;

          // If we have an execution ID, fetch real data from Supabase
          if (executionId) {
            fetchPhyLayerData(executionId);
          }
        }
      } catch (error) {
        console.error('❌ PHY Layer Enhanced: Error handling test manager data:', error);
      }
    };

    // Listen for direct PHY updates
    const handlePhyUpdate = (event: CustomEvent) => {
      try {
        console.log('📡 PHY Layer Enhanced: Direct update received:', event.detail);
        if (event.detail && event.detail.layer === 'PHY') {
          const phyLog = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            layer: 'PHY',
            message: event.detail.message || `${event.detail.messageType || 'Unknown'}: ${JSON.stringify(event.detail.payload || {})}`,
            channel: event.detail.messageType || 'GENERIC',
            direction: event.detail.direction || 'DL',
            source: 'Direct'
          };
          setLogs(prev => [phyLog, ...prev.slice(0, 19)]);
        }
      } catch (error) {
        console.error('❌ PHY Layer Enhanced: Error handling direct PHY update:', error);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('message', handleTestManagerData);
      window.addEventListener('phylayerupdate', handlePhyUpdate as EventListener);
      console.log('✅ PHY Layer Enhanced: Event listeners registered');

      // Try to load existing data immediately
      setTimeout(() => {
        loadPhyData();
      }, 500); // Faster loading

      // Check periodically for new data
      const dataCheckInterval = setInterval(() => {
        loadPhyData();
      }, 2000);

      return () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('message', handleTestManagerData);
          window.removeEventListener('phylayerupdate', handlePhyUpdate as EventListener);
          clearInterval(dataCheckInterval);
        }
      };
    }

    return () => {
      // Cleanup if window is not available
    };
  }, [currentExecutionId]);

  return (
    <div className="p-6 space-y-6" data-layer="PHY">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enhanced PHY Layer Analysis</h1>
          <p className="text-gray-600 mt-1">5G NR Physical Layer Protocol Analysis & Monitoring</p>
        </div>
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

      {/* PHY Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">PDSCH Stats</h3>
            <Signal className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Count:</span>
              <span className="font-medium">{phyData.pdschStats?.count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Throughput:</span>
              <span className="font-medium">{(phyData.pdschStats?.avgThroughput || 0).toFixed(1)} Mbps</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg SINR:</span>
              <span className="font-medium">{(phyData.pdschStats?.avgSinr || 0).toFixed(1)} dB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">HARQ Processes:</span>
              <span className="font-medium">{phyData.pdschStats?.harqProcesses || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">PUSCH Stats</h3>
            <Antenna className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Count:</span>
              <span className="font-medium">{phyData.puschStats?.count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Power:</span>
              <span className="font-medium">{(phyData.puschStats?.avgPower || 0).toFixed(1)} dBm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Success Rate:</span>
              <span className="font-medium">{(phyData.puschStats?.successRate || 0).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Retransmissions:</span>
              <span className="font-medium">{phyData.puschStats?.retransmissions || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Channel Estimation</h3>
            <Gauge className="w-6 h-6 text-purple-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">RSRP:</span>
              <span className="font-medium">{(phyData.channelEstimation?.rsrp || 0).toFixed(1)} dBm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">RSRQ:</span>
              <span className="font-medium">{(phyData.channelEstimation?.rsrq || 0).toFixed(1)} dB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">RSSI:</span>
              <span className="font-medium">{(phyData.channelEstimation?.rssi || 0).toFixed(1)} dBm</span>
            </div>
          </div>
        </div>
      </div>

      {/* PHY Logs */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">PHY Layer Messages</h3>
        </div>
        <div className="p-4">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Radio className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No PHY messages yet. Run a test case to see PHY layer data.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="bg-gray-50 p-3 rounded border text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600 font-mono">[{log.timestamp}]</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">PHY</span>
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
                  {log.channel && (
                    <div className="mt-1 text-xs text-gray-600">Channel: {log.channel}</div>
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

export default PhyLayerViewEnhanced;