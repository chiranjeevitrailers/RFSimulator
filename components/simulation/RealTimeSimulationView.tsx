'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TestExecutionEngine, TestExecutionResult } from '@/lib/test-execution-engine';
import { RealTimeSimulator } from '@/lib/real-time-simulator';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock,
  Layers,
  BarChart3,
  FileText,
  AlertTriangle,
  Filter,
  Search,
  Download,
  Upload,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Network,
  Wifi,
  Server,
  Database,
  Cpu,
  HardDrive,
  MemoryStick,
  Router,
  Switch,
  Globe,
  Shield,
  Zap,
  Target,
  TrendingUp,
  BarChart,
  Users,
  Timer,
  Gauge,
  TrendingDown,
  AlertCircle,
  Info,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Copy,
  Share,
  MoreHorizontal,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface RealTimeSimulationViewProps {
  userId: string;
  executionId?: string;
}

const RealTimeSimulationView: React.FC<RealTimeSimulationViewProps> = ({ userId, executionId }) => {
  const [executionEngine] = useState(() => TestExecutionEngine.getInstance());
  const [realTimeSimulator] = useState(() => {
    try {
      return new RealTimeSimulator({
        timeAcceleration: 1,
        enableBuffering: true,
        enableSynchronization: true
      });
    } catch (error) {
      console.error('Error creating RealTimeSimulator:', error);
      return null;
    }
  });
  
  const [execution, setExecution] = useState<TestExecutionResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeAcceleration, setTimeAcceleration] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState<string>('');
  const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
  const [showLayerDetails, setShowLayerDetails] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [viewMode, setViewMode] = useState<'timeline' | 'layers' | 'metrics'>('timeline');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (executionId) {
      loadExecution();
    }
    
    setupEventListeners();
    setupAudio();
    
    return () => {
      cleanup();
    };
  }, [executionId]);

  useEffect(() => {
    if (execution && execution.results.messageFlow) {
      setFilteredMessages(execution.results.messageFlow);
      setTotalTime(Math.max(...execution.results.messageFlow.map(m => m.timestamp)));
    }
  }, [execution]);

  useEffect(() => {
    if (isPlaying) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [isPlaying, timeAcceleration]);

  const loadExecution = () => {
    if (executionId) {
      const exec = executionEngine.getExecutionStatus(executionId);
      setExecution(exec);
    }
  };

  const setupEventListeners = () => {
    executionEngine.on('executionProgress', (data) => {
      if (data.executionId === executionId) {
        loadExecution();
      }
    });

    executionEngine.on('executionCompleted', (data) => {
      if (data.executionId === executionId) {
        loadExecution();
        setIsPlaying(false);
      }
    });
  };

  const setupAudio = () => {
    if (audioEnabled && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const cleanup = () => {
    stopAnimation();
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const startAnimation = () => {
    const animate = () => {
      setCurrentTime(prev => {
        const newTime = prev + (16 * timeAcceleration); // 60fps
        if (newTime >= totalTime) {
          setIsPlaying(false);
          return totalTime;
        }
        return newTime;
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleTimeSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
  };

  const handleLayerFilter = (layer: string) => {
    if (selectedLayer === layer) {
      setSelectedLayer('');
      setFilteredMessages(execution?.results.messageFlow || []);
    } else {
      setSelectedLayer(layer);
      setFilteredMessages(
        execution?.results.messageFlow.filter(m => m.layer === layer) || []
      );
    }
  };

  const playAudioFeedback = (type: 'success' | 'error' | 'info') => {
    if (!audioEnabled || !audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    const frequencies = {
      success: 800,
      error: 400,
      info: 600
    };
    
    oscillator.frequency.setValueAtTime(frequencies[type], audioContextRef.current.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.2);
    
    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.2);
  };

  const getLayerColor = (layer: string) => {
    const colors: { [key: string]: string } = {
      'RRC': '#3B82F6',
      'MAC': '#10B981',
      'RLC': '#F59E0B',
      'PDCP': '#EF4444',
      'NAS': '#8B5CF6',
      'SIP': '#EC4899',
      'E2': '#06B6D4',
      'A1': '#84CC16',
      'O1': '#F97316',
      'PC5': '#6366F1',
      'NTN': '#14B8A6'
    };
    return colors[layer] || '#6B7280';
  };

  const getDirectionIcon = (direction: 'UL' | 'DL') => {
    return direction === 'UL' ? 
      <TrendingUp className="w-4 h-4 text-green-500" /> : 
      <TrendingDown className="w-4 h-4 text-blue-500" />;
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const visibleMessages = filteredMessages.filter(message => 
    message.timestamp <= currentTime
  );

  const currentMessage = filteredMessages.find(message => 
    message.timestamp <= currentTime && 
    message.timestamp > currentTime - 100
  );

  if (!execution) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading execution...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 bg-white z-50 p-6' : ''}`}>
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Real-Time Simulation</h2>
              <p className="text-sm text-gray-500">
                Execution: {execution.id.substring(0, 12)}... | 
                Test Case: {execution.testCaseId}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
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

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                onClick={handlePlayPause}
                disabled={execution.status !== 'running'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                onClick={handleStop}
              >
                <Square className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Speed:</span>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={timeAcceleration}
                onChange={(e) => setTimeAcceleration(parseFloat(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-gray-500 w-8">{timeAcceleration}x</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {formatTime(currentTime)} / {formatTime(totalTime)}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'timeline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('timeline')}
              >
                Timeline
              </Button>
              <Button
                variant={viewMode === 'layers' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('layers')}
              >
                Layers
              </Button>
              <Button
                variant={viewMode === 'metrics' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('metrics')}
              >
                Metrics
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <input
            type="range"
            min="0"
            max={totalTime}
            value={currentTime}
            onChange={handleTimeSeek}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Timeline</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 ${
                      message.timestamp <= currentTime
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getLayerColor(message.layer) }}
                      ></div>
                      <span className="text-xs text-gray-500 w-16">
                        {message.timestamp}ms
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getDirectionIcon(message.direction)}
                      <span className="text-sm font-medium text-gray-900">
                        {message.layer}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{message.message}</p>
                    </div>
                    <div className="flex items-center">
                      {message.success ? 
                        <CheckCircle className="w-4 h-4 text-green-500" /> : 
                        <XCircle className="w-4 h-4 text-red-500" />
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Layers View */}
        {viewMode === 'layers' && (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Protocol Layers</h3>
              <div className="space-y-4">
                {Object.keys(execution.results.layerResults || {}).map((layer) => (
                  <div
                    key={layer}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                      selectedLayer === layer
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => handleLayerFilter(layer)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: getLayerColor(layer) }}
                        ></div>
                        <span className="font-medium text-gray-900">{layer}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          {execution.results.layerResults[layer].messagesProcessed} messages
                        </span>
                        {execution.results.layerResults[layer].success ? 
                          <CheckCircle className="w-5 h-5 text-green-500" /> : 
                          <XCircle className="w-5 h-5 text-red-500" />
                        }
                      </div>
                    </div>
                    {execution.results.layerResults[layer].errors > 0 && (
                      <div className="mt-2 text-sm text-red-600">
                        {execution.results.layerResults[layer].errors} errors
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Metrics View */}
        {viewMode === 'metrics' && (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Timer className="w-8 h-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-600">Execution Time</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {formatTime(execution.results.performanceMetrics.executionTime)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Cpu className="w-8 h-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-600">CPU Usage</p>
                      <p className="text-2xl font-bold text-green-900">
                        {execution.results.performanceMetrics.cpuUsage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <MemoryStick className="w-8 h-8 text-purple-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-purple-600">Memory</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {execution.results.performanceMetrics.memoryUsage.toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Network className="w-8 h-8 text-orange-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-orange-600">Latency</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {execution.results.performanceMetrics.networkLatency.toFixed(1)} ms
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-teal-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <TrendingUp className="w-8 h-8 text-teal-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-teal-600">Throughput</p>
                      <p className="text-2xl font-bold text-teal-900">
                        {execution.results.performanceMetrics.throughput.toFixed(1)} msg/s
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-600">Error Rate</p>
                      <p className="text-2xl font-bold text-red-900">
                        {execution.results.performanceMetrics.errorRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Message */}
          {currentMessage && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Message</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getLayerColor(currentMessage.layer) }}
                  ></div>
                  <span className="font-medium text-gray-900">{currentMessage.layer}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getDirectionIcon(currentMessage.direction)}
                  <span className="text-sm text-gray-500">{currentMessage.direction}</span>
                </div>
                <p className="text-sm text-gray-700">{currentMessage.message}</p>
                <div className="text-xs text-gray-500">
                  Timestamp: {currentMessage.timestamp}ms
                </div>
              </div>
            </div>
          )}

          {/* Layer Filter */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Layer Filter</h3>
            <div className="space-y-2">
              {Object.keys(execution.results.layerResults || {}).map((layer) => (
                <button
                  key={layer}
                  onClick={() => handleLayerFilter(layer)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                    selectedLayer === layer
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getLayerColor(layer) }}
                    ></div>
                    <span>{layer}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {execution.results.layerResults[layer].messagesProcessed}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Execution Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Execution Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  execution.status === 'running' ? 'bg-blue-100 text-blue-800' :
                  execution.status === 'completed' ? 'bg-green-100 text-green-800' :
                  execution.status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {execution.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Progress</span>
                <span className="text-sm font-medium">{Math.round(execution.progress)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Current Step</span>
                <span className="text-sm font-medium">
                  {execution.currentStep} / {execution.totalSteps}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Duration</span>
                <span className="text-sm font-medium">
                  {execution.duration ? formatTime(execution.duration) : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeSimulationView;