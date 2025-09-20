'use client';

import React, { useState, useEffect } from 'react';

/**
 * SimpleDataDisplay - Direct, simple display of Test Manager data
 * No complex services, just direct data display
 */
const SimpleDataDisplay: React.FC = () => {
  const [testData, setTestData] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    console.log('🔥 SimpleDataDisplay: Starting simple data display...');

    // Listen for ANY Test Manager data
    const handleAnyTestData = (event: any) => {
      console.log('🔥 SimpleDataDisplay: Event received:', event.type, event.data || event.detail);
      
      let data = null;
      if (event.data && event.data.type === '5GLABX_TEST_EXECUTION') {
        data = event.data;
      } else if (event.detail) {
        data = { type: 'CustomEvent', ...event.detail };
      }

      if (data) {
        console.log('🔥 SimpleDataDisplay: Processing data:', data);
        setTestData(prev => [{ timestamp: new Date(), ...data }, ...prev.slice(0, 9)]);

        // If it has test case data, create logs
        if (data.testCaseData && data.testCaseData.expectedMessages) {
          console.log('🔥 SimpleDataDisplay: Creating logs from messages...');
          const newLogs = data.testCaseData.expectedMessages.map((msg: any, idx: number) => ({
            id: Date.now() + idx,
            timestamp: new Date().toLocaleTimeString(),
            layer: msg.layer || 'UNKNOWN',
            message: msg.messageName || msg.messageType || 'Unknown Message',
            direction: msg.direction || 'UL',
            payload: JSON.stringify(msg.messagePayload || {}),
            source: 'TestManager'
          }));
          
          setLogs(prev => [...newLogs, ...prev.slice(0, 19)]);
          console.log(`🔥 SimpleDataDisplay: Added ${newLogs.length} log entries`);
        }
      }
    };

    if (typeof window !== 'undefined') {
      // Listen to ALL possible events
      window.addEventListener('message', handleAnyTestData);
      window.addEventListener('testCaseExecutionStarted', handleAnyTestData);
      window.addEventListener('5glabxLogAnalysis', handleAnyTestData);
      window.addEventListener('5glabxDirectDataInjection', handleAnyTestData);
      
      console.log('🔥 SimpleDataDisplay: All event listeners registered');
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', handleAnyTestData);
        window.removeEventListener('testCaseExecutionStarted', handleAnyTestData);
        window.removeEventListener('5glabxLogAnalysis', handleAnyTestData);
        window.removeEventListener('5glabxDirectDataInjection', handleAnyTestData);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Test Data Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">🔥 Simple Data Display</h3>
        
        {testData.length === 0 ? (
          <div className="text-blue-700">
            Waiting for Test Manager data... Run a test case to see data here.
          </div>
        ) : (
          <div className="space-y-2">
            {testData.map((data, index) => (
              <div key={index} className="bg-white p-3 rounded border">
                <div className="text-sm">
                  <div><strong>Time:</strong> {data.timestamp.toLocaleTimeString()}</div>
                  <div><strong>Type:</strong> {data.type}</div>
                  <div><strong>Test Case:</strong> {data.testCaseId}</div>
                  <div><strong>Messages:</strong> {data.testCaseData?.expectedMessages?.length || 0}</div>
                  <div><strong>Data Source:</strong> {data.dataSource || 'Unknown'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Simple Logs Display */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 Simple Logs</h3>
        
        {logs.length === 0 ? (
          <div className="text-gray-700">
            No log messages yet... Test case messages will appear here.
          </div>
        ) : (
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={log.id} className="bg-white p-2 rounded border text-sm font-mono">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">[{log.timestamp}]</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{log.layer}</span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{log.direction}</span>
                  <span className="flex-1">{log.message}</span>
                </div>
                {log.payload && log.payload !== '{}' && (
                  <div className="mt-1 text-xs text-gray-600 bg-gray-100 p-1 rounded">
                    Payload: {log.payload}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleDataDisplay;