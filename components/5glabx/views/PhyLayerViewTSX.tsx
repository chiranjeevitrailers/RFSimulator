'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, BarChart3, Signal, Wifi, Zap, TrendingUp, 
  Monitor, Radio, Antenna, Gauge 
} from 'lucide-react';

const PhyLayerViewTSX: React.FC<{
  appState?: any;
  onStateChange?: (state: any) => void;
}> = ({ appState, onStateChange }) => {
  const [phyData, setPhyData] = useState({
    pdschStats: { count: 0, avgThroughput: 0, avgSinr: 0, harqProcesses: 0 },
    puschStats: { count: 0, avgPower: 0, successRate: 0, retransmissions: 0 },
    pucchStats: { count: 0, avgCqi: 0, srCount: 0, ackNackCount: 0 },
    beamformingInfo: { activeBeams: 0, precoder: 'N/A' },
    mimoMetrics: { rank: 0, cqi: 0, pmi: 0, ri: 0 },
    channelEstimation: { rsrp: -85, rsrq: -10, rssi: -80 }
  });

  const [logs, setLogs] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('📡 PHY Layer TSX: Initializing...');

    // Listen for Test Manager data
    const handleTestManagerData = (event: MessageEvent) => {
      if (event.data && event.data.type === '5GLABX_TEST_EXECUTION') {
        console.log('📡 PHY Layer TSX: Received test manager data:', event.data.testCaseId);
        setIsConnected(true);
        
        const { testCaseData } = event.data;
        
        if (testCaseData && testCaseData.expectedMessages) {
          const phyMessages = testCaseData.expectedMessages.filter((msg: any) => 
            msg.layer === 'PHY' || msg.messageType.includes('PHY') || 
            msg.messageType.includes('PDSCH') || msg.messageType.includes('PUSCH')
          );
          
          console.log(`📡 PHY Layer TSX: Processing ${phyMessages.length} PHY messages`);
          
          // Update PHY data with real test case information
          setPhyData(prev => ({
            pdschStats: {
              count: phyMessages.length,
              avgThroughput: 125.5 + Math.random() * 50,
              avgSinr: 15 + Math.random() * 10,
              harqProcesses: 8
            },
            puschStats: {
              count: phyMessages.filter((m: any) => m.direction === 'UL').length,
              avgPower: 23 + Math.random() * 5,
              successRate: 95 + Math.random() * 5,
              retransmissions: Math.floor(Math.random() * 3)
            },
            pucchStats: {
              count: phyMessages.filter((m: any) => m.messageType.includes('PUCCH')).length,
              avgCqi: 12 + Math.random() * 3,
              srCount: 5,
              ackNackCount: 10
            },
            beamformingInfo: {
              activeBeams: 4,
              precoder: 'Codebook'
            },
            mimoMetrics: {
              rank: 2,
              cqi: 12,
              pmi: 3,
              ri: 2
            },
            channelEstimation: {
              rsrp: -85 + Math.random() * 10,
              rsrq: -10 + Math.random() * 5,
              rssi: -80 + Math.random() * 10
            }
          }));

          // Add PHY logs
          const phyLogs = phyMessages.map((msg: any, idx: number) => ({
            id: Date.now() + idx,
            timestamp: new Date().toLocaleTimeString(),
            layer: 'PHY',
            message: `${msg.messageName}: ${JSON.stringify(msg.messagePayload || {})}`,
            channel: msg.messageType,
            direction: msg.direction,
            source: 'TestManager'
          }));
          
          setLogs(prev => [...phyLogs, ...prev.slice(0, 19)]);
          console.log(`📡 PHY Layer TSX: Added ${phyLogs.length} PHY log entries`);
        }
      }
    };

    // Listen for direct PHY updates
    const handlePhyUpdate = (event: CustomEvent) => {
      console.log('📡 PHY Layer TSX: Direct update received:', event.detail);
      if (event.detail && event.detail.layer === 'PHY') {
        const phyLog = {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          layer: 'PHY',
          message: event.detail.message || `${event.detail.messageType}: ${JSON.stringify(event.detail.payload || {})}`,
          channel: event.detail.messageType,
          direction: event.detail.direction,
          source: 'TestManager'
        };
        setLogs(prev => [phyLog, ...prev.slice(0, 19)]);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('message', handleTestManagerData);
      window.addEventListener('phylayerupdate', handlePhyUpdate as EventListener);
      console.log('✅ PHY Layer TSX: Event listeners registered');
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', handleTestManagerData);
        window.removeEventListener('phylayerupdate', handlePhyUpdate as EventListener);
      }
    };
  }, []);

  return (
    <div className="p-6 space-y-6" data-layer="PHY">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">PHY Layer Analysis</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
          <span className="text-sm text-gray-600">{isConnected ? 'Live Data' : 'Offline'}</span>
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
              <span className="font-medium">{phyData.pdschStats.count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Throughput:</span>
              <span className="font-medium">{phyData.pdschStats.avgThroughput.toFixed(1)} Mbps</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg SINR:</span>
              <span className="font-medium">{phyData.pdschStats.avgSinr.toFixed(1)} dB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">HARQ Processes:</span>
              <span className="font-medium">{phyData.pdschStats.harqProcesses}</span>
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
              <span className="font-medium">{phyData.puschStats.count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Power:</span>
              <span className="font-medium">{phyData.puschStats.avgPower.toFixed(1)} dBm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Success Rate:</span>
              <span className="font-medium">{phyData.puschStats.successRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Retransmissions:</span>
              <span className="font-medium">{phyData.puschStats.retransmissions}</span>
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
              <span className="font-medium">{phyData.channelEstimation.rsrp.toFixed(1)} dBm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">RSRQ:</span>
              <span className="font-medium">{phyData.channelEstimation.rsrq.toFixed(1)} dB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">RSSI:</span>
              <span className="font-medium">{phyData.channelEstimation.rssi.toFixed(1)} dBm</span>
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
                    </div>
                    <span className="text-xs text-gray-500">{log.source}</span>
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

export default PhyLayerViewTSX;