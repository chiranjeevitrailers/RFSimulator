'use client';

import React, { useState, useEffect } from 'react';
import { TestExecutionEngine, TestExecutionResult, TestExecutionConfig } from '@/lib/test-execution-engine';
import { TestCase, TestCaseService } from '@/lib/test-cases';
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
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TestExecutionDashboardProps {
  userId: string;
}

const TestExecutionDashboard: React.FC<TestExecutionDashboardProps> = ({ userId }) => {
  const [executionEngine] = useState(() => TestExecutionEngine.getInstance());
  const [executions, setExecutions] = useState<TestExecutionResult[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [executionConfig, setExecutionConfig] = useState<TestExecutionConfig>({
    userId,
    testCaseId: '',
    executionMode: 'standard',
    timeAcceleration: 1,
    maxConcurrentExecutions: 5,
    enableLogging: true,
    enableMetrics: true
  });
  const [expandedExecution, setExpandedExecution] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTestCases();
    loadExecutions();
    setupEventListeners();
    
    return () => {
      cleanupEventListeners();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadExecutions();
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const loadTestCases = async () => {
    try {
      const data = await TestCaseService.getTestCases({ limit: 100 });
      setTestCases(data);
    } catch (error) {
      console.error('Failed to load test cases:', error);
    }
  };

  const loadExecutions = () => {
    const userExecutions = executionEngine.getAllExecutions(userId);
    setExecutions(userExecutions);
  };

  const setupEventListeners = () => {
    executionEngine.on('executionStarted', (data) => {
      loadExecutions();
    });

    executionEngine.on('executionProgress', (data) => {
      loadExecutions();
    });

    executionEngine.on('executionCompleted', (data) => {
      loadExecutions();
    });

    executionEngine.on('executionFailed', (data) => {
      loadExecutions();
    });

    executionEngine.on('executionCancelled', (data) => {
      loadExecutions();
    });
  };

  const cleanupEventListeners = () => {
    // Cleanup event listeners if needed
  };

  const handleStartExecution = async () => {
    if (!selectedTestCase) {
      alert('Please select a test case');
      return;
    }

    try {
      setIsLoading(true);
      const config = {
        ...executionConfig,
        testCaseId: selectedTestCase.id
      };
      
      const executionId = await executionEngine.executeTest(config);
      console.log('Test execution started:', executionId);
      
      setShowExecutionModal(false);
    } catch (error) {
      console.error('Failed to start test execution:', error);
      alert('Failed to start test execution');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelExecution = async (executionId: string) => {
    try {
      await executionEngine.cancelExecution(executionId);
    } catch (error) {
      console.error('Failed to cancel execution:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'running':
        return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled':
        return <Square className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const filteredExecutions = executions.filter(execution => {
    const matchesStatus = !filterStatus || execution.status === filterStatus;
    const matchesSearch = !searchTerm || 
      execution.testCaseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      execution.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = executionEngine.getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Test Execution Dashboard</h2>
              <p className="text-sm text-gray-500">Monitor and manage test case executions</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowExecutionModal(true)}
              disabled={isLoading}
            >
              <Play className="w-4 h-4 mr-2" />
              Start Execution
            </Button>
            <Button
              variant="outline"
              onClick={loadExecutions}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Active</p>
                <p className="text-2xl font-bold text-blue-900">{stats.activeExecutions}</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-600">Queued</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.queuedExecutions}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-2xl font-bold text-green-900">{stats.completedExecutions}</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-600">Failed</p>
                <p className="text-2xl font-bold text-red-900">{stats.failedExecutions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search executions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Executions List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Execution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Case
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Started
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExecutions.map((execution) => (
                <React.Fragment key={execution.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(execution.status)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {execution.id.substring(0, 12)}...
                          </div>
                          <div className="text-sm text-gray-500">
                            {execution.testCaseId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {testCases.find(tc => tc.id === execution.testCaseId)?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(execution.status)}`}>
                        {execution.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${execution.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{Math.round(execution.progress)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {execution.duration ? formatDuration(execution.duration) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTimestamp(execution.startTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setExpandedExecution(
                            expandedExecution === execution.id ? null : execution.id
                          )}
                        >
                          {expandedExecution === execution.id ? 
                            <ChevronDown className="w-3 h-3" /> : 
                            <ChevronRight className="w-3 h-3" />
                          }
                        </Button>
                        {execution.status === 'running' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelExecution(execution.id)}
                          >
                            <Square className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedExecution === execution.id && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-4">
                          {/* Execution Details */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Execution Details</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Execution ID:</span>
                                <p className="font-mono text-xs">{execution.id}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Test Case ID:</span>
                                <p className="font-mono text-xs">{execution.testCaseId}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Current Step:</span>
                                <p>{execution.currentStep} / {execution.totalSteps}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">End Time:</span>
                                <p>{execution.endTime ? formatTimestamp(execution.endTime) : '-'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Performance Metrics */}
                          {execution.results.performanceMetrics && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Performance Metrics</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center">
                                  <Timer className="w-4 h-4 text-blue-500 mr-2" />
                                  <span className="text-gray-500">Execution Time:</span>
                                  <span className="ml-2 font-medium">
                                    {formatDuration(execution.results.performanceMetrics.executionTime)}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Cpu className="w-4 h-4 text-green-500 mr-2" />
                                  <span className="text-gray-500">CPU Usage:</span>
                                  <span className="ml-2 font-medium">
                                    {execution.results.performanceMetrics.cpuUsage.toFixed(1)}%
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <MemoryStick className="w-4 h-4 text-purple-500 mr-2" />
                                  <span className="text-gray-500">Memory:</span>
                                  <span className="ml-2 font-medium">
                                    {execution.results.performanceMetrics.memoryUsage.toFixed(1)} MB
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Network className="w-4 h-4 text-orange-500 mr-2" />
                                  <span className="text-gray-500">Latency:</span>
                                  <span className="ml-2 font-medium">
                                    {execution.results.performanceMetrics.networkLatency.toFixed(1)} ms
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <TrendingUp className="w-4 h-4 text-teal-500 mr-2" />
                                  <span className="text-gray-500">Throughput:</span>
                                  <span className="ml-2 font-medium">
                                    {execution.results.performanceMetrics.throughput.toFixed(1)} msg/s
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                                  <span className="text-gray-500">Error Rate:</span>
                                  <span className="ml-2 font-medium">
                                    {execution.results.performanceMetrics.errorRate.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Layer Results */}
                          {Object.keys(execution.results.layerResults).length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Layer Results</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(execution.results.layerResults).map(([layer, result]) => (
                                  <div key={layer} className="bg-white rounded-lg border p-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <h5 className="text-sm font-medium text-gray-900">{layer}</h5>
                                      {result.success ? 
                                        <CheckCircle className="w-4 h-4 text-green-500" /> : 
                                        <XCircle className="w-4 h-4 text-red-500" />
                                      }
                                    </div>
                                    <div className="text-xs text-gray-500 space-y-1">
                                      <p>Messages: {result.messagesProcessed}</p>
                                      <p>Errors: {result.errors}</p>
                                      <p>Timing: {result.timing}ms</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Logs */}
                          {execution.logs.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Execution Logs</h4>
                              <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
                                {execution.logs.map((log, index) => (
                                  <div key={index} className="text-xs font-mono mb-1">
                                    <span className="text-gray-400">
                                      [{log.timestamp.toISOString()}]
                                    </span>
                                    <span className={`ml-2 ${
                                      log.level === 'error' ? 'text-red-400' :
                                      log.level === 'warn' ? 'text-yellow-400' :
                                      log.level === 'info' ? 'text-blue-400' :
                                      'text-gray-400'
                                    }`}>
                                      [{log.level.toUpperCase()}]
                                    </span>
                                    <span className="ml-2 text-white">{log.message}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Start Execution Modal */}
      {showExecutionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Start Test Execution</h3>
              <Button
                variant="outline"
                onClick={() => setShowExecutionModal(false)}
              >
                Close
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Test Case</label>
                <select
                  value={selectedTestCase?.id || ''}
                  onChange={(e) => {
                    const testCase = testCases.find(tc => tc.id === e.target.value);
                    setSelectedTestCase(testCase || null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a test case</option>
                  {testCases.map((testCase) => (
                    <option key={testCase.id} value={testCase.id}>
                      {testCase.name} ({testCase.protocol_version})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Execution Mode</label>
                <select
                  value={executionConfig.executionMode}
                  onChange={(e) => setExecutionConfig({
                    ...executionConfig,
                    executionMode: e.target.value as 'standard' | 'realtime' | 'batch'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="standard">Standard</option>
                  <option value="realtime">Real-time</option>
                  <option value="batch">Batch</option>
                </select>
              </div>

              {executionConfig.executionMode === 'realtime' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Acceleration: {executionConfig.timeAcceleration}x
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="100"
                    step="0.1"
                    value={executionConfig.timeAcceleration}
                    onChange={(e) => setExecutionConfig({
                      ...executionConfig,
                      timeAcceleration: parseFloat(e.target.value)
                    })}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowExecutionModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStartExecution}
                  disabled={!selectedTestCase || isLoading}
                >
                  {isLoading ? 'Starting...' : 'Start Execution'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredExecutions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No executions found</h3>
          <p className="text-gray-500 mb-4">
            {executions.length === 0 
              ? "No test executions have been started yet."
              : "No executions match your current filters."
            }
          </p>
          {executions.length === 0 && (
            <Button onClick={() => setShowExecutionModal(true)}>
              <Play className="w-4 h-4 mr-2" />
              Start First Execution
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TestExecutionDashboard;