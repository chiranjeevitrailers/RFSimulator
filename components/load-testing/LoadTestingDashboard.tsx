'use client';

import React, { useState, useEffect } from 'react';
import { LoadTestingManager, LoadTestConfig, LoadTestExecution, PerformanceBaseline, ScalabilityTest } from '@/lib/load-testing-manager';
import { 
  Zap, 
  Play, 
  Pause, 
  RefreshCw, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Settings, 
  Clock, 
  Calendar, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Target, 
  Timer, 
  Users, 
  Server, 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Network, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronRight, 
  Copy, 
  Save, 
  X, 
  Info, 
  Download, 
  Upload, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  PlayCircle, 
  PauseCircle, 
  StopCircle, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  XCircle as XCircleIcon, 
  Clock as ClockIcon, 
  Calendar as CalendarIcon, 
  Activity as ActivityIcon, 
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon, 
  BarChart3 as BarChart3Icon, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon, 
  Target as TargetIcon, 
  Timer as TimerIcon, 
  Users as UsersIcon, 
  Server as ServerIcon, 
  Cpu as CpuIcon, 
  MemoryStick as MemoryStickIcon, 
  HardDrive as HardDriveIcon, 
  Network as NetworkIcon, 
  AlertTriangle as AlertTriangleIcon, 
  CheckCircle as CheckCircleIcon, 
  XCircle as XCircleIcon2, 
  Search as SearchIcon, 
  Filter as FilterIcon, 
  ChevronDown as ChevronDownIcon, 
  ChevronRight as ChevronRightIcon, 
  Copy as CopyIcon, 
  Save as SaveIcon, 
  X as XIcon, 
  Info as InfoIcon, 
  Download as DownloadIcon, 
  Upload as UploadIcon, 
  Maximize2 as Maximize2Icon, 
  Minimize2 as Minimize2Icon, 
  RotateCcw as RotateCcwIcon, 
  PlayCircle as PlayCircleIcon, 
  PauseCircle as PauseCircleIcon, 
  StopCircle as StopCircleIcon, 
  Loader2 as Loader2Icon, 
  AlertCircle as AlertCircleIcon, 
  CheckCircle2 as CheckCircle2Icon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LoadTestingDashboardProps {
  userId: string;
}

const LoadTestingDashboard: React.FC<LoadTestingDashboardProps> = ({ userId }) => {
  const [loadTestingManager] = useState(() => LoadTestingManager.getInstance());
  const [activeTab, setActiveTab] = useState<'overview' | 'configs' | 'executions' | 'baselines' | 'scalability'>('overview');
  const [testConfigs, setTestConfigs] = useState<LoadTestConfig[]>([]);
  const [testExecutions, setTestExecutions] = useState<LoadTestExecution[]>([]);
  const [performanceBaselines, setPerformanceBaselines] = useState<PerformanceBaseline[]>([]);
  const [scalabilityTests, setScalabilityTests] = useState<ScalabilityTest[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      await loadTestingManager.initialize();
      
      setTestConfigs(loadTestingManager.getTestConfigs());
      setTestExecutions(await loadTestingManager.getTestExecutions());
      setPerformanceBaselines(loadTestingManager.getPerformanceBaselines());
      setScalabilityTests(loadTestingManager.getScalabilityTests());
    } catch (error) {
      console.error('Failed to load load testing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteTest = async (configId: string) => {
    try {
      const execution = await loadTestingManager.executeLoadTest(configId);
      setTestExecutions(prev => [...prev, execution]);
    } catch (error) {
      console.error('Failed to execute load test:', error);
    }
  };

  const handleCancelTest = async (executionId: string) => {
    try {
      const success = await loadTestingManager.cancelTestExecution(executionId);
      if (success) {
        setTestExecutions(prev => prev.map(execution => 
          execution.id === executionId ? { ...execution, status: 'cancelled' } : execution
        ));
      }
    } catch (error) {
      console.error('Failed to cancel test:', error);
    }
  };

  const handleExecuteScalabilityTest = async (testId: string) => {
    try {
      await loadTestingManager.executeScalabilityTest(testId);
      setScalabilityTests(prev => prev.map(test => 
        test.id === testId ? { ...test, status: 'running' } : test
      ));
    } catch (error) {
      console.error('Failed to execute scalability test:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'running':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stress':
        return <Zap className="w-4 h-4" />;
      case 'spike':
        return <TrendingUp className="w-4 h-4" />;
      case 'volume':
        return <BarChart3 className="w-4 h-4" />;
      case 'endurance':
        return <Clock className="w-4 h-4" />;
      case 'scalability':
        return <Target className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getThresholdStatus = (value: number, threshold: number, isLowerBetter: boolean = false) => {
    if (isLowerBetter) {
      return value <= threshold ? 'good' : 'warning';
    }
    return value >= threshold ? 'good' : 'warning';
  };

  const filteredTestExecutions = testExecutions.filter(execution => {
    const matchesSearch = execution.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         execution.metadata.config.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || execution.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getOverviewStats = () => {
    const totalTests = testExecutions.length;
    const successfulTests = testExecutions.filter(execution => execution.status === 'completed').length;
    const failedTests = testExecutions.filter(execution => execution.status === 'failed').length;
    const runningTests = testExecutions.filter(execution => execution.status === 'running').length;
    const avgResponseTime = testExecutions
      .filter(execution => execution.results.averageResponseTime)
      .reduce((sum, execution) => sum + execution.results.averageResponseTime, 0) / 
      testExecutions.filter(execution => execution.results.averageResponseTime).length || 0;
    const maxThroughput = Math.max(...testExecutions
      .filter(execution => execution.results.throughput)
      .map(execution => execution.results.throughput), 0);

    return {
      totalTests,
      successfulTests,
      failedTests,
      runningTests,
      avgResponseTime,
      maxThroughput,
      successRate: totalTests > 0 ? (successfulTests / totalTests) * 100 : 0
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading load testing data...</p>
        </div>
      </div>
    );
  }

  const stats = getOverviewStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Load Testing & Scalability</h2>
              <p className="text-sm text-gray-500">Performance testing and scalability analysis</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={loadData}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Test
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="running">Running</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'configs', name: 'Test Configs', icon: <Settings className="w-4 h-4" />, count: testConfigs.length },
              { id: 'executions', name: 'Executions', icon: <Play className="w-4 h-4" />, count: testExecutions.length },
              { id: 'baselines', name: 'Baselines', icon: <Target className="w-4 h-4" />, count: performanceBaselines.length },
              { id: 'scalability', name: 'Scalability', icon: <TrendingUp className="w-4 h-4" />, count: scalabilityTests.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
                {tab.count !== undefined && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Play className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Tests</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalTests}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.successRate.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Timer className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.avgResponseTime.toFixed(0)}ms</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Max Throughput</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.maxThroughput.toFixed(0)} req/s</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Tests */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Test Executions</h3>
                  <div className="space-y-3">
                    {testExecutions.slice(0, 5).map((execution) => (
                      <div key={execution.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(execution.metadata.config.type)}
                          <div>
                            <p className="font-medium text-gray-900">{execution.metadata.config.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(execution.startedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(execution.status)}`}>
                            {execution.status.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500">
                            {execution.results.averageResponseTime.toFixed(0)}ms
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Baselines</h3>
                  <div className="space-y-3">
                    {performanceBaselines.slice(0, 5).map((baseline) => (
                      <div key={baseline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Target className="w-4 h-4" />
                          <div>
                            <p className="font-medium text-gray-900">{baseline.name}</p>
                            <p className="text-sm text-gray-500">
                              {baseline.method} {baseline.endpoint}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {baseline.baseline.averageResponseTime}ms
                          </span>
                          <span className="text-sm text-gray-500">
                            {baseline.baseline.throughput} req/s
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Test Configs Tab */}
          {activeTab === 'configs' && (
            <div className="space-y-4">
              {testConfigs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {testConfigs.map((config) => (
                    <div key={config.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(config.type)}
                          <h3 className="font-medium text-gray-900">{config.name}</h3>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExecuteTest(config.id)}
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingItem(config);
                              setShowEditModal(true);
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{config.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Type:</span>
                          <span className="font-medium">{config.type}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Virtual Users:</span>
                          <span className="font-medium">{config.load.virtualUsers}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Duration:</span>
                          <span className="font-medium">{formatDuration(config.load.duration)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Target:</span>
                          <span className="font-medium">{config.target.method} {config.target.url}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            config.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {config.enabled ? 'ENABLED' : 'DISABLED'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Thresholds:</span>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              getThresholdStatus(config.thresholds.responseTime, 1000) === 'good' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              RT: {config.thresholds.responseTime}ms
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              getThresholdStatus(config.thresholds.errorRate, 5, true) === 'good' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              ER: {config.thresholds.errorRate}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Test Configurations</h4>
                  <p className="text-gray-500">Create your first test configuration to get started.</p>
                </div>
              )}
            </div>
          )}

          {/* Test Executions Tab */}
          {activeTab === 'executions' && (
            <div className="space-y-4">
              {filteredTestExecutions.length > 0 ? (
                <div className="space-y-3">
                  {filteredTestExecutions.map((execution) => (
                    <div key={execution.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(execution.metadata.config.type)}
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{execution.metadata.config.name}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(execution.status)}`}>
                                {execution.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              Started: {new Date(execution.startedAt).toLocaleString()}
                            </p>
                            {execution.completedAt && (
                              <p className="text-sm text-gray-500">
                                Duration: {execution.duration ? formatDuration(execution.duration) : 'N/A'}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {execution.results.averageResponseTime.toFixed(0)}ms
                            </p>
                            <p className="text-sm text-gray-500">
                              {execution.results.throughput.toFixed(0)} req/s
                            </p>
                          </div>
                          {execution.status === 'running' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelTest(execution.id)}
                            >
                              <Pause className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpandedItem(
                              expandedItem === execution.id ? null : execution.id
                            )}
                          >
                            {expandedItem === execution.id ? 
                              <ChevronDown className="w-3 h-3" /> : 
                              <ChevronRight className="w-3 h-3" />
                            }
                          </Button>
                        </div>
                      </div>
                      
                      {expandedItem === execution.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h4 className="font-medium text-gray-900 mb-2">Performance Metrics</h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p><strong>Total Requests:</strong> {execution.results.totalRequests.toLocaleString()}</p>
                                <p><strong>Successful:</strong> {execution.results.successfulRequests.toLocaleString()}</p>
                                <p><strong>Failed:</strong> {execution.results.failedRequests.toLocaleString()}</p>
                                <p><strong>Error Rate:</strong> {execution.results.errorRate.toFixed(2)}%</p>
                              </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h4 className="font-medium text-gray-900 mb-2">Response Times</h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p><strong>Average:</strong> {execution.results.averageResponseTime.toFixed(0)}ms</p>
                                <p><strong>P95:</strong> {execution.results.p95ResponseTime.toFixed(0)}ms</p>
                                <p><strong>P99:</strong> {execution.results.p99ResponseTime.toFixed(0)}ms</p>
                                <p><strong>Max:</strong> {execution.results.maxResponseTime.toFixed(0)}ms</p>
                              </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h4 className="font-medium text-gray-900 mb-2">System Metrics</h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p><strong>Avg CPU:</strong> {execution.results.systemMetrics.cpuUsage.length > 0 ? (execution.results.systemMetrics.cpuUsage.reduce((a, b) => a + b, 0) / execution.results.systemMetrics.cpuUsage.length).toFixed(1) : 0}%</p>
                                <p><strong>Avg Memory:</strong> {execution.results.systemMetrics.memoryUsage.length > 0 ? (execution.results.systemMetrics.memoryUsage.reduce((a, b) => a + b, 0) / execution.results.systemMetrics.memoryUsage.length).toFixed(1) : 0}%</p>
                                <p><strong>Throughput:</strong> {execution.results.throughput.toFixed(0)} req/s</p>
                              </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h4 className="font-medium text-gray-900 mb-2">Errors</h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                {execution.results.errors.length > 0 ? (
                                  execution.results.errors.map((error, index) => (
                                    <p key={index}><strong>{error.type}:</strong> {error.count} ({error.percentage.toFixed(1)}%)</p>
                                  ))
                                ) : (
                                  <p>No errors</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Play className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Test Executions</h4>
                  <p className="text-gray-500">No test executions found matching your criteria.</p>
                </div>
              )}
            </div>
          )}

          {/* Performance Baselines Tab */}
          {activeTab === 'baselines' && (
            <div className="space-y-4">
              {performanceBaselines.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {performanceBaselines.map((baseline) => (
                    <div key={baseline.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4" />
                          <h3 className="font-medium text-gray-900">{baseline.name}</h3>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingItem(baseline);
                              setShowEditModal(true);
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{baseline.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Endpoint:</span>
                          <span className="font-medium">{baseline.method} {baseline.endpoint}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Avg Response Time:</span>
                          <span className="font-medium">{baseline.baseline.averageResponseTime}ms</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">P95 Response Time:</span>
                          <span className="font-medium">{baseline.baseline.p95ResponseTime}ms</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Throughput:</span>
                          <span className="font-medium">{baseline.baseline.throughput} req/s</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Error Rate:</span>
                          <span className="font-medium">{baseline.baseline.errorRate}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Last Updated:</span>
                          <span className="font-medium">
                            {new Date(baseline.lastUpdated).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Performance Baselines</h4>
                  <p className="text-gray-500">Create your first performance baseline to get started.</p>
                </div>
              )}
            </div>
          )}

          {/* Scalability Tests Tab */}
          {activeTab === 'scalability' && (
            <div className="space-y-4">
              {scalabilityTests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scalabilityTests.map((test) => (
                    <div key={test.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4" />
                          <h3 className="font-medium text-gray-900">{test.name}</h3>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExecuteScalabilityTest(test.id)}
                            disabled={test.status === 'running'}
                          >
                            {test.status === 'running' ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Play className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Type:</span>
                          <span className="font-medium">{test.type}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Instances:</span>
                          <span className="font-medium">{test.scaling.startInstances} - {test.scaling.maxInstances}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                            {test.status.toUpperCase()}
                          </span>
                        </div>
                        {test.results.optimalInstances && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Optimal Instances:</span>
                            <span className="font-medium">{test.results.optimalInstances}</span>
                          </div>
                        )}
                        {test.results.maxThroughput && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Max Throughput:</span>
                            <span className="font-medium">{test.results.maxThroughput.toFixed(0)} req/s</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Scalability Tests</h4>
                  <p className="text-gray-500">Create your first scalability test to get started.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {showCreateModal ? 'Create' : 'Edit'} Test Configuration
              </h3>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setEditingItem(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="text-center py-8">
              <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Form Implementation</h4>
              <p className="text-gray-500">The form for creating/editing test configurations will be implemented here.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadTestingDashboard;