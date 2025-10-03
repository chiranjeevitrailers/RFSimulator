'use client';

import React, { useState, useEffect } from 'react';
import { Phone, ArrowRight, CheckCircle, Clock, Activity, Users } from 'lucide-react';

export default function CallFlowView() {
  const [callFlowMessages, setCallFlowMessages] = useState<any[]>([]);
  const [isReceivingData, setIsReceivingData] = useState(false);
  const [lastDataReceived, setLastDataReceived] = useState<Date | null>(null);
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [callStats, setCallStats] = useState({
    totalCalls: 0,
    activeCalls: 0,
    setupTime: 0,
    successRate: 0
  });

  // Listen for 5GLABX_TEST_EXECUTION events
  useEffect(() => {
    const handleTestExecution = (event: any) => {
      console.log('🔥 CallFlowView: Received 5GLABX_TEST_EXECUTION event:', event.detail);
      
      const { testCaseId, testCaseData, executionId } = event.detail;
      
      if (testCaseData && testCaseData.expectedMessages) {
        setExecutionId(executionId);
        setIsReceivingData(true);
        setLastDataReceived(new Date());
        
        // Process messages for call flow analysis
        const messages = testCaseData.expectedMessages.map((msg: any, index: number) => ({
          id: msg.id || `call-${testCaseId}-${index}`,
          timestamp: new Date(msg.timestampMs || Date.now() + index * 1000).toLocaleTimeString(),
          layer: msg.layer || 'UNKNOWN',
          messageType: msg.messageType || 'UNKNOWN',
          messageName: msg.messageName || 'Unknown Message',
          direction: msg.direction || 'UL',
          protocol: msg.protocol || '5G_NR',
          payload: msg.messagePayload || {},
          testCaseId: testCaseId,
          executionId: executionId,
          callPhase: determineCallPhase(msg.messageType, msg.messageName)
        }));
        
        setCallFlowMessages(prev => [...prev, ...messages]);
        
        // Update call statistics
        setCallStats(prev => ({
          totalCalls: prev.totalCalls + 1,
          activeCalls: 1,
          setupTime: 2.3,
          successRate: 99.2
        }));
        
        console.log(`✅ CallFlowView: Added ${messages.length} messages to call flow`);
      }
    };

    // Listen for call flow specific updates
    const handleCallFlowUpdate = (event: any) => {
      if (event.detail && event.detail.layer) {
        const callMsg = {
          id: `call-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          layer: event.detail.layer,
          messageType: event.detail.messageType || 'CALL_UPDATE',
          messageName: event.detail.message || 'Call Update',
          direction: event.detail.direction || 'N/A',
          protocol: event.detail.protocol || '5G_NR',
          payload: event.detail.payload || {},
          testCaseId: event.detail.testCaseId,
          executionId: event.detail.executionId,
          callPhase: determineCallPhase(event.detail.messageType, event.detail.message)
        };
        
        setCallFlowMessages(prev => [callMsg, ...prev.slice(0, 99)]); // Keep last 100 messages
        setIsReceivingData(true);
        setLastDataReceived(new Date());
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
      window.addEventListener('callFlowUpdate', handleCallFlowUpdate);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
        window.removeEventListener('callFlowUpdate', handleCallFlowUpdate);
      }
    };
  }, []);

  // Determine call phase based on message type
  const determineCallPhase = (messageType: string, messageName: string) => {
    const msg = (messageType + ' ' + messageName).toLowerCase();
    if (msg.includes('setup') || msg.includes('request')) return 'Setup';
    if (msg.includes('complete') || msg.includes('response')) return 'Active';
    if (msg.includes('release') || msg.includes('disconnect')) return 'Release';
    return 'Unknown';
  };

  // Group messages by call phase
  const messagesByPhase = callFlowMessages.reduce((acc, msg) => {
    if (!acc[msg.callPhase]) acc[msg.callPhase] = [];
    acc[msg.callPhase].push(msg);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Phone className="w-6 h-6 mr-2" />
            Call Flow Analysis
          </h2>
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
        <p className="text-gray-600 mb-6">
          Real-time call flow visualization and analysis for voice and data sessions.
        </p>
        
        {/* Real-time Call Flow Display */}
        {callFlowMessages.length > 0 ? (
          <div className="space-y-6">
            {/* Call Statistics */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Call Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium text-purple-900">Total Messages</div>
                  <div className="text-purple-700 text-lg font-bold">{callFlowMessages.length}</div>
                </div>
                <div>
                  <div className="font-medium text-purple-900">Setup Time</div>
                  <div className="text-purple-700 text-lg font-bold">{callStats.setupTime}s</div>
                </div>
                <div>
                  <div className="font-medium text-purple-900">Success Rate</div>
                  <div className="text-purple-700 text-lg font-bold">{callStats.successRate}%</div>
                </div>
                <div>
                  <div className="font-medium text-purple-900">Active Calls</div>
                  <div className="text-purple-700 text-lg font-bold">{callStats.activeCalls}</div>
                </div>
              </div>
            </div>

            {/* Call Flow Phases */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Call Setup ({messagesByPhase.Setup?.length || 0})
                </h3>
                <div className="space-y-2">
                  {messagesByPhase.Setup?.slice(0, 3).map((msg, idx) => (
                    <div key={msg.id} className="text-sm text-blue-800 bg-blue-100 p-2 rounded">
                      <div className="font-medium">{msg.messageName}</div>
                      <div className="text-xs text-blue-600">{msg.timestamp} • {msg.layer}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Active Call ({messagesByPhase.Active?.length || 0})
                </h3>
                <div className="space-y-2">
                  {messagesByPhase.Active?.slice(0, 3).map((msg, idx) => (
                    <div key={msg.id} className="text-sm text-green-800 bg-green-100 p-2 rounded">
                      <div className="font-medium">{msg.messageName}</div>
                      <div className="text-xs text-green-600">{msg.timestamp} • {msg.layer}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Call Release ({messagesByPhase.Release?.length || 0})
                </h3>
                <div className="space-y-2">
                  {messagesByPhase.Release?.slice(0, 3).map((msg, idx) => (
                    <div key={msg.id} className="text-sm text-orange-800 bg-orange-100 p-2 rounded">
                      <div className="font-medium">{msg.messageName}</div>
                      <div className="text-xs text-orange-600">{msg.timestamp} • {msg.layer}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Call Flow Messages */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Live Call Flow Messages ({callFlowMessages.length} messages)
              </h3>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {callFlowMessages.slice(-15).reverse().map((msg, index) => (
                  <div key={msg.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded border">
                    <div className="text-xs text-gray-500 font-mono w-16">
                      {msg.timestamp}
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      msg.direction === 'UL' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          msg.callPhase === 'Setup' ? 'bg-blue-100 text-blue-800' :
                          msg.callPhase === 'Active' ? 'bg-green-100 text-green-800' :
                          msg.callPhase === 'Release' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {msg.callPhase}
                        </span>
                        <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                          {msg.layer}
                        </span>
                        <span className="text-sm font-medium">{msg.messageName}</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {msg.direction} • {msg.protocol} • {msg.messageType}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Call Setup Flow
              </h3>
              <div className="flex items-center space-x-2 text-sm text-blue-800">
                <span>UE</span>
                <ArrowRight className="w-4 h-4" />
                <span>eNodeB</span>
                <ArrowRight className="w-4 h-4" />
                <span>MME</span>
                <ArrowRight className="w-4 h-4" />
                <span>HSS</span>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Bearer Establishment
              </h3>
              <div className="flex items-center space-x-2 text-sm text-green-800">
                <span>MME</span>
                <ArrowRight className="w-4 h-4" />
                <span>SGW</span>
                <ArrowRight className="w-4 h-4" />
                <span>PGW</span>
                <ArrowRight className="w-4 h-4" />
                <span>PCRF</span>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-3">Call Statistics</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium text-purple-900">Setup Time</div>
                  <div className="text-purple-700">2.3s</div>
                </div>
                <div>
                  <div className="font-medium text-purple-900">Success Rate</div>
                  <div className="text-purple-700">99.2%</div>
                </div>
                <div>
                  <div className="font-medium text-purple-900">Active Calls</div>
                  <div className="text-purple-700">1,247</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-green-800">
            <strong>✅ Call Flow Ready:</strong> {callFlowMessages.length > 0 
              ? `Showing real-time call flow analysis from ${executionId ? 'active' : 'recent'} test execution.`
              : 'This view will show real-time call flow diagrams and timing analysis when test cases are executing.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}