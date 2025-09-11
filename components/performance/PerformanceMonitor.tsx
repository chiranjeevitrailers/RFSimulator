'use client';

import React, { useState, useEffect } from 'react';
import { PerformanceOptimizer } from '@/lib/performance-optimizer';
import { GlobalCacheManager } from '@/lib/cache-manager';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Database, 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Network, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Gauge,
  Thermometer,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Square,
  Maximize2,
  Minimize2,
  Download,
  Upload,
  Server,
  Monitor,
  Smartphone,
  Globe,
  Shield,
  Bell,
  Info,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Share,
  Copy,
  ExternalLink,
  Filter,
  Search,
  Calendar,
  FileText,
  BarChart,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PerformanceMonitorProps {
  userId: string;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ userId }) => {
  const [performanceOptimizer] = useState(() => PerformanceOptimizer.getInstance());
  const [cacheManager] = useState(() => GlobalCacheManager.getInstance());
  const [metrics, setMetrics] = useState<any>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [optimizationHistory, setOptimizationHistory] = useState<any[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [selectedMetric, setSelectedMetric] = useState('responseTime');
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [expandedChart, setExpandedChart] = useState<string | null>(null);

  useEffect(() => {
    loadPerformanceData();
    setupMonitoring();
    
    return () => {
      cleanupMonitoring();
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMonitoring) {
      interval = setInterval(() => {
        loadPerformanceData();
      }, 5000); // Update every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring]);

  const loadPerformanceData = () => {
    try {
      const currentMetrics = performanceOptimizer.getMetrics();
      const currentConfig = performanceOptimizer.getConfig();
      const currentCacheStats = cacheManager.getAllStats();
      const currentHistory = performanceOptimizer.getOptimizationHistory();
      
      setMetrics(currentMetrics);
      setConfig(currentConfig);
      setCacheStats(currentCacheStats);
      setOptimizationHistory(currentHistory);
      
      // Check for alerts
      checkAlerts(currentMetrics);
    } catch (error) {
      console.error('Failed to load performance data:', error);
    }
  };

  const setupMonitoring = () => {
    // Setup event listeners for real-time updates
    // This would be implemented based on the actual event system
  };

  const cleanupMonitoring = () => {
    // Cleanup event listeners
  };

  const checkAlerts = (currentMetrics: any) => {
    const newAlerts: any[] = [];
    
    if (currentMetrics.responseTime > 2000) {
      newAlerts.push({
        type: 'warning',
        message: 'Response time is high (>2s)',
        timestamp: new Date(),
        metric: 'responseTime',
        value: currentMetrics.responseTime
      });
    }
    
    if (currentMetrics.cacheHitRate < 70) {
      newAlerts.push({
        type: 'warning',
        message: 'Cache hit rate is low (<70%)',
        timestamp: new Date(),
        metric: 'cacheHitRate',
        value: currentMetrics.cacheHitRate
      });
    }
    
    if (currentMetrics.errorRate > 5) {
      newAlerts.push({
        type: 'error',
        message: 'Error rate is high (>5%)',
        timestamp: new Date(),
        metric: 'errorRate',
        value: currentMetrics.errorRate
      });
    }
    
    if (currentMetrics.memoryUsage > 200 * 1024 * 1024) { // 200MB
      newAlerts.push({
        type: 'warning',
        message: 'Memory usage is high (>200MB)',
        timestamp: new Date(),
        metric: 'memoryUsage',
        value: currentMetrics.memoryUsage
      });
    }
    
    setAlerts(newAlerts);
  };

  const handleOptimize = async () => {
    try {
      const result = performanceOptimizer.analyzePerformance();
      setOptimizationHistory(prev => [...prev, result]);
    } catch (error) {
      console.error('Failed to run optimization analysis:', error);
    }
  };

  const handleClearCache = () => {
    cacheManager.clearAll();
    loadPerformanceData();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getMetricColor = (metric: string, value: number) => {
    switch (metric) {
      case 'responseTime':
        return value > 1000 ? 'text-red-600' : value > 500 ? 'text-yellow-600' : 'text-green-600';
      case 'cacheHitRate':
        return value > 80 ? 'text-green-600' : value > 60 ? 'text-yellow-600' : 'text-red-600';
      case 'errorRate':
        return value > 5 ? 'text-red-600' : value > 2 ? 'text-yellow-600' : 'text-green-600';
      case 'memoryUsage':
        return value > 200 * 1024 * 1024 ? 'text-red-600' : value > 100 * 1024 * 1024 ? 'text-yellow-600' : 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Performance Monitor</h2>
              <p className="text-sm text-gray-500">Real-time performance metrics and optimization</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsMonitoring(!isMonitoring)}
            >
              {isMonitoring ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isMonitoring ? 'Pause' : 'Resume'}
            </Button>
            <Button
              variant="outline"
              onClick={handleOptimize}
            >
              <Zap className="w-4 h-4 mr-2" />
              Optimize
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Alerts</h3>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  alert.type === 'error' ? 'bg-red-50 border border-red-200' :
                  alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-blue-50 border border-blue-200'
                }`}
              >
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(alert.timestamp).toLocaleString()} • {alert.metric}: {alert.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Response Time</p>
                <p className={`text-2xl font-bold ${getMetricColor('responseTime', metrics.responseTime)}`}>
                  {formatDuration(metrics.responseTime)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cache Hit Rate</p>
                <p className={`text-2xl font-bold ${getMetricColor('cacheHitRate', metrics.cacheHitRate)}`}>
                  {metrics.cacheHitRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MemoryStick className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Memory Usage</p>
                <p className={`text-2xl font-bold ${getMetricColor('memoryUsage', metrics.memoryUsage)}`}>
                  {formatBytes(metrics.memoryUsage)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Throughput</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(metrics.throughput)}/s
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cache Statistics */}
      {cacheStats && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Cache Statistics</h3>
            <Button
              variant="outline"
              onClick={handleClearCache}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cache
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(cacheStats).map(([cacheName, stats]: [string, any]) => (
              <div key={cacheName} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 capitalize">
                  {cacheName.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Hit Rate:</span>
                    <span className="font-medium">{stats.hitRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Entries:</span>
                    <span className="font-medium">{stats.entryCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">{formatBytes(stats.totalSize)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Evictions:</span>
                    <span className="font-medium">{stats.evictions}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Charts */}
      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Response Time Trend</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpandedChart(
                  expandedChart === 'responseTime' ? null : 'responseTime'
                )}
              >
                {expandedChart === 'responseTime' ? 
                  <Minimize2 className="w-4 h-4" /> : 
                  <Maximize2 className="w-4 h-4" />
                }
              </Button>
            </div>
            
            <div className={`${expandedChart === 'responseTime' ? 'h-96' : 'h-64'}`}>
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <LineChart className="w-16 h-16 mx-auto mb-2 text-gray-300" />
                  <p>Response time trend chart</p>
                  <p className="text-sm">Current: {formatDuration(metrics.responseTime)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Cache Performance</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpandedChart(
                  expandedChart === 'cachePerformance' ? null : 'cachePerformance'
                )}
              >
                {expandedChart === 'cachePerformance' ? 
                  <Minimize2 className="w-4 h-4" /> : 
                  <Maximize2 className="w-4 h-4" />
                }
              </Button>
            </div>
            
            <div className={`${expandedChart === 'cachePerformance' ? 'h-96' : 'h-64'}`}>
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <PieChart className="w-16 h-16 mx-auto mb-2 text-gray-300" />
                  <p>Cache performance chart</p>
                  <p className="text-sm">Hit Rate: {metrics.cacheHitRate.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Optimization History */}
      {optimizationHistory.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Response Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cache Hit Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Memory Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recommendations
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {optimizationHistory.slice(-10).reverse().map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date().toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDuration(result.after.responseTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.after.cacheHitRate.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatBytes(result.after.memoryUsage)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.recommendations.length} recommendations
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Performance Settings</h3>
              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
              >
                Close
              </Button>
            </div>

            {config && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Concurrent Requests
                    </label>
                    <input
                      type="number"
                      value={config.maxConcurrentRequests}
                      onChange={(e) => setConfig({
                        ...config,
                        maxConcurrentRequests: parseInt(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Timeout (ms)
                    </label>
                    <input
                      type="number"
                      value={config.requestTimeout}
                      onChange={(e) => setConfig({
                        ...config,
                        requestTimeout: parseInt(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.enableCaching}
                      onChange={(e) => setConfig({
                        ...config,
                        enableCaching: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable Caching</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.enableCompression}
                      onChange={(e) => setConfig({
                        ...config,
                        enableCompression: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable Compression</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.enableLazyLoading}
                      onChange={(e) => setConfig({
                        ...config,
                        enableLazyLoading: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable Lazy Loading</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.enablePrefetching}
                      onChange={(e) => setConfig({
                        ...config,
                        enablePrefetching: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable Prefetching</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.enableBatchProcessing}
                      onChange={(e) => setConfig({
                        ...config,
                        enableBatchProcessing: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable Batch Processing</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSettings(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      performanceOptimizer.updateConfig(config);
                      setShowSettings(false);
                    }}
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;