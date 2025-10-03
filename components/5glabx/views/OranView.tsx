'use client';

import React, { useState, useEffect } from 'react';
import { Network, Server, Database, Settings, BarChart3, Activity, Clock } from 'lucide-react';

const OranView: React.FC<{ viewId?: string }> = ({ viewId = 'oran-overview' }) => {
  const [oranData, setOranData] = useState<any[]>([]);
  const [isReceivingData, setIsReceivingData] = useState(false);
  const [lastDataReceived, setLastDataReceived] = useState<Date | null>(null);
  const [executionId, setExecutionId] = useState<string | null>(null);

  // Listen for 5GLABX_TEST_EXECUTION events
  useEffect(() => {
    const handleTestExecution = (event: any) => {
      console.log('🔥 OranView: Received 5GLABX_TEST_EXECUTION event:', event.detail);
      
      const { testCaseId, testCaseData, executionId } = event.detail;
      
      if (testCaseData && testCaseData.expectedMessages) {
        setExecutionId(executionId);
        setIsReceivingData(true);
        setLastDataReceived(new Date());
        
        // Process messages for O-RAN analysis
        const messages = testCaseData.expectedMessages
          .filter((msg: any) => 
            msg.layer === 'O-RAN' || 
            msg.messageType?.includes('O-RAN') ||
            msg.messageType?.includes('F1') ||
            msg.messageType?.includes('E1') ||
            msg.protocol === 'O-RAN'
          )
          .map((msg: any, index: number) => ({
            id: msg.id || `oran-${testCaseId}-${index}`,
            timestamp: new Date(msg.timestampMs || Date.now() + index * 1000).toLocaleTimeString(),
            layer: msg.layer || 'O-RAN',
            messageType: msg.messageType || 'UNKNOWN',
            messageName: msg.messageName || 'Unknown Message',
            direction: msg.direction || 'UL',
            protocol: msg.protocol || 'O-RAN',
            payload: msg.messagePayload || {},
            testCaseId: testCaseId,
            executionId: executionId,
            interface: determineOranInterface(msg.messageType, msg.messageName)
          }));
        
        setOranData(prev => [...prev, ...messages]);
        console.log(`✅ OranView: Added ${messages.length} O-RAN messages`);
      }
    };

    // Listen for O-RAN specific updates
    const handleOranUpdate = (event: any) => {
      if (event.detail && event.detail.layer === 'O-RAN') {
        const oranMsg = {
          id: `oran-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          layer: 'O-RAN',
          messageType: event.detail.messageType || 'ORAN_UPDATE',
          messageName: event.detail.message || 'O-RAN Update',
          direction: event.detail.direction || 'N/A',
          protocol: 'O-RAN',
          payload: event.detail.payload || {},
          testCaseId: event.detail.testCaseId,
          executionId: event.detail.executionId,
          interface: determineOranInterface(event.detail.messageType, event.detail.message)
        };
        
        setOranData(prev => [oranMsg, ...prev.slice(0, 99)]); // Keep last 100 messages
        setIsReceivingData(true);
        setLastDataReceived(new Date());
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
      window.addEventListener('oranUpdate', handleOranUpdate);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
        window.removeEventListener('oranUpdate', handleOranUpdate);
      }
    };
  }, []);

  // Determine O-RAN interface based on message type
  const determineOranInterface = (messageType: string, messageName: string) => {
    const msg = (messageType + ' ' + messageName).toLowerCase();
    if (msg.includes('f1') || msg.includes('du')) return 'F1 Interface';
    if (msg.includes('e1') || msg.includes('cu')) return 'E1 Interface';
    if (msg.includes('xapp') || msg.includes('smo')) return 'xApp/SMO';
    return 'O-RAN Core';
  };
  const getViewContent = () => {
    switch (viewId) {
      case 'oran-overview':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Network className="w-5 h-5 mr-2" />
                  O-RAN Overview
                </h3>
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center space-x-2 ${isReceivingData ? "text-green-600" : "text-gray-400"}`}>
                    <div className={`w-3 h-3 rounded-full ${isReceivingData ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}></div>
                    <span className="text-sm font-medium">
                      {isReceivingData ? "🟢 Live Data" : "⚪ Waiting"}
                    </span>
                  </div>
                  {lastDataReceived && (
                    <span className="text-xs text-gray-500">
                      Last: {lastDataReceived.toLocaleTimeString()}
                    </span>
                  )}
                  {executionId && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      Exec: {executionId.slice(0, 8)}...
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Open Radio Access Network (O-RAN) analysis and monitoring dashboard.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900">CU Status</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {oranData.length > 0 ? 'Active' : 'Standby'}
                  </p>
                  <p className="text-xs text-blue-600">
                    {oranData.filter(m => m.interface === 'E1 Interface').length} E1 messages
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900">DU Status</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {oranData.length > 0 ? 'Connected' : 'Disconnected'}
                  </p>
                  <p className="text-xs text-green-600">
                    {oranData.filter(m => m.interface === 'F1 Interface').length} F1 messages
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900">xApps</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    {oranData.filter(m => m.interface === 'xApp/SMO').length} Running
                  </p>
                  <p className="text-xs text-purple-600">
                    {oranData.length} total O-RAN messages
                  </p>
                </div>
              </div>
              
              {/* Live O-RAN Messages */}
              {oranData.length > 0 && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Live O-RAN Messages ({oranData.length})
                  </h4>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {oranData.slice(-10).reverse().map((msg, index) => (
                      <div key={msg.id} className="flex items-center space-x-3 p-2 bg-white rounded border">
                        <div className="text-xs text-gray-500 font-mono w-16">
                          {msg.timestamp}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                              {msg.interface}
                            </span>
                            <span className="text-sm font-medium">{msg.messageName}</span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {msg.direction} • {msg.messageType}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'oran-performance':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                O-RAN Performance Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Throughput</h4>
                  <p className="text-2xl font-bold text-blue-600">1.2 Gbps</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Latency</h4>
                  <p className="text-2xl font-bold text-green-600">5.2 ms</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Availability</h4>
                  <p className="text-2xl font-bold text-purple-600">99.9%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Active UEs</h4>
                  <p className="text-2xl font-bold text-orange-600">1,247</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Network className="w-5 h-5 mr-2" />
              {viewId.replace('oran-', '').replace('-', ' ').toUpperCase()}
            </h3>
            <p className="text-gray-600">
              O-RAN {viewId.replace('oran-', '').replace('-', ' ')} analysis view.
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                This O-RAN analysis view is ready for implementation with real-time data from your O-RAN infrastructure.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">O-RAN Analysis</h2>
        <p className="text-gray-600">Open Radio Access Network monitoring and analysis</p>
      </div>
      {getViewContent()}
    </div>
  );
};

export default OranView;