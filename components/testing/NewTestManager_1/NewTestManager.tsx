'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  RefreshCw, 
  Database, 
  Settings, 
  FileText, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle,
  Activity,
  Users,
  Zap,
  Shield
} from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  description: string;
  technology: string;
  category: string;
  status: 'PASS' | 'FAIL' | 'RUNNING' | 'PENDING';
  duration?: number;
  lastRun?: Date;
}

interface TestExecution {
  id: string;
  testCaseId: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'STOPPED';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  logs: Array<{
    id: string;
    timestamp: string;
    level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
    message: string;
    component: string;
  }>;
}

const NewTestManager: React.FC = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>([]);
  const [currentExecution, setCurrentExecution] = useState<TestExecution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<Array<{
    id: string;
    timestamp: string;
    level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
    message: string;
    component: string;
  }>>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Load test cases from API
  useEffect(() => {
    const loadTestCases = async () => {
      setIsLoading(true);
      try {
        console.log('📡 Loading test cases from API...');
        const response = await fetch('/api/test-cases/comprehensive/?limit=50');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('✅ API response for test cases:', result);

        if (result.success && result.data && result.data.length > 0) {
          const loadedTestCases: TestCase[] = result.data.map((tc: any) => ({
            id: tc.id,
            name: tc.name || 'Unnamed Test Case',
            description: tc.description || 'No description available',
            technology: tc.technology || '5G_NR',
            category: tc.category || 'PROTOCOL',
            status: 'PENDING',
            lastRun: tc.updated_at ? new Date(tc.updated_at) : undefined
          }));
          setTestCases(loadedTestCases);
          console.log(`✅ Loaded ${loadedTestCases.length} test cases`);
        } else {
          console.warn('❌ No test cases found in API response');
        }
      } catch (error) {
        console.error('❌ Error loading test cases:', error);
        addLog('ERROR', 'TestManager', `Failed to load test cases: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadTestCases();
  }, []);

  const addLog = (level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', component: string, message: string) => {
    const newLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
      component
    };
    setLogs(prev => [newLog, ...prev.slice(0, 99)]); // Keep last 100 logs
    console.log(`[${level}] ${component}: ${message}`);
  };

  const handleRunTest = async () => {
    if (selectedTestCases.length === 0) {
      addLog('WARN', 'TestManager', 'No test cases selected');
      return;
    }

    const testCaseId = selectedTestCases[0]; // Run first selected test case
    const testCase = testCases.find(tc => tc.id === testCaseId);
    
    if (!testCase) {
      addLog('ERROR', 'TestManager', 'Selected test case not found');
      return;
    }

    addLog('INFO', 'TestManager', `Starting test execution: ${testCase.name}`);
    
    try {
      // Create execution record
      const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const execution: TestExecution = {
        id: executionId,
        testCaseId: testCaseId,
        status: 'RUNNING',
        startTime: new Date(),
        logs: []
      };
      setCurrentExecution(execution);
      setIsConnected(true);
      setLastUpdate(new Date());

      addLog('INFO', 'TestManager', `Execution ID: ${executionId}`);
      addLog('INFO', 'TestManager', `Test Case: ${testCase.name}`);
      addLog('INFO', 'TestManager', `Technology: ${testCase.technology}`);
      addLog('INFO', 'TestManager', `Category: ${testCase.category}`);

      // Call test execution API
      addLog('INFO', 'TestManager', 'Calling test execution API...');
      const response = await fetch('/api/test-execution/simple/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          testCaseId: testCaseId, 
          userId: 'test-user' 
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      addLog('INFO', 'TestManager', 'Test execution API response received');
      addLog('DEBUG', 'TestManager', `API Response: ${JSON.stringify(result, null, 2)}`);

      if (result.success && result.testCaseData) {
        addLog('INFO', 'TestManager', `Processing ${result.testCaseData.expectedMessages?.length || 0} messages`);
        
        // Dispatch event to 5GLabX platform
        const testExecutionEvent = new CustomEvent('5GLABX_TEST_EXECUTION', {
          detail: {
            type: '5GLABX_TEST_EXECUTION',
            executionId: executionId,
            testCaseId: testCaseId,
            testCaseData: result.testCaseData,
            timestamp: new Date().toISOString(),
            status: 'running'
          }
        });
        
        addLog('INFO', 'TestManager', 'Dispatching 5GLABX_TEST_EXECUTION event');
        window.dispatchEvent(testExecutionEvent);
        addLog('INFO', 'TestManager', 'Event dispatched successfully');

        // Simulate test completion
        setTimeout(() => {
          setCurrentExecution(prev => prev ? { ...prev, status: 'COMPLETED', endTime: new Date() } : null);
          addLog('INFO', 'TestManager', 'Test execution completed successfully');
        }, 5000);

      } else {
        addLog('ERROR', 'TestManager', 'Test execution API did not return valid data');
      }

    } catch (error) {
      addLog('ERROR', 'TestManager', `Test execution failed: ${error.message}`);
      setCurrentExecution(prev => prev ? { ...prev, status: 'FAILED', endTime: new Date() } : null);
    }
  };

  const handleStopTest = () => {
    if (currentExecution) {
      addLog('INFO', 'TestManager', 'Stopping test execution');
      setCurrentExecution(prev => prev ? { ...prev, status: 'STOPPED', endTime: new Date() } : null);
      
      // Dispatch stop event
      const stopEvent = new CustomEvent('5GLABX_TEST_STOP', {
        detail: {
          type: '5GLABX_TEST_STOP',
          executionId: currentExecution.id,
          timestamp: new Date().toISOString()
        }
      });
      window.dispatchEvent(stopEvent);
      addLog('INFO', 'TestManager', 'Test execution stopped');
    }
  };

  const handleTestCaseSelect = (testCaseId: string) => {
    setSelectedTestCases(prev => 
      prev.includes(testCaseId) 
        ? prev.filter(id => id !== testCaseId)
        : [...prev, testCaseId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS': return 'text-green-600';
      case 'FAIL': return 'text-red-600';
      case 'RUNNING': return 'text-blue-600';
      case 'COMPLETED': return 'text-green-600';
      case 'FAILED': return 'text-red-600';
      case 'STOPPED': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS': case 'COMPLETED': return CheckCircle;
      case 'FAIL': case 'FAILED': return XCircle;
      case 'RUNNING': return Clock;
      case 'STOPPED': return Square;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Test Manager</h1>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRunTest}
                disabled={selectedTestCases.length === 0 || currentExecution?.status === 'RUNNING'}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                <span>Run Test</span>
              </button>
              <button
                onClick={handleStopTest}
                disabled={!currentExecution || currentExecution.status !== 'RUNNING'}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Square className="w-4 h-4" />
                <span>Stop Test</span>
              </button>
            </div>
            {lastUpdate && (
              <span className="text-xs text-gray-500">
                Last: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Test Cases Panel */}
        <div className="w-1/2 border-r border-gray-200 bg-white">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Test Cases</h2>
            <p className="text-sm text-gray-600">{testCases.length} test cases loaded</p>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading test cases...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {testCases.map((testCase) => {
                  const StatusIcon = getStatusIcon(testCase.status);
                  return (
                    <div
                      key={testCase.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedTestCases.includes(testCase.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleTestCaseSelect(testCase.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{testCase.name}</h3>
                          <p className="text-sm text-gray-600">{testCase.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-500">{testCase.technology}</span>
                            <span className="text-xs text-gray-500">{testCase.category}</span>
                            {testCase.lastRun && (
                              <span className="text-xs text-gray-500">
                                Last run: {testCase.lastRun.toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <StatusIcon className={`w-4 h-4 ${getStatusColor(testCase.status)}`} />
                          {selectedTestCases.includes(testCase.id) && (
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Automation Log Panel */}
        <div className="w-1/2 bg-white">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Automation Log</h2>
              <button
                onClick={() => setLogs([])}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear
              </button>
            </div>
            <p className="text-sm text-gray-600">{logs.length} log entries</p>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {logs.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <FileText className="w-6 h-6 text-gray-400" />
                <span className="ml-2 text-gray-600">No logs yet</span>
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => {
                  const getLogColor = (level: string) => {
                    switch (level) {
                      case 'ERROR': return 'text-red-600';
                      case 'WARN': return 'text-yellow-600';
                      case 'INFO': return 'text-blue-600';
                      case 'DEBUG': return 'text-gray-600';
                      default: return 'text-gray-600';
                    }
                  };
                  
                  return (
                    <div key={log.id} className="p-2 bg-gray-50 rounded text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 font-mono">{log.timestamp}</span>
                        <span className={`text-xs font-medium ${getLogColor(log.level)}`}>
                          {log.level}
                        </span>
                        <span className="text-xs text-gray-600">{log.component}</span>
                      </div>
                      <p className="mt-1 text-gray-900">{log.message}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      {currentExecution && (
        <div className="bg-blue-50 border-t border-blue-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                Execution: {currentExecution.id}
              </span>
              <span className={`text-sm font-medium ${getStatusColor(currentExecution.status)}`}>
                Status: {currentExecution.status}
              </span>
              <span className="text-sm text-blue-700">
                Started: {currentExecution.startTime.toLocaleTimeString()}
              </span>
            </div>
            <div className="text-sm text-blue-700">
              Test Case: {testCases.find(tc => tc.id === currentExecution.testCaseId)?.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewTestManager;