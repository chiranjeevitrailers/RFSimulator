// Simple Direct Data View - Bypasses all complex services
// This component directly displays test execution data without any service dependencies

'use client';

import React, { useState, useEffect } from 'react';

interface TestLog {
  id: string;
  timestamp: string;
  level: string;
  component: string;
  message: string;
  type: string;
  source: string;
  testCaseId: string;
  direction: string;
  protocol: string;
  rawData?: string;
  informationElements?: any;
  layerParameters?: any;
}

const SimpleDirectDataView: React.FC = () => {
  const [logs, setLogs] = useState<TestLog[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [testCaseData, setTestCaseData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Sample test data for immediate testing
  const sampleTestData = {
    testCaseId: 'simple-direct-test',
    testCaseData: {
      id: 'simple-direct-test',
      name: 'Simple Direct Data Test',
      description: 'Test case with direct data display',
      protocol: '5G_NR',
      category: '5G_NR',
      expectedMessages: [
        {
          id: 'simple_msg_1',
          stepOrder: 1,
          timestampMs: Date.now(),
          direction: 'UL',
          layer: 'RRC',
          protocol: '5G_NR',
          messageType: 'RRCSetupRequest',
          messageName: 'RRC Setup Request',
          messageDescription: 'Simple direct test message',
          messagePayload: {
            rrc_TransactionIdentifier: 1,
            establishmentCause: 'mo_Signalling'
          },
          informationElements: {
            'RRC Transaction Identifier': { type: 'INTEGER', value: 1 },
            'Establishment Cause': { type: 'ENUMERATED', value: 'mo-Signalling' }
          },
          layerParameters: {
            'Protocol': { value: 'RRC', reference: 'TS 38.331' }
          },
          standardReference: 'TS 38.331'
        },
        {
          id: 'simple_msg_2',
          stepOrder: 2,
          timestampMs: Date.now() + 1000,
          direction: 'DL',
          layer: 'RRC',
          protocol: '5G_NR',
          messageType: 'RRCSetup',
          messageName: 'RRC Setup',
          messageDescription: 'Simple direct test message 2',
          messagePayload: {
            rrc_TransactionIdentifier: 1,
            radioBearerConfig: {}
          },
          informationElements: {
            'RRC Transaction Identifier': { type: 'INTEGER', value: 1 },
            'Radio Bearer Config': { type: 'SEQUENCE', value: 'Present' }
          },
          layerParameters: {
            'RRC Setup': { value: 'Success', reference: 'TS 38.331' }
          },
          standardReference: 'TS 38.331'
        }
      ]
    },
    source: 'SimpleDirectView',
    timestamp: Date.now()
  };

  // Convert test case data to log format - handles correct API response structure
  const convertToLogs = (data: any): TestLog[] => {
    // Handle the correct API response structure: { success: true, data: { expectedMessages: [...] } }
    let messages = [];

    if (data.success && data.data?.expectedMessages) {
      // Correct API response structure: { success: true, data: { expectedMessages: [...] } }
      messages = data.data.expectedMessages;
      testCaseInfo = data.data.testCase || {};
      console.log('✅ Using correct API structure: data.data.expectedMessages');
    } else if (data.data?.testCase?.expectedMessages) {
      // Alternative structure: data.data.testCase.expectedMessages
      messages = data.data.testCase.expectedMessages;
      testCaseInfo = data.data.testCase || {};
      console.log('✅ Using alternative structure: data.data.testCase.expectedMessages');
    } else if (data.testCaseData?.expectedMessages) {
      // Fallback for old structure
      messages = data.testCaseData.expectedMessages;
      testCaseInfo = data.testCaseData || {};
      console.log('✅ Using fallback structure: data.testCaseData.expectedMessages');
    } else if (data.expectedMessages) {
      // Direct access fallback
      messages = data.expectedMessages;
      testCaseInfo = {};
      console.log('✅ Using direct access: data.expectedMessages');
    } else {
      console.warn('No expectedMessages found in data structure. Available keys:', Object.keys(data));
      if (data.data) {
        console.warn('Available keys in data:', Object.keys(data.data));
      }
      return [];
    }

    console.log(`✅ Found ${messages.length} messages to convert to logs`);

    return messages.map((msg: any, index: number) => ({
      id: `direct-${Date.now()}-${index}`,
      timestamp: (Date.now() / 1000).toFixed(1),
      level: 'I',
      component: msg.layer || 'TEST',
      message: `${msg.messageName}: ${JSON.stringify(msg.messagePayload || {}, null, 2)}`,
      type: msg.messageType || 'TEST_MESSAGE',
      source: 'DirectInjection',
      testCaseId: data.testCaseId || data.data?.testCase?.id || 'unknown',
      direction: msg.direction || 'UL',
      protocol: msg.protocol || '5G_NR',
      rawData: JSON.stringify(msg.messagePayload || {}, null, 2),
      informationElements: msg.informationElements || {},
      layerParameters: msg.layerParameters || {}
    }));
  };

  // Direct data loading function
  const loadTestData = (data: any) => {
    const newLogs = convertToLogs(data);
    setLogs(prev => [...prev, ...newLogs]);
    setTestCaseData(data.testCaseData);
    setLastUpdate(new Date().toLocaleTimeString());

    // Show visual indicator
    showDataIndicator(newLogs.length);
  };

  // Show visual indicator
  const showDataIndicator = (logCount: number) => {
    // Remove existing indicators
    const existing = document.querySelectorAll('.data-indicator');
    existing.forEach(el => el.remove());

    // Create indicator
    const indicator = document.createElement('div');
    indicator.className = 'data-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      background: #00ff00;
      color: black;
      padding: 20px;
      border-radius: 10px;
      font-family: monospace;
      font-size: 14px;
      z-index: 99999;
      max-width: 500px;
      word-wrap: break-word;
      box-shadow: 0 0 20px rgba(0,255,0,0.8);
    `;
    indicator.innerHTML = `
      <strong>✅ DIRECT DATA LOADED</strong><br>
      Test Case: ${testCaseData?.name || 'Unknown'}<br>
      Logs: ${logCount}<br>
      Time: ${new Date().toLocaleTimeString()}<br>
      Status: DATA VISIBLE
    `;

    document.body.appendChild(indicator);

    // Remove after 10 seconds
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    }, 10000);
  };

  // Event listeners for all possible data events
  useEffect(() => {
    const handleImmediateLogsUpdate = (event: CustomEvent) => {
      console.log('📡 Received immediate-logs-update:', event.detail);
      if (event.detail.logs) {
        setLogs(prev => [...prev, ...event.detail.logs]);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    };

    const handle5GLabXTestExecution = (event: CustomEvent) => {
      console.log('📡 Received 5GLABX_TEST_EXECUTION:', event.detail);
      if (event.detail.logs) {
        setLogs(prev => [...prev, ...event.detail.logs]);
        setTestCaseData(event.detail.testCaseData);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    };

    const handleLogsUpdate = (event: CustomEvent) => {
      console.log('📡 Received logs-update:', event.detail);
      if (event.detail.logs) {
        setLogs(prev => [...prev, ...event.detail.logs]);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    };

    const handleTestDataUpdate = (event: CustomEvent) => {
      console.log('📡 Received test-data-update:', event.detail);
      if (event.detail.logs) {
        setLogs(prev => [...prev, ...event.detail.logs]);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    };

    // Add event listeners
    window.addEventListener('immediate-logs-update', handleImmediateLogsUpdate as EventListener);
    window.addEventListener('5GLABX_TEST_EXECUTION', handle5GLabXTestExecution as EventListener);
    window.addEventListener('logs-update', handleLogsUpdate as EventListener);
    window.addEventListener('test-data-update', handleTestDataUpdate as EventListener);

    // Set up connection status
    setIsConnected(true);

    // Load sample data immediately
    setTimeout(() => {
      loadTestData(sampleTestData);
    }, 100);

    // Cleanup
    return () => {
      window.removeEventListener('immediate-logs-update', handleImmediateLogsUpdate as EventListener);
      window.removeEventListener('5GLABX_TEST_EXECUTION', handle5GLabXTestExecution as EventListener);
      window.removeEventListener('logs-update', handleLogsUpdate as EventListener);
      window.removeEventListener('test-data-update', handleTestDataUpdate as EventListener);
    };
  }, []);

  // Manual test functions
  const testManualInjection = () => {
    const manualLogs: TestLog[] = [
      {
        id: `manual-${Date.now()}-1`,
        timestamp: (Date.now() / 1000).toFixed(1),
        level: 'I',
        component: 'MANUAL_TEST',
        message: `Manual injection test: ${new Date().toLocaleTimeString()}`,
        type: 'MANUAL_TEST',
        source: 'ManualTest',
        testCaseId: 'manual-test',
        direction: 'UL',
        protocol: '5G_NR'
      }
    ];
    setLogs(prev => [...prev, ...manualLogs]);
    setLastUpdate(new Date().toLocaleTimeString());
  };

  const clearLogs = () => {
    setLogs([]);
    setTestCaseData(null);
    setLastUpdate('');
  };

  const loadSampleData = async () => {
    try {
      console.log('📡 Loading real test case data from API...');

      const testCaseId = '2fac4988-2313-4197-bc7e-39d3a66f23c1';
      const response = await fetch(`/api/test-execution/simple?testCaseId=${testCaseId}`);

      if (response.ok) {
        const apiData = await response.json();
        console.log('✅ API data received:', {
          success: apiData.success,
          hasData: !!apiData.data,
          hasMessages: !!(apiData.data?.expectedMessages?.length),
          messageCount: apiData.data?.expectedMessages?.length || 0
        });

        // Use the real API data
        loadTestData(apiData);
      } else {
        console.warn('❌ API request failed, using sample data');
        loadTestData(sampleTestData);
      }
    } catch (error) {
      console.error('❌ Error loading API data:', error);
      loadTestData(sampleTestData);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🔥 Simple Direct Data View</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        This component bypasses all complex services and displays data directly.
      </p>

      {/* Status Bar */}
      <div style={{
        background: isConnected ? '#d4edda' : '#f8d7da',
        color: isConnected ? '#155724' : '#721c24',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '20px',
        border: `1px solid ${isConnected ? '#c3e6cb' : '#f5c6cb'}`
      }}>
        <strong>Status:</strong> {isConnected ? '✅ Connected' : '❌ Disconnected'} |
        <strong> Logs:</strong> {logs.length} |
        <strong> Last Update:</strong> {lastUpdate || 'None'}
      </div>

      {/* Control Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={testManualInjection}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          Manual Test Injection
        </button>
        <button
          onClick={loadSampleData}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          Load Sample Data
        </button>
        <button
          onClick={clearLogs}
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Clear Logs
        </button>
      </div>

      {/* Test Case Info */}
      {testCaseData && (
        <div style={{
          background: '#f8f9fa',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #dee2e6'
        }}>
          <h3>Test Case: {testCaseData.name}</h3>
          <p><strong>Description:</strong> {testCaseData.description}</p>
          <p><strong>Protocol:</strong> {testCaseData.protocol}</p>
          <p><strong>Messages:</strong> {testCaseData.expectedMessages?.length || 0}</p>
        </div>
      )}

      {/* Logs Display */}
      <div>
        <h3>📊 Direct Logs ({logs.length})</h3>
        {logs.length === 0 ? (
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '5px',
            textAlign: 'center',
            color: '#6c757d',
            border: '2px dashed #dee2e6'
          }}>
            No logs yet. Click "Manual Test Injection" or "Load Sample Data" to see logs appear immediately.
          </div>
        ) : (
          <div style={{
            maxHeight: '600px',
            overflowY: 'auto',
            border: '1px solid #dee2e6',
            borderRadius: '5px'
          }}>
            {logs.map((log, index) => (
              <div
                key={log.id}
                style={{
                  background: index % 2 === 0 ? '#f8f9fa' : 'white',
                  padding: '15px',
                  borderBottom: '1px solid #dee2e6',
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontWeight: 'bold', color: '#007bff' }}>
                    [{log.timestamp}] {log.component} - {log.type}
                  </span>
                  <span style={{ color: '#6c757d' }}>
                    {log.direction} {log.protocol}
                  </span>
                </div>
                <div style={{ color: '#495057', marginBottom: '5px' }}>
                  {log.message}
                </div>
                <div style={{ fontSize: '10px', color: '#6c757d' }}>
                  Source: {log.source} | TestCase: {log.testCaseId}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div style={{
        background: '#e9ecef',
        padding: '15px',
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        <h4>📝 How to Use:</h4>
        <ol>
          <li>This component displays data immediately without any service dependencies</li>
          <li>Click "Manual Test Injection" to add test logs instantly</li>
          <li>Look for green indicator showing "DIRECT DATA LOADED"</li>
          <li>Check browser console for detailed event logging</li>
          <li>If no data appears, the issue is in the event dispatching system</li>
        </ol>
      </div>
    </div>
  );
};

export default SimpleDirectDataView;