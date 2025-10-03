'use client';

import React, { useState, useEffect } from 'react';
import { Network, ArrowRight, ArrowDown, ArrowUp, Activity, Clock } from 'lucide-react';

export default function LayerTraceView() {
  const [layerMessages, setLayerMessages] = useState<any[]>([]);
  const [isReceivingData, setIsReceivingData] = useState(false);
  const [lastDataReceived, setLastDataReceived] = useState<Date | null>(null);
  const [executionId, setExecutionId] = useState<string | null>(null);

  // Listen for 5GLABX_TEST_EXECUTION events
  useEffect(() => {
    const handleTestExecution = (event: any) => {
      console.log('🔥 LayerTraceView: Received 5GLABX_TEST_EXECUTION event:', event.detail);
      
      const { testCaseId, testCaseData, executionId } = event.detail;
      
      if (testCaseData && testCaseData.expectedMessages) {
        setExecutionId(executionId);
        setIsReceivingData(true);
        setLastDataReceived(new Date());
        
        // Process messages by layer for trace analysis
        const messages = testCaseData.expectedMessages.map((msg: any, index: number) => ({
          id: msg.id || `trace-${testCaseId}-${index}`,
          timestamp: new Date(msg.timestampMs || Date.now() + index * 1000).toLocaleTimeString(),
          layer: msg.layer || 'UNKNOWN',
          messageType: msg.messageType || 'UNKNOWN',
          messageName: msg.messageName || 'Unknown Message',
          direction: msg.direction || 'UL',
          protocol: msg.protocol || '5G_NR',
          payload: msg.messagePayload || {},
          testCaseId: testCaseId,
          executionId: executionId
        }));
        
        setLayerMessages(prev => [...prev, ...messages]);
        console.log(`✅ LayerTraceView: Added ${messages.length} messages to trace`);
      }
    };

    // Listen for layer-specific updates
    const handleLayerUpdate = (event: any) => {
      if (event.detail && event.detail.layer) {
        const layerMsg = {
          id: `layer-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          layer: event.detail.layer,
          messageType: event.detail.messageType || 'LAYER_UPDATE',
          messageName: event.detail.message || 'Layer Update',
          direction: event.detail.direction || 'N/A',
          protocol: event.detail.protocol || '5G_NR',
          payload: event.detail.payload || {},
          testCaseId: event.detail.testCaseId,
          executionId: event.detail.executionId
        };
        
        setLayerMessages(prev => [layerMsg, ...prev.slice(0, 99)]); // Keep last 100 messages
        setIsReceivingData(true);
        setLastDataReceived(new Date());
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
      window.addEventListener('layerTraceUpdate', handleLayerUpdate);
      
      // Listen for layer-specific events
      const layers = ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS'];
      layers.forEach(layer => {
        window.addEventListener(`${layer.toLowerCase()}layerupdate`, handleLayerUpdate);
      });
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
        window.removeEventListener('layerTraceUpdate', handleLayerUpdate);
        layers.forEach(layer => {
          window.removeEventListener(`${layer.toLowerCase()}layerupdate`, handleLayerUpdate);
        });
      }
    };
  }, []);

  // Group messages by layer for display
  const messagesByLayer = layerMessages.reduce((acc, msg) => {
    if (!acc[msg.layer]) acc[msg.layer] = [];
    acc[msg.layer].push(msg);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Network className="w-6 h-6 mr-2" />
            Layer Trace Analysis
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
          Real-time protocol layer message tracing and flow analysis.
        </p>
        
        {/* Real-time Layer Trace Display */}
        {layerMessages.length > 0 ? (
          <div className="space-y-6">
            {/* Layer Flow Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Uplink Messages ({layerMessages.filter(m => m.direction === 'UL').length})
                </h3>
                <div className="text-sm text-blue-800 space-y-1">
                  {['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'].map(layer => {
                    const count = messagesByLayer[layer]?.filter(m => m.direction === 'UL').length || 0;
                    return (
                      <div key={layer} className="flex justify-between">
                        <span>{layer}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Downlink Messages ({layerMessages.filter(m => m.direction === 'DL').length})
                </h3>
                <div className="text-sm text-green-800 space-y-1">
                  {['NAS', 'RRC', 'PDCP', 'RLC', 'MAC', 'PHY'].map(layer => {
                    const count = messagesByLayer[layer]?.filter(m => m.direction === 'DL').length || 0;
                    return (
                      <div key={layer} className="flex justify-between">
                        <span>{layer}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Message Trace */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Live Message Trace ({layerMessages.length} messages)
              </h3>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {layerMessages.slice(-20).reverse().map((msg, index) => (
                  <div key={msg.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded border">
                    <div className="text-xs text-gray-500 font-mono w-16">
                      {msg.timestamp}
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      msg.direction === 'UL' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                          {msg.layer}
                        </span>
                        <span className="text-sm font-medium">{msg.messageName}</span>
                        <span className="text-xs text-gray-500">({msg.messageType})</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {msg.direction} • {msg.protocol}
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
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <ArrowUp className="w-4 h-4 mr-2" />
                Uplink Messages
              </h3>
              <div className="text-sm text-blue-800">
                PHY → MAC → RLC → PDCP → RRC → NAS
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                <ArrowDown className="w-4 h-4 mr-2" />
                Downlink Messages
              </h3>
              <div className="text-sm text-green-800">
                NAS → RRC → PDCP → RLC → MAC → PHY
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2 flex items-center">
                <ArrowRight className="w-4 h-4 mr-2" />
                Cross-Layer Interactions
              </h3>
              <div className="text-sm text-purple-800">
                Real-time cross-layer message correlation and timing analysis
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-green-800">
            <strong>✅ Layer Trace Ready:</strong> {layerMessages.length > 0 
              ? `Showing real-time protocol layer message flows from ${executionId ? 'active' : 'recent'} test execution.`
              : 'This view will show real-time protocol layer message flows and cross-layer interactions when test cases are executing.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}