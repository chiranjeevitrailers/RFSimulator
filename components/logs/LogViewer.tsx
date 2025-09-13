'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Settings,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Bug,
  Activity,
  Layers,
  MessageSquare,
  Code,
  Database,
  Network,
  Zap,
  Shield,
  Target,
  TrendingUp
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  source: string;
  layer: string;
  protocol: string;
  message: string;
  data: any;
  messageId?: string;
  stepId?: string;
  direction?: 'UL' | 'DL' | 'BIDIRECTIONAL';
  rawData?: string;
  decodedData?: any;
  informationElements?: any[];
  validationResult?: any;
  performanceData?: any;
}

interface LogViewerProps {
  executionId: string;
  testCaseId: string;
  userId: string;
  mode: 'basic' | 'enhanced';
  source?: 'srsran' | 'open5gs' | 'kamailio' | string;
}

const LogViewer: React.FC<LogViewerProps> = ({ 
  executionId, 
  testCaseId, 
  userId, 
  mode,
  source = 'srsran'
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Filters
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [layerFilter, setLayerFilter] = useState<string>('all');
  const [protocolFilter, setProtocolFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [timeRange, setTimeRange] = useState<{start: Date, end: Date} | null>(null);
  
  // View options
  const [showTimestamp, setShowTimestamp] = useState(true);
  const [showSource, setShowSource] = useState(true);
  const [showLayer, setShowLayer] = useState(true);
  const [showProtocol, setShowProtocol] = useState(true);
  const [showRawData, setShowRawData] = useState(false);
  const [showDecodedData, setShowDecodedData] = useState(true);
  const [showInformationElements, setShowInformationElements] = useState(true);
  const [showPerformanceData, setShowPerformanceData] = useState(false);
  
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8080';
    const wsBase = process.env.NEXT_PUBLIC_WS_URL || serverUrl.replace(/^http/, 'ws').replace(/:8080(?!\d)/, ':8081');

    let ws: WebSocket | null = null;
    let cancelled = false;

    async function bootstrap() {
      try {
        // Initial fetch of recent logs
        const resp = await fetch(`${serverUrl}/api/logs/${source}?limit=500`);
        if (resp.ok) {
          const data = await resp.json();
          if (!cancelled) {
            const normalized = (data || []).map((d: any) => ({
              id: d.id || `log_${Math.random().toString(36).slice(2)}`,
              timestamp: new Date(d.timestamp || Date.now()),
              level: (d.level || 'info').toLowerCase(),
              source: (d.source || source).toString().toUpperCase(),
              layer: (d.layer || 'RRC').toString().toUpperCase(),
              protocol: (d.protocol || 'NR-RRC').toString().toUpperCase(),
              message: d.message || '',
              data: d.data,
              messageId: d.messageId,
              stepId: d.stepId,
              direction: d.direction,
              rawData: d.raw || d.rawData,
              decodedData: d.decoded || d.decodedData,
              informationElements: d.informationElements,
              validationResult: d.validation || d.validationResult,
              performanceData: d.performance || d.performanceData,
            } as LogEntry));
            setLogs(normalized);
          }
        }
      } catch (e) {
        console.error('Initial log fetch failed:', e);
      }

      try {
        // Live WebSocket stream
        ws = new WebSocket(wsBase);
        ws.onmessage = (evt) => {
          try {
            const payload = JSON.parse(evt.data);
            if (payload?.type === 'log' && payload?.source) {
              if (payload.source !== source) return;
              const d = payload.data || {};
              // Optional execution/test case filtering
              if (executionId && d.executionId && d.executionId !== executionId) return;
              if (testCaseId && d.testCaseId && d.testCaseId !== testCaseId) return;
              const entry: LogEntry = {
                id: d.id || `log_${Math.random().toString(36).slice(2)}`,
                timestamp: new Date(d.timestamp || Date.now()),
                level: (d.level || 'info').toLowerCase(),
                source: (d.source || source).toString().toUpperCase(),
                layer: (d.layer || 'RRC').toString().toUpperCase(),
                protocol: (d.protocol || 'NR-RRC').toString().toUpperCase(),
                message: d.message || '',
                data: d.data,
                messageId: d.messageId,
                stepId: d.stepId,
                direction: d.direction,
                rawData: d.raw || d.rawData,
                decodedData: d.decoded || d.decodedData,
                informationElements: d.informationElements,
                validationResult: d.validation || d.validationResult,
                performanceData: d.performance || d.performanceData,
              };
              setLogs(prev => [...prev.slice(-999), entry]);
            }
          } catch (err) {
            // ignore malformed messages
          }
        };
        ws.onerror = () => {};
      } catch (e) {
        console.error('WebSocket connection failed:', e);
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
      try { ws && ws.close(); } catch {}
    };
  }, [executionId, testCaseId, source]);

  useEffect(() => {
    // Apply filters
    let filtered = logs;

    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    if (layerFilter !== 'all') {
      filtered = filtered.filter(log => log.layer === layerFilter);
    }

    if (protocolFilter !== 'all') {
      filtered = filtered.filter(log => log.protocol === protocolFilter);
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(log => log.source === sourceFilter);
    }

    if (searchText) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchText.toLowerCase()) ||
        log.data?.messageType?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (timeRange) {
      filtered = filtered.filter(log => 
        log.timestamp >= timeRange.start && log.timestamp <= timeRange.end
      );
    }

    setFilteredLogs(filtered);
  }, [logs, levelFilter, layerFilter, protocolFilter, sourceFilter, searchText, timeRange]);

  useEffect(() => {
    // Auto scroll to bottom
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-800 bg-red-100 border-red-200';
      case 'error': return 'text-red-700 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'info': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'debug': return 'text-gray-700 bg-gray-50 border-gray-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'critical': return <XCircle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'info': return <Info className="w-4 h-4" />;
      case 'debug': return <Bug className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getLayerColor = (layer: string) => {
    const colors: Record<string, string> = {
      'PHY': 'bg-red-100 text-red-800',
      'MAC': 'bg-orange-100 text-orange-800',
      'RLC': 'bg-yellow-100 text-yellow-800',
      'PDCP': 'bg-green-100 text-green-800',
      'RRC': 'bg-blue-100 text-blue-800',
      'NAS': 'bg-indigo-100 text-indigo-800'
    };
    return colors[layer] || 'bg-gray-100 text-gray-800';
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'UL': return '⬆️';
      case 'DL': return '⬇️';
      case 'BIDIRECTIONAL': return '↕️';
      default: return '↔️';
    }
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs_${executionId}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const clearLogs = () => {
    setLogs([]);
    setFilteredLogs([]);
  };

  return (
    <div className={`log-viewer ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">
                {mode === 'enhanced' ? 'Enhanced Log View' : 'Log View'}
              </h2>
              <Badge variant="outline" className="text-xs">
                {filteredLogs.length} logs
              </Badge>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={exportLogs}>
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={clearLogs}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoScroll(!autoScroll)}
            >
              {autoScroll ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 w-48"
            />
          </div>
          
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">All Levels</option>
            <option value="critical">Critical</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>

          <select
            value={layerFilter}
            onChange={(e) => setLayerFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">All Layers</option>
            <option value="PHY">PHY</option>
            <option value="MAC">MAC</option>
            <option value="RLC">RLC</option>
            <option value="PDCP">PDCP</option>
            <option value="RRC">RRC</option>
            <option value="NAS">NAS</option>
          </select>

          <select
            value={protocolFilter}
            onChange={(e) => setProtocolFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">All Protocols</option>
            <option value="NR-PHY">NR-PHY</option>
            <option value="NR-MAC">NR-MAC</option>
            <option value="NR-RLC">NR-RLC</option>
            <option value="NR-PDCP">NR-PDCP</option>
            <option value="NR-RRC">NR-RRC</option>
            <option value="5G-NAS">5G-NAS</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-screen">
        {/* Log List */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4" ref={logContainerRef}>
            <div className="space-y-2">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
                    selectedLog?.id === log.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
                  } ${getLevelColor(log.level)}`}
                  onClick={() => setSelectedLog(log)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center space-x-2">
                        {getLevelIcon(log.level)}
                        {showTimestamp && (
                          <span className="text-xs text-gray-600">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {showSource && (
                            <Badge variant="outline" className="text-xs">
                              {log.source}
                            </Badge>
                          )}
                          {showLayer && (
                            <Badge className={getLayerColor(log.layer)}>
                              {log.layer}
                            </Badge>
                          )}
                          {showProtocol && (
                            <Badge variant="outline" className="text-xs">
                              {log.protocol}
                            </Badge>
                          )}
                          {log.direction && (
                            <span className="text-sm">{getDirectionIcon(log.direction)}</span>
                          )}
                        </div>
                        
                        <div className="text-sm font-medium mb-1">{log.message}</div>
                        
                        {mode === 'enhanced' && log.data && (
                          <div className="text-xs text-gray-600">
                            {log.data.messageType} • Size: {log.data.size} bytes
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {log.performanceData && (
                        <div className="text-xs text-gray-600">
                          {log.performanceData.latency}ms
                        </div>
                      )}
                      {log.validationResult && (
                        <div className="flex items-center space-x-1">
                          {log.validationResult.isValid ? (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-600" />
                          )}
                          <span className="text-xs">
                            {log.validationResult.complianceScore}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Log Details Panel */}
        {selectedLog && (
          <div className="w-96 border-l border-gray-200 bg-gray-50">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-sm">Log Details</h3>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Basic Info */}
              <div className="bg-white rounded-lg p-3 border">
                <h4 className="font-medium text-sm mb-2">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timestamp:</span>
                    <span>{selectedLog.timestamp.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Level:</span>
                    <Badge className={getLevelColor(selectedLog.level)}>
                      {selectedLog.level}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Source:</span>
                    <span>{selectedLog.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Layer:</span>
                    <Badge className={getLayerColor(selectedLog.layer)}>
                      {selectedLog.layer}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Protocol:</span>
                    <span>{selectedLog.protocol}</span>
                  </div>
                </div>
              </div>

              {/* Message Data */}
              {selectedLog.data && (
                <div className="bg-white rounded-lg p-3 border">
                  <h4 className="font-medium text-sm mb-2">Message Data</h4>
                  <pre className="text-xs text-gray-700 overflow-x-auto">
                    {JSON.stringify(selectedLog.data, null, 2)}
                  </pre>
                </div>
              )}

              {/* Raw Data */}
              {showRawData && selectedLog.rawData && (
                <div className="bg-white rounded-lg p-3 border">
                  <h4 className="font-medium text-sm mb-2">Raw Data (Hex)</h4>
                  <div className="font-mono text-xs bg-gray-100 p-2 rounded">
                    {selectedLog.rawData}
                  </div>
                </div>
              )}

              {/* Decoded Data */}
              {showDecodedData && selectedLog.decodedData && (
                <div className="bg-white rounded-lg p-3 border">
                  <h4 className="font-medium text-sm mb-2">Decoded Data</h4>
                  <pre className="text-xs text-gray-700 overflow-x-auto">
                    {JSON.stringify(selectedLog.decodedData, null, 2)}
                  </pre>
                </div>
              )}

              {/* Information Elements */}
              {showInformationElements && selectedLog.informationElements && (
                <div className="bg-white rounded-lg p-3 border">
                  <h4 className="font-medium text-sm mb-2">Information Elements</h4>
                  <div className="space-y-2">
                    {selectedLog.informationElements.map((ie, index) => (
                      <div key={index} className="border rounded p-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs font-medium">{ie.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {ie.type}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          Value: {JSON.stringify(ie.value)}
                        </div>
                        <div className="text-xs text-gray-600">
                          Hex: {ie.hexValue}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {ie.mandatory && (
                            <Badge variant="destructive" className="text-xs">
                              Mandatory
                            </Badge>
                          )}
                          <Badge 
                            variant={ie.validationStatus === 'valid' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {ie.validationStatus}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Data */}
              {showPerformanceData && selectedLog.performanceData && (
                <div className="bg-white rounded-lg p-3 border">
                  <h4 className="font-medium text-sm mb-2">Performance Data</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Latency:</span>
                      <span>{selectedLog.performanceData.latency}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Time:</span>
                      <span>{selectedLog.performanceData.processingTime.toFixed(2)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Memory Usage:</span>
                      <span>{selectedLog.performanceData.memoryUsage.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">CPU Usage:</span>
                      <span>{selectedLog.performanceData.cpuUsage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Validation Result */}
              {selectedLog.validationResult && (
                <div className="bg-white rounded-lg p-3 border">
                  <h4 className="font-medium text-sm mb-2">Validation Result</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status:</span>
                      <div className="flex items-center space-x-2">
                        {selectedLog.validationResult.isValid ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span>{selectedLog.validationResult.isValid ? 'Valid' : 'Invalid'}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Compliance Score:</span>
                      <span>{selectedLog.validationResult.complianceScore}%</span>
                    </div>
                    {selectedLog.validationResult.errors.length > 0 && (
                      <div>
                        <span className="text-gray-600">Errors:</span>
                        <ul className="text-xs text-red-600 mt-1">
                          {selectedLog.validationResult.errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedLog.validationResult.warnings.length > 0 && (
                      <div>
                        <span className="text-gray-600">Warnings:</span>
                        <ul className="text-xs text-yellow-600 mt-1">
                          {selectedLog.validationResult.warnings.map((warning, index) => (
                            <li key={index}>• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogViewer;