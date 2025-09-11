'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RealTimeSimulator, RealTimeEvent, RealTimeMetrics } from '@/lib/real-time-simulator';
import { TestCase, TestCaseExecution } from '@/lib/test-cases';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Activity, 
  Clock,
  Layers,
  BarChart3,
  FileText,
  AlertTriangle,
  Zap,
  Gauge,
  TrendingUp,
  TrendingDown,
  Timer,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface RealTimeSimulationViewProps {
  testCase: TestCase;
  execution: TestCaseExecution;
  onSimulationComplete: (result: any) => void;
  onSimulationUpdate: (execution: TestCaseExecution) => void;
}

const RealTimeSimulationView: React.FC<RealTimeSimulationViewProps> = ({
  testCase,
  execution,
  onSimulationComplete,
  onSimulationUpdate,
}) => {
  const [simulator] = useState(() => new RealTimeSimulator());
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeAcceleration, setTimeAcceleration] = useState(1);
  const [events, setEvents] = useState<RealTimeEvent[]>([]);
  const [metrics, setMetrics] = useState<RealTimeMetrics | null>(null);
  const [layerStates, setLayerStates] = useState<Map<string, any>>(new Map());
  const [selectedLayer, setSelectedLayer] = useState<string>('');
  const [selectedTimeRange, setSelectedTimeRange] = useState<{start: number, end: number} | null>(null);
  const [showMetrics, setShowMetrics] = useState(true);
  const [showLayerStates, setShowLayerStates] = useState(true);
  const [showEventLog, setShowEventLog] = useState(true);
  
  const eventLogRef = useRef<HTMLDivElement>(null);
  const metricsUpdateInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Setup simulator event listeners
    simulator.on('realtime_started', handleRealTimeStarted);
    simulator.on('realtime_paused', handleRealTimePaused);
    simulator.on('realtime_resumed', handleRealTimeResumed);
    simulator.on('realtime_stopped', handleRealTimeStopped);
    simulator.on('event_added', handleEventAdded);
    simulator.on('event_processed', handleEventProcessed);
    simulator.on('layer_state_updated', handleLayerStateUpdated);
    simulator.on('metrics_updated', handleMetricsUpdated);
    simulator.on('time_acceleration_changed', handleTimeAccelerationChanged);

    return () => {
      // Cleanup
      if (metricsUpdateInterval.current) {
        clearInterval(metricsUpdateInterval.current);
      }
    };
  }, [simulator]);

  useEffect(() => {
    // Auto-scroll event log to bottom
    if (eventLogRef.current) {
      eventLogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events]);

  useEffect(() => {
    // Update metrics periodically
    if (isRunning && !isPaused) {
      metricsUpdateInterval.current = setInterval(() => {
        setMetrics(simulator.getMetrics());
        setLayerStates(simulator.getAllLayerStates());
      }, 1000);
    } else {
      if (metricsUpdateInterval.current) {
        clearInterval(metricsUpdateInterval.current);
      }
    }

    return () => {
      if (metricsUpdateInterval.current) {
        clearInterval(metricsUpdateInterval.current);
      }
    };
  }, [isRunning, isPaused, simulator]);

  const handleRealTimeStarted = (data: any) => {
    setIsRunning(true);
    setIsPaused(false);
    setEvents([]);
    setMetrics(simulator.getMetrics());
    setLayerStates(simulator.getAllLayerStates());
  };

  const handleRealTimePaused = (data: any) => {
    setIsPaused(true);
  };

  const handleRealTimeResumed = (data: any) => {
    setIsPaused(false);
  };

  const handleRealTimeStopped = (data: any) => {
    setIsRunning(false);
    setIsPaused(false);
    setMetrics(simulator.getMetrics());
  };

  const handleEventAdded = (data: { event: RealTimeEvent }) => {
    setEvents(prev => [...prev, data.event]);
  };

  const handleEventProcessed = (data: { event: RealTimeEvent }) => {
    // Event processed - could be used for additional UI updates
  };

  const handleLayerStateUpdated = (data: { layer: string, state: any }) => {
    setLayerStates(prev => new Map(prev.set(data.layer, data.state)));
  };

  const handleMetricsUpdated = (data: { metrics: RealTimeMetrics }) => {
    setMetrics(data.metrics);
  };

  const handleTimeAccelerationChanged = (data: any) => {
    setTimeAcceleration(data.newAcceleration);
  };

  const startSimulation = async () => {
    try {
      await simulator.startRealTimeSimulation(testCase, execution);
    } catch (error) {
      console.error('Failed to start real-time simulation:', error);
    }
  };

  const pauseSimulation = async () => {
    try {
      await simulator.pauseRealTimeSimulation();
    } catch (error) {
      console.error('Failed to pause simulation:', error);
    }
  };

  const resumeSimulation = async () => {
    try {
      await simulator.resumeRealTimeSimulation();
    } catch (error) {
      console.error('Failed to resume simulation:', error);
    }
  };

  const stopSimulation = async () => {
    try {
      await simulator.stopRealTimeSimulation();
    } catch (error) {
      console.error('Failed to stop simulation:', error);
    }
  };

  const resetSimulation = () => {
    setEvents([]);
    setMetrics(null);
    setLayerStates(new Map());
    setSelectedLayer('');
    setSelectedTimeRange(null);
  };

  const changeTimeAcceleration = (acceleration: number) => {
    try {
      simulator.setTimeAcceleration(acceleration);
    } catch (error) {
      console.error('Failed to change time acceleration:', error);
    }
  };

  const getFilteredEvents = (): RealTimeEvent[] => {
    let filtered = events;

    if (selectedLayer) {
      filtered = filtered.filter(event => event.layer === selectedLayer);
    }

    if (selectedTimeRange) {
      filtered = filtered.filter(event => 
        event.playbackTimestamp >= selectedTimeRange.start && 
        event.playbackTimestamp <= selectedTimeRange.end
      );
    }

    return filtered;
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <Activity className="w-4 h-4 text-blue-500" />;
      case 'state_change':
        return <Layers className="w-4 h-4 text-green-500" />;
      case 'metric_update':
        return <BarChart3 className="w-4 h-4 text-purple-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'UL':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'DL':
        return <TrendingDown className="w-4 h-4 text-blue-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour12: false, 
      fractionalSecondDigits: 3 
    });
  };

  const getLayerStatusColor = (layer: string) => {
    const state = layerStates.get(layer);
    if (!state) return 'bg-gray-100 text-gray-600';
    
    switch (state.status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'idle':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-Time Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Real-Time Simulation</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {testCase.name}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              testCase.complexity === 'low' ? 'bg-green-100 text-green-800' :
              testCase.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {testCase.complexity}
            </span>
          </div>
        </div>

        {/* Time Acceleration Control */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Time Acceleration</span>
            <span className="text-sm text-gray-500">{timeAcceleration}x</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0.1"
              max="100"
              step="0.1"
              value={timeAcceleration}
              onChange={(e) => changeTimeAcceleration(parseFloat(e.target.value))}
              className="flex-1"
              disabled={!isRunning}
            />
            <div className="flex space-x-1">
              {[0.5, 1, 2, 5, 10].map(speed => (
                <Button
                  key={speed}
                  variant={timeAcceleration === speed ? "default" : "outline"}
                  size="sm"
                  onClick={() => changeTimeAcceleration(speed)}
                  disabled={!isRunning}
                >
                  {speed}x
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center space-x-3">
          {!isRunning ? (
            <Button onClick={startSimulation} disabled={isRunning}>
              <Play className="w-4 h-4 mr-2" />
              Start Real-Time
            </Button>
          ) : (
            <>
              {!isPaused ? (
                <Button variant="outline" onClick={pauseSimulation}>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button variant="outline" onClick={resumeSimulation}>
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              )}
              <Button variant="outline" onClick={stopSimulation}>
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </>
          )}
          <Button variant="outline" onClick={resetSimulation}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Real-Time Metrics */}
      {metrics && showMetrics && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Gauge className="w-5 h-5 mr-2" />
              Real-Time Metrics
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMetrics(!showMetrics)}
            >
              {showMetrics ? 'Hide' : 'Show'}
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <div className="text-sm font-medium text-blue-900">Messages/sec</div>
                  <div className="text-2xl font-bold text-blue-600">{metrics.messagesPerSecond.toFixed(1)}</div>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <Timer className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <div className="text-sm font-medium text-green-900">Avg Latency</div>
                  <div className="text-2xl font-bold text-green-600">{metrics.averageLatency.toFixed(1)}ms</div>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                <div>
                  <div className="text-sm font-medium text-purple-900">Throughput</div>
                  <div className="text-2xl font-bold text-purple-600">{metrics.throughput.toFixed(1)}</div>
                </div>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <div>
                  <div className="text-sm font-medium text-red-900">Error Rate</div>
                  <div className="text-2xl font-bold text-red-600">{metrics.errorRate.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Protocol Layers Status */}
      {showLayerStates && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Layers className="w-5 h-5 mr-2" />
              Protocol Layers
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLayerStates(!showLayerStates)}
            >
              {showLayerStates ? 'Hide' : 'Show'}
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.keys(testCase.layers || {}).map((layerName) => {
              const state = layerStates.get(layerName);
              const isSelected = selectedLayer === layerName;
              
              return (
                <div
                  key={layerName}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedLayer(isSelected ? '' : layerName)}
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 ${
                      getLayerStatusColor(layerName)
                    }`}>
                      <span className="font-semibold text-sm">
                        {layerName.substring(0, 3)}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-gray-900">{layerName}</div>
                    <div className="text-xs text-gray-500">
                      {state?.status || 'idle'}
                    </div>
                    {metrics?.layerActivity[layerName] && (
                      <div className="text-xs text-primary-600 font-medium">
                        {metrics.layerActivity[layerName]} events
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Real-Time Event Log */}
      {showEventLog && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Real-Time Events
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {getFilteredEvents().length} events
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEventLog(!showEventLog)}
              >
                {showEventLog ? 'Hide' : 'Show'}
              </Button>
            </div>
          </div>
          
          {/* Event Filters */}
          <div className="mb-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Layer:</label>
              <select
                value={selectedLayer}
                onChange={(e) => setSelectedLayer(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="">All Layers</option>
                {Object.keys(testCase.layers || {}).map(layer => (
                  <option key={layer} value={layer}>{layer}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
            {getFilteredEvents().length === 0 ? (
              <div className="text-gray-500">No events yet. Start the simulation to see real-time events.</div>
            ) : (
              getFilteredEvents().map((event, index) => (
                <div key={event.id} className="flex items-center space-x-3 py-1 border-b border-gray-700 last:border-b-0">
                  <div className="flex items-center space-x-2">
                    {getEventTypeIcon(event.type)}
                    {getDirectionIcon(event.direction)}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {formatTimestamp(event.playbackTimestamp)}
                  </div>
                  <div className="text-blue-400 font-medium">
                    {event.layer}
                  </div>
                  <div className="text-green-400 flex-1">
                    {event.type}: {JSON.stringify(event.data).substring(0, 100)}
                    {JSON.stringify(event.data).length > 100 && '...'}
                  </div>
                </div>
              ))
            )}
            <div ref={eventLogRef} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeSimulationView;