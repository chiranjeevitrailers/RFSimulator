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
  Shield,
  FolderOpen,
  File,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  Radio,
  Wifi,
  Smartphone,
  Network,
  Layers,
  TestTube,
  Target,
  Monitor
} from 'lucide-react';
import { dataFlowManager, DataFlowEvent } from '@/utils/DataFlowManager';
import { testCaseManager, TestCase } from '@/utils/TestCaseManager';
import { testDataProcessor } from '@/utils/TestDataProcessor';

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

interface TestCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  testCases: TestCase[];
  isExpanded: boolean;
}

const NewTestManagerFileBased: React.FC = () => {
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
  const [dataFlowStatus, setDataFlowStatus] = useState<string>('disconnected');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTechnology, setFilterTechnology] = useState<string>('all');
  const [categories, setCategories] = useState<TestCategory[]>([]);

  // Initialize DataFlowManager
  useEffect(() => {
    const initializeDataFlow = () => {
      try {
        const unsubscribe = dataFlowManager.subscribe('ALL', (event: DataFlowEvent) => {
          console.log(`📡 TestManager received event: ${event.type} from ${event.source}`);
          addLog('INFO', 'DataFlow', `Received ${event.type} from ${event.source}`);
          setLastUpdate(new Date());
        });

        setDataFlowStatus('connected');
        addLog('INFO', 'DataFlow', 'DataFlowManager connected successfully');
        
        return unsubscribe;
      } catch (error) {
        console.error('❌ Error initializing DataFlowManager:', error);
        addLog('ERROR', 'DataFlow', `Failed to initialize DataFlowManager: ${error.message}`);
        setDataFlowStatus('error');
      }
    };

    const unsubscribe = initializeDataFlow();
    return unsubscribe;
  }, []);

  // Organize test cases by categories
  const organizeTestCasesByCategory = (testCases: TestCase[]): TestCategory[] => {
    const categoryMap = new Map<string, TestCase[]>();
    
    // Group test cases by category
    testCases.forEach(testCase => {
      const category = testCase.category || 'OTHER';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(testCase);
    });

    // Create category objects
    const categoryConfigs = {
      'CELL_SEARCH': { name: 'Cell Search', description: 'Cell search and synchronization procedures', icon: Radio, color: 'blue' },
      'POWER_ON': { name: 'Power On', description: 'UE power-on and initialization procedures', icon: Zap, color: 'green' },
      'ATTACH': { name: 'Attach', description: 'Network attachment procedures', icon: Network, color: 'purple' },
      'MOBILITY': { name: 'Mobility', description: 'Handover and mobility procedures', icon: Activity, color: 'orange' },
      'PERFORMANCE': { name: 'Performance', description: 'Performance and throughput tests', icon: BarChart3, color: 'red' },
      'SECURITY': { name: 'Security', description: 'Security and authentication tests', icon: Shield, color: 'yellow' },
      'PROTOCOL': { name: 'Protocol', description: 'Protocol layer specific tests', icon: Layers, color: 'indigo' },
      'UE_ANALYSIS': { name: 'UE Analysis', description: 'UE-specific analysis and monitoring', icon: Smartphone, color: 'pink' },
      'NETWORK_ANALYSIS': { name: 'Network Analysis', description: 'Network analysis and monitoring', icon: Monitor, color: 'teal' },
      'OTHER': { name: 'Other', description: 'Other test categories', icon: FileText, color: 'gray' }
    };

    return Array.from(categoryMap.entries()).map(([category, testCases]) => {
      const config = categoryConfigs[category as keyof typeof categoryConfigs] || categoryConfigs.OTHER;
      return {
        id: category,
        name: config.name,
        description: config.description,
        icon: config.icon,
        color: config.color,
        testCases,
        isExpanded: false
      };
    });
  };

  // Load test cases from files
  useEffect(() => {
    const loadTestCases = async () => {
      setIsLoading(true);
      try {
        console.log('📁 Loading test cases from files...');
        const loadedTestCases = await testCaseManager.listTestCases();
        setTestCases(loadedTestCases);
        addLog('INFO', 'TestManager', `Loaded ${loadedTestCases.length} test cases from files`);
        console.log(`✅ Loaded ${loadedTestCases.length} test cases from files`);

        // Organize test cases by categories
        const organizedCategories = organizeTestCasesByCategory(loadedTestCases);
        setCategories(organizedCategories);
      } catch (error) {
        console.error('❌ Error loading test cases:', error);
        addLog('ERROR', 'TestManager', `Failed to load test cases: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadTestCases();
  }, []);

  // Filter test cases based on search and technology
  const getFilteredTestCases = (category: TestCategory) => {
    return category.testCases.filter(testCase => {
      const matchesSearch = testCase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           testCase.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTechnology = filterTechnology === 'all' || testCase.technology === filterTechnology;
      return matchesSearch && matchesTechnology;
    });
  };

  // Get all test cases for selected category
  const getCurrentTestCases = () => {
    if (selectedCategory === 'all') {
      return testCases.filter(testCase => {
        const matchesSearch = testCase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             testCase.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTechnology = filterTechnology === 'all' || testCase.technology === filterTechnology;
        return matchesSearch && matchesTechnology;
      });
    }
    
    const category = categories.find(cat => cat.id === selectedCategory);
    return category ? getFilteredTestCases(category) : [];
  };

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, isExpanded: !cat.isExpanded } : cat
    ));
  };

  const addLog = (level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', component: string, message: string) => {
    const newLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
      component
    };
    setLogs(prev => [newLog, ...prev.slice(0, 99)]);
    console.log(`[${level}] ${component}: ${message}`);
  };

  const handleRunTest = async () => {
    if (selectedTestCases.length === 0) {
      addLog('WARN', 'TestManager', 'No test cases selected');
      return;
    }

    const testCaseId = selectedTestCases[0];
    const testCase = testCases.find(tc => tc.testCaseId === testCaseId);
    
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

      // Process test case using file-based system
      addLog('INFO', 'TestManager', 'Processing test case with file-based system...');
      const testResult = await testDataProcessor.processTestCase(testCase, executionId);
      
      // Save test result to files
      await testCaseManager.saveTestResult(executionId, testResult);
      addLog('INFO', 'TestManager', 'Test result saved to files');

      // Dispatch events to frontends
      addLog('INFO', 'DataFlow', 'Dispatching test execution events...');
      
      // Dispatch test execution started event
      dataFlowManager.dispatch({
        type: 'TEST_EXECUTION_STARTED',
        source: 'TEST_MANAGER',
        target: 'ALL',
        data: {
          executionId,
          testCaseId,
          testCase,
          testResult
        },
        timestamp: Date.now(),
        executionId,
        testCaseId
      });

      // Dispatch events for each test step
      for (const event of testResult.events) {
        dataFlowManager.dispatch({
          type: 'MESSAGE_TO_5GLABX',
          source: 'TEST_MANAGER',
          target: '5GLABX_PLATFORM',
          data: {
            ...event,
            executionId,
            testCaseId,
            messagePayload: event.data,
            informationElements: event.data,
            layerParameters: event.data
          },
          timestamp: event.timestamp,
          executionId,
          testCaseId
        });

        dataFlowManager.dispatch({
          type: 'MESSAGE_TO_UE_ANALYSIS',
          source: 'TEST_MANAGER',
          target: 'UE_ANALYSIS_PLATFORM',
          data: {
            ...event,
            executionId,
            testCaseId,
            messagePayload: event.data,
            informationElements: event.data,
            layerParameters: event.data
          },
          timestamp: event.timestamp,
          executionId,
          testCaseId
        });

        // Dispatch layer-specific events
        dataFlowManager.dispatch({
          type: `LAYER_${event.layer.toUpperCase()}_UPDATE` as DataFlowEvent['type'],
          source: 'TEST_MANAGER',
          target: event.layer,
          data: {
            ...event,
            executionId,
            testCaseId
          },
          timestamp: event.timestamp,
          executionId,
          testCaseId
        });
      }

      // Dispatch test execution completed event
      dataFlowManager.dispatch({
        type: 'TEST_EXECUTION_COMPLETED',
        source: 'TEST_MANAGER',
        target: 'ALL',
        data: {
          executionId,
          testCaseId,
          status: 'COMPLETED',
          endTime: new Date(),
          testResult
        },
        timestamp: Date.now(),
        executionId,
        testCaseId
      });

      setCurrentExecution(prev => prev ? { ...prev, status: 'COMPLETED', endTime: new Date() } : null);
      addLog('INFO', 'TestManager', 'Test execution completed successfully');

    } catch (error) {
      addLog('ERROR', 'TestManager', `Test execution failed: ${error.message}`);
      setCurrentExecution(prev => prev ? { ...prev, status: 'FAILED', endTime: new Date() } : null);
    }
  };

  const handleStopTest = () => {
    if (currentExecution) {
      addLog('INFO', 'TestManager', 'Stopping test execution');
      setCurrentExecution(prev => prev ? { ...prev, status: 'STOPPED', endTime: new Date() } : null);
      
      dataFlowManager.stopTestExecution(currentExecution.id);
      addLog('INFO', 'DataFlow', 'Test execution stopped via DataFlowManager');
      
      dataFlowManager.dispatch({
        type: 'TEST_EXECUTION_STOPPED',
        source: 'TEST_MANAGER',
        target: 'ALL',
        data: {
          executionId: currentExecution.id,
          testCaseId: currentExecution.testCaseId,
          status: 'STOPPED',
          endTime: new Date()
        },
        timestamp: Date.now(),
        executionId: currentExecution.id,
        testCaseId: currentExecution.testCaseId
      });
      
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
            <FolderOpen className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Test Manager (File-Based)</h1>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              dataFlowStatus === 'connected' ? 'bg-blue-100 text-blue-800' : 
              dataFlowStatus === 'error' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
            }`}>
              DataFlow: {dataFlowStatus}
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
            <h2 className="text-lg font-semibold text-gray-900">Test Cases (File-Based)</h2>
            <p className="text-sm text-gray-600">{testCases.length} test cases loaded from files</p>
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
                  const StatusIcon = getStatusIcon('PENDING');
                  return (
                    <div
                      key={testCase.testCaseId}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedTestCases.includes(testCase.testCaseId)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleTestCaseSelect(testCase.testCaseId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{testCase.name}</h3>
                          <p className="text-sm text-gray-600">{testCase.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-500">{testCase.technology}</span>
                            <span className="text-xs text-gray-500">{testCase.category}</span>
                            <span className="text-xs text-gray-500">v{testCase.version}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <StatusIcon className={`w-4 h-4 ${getStatusColor('PENDING')}`} />
                          {selectedTestCases.includes(testCase.testCaseId) && (
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
              Test Case: {testCases.find(tc => tc.testCaseId === currentExecution.testCaseId)?.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewTestManagerFileBased;