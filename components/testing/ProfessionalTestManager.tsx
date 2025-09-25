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
  AlertTriangle
} from 'lucide-react';

const ProfessionalTestManager: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState('enodeb');
  const [selectedTestSuite, setSelectedTestSuite] = useState<string | null>(null);
  const [selectedTests, setSelectedTests] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [filteredTestCases, setFilteredTestCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(500);
  const [logs, setLogs] = useState([
    { timestamp: '2024-01-18 00:40:15', level: 'INFO', message: 'Initializing RAN-Core Test Manager' },
    { timestamp: '2024-01-18 00:40:16', level: 'INFO', message: 'Loading component configurations' },
    { timestamp: '2024-01-18 00:40:17', level: 'INFO', message: 'Preparing test environment' }
  ]);
  const [testCases, setTestCases] = useState<any[]>([]);

  // RAN Components
  const ranComponents = [
    { id: 'enodeb', name: 'eNodeB', status: 'active', color: 'green' },
    { id: 'gnodeb', name: 'gNodeB', status: 'active', color: 'green' },
    { id: 'core', name: 'Core Network', status: 'active', color: 'green' }
  ];

  // Test Suites Categories - Dynamic based on loaded test cases from Supabase
  const getTestSuites = () => {
    // Helper function to categorize test cases
    const categorizeTestCase = (testCase: any) => {
      const category = testCase.category?.toUpperCase() || '';
      const name = testCase.name?.toUpperCase() || '';
      const description = testCase.description?.toUpperCase() || '';
      
      // Check for 5G NR
      if (category.includes('5G') || category.includes('NR') || 
          name.includes('5G') || name.includes('NR') ||
          description.includes('5G') || description.includes('NR')) {
        return '5G_NR';
      }
      
      // Check for 4G LTE
      if (category.includes('4G') || category.includes('LTE') || 
          name.includes('4G') || name.includes('LTE') ||
          description.includes('4G') || description.includes('LTE')) {
        return '4G_LTE';
      }
      
      // Check for Core Network
      if (category.includes('CORE') || category.includes('AMF') || category.includes('SMF') || 
          category.includes('UPF') || category.includes('AUSF') || category.includes('UDM') ||
          name.includes('CORE') || name.includes('AMF') || name.includes('SMF') ||
          description.includes('CORE') || description.includes('AMF') || description.includes('SMF')) {
        return 'CORE_NETWORK';
      }
      
      // Check for Call Flows
      if (category.includes('CALL') || category.includes('FLOW') || category.includes('SIP') || 
          category.includes('IMS') || category.includes('VOICE') || category.includes('VIDEO') ||
          category.includes('VOLTE') || category.includes('VONR') ||
          name.includes('CALL') || name.includes('FLOW') || name.includes('SIP') ||
          name.includes('IMS') || name.includes('VOICE') || name.includes('VIDEO') ||
          description.includes('CALL') || description.includes('FLOW') || description.includes('SIP')) {
        return 'CALL_FLOWS';
      }
      
      return 'OTHER';
    };

    // Helper function to get subcategory
    const getSubcategory = (testCase: any, mainCategory: string) => {
      const category = testCase.category?.toUpperCase() || '';
      const name = testCase.name?.toUpperCase() || '';
      const description = testCase.description?.toUpperCase() || '';
      
      if (mainCategory === '5G_NR' || mainCategory === '4G_LTE') {
        // Check for Functional
        if (category.includes('FUNCTIONAL') || name.includes('FUNCTIONAL') || 
            description.includes('FUNCTIONAL') || category.includes('ATTACH') ||
            category.includes('CONNECTIVITY') || name.includes('ATTACH') ||
            name.includes('CONNECTIVITY')) {
          return 'FUNCTIONAL';
        }
        
        // Check for Performance
        if (category.includes('PERFORMANCE') || name.includes('PERFORMANCE') || 
            description.includes('PERFORMANCE') || category.includes('THROUGHPUT') ||
            category.includes('LATENCY') || name.includes('THROUGHPUT') ||
            name.includes('LATENCY')) {
          return 'PERFORMANCE';
        }
        
        // Check for Mobility
        if (category.includes('MOBILITY') || name.includes('MOBILITY') || 
            description.includes('MOBILITY') || category.includes('HANDOVER') ||
            category.includes('HANDOFF') || name.includes('HANDOVER') ||
            name.includes('HANDOFF')) {
          return 'MOBILITY';
        }
        
        // Check for RF
        if (category.includes('RF') || name.includes('RF') || 
            description.includes('RF') || category.includes('RADIO') ||
            category.includes('BEAM') || name.includes('RADIO') ||
            name.includes('BEAM')) {
          return 'RF';
        }
        
        // Default to Functional if no specific match
        return 'FUNCTIONAL';
      }
      
      return 'GENERAL';
    };

    // Group test cases by main category and subcategory
    const categorizedTestCases: any = {
      '5G_NR': { FUNCTIONAL: [], PERFORMANCE: [], MOBILITY: [], RF: [] },
      '4G_LTE': { FUNCTIONAL: [], PERFORMANCE: [], MOBILITY: [], RF: [] },
      'CORE_NETWORK': { GENERAL: [] },
      'CALL_FLOWS': { GENERAL: [] },
      'OTHER': { GENERAL: [] }
    };

    // Categorize all test cases
    testCases.forEach((testCase: any) => {
      const mainCategory = categorizeTestCase(testCase);
      const subcategory = getSubcategory(testCase, mainCategory);
      
      if (categorizedTestCases[mainCategory] && categorizedTestCases[mainCategory][subcategory]) {
        categorizedTestCases[mainCategory][subcategory].push(testCase);
      } else if (categorizedTestCases[mainCategory]) {
        categorizedTestCases[mainCategory].GENERAL = categorizedTestCases[mainCategory].GENERAL || [];
        categorizedTestCases[mainCategory].GENERAL.push(testCase);
      }
    });

    // Build test suites structure
    const testSuites: any[] = [];

    // 5G NR Test Suite
    if (categorizedTestCases['5G_NR'].FUNCTIONAL.length > 0 || 
        categorizedTestCases['5G_NR'].PERFORMANCE.length > 0 || 
        categorizedTestCases['5G_NR'].MOBILITY.length > 0 || 
        categorizedTestCases['5G_NR'].RF.length > 0) {
      
      const total5GNR = categorizedTestCases['5G_NR'].FUNCTIONAL.length + 
                       categorizedTestCases['5G_NR'].PERFORMANCE.length + 
                       categorizedTestCases['5G_NR'].MOBILITY.length + 
                       categorizedTestCases['5G_NR'].RF.length;
      
      testSuites.push({
        id: '5g-nr',
        name: '5G NR',
        totalCount: total5GNR,
        expanded: true,
        children: [
          {
            id: '5g-functional',
            name: 'Functional',
            count: categorizedTestCases['5G_NR'].FUNCTIONAL.length,
            testCases: categorizedTestCases['5G_NR'].FUNCTIONAL
          },
          {
            id: '5g-performance',
            name: 'Performance',
            count: categorizedTestCases['5G_NR'].PERFORMANCE.length,
            testCases: categorizedTestCases['5G_NR'].PERFORMANCE
          },
          {
            id: '5g-mobility',
            name: 'Mobility',
            count: categorizedTestCases['5G_NR'].MOBILITY.length,
            testCases: categorizedTestCases['5G_NR'].MOBILITY
          },
          {
            id: '5g-rf',
            name: 'RF',
            count: categorizedTestCases['5G_NR'].RF.length,
            testCases: categorizedTestCases['5G_NR'].RF
          }
        ]
      });
    }

    // 4G LTE Test Suite
    if (categorizedTestCases['4G_LTE'].FUNCTIONAL.length > 0 || 
        categorizedTestCases['4G_LTE'].PERFORMANCE.length > 0 || 
        categorizedTestCases['4G_LTE'].MOBILITY.length > 0 || 
        categorizedTestCases['4G_LTE'].RF.length > 0) {
      
      const total4GLTE = categorizedTestCases['4G_LTE'].FUNCTIONAL.length + 
                        categorizedTestCases['4G_LTE'].PERFORMANCE.length + 
                        categorizedTestCases['4G_LTE'].MOBILITY.length + 
                        categorizedTestCases['4G_LTE'].RF.length;
      
      testSuites.push({
        id: '4g-lte',
        name: '4G LTE',
        totalCount: total4GLTE,
        expanded: true,
        children: [
          {
            id: '4g-functional',
            name: 'Functional',
            count: categorizedTestCases['4G_LTE'].FUNCTIONAL.length,
            testCases: categorizedTestCases['4G_LTE'].FUNCTIONAL
          },
          {
            id: '4g-performance',
            name: 'Performance',
            count: categorizedTestCases['4G_LTE'].PERFORMANCE.length,
            testCases: categorizedTestCases['4G_LTE'].PERFORMANCE
          },
          {
            id: '4g-mobility',
            name: 'Mobility',
            count: categorizedTestCases['4G_LTE'].MOBILITY.length,
            testCases: categorizedTestCases['4G_LTE'].MOBILITY
          },
          {
            id: '4g-rf',
            name: 'RF',
            count: categorizedTestCases['4G_LTE'].RF.length,
            testCases: categorizedTestCases['4G_LTE'].RF
          }
        ]
      });
    }

    // Core Network Test Suite
    if (categorizedTestCases['CORE_NETWORK'].GENERAL.length > 0) {
      testSuites.push({
        id: 'core-network',
        name: 'Core Network',
        totalCount: categorizedTestCases['CORE_NETWORK'].GENERAL.length,
        expanded: false,
        children: [
          {
            id: 'core-general',
            name: 'Core Network',
            count: categorizedTestCases['CORE_NETWORK'].GENERAL.length,
            testCases: categorizedTestCases['CORE_NETWORK'].GENERAL
          }
        ]
      });
    }

    // Call Flows Test Suite
    if (categorizedTestCases['CALL_FLOWS'].GENERAL.length > 0) {
      testSuites.push({
        id: 'call-flows',
        name: 'Call Flows',
        totalCount: categorizedTestCases['CALL_FLOWS'].GENERAL.length,
        expanded: true,
        children: [
          {
            id: 'call-flows-general',
            name: 'Call Flows',
            count: categorizedTestCases['CALL_FLOWS'].GENERAL.length,
            testCases: categorizedTestCases['CALL_FLOWS'].GENERAL
          }
        ]
      });
    }

    // Other Test Suite (only if there are uncategorized test cases)
    if (categorizedTestCases['OTHER'].GENERAL.length > 0) {
      testSuites.push({
        id: 'other',
        name: 'Other',
        totalCount: categorizedTestCases['OTHER'].GENERAL.length,
        expanded: false,
        children: [
          {
            id: 'other-general',
            name: 'Other',
            count: categorizedTestCases['OTHER'].GENERAL.length,
            testCases: categorizedTestCases['OTHER'].GENERAL
          }
        ]
      });
    }

    return testSuites;
  };

  // Fetch test cases from Supabase
  const fetchTestCases = async () => {
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
        setTestCases(testCasesData);
        setFilteredTestCases(testCasesData.slice(0, displayLimit));
        addLog('INFO', `Loaded ${testCasesData.length} test cases from Supabase (Total: ${result.total || testCasesData.length})`);
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

  // Load more test cases
  const loadMoreTestCases = () => {
    const newLimit = displayLimit + 100;
    setDisplayLimit(newLimit);
    setFilteredTestCases(testCases.slice(0, newLimit));
    addLog('INFO', `Displaying ${Math.min(newLimit, testCases.length)} of ${testCases.length} test cases`);
  };

  // Add log entry
  const addLog = (level: string, message: string) => {
    const timestamp = new Date().toLocaleString();
    setLogs(prev => [{ timestamp, level, message }, ...prev.slice(0, 99)]);
  };

  // Handle test suite selection
  const handleTestSuiteSelect = (suiteId: string) => {
    setSelectedTestSuite(suiteId);
    const testSuites = getTestSuites();
    const suite = testSuites.find(s => s.id === suiteId);
    if (suite) {
      addLog('INFO', `Selected test suite: ${suite.name}`);
    }
  };

  // Handle test case selection
  const handleTestCaseSelect = (testCase: any) => {
    setSelectedTests(prev => {
      const isSelected = prev.some(t => t.id === testCase.id);
      if (isSelected) {
        addLog('INFO', `Deselected test case: ${testCase.name}`);
        return prev.filter(t => t.id !== testCase.id);
      } else {
        addLog('INFO', `Selected test case: ${testCase.name}`);
        return [...prev, testCase];
      }
    });
  };

  // Handle run test
  const handleRunTest = async (testId: string) => {
    setIsRunning(true);
    addLog('INFO', `Starting test execution for test case: ${testId}`);
    
    try {
      const response = await fetch('/api/test-execution/enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testCaseId: testId,
          userId: 'user-1',
          executionMode: 'comprehensive',
          configuration: {},
          timeAcceleration: 1.0,
          logLevel: 'detailed',
          captureMode: 'full'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      addLog('INFO', `Test execution API called successfully: ${result.executionId}`);
      
      // Send data to 5GLabX Platform via custom event
      const testExecutionEvent = new CustomEvent('testCaseExecutionStarted', {
        detail: {
          executionId: result.executionId,
          testCaseId: testId,
          testCaseData: {
            id: testId,
            name: testCases.find(tc => tc.id === testId)?.name || 'Unknown Test',
            component: testCases.find(tc => tc.id === testId)?.component || 'Unknown Component',
            expectedLayerParameters: [
              { layer: 'PHY', parameter: 'RSRP', value: '-80 dBm' },
              { layer: 'MAC', parameter: 'CQI', value: '15' },
              { layer: 'RLC', parameter: 'PDU Size', value: '1500 bytes' }
            ]
          },
          timestamp: new Date().toISOString()
        }
      });
      
      window.dispatchEvent(testExecutionEvent);
      addLog('INFO', 'Test execution data sent to 5GLabX Platform');
      
    } catch (error) {
      console.error('Error running test:', error);
      addLog('ERROR', `Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Load test cases on component mount
  useEffect(() => {
    fetchTestCases();
  }, []);

  const testSuites = getTestSuites();

  return (
    <div className="h-full flex bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Professional Test Manager</h2>
          <p className="text-sm text-gray-600">RAN-Core Testing Platform</p>
        </div>

        {/* RAN Components */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">RAN Components</h3>
          <div className="space-y-2">
            {ranComponents.map((component) => (
              <div
                key={component.id}
                onClick={() => setSelectedComponent(component.id)}
                className={`p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedComponent === component.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{component.name}</span>
                  <div className={`w-2 h-2 rounded-full bg-${component.color}-500`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Suites */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Test Suites</h3>
            <div className="space-y-1">
              {testSuites.map((suite) => (
                <div key={suite.id}>
                  <div
                    onClick={() => handleTestSuiteSelect(suite.id)}
                    className={`p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedTestSuite === suite.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{suite.name}</span>
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {suite.totalCount}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subcategories */}
                  {suite.children && suite.children.map((child: any) => (
                    <div key={child.id} className="ml-4 mt-1">
                      <div
                        onClick={() => handleTestSuiteSelect(child.id)}
                        className={`p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedTestSuite === child.id
                            ? 'bg-green-50 border border-green-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{child.name}</span>
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            {child.count}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Test Cases Management */}
        <div className="flex-1 bg-white border-b border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Test Cases Management</h3>
              <div className="flex items-center space-x-2">
                {isLoading && <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />}
                <span className="text-sm text-gray-600">
                  {filteredTestCases.length} of {testCases.length} test cases
                </span>
              </div>
            </div>
          </div>

          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
                  <p className="text-gray-600">Loading test cases from Supabase...</p>
                </div>
              </div>
            ) : filteredTestCases.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Database className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No test cases found</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTestCases.map((testCase) => (
                  <div
                    key={testCase.id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{testCase.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{testCase.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">Category: {testCase.category}</span>
                          <span className="text-xs text-gray-500">Component: {testCase.component}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRunTest(testCase.id)}
                        disabled={isRunning}
                        className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                      >
                        <Play className="w-3 h-3" />
                        <span>Run</span>
                      </button>
                    </div>
                  </div>
                ))}
                
                {testCases.length > displayLimit && (
                  <div className="text-center pt-4">
                    <button
                      onClick={loadMoreTestCases}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      Load More Test Cases
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Automation Log */}
        <div className="h-64 bg-gray-900 text-green-400 font-mono text-sm overflow-y-auto">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-white">Automation Log</h3>
          </div>
          <div className="p-4 space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-gray-500 text-xs">{log.timestamp}</span>
                <span className={`text-xs font-medium ${
                  log.level === 'ERROR' ? 'text-red-400' :
                  log.level === 'WARN' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  [{log.level}]
                </span>
                <span className="text-green-400">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTestManager;