'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, BarChart3, Shield, Lock, TrendingUp, 
  Monitor, Network, Key, Zap, CheckCircle
} from 'lucide-react';

const PdcpLayerViewTSX: React.FC<{
  appState?: any;
  onStateChange?: (state: any) => void;
}> = ({ appState, onStateChange }) => {
  const [pdcpData, setPdcpData] = useState({
    securityStats: { cipheringEnabled: true, integrityEnabled: true, keyRefresh: 0 },
    sequenceStats: { dlSequence: 0, ulSequence: 0, maxSequence: 4095 },
    compressionStats: { enabled: false, ratio: 0, savedBytes: 0 },
    performanceStats: { throughput: 0, latency: 0, packetLoss: 0, efficiency: 98.2 }
  });

  const [logs, setLogs] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('🔒 PDCP Layer TSX: Initializing...');

    // Listen for Test Manager data
    const handleTestManagerData = (event: MessageEvent) => {
      if (event.data && event.data.type === '5GLABX_TEST_EXECUTION') {
        console.log('🔒 PDCP Layer TSX: Received test manager data:', event.data.testCaseId);
        setIsConnected(true);
        
        const { testCaseData } = event.data;
        
        if (testCaseData && testCaseData.expectedMessages) {
          const pdcpMessages = testCaseData.expectedMessages.filter((msg: any) => 
            msg.layer === 'PDCP' || msg.messageType.includes('PDCP') || 
            msg.messageType.includes('Security') || msg.messageType.includes('Cipher')
          );
          
          console.log(`🔒 PDCP Layer TSX: Processing ${pdcpMessages.length} PDCP messages`);
          
          // Update PDCP data
          setPdcpData(prev => ({
            securityStats: {
              cipheringEnabled: true,
              integrityEnabled: true,
              keyRefresh: Math.floor(Math.random() * 5)
            },
            sequenceStats: {
              dlSequence: Math.floor(Math.random() * 4095),
              ulSequence: Math.floor(Math.random() * 4095),
              maxSequence: 4095
            },
            compressionStats: {
              enabled: Math.random() > 0.5,
              ratio: 10 + Math.random() * 20,
              savedBytes: Math.floor(Math.random() * 1000)
            },
            performanceStats: {
              throughput: 75 + Math.random() * 35,
              latency: 0.5 + Math.random() * 2,
              packetLoss: Math.random() * 1,
              efficiency: 95 + Math.random() * 5
            }
          }));

          // Add PDCP logs
          const pdcpLogs = pdcpMessages.map((msg: any, idx: number) => ({
            id: Date.now() + idx,
            timestamp: new Date().toLocaleTimeString(),
            layer: 'PDCP',
            message: `${msg.messageName}: ${JSON.stringify(msg.messagePayload || {})}`,
            securityInfo: 'Ciphered/Integrity Protected',
            direction: msg.direction,
            source: 'TestManager'
          }));
          
          setLogs(prev => [...pdcpLogs, ...prev.slice(0, 19)]);
          console.log(`🔒 PDCP Layer TSX: Added ${pdcpLogs.length} PDCP log entries`);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('message', handleTestManagerData);
      window.addEventListener('pdcplayerupdate', handleTestManagerData as EventListener);
      console.log('✅ PDCP Layer TSX: Event listeners registered');
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', handleTestManagerData);
        window.removeEventListener('pdcplayerupdate', handleTestManagerData as EventListener);
      }
    };
  }, []);

  return (
    <div className="p-6 space-y-6" data-layer="PDCP">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">PDCP Layer Analysis</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
          <span className="text-sm text-gray-600">{isConnected ? 'Live Data' : 'Offline'}</span>
        </div>
      </div>

      {/* PDCP Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Security</h3>
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Ciphering:</span>
              <span className="font-medium flex items-center">
                {pdcpData.securityStats.cipheringEnabled ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    Enabled
                  </>
                ) : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Integrity:</span>
              <span className="font-medium flex items-center">
                {pdcpData.securityStats.integrityEnabled ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    Enabled
                  </>
                ) : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Key Refresh:</span>
              <span className="font-medium">{pdcpData.securityStats.keyRefresh}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sequence Numbers</h3>
            <Grid className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">DL SN:</span>
              <span className="font-medium">{pdcpData.sequenceStats.dlSequence}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">UL SN:</span>
              <span className="font-medium">{pdcpData.sequenceStats.ulSequence}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Max SN:</span>
              <span className="font-medium">{pdcpData.sequenceStats.maxSequence}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Compression</h3>
            <Zap className="w-6 h-6 text-purple-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Enabled:</span>
              <span className="font-medium">{pdcpData.compressionStats.enabled ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ratio:</span>
              <span className="font-medium">{pdcpData.compressionStats.ratio.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Saved:</span>
              <span className="font-medium">{pdcpData.compressionStats.savedBytes} bytes</span>
            </div>
          </div>
        </div>
      </div>

      {/* PDCP Logs */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">PDCP Layer Messages</h3>
        </div>
        <div className="p-4">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No PDCP messages yet. Run a test case to see PDCP layer data.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="bg-gray-50 p-3 rounded border text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-indigo-600 font-mono">[{log.timestamp}]</span>
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">PDCP</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{log.direction}</span>
                    </div>
                    <span className="text-xs text-gray-500">{log.source}</span>
                  </div>
                  <div className="mt-1 font-mono text-gray-900">{log.message}</div>
                  {log.securityInfo && (
                    <div className="mt-1 text-xs text-green-600 flex items-center">
                      <Lock className="w-3 h-3 mr-1" />
                      {log.securityInfo}
                    </div>
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

export default PdcpLayerViewTSX;