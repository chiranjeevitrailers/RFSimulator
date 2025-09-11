'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity, 
  Clock, 
  Server, 
  Database,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: number;
  activeConnections: number;
  totalRequests: number;
  errorRate: number;
}

interface UserActivity {
  date: string;
  activeUsers: number;
  newUsers: number;
  testExecutions: number;
}

interface SystemAnalyticsProps {
  metrics: SystemMetrics;
  userActivity: UserActivity[];
}

const SystemAnalytics: React.FC<SystemAnalyticsProps> = ({ metrics, userActivity }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusIcon = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return <XCircle className="w-4 h-4" />;
    if (value >= thresholds.warning) return <AlertTriangle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Analytics</h2>
          <p className="text-gray-600 mt-1">
            Monitor system performance and user activity
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CPU Usage */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Cpu className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">CPU Usage</h3>
                <p className="text-2xl font-bold text-gray-900">{metrics.cpu}%</p>
              </div>
            </div>
            <div className={getStatusColor(metrics.cpu, { warning: 70, critical: 90 })}>
              {getStatusIcon(metrics.cpu, { warning: 70, critical: 90 })}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                metrics.cpu >= 90 ? 'bg-red-500' :
                metrics.cpu >= 70 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${metrics.cpu}%` }}
            />
          </div>
        </div>

        {/* Memory Usage */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Memory</h3>
                <p className="text-2xl font-bold text-gray-900">{metrics.memory}%</p>
              </div>
            </div>
            <div className={getStatusColor(metrics.memory, { warning: 80, critical: 95 })}>
              {getStatusIcon(metrics.memory, { warning: 80, critical: 95 })}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                metrics.memory >= 95 ? 'bg-red-500' :
                metrics.memory >= 80 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${metrics.memory}%` }}
            />
          </div>
        </div>

        {/* Disk Usage */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Disk Usage</h3>
                <p className="text-2xl font-bold text-gray-900">{metrics.disk}%</p>
              </div>
            </div>
            <div className={getStatusColor(metrics.disk, { warning: 85, critical: 95 })}>
              {getStatusIcon(metrics.disk, { warning: 85, critical: 95 })}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                metrics.disk >= 95 ? 'bg-red-500' :
                metrics.disk >= 85 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${metrics.disk}%` }}
            />
          </div>
        </div>

        {/* Network */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Wifi className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Network</h3>
                <p className="text-2xl font-bold text-gray-900">{metrics.network}%</p>
              </div>
            </div>
            <div className={getStatusColor(metrics.network, { warning: 80, critical: 95 })}>
              {getStatusIcon(metrics.network, { warning: 80, critical: 95 })}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                metrics.network >= 95 ? 'bg-red-500' :
                metrics.network >= 80 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${metrics.network}%` }}
            />
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Server className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">Server Status</span>
              </div>
              <span className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                Online
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Database className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">Database</span>
              </div>
              <span className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                Healthy
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Wifi className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">API Endpoints</span>
              </div>
              <span className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                Operational
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">Uptime</span>
              </div>
              <span className="text-sm text-gray-900">{formatUptime(metrics.uptime)}</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Connections</span>
              <span className="text-sm font-medium text-gray-900">{metrics.activeConnections}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Requests (24h)</span>
              <span className="text-sm font-medium text-gray-900">{metrics.totalRequests.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Error Rate</span>
              <span className={`text-sm font-medium ${
                metrics.errorRate > 5 ? 'text-red-600' :
                metrics.errorRate > 1 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {metrics.errorRate}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Response Time</span>
              <span className="text-sm font-medium text-gray-900">45ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Activity Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity</h3>
        <div className="h-64 flex items-end space-x-2">
          {userActivity.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-200 rounded-t flex flex-col justify-end" style={{ height: '200px' }}>
                <div
                  className="bg-primary-600 rounded-t"
                  style={{ height: `${(day.activeUsers / Math.max(...userActivity.map(d => d.activeUsers))) * 200}px` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {day.activeUsers}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary-600 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Active Users</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">New Users</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Test Executions</span>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">High CPU Usage</p>
              <p className="text-xs text-yellow-600">CPU usage reached 85% at 2:30 PM</p>
            </div>
            <span className="text-xs text-yellow-600">2 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">System Recovery</p>
              <p className="text-xs text-green-600">All systems are now operating normally</p>
            </div>
            <span className="text-xs text-green-600">4 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Activity className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800">Peak Usage</p>
              <p className="text-xs text-blue-600">Record high user activity detected</p>
            </div>
            <span className="text-xs text-blue-600">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAnalytics;