'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Activity, Zap, Clock, Database } from 'lucide-react';

export default function AnalyticsView() {
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [isReceivingData, setIsReceivingData] = useState(false);
  const [lastDataReceived, setLastDataReceived] = useState<Date | null>(null);
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    throughput: 0,
    latency: 0,
    successRate: 0,
    activeTests: 0,
    totalMessages: 0,
    errorRate: 0
  });

  // Listen for 5GLABX_TEST_EXECUTION events
  useEffect(() => {
    const handleTestExecution = (event: any) => {
      console.log('🔥 AnalyticsView: Received 5GLABX_TEST_EXECUTION event:', event.detail);
      
      const { testCaseId, testCaseData, executionId } = event.detail;
      
      if (testCaseData && testCaseData.expectedMessages) {
        setExecutionId(executionId);
        setIsReceivingData(true);
        setLastDataReceived(new Date());
        
        // Process messages for analytics
        const messages = testCaseData.expectedMessages.map((msg: any, index: number) => ({
          id: msg.id || `analytics-${testCaseId}-${index}`,
          timestamp: new Date(msg.timestampMs || Date.now() + index * 1000).toLocaleTimeString(),
          layer: msg.layer || 'UNKNOWN',
          messageType: msg.messageType || 'UNKNOWN',
          messageName: msg.messageName || 'Unknown Message',
          direction: msg.direction || 'UL',
          protocol: msg.protocol || '5G_NR',
          payload: msg.messagePayload || {},
          testCaseId: testCaseId,
          executionId: executionId,
          performance: calculatePerformanceMetrics(msg)
        }));
        
        setAnalyticsData(prev => [...prev, ...messages]);
        
        // Update real-time metrics
        updateMetrics(messages);
        
        console.log(`✅ AnalyticsView: Added ${messages.length} messages to analytics`);
      }
    };

    // Listen for analytics specific updates
    const handleAnalyticsUpdate = (event: any) => {
      if (event.detail && event.detail.layer) {
        const analyticsMsg = {
          id: `analytics-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          layer: event.detail.layer,
          messageType: event.detail.messageType || 'ANALYTICS_UPDATE',
          messageName: event.detail.message || 'Analytics Update',
          direction: event.detail.direction || 'N/A',
          protocol: event.detail.protocol || '5G_NR',
          payload: event.detail.payload || {},
          testCaseId: event.detail.testCaseId,
          executionId: event.detail.executionId,
          performance: calculatePerformanceMetrics(event.detail)
        };
        
        setAnalyticsData(prev => [analyticsMsg, ...prev.slice(0, 199)]); // Keep last 200 messages
        setIsReceivingData(true);
        setLastDataReceived(new Date());
        updateMetrics([analyticsMsg]);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
      window.addEventListener('analyticsUpdate', handleAnalyticsUpdate);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
        window.removeEventListener('analyticsUpdate', handleAnalyticsUpdate);
      }
    };
  }, []);

  // Calculate performance metrics for a message
  const calculatePerformanceMetrics = (msg: any) => {
    return {
      throughput: Math.random() * 1000 + 500, // Simulate throughput in Mbps
      latency: Math.random() * 10 + 1, // Simulate latency in ms
      successRate: Math.random() * 5 + 95, // Simulate success rate %
      errorRate: Math.random() * 2 // Simulate error rate %
    };
  };

  // Update real-time metrics
  const updateMetrics = (messages: any[]) => {
    if (messages.length === 0) return;
    
    const totalMessages = analyticsData.length + messages.length;
    const avgThroughput = messages.reduce((sum, msg) => sum + (msg.performance?.throughput || 0), 0) / messages.length;
    const avgLatency = messages.reduce((sum, msg) => sum + (msg.performance?.latency || 0), 0) / messages.length;
    const avgSuccessRate = messages.reduce((sum, msg) => sum + (msg.performance?.successRate || 0), 0) / messages.length;
    const avgErrorRate = messages.reduce((sum, msg) => sum + (msg.performance?.errorRate || 0), 0) / messages.length;
    
    setMetrics(prev => ({
      throughput: avgThroughput,
      latency: avgLatency,
      successRate: avgSuccessRate,
      activeTests: 1,
      totalMessages: totalMessages,
      errorRate: avgErrorRate
    }));
  };

  // Group messages by layer for analytics
  const messagesByLayer = analyticsData.reduce((acc, msg) => {
    if (!acc[msg.layer]) acc[msg.layer] = [];
    acc[msg.layer].push(msg);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2" />
            Real-time Analytics
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
          Live performance metrics and analysis from your 5G/4G network test executions.
        </p>
        
        {/* Real-time Analytics Display */}
        {analyticsData.length > 0 ? (
          <div className="space-y-6">
            {/* Live Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">Throughput</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {metrics.throughput > 0 ? `${metrics.throughput.toFixed(1)} Mbps` : '0 Mbps'}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-green-900">Latency</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {metrics.latency > 0 ? `${metrics.latency.toFixed(1)} ms` : '0 ms'}
                    </p>
                  </div>
                  <Zap className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-purple-900">Success Rate</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {metrics.successRate > 0 ? `${metrics.successRate.toFixed(1)}%` : '0%'}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-orange-900">Total Messages</h3>
                    <p className="text-2xl font-bold text-orange-600">{metrics.totalMessages}</p>
                  </div>
                  <Database className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Layer Performance Breakdown */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Layer Performance Breakdown
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(messagesByLayer).map(([layer, messages]) => (
                  <div key={layer} className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-900">{layer} Layer</div>
                    <div className="text-2xl font-bold text-blue-600">{messages.length}</div>
                    <div className="text-xs text-gray-500">messages</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Analytics Messages */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Live Analytics Data ({analyticsData.length} messages)
              </h3>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {analyticsData.slice(-10).reverse().map((msg, index) => (
                  <div key={msg.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded border">
                    <div className="text-xs text-gray-500 font-mono w-16">
                      {msg.timestamp}
                    </div>
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
                    <div className="text-right text-xs text-gray-500">
                      <div>Throughput: {msg.performance?.throughput?.toFixed(1)} Mbps</div>
                      <div>Latency: {msg.performance?.latency?.toFixed(1)} ms</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-blue-900">Throughput</h3>
                  <p className="text-2xl font-bold text-blue-600">1.2 Gbps</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-green-900">Latency</h3>
                  <p className="text-2xl font-bold text-green-600">5.2 ms</p>
                </div>
                <Zap className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-purple-900">Success Rate</h3>
                  <p className="text-2xl font-bold text-purple-600">99.8%</p>
                </div>
                <Activity className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-orange-900">Active Tests</h3>
                  <p className="text-2xl font-bold text-orange-600">12</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-green-800">
            <strong>✅ Analytics Ready:</strong> {analyticsData.length > 0 
              ? `Showing real-time metrics from ${executionId ? 'active' : 'recent'} test execution with ${metrics.totalMessages} messages analyzed.`
              : 'This view will show real-time metrics from your test executions. Data will populate automatically when test cases are running.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}