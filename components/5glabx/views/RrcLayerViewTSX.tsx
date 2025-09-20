'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, BarChart3, Smartphone, Users, TrendingUp, 
  Monitor, Network, Settings, Zap, Signal, CheckCircle
} from 'lucide-react';

const RrcLayerViewTSX: React.FC<{
  appState?: any;
  onStateChange?: (state: any) => void;
}> = ({ appState, onStateChange }) => {
  const [rrcData, setRrcData] = useState({
    connectionStats: { state: 'RRC_CONNECTED', transactionId: 0, establishmentCause: 'mo-Data' },
    measurementStats: { rsrp: -85, rsrq: -10, numCells: 1, reportsSent: 0 },
    mobilityStats: { handovers: 0, cellReselections: 0, failures: 0 },
    configurationStats: { srbCount: 2, drbCount: 1, measurements: 3, success: true }
  });

  const [logs, setLogs] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('📱 RRC Layer TSX: Initializing...');

    // Listen for Test Manager data
    const handleTestManagerData = (event: MessageEvent) => {
      if (event.data && event.data.type === '5GLABX_TEST_EXECUTION') {
        console.log('📱 RRC Layer TSX: Received test manager data:', event.data.testCaseId);
        setIsConnected(true);
        
        const { testCaseData } = event.data;
        
        if (testCaseData && testCaseData.expectedMessages) {
          const rrcMessages = testCaseData.expectedMessages.filter((msg: any) => 
            msg.layer === 'RRC' || msg.messageType.includes('RRC') || 
            msg.messageType.includes('Setup') || msg.messageType.includes('Reconfiguration')
          );
          
          console.log(`📱 RRC Layer TSX: Processing ${rrcMessages.length} RRC messages`);
          
          // Update RRC data based on messages
          setRrcData(prev => ({
            connectionStats: {
              state: 'RRC_CONNECTED',
              transactionId: Math.floor(Math.random() * 4),
              establishmentCause: 'mo-Data'
            },
            measurementStats: {
              rsrp: -85 + Math.random() * 10,
              rsrq: -10 + Math.random() * 5,
              numCells: 1 + Math.floor(Math.random() * 3),
              reportsSent: rrcMessages.length
            },
            mobilityStats: {
              handovers: Math.floor(Math.random() * 3),
              cellReselections: Math.floor(Math.random() * 2),
              failures: Math.floor(Math.random() * 1)
            },
            configurationStats: {
              srbCount: 2,
              drbCount: 1,
              measurements: rrcMessages.length,
              success: true
            }
          }));

          // Add RRC logs
          const rrcLogs = rrcMessages.map((msg: any, idx: number) => ({
            id: Date.now() + idx,
            timestamp: new Date().toLocaleTimeString(),
            layer: 'RRC',
            message: `${msg.messageName}: ${JSON.stringify(msg.messagePayload || {})}`,
            messageType: msg.messageType,
            direction: msg.direction,
            transactionId: Math.floor(Math.random() * 4),
            source: 'TestManager'
          }));
          
          setLogs(prev => [...rrcLogs, ...prev.slice(0, 19)]);
          console.log(`📱 RRC Layer TSX: Added ${rrcLogs.length} RRC log entries`);
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
  }, []);

  return (
    <div className="p-6 space-y-6" data-layer="RRC">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">RRC Layer Analysis</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
          <span className="text-sm text-gray-600">{isConnected ? 'Live Data' : 'Offline'}</span>
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
              <span className="font-medium text-green-600">{rrcData.connectionStats.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-medium">{rrcData.connectionStats.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cause:</span>
              <span className="font-medium">{rrcData.connectionStats.establishmentCause}</span>
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
              <span className="font-medium">{rrcData.measurementStats.rsrp.toFixed(1)} dBm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">RSRQ:</span>
              <span className="font-medium">{rrcData.measurementStats.rsrq.toFixed(1)} dB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Neighbor Cells:</span>
              <span className="font-medium">{rrcData.measurementStats.numCells}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Reports Sent:</span>
              <span className="font-medium">{rrcData.measurementStats.reportsSent}</span>
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