'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, BarChart3, User, Shield, TrendingUp, 
  Monitor, Network, Key, Zap, CheckCircle, Globe
} from 'lucide-react';

const NasLayerViewTSX: React.FC<{
  appState?: any;
  onStateChange?: (state: any) => void;
}> = ({ appState, onStateChange }) => {
  const [nasData, setNasData] = useState({
    registrationStats: { state: 'REGISTERED', type: 'initial', attempts: 1, success: true },
    securityStats: { ksi: 5, authenticated: true, ciphered: true, integrityProtected: true },
    sessionStats: { activeSessions: 1, defaultSession: 1, qosFlows: 2 },
    mobilityStats: { tauCount: 0, serviceRequests: 1, emergencyCalls: 0 }
  });

  const [logs, setLogs] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('🌐 NAS Layer TSX: Initializing...');

    // Listen for Test Manager data
    const handleTestManagerData = (event: MessageEvent) => {
      if (event.data && event.data.type === '5GLABX_TEST_EXECUTION') {
        console.log('🌐 NAS Layer TSX: Received test manager data:', event.data.testCaseId);
        setIsConnected(true);
        
        const { testCaseData } = event.data;
        
        if (testCaseData && testCaseData.expectedMessages) {
          const nasMessages = testCaseData.expectedMessages.filter((msg: any) => 
            msg.layer === 'NAS' || msg.messageType.includes('NAS') || 
            msg.messageType.includes('Registration') || msg.messageType.includes('Authentication')
          );
          
          console.log(`🌐 NAS Layer TSX: Processing ${nasMessages.length} NAS messages`);
          
          // Update NAS data
          setNasData(prev => ({
            registrationStats: {
              state: 'REGISTERED',
              type: 'initial',
              attempts: 1,
              success: true
            },
            securityStats: {
              ksi: 5 + 0,
              authenticated: true,
              ciphered: true,
              integrityProtected: true
            },
            sessionStats: {
              activeSessions: 1 + 0,
              defaultSession: 1,
              qosFlows: 2 + 0
            },
            mobilityStats: {
              tauCount: 0,
              serviceRequests: 1 + nasMessages.length,
              emergencyCalls: 0
            }
          }));

          // Add NAS logs
          const nasLogs = nasMessages.map((msg: any, idx: number) => ({
            id: Date.now() + idx,
            timestamp: new Date().toLocaleTimeString(),
            layer: 'NAS',
            message: `${msg.messageName}: ${JSON.stringify(msg.messagePayload || {})}`,
            messageType: msg.messageType,
            direction: msg.direction,
            securityContext: 'Protected',
            source: 'TestManager'
          }));
          
          setLogs(prev => [...nasLogs, ...prev.slice(0, 19)]);
          console.log(`🌐 NAS Layer TSX: Added ${nasLogs.length} NAS log entries`);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('message', handleTestManagerData);
      window.addEventListener('naslayerupdate', handleTestManagerData as EventListener);
      console.log('✅ NAS Layer TSX: Event listeners registered');
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', handleTestManagerData);
        window.removeEventListener('naslayerupdate', handleTestManagerData as EventListener);
      }
    };
  }, []);

  return (
    <div className="p-6 space-y-6" data-layer="NAS">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">NAS Layer Analysis</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
          <span className="text-sm text-gray-600">{isConnected ? 'Live Data' : 'Offline'}</span>
        </div>
      </div>

      {/* NAS Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Registration</h3>
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">State:</span>
              <span className="font-medium text-green-600">{nasData.registrationStats.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium">{nasData.registrationStats.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Attempts:</span>
              <span className="font-medium">{nasData.registrationStats.attempts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Success:</span>
              <span className="font-medium flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                {nasData.registrationStats.success ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Security</h3>
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">KSI:</span>
              <span className="font-medium">{nasData.securityStats.ksi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Authenticated:</span>
              <span className="font-medium flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                {nasData.securityStats.authenticated ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ciphered:</span>
              <span className="font-medium flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                {nasData.securityStats.ciphered ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Integrity:</span>
              <span className="font-medium flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                {nasData.securityStats.integrityProtected ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">PDU Sessions</h3>
            <Globe className="w-6 h-6 text-orange-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Active Sessions:</span>
              <span className="font-medium">{nasData.sessionStats.activeSessions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Default Session:</span>
              <span className="font-medium">{nasData.sessionStats.defaultSession}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">QoS Flows:</span>
              <span className="font-medium">{nasData.sessionStats.qosFlows}</span>
            </div>
          </div>
        </div>
      </div>

      {/* NAS Logs */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">NAS Layer Messages</h3>
        </div>
        <div className="p-4">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No NAS messages yet. Run a test case to see NAS layer data.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="bg-gray-50 p-3 rounded border text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-600 font-mono">[{log.timestamp}]</span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">NAS</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{log.direction}</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{log.securityContext}</span>
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

export default NasLayerViewTSX;