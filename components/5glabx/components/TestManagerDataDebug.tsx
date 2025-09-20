'use client';

import React, { useState, useEffect } from 'react';

const TestManagerDataDebug: React.FC = () => {
  const [receivedData, setReceivedData] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const handleTestManagerData = (event: MessageEvent) => {
      if (event.data && event.data.type === '5GLABX_TEST_EXECUTION') {
        console.log('🔍 Debug: Test Manager data received:', event.data);
        const dataEntry = {
          timestamp: new Date(),
          testCaseId: event.data.testCaseId,
          runId: event.data.runId,
          messagesCount: event.data.testCaseData?.expectedMessages?.length || 0,
          iesCount: event.data.testCaseData?.expectedInformationElements?.length || 0,
          layerParamsCount: event.data.testCaseData?.expectedLayerParameters?.length || 0,
          testCaseName: event.data.testCaseData?.testCase?.name,
          dataSource: event.data.dataSource
        };
        
        setReceivedData(prev => [dataEntry, ...prev.slice(0, 9)]);
        setLastUpdate(new Date());
      }
    };

    const handleCustomEvents = (event: CustomEvent) => {
      console.log('🔍 Debug: Custom event received:', event.type, event.detail);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('message', handleTestManagerData);
      window.addEventListener('testCaseExecutionStarted', handleCustomEvents as EventListener);
      window.addEventListener('5glabxLogAnalysis', handleCustomEvents as EventListener);
      window.addEventListener('logsViewUpdate', handleCustomEvents as EventListener);
      console.log('✅ Debug: Event listeners registered');
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', handleTestManagerData);
        window.removeEventListener('testCaseExecutionStarted', handleCustomEvents as EventListener);
        window.removeEventListener('5glabxLogAnalysis', handleCustomEvents as EventListener);
        window.removeEventListener('logsViewUpdate', handleCustomEvents as EventListener);
      }
    };
  }, []);

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-yellow-800">🔍 Test Manager Data Debug</h3>
        <div className="text-sm text-yellow-600">
          {lastUpdate ? `Last: ${lastUpdate.toLocaleTimeString()}` : 'No data yet'}
        </div>
      </div>
      
      {receivedData.length === 0 ? (
        <div className="text-yellow-700 text-sm">
          Waiting for Test Manager data... Run a test case to see data flow.
        </div>
      ) : (
        <div className="space-y-2">
          {receivedData.map((data, index) => (
            <div key={index} className="bg-white p-3 rounded border text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Test Case:</strong> {data.testCaseName}</div>
                <div><strong>Source:</strong> {data.dataSource}</div>
                <div><strong>Messages:</strong> {data.messagesCount}</div>
                <div><strong>IEs:</strong> {data.iesCount}</div>
                <div><strong>Layer Params:</strong> {data.layerParamsCount}</div>
                <div><strong>Time:</strong> {data.timestamp.toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestManagerDataDebug;