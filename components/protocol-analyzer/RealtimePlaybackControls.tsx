'use client';

import React, { useState, useEffect } from 'react';
import {
  Play, Pause, Square, RotateCcw, SkipBack, SkipForward,
  Gauge, Clock, Filter, Settings, Volume2, VolumeX
} from 'lucide-react';

interface PlaybackControlsProps {
  testCaseId: string;
  onStateChange?: (state: any) => void;
  onSpeedChange?: (speed: number) => void;
  onTimeJump?: (time: number) => void;
  onFiltersChange?: (filters: any) => void;
}

interface SimulationState {
  controls: {
    isPlaying: boolean;
    isPaused: boolean;
    speed: number;
    currentTime: number;
    totalDuration: number;
    startTime: number;
    endTime: number;
  };
  kpis: {
    messagesPerSecond: number;
    successRate: number;
    errorRate: number;
    throughputMbps: number;
    latencyMs: number;
    totalMessages: number;
    processedMessages: number;
  };
  progress: number;
}

const SPEED_OPTIONS = [0.5, 1, 2, 5, 10, 20];

export default function RealtimePlaybackControls({
  testCaseId,
  onStateChange,
  onSpeedChange,
  onTimeJump,
  onFiltersChange
}: PlaybackControlsProps) {
  const [state, setState] = useState<SimulationState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filters, setFilters] = useState({
    layers: ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS'],
    messageTypes: [],
    directions: ['UL', 'DL', 'BIDIRECTIONAL'],
    validationStatus: ['valid', 'invalid', 'warning'],
  });

  // Initialize simulation
  useEffect(() => {
    initializeSimulation();
  }, [testCaseId]);

  const initializeSimulation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/simulation/stream?testCaseId=${testCaseId}&action=initialize`);
      const data = await response.json();
      
      if (data.success) {
        setState(data.state);
        onStateChange?.(data.state);
      }
    } catch (error) {
      console.error('Failed to initialize simulation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = async () => {
    if (!state) return;
    
    try {
      const action = state.controls.isPaused ? 'resume' : 'start';
      const response = await fetch(`/api/simulation/stream?testCaseId=${testCaseId}&action=${action}`);
      const data = await response.json();
      
      if (data.success) {
        setState(data.state);
        onStateChange?.(data.state);
      }
    } catch (error) {
      console.error('Failed to start/resume simulation:', error);
    }
  };

  const handlePause = async () => {
    try {
      const response = await fetch(`/api/simulation/stream?testCaseId=${testCaseId}&action=pause`);
      const data = await response.json();
      
      if (data.success) {
        setState(data.state);
        onStateChange?.(data.state);
      }
    } catch (error) {
      console.error('Failed to pause simulation:', error);
    }
  };

  const handleStop = async () => {
    try {
      const response = await fetch(`/api/simulation/stream?testCaseId=${testCaseId}&action=stop`);
      const data = await response.json();
      
      if (data.success) {
        setState(data.state);
        onStateChange?.(data.state);
      }
    } catch (error) {
      console.error('Failed to stop simulation:', error);
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch(`/api/simulation/stream?testCaseId=${testCaseId}&action=reset`);
      const data = await response.json();
      
      if (data.success) {
        setState(data.state);
        onStateChange?.(data.state);
      }
    } catch (error) {
      console.error('Failed to reset simulation:', error);
    }
  };

  const handleSpeedChange = async (speed: number) => {
    try {
      const response = await fetch('/api/simulation/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testCaseId,
          action: 'setSpeed',
          data: { speed }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setState(data.state);
        onSpeedChange?.(speed);
        onStateChange?.(data.state);
      }
    } catch (error) {
      console.error('Failed to change speed:', error);
    }
  };

  const handleTimeJump = async (time: number) => {
    try {
      const response = await fetch('/api/simulation/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testCaseId,
          action: 'jumpToTime',
          data: { time }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setState(data.state);
        onTimeJump?.(time);
        onStateChange?.(data.state);
      }
    } catch (error) {
      console.error('Failed to jump to time:', error);
    }
  };

  const handleFiltersChange = async (newFilters: any) => {
    setFilters(newFilters);
    
    try {
      const response = await fetch('/api/simulation/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testCaseId,
          action: 'setFilters',
          data: { filters: newFilters }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        onFiltersChange?.(newFilters);
      }
    } catch (error) {
      console.error('Failed to update filters:', error);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!state || state.controls.totalDuration === 0) return 0;
    return ((state.controls.currentTime - state.controls.startTime) / 
            (state.controls.endTime - state.controls.startTime)) * 100;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Initializing simulation...</span>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="flex items-center justify-center p-4">
        <span className="text-gray-600">No simulation data available</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Main Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {/* Play/Pause Button */}
          {state.controls.isPlaying ? (
            <button
              onClick={handlePause}
              className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              <Pause className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
            >
              <Play className="w-5 h-5" />
            </button>
          )}

          {/* Stop Button */}
          <button
            onClick={handleStop}
            className="flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            <Square className="w-5 h-5" />
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Skip Buttons */}
          <button
            onClick={() => handleTimeJump(Math.max(0, state.controls.currentTime - 1000))}
            className="flex items-center justify-center w-8 h-8 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleTimeJump(Math.min(state.controls.endTime, state.controls.currentTime + 1000))}
            className="flex items-center justify-center w-8 h-8 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center space-x-2">
          <Gauge className="w-4 h-4 text-gray-500" />
          <select
            value={state.controls.speed}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            {SPEED_OPTIONS.map(speed => (
              <option key={speed} value={speed}>{speed}x</option>
            ))}
          </select>
        </div>

        {/* Additional Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center w-8 h-8 rounded transition-colors ${
              showFilters ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center justify-center w-8 h-8 rounded transition-colors ${
              showSettings ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
          <span>{formatTime(state.controls.currentTime)}</span>
          <span>{formatTime(state.controls.totalDuration)}</span>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <input
            type="range"
            min={state.controls.startTime}
            max={state.controls.endTime}
            value={state.controls.currentTime}
            onChange={(e) => handleTimeJump(parseInt(e.target.value))}
            className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Live KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{state.kpis.messagesPerSecond.toFixed(0)}</div>
          <div className="text-xs text-gray-500">Messages/sec</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{state.kpis.successRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-500">Success Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{state.kpis.errorRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-500">Error Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{state.kpis.throughputMbps.toFixed(1)}</div>
          <div className="text-xs text-gray-500">Mbps</div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Layer Filters</h3>
          <div className="flex flex-wrap gap-2">
            {['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS'].map(layer => (
              <label key={layer} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.layers.includes(layer)}
                  onChange={(e) => {
                    const newLayers = e.target.checked
                      ? [...filters.layers, layer]
                      : filters.layers.filter(l => l !== layer);
                    handleFiltersChange({ ...filters, layers: newLayers });
                  }}
                  className="mr-1"
                />
                <span className="text-sm">{layer}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Simulation Settings</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Auto-scroll</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Show timestamps</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Highlight errors</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}