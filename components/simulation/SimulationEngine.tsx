'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ProtocolSimulator, SimulationResult, SimulationStepResult } from '@/lib/protocol-simulator';
import { TestCase, TestCaseExecution } from '@/lib/test-cases';
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
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SimulationEngineProps {
  testCase: TestCase;
  onSimulationComplete: (result: SimulationResult) => void;
  onSimulationUpdate: (execution: TestCaseExecution) => void;
}

const SimulationEngine: React.FC<SimulationEngineProps> = ({
  testCase,
  onSimulationComplete,
  onSimulationUpdate,
}) => {
  const [simulator] = useState(() => new ProtocolSimulator());
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [execution, setExecution] = useState<TestCaseExecution | null>(null);
  const [results, setResults] = useState<SimulationStepResult[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<Record<string, any>>({});
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Setup simulator event listeners
    simulator.on('simulation_started', handleSimulationStarted);
    simulator.on('simulation_completed', handleSimulationCompleted);
    simulator.on('simulation_failed', handleSimulationFailed);
    simulator.on('simulation_progress', handleSimulationProgress);
    simulator.on('step_started', handleStepStarted);
    simulator.on('step_completed', handleStepCompleted);
    simulator.on('step_failed', handleStepFailed);

    return () => {
      // Cleanup
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [simulator]);

  useEffect(() => {
    // Auto-scroll logs to bottom
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  useEffect(() => {
    // Update elapsed time
    if (isRunning && startTime) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, startTime]);

  const handleSimulationStarted = (data: any) => {
    setIsRunning(true);
    setIsPaused(false);
    setStartTime(Date.now());
    setElapsedTime(0);
    setProgress(0);
    setCurrentStep('');
    setResults([]);
    setLogs([]);
    setErrors([]);
    setMetrics({});
    
    addLog('Simulation started');
  };

  const handleSimulationCompleted = (data: { result: SimulationResult }) => {
    setIsRunning(false);
    setIsPaused(false);
    setProgress(100);
    setElapsedTime(data.result.duration);
    
    addLog('Simulation completed successfully');
    onSimulationComplete(data.result);
  };

  const handleSimulationFailed = (data: { error: any }) => {
    setIsRunning(false);
    setIsPaused(false);
    
    addLog(`Simulation failed: ${data.error.message || data.error}`);
    setErrors(prev => [...prev, data.error.message || data.error]);
  };

  const handleSimulationProgress = (data: any) => {
    setProgress(data.progress);
    setCurrentStep(data.currentStep);
    
    if (execution) {
      const updatedExecution = {
        ...execution,
        progress_percentage: data.progress,
        current_step: data.currentStep,
        total_steps: data.totalSteps,
        completed_steps: Math.floor((data.progress / 100) * data.totalSteps)
      };
      setExecution(updatedExecution);
      onSimulationUpdate(updatedExecution);
    }
  };

  const handleStepStarted = (data: any) => {
    addLog(`Starting: ${data.step.name}`);
  };

  const handleStepCompleted = (data: any) => {
    addLog(`Completed: ${data.step.name} (${data.duration}ms)`);
    setResults(prev => [...prev, {
      stepId: data.step.id,
      success: true,
      duration: data.duration,
      result: data.result,
      metrics: data.result.metrics
    }]);
  };

  const handleStepFailed = (data: any) => {
    addLog(`Failed: ${data.step.name} - ${data.error}`);
    setErrors(prev => [...prev, `${data.step.name}: ${data.error}`]);
    setResults(prev => [...prev, {
      stepId: data.step.id,
      success: false,
      duration: data.duration,
      error: data.error
    }]);
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const startSimulation = async () => {
    try {
      // Create a mock execution for demonstration
      const mockExecution: TestCaseExecution = {
        id: Date.now().toString(),
        test_case_id: testCase.id,
        user_id: 'current-user',
        execution_id: Date.now().toString(),
        status: 'pending',
        start_time: new Date().toISOString(),
        progress_percentage: 0,
        current_step: '',
        total_steps: testCase.message_flow.length,
        completed_steps: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setExecution(mockExecution);
      await simulator.startSimulation(testCase, mockExecution);
    } catch (error) {
      console.error('Failed to start simulation:', error);
      addLog(`Failed to start simulation: ${error}`);
    }
  };

  const pauseSimulation = () => {
    setIsPaused(true);
    addLog('Simulation paused');
  };

  const resumeSimulation = () => {
    setIsPaused(false);
    addLog('Simulation resumed');
  };

  const stopSimulation = async () => {
    try {
      await simulator.stopSimulation();
      setIsRunning(false);
      setIsPaused(false);
      addLog('Simulation stopped');
    } catch (error) {
      console.error('Failed to stop simulation:', error);
    }
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setIsPaused(false);
    setProgress(0);
    setCurrentStep('');
    setResults([]);
    setLogs([]);
    setErrors([]);
    setMetrics({});
    setStartTime(null);
    setElapsedTime(0);
    setExecution(null);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStepStatusIcon = (result: SimulationStepResult) => {
    if (result.success) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Simulation Engine</h3>
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

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        {currentStep && (
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Current Step:</span>
              <span className="text-sm text-gray-900">{currentStep}</span>
            </div>
          </div>
        )}

        {/* Timer */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">Elapsed Time:</span>
            <span className="text-sm font-mono text-gray-900">{formatTime(elapsedTime)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center space-x-3">
          {!isRunning ? (
            <Button onClick={startSimulation} disabled={isRunning}>
              <Play className="w-4 h-4 mr-2" />
              Start Simulation
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

      {/* Simulation Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Simulation Results</h3>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={result.stepId} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {getStepStatusIcon(result)}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    Step {index + 1}
                  </div>
                  <div className="text-xs text-gray-500">
                    Duration: {result.duration}ms
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {result.success ? 'PASSED' : 'FAILED'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-white rounded-lg border border-red-200 p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Errors
          </h3>
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div key={index} className="text-sm text-red-700 bg-red-50 p-2 rounded">
                {error}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Protocol Layers */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Layers className="w-5 h-5 mr-2" />
          Protocol Layers
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.keys(testCase.layers || {}).map((layerName) => (
            <div key={layerName} className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-primary-600 font-semibold text-sm">
                  {layerName.substring(0, 3)}
                </span>
              </div>
              <div className="text-xs font-medium text-gray-900">{layerName}</div>
              <div className="text-xs text-gray-500">
                {results.some(r => r.metrics && r.metrics[layerName]) ? 'Active' : 'Idle'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulation Logs */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Simulation Logs
        </h3>
        <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
          {logs.length === 0 ? (
            <div className="text-gray-500">No logs yet. Start the simulation to see logs.</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="text-green-400 mb-1">
                {log}
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </div>

      {/* Performance Metrics */}
      {Object.keys(metrics).length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Performance Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(metrics).map(([layer, layerMetrics]) => (
              <div key={layer} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{layer}</h4>
                <div className="space-y-1">
                  {Object.entries(layerMetrics).map(([metric, value]) => (
                    <div key={metric} className="flex justify-between text-sm">
                      <span className="text-gray-600">{metric}:</span>
                      <span className="text-gray-900">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationEngine;