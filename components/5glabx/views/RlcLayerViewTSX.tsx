'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, BarChart3, Package2, Layers, TrendingUp, 
  Monitor, Network, Grid, Zap, ArrowUpDown
} from 'lucide-react';
import { protocolLayerDataService, ProtocolLayerMessage, LayerSpecificData } from '../services/ProtocolLayerDataService';

const RlcLayerViewTSX: React.FC<{
  appState?: any;
  onStateChange?: (state: any) => void;
}> = ({ appState, onStateChange }) => {
  const [rlcData, setRlcData] = useState<LayerSpecificData>({});
  const [messages, setMessages] = useState<ProtocolLayerMessage[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentExecutionId, setCurrentExecutionId] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔗 RLC Layer TSX: Initializing...');

    // Listen for Test Manager data
    const handleTestManagerData = (event: MessageEvent) => {
      if (event.data && event.data.type === '5GLABX_TEST_EXECUTION') {
        console.log('🔗 RLC Layer TSX: Received test manager data:', event.data.testCaseId);
        setIsConnected(true);
        
        const { testCaseData } = event.data;
        
        if (testCaseData && testCaseData.expectedMessages) {
          const rlcMessages = testCaseData.expectedMessages.filter((msg: any) => 
            msg.layer === 'RLC' || msg.messageType.includes('RLC') || 
            msg.messageType.includes('PDU') || msg.messageType.includes('AM') || msg.messageType.includes('UM')
          );
          
          console.log(`🔗 RLC Layer TSX: Processing ${rlcMessages.length} RLC messages`);
          
          // Update RLC data
          setRlcData(prev => ({
            amModeStats: {
              txPdus: rlcMessages.filter((m: any) => m.direction === 'UL').length * 15,
              rxPdus: rlcMessages.filter((m: any) => m.direction === 'DL').length * 12,
              retransmissions: 0,
              sequenceNumber: 0
            },
            umModeStats: {
              txPdus: rlcMessages.length * 8,
              rxPdus: rlcMessages.length * 7,
              outOfOrder: 0,
              duplicates: 0
            },
            bufferStats: {
              txBuffer: 0,
              rxBuffer: 0,
              statusReports: 0
            },
            performanceStats: {
              throughput: 80 + 0,
              latency: 1 + 0,
              errorRate: 0,
              efficiency: 90 + 0
            }
          }));

          // Add RLC logs
          const rlcLogs = rlcMessages.map((msg: any, idx: number) => ({
            id: Date.now() + idx,
            timestamp: new Date().toLocaleTimeString(),
            layer: 'RLC',
            message: `${msg.messageName}: ${JSON.stringify(msg.messagePayload || {})}`,
            pduType: msg.messageType,
            direction: msg.direction,
            source: 'TestManager'
          }));
          
          setLogs(prev => [...rlcLogs, ...prev.slice(0, 19)]);
          console.log(`🔗 RLC Layer TSX: Added ${rlcLogs.length} RLC log entries`);
        }
      }
    };

    // Listen for 5GLABX_TEST_EXECUTION events (CustomEvent)
    const handleTestExecution = (event: any) => {
      try {
        if (event.detail && event.detail.type === '5GLABX_TEST_EXECUTION') {
          console.log('🔥 RLC Layer TSX: Received 5GLABX_TEST_EXECUTION event:', event.detail);
          
          const { testCaseId, testCaseData, executionId } = event.detail;
          
          if (testCaseData && testCaseData.expectedMessages) {
            setCurrentExecutionId(executionId);
            setIsConnected(true);
            
            // Process RLC messages from test case data
            const rlcMessages = testCaseData.expectedMessages.filter((msg: any) =>
              msg.layer === 'RLC' || msg.messageType?.includes('RLC') ||
              msg.messageType?.includes('PDU') || msg.messageType?.includes('AM') ||
              msg.messageType?.includes('UM') || msg.messageType?.includes('TM')
            );

            console.log(`🔗 RLC Layer TSX: Processing ${rlcMessages.length} RLC messages from test case`);

            // Add expected RLC logs
            const rlcLogs = rlcMessages.map((msg: any, idx: number) => ({
              id: msg.id || `rlc-${testCaseId}-${idx}`,
              timestamp: new Date(msg.timestampMs || Date.now() + idx * 1000).toLocaleTimeString(),
              layer: 'RLC',
              message: `${msg.messageName || 'Unknown Message'}: ${JSON.stringify(msg.messagePayload || {})}`,
              pduType: msg.messageType || 'GENERIC',
              direction: msg.direction || 'DL',
              source: 'TestManager',
              validationStatus: 'valid',
              processingTime: Math.random() * 10 + 1
            }));

            setLogs(prev => [...rlcLogs, ...prev.slice(0, 19)]);
            console.log(`✅ RLC Layer TSX: Added ${rlcLogs.length} RLC logs from test case`);
          }
        }
      } catch (error) {
        console.error('❌ RLC Layer TSX: Error handling test execution event:', error);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('message', handleTestManagerData);
      window.addEventListener('rlclayerupdate', handleTestManagerData as EventListener);
      window.addEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
      console.log('✅ RLC Layer TSX: Event listeners registered');
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', handleTestManagerData);
        window.removeEventListener('rlclayerupdate', handleTestManagerData as EventListener);
        window.removeEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
      }
    };
  }, []);

  return (
    <div className="p-6 space-y-6" data-layer="RLC">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">RLC Layer Analysis</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
          <span className="text-sm text-gray-600">{isConnected ? 'Live Data' : 'Offline'}</span>
        </div>
      </div>

      {/* RLC Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">AM Mode</h3>
            <Package2 className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">TX PDUs:</span>
              <span className="font-medium">{rlcData.amModeStats.txPdus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">RX PDUs:</span>
              <span className="font-medium">{rlcData.amModeStats.rxPdus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Retransmissions:</span>
              <span className="font-medium">{rlcData.amModeStats.retransmissions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sequence Number:</span>
              <span className="font-medium">{rlcData.amModeStats.sequenceNumber}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">UM Mode</h3>
            <ArrowUpDown className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">TX PDUs:</span>
              <span className="font-medium">{rlcData.umModeStats.txPdus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">RX PDUs:</span>
              <span className="font-medium">{rlcData.umModeStats.rxPdus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Out of Order:</span>
              <span className="font-medium">{rlcData.umModeStats.outOfOrder}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duplicates:</span>
              <span className="font-medium">{rlcData.umModeStats.duplicates}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Buffers</h3>
            <Monitor className="w-6 h-6 text-purple-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">TX Buffer:</span>
              <span className="font-medium">{rlcData.bufferStats.txBuffer} bytes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">RX Buffer:</span>
              <span className="font-medium">{rlcData.bufferStats.rxBuffer} bytes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status Reports:</span>
              <span className="font-medium">{rlcData.bufferStats.statusReports}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Throughput:</span>
              <span className="font-medium">{rlcData.performanceStats.throughput.toFixed(1)} Mbps</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Latency:</span>
              <span className="font-medium">{rlcData.performanceStats.latency.toFixed(1)} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Error Rate:</span>
              <span className="font-medium">{rlcData.performanceStats.errorRate.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Efficiency:</span>
              <span className="font-medium">{rlcData.performanceStats.efficiency.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* RLC Logs */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">RLC Layer Messages</h3>
        </div>
        <div className="p-4">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package2 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No RLC messages yet. Run a test case to see RLC layer data.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="bg-gray-50 p-3 rounded border text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-600 font-mono">[{log.timestamp}]</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">RLC</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{log.direction}</span>
                    </div>
                    <span className="text-xs text-gray-500">{log.source}</span>
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

export default RlcLayerViewTSX;