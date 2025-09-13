'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getServerUrl, getWebSocketUrl } from '@/lib/env';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Download, 
  Upload,
  MessageSquare,
  Layers,
  Settings,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Zap,
  Shield,
  Database,
  FileText,
  Code,
  Network,
  Activity,
  TrendingUp,
  Target,
  Award,
  Filter,
  Search,
  RefreshCw,
  Maximize2,
  Minimize2,
  Monitor,
  Smartphone,
  Wifi,
  Signal,
  Battery,
  Volume2,
  VolumeX
} from 'lucide-react';

interface ProtocolAnalyzerViewerProps {
  executionId: string;
  testCaseId: string;
  userId: string;
}

const ProtocolAnalyzerViewer: React.FC<ProtocolAnalyzerViewerProps> = ({ 
  executionId, 
  testCaseId, 
  userId 
}) => {
  const [execution, setExecution] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'hex' | 'binary' | 'decoded'>('decoded');
  const [logLevel, setLogLevel] = useState<'basic' | 'detailed' | 'verbose'>('detailed');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [showTimeline, setShowTimeline] = useState(true);
  const [showLayerStats, setShowLayerStats] = useState(true);
  const [showPerformance, setShowPerformance] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [timeAcceleration, setTimeAcceleration] = useState(1);
  const [captureMode, setCaptureMode] = useState<'messages' | 'full' | 'performance'>('full');
  
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    // Initialize from live logs (REST + WS)
    const serverUrl = getServerUrl();
    const wsUrl = getWebSocketUrl();
    let ws: WebSocket | null = null;
    let cancelled = false;

    // seed execution shell
    setExecution({
      executionId,
      testCaseId,
      status: 'running',
      startTime: new Date(),
      progress: 0,
      currentStep: '',
      messages: [],
      layerStats: [],
      performanceMetrics: {}
    });

    async function bootstrap() {
      try {
        const resp = await fetch(`${serverUrl}/api/logs/srsran?limit=500`);
        if (resp.ok) {
          const data = await resp.json();
          if (!cancelled) {
            const initial = (data || []).filter((d: any) => {
              if (executionId && d.executionId && d.executionId !== executionId) return false;
              if (testCaseId && d.testCaseId && d.testCaseId !== testCaseId) return false;
              return true;
            }).map((d: any) => ({
              timestamp: new Date(d.timestamp || Date.now()),
              level: (d.level || 'info').toLowerCase(),
              source: (d.source || 'RRC').toString(),
              message: d.message || '',
              data: d.data || {},
              layer: (d.layer || 'RRC').toString().toUpperCase(),
              protocol: (d.protocol || 'NR-RRC').toString().toUpperCase(),
              rawData: d.raw || d.rawData,
              decodedData: d.decoded || d.decodedData,
              informationElements: d.informationElements || [],
              validationResult: d.validation || d.validationResult || { isValid: true },
              performanceData: d.performance || d.performanceData || {},
            }));
            setLogs(initial);
          }
        }
      } catch {}

      try {
        ws = new WebSocket(wsUrl);
        ws.onmessage = (evt) => {
          try {
            const payload = JSON.parse(evt.data);
            if (payload?.type === 'log' && payload?.source) {
              const d = payload.data || {};
              if (executionId && d.executionId && d.executionId !== executionId) return;
              if (testCaseId && d.testCaseId && d.testCaseId !== testCaseId) return;
              const entry = {
                timestamp: new Date(d.timestamp || Date.now()),
                level: (d.level || 'info').toLowerCase(),
                source: (d.source || 'RRC').toString(),
                message: d.message || '',
                data: d.data || {},
                layer: (d.layer || 'RRC').toString().toUpperCase(),
                protocol: (d.protocol || 'NR-RRC').toString().toUpperCase(),
                rawData: d.raw || d.rawData,
                decodedData: d.decoded || d.decodedData,
                informationElements: d.informationElements || [],
                validationResult: d.validation || d.validationResult || { isValid: true },
                performanceData: d.performance || d.performanceData || {},
              };
              setLogs(prev => [...prev.slice(-499), entry]);
            }
          } catch {}
        };
      } catch {}
    }

    bootstrap();
    return () => { cancelled = true; try { ws && ws.close(); } catch {} };
  }, [executionId, testCaseId]);

  // Derive execution view from logs
  useEffect(() => {
    const byLayer: Record<string, any[]> = {};
    logs.forEach(l => {
      const layer = (l.layer || 'RRC').toString().toUpperCase();
      byLayer[layer] = byLayer[layer] || [];
      byLayer[layer].push(l);
    });
    const layerStats = Object.entries(byLayer).map(([layer, items]) => {
      const msgCount = items.length;
      const errorCount = items.filter(i => i.level === 'error').length;
      const latencies = items.map(i => i.performanceData?.latency).filter((n: any) => typeof n === 'number') as number[];
      const avgLatency = latencies.length ? Math.round((latencies.reduce((a, b) => a + b, 0) / latencies.length) * 10) / 10 : 0;
      const successRate = msgCount ? Math.round(((msgCount - errorCount) / msgCount) * 1000) / 10 : 100;
      return { layer, messageCount: msgCount, errorCount, successRate, averageLatency: avgLatency };
    });
    const totalMessages = logs.length;
    const failedMessages = logs.filter(l => l.level === 'error').length;
    const successfulMessages = totalMessages - failedMessages;
    const latencies = logs.map(l => l.performanceData?.latency).filter((n: any) => typeof n === 'number') as number[];
    const averageLatency = latencies.length ? Math.round((latencies.reduce((a, b) => a + b, 0) / latencies.length) * 10) / 10 : 0;
    const maxLatency = latencies.length ? Math.max(...latencies) : 0;
    const minLatency = latencies.length ? Math.min(...latencies) : 0;
    const errorRate = totalMessages ? Math.round((failedMessages / totalMessages) * 1000) / 10 : 0;
    const successRate = totalMessages ? Math.round((successfulMessages / totalMessages) * 1000) / 10 : 100;

    const messages = logs.map((l, idx) => ({
      id: `msg_${idx}`,
      stepId: l.data?.stepId || `step_${idx + 1}`,
      timestamp: l.timestamp?.valueOf() || Date.now(),
      direction: l.data?.direction || 'UL',
      layer: l.layer,
      protocol: l.protocol,
      messageType: l.data?.messageType || 'Message',
      messageName: l.message?.slice(0, 40) || 'Message',
      rawData: l.rawData,
      decodedData: l.decodedData,
      informationElements: l.informationElements || [],
      layerParameters: {},
      validationResult: l.validationResult || { isValid: l.level !== 'error' },
      performanceData: l.performanceData || {},
    }));

    setExecution(prev => ({
      ...(prev || {}),
      executionId,
      testCaseId,
      status: 'running',
      messages,
      layerStats,
      performanceMetrics: {
        totalMessages,
        successfulMessages,
        failedMessages,
        averageLatency,
        maxLatency,
        minLatency,
        throughput: 0,
        errorRate,
        successRate,
      },
      progress: Math.min(100, Math.round((messages.length / 100) * 100))
    }));
  }, [logs, executionId, testCaseId]);

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'UL': return '⬆️';
      case 'DL': return '⬇️';
      case 'BIDIRECTIONAL': return '↕️';
      default: return '↔️';
    }
  };

  const getLayerColor = (layer: string) => {
    const colors: Record<string, string> = {
      'PHY': 'bg-red-100 text-red-800 border-red-200',
      'MAC': 'bg-orange-100 text-orange-800 border-orange-200',
      'RLC': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'PDCP': 'bg-green-100 text-green-800 border-green-200',
      'RRC': 'bg-blue-100 text-blue-800 border-blue-200',
      'NAS': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'SIP': 'bg-purple-100 text-purple-800 border-purple-200',
      'IMS': 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[layer] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      case 'debug': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredMessages = execution?.messages?.filter((msg: any) => {
    const matchesLayer = selectedLayer === 'ALL' || msg.layer === selectedLayer;
    const matchesFilter = filterText === '' || 
      msg.messageName.toLowerCase().includes(filterText.toLowerCase()) ||
      msg.messageType.toLowerCase().includes(filterText.toLowerCase());
    return matchesLayer && matchesFilter;
  }) || [];

  const filteredLogs = logs.filter(log => {
    if (logLevel === 'basic') return log.level === 'info' || log.level === 'error';
    if (logLevel === 'detailed') return log.level !== 'debug';
    return true; // verbose shows all
  });

  return (
    <div className={`protocol-analyzer ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Header Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Monitor className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Protocol Analyzer</h2>
              <Badge variant="outline" className="text-xs">
                {execution?.testCaseId || 'Unknown'}
              </Badge>
            </div>
            
            {/* Execution Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm">
                <Square className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${execution?.status === 'running' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-gray-600">
                  {execution?.status === 'running' ? 'Running' : 'Stopped'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Signal className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">
                  {execution?.performanceMetrics?.successRate || 0}% Success
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'decoded' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('decoded')}
              >
                Decoded
              </Button>
              <Button
                variant={viewMode === 'hex' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('hex')}
              >
                Hex
              </Button>
              <Button
                variant={viewMode === 'binary' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('binary')}
              >
                Binary
              </Button>
            </div>

            {/* Fullscreen Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Execution Progress</span>
            <span>{execution?.progress || 0}%</span>
          </div>
          <Progress value={execution?.progress || 0} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-screen">
        {/* Left Panel - Layer Statistics */}
        {showLayerStats && (
          <div className="w-80 border-r border-gray-200 bg-gray-50">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-sm">Layer Statistics</h3>
            </div>
            <div className="p-4 space-y-3">
              {execution?.layerStats?.map((stat: any) => (
                <div key={stat.layer} className="bg-white rounded-lg p-3 border">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getLayerColor(stat.layer)}>
                      {stat.layer}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {stat.messageCount} msgs
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Success Rate</span>
                      <span>{stat.successRate}%</span>
                    </div>
                    <Progress value={stat.successRate} className="h-1" />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Avg Latency</span>
                      <span>{stat.averageLatency}ms</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Center Panel - Message Flow */}
        <div className="flex-1 flex flex-col">
          {/* Message Flow Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="font-semibold">Message Flow</h3>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedLayer}
                    onChange={(e) => setSelectedLayer(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="ALL">All Layers</option>
                    <option value="PHY">PHY</option>
                    <option value="MAC">MAC</option>
                    <option value="RLC">RLC</option>
                    <option value="PDCP">PDCP</option>
                    <option value="RRC">RRC</option>
                    <option value="NAS">NAS</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Filter messages..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 w-48"
                />
              </div>
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredMessages.map((message: any, index: number) => (
              <Card 
                key={message.id} 
                className={`transition-all cursor-pointer ${
                  index === currentMessageIndex ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`}
                onClick={() => setCurrentMessageIndex(index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {message.stepId}
                      </span>
                      <Badge className={getLayerColor(message.layer)}>
                        {message.layer}
                      </Badge>
                      <span className="text-lg">
                        {getDirectionIcon(message.direction)}
                      </span>
                      <div>
                        <h4 className="font-semibold text-sm">{message.messageName}</h4>
                        <p className="text-xs text-gray-600">{message.messageType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                      <div className="flex items-center space-x-2">
                        {message.validationResult.isValid ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-xs text-gray-500">
                          {message.performanceData.latency}ms
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message Data Display */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    {viewMode === 'decoded' && (
                      <div>
                        <h5 className="text-sm font-medium mb-2">Decoded Data</h5>
                        <pre className="text-xs text-gray-700 overflow-x-auto">
                          {JSON.stringify(message.decodedData, null, 2)}
                        </pre>
                      </div>
                    )}
                    {viewMode === 'hex' && (
                      <div>
                        <h5 className="text-sm font-medium mb-2">Hex Data</h5>
                        <div className="font-mono text-xs text-gray-700 bg-white p-2 rounded border">
                          {message.rawData}
                        </div>
                      </div>
                    )}
                    {viewMode === 'binary' && (
                      <div>
                        <h5 className="text-sm font-medium mb-2">Binary Data</h5>
                        <div className="font-mono text-xs text-gray-700 bg-white p-2 rounded border">
                          {message.informationElements[0]?.binaryValue || 'N/A'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Information Elements */}
                  {message.informationElements && message.informationElements.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium mb-2">Information Elements</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {message.informationElements.map((ie: any) => (
                          <div key={ie.name} className="bg-white border rounded p-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-xs font-medium">{ie.name}</span>
                              <div className="flex items-center space-x-1">
                                <Badge variant="outline" className="text-xs">
                                  {ie.type}
                                </Badge>
                                {ie.mandatory && (
                                  <Badge variant="destructive" className="text-xs">
                                    M
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-gray-600">
                              Value: {JSON.stringify(ie.value)}
                            </div>
                            <div className="text-xs text-blue-600">
                              {ie.standardReference}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Panel - Logs and Performance */}
        <div className="w-80 border-l border-gray-200 bg-gray-50">
          <Tabs defaultValue="logs" className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="logs" className="h-full">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Execution Logs</h3>
                  <div className="flex items-center space-x-2">
                    <select
                      value={logLevel}
                      onChange={(e) => setLogLevel(e.target.value as any)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="basic">Basic</option>
                      <option value="detailed">Detailed</option>
                      <option value="verbose">Verbose</option>
                    </select>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredLogs.map((log, index) => (
                  <div key={index} className={`text-xs p-2 rounded ${getLogLevelColor(log.level)}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{log.source}</span>
                      <span>{log.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <div className="mt-1">{log.message}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="h-full">
              <div className="p-4 space-y-4">
                <h3 className="font-semibold text-sm">Performance Metrics</h3>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Total Messages</span>
                      <span className="font-medium">{execution?.performanceMetrics?.totalMessages || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Success Rate</span>
                      <span className="font-medium text-green-600">
                        {execution?.performanceMetrics?.successRate || 0}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Error Rate</span>
                      <span className="font-medium text-red-600">
                        {execution?.performanceMetrics?.errorRate || 0}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Latency</span>
                      <span className="font-medium">
                        {execution?.performanceMetrics?.averageLatency || 0}ms
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border">
                    <h4 className="text-sm font-medium mb-2">Throughput</h4>
                    <div className="text-2xl font-bold text-blue-600">
                      {execution?.performanceMetrics?.throughput || 0} Mbps
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border">
                    <h4 className="text-sm font-medium mb-2">Latency Range</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Min</span>
                        <span>{execution?.performanceMetrics?.minLatency || 0}ms</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Max</span>
                        <span>{execution?.performanceMetrics?.maxLatency || 0}ms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProtocolAnalyzerViewer;