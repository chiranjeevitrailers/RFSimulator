'use client';

import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, Minus, Wifi, Signal, Zap } from 'lucide-react';

interface LayerParameterUpdate {
  layer: string;
  parameterName: string;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercent: number;
  timestamp: number;
  unit: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface LayerStatistics {
  layer: string;
  metricName: string;
  value: number;
  unit: string;
  timestamp: number;
  trend?: 'increasing' | 'decreasing' | 'stable';
  change?: number;
  changePercent?: number;
}

const LayerParameterMonitor: React.FC = () => {
  const [parameters, setParameters] = useState<LayerParameterUpdate[]>([]);
  const [statistics, setStatistics] = useState<LayerStatistics[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    // Subscribe to layer parameter updates
    const handleLayerParameterUpdate = (event: CustomEvent) => {
      const update = event.detail.data;
      setParameters(prev => [update, ...prev.slice(0, 99)]); // Keep last 100 updates
      setLastUpdate(new Date());
      setIsConnected(true);
    };

    const handleLayerStatisticsUpdate = (event: CustomEvent) => {
      const stats = event.detail.data;
      setStatistics(prev => [stats, ...prev.slice(0, 99)]); // Keep last 100 stats
    };

    // Listen for DataFlowManager events
    window.addEventListener('dataFlowEvent', (event: CustomEvent) => {
      if (event.detail.type === 'LAYER_PARAMETER_UPDATE') {
        handleLayerParameterUpdate(event);
      } else if (event.detail.type === 'LAYER_STATISTICS_UPDATE') {
        handleLayerStatisticsUpdate(event);
      }
    });

    return () => {
      window.removeEventListener('dataFlowEvent', handleLayerParameterUpdate as EventListener);
      window.removeEventListener('dataFlowEvent', handleLayerStatisticsUpdate as EventListener);
    };
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-green-600';
      case 'decreasing':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getLayerIcon = (layer: string) => {
    switch (layer) {
      case 'PHY':
        return <Signal className="w-4 h-4 text-blue-500" />;
      case 'MAC':
        return <Activity className="w-4 h-4 text-green-500" />;
      case 'RLC':
        return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'PDCP':
        return <Wifi className="w-4 h-4 text-purple-500" />;
      case 'RRC':
        return <Activity className="w-4 h-4 text-orange-500" />;
      case 'NAS':
        return <Activity className="w-4 h-4 text-pink-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatValue = (value: number, unit: string): string => {
    if (unit === 'ratio' || unit === 'success') {
      return (value * 100).toFixed(2) + '%';
    }
    if (unit === 'dBm' || unit === 'dB') {
      return value.toFixed(1) + ' ' + unit;
    }
    if (unit === 'Mbps') {
      return value.toFixed(1) + ' ' + unit;
    }
    if (unit === 'ms') {
      return value.toFixed(0) + ' ' + unit;
    }
    if (unit === 'count' || unit === 'index' || unit === 'state' || unit === 'mode') {
      return value.toFixed(0) + ' ' + unit;
    }
    return value.toFixed(2) + ' ' + unit;
  };

  const getParameterColor = (parameterName: string, value: number): string => {
    // Color coding based on parameter type and value
    if (parameterName.includes('rsrp')) {
      return value > -80 ? 'text-green-600' : value > -100 ? 'text-yellow-600' : 'text-red-600';
    }
    if (parameterName.includes('rsrq')) {
      return value > -8 ? 'text-green-600' : value > -12 ? 'text-yellow-600' : 'text-red-600';
    }
    if (parameterName.includes('sinr')) {
      return value > 15 ? 'text-green-600' : value > 5 ? 'text-yellow-600' : 'text-red-600';
    }
    if (parameterName.includes('cqi')) {
      return value > 10 ? 'text-green-600' : value > 5 ? 'text-yellow-600' : 'text-red-600';
    }
    if (parameterName.includes('throughput')) {
      return value > 20 ? 'text-green-600' : value > 10 ? 'text-yellow-600' : 'text-red-600';
    }
    if (parameterName.includes('rate') || parameterName.includes('utilization')) {
      return value < 0.1 ? 'text-green-600' : value < 0.5 ? 'text-yellow-600' : 'text-red-600';
    }
    return 'text-gray-600';
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Layer Parameter Monitor</h2>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {isConnected ? 'Live' : 'Disconnected'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {parameters.length} updates
            </span>
            {lastUpdate && (
              <span className="text-xs text-gray-500">
                Last: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Real-time Parameters */}
        <div className="w-1/2 border-r border-gray-200 bg-white">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Real-time Parameters</h3>
            <p className="text-sm text-gray-600">Live layer parameter updates</p>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {parameters.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <Activity className="w-6 h-6 text-gray-400" />
                <span className="ml-2 text-gray-600">No parameter updates yet</span>
              </div>
            ) : (
              <div className="space-y-2">
                {parameters.map((param, index) => (
                  <div key={`${param.timestamp}-${index}`} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getLayerIcon(param.layer)}
                        <span className="font-medium text-gray-900">{param.layer}</span>
                        <span className="text-sm text-gray-600">{param.parameterName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(param.trend)}
                        <span className="text-xs text-gray-500">
                          {new Date(param.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className={`text-lg font-bold ${getParameterColor(param.parameterName, param.currentValue)}`}>
                          {formatValue(param.currentValue, param.unit)}
                        </span>
                        {param.change !== 0 && (
                          <span className={`text-sm ${getTrendColor(param.trend)}`}>
                            {param.change > 0 ? '+' : ''}{formatValue(param.change, param.unit)}
                            ({param.changePercent > 0 ? '+' : ''}{param.changePercent.toFixed(1)}%)
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Prev: {formatValue(param.previousValue, param.unit)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Layer Statistics */}
        <div className="w-1/2 bg-white">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Layer Statistics</h3>
            <p className="text-sm text-gray-600">Current layer statistics</p>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {statistics.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <Activity className="w-6 h-6 text-gray-400" />
                <span className="ml-2 text-gray-600">No statistics yet</span>
              </div>
            ) : (
              <div className="space-y-2">
                {statistics.map((stat, index) => (
                  <div key={`${stat.timestamp}-${index}`} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getLayerIcon(stat.layer)}
                        <span className="font-medium text-gray-900">{stat.layer}</span>
                        <span className="text-sm text-gray-600">{stat.metricName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {stat.trend && getTrendIcon(stat.trend)}
                        <span className="text-xs text-gray-500">
                          {new Date(stat.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-lg font-bold ${getParameterColor(stat.metricName, stat.value)}`}>
                        {formatValue(stat.value, stat.unit)}
                      </span>
                      {stat.change !== undefined && stat.change !== 0 && (
                        <span className={`text-sm ${getTrendColor(stat.trend || 'stable')}`}>
                          {stat.change > 0 ? '+' : ''}{formatValue(stat.change, stat.unit)}
                          ({stat.changePercent && stat.changePercent > 0 ? '+' : ''}{stat.changePercent?.toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayerParameterMonitor;