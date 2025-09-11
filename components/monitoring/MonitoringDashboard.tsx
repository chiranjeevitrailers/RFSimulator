'use client';

import React, { useState, useEffect } from 'react';
import { MonitoringSystem, SystemMetrics, Alert, AlertRule, HealthCheck } from '@/lib/monitoring-system';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Network, 
  Database, 
  Server, 
  Zap, 
  Bell, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Filter, 
  Search, 
  Download, 
  Upload, 
  Save, 
  Copy, 
  Share, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  ChevronDown, 
  ChevronRight, 
  Globe, 
  Mail, 
  MessageSquare, 
  Webhook, 
  Smartphone, 
  Monitor, 
  Smartphone as SmartphoneIcon, 
  Globe as GlobeIcon, 
  Bell as BellIcon, 
  Info as InfoIcon, 
  AlertCircle as AlertCircleIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MonitoringDashboardProps {
  userId: string;
}

const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({ userId }) => {
  const [monitoringSystem] = useState(() => MonitoringSystem.getInstance());
  const [metrics, setMetrics] = useState<SystemMetrics[]>([]);
  const [latestMetrics, setLatestMetrics] = useState<SystemMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [selectedMetric, setSelectedMetric] = useState('cpu');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showHealthCheckModal, setShowHealthCheckModal] = useState(false);
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMonitoringData();
    setupRealTimeUpdates();
    
    return () => {
      cleanupRealTimeUpdates();
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMonitoring) {
      interval = setInterval(() => {
        loadMonitoringData();
      }, 30000); // Update every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring]);

  const loadMonitoringData = async () => {
    try {
      setIsLoading(true);
      
      const currentMetrics = monitoringSystem.getMetrics();
      const currentLatestMetrics = monitoringSystem.getLatestMetrics();
      const currentAlerts = monitoringSystem.getAlerts();
      const currentAlertRules = monitoringSystem.getAlertRules();
      const currentHealthChecks = monitoringSystem.getHealthChecks();
      const currentIsMonitoring = monitoringSystem.isMonitoringActive();
      
      setMetrics(currentMetrics);
      setLatestMetrics(currentLatestMetrics);
      setAlerts(currentAlerts);
      setAlertRules(currentAlertRules);
      setHealthChecks(currentHealthChecks);
      setIsMonitoring(currentIsMonitoring);
      
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    // Setup real-time monitoring updates
    // This would be implemented with WebSocket or Server-Sent Events
  };

  const cleanupRealTimeUpdates = () => {
    // Cleanup real-time monitoring
  };

  const handleStartMonitoring = async () => {
    try {
      await monitoringSystem.startMonitoring();
      setIsMonitoring(true);
    } catch (error) {
      console.error('Failed to start monitoring:', error);
    }
  };

  const handleStopMonitoring = async () => {
    try {
      await monitoringSystem.stopMonitoring();
      setIsMonitoring(false);
    } catch (error) {
      console.error('Failed to stop monitoring:', error);
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    // This would update the alert in the database
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'acknowledged', acknowledgedAt: new Date(), acknowledgedBy: userId }
        : alert
    ));
  };

  const handleResolveAlert = async (alertId: string) => {
    // This would update the alert in the database
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'resolved', resolvedAt: new Date() }
        : alert
    ));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'unhealthy':
        return 'text-red-600 bg-red-100';
      case 'unknown':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getMetricColor = (value: number, threshold: number) => {
    if (value > threshold) return 'text-red-600';
    if (value > threshold * 0.8) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (isLoading && !latestMetrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Monitoring Dashboard</h2>
              <p className="text-sm text-gray-500">System monitoring and alerting</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">
                {isMonitoring ? 'Monitoring Active' : 'Monitoring Stopped'}
              </span>
            </div>
            {isMonitoring ? (
              <Button
                variant="outline"
                onClick={handleStopMonitoring}
              >
                <Pause className="w-4 h-4 mr-2" />
                Stop
              </Button>
            ) : (
              <Button
                onClick={handleStartMonitoring}
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            )}
            <Button
              variant="outline"
              onClick={loadMonitoringData}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* System Metrics Overview */}
      {latestMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Cpu className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">CPU Usage</p>
                <p className={`text-2xl font-bold ${getMetricColor(latestMetrics.cpu.usage, 80)}`}>
                  {latestMetrics.cpu.usage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MemoryStick className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Memory Usage</p>
                <p className={`text-2xl font-bold ${getMetricColor(latestMetrics.memory.usage, 85)}`}>
                  {latestMetrics.memory.usage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Disk Usage</p>
                <p className={`text-2xl font-bold ${getMetricColor(latestMetrics.disk.usage, 90)}`}>
                  {latestMetrics.disk.usage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Network className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Network I/O</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatBytes(latestMetrics.network.bytesIn + latestMetrics.network.bytesOut)}/s
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerts */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowAlertModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </div>
        
        {alerts.filter(alert => alert.status === 'active').length > 0 ? (
          <div className="space-y-3">
            {alerts
              .filter(alert => alert.status === 'active')
              .slice(0, 10)
              .map((alert) => (
              <div
                key={alert.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{alert.title}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(alert.triggeredAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Acknowledge
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolveAlert(alert.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedAlert(
                        expandedAlert === alert.id ? null : alert.id
                      )}
                    >
                      {expandedAlert === alert.id ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                      }
                    </Button>
                  </div>
                </div>
                
                {expandedAlert === alert.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Alert Details</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><strong>Rule ID:</strong> {alert.ruleId}</p>
                          <p><strong>Severity:</strong> {alert.severity}</p>
                          <p><strong>Status:</strong> {alert.status}</p>
                          <p><strong>Triggered:</strong> {new Date(alert.triggeredAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Metadata</h4>
                        <div className="bg-gray-50 p-2 rounded text-sm">
                          <pre className="text-gray-700 overflow-auto">
                            {JSON.stringify(alert.metadata, null, 2)}
                          </pre>
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
            <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Active Alerts</h4>
            <p className="text-gray-500">All systems are operating normally.</p>
          </div>
        )}
      </div>

      {/* Health Checks */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Health Checks</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowHealthCheckModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Check
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {healthChecks.map((healthCheck) => (
            <div key={healthCheck.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{healthCheck.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(healthCheck.status)}`}>
                  {healthCheck.status.toUpperCase()}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Type:</strong> {healthCheck.type}</p>
                <p><strong>Last Check:</strong> {new Date(healthCheck.lastCheck).toLocaleString()}</p>
                <p><strong>Response Time:</strong> {formatDuration(healthCheck.responseTime)}</p>
                {healthCheck.error && (
                  <p className="text-red-600"><strong>Error:</strong> {healthCheck.error}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Rules */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Rules</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Threshold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alertRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {rule.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rule.metric}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rule.condition.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rule.threshold}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(rule.severity)}`}>
                      {rule.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rule.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.enabled ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Metrics Charts */}
      {metrics.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Metrics Trends</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">CPU Usage</h4>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center text-gray-500">
                  <TrendingUp className="w-16 h-16 mx-auto mb-2 text-gray-300" />
                  <p>CPU usage trend chart</p>
                  <p className="text-sm">Data points: {metrics.length}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Memory Usage</h4>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center text-gray-500">
                  <TrendingUp className="w-16 h-16 mx-auto mb-2 text-gray-300" />
                  <p>Memory usage trend chart</p>
                  <p className="text-sm">Data points: {metrics.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoringDashboard;