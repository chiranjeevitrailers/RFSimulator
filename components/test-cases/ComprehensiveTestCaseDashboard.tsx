'use client';

import React, { useState, useEffect } from 'react';
import { RealTimeTestExecutionEngine, RealTimeExecutionResult } from '@/lib/real-time-test-execution-engine';
import { ComprehensiveTestCaseGenerator } from '@/lib/comprehensive-test-case-generator';
import RealTimeProtocolAnalyzer from '@/components/protocol-analyzer/RealTimeProtocolAnalyzer';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock,
  Layers,
  BarChart3,
  FileText,
  AlertTriangle,
  Filter,
  Search,
  Download,
  Upload,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Network,
  Wifi,
  Server,
  Database,
  Cpu,
  HardDrive,
  MemoryStick,
  Router,
  Switch,
  Globe,
  Shield,
  Zap,
  Target,
  TrendingUp,
  BarChart,
  Users,
  Timer,
  Gauge,
  TrendingDown,
  AlertCircle,
  Info,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Copy,
  Share,
  MoreHorizontal,
  MessageSquare,
  Radio,
  Signal,
  WifiOff,
  WifiIcon,
  TestTube,
  TestTube2,
  Beaker,
  FlaskConical,
  Microscope,
  Atom,
  Zap as ZapIcon,
  Layers3,
  NetworkIcon,
  Wifi as WifiIcon2,
  Radio as RadioIcon,
  Signal as SignalIcon,
  Activity as ActivityIcon,
  BarChart3 as BarChart3Icon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Gauge as GaugeIcon,
  Timer as TimerIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  AlertTriangle as AlertTriangleIcon,
  Info as InfoIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface ComprehensiveTestCaseDashboardProps {
  userId: string;
}

const ComprehensiveTestCaseDashboard: React.FC<ComprehensiveTestCaseDashboardProps> = ({ userId }) => {
  const [executionEngine] = useState(() => RealTimeTestExecutionEngine.getInstance());
  const [testCaseGenerator] = useState(() => ComprehensiveTestCaseGenerator.getInstance());
  const [testCases, setTestCases] = useState<any[]>([]);
  const [activeExecutions, setActiveExecutions] = useState<RealTimeExecutionResult[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<any>(null);
  const [selectedExecution, setSelectedExecution] = useState<RealTimeExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState('test-cases');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterComplexity, setFilterComplexity] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTestCase, setExpandedTestCase] = useState<string | null>(null);
  const [showProtocolAnalyzer, setShowProtocolAnalyzer] = useState(false);

  useEffect(() => {
    loadTestCases();
    loadActiveExecutions();
    
    // Set up periodic refresh
    const interval = setInterval(() => {
      loadActiveExecutions();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const loadTestCases = () => {
    const cases = testCaseGenerator.generateComprehensiveTestCases();
    setTestCases(cases);
  };

  const loadActiveExecutions = () => {
    const executions = executionEngine.getAllExecutions();
    setActiveExecutions(executions);
  };

  const startTestCaseExecution = async (testCaseId: string) => {
    try {
      const executionId = await executionEngine.startRealTimeExecution({
        testCaseId,
        userId,
        executionMode: 'simulation',
        timeAcceleration: 1,
        logLevel: 'detailed',
        captureMode: 'full',
        enableProtocolAnalyzer: true,
        enableLayerStatistics: true,
        enablePerformanceMetrics: true
      });

      // Subscribe to execution updates
      executionEngine.subscribeToExecution(executionId, (execution) => {
        loadActiveExecutions();
      });

      setSelectedExecution(executionEngine.getExecution(executionId) || null);
      setShowProtocolAnalyzer(true);
      setActiveTab('executions');

    } catch (error) {
      console.error('Failed to start test case execution:', error);
    }
  };

  const stopExecution = (executionId: string) => {
    executionEngine.stopExecution(executionId);
    loadActiveExecutions();
  };

  const toggleTestCaseExpansion = (testCaseId: string) => {
    setExpandedTestCase(expandedTestCase === testCaseId ? null : testCaseId);
  };

  const filteredTestCases = testCases.filter(testCase => {
    const matchesCategory = !filterCategory || testCase.category === filterCategory;
    const matchesComplexity = !filterComplexity || testCase.complexity === filterComplexity;
    const matchesSearch = !searchTerm || 
      testCase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testCase.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testCase.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesComplexity && matchesSearch;
  });

  const filteredExecutions = activeExecutions.filter(execution => {
    const matchesStatus = !filterStatus || execution.status === filterStatus;
    const matchesSearch = !searchTerm || 
      execution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      execution.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      '5G NR': <RadioIcon className="w-4 h-4" />,
      '4G LTE': <WifiIcon2 className="w-4 h-4" />,
      'IMS/SIP': <MessageSquare className="w-4 h-4" />,
      'O-RAN': <NetworkIcon className="w-4 h-4" />,
      'IoT/V2X/NTN': <SignalIcon className="w-4 h-4" />
    };
    return icons[category] || <TestTube className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      '5G NR': 'bg-blue-100 text-blue-800',
      '4G LTE': 'bg-green-100 text-green-800',
      'IMS/SIP': 'bg-purple-100 text-purple-800',
      'O-RAN': 'bg-orange-100 text-orange-800',
      'IoT/V2X/NTN': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getComplexityColor = (complexity: string): string => {
    const colors: { [key: string]: string } = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'expert': 'bg-red-100 text-red-800'
    };
    return colors[complexity] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      'pending': 'bg-gray-100 text-gray-800',
      'running': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'cancelled': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: any } = {
      'pending': <Clock className="w-4 h-4" />,
      'running': <Activity className="w-4 h-4" />,
      'completed': <CheckCircle className="w-4 h-4" />,
      'failed': <XCircle className="w-4 h-4" />,
      'cancelled': <AlertTriangle className="w-4 h-4" />
    };
    return icons[status] || <Info className="w-4 h-4" />;
  };

  const formatDuration = (duration: number): string => {
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(1)}s`;
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  const getUniqueCategories = () => {
    return [...new Set(testCases.map(tc => tc.category))];
  };

  const getUniqueComplexities = () => {
    return [...new Set(testCases.map(tc => tc.complexity))];
  };

  const getUniqueStatuses = () => {
    return [...new Set(activeExecutions.map(exec => exec.status))];
  };

  const getTestCaseStats = () => {
    const total = testCases.length;
    const byCategory = getUniqueCategories().map(category => ({
      category,
      count: testCases.filter(tc => tc.category === category).length
    }));
    const byComplexity = getUniqueComplexities().map(complexity => ({
      complexity,
      count: testCases.filter(tc => tc.complexity === complexity).length
    }));

    return { total, byCategory, byComplexity };
  };

  const getExecutionStats = () => {
    const total = activeExecutions.length;
    const running = activeExecutions.filter(exec => exec.status === 'running').length;
    const completed = activeExecutions.filter(exec => exec.status === 'completed').length;
    const failed = activeExecutions.filter(exec => exec.status === 'failed').length;

    return { total, running, completed, failed };
  };

  const testCaseStats = getTestCaseStats();
  const executionStats = getExecutionStats();

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">5GLabX Test Case Management</h1>
            <Badge className="bg-blue-100 text-blue-800">
              {testCaseStats.total} Test Cases
            </Badge>
            {executionStats.running > 0 && (
              <Badge className="bg-green-100 text-green-800">
                {executionStats.running} Running
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={loadTestCases}
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => setShowProtocolAnalyzer(!showProtocolAnalyzer)}
              variant="outline"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showProtocolAnalyzer ? 'Hide' : 'Show'} Analyzer
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Test Cases</p>
                <p className="text-2xl font-bold text-gray-900">{testCaseStats.total}</p>
              </div>
              <TestTube className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Executions</p>
                <p className="text-2xl font-bold text-gray-900">{executionStats.total}</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Running</p>
                <p className="text-2xl font-bold text-gray-900">{executionStats.running}</p>
              </div>
              <Play className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{executionStats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {showProtocolAnalyzer && selectedExecution ? (
          <div className="flex-1">
            <RealTimeProtocolAnalyzer 
              userId={userId} 
              testCaseId={selectedExecution.testCaseId}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
                <TabsTrigger value="executions">Executions</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="test-cases" className="flex-1 flex flex-col">
                {/* Filters */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Filter className="w-4 h-4 text-gray-500" />
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Categories</option>
                        {getUniqueCategories().map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={filterComplexity}
                        onChange={(e) => setFilterComplexity(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Complexities</option>
                        {getUniqueComplexities().map(complexity => (
                          <option key={complexity} value={complexity}>{complexity}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center space-x-2 flex-1">
                      <Search className="w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search test cases..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Test Cases List */}
                <div className="flex-1 overflow-y-auto bg-white p-4">
                  {filteredTestCases.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No test cases found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTestCases.map((testCase) => (
                        <Card key={testCase.id} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                {getCategoryIcon(testCase.category)}
                                <Badge className={getCategoryColor(testCase.category)}>
                                  {testCase.category}
                                </Badge>
                                <Badge className={getComplexityColor(testCase.complexity)}>
                                  {testCase.complexity}
                                </Badge>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{testCase.name}</h3>
                                <p className="text-sm text-gray-500">{testCase.description}</p>
                                <p className="text-xs text-gray-400">
                                  {testCase.protocolVersion} • {testCase.messageFlow.length} messages
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                onClick={() => startTestCaseExecution(testCase.id)}
                                className="bg-green-600 hover:bg-green-700"
                                size="sm"
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Run
                              </Button>
                              <Button
                                onClick={() => toggleTestCaseExpansion(testCase.id)}
                                variant="outline"
                                size="sm"
                              >
                                {expandedTestCase === testCase.id ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          {expandedTestCase === testCase.id && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">Message Flow Preview</h4>
                                  <div className="space-y-2">
                                    {testCase.messageFlow.slice(0, 5).map((message: any, index: number) => (
                                      <div key={index} className="flex items-center space-x-2 text-sm">
                                        <Badge className="bg-gray-100 text-gray-800">
                                          {message.layer}
                                        </Badge>
                                        <span className="text-gray-600">{message.messageName}</span>
                                      </div>
                                    ))}
                                    {testCase.messageFlow.length > 5 && (
                                      <p className="text-sm text-gray-500">
                                        +{testCase.messageFlow.length - 5} more messages
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">Test Case Details</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Protocol Version:</span>
                                      <span className="font-medium">{testCase.protocolVersion}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Complexity:</span>
                                      <span className="font-medium">{testCase.complexity}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Message Count:</span>
                                      <span className="font-medium">{testCase.messageFlow.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Created:</span>
                                      <span className="font-medium">
                                        {new Date(testCase.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="executions" className="flex-1 flex flex-col">
                {/* Execution Filters */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Filter className="w-4 h-4 text-gray-500" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Statuses</option>
                        {getUniqueStatuses().map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center space-x-2 flex-1">
                      <Search className="w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search executions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Executions List */}
                <div className="flex-1 overflow-y-auto bg-white p-4">
                  {filteredExecutions.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No executions found</p>
                        <p className="text-sm">Start a test case to see executions</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredExecutions.map((execution) => (
                        <Card key={execution.executionId} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(execution.status)}
                                <Badge className={getStatusColor(execution.status)}>
                                  {execution.status.toUpperCase()}
                                </Badge>
                                <Badge className={getCategoryColor(execution.category)}>
                                  {execution.category}
                                </Badge>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{execution.name}</h3>
                                <p className="text-sm text-gray-500">
                                  Started: {formatTimestamp(execution.startTime)}
                                </p>
                                {execution.duration && (
                                  <p className="text-sm text-gray-500">
                                    Duration: {formatDuration(execution.duration)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {execution.status === 'running' && (
                                <Button
                                  onClick={() => stopExecution(execution.executionId)}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Square className="w-4 h-4 mr-2" />
                                  Stop
                                </Button>
                              )}
                              <Button
                                onClick={() => {
                                  setSelectedExecution(execution);
                                  setShowProtocolAnalyzer(true);
                                }}
                                variant="outline"
                                size="sm"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </div>
                          </div>

                          {execution.status === 'running' && (
                            <div className="mt-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                  {execution.currentStep}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {execution.completedSteps} / {execution.totalSteps} steps
                                </span>
                              </div>
                              <Progress value={execution.progress} className="w-full" />
                            </div>
                          )}

                          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Messages:</span>
                              <span className="ml-2 font-medium">{execution.performanceMetrics.totalMessages}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Success Rate:</span>
                              <span className="ml-2 font-medium text-green-600">
                                {execution.performanceMetrics.successRate.toFixed(1)}%
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Avg Latency:</span>
                              <span className="ml-2 font-medium">
                                {execution.performanceMetrics.averageLatency}ms
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Throughput:</span>
                              <span className="ml-2 font-medium">
                                {execution.performanceMetrics.throughput.toFixed(1)} msg/s
                              </span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto bg-white p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Test Case Distribution */}
                    <Card className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Test Case Distribution by Category</h3>
                      <div className="space-y-3">
                        {testCaseStats.byCategory.map((stat) => (
                          <div key={stat.category} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getCategoryIcon(stat.category)}
                              <span className="text-sm font-medium">{stat.category}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${(stat.count / testCaseStats.total) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{stat.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Complexity Distribution */}
                    <Card className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Test Case Distribution by Complexity</h3>
                      <div className="space-y-3">
                        {testCaseStats.byComplexity.map((stat) => (
                          <div key={stat.complexity} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge className={getComplexityColor(stat.complexity)}>
                                {stat.complexity}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full" 
                                  style={{ width: `${(stat.count / testCaseStats.total) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{stat.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Execution Statistics */}
                    <Card className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Execution Statistics</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Total Executions:</span>
                          <span className="font-bold">{executionStats.total}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-600">Completed:</span>
                          <span className="font-bold text-green-600">{executionStats.completed}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-600">Running:</span>
                          <span className="font-bold text-blue-600">{executionStats.running}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-red-600">Failed:</span>
                          <span className="font-bold text-red-600">{executionStats.failed}</span>
                        </div>
                      </div>
                    </Card>

                    {/* Performance Overview */}
                    <Card className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Performance Overview</h3>
                      <div className="space-y-3">
                        {activeExecutions.length > 0 ? (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Avg Success Rate:</span>
                              <span className="font-bold text-green-600">
                                {(activeExecutions.reduce((sum, exec) => sum + exec.performanceMetrics.successRate, 0) / activeExecutions.length).toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Avg Latency:</span>
                              <span className="font-bold">
                                {Math.round(activeExecutions.reduce((sum, exec) => sum + exec.performanceMetrics.averageLatency, 0) / activeExecutions.length)}ms
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Avg Throughput:</span>
                              <span className="font-bold">
                                {(activeExecutions.reduce((sum, exec) => sum + exec.performanceMetrics.throughput, 0) / activeExecutions.length).toFixed(1)} msg/s
                              </span>
                            </div>
                          </>
                        ) : (
                          <p className="text-sm text-gray-500">No execution data available</p>
                        )}
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComprehensiveTestCaseDashboard;