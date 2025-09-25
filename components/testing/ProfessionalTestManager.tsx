'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Square, 
  RefreshCw, 
  ChevronDown, 
  ChevronRight,
  Activity,
  BarChart3,
  Database,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Pause,
  Download,
  Eye
} from 'lucide-react';

// Professional Testing Platform - QXDM/Keysight-like Interface
const ProfessionalTestManager: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState('enodeb');
  const [selectedTestSuite, setSelectedTestSuite] = useState<string | null>(null);
  const [selectedTests, setSelectedTests] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [testCases, setTestCases] = useState<any[]>([]);
  const [filteredTestCases, setFilteredTestCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(500);
  const [logs, setLogs] = useState([
    { timestamp: '2024-01-18 00:40:15', level: 'INFO', message: 'Initializing RAN-Core Test Manager' },
    { timestamp: '2024-01-18 00:40:16', level: 'INFO', message: 'Loading component configurations' },
    { timestamp: '2024-01-18 00:40:17', level: 'INFO', message: 'Preparing test environment' }
  ]);

  // Test Suites Categories - Exact structure as requested
  const [testSuites, setTestSuites] = useState([
    {
      id: '5g-nr',
      name: '5G NR',
      totalCount: 450,
      expanded: true,
      children: [
        { id: '5g-functional', name: 'Functional', count: 200 },
        { id: '5g-performance', name: 'Performance', count: 150 },
        { id: '5g-mobility', name: 'Mobility', count: 75 },
        { id: '5g-rf', name: 'RF', count: 25 }
      ]
    },
    {
      id: '4g-lte',
      name: '4G LTE',
      totalCount: 600,
      expanded: false,
      children: [
        { id: '4g-functional', name: 'Functional', count: 300 },
        { id: '4g-performance', name: 'Performance', count: 200 },
        { id: '4g-mobility', name: 'Mobility', count: 80 },
        { id: '4g-rf', name: 'RF', count: 20 }
      ]
    },
    {
      id: 'core-network',
      name: 'Core Network',
      totalCount: 300,
      expanded: false,
      children: [
        { id: 'core-general', name: 'Core Network', count: 300 }
      ]
    },
    {
      id: 'call-flows',
      name: 'Call Flows',
      totalCount: 350,
      expanded: false,
      children: [
        { id: 'call-general', name: 'Call Flows', count: 350 }
      ]
    },
    {
      id: 'other',
      name: 'Other',
      totalCount: 100,
      expanded: false,
      children: [
        { id: 'other-general', name: 'Other', count: 100 }
      ]
    }
  ]);

  // Initialize Lucide icons and load data
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).lucide) {
      (window as any).lucide.createIcons();
    }
    
    // Load test cases from working API
    loadTestCasesFromAPI();
    // Connect to 5GLabX backend for real-time log analysis
    connectTo5GLabX();
  }, []);

  // Connect to working API endpoint to fetch all test cases
  const loadTestCasesFromAPI = async () => {
    setIsLoading(true);
    addLog('INFO', 'Fetching test cases from Supabase...');
    
    try {
      const response = await fetch('/api/test-cases/comprehensive/?limit=2000');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      const testCasesData = result.data || result;
      
      if (Array.isArray(testCasesData)) {
        // Transform API data to match our frontend structure
        const transformedTestCases = testCasesData.map(testCase => ({
          id: testCase.id,
          name: testCase.name,
          component: testCase.component || testCase.protocol,
          status: testCase.status || 'Not Started',
          iterations: testCase.iterations || 'Never',
          successRate: testCase.success_rate || 'N/A',
          lastRun: testCase.last_run || 'N/A',
          duration: testCase.duration || '',
          priority: testCase.priority || 'Medium',
          category: testCase.category,
          protocol: testCase.protocol,
          layer: testCase.layer,
          complexity: testCase.complexity,
          selected: false
        }));
        
        setTestCases(transformedTestCases);
        setFilteredTestCases(transformedTestCases.slice(0, displayLimit));
        addLog('INFO', `Loaded ${transformedTestCases.length} test cases from Supabase (Total: ${result.total || transformedTestCases.length})`);
      } else {
        addLog('ERROR', 'Invalid test cases data format');
      }
    } catch (error) {
      console.error('Error fetching test cases:', error);
      addLog('ERROR', `Failed to fetch test cases: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Connect to 5GLabX backend for real-time log analysis
  const connectTo5GLabX = () => {
    try {
      const ws = new WebSocket('ws://localhost:8080/5glabx/logs');
      
      ws.onopen = () => {
        addLog('INFO', 'Connected to 5GLabX backend for real-time log analysis');
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          addLog('INFO', `5GLabX Analysis: ${data.message || 'Real-time log update'}`);
        } catch (error) {
          addLog('INFO', `5GLabX Log: ${event.data}`);
        }
      };
      
      ws.onerror = (error) => {
        addLog('ERROR', '5GLabX WebSocket connection error');
      };
      
      ws.onclose = () => {
        addLog('WARN', '5GLabX WebSocket connection closed');
      };
      
      return ws;
    } catch (error) {
      addLog('ERROR', 'Failed to connect to 5GLabX backend');
      return null;
    }
  };

  const addLog = (level: string, message: string) => {
    const timestamp = new Date().toLocaleString();
    setLogs(prev => [...prev, { timestamp, level, message }]);
  };

  // Toggle test suite expansion
  const toggleTestSuite = (suiteId: string) => {
    setTestSuites(prev => prev.map(suite => 
      suite.id === suiteId ? { ...suite, expanded: !suite.expanded } : suite
    ));
  };

  // Run test using working API endpoint
  const handleRunTest = async (testId: string) => {
    setIsRunning(true);
    addLog('INFO', `Starting test execution: ${testId}`);
    
    try {
      // Use working API endpoint for test execution
      const response = await fetch('/api/test-execution/simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testCaseId: testId,
          userId: 'system'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Test execution failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      addLog('INFO', `Test execution started: ${testId}`);
      
      // Update test case status
      setTestCases(prev => prev.map(tc => 
        tc.id === testId ? { ...tc, status: 'Running' } : tc
      ));
      
      // Monitor test execution status
      monitorTestExecution(testId);
      
    } catch (error) {
      console.error('Error running test:', error);
      addLog('ERROR', `Failed to run test ${testId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsRunning(false);
      setTestCases(prev => prev.map(tc => 
        tc.id === testId ? { ...tc, status: 'Failed' } : tc
      ));
    }
  };

  // Monitor test execution using existing WebSocket/Streaming
  const monitorTestExecution = async (testId: string) => {
    try {
      const ws = new WebSocket(`ws://localhost:8080/test-execution/${testId}`);
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          addLog('INFO', `Test ${testId}: ${data.message || 'Status update'}`);
          
          if (data.status === 'completed') {
            setIsRunning(false);
            setTestCases(prev => prev.map(tc => 
              tc.id === testId ? { ...tc, status: 'Completed' } : tc
            ));
            ws.close();
          } else if (data.status === 'failed') {
            setIsRunning(false);
            setTestCases(prev => prev.map(tc => 
              tc.id === testId ? { ...tc, status: 'Failed' } : tc
            ));
            ws.close();
          }
        } catch (error) {
          addLog('INFO', `Test ${testId}: ${event.data}`);
        }
      };
      
      ws.onerror = (error) => {
        addLog('ERROR', `Test ${testId}: WebSocket connection error`);
      };
      
    } catch (error) {
      addLog('ERROR', `Failed to monitor test ${testId}`);
    }
  };

  // Get status badge styling
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Running': return 'bg-blue-100 text-blue-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority badge styling
  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get log level styling
  const getLogLevelStyle = (level: string) => {
    switch (level) {
      case 'ERROR': return 'bg-red-500 text-white';
      case 'WARN': return 'bg-yellow-500 text-white';
      case 'INFO': return 'bg-blue-500 text-white';
      case 'DEBUG': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="h-screen flex bg-gray-100" data-name="professional-testing-platform">
      {/* Left Sidebar */}
      <div className="w-80 bg-gray-800 text-white flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 p-4">
          <h1 className="text-lg font-bold text-white">Professional Test Manager</h1>
          <p className="text-sm text-blue-100">QXDM/Keysight-like Interface</p>
        </div>

        {/* Component Selection */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">RAN Components</h3>
          <div className="space-y-2">
            {[
              { id: 'enodeb', name: 'eNodeB', status: 'active', color: 'green' },
              { id: 'gnodeb', name: 'gNodeB', status: 'active', color: 'green' },
              { id: 'core', name: 'Core Network', status: 'active', color: 'green' }
            ].map(component => (
              <div
                key={component.id}
                className={`p-2 rounded cursor-pointer flex items-center justify-between ${
                  selectedComponent === component.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedComponent(component.id)}
              >
                <span className="text-sm">{component.name}</span>
                <div className={`w-2 h-2 rounded-full bg-${component.color}-500`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Suites Section */}
        <div className="p-4 flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-300">Test Suites</h3>
            <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700">
              + Add Test Suite
            </button>
          </div>
          <div className="space-y-1">
            {testSuites.map(suite => (
              <div key={suite.id} className="space-y-1">
                <div
                  className="flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-700"
                  onClick={() => toggleTestSuite(suite.id)}
                >
                  <div className="flex items-center space-x-2">
                    {suite.expanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">{suite.name}</span>
                    <span className="text-xs text-gray-400">[{suite.totalCount}]</span>
                  </div>
                  <span className="text-xs text-gray-400">({suite.totalCount})</span>
                </div>
                {suite.expanded && (
                  <div className="ml-6 space-y-1">
                    {suite.children.map(child => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between p-1 rounded cursor-pointer hover:bg-gray-700"
                        onClick={() => setSelectedTestSuite(child.id)}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-xs">├──</span>
                          <span className="text-xs">{child.name}</span>
                          <span className="text-xs text-gray-400">[{child.count}]</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Test Cases Management</h2>
              <p className="text-sm text-gray-600">Manage and execute test cases for {selectedComponent}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-2"
                onClick={() => loadTestCasesFromAPI()}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-2"
                disabled={isRunning || selectedTests.length === 0}
              >
                <Play className="w-4 h-4" />
                <span>Run Selected ({selectedTests.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Test Cases Table */}
        <div className="flex-1 bg-white m-4 rounded shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Iterations</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Run</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTestCases.map((testCase) => (
                  <tr key={testCase.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={testCase.selected}
                        onChange={(e) => {
                          const updated = testCase.selected ? 
                            selectedTests.filter(t => t.id !== testCase.id) :
                            [...selectedTests, testCase];
                          setSelectedTests(updated);
                          setTestCases(prev => prev.map(tc => 
                            tc.id === testCase.id ? { ...tc, selected: !tc.selected } : tc
                          ));
                        }}
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{testCase.name}</div>
                      <div className="text-sm text-gray-500">{testCase.category}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{testCase.component}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeStyle(testCase.status)}`}>
                        {testCase.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{testCase.iterations}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{testCase.successRate}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{testCase.lastRun}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{testCase.duration}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700"
                          onClick={() => handleRunTest(testCase.id)}
                          disabled={isRunning}
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button className="bg-gray-600 text-white p-1 rounded hover:bg-gray-700">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Automation Log Section */}
        <div className="bg-white p-4 m-4 rounded shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Automation Log</h2>
            <div className="flex items-center space-x-2">
              <button className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 flex items-center space-x-1">
                <Square className="w-4 h-4" />
                <span>Clear</span>
              </button>
              <button className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 flex items-center space-x-1">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm h-48 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start space-x-2 mb-1">
                <span className="text-gray-500">{log.timestamp}</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getLogLevelStyle(log.level)}`}>
                  {log.level}
                </span>
                <span className="text-gray-100">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTestManager;