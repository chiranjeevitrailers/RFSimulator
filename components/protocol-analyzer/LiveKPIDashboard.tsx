'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity, TrendingUp, TrendingDown, Clock, Zap, AlertTriangle,
  CheckCircle, XCircle, BarChart3, Gauge, Wifi, Signal
} from 'lucide-react';

interface KPIData {
  messagesPerSecond: number;
  successRate: number;
  errorRate: number;
  throughputMbps: number;
  latencyMs: number;
  totalMessages: number;
  processedMessages: number;
  layerDistribution: Record<string, number>;
}

interface LiveKPIDashboardProps {
  testCaseId: string;
  onKPIsUpdate?: (kpis: KPIData) => void;
}

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, unit, trend, icon, color, bgColor }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={`${bgColor} rounded-lg p-4 border border-gray-200`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${color}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toFixed(1) : value}
              {unit && <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {getTrendIcon()}
        </div>
      </div>
    </div>
  );
};

export default function LiveKPIDashboard({ testCaseId, onKPIsUpdate }: LiveKPIDashboardProps) {
  const [kpis, setKpis] = useState<KPIData>({
    messagesPerSecond: 0,
    successRate: 0,
    errorRate: 0,
    throughputMbps: 0,
    latencyMs: 0,
    totalMessages: 0,
    processedMessages: 0,
    layerDistribution: {},
  });

  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection for live updates
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_5GLABX_WS_URL || 'ws://localhost:8082'}/api/simulation/stream?testCaseId=${testCaseId}`);
    
    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected for KPI updates');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'kpi') {
          setKpis(data.data);
          setLastUpdate(new Date());
          onKPIsUpdate?.(data.data);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    setWebsocket(ws);

    return () => {
      ws.close();
    };
  }, [testCaseId, onKPIsUpdate]);

  const getLayerColor = (layer: string) => {
    const colors: Record<string, string> = {
      PHY: 'bg-red-100 text-red-600',
      MAC: 'bg-orange-100 text-orange-600',
      RLC: 'bg-yellow-100 text-yellow-600',
      PDCP: 'bg-green-100 text-green-600',
      RRC: 'bg-blue-100 text-blue-600',
      NAS: 'bg-indigo-100 text-indigo-600',
      IMS: 'bg-purple-100 text-purple-600',
    };
    return colors[layer] || 'bg-gray-100 text-gray-600';
  };

  const getStatusColor = () => {
    if (kpis.errorRate > 5) return 'text-red-600';
    if (kpis.errorRate > 1) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusIcon = () => {
    if (kpis.errorRate > 5) return <XCircle className="w-5 h-5" />;
    if (kpis.errorRate > 1) return <AlertTriangle className="w-5 h-5" />;
    return <CheckCircle className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm font-medium text-gray-700">
            {isConnected ? 'Live Updates Active' : 'Disconnected'}
          </span>
        </div>
        {lastUpdate && (
          <span className="text-xs text-gray-500">
            Last update: {lastUpdate.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Messages/sec"
          value={kpis.messagesPerSecond}
          unit="msg/s"
          icon={<Zap className="w-5 h-5 text-white" />}
          color="bg-blue-500"
          bgColor="bg-white"
        />
        
        <KPICard
          title="Success Rate"
          value={kpis.successRate}
          unit="%"
          trend={kpis.successRate > 95 ? 'up' : kpis.successRate < 90 ? 'down' : 'stable'}
          icon={<CheckCircle className="w-5 h-5 text-white" />}
          color="bg-green-500"
          bgColor="bg-white"
        />
        
        <KPICard
          title="Error Rate"
          value={kpis.errorRate}
          unit="%"
          trend={kpis.errorRate < 1 ? 'up' : kpis.errorRate > 5 ? 'down' : 'stable'}
          icon={<XCircle className="w-5 h-5 text-white" />}
          color="bg-red-500"
          bgColor="bg-white"
        />
        
        <KPICard
          title="Throughput"
          value={kpis.throughputMbps}
          unit="Mbps"
          icon={<Wifi className="w-5 h-5 text-white" />}
          color="bg-purple-500"
          bgColor="bg-white"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Latency"
          value={kpis.latencyMs}
          unit="ms"
          icon={<Clock className="w-5 h-5 text-white" />}
          color="bg-indigo-500"
          bgColor="bg-white"
        />
        
        <KPICard
          title="Processed"
          value={kpis.processedMessages}
          unit={`/ ${kpis.totalMessages}`}
          icon={<BarChart3 className="w-5 h-5 text-white" />}
          color="bg-orange-500"
          bgColor="bg-white"
        />
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gray-500">
                <Gauge className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
                  {getStatusIcon()}
                  <span className="text-sm font-medium">
                    {kpis.errorRate > 5 ? 'Critical' : kpis.errorRate > 1 ? 'Warning' : 'Healthy'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layer Distribution */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Layer Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(kpis.layerDistribution).map(([layer, count]) => (
            <div key={layer} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${getLayerColor(layer)}`}>
                <span className="text-sm font-bold">{layer}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{count} messages</p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Processing Progress</h3>
          <span className="text-sm text-gray-500">
            {kpis.totalMessages > 0 ? Math.round((kpis.processedMessages / kpis.totalMessages) * 100) : 0}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${kpis.totalMessages > 0 ? (kpis.processedMessages / kpis.totalMessages) * 100 : 0}%`
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{kpis.processedMessages} processed</span>
          <span>{kpis.totalMessages} total</span>
        </div>
      </div>

      {/* Real-time Activity Indicator */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">Real-time Activity</span>
          </div>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>Messages: {kpis.messagesPerSecond.toFixed(0)}/s</span>
            <span>Latency: {kpis.latencyMs.toFixed(1)}ms</span>
            <span>Status: {isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}