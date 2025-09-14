'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart3, TrendingUp, Activity, Zap, Clock, 
  Wifi, Signal, AlertTriangle, CheckCircle
} from 'lucide-react';

interface ChartData {
  timestamp: number;
  value: number;
  label?: string;
}

interface LiveChartsProps {
  testCaseId: string;
  onChartUpdate?: (chartType: string, data: ChartData[]) => void;
}

interface ChartProps {
  title: string;
  data: ChartData[];
  color: string;
  unit: string;
  icon: React.ReactNode;
  maxDataPoints?: number;
}

const Chart: React.FC<ChartProps> = ({ title, data, color, unit, icon, maxDataPoints = 50 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    if (data.length === 0) return;

    // Get recent data points
    const recentData = data.slice(-maxDataPoints);
    const minValue = Math.min(...recentData.map(d => d.value));
    const maxValue = Math.max(...recentData.map(d => d.value));
    const valueRange = maxValue - minValue || 1;

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (dimensions.height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(dimensions.width, y);
      ctx.stroke();
    }

    // Draw chart line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    recentData.forEach((point, index) => {
      const x = (dimensions.width / (recentData.length - 1)) * index;
      const y = dimensions.height - ((point.value - minValue) / valueRange) * dimensions.height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw data points
    ctx.fillStyle = color;
    recentData.forEach((point, index) => {
      const x = (dimensions.width / (recentData.length - 1)) * index;
      const y = dimensions.height - ((point.value - minValue) / valueRange) * dimensions.height;
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw value labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(maxValue.toFixed(1), dimensions.width - 5, 15);
    ctx.fillText(minValue.toFixed(1), dimensions.width - 5, dimensions.height - 5);

  }, [data, dimensions, color, maxDataPoints]);

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded bg-gray-100">
            {icon}
          </div>
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        </div>
        <div className="text-xs text-gray-500">
          {data.length > 0 && `${data[data.length - 1].value.toFixed(1)}${unit}`}
        </div>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-32"
          style={{ width: '100%', height: '128px' }}
        />
      </div>
    </div>
  );
};

export default function LiveCharts({ testCaseId, onChartUpdate }: LiveChartsProps) {
  const [charts, setCharts] = useState<{
    messagesPerSecond: ChartData[];
    successRate: ChartData[];
    errorRate: ChartData[];
    throughput: ChartData[];
    latency: ChartData[];
    layerDistribution: Record<string, ChartData[]>;
  }>({
    messagesPerSecond: [],
    successRate: [],
    errorRate: [],
    throughput: [],
    latency: [],
    layerDistribution: {},
  });

  const [isConnected, setIsConnected] = useState(false);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [timeWindow, setTimeWindow] = useState(60); // seconds
  const [maxDataPoints, setMaxDataPoints] = useState(50);

  // WebSocket connection for live updates
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3000/api/simulation/stream?testCaseId=${testCaseId}`);
    
    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected for live charts');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'kpi') {
          const kpis = data.data;
          const timestamp = Date.now();
          
          // Update all charts
          setCharts(prevCharts => {
            const newCharts = { ...prevCharts };
            
            // Messages per second
            newCharts.messagesPerSecond.push({
              timestamp,
              value: kpis.messagesPerSecond,
            });
            
            // Success rate
            newCharts.successRate.push({
              timestamp,
              value: kpis.successRate,
            });
            
            // Error rate
            newCharts.errorRate.push({
              timestamp,
              value: kpis.errorRate,
            });
            
            // Throughput
            newCharts.throughput.push({
              timestamp,
              value: kpis.throughputMbps,
            });
            
            // Latency
            newCharts.latency.push({
              timestamp,
              value: kpis.latencyMs,
            });
            
            // Layer distribution
            Object.entries(kpis.layerDistribution).forEach(([layer, count]) => {
              if (!newCharts.layerDistribution[layer]) {
                newCharts.layerDistribution[layer] = [];
              }
              newCharts.layerDistribution[layer].push({
                timestamp,
                value: count as number,
              });
            });
            
            // Trim data to time window
            const cutoffTime = timestamp - (timeWindow * 1000);
            Object.keys(newCharts).forEach(key => {
              if (key === 'layerDistribution') {
                Object.keys(newCharts.layerDistribution).forEach(layer => {
                  newCharts.layerDistribution[layer] = newCharts.layerDistribution[layer]
                    .filter(point => point.timestamp > cutoffTime);
                });
              } else {
                (newCharts as any)[key] = (newCharts as any)[key]
                  .filter((point: ChartData) => point.timestamp > cutoffTime);
              }
            });
            
            return newCharts;
          });
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
  }, [testCaseId, timeWindow]);

  const clearAllCharts = () => {
    setCharts({
      messagesPerSecond: [],
      successRate: [],
      errorRate: [],
      throughput: [],
      latency: [],
      layerDistribution: {},
    });
  };

  const exportChartData = (chartType: string) => {
    const data = (charts as any)[chartType];
    if (!data) return;
    
    const csv = [
      'timestamp,value',
      ...data.map((point: ChartData) => `${point.timestamp},${point.value}`)
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chartType}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <h2 className="text-lg font-semibold text-gray-900">Live Charts & Analytics</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={timeWindow}
            onChange={(e) => setTimeWindow(parseInt(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value={30}>30s</option>
            <option value={60}>1m</option>
            <option value={300}>5m</option>
            <option value={600}>10m</option>
          </select>
          
          <select
            value={maxDataPoints}
            onChange={(e) => setMaxDataPoints(parseInt(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value={25}>25 points</option>
            <option value={50}>50 points</option>
            <option value={100}>100 points</option>
            <option value={200}>200 points</option>
          </select>
          
          <button
            onClick={clearAllCharts}
            className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Main Performance Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Chart
          title="Messages per Second"
          data={charts.messagesPerSecond}
          color="#3b82f6"
          unit=" msg/s"
          icon={<Zap className="w-4 h-4 text-blue-600" />}
          maxDataPoints={maxDataPoints}
        />
        
        <Chart
          title="Success Rate"
          data={charts.successRate}
          color="#10b981"
          unit="%"
          icon={<CheckCircle className="w-4 h-4 text-green-600" />}
          maxDataPoints={maxDataPoints}
        />
        
        <Chart
          title="Error Rate"
          data={charts.errorRate}
          color="#ef4444"
          unit="%"
          icon={<AlertTriangle className="w-4 h-4 text-red-600" />}
          maxDataPoints={maxDataPoints}
        />
        
        <Chart
          title="Throughput"
          data={charts.throughput}
          color="#8b5cf6"
          unit=" Mbps"
          icon={<Wifi className="w-4 h-4 text-purple-600" />}
          maxDataPoints={maxDataPoints}
        />
        
        <Chart
          title="Latency"
          data={charts.latency}
          color="#f59e0b"
          unit=" ms"
          icon={<Clock className="w-4 h-4 text-yellow-600" />}
          maxDataPoints={maxDataPoints}
        />
        
        <Chart
          title="Activity Level"
          data={charts.messagesPerSecond.map(point => ({
            ...point,
            value: point.value > 0 ? 100 : 0
          }))}
          color="#6b7280"
          unit="%"
          icon={<Activity className="w-4 h-4 text-gray-600" />}
          maxDataPoints={maxDataPoints}
        />
      </div>

      {/* Layer Distribution Charts */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Layer Distribution Over Time</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Time window: {timeWindow}s</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(charts.layerDistribution).map(([layer, data]) => (
            <Chart
              key={layer}
              title={`${layer} Messages`}
              data={data}
              color={getLayerColor(layer)}
              unit=" msgs"
              icon={<BarChart3 className="w-4 h-4" />}
              maxDataPoints={maxDataPoints}
            />
          ))}
        </div>
      </div>

      {/* Chart Statistics */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {charts.messagesPerSecond.length > 0 
                ? charts.messagesPerSecond[charts.messagesPerSecond.length - 1].value.toFixed(0)
                : 0}
            </div>
            <div className="text-xs text-gray-500">Current Msg/s</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {charts.successRate.length > 0 
                ? charts.successRate[charts.successRate.length - 1].value.toFixed(1)
                : 0}%
            </div>
            <div className="text-xs text-gray-500">Current Success</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {charts.errorRate.length > 0 
                ? charts.errorRate[charts.errorRate.length - 1].value.toFixed(1)
                : 0}%
            </div>
            <div className="text-xs text-gray-500">Current Error</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {charts.throughput.length > 0 
                ? charts.throughput[charts.throughput.length - 1].value.toFixed(1)
                : 0}
            </div>
            <div className="text-xs text-gray-500">Current Mbps</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getLayerColor(layer: string): string {
  const colors: Record<string, string> = {
    PHY: '#ef4444',
    MAC: '#f97316',
    RLC: '#eab308',
    PDCP: '#22c55e',
    RRC: '#3b82f6',
    NAS: '#6366f1',
    IMS: '#8b5cf6',
  };
  return colors[layer] || '#6b7280';
}