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

// Import the DataFormatAdapter
import { LogViewerIntegration, useDataFormatAdapter } from '@/utils/DataFormatAdapterIntegration';

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
  logs?: LogEntry[];
  rawLogs?: any[]; // Raw logs from backend that need adaptation
  onLogSelect?: (log: LogEntry) => void;
  onFilterChange?: (filters: LogFilters) => void;
  realTime?: boolean;
  maxHeight?: string;
  showFilters?: boolean;
  showExport?: boolean;
  className?: string;
}

interface LogFilters {
  level?: string;
  layer?: string;
  protocol?: string;
  source?: string;
  timeRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

const LogViewerWithAdapter: React.FC<LogViewerProps> = ({
  logs: providedLogs = [],
  rawLogs = [],
  onLogSelect,
  onFilterChange,
  realTime = false,
  maxHeight = '600px',
  showFilters = true,
  showExport = true,
  className = ''
}) => {
  // Use the DataFormatAdapter hook
  const { processLogs, validateData } = useDataFormatAdapter();
  
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [filters, setFilters] = useState<LogFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showRawData, setShowRawData] = useState(false);
  const [groupByLayer, setGroupByLayer] = useState(false);
  const [sortBy, setSortBy] = useState<'timestamp' | 'level' | 'layer'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({
    total: 0,
    byLevel: {} as Record<string, number>,
    byLayer: {} as Record<string, number>,
    byProtocol: {} as Record<string, number>
  });

  // Process raw logs using DataFormatAdapter
  useEffect(() => {
    if (rawLogs.length > 0) {
      const processedLogs = processLogs(rawLogs);
      setLogs(processedLogs);
    } else if (providedLogs.length > 0) {
      setLogs(providedLogs);
    }
  }, [rawLogs, providedLogs, processLogs]);

  // Update filtered logs when logs or filters change
  useEffect(() => {
    let filtered = [...logs];

    // Apply filters
    if (filters.level) {
      filtered = filtered.filter(log => log.level === filters.level);
    }
    if (filters.layer) {
      filtered = filtered.filter(log => log.layer === filters.layer);
    }
    if (filters.protocol) {
      filtered = filtered.filter(log => log.protocol === filters.protocol);
    }
    if (filters.source) {
      filtered = filtered.filter(log => log.source === filters.source);
    }
    if (filters.timeRange) {
      filtered = filtered.filter(log => 
        log.timestamp >= filters.timeRange!.start && 
        log.timestamp <= filters.timeRange!.end
      );
    }
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.layer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort logs
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'timestamp':
          comparison = a.timestamp.getTime() - b.timestamp.getTime();
          break;
        case 'level':
          const levelOrder = { critical: 0, error: 1, warning: 2, info: 3, debug: 4 };
          comparison = levelOrder[a.level] - levelOrder[b.level];
          break;
        case 'layer':
          comparison = a.layer.localeCompare(b.layer);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredLogs(filtered);
  }, [logs, filters, searchTerm, sortBy, sortOrder]);

  // Update statistics
  useEffect(() => {
    const newStats = {
      total: logs.length,
      byLevel: {} as Record<string, number>,
      byLayer: {} as Record<string, number>,
      byProtocol: {} as Record<string, number>
    };

    logs.forEach(log => {
      newStats.byLevel[log.level] = (newStats.byLevel[log.level] || 0) + 1;
      newStats.byLayer[log.layer] = (newStats.byLayer[log.layer] || 0) + 1;
      newStats.byProtocol[log.protocol] = (newStats.byProtocol[log.protocol] || 0) + 1;
    });

    setStats(newStats);
  }, [logs]);

  // Auto-scroll to bottom for real-time logs
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  // Handle log selection
  const handleLogSelect = (log: LogEntry) => {
    setSelectedLog(log);
    onLogSelect?.(log);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<LogFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  // Export logs
  const exportLogs = () => {
    const exportData = filteredLogs.map(log => ({
      timestamp: log.timestamp.toISOString(),
      level: log.level,
      source: log.source,
      layer: log.layer,
      protocol: log.protocol,
      message: log.message,
      data: log.data,
      messageId: log.messageId,
      stepId: log.stepId,
      direction: log.direction
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get level icon
  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      case 'debug': return <Bug className="w-4 h-4 text-gray-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get level badge color
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'debug': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Group logs by layer
  const groupedLogs = groupByLayer 
    ? filteredLogs.reduce((groups, log) => {
        const layer = log.layer;
        if (!groups[layer]) groups[layer] = [];
        groups[layer].push(log);
        return groups;
      }, {} as Record<string, LogEntry[]>)
    : { 'All': filteredLogs };

  return (
    <div className={`log-viewer ${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      <Card className={isFullscreen ? 'h-full' : ''}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Log Viewer
              {realTime && <Badge variant="secondary" className="ml-2">Real-time</Badge>}
            </CardTitle>
            <div className="flex items-center gap-2">
              {showExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportLogs}
                  disabled={filteredLogs.length === 0}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Logs</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {(stats.byLevel.error || 0) + (stats.byLevel.critical || 0)}
              </div>
              <div className="text-sm text-red-600">Errors</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.byLevel.warning || 0}</div>
              <div className="text-sm text-yellow-600">Warnings</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.byLevel.info || 0}</div>
              <div className="text-sm text-blue-600">Info</div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={filters.level || ''}
                  onChange={(e) => handleFilterChange({ level: e.target.value || undefined })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Levels</option>
                  <option value="critical">Critical</option>
                  <option value="error">Error</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                </select>
                <select
                  value={filters.layer || ''}
                  onChange={(e) => handleFilterChange({ layer: e.target.value || undefined })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Layers</option>
                  {Object.keys(stats.byLayer).map(layer => (
                    <option key={layer} value={layer}>{layer}</option>
                  ))}
                </select>
                <select
                  value={filters.protocol || ''}
                  onChange={(e) => handleFilterChange({ protocol: e.target.value || undefined })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Protocols</option>
                  {Object.keys(stats.byProtocol).map(protocol => (
                    <option key={protocol} value={protocol}>{protocol}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={groupByLayer}
                    onChange={(e) => setGroupByLayer(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Group by Layer</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={autoScroll}
                    onChange={(e) => setAutoScroll(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Auto-scroll</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showRawData}
                    onChange={(e) => setShowRawData(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Raw Data</span>
                </label>
              </div>
            </div>
          )}

          {/* Logs Display */}
          <Tabs defaultValue="logs" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="logs">Logs ({filteredLogs.length})</TabsTrigger>
              <TabsTrigger value="details" disabled={!selectedLog}>
                Details {selectedLog && `(${selectedLog.id})`}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="logs" className="mt-4">
              <div
                ref={logContainerRef}
                className="border border-gray-200 rounded-lg overflow-auto"
                style={{ maxHeight }}
              >
                {Object.entries(groupedLogs).map(([layer, layerLogs]) => (
                  <div key={layer}>
                    {groupByLayer && (
                      <div className="sticky top-0 bg-gray-100 px-4 py-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4" />
                          <span className="font-medium">{layer}</span>
                          <Badge variant="secondary">{layerLogs.length}</Badge>
                        </div>
                      </div>
                    )}
                    
                    {layerLogs.map((log) => (
                      <div
                        key={log.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                          selectedLog?.id === log.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={() => handleLogSelect(log)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getLevelIcon(log.level)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={getLevelBadgeColor(log.level)}>
                                {log.level.toUpperCase()}
                              </Badge>
                              <Badge variant="outline">{log.layer}</Badge>
                              <Badge variant="outline">{log.protocol}</Badge>
                              {log.direction && (
                                <Badge variant="outline">{log.direction}</Badge>
                              )}
                              <span className="text-xs text-gray-500">
                                {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'N/A'}
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-900 mb-2">
                              {log.message}
                            </div>
                            
                            {log.messageId && (
                              <div className="text-xs text-gray-500">
                                Message ID: {log.messageId}
                              </div>
                            )}
                            
                            {showRawData && log.rawData && (
                              <details className="mt-2">
                                <summary className="text-xs text-gray-500 cursor-pointer">
                                  Raw Data
                                </summary>
                                <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                                  {typeof log.rawData === 'string' ? log.rawData : JSON.stringify(log.rawData, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                
                {filteredLogs.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No logs found matching the current filters.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="mt-4">
              {selectedLog && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">ID:</span> {selectedLog.id}</div>
                        <div><span className="font-medium">Timestamp:</span> {selectedLog.timestamp.toISOString()}</div>
                        <div><span className="font-medium">Level:</span> {selectedLog.level}</div>
                        <div><span className="font-medium">Source:</span> {selectedLog.source}</div>
                        <div><span className="font-medium">Layer:</span> {selectedLog.layer}</div>
                        <div><span className="font-medium">Protocol:</span> {selectedLog.protocol}</div>
                        {selectedLog.direction && (
                          <div><span className="font-medium">Direction:</span> {selectedLog.direction}</div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Message Details</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Message:</span> {selectedLog.message}</div>
                        {selectedLog.messageId && (
                          <div><span className="font-medium">Message ID:</span> {selectedLog.messageId}</div>
                        )}
                        {selectedLog.stepId && (
                          <div><span className="font-medium">Step ID:</span> {selectedLog.stepId}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {selectedLog.data && Object.keys(selectedLog.data).length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Data</h4>
                      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                        {JSON.stringify(selectedLog.data, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {selectedLog.informationElements && selectedLog.informationElements.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Information Elements</h4>
                      <div className="space-y-2">
                        {selectedLog.informationElements.map((ie, index) => (
                          <div key={index} className="bg-gray-100 p-3 rounded-lg">
                            <div className="font-medium">{ie.ie_name || ie.name}</div>
                            <div className="text-sm text-gray-600">
                              Type: {ie.ie_type || ie.type} | Value: {JSON.stringify(ie.ie_value || ie.value)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedLog.performanceData && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Performance Data</h4>
                      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                        {JSON.stringify(selectedLog.performanceData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogViewerWithAdapter;