'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RealTimeTestExecutionEngine, RealTimeExecutionResult, LayerStatistics } from '@/lib/real-time-test-execution-engine';
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
  WifiIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface RealTimeProtocolAnalyzerProps {
  userId: string;
  testCaseId?: string;
}

const RealTimeProtocolAnalyzer: React.FC<RealTimeProtocolAnalyzerProps> = ({ 
  userId, 
  testCaseId 
}) => {
  const [executionEngine] = useState(() => RealTimeTestExecutionEngine.getInstance());
  const [activeExecution, setActiveExecution] = useState<RealTimeExecutionResult | null>(null);
  const [testCases, setTestCases] = useState<any[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionConfig, setExecutionConfig] = useState({
    executionMode: 'simulation' as 'simulation' | 'realtime' | 'batch',
    timeAcceleration: 1,
    logLevel: 'detailed' as 'basic' | 'detailed' | 'verbose',
    captureMode: 'full' as 'messages' | 'full' | 'performance',
    enableProtocolAnalyzer: true,
    enableLayerStatistics: true,
    enablePerformanceMetrics: true
  });
  const [activeTab, setActiveTab] = useState('message-flow');
  const [filterLayer, setFilterLayer] = useState<string>('');
  const [filterDirection, setFilterDirection] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTestCases();
    if (testCaseId) {
      const testCase = testCases.find(tc => tc.id === testCaseId);
      if (testCase) {
        setSelectedTestCase(testCase);
      }
    }
  }, [testCaseId, testCases]);

  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeExecution?.messages, autoScroll]);

  const loadTestCases = () => {
    const cases = executionEngine.getTestCases();
    setTestCases(cases);
  };

  const startExecution = async () => {
    if (!selectedTestCase) return;

    try {
      setIsExecuting(true);
      const executionId = await executionEngine.startRealTimeExecution({
        testCaseId: selectedTestCase.id,
        userId,
        ...executionConfig
      });

      // Subscribe to execution updates
      executionEngine.subscribeToExecution(executionId, (execution) => {
        setActiveExecution(execution);
      });

      // Subscribe to protocol analyzer updates
      executionEngine.subscribeToProtocolAnalyzer(executionId, (data) => {
        // Protocol analyzer data is already included in execution
      });

      // Subscribe to layer statistics updates
      executionEngine.subscribeToLayerStatistics(executionId, (statistics) => {
        // Layer statistics are already included in execution
      });

    } catch (error) {
      console.error('Failed to start execution:', error);
      setIsExecuting(false);
    }
  };

  const stopExecution = () => {
    if (activeExecution) {
      executionEngine.stopExecution(activeExecution.executionId);
      setIsExecuting(false);
    }
  };

  const resetExecution = () => {
    setActiveExecution(null);
    setIsExecuting(false);
  };

  const toggleMessageExpansion = (messageId: string) => {
    const newExpanded = new Set(expandedMessages);
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId);
    } else {
      newExpanded.add(messageId);
    }
    setExpandedMessages(newExpanded);
  };

  const filteredMessages = activeExecution?.messages.filter(message => {
    const matchesLayer = !filterLayer || message.layer === filterLayer;
    const matchesDirection = !filterDirection || message.direction === filterDirection;
    const matchesSearch = !searchTerm || 
      message.messageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.messageType.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesLayer && matchesDirection && matchesSearch;
  }) || [];

  const getLayerColor = (layer: string): string => {
    const colors: { [key: string]: string } = {
      'PHY': 'bg-red-100 text-red-800',
      'MAC': 'bg-orange-100 text-orange-800',
      'RLC': 'bg-yellow-100 text-yellow-800',
      'PDCP': 'bg-green-100 text-green-800',
      'RRC': 'bg-blue-100 text-blue-800',
      'NAS': 'bg-indigo-100 text-indigo-800',
      'IMS': 'bg-purple-100 text-purple-800',
      'SIP': 'bg-pink-100 text-pink-800'
    };
    return colors[layer] || 'bg-gray-100 text-gray-800';
  };

  const getDirectionColor = (direction: string): string => {
    const colors: { [key: string]: string } = {
      'UL': 'bg-green-100 text-green-800',
      'DL': 'bg-blue-100 text-blue-800',
      'BIDIRECTIONAL': 'bg-purple-100 text-purple-800'
    };
    return colors[direction] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (isValid: boolean): string => {
    return isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const formatLatency = (latency: number): string => {
    return `${latency}ms`;
  };

  const formatHexData = (hex: string): string => {
    return hex.match(/.{1,2}/g)?.join(' ') || hex;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">Real-Time Protocol Analyzer</h2>
            {activeExecution && (
              <Badge className={activeExecution.status === 'running' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {activeExecution.status.toUpperCase()}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={startExecution}
              disabled={!selectedTestCase || isExecuting}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
            <Button
              onClick={stopExecution}
              disabled={!isExecuting}
              variant="outline"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
            <Button
              onClick={resetExecution}
              variant="outline"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Test Case Selection */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Test Case
            </label>
            <select
              value={selectedTestCase?.id || ''}
              onChange={(e) => {
                const testCase = testCases.find(tc => tc.id === e.target.value);
                setSelectedTestCase(testCase);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a test case...</option>
              {testCases.map(testCase => (
                <option key={testCase.id} value={testCase.id}>
                  {testCase.name} ({testCase.category})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Mode:</label>
            <select
              value={executionConfig.executionMode}
              onChange={(e) => setExecutionConfig(prev => ({ ...prev, executionMode: e.target.value as any }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="simulation">Simulation</option>
              <option value="realtime">Real-time</option>
              <option value="batch">Batch</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Speed:</label>
            <select
              value={executionConfig.timeAcceleration}
              onChange={(e) => setExecutionConfig(prev => ({ ...prev, timeAcceleration: parseInt(e.target.value) }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={5}>5x</option>
              <option value={10}>10x</option>
            </select>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {activeExecution && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {activeExecution.currentStep}
            </span>
            <span className="text-sm text-gray-500">
              {activeExecution.completedSteps} / {activeExecution.totalSteps} steps
            </span>
          </div>
          <Progress value={activeExecution.progress} className="w-full" />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Message Flow */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="message-flow">Message Flow</TabsTrigger>
              <TabsTrigger value="layer-stats">Layer Statistics</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="message-flow" className="flex-1 flex flex-col">
              {/* Filters */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      value={filterLayer}
                      onChange={(e) => setFilterLayer(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Layers</option>
                      <option value="PHY">PHY</option>
                      <option value="MAC">MAC</option>
                      <option value="RLC">RLC</option>
                      <option value="PDCP">PDCP</option>
                      <option value="RRC">RRC</option>
                      <option value="NAS">NAS</option>
                      <option value="IMS">IMS</option>
                      <option value="SIP">SIP</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={filterDirection}
                      onChange={(e) => setFilterDirection(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Directions</option>
                      <option value="UL">Uplink</option>
                      <option value="DL">Downlink</option>
                      <option value="BIDIRECTIONAL">Bidirectional</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 flex-1">
                    <Search className="w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={autoScroll}
                        onChange={(e) => setAutoScroll(e.target.checked)}
                        className="mr-2"
                      />
                      Auto-scroll
                    </label>
                  </div>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto bg-white">
                {filteredMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No messages to display</p>
                      <p className="text-sm">Start a test execution to see real-time message flow</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 space-y-2">
                    {filteredMessages.map((message, index) => (
                      <Card key={message.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <Badge className={getLayerColor(message.layer)}>
                                {message.layer}
                              </Badge>
                              <Badge className={getDirectionColor(message.direction)}>
                                {message.direction}
                              </Badge>
                              <Badge className={getStatusColor(message.validationResult.isValid)}>
                                {message.validationResult.isValid ? 'Valid' : 'Invalid'}
                              </Badge>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{message.messageName}</h4>
                              <p className="text-sm text-gray-500">{message.messageType}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {formatTimestamp(message.timestamp)}
                              </p>
                              <p className="text-sm text-gray-500">
                                Latency: {formatLatency(message.performanceData.latency)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleMessageExpansion(message.id)}
                            >
                              {expandedMessages.has(message.id) ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {expandedMessages.has(message.id) && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Raw Data</h5>
                                <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                                  {formatHexData(message.rawData)}
                                </div>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Information Elements</h5>
                                <div className="space-y-2">
                                  {message.informationElements.slice(0, 5).map((ie, ieIndex) => (
                                    <div key={ieIndex} className="flex justify-between text-sm">
                                      <span className="font-medium">{ie.name}:</span>
                                      <span className="text-gray-600">{ie.value}</span>
                                    </div>
                                  ))}
                                  {message.informationElements.length > 5 && (
                                    <p className="text-sm text-gray-500">
                                      +{message.informationElements.length - 5} more IEs
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <h5 className="font-medium text-gray-900 mb-2">Performance Data</h5>
                              <div className="grid grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Latency:</span>
                                  <span className="ml-2 font-medium">{formatLatency(message.performanceData.latency)}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Processing:</span>
                                  <span className="ml-2 font-medium">{message.performanceData.processingTime}ms</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Memory:</span>
                                  <span className="ml-2 font-medium">{message.performanceData.memoryUsage}KB</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">CPU:</span>
                                  <span className="ml-2 font-medium">{message.performanceData.cpuUsage}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="layer-stats" className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto bg-white p-4">
                {activeExecution?.layerStatistics.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Layers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No layer statistics available</p>
                      <p className="text-sm">Start a test execution to see layer statistics</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeExecution?.layerStatistics.map((stat, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">{stat.layer}</h3>
                          <Badge className={getLayerColor(stat.layer)}>
                            {stat.layer}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Total Messages:</span>
                            <span className="font-medium">{stat.totalMessages}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Success Rate:</span>
                            <span className="font-medium text-green-600">{stat.successRate.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Error Rate:</span>
                            <span className="font-medium text-red-600">{stat.errorRate.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Avg Latency:</span>
                            <span className="font-medium">{formatLatency(stat.averageLatency)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Throughput:</span>
                            <span className="font-medium">{stat.throughput.toFixed(1)} msg/s</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto bg-white p-4">
                {!activeExecution ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No performance data available</p>
                      <p className="text-sm">Start a test execution to see performance metrics</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Overall Performance</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Total Messages:</span>
                          <span className="font-medium">{activeExecution.performanceMetrics.totalMessages}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Success Rate:</span>
                          <span className="font-medium text-green-600">{activeExecution.performanceMetrics.successRate.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Error Rate:</span>
                          <span className="font-medium text-red-600">{activeExecution.performanceMetrics.errorRate.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Avg Latency:</span>
                          <span className="font-medium">{formatLatency(activeExecution.performanceMetrics.averageLatency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Throughput:</span>
                          <span className="font-medium">{activeExecution.performanceMetrics.throughput.toFixed(1)} msg/s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Compliance Score:</span>
                          <span className="font-medium">{activeExecution.performanceMetrics.overallComplianceScore.toFixed(1)}%</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Latency Metrics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Min Latency:</span>
                          <span className="font-medium">{formatLatency(activeExecution.performanceMetrics.minLatency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Max Latency:</span>
                          <span className="font-medium">{formatLatency(activeExecution.performanceMetrics.maxLatency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Avg Latency:</span>
                          <span className="font-medium">{formatLatency(activeExecution.performanceMetrics.averageLatency)}</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Message Statistics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Successful:</span>
                          <span className="font-medium text-green-600">{activeExecution.performanceMetrics.successfulMessages}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Failed:</span>
                          <span className="font-medium text-red-600">{activeExecution.performanceMetrics.failedMessages}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Total:</span>
                          <span className="font-medium">{activeExecution.performanceMetrics.totalMessages}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="logs" className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto bg-white p-4">
                {activeExecution?.logs.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No logs available</p>
                      <p className="text-sm">Start a test execution to see logs</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeExecution?.logs.map((log, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RealTimeProtocolAnalyzer;