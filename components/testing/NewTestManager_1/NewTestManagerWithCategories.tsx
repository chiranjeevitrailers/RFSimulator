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
  Monitor,
  Database as DatabaseIcon,
  BarChart3 as BarChart3Icon,
  Activity as ActivityIcon,
  Zap as ZapIcon,
  Shield as ShieldIcon,
  Users as UsersIcon,
  Settings as SettingsIcon
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

const NewTestManagerWithCategories: React.FC = () => {
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

  // Load test cases and organize by categories
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
    }));
  };

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

  // Add log entry
  const addLog = (level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', component: string, message: string) => {
    const logEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
      component
    };
    setLogs(prev => [...prev, logEntry]);
  };

  // Run selected test cases
  const runSelectedTestCases = async () => {
    if (selectedTestCases.length === 0) {
      addLog('WARN', 'TestManager', 'No test cases selected');
      return;
    }

    const testCaseId = selectedTestCases[0]; // Run first selected test case
    const testCase = testCases.find(tc => tc.testCaseId === testCaseId);

    if (!testCase) {
      addLog('ERROR', 'TestManager', 'Selected test case not found');
      return;
    }

    addLog('INFO', 'TestManager', `Starting test execution: ${testCase.name}`);

    // Create test execution
    const execution: TestExecution = {
      id: Date.now().toString(),
      testCaseId: testCaseId,
      status: 'RUNNING',
      startTime: new Date(),
      logs: []
    };

    setCurrentExecution(execution);
    addLog('INFO', 'TestManager', `Test Case: ${testCase.name}`);
    addLog('INFO', 'TestManager', `Technology: ${testCase.technology}`);
    addLog('INFO', 'TestManager', `Category: ${testCase.category}`);

    try {
      // Process test case data
      const result = await testDataProcessor.processTestCase(testCase);
      
      if (result.success && result.testCaseData) {
        addLog('INFO', 'TestManager', `Processing ${result.testCaseData.expectedMessages?.length || 0} messages`);

        // Start data flow execution
        const dataFlowExecutionId = dataFlowManager.startTestExecution(testCaseId, result.testCaseData);
        addLog('INFO', 'TestManager', `Data flow execution started: ${dataFlowExecutionId}`);

        // Dispatch legacy 5GLABX_TEST_EXECUTION event
        const testExecutionEvent = new CustomEvent('5GLABX_TEST_EXECUTION', {
          detail: {
            type: '5GLABX_TEST_EXECUTION',
            source: 'TestManager',
            testCaseId: testCaseId,
            testCaseData: result.testCaseData,
            timestamp: Date.now()
          }
        });
        window.dispatchEvent(testExecutionEvent);
        addLog('INFO', 'TestManager', 'Dispatching legacy 5GLABX_TEST_EXECUTION event');

        // Dispatch new test execution event
        dataFlowManager.dispatch({
          type: 'TEST_EXECUTION_START',
          source: 'TestManager',
          target: 'ALL',
          data: {
            testCaseId,
            testCaseData: result.testCaseData,
            testCase: testCase
          },
          timestamp: Date.now()
        });
        addLog('INFO', 'TestManager', `Dispatching TEST_EXECUTION_START for test case: ${testCaseId}`);

        // Simulate test execution
        setTimeout(() => {
          setCurrentExecution(prev => prev ? { ...prev, status: 'COMPLETED', endTime: new Date() } : null);
          addLog('INFO', 'TestManager', `Test execution completed: ${testCase.name}`);
          
          // Dispatch test completion event
          dataFlowManager.dispatch({
            type: 'TEST_EXECUTION_COMPLETE',
            source: 'TestManager',
            target: 'ALL',
            data: {
              testCaseId,
              testCaseData: result.testCaseData,
              testCase: testCase
            },
            timestamp: Date.now()
          });
          addLog('INFO', 'TestManager', `Dispatching TEST_EXECUTION_COMPLETE for test case: ${testCaseId}`);
        }, 10000);

      } else {
        addLog('ERROR', 'TestManager', 'Failed to process test case data');
        setCurrentExecution(prev => prev ? { ...prev, status: 'FAILED', endTime: new Date() } : null);
      }
    } catch (error) {
      console.error('❌ Error running test case:', error);
      addLog('ERROR', 'TestManager', `Failed to run test case: ${error.message}`);
      setCurrentExecution(prev => prev ? { ...prev, status: 'FAILED', endTime: new Date() } : null);
    }
  };

  // Stop test execution
  const stopTestExecution = () => {
    if (!currentExecution) return;

    addLog('INFO', 'TestManager', 'Stopping test execution...');
    
    // Dispatch test stop event
    const stopEvent = new CustomEvent('5GLABX_TEST_STOP', {
      detail: {
        type: '5GLABX_TEST_STOP',
        source: 'TestManager',
        testCaseId: currentExecution.testCaseId,
        timestamp: Date.now()
      }
    });
    window.dispatchEvent(stopEvent);

    // Dispatch data flow stop event
    dataFlowManager.dispatch({
      type: 'TEST_EXECUTION_STOP',
      source: 'TestManager',
      target: 'ALL',
      data: {
        testCaseId: currentExecution.testCaseId
      },
      timestamp: Date.now()
    });

    setCurrentExecution(prev => prev ? { ...prev, status: 'STOPPED', endTime: new Date() } : null);
    addLog('INFO', 'TestManager', 'Test execution stopped');
  };

  // Handle test case selection
  const handleTestCaseSelect = (testCaseId: string) => {
    setSelectedTestCases(prev => 
      prev.includes(testCaseId) 
        ? prev.filter(id => id !== testCaseId)
        : [...prev, testCaseId]
    );
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS': return CheckCircle;
      case 'FAIL': return XCircle;
      case 'RUNNING': return Activity;
      default: return Clock;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS': return 'text-green-500';
      case 'FAIL': return 'text-red-500';
      case 'RUNNING': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  // Get technology color
  const getTechnologyColor = (technology: string) => {
    switch (technology) {
      case 'LTE': return 'bg-blue-100 text-blue-800';
      case '5G_NR': return 'bg-green-100 text-green-800';
      case '5G_SA': return 'bg-purple-100 text-purple-800';
      case '5G_NSA': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TestTube className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Test Manager</h1>
              <p className="text-sm text-gray-600">File-based test case management and execution</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={runSelectedTestCases}
                disabled={selectedTestCases.length === 0 || currentExecution?.status === 'RUNNING'}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                <span>Run Selected</span>
              </button>
              <button
                onClick={stopTestExecution}
                disabled={!currentExecution || currentExecution.status !== 'RUNNING'}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Square className="w-4 h-4" />
                <span>Stop</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Categories */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Test Categories</h2>
            
            {/* Search and Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search test cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterTechnology}
                onChange={(e) => setFilterTechnology(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Technologies</option>
                <option value="LTE">LTE</option>
                <option value="5G_NR">5G NR</option>
                <option value="5G_SA">5G SA</option>
                <option value="5G_NSA">5G NSA</option>
              </select>
            </div>
          </div>

          {/* Categories List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Database className="w-5 h-5" />
                  <span className="font-medium">All Test Cases</span>
                </div>
                <span className="text-sm text-gray-500">{testCases.length}</span>
              </button>

              {categories.map((category) => {
                const filteredTestCases = getFilteredTestCases(category);
                const Icon = category.icon;
                
                return (
                  <div key={category.id} className="mt-1">
                    <button
                      onClick={() => {
                        setSelectedCategory(category.id);
                        toggleCategory(category.id);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 text-${category.color}-600`} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{filteredTestCases.length}</span>
                        {category.isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                    
                    {category.isExpanded && (
                      <div className="ml-6 mt-1 space-y-1">
                        {filteredTestCases.map((testCase) => (
                          <button
                            key={testCase.testCaseId}
                            onClick={() => handleTestCaseSelect(testCase.testCaseId)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                              selectedTestCases.includes(testCase.testCaseId)
                                ? 'bg-green-100 text-green-700'
                                : 'hover:bg-gray-50 text-gray-600'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{testCase.name}</div>
                              <div className="text-xs text-gray-500 truncate">{testCase.description}</div>
                            </div>
                            <div className="flex items-center space-x-2 ml-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getTechnologyColor(testCase.technology)}`}>
                                {testCase.technology}
                              </span>
                              {selectedTestCases.includes(testCase.testCaseId) && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Test Cases Panel */}
          <div className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedCategory === 'all' ? 'All Test Cases' : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {getCurrentTestCases().length} test cases available
                </p>
              </div>

              <div className="p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                    <span className="ml-2 text-gray-600">Loading test cases...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getCurrentTestCases().map((testCase) => {
                      const StatusIcon = getStatusIcon(testCase.status);
                      return (
                        <div
                          key={testCase.testCaseId}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedTestCases.includes(testCase.testCaseId)
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => handleTestCaseSelect(testCase.testCaseId)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{testCase.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{testCase.description}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getTechnologyColor(testCase.technology)}`}>
                                  {testCase.technology}
                                </span>
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
                              {selectedTestCases.includes(testCase.testCaseId) && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
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
          </div>

          {/* Automation Log */}
          <div className="h-64 bg-white border-t border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Automation Log</h3>
              <p className="text-sm text-gray-600">Real-time test execution logs</p>
            </div>
            <div className="h-48 overflow-y-auto p-4">
              {logs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <FileText className="w-6 h-6 mr-2" />
                  <span>No logs available</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        log.level === 'ERROR' ? 'bg-red-500' :
                        log.level === 'WARN' ? 'bg-yellow-500' :
                        log.level === 'INFO' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{log.timestamp}</span>
                          <span className={`text-xs font-medium ${
                            log.level === 'ERROR' ? 'text-red-600' :
                            log.level === 'WARN' ? 'text-yellow-600' :
                            log.level === 'INFO' ? 'text-blue-600' : 'text-gray-600'
                          }`}>
                            {log.level}
                          </span>
                          <span className="text-xs text-gray-500">[{log.component}]</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{log.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTestManagerWithCategories;