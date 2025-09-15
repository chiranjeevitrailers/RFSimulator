'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Activity, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const AnalyticsView: React.FC<{
  appState: any;
  onStateChange: (state: any) => void;
}> = ({ appState, onStateChange }) => {
  const [analyticsData, setAnalyticsData] = useState({
    throughput: {
      current: 125.5,
      average: 98.3,
      peak: 156.7,
      trend: 'up'
    },
    latency: {
      current: 12.3,
      average: 15.8,
      peak: 25.4,
      trend: 'down'
    },
    errorRate: {
      current: 2.1,
      average: 3.5,
      peak: 8.2,
      trend: 'down'
    },
    successRate: {
      current: 97.9,
      average: 96.5,
      peak: 99.2,
      trend: 'up'
    }
  });

  const [timeRange, setTimeRange] = useState('1h');

  const metrics = [
    {
      title: 'Throughput',
      value: `${analyticsData.throughput.current} Mbps`,
      change: '+12.5%',
      trend: analyticsData.throughput.trend,
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Latency',
      value: `${analyticsData.latency.current} ms`,
      change: '-8.2%',
      trend: analyticsData.latency.trend,
      icon: Clock,
      color: 'green'
    },
    {
      title: 'Error Rate',
      value: `${analyticsData.errorRate.current}%`,
      change: '-15.3%',
      trend: analyticsData.errorRate.trend,
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Success Rate',
      value: `${analyticsData.successRate.current}%`,
      change: '+2.1%',
      trend: analyticsData.successRate.trend,
      icon: CheckCircle,
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'red':
        return 'bg-red-100 text-red-600';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">LIVE</span>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Time Range:</span>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="15m">Last 15 minutes</option>
          <option value="1h">Last hour</option>
          <option value="6h">Last 6 hours</option>
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
        </select>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getColorClasses(metric.color)}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <div className="flex items-center">
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs last period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Throughput Chart */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Throughput Over Time</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Chart visualization will be implemented here</p>
              <p className="text-sm text-gray-500">Real-time throughput data</p>
            </div>
          </div>
        </div>

        {/* Latency Chart */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Latency Distribution</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Chart visualization will be implemented here</p>
              <p className="text-sm text-gray-500">Latency histogram and trends</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">97.9%</div>
            <div className="text-sm text-gray-600">Overall Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">125.5 Mbps</div>
            <div className="text-sm text-gray-600">Average Throughput</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">12.3 ms</div>
            <div className="text-sm text-gray-600">Average Latency</div>
          </div>
        </div>
      </div>

      {/* Top Issues */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Issues</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <div className="font-medium text-gray-900">High PUCCH Decode Failures</div>
                <div className="text-sm text-gray-600">PHY Layer - 15 occurrences</div>
              </div>
            </div>
            <div className="text-sm text-red-600 font-medium">Critical</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <div>
                <div className="font-medium text-gray-900">Scheduling Latency Warnings</div>
                <div className="text-sm text-gray-600">MAC Layer - 8 occurrences</div>
              </div>
            </div>
            <div className="text-sm text-yellow-600 font-medium">Warning</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-blue-500" />
              <div>
                <div className="font-medium text-gray-900">RLC Retransmissions</div>
                <div className="text-sm text-gray-600">RLC Layer - 3 occurrences</div>
              </div>
            </div>
            <div className="text-sm text-blue-600 font-medium">Info</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;