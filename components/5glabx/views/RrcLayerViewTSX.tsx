'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, BarChart3, Smartphone, Users, TrendingUp, 
  Monitor, Network, Settings, Zap, Signal, CheckCircle
} from 'lucide-react';
import { protocolLayerDataService, ProtocolLayerMessage, LayerSpecificData } from '../services/ProtocolLayerDataService';

const RrcLayerViewTSX: React.FC<{
  appState?: any;
  onStateChange?: (state: any) => void;
}> = ({ appState, onStateChange }) => {
  const [rrcData, setRrcData] = useState<LayerSpecificData>({});
  const [messages, setMessages] = useState<ProtocolLayerMessage[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentExecutionId, setCurrentExecutionId] = useState<string | null>(null);

  // Fetch real RRC layer data from Supabase
  const fetchRrcLayerData = async (executionId: string) => {
    if (!executionId || executionId === currentExecutionId) return;
    
    setIsLoading(true);
    setCurrentExecutionId(executionId);
    
    try {
      console.log(`📱 RRC Layer TSX: Fetching real data for execution: ${executionId}`);
      
      const { messages: rrcMessages, stats, layerSpecificData } = 
        await protocolLayerDataService.fetchLayerData(executionId, 'RRC');
      
      setMessages(rrcMessages);
      setRrcData(layerSpecificData);
      
      // Convert messages to logs for display
      const rrcLogs = rrcMessages.map((msg, idx) => ({
        id: msg.id,
        timestamp: new Date(msg.timestamp / 1000).toLocaleTimeString(),
        layer: 'RRC',
        message: `${msg.messageName}: ${JSON.stringify(msg.decodedData || {})}`,
        messageType: msg.messageType,
        direction: msg.direction,
        transactionId: extractTransactionId(msg),
        source: 'Supabase',
        validationStatus: msg.validationStatus,
        processingTime: msg.processingTime
      }));
      
      setLogs(rrcLogs);
      setIsConnected(true);
      
      console.log(`✅ RRC Layer TSX: Loaded ${rrcMessages.length} real RRC messages`);
      
    } catch (error) {
      console.error('❌ RRC Layer TSX: Error fetching real data:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to extract transaction ID from RRC messages
  const extractTransactionId = (msg: ProtocolLayerMessage): number => {
    const transactionIdParam = msg.layerParameters.find(p => 
      p.parameter_name?.toUpperCase().includes('TRANSACTION_ID')
    );
    return transactionIdParam ? parseInt(transactionIdParam.parameter_value) || 0 : 0;
  };

  useEffect(() => {
    console.log('📱 RRC Layer TSX: Initializing...');

    // Listen for Test Manager data
    const handleTestManagerData = (event: MessageEvent) => {
      if (event.data && event.data.type === '5GLABX_TEST_EXECUTION') {
        console.log('📱 RRC Layer TSX: Received test manager data:', event.data.testCaseId);
        
        const { executionId, testCaseId } = event.data;
        
        // If we have an execution ID, fetch real data from Supabase
        if (executionId) {
          fetchRrcLayerData(executionId);
        } else if (testCaseId) {
          // Fallback to test case data if no execution ID
          setIsConnected(true);
          const { testCaseData } = event.data;
          
          if (testCaseData && testCaseData.expectedMessages) {
            const rrcMessages = testCaseData.expectedMessages.filter((msg: any) => 
              msg.layer === 'RRC' || msg.messageType.includes('RRC') || 
              msg.messageType.includes('Setup') || msg.messageType.includes('Reconfiguration')
            );
            
            console.log(`📱 RRC Layer TSX: Processing ${rrcMessages.length} expected RRC messages`);
            
            // Add expected RRC logs
            const rrcLogs = rrcMessages.map((msg: any, idx: number) => ({
              id: Date.now() + idx,
              timestamp: new Date().toLocaleTimeString(),
              layer: 'RRC',
              message: `${msg.messageName}: ${JSON.stringify(msg.messagePayload || {})}`,
              messageType: msg.messageType,
              direction: msg.direction,
              transactionId: Math.floor(Math.random() * 4),
              source: 'Expected'
            }));
            
            setLogs(prev => [...rrcLogs, ...prev.slice(0, 19)]);
          }
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('message', handleTestManagerData);
      window.addEventListener('rrclayerupdate', handleTestManagerData as EventListener);
      console.log('✅ RRC Layer TSX: Event listeners registered');
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', handleTestManagerData);
        window.removeEventListener('rrclayerupdate', handleTestManagerData as EventListener);
      }
    };
  }, [currentExecutionId]);

  return (
    <div className="p-6 space-y-6" data-layer="RRC">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">RRC Layer Analysis</h1>
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

      {/* RRC Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Connection</h3>
            <Smartphone className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">State:</span>
              <span className="font-medium text-green-600">{rrcData.connectionStats?.state || 'RRC_IDLE'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-medium">{rrcData.connectionStats?.transactionId || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cause:</span>
              <span className="font-medium">{rrcData.connectionStats?.establishmentCause || 'mo-Data'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Measurements</h3>
            <Signal className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">RSRP:</span>
              <span className="font-medium">{(rrcData.measurementStats?.rsrp || 0).toFixed(1)} dBm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">RSRQ:</span>
              <span className="font-medium">{(rrcData.measurementStats?.rsrq || 0).toFixed(1)} dB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Neighbor Cells:</span>
              <span className="font-medium">{rrcData.measurementStats?.numCells || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Reports Sent:</span>
              <span className="font-medium">{rrcData.measurementStats?.reportsSent || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Mobility</h3>
            <Network className="w-6 h-6 text-purple-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Handovers:</span>
              <span className="font-medium">{rrcData.mobilityStats.handovers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cell Reselections:</span>
              <span className="font-medium">{rrcData.mobilityStats.cellReselections}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Failures:</span>
              <span className="font-medium">{rrcData.mobilityStats.failures}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
            <Settings className="w-6 h-6 text-orange-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">SRB Count:</span>
              <span className="font-medium">{rrcData.configurationStats.srbCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">DRB Count:</span>
              <span className="font-medium">{rrcData.configurationStats.drbCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Measurements:</span>
              <span className="font-medium">{rrcData.configurationStats.measurements}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Success:</span>
              <span className="font-medium flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                {rrcData.configurationStats.success ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RRC Logs */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">RRC Layer Messages</h3>
        </div>
        <div className="p-4">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Smartphone className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No RRC messages yet. Run a test case to see RRC layer data.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="bg-gray-50 p-3 rounded border text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600 font-mono">[{log.timestamp}]</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">RRC</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{log.direction}</span>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">TID:{log.transactionId}</span>
                    </div>
                    <span className="text-xs text-gray-500">{log.source}</span>
                  </div>
                  <div className="mt-1 font-mono text-gray-900">{log.message}</div>
                  {log.messageType && (
                    <div className="mt-1 text-xs text-gray-600">Message Type: {log.messageType}</div>
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

export default RrcLayerViewTSX;