'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Clock, Play, Pause, Square, RotateCcw, SkipBack, SkipForward,
  Gauge, Calendar, Timer, Zap, Target, Navigation
} from 'lucide-react';

interface TimeControllerProps {
  testCaseId: string;
  onTimeChange?: (time: number) => void;
  onSpeedChange?: (speed: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

interface TimeState {
  currentTime: number;
  startTime: number;
  endTime: number;
  totalDuration: number;
  isPlaying: boolean;
  isPaused: boolean;
  speed: number;
  progress: number;
}

const SPEED_OPTIONS = [
  { value: 0.1, label: '0.1x', icon: '🐌' },
  { value: 0.5, label: '0.5x', icon: '🚶' },
  { value: 1, label: '1x', icon: '🏃' },
  { value: 2, label: '2x', icon: '🚗' },
  { value: 5, label: '5x', icon: '🚄' },
  { value: 10, label: '10x', icon: '✈️' },
  { value: 20, label: '20x', icon: '🚀' },
];

const TIME_JUMP_OPTIONS = [
  { value: 100, label: '100ms' },
  { value: 500, label: '500ms' },
  { value: 1000, label: '1s' },
  { value: 5000, label: '5s' },
  { value: 10000, label: '10s' },
  { value: 30000, label: '30s' },
];

export default function TimeController({ 
  testCaseId, 
  onTimeChange, 
  onSpeedChange, 
  onPlayStateChange 
}: TimeControllerProps) {
  const [timeState, setTimeState] = useState<TimeState>({
    currentTime: 0,
    startTime: 0,
    endTime: 0,
    totalDuration: 0,
    isPlaying: false,
    isPaused: false,
    speed: 1,
    progress: 0,
  });

  const [isConnected, setIsConnected] = useState(false);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [customTime, setCustomTime] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_5GLABX_WS_URL || 'ws://localhost:8082'}/api/simulation/stream?testCaseId=${testCaseId}`);
    
    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected for time controller');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'progress') {
          const progress = data.data.progress;
          setTimeState(prev => ({
            ...prev,
            progress,
            currentTime: prev.startTime + (progress / 100) * (prev.endTime - prev.startTime)
          }));
        } else if (data.type === 'state') {
          setTimeState(data.data);
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
  }, [testCaseId]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;
    const remainingMs = ms % 1000;

    if (hours > 0) {
      return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}.${remainingMs.toString().padStart(3, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${remainingMs.toString().padStart(3, '0')}`;
    }
  };

  const formatTimeShort = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlay = async () => {
    try {
      const action = timeState.isPaused ? 'resume' : 'start';
      const response = await fetch(`/api/simulation/stream?testCaseId=${testCaseId}&action=${action}`);
      const data = await response.json();
      
      if (data.success) {
        setTimeState(data.state);
        onPlayStateChange?.(data.state.isPlaying);
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
        setTimeState(data.state);
        onPlayStateChange?.(data.state.isPlaying);
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
        setTimeState(data.state);
        onPlayStateChange?.(data.state.isPlaying);
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
        setTimeState(data.state);
        onPlayStateChange?.(data.state.isPlaying);
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
        setTimeState(data.state);
        onSpeedChange?.(speed);
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
        setTimeState(data.state);
        onTimeChange?.(time);
      }
    } catch (error) {
      console.error('Failed to jump to time:', error);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = timeState.startTime + (percentage * (timeState.endTime - timeState.startTime));
    
    handleTimeJump(newTime);
  };

  const handleProgressBarMouseDown = () => {
    setIsDragging(true);
  };

  const handleProgressBarMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = timeState.startTime + (percentage * (timeState.endTime - timeState.startTime));
    
    setTimeState(prev => ({
      ...prev,
      currentTime: newTime,
      progress: percentage * 100
    }));
  };

  const handleProgressBarMouseUp = () => {
    if (isDragging) {
      handleTimeJump(timeState.currentTime);
      setIsDragging(false);
    }
  };

  const handleCustomTimeSubmit = () => {
    const timeMs = parseFloat(customTime) * 1000; // Convert seconds to milliseconds
    if (!isNaN(timeMs) && timeMs >= timeState.startTime && timeMs <= timeState.endTime) {
      handleTimeJump(timeMs);
      setShowTimePicker(false);
      setCustomTime('');
    }
  };

  const jumpToTime = (jumpMs: number) => {
    const newTime = Math.max(timeState.startTime, Math.min(timeState.endTime, timeState.currentTime + jumpMs));
    handleTimeJump(newTime);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Time Controller</h3>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {formatTimeShort(timeState.currentTime)} / {formatTimeShort(timeState.totalDuration)}
          </span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {/* Play/Pause Button */}
          {timeState.isPlaying ? (
            <button
              onClick={handlePause}
              className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              <Pause className="w-6 h-6" />
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="flex items-center justify-center w-12 h-12 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
            >
              <Play className="w-6 h-6" />
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
            onClick={() => jumpToTime(-1000)}
            className="flex items-center justify-center w-8 h-8 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => jumpToTime(1000)}
            className="flex items-center justify-center w-8 h-8 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center space-x-2">
          <Gauge className="w-4 h-4 text-gray-500" />
          <select
            value={timeState.speed}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            {SPEED_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>{formatTime(timeState.currentTime)}</span>
          <span>{formatTime(timeState.totalDuration)}</span>
        </div>
        
        <div
          ref={progressBarRef}
          className="relative w-full bg-gray-200 rounded-full h-3 cursor-pointer"
          onClick={handleProgressBarClick}
          onMouseDown={handleProgressBarMouseDown}
          onMouseMove={handleProgressBarMouseMove}
          onMouseUp={handleProgressBarMouseUp}
          onMouseLeave={handleProgressBarMouseUp}
        >
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${timeState.progress}%` }}
          />
          
          {/* Time markers */}
          <div className="absolute inset-0 flex justify-between items-center text-xs text-gray-500">
            {[0, 25, 50, 75, 100].map(percentage => (
              <div key={percentage} className="flex flex-col items-center">
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                <span className="mt-1">
                  {formatTimeShort(timeState.startTime + (percentage / 100) * (timeState.endTime - timeState.startTime))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Jump Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Quick Jump:</span>
          {TIME_JUMP_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => jumpToTime(option.value)}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setShowTimePicker(!showTimePicker)}
          className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
        >
          <Target className="w-4 h-4" />
          <span>Jump to Time</span>
        </button>
      </div>

      {/* Custom Time Picker */}
      {showTimePicker && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              placeholder="Enter time in seconds"
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <button
              onClick={handleCustomTimeSubmit}
              className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Jump
            </button>
            <button
              onClick={() => setShowTimePicker(false)}
              className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Time Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">
            {formatTimeShort(timeState.currentTime)}
          </div>
          <div className="text-xs text-gray-500">Current Time</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">
            {formatTimeShort(timeState.totalDuration - timeState.currentTime)}
          </div>
          <div className="text-xs text-gray-500">Remaining</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">
            {timeState.speed}x
          </div>
          <div className="text-xs text-gray-500">Speed</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-orange-600">
            {timeState.progress.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Progress</div>
        </div>
      </div>
    </div>
  );
}