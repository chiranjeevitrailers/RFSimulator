'use client';

import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  FileText,
  Database,
  Monitor,
  Zap,
  Shield,
  Activity,
  TrendingUp,
  RefreshCw,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface TestExecutionModalProps {
  selectedTests: string[];
  onRunTests: (testIds: string[], config: any) => void;
  activeRun: any;
}

const TestExecutionModal: React.FC<TestExecutionModalProps> = ({
  selectedTests,
  onRunTests,
  activeRun
}) => {
  const [config, setConfig] = useState({
    execution_mode: 'simulation',
    time_acceleration: 1,
    log_level: 'detailed',
    capture_mode: 'full',
    input_files: [] as string[]
  });
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const fileNames = files.map(file => file.name);
    setConfig(prev => ({
      ...prev,
      input_files: [...prev.input_files, ...fileNames]
    }));
  };

  const removeFile = (fileName: string) => {
    setConfig(prev => ({
      ...prev,
      input_files: prev.input_files.filter(f => f !== fileName)
    }));
  };

  const handleRun = () => {
    onRunTests(selectedTests, config);
  };

  if (activeRun) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Test Execution</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                activeRun.status === 'running' ? 'bg-green-500' :
                activeRun.status === 'completed' ? 'bg-blue-500' :
                activeRun.status === 'failed' ? 'bg-red-500' :
                'bg-yellow-500'
              }`}></div>
              <span className="text-sm font-medium text-gray-600 capitalize">{activeRun.status}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{activeRun.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${activeRun.progress}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Tests:</span>
                <span className="ml-2 font-medium">{activeRun.results?.total_tests || 0}</span>
              </div>
              <div>
                <span className="text-gray-600">Completed:</span>
                <span className="ml-2 font-medium">{activeRun.results?.completed_tests || 0}</span>
              </div>
              <div>
                <span className="text-gray-600">Passed:</span>
                <span className="ml-2 font-medium text-green-600">{activeRun.results?.passed_tests || 0}</span>
              </div>
              <div>
                <span className="text-gray-600">Failed:</span>
                <span className="ml-2 font-medium text-red-600">{activeRun.results?.failed_tests || 0}</span>
              </div>
            </div>
            
            {activeRun.current_test && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Currently running:</span>
                  <span className="text-sm text-gray-700">{activeRun.current_test}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Test Execution Configuration</h3>
          <span className="text-sm text-gray-600">{selectedTests.length} tests selected</span>
        </div>
        
        <div className="space-y-6">
          {/* Execution Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Execution Mode</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'simulation', label: 'Simulation', icon: Monitor, description: 'Fast simulation mode' },
                { value: 'realtime', label: 'Real-time', icon: Clock, description: 'Real-time execution' },
                { value: 'batch', label: 'Batch', icon: Database, description: 'Batch processing' }
              ].map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => handleConfigChange('execution_mode', mode.value)}
                  className={`p-4 rounded-lg border text-left transition-colors ${
                    config.execution_mode === mode.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <mode.icon className="w-4 h-4" />
                    <span className="font-medium">{mode.label}</span>
                  </div>
                  <p className="text-xs text-gray-600">{mode.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Time Acceleration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Acceleration</label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={config.time_acceleration}
                onChange={(e) => handleConfigChange('time_acceleration', parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-900">{config.time_acceleration}x</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Higher values run tests faster</p>
          </div>

          {/* Log Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Log Level</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'basic', label: 'Basic', description: 'Essential logs only' },
                { value: 'detailed', label: 'Detailed', description: 'Comprehensive logging' },
                { value: 'verbose', label: 'Verbose', description: 'All debug information' }
              ].map((level) => (
                <button
                  key={level.value}
                  onClick={() => handleConfigChange('log_level', level.value)}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    config.log_level === level.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{level.label}</div>
                  <p className="text-xs text-gray-600">{level.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Capture Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Capture Mode</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'messages', label: 'Messages', icon: FileText, description: 'Message flow only' },
                { value: 'full', label: 'Full', icon: Database, description: 'Complete data capture' },
                { value: 'performance', label: 'Performance', icon: TrendingUp, description: 'Performance metrics' }
              ].map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => handleConfigChange('capture_mode', mode.value)}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    config.capture_mode === mode.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <mode.icon className="w-4 h-4 mx-auto mb-1" />
                  <div className="font-medium">{mode.label}</div>
                  <p className="text-xs text-gray-600">{mode.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Input Files */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Input Files (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Upload log files or traces</p>
              <input
                type="file"
                multiple
                accept=".pcap,.log,.txt,.json"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </label>
            </div>
            
            {config.input_files.length > 0 && (
              <div className="mt-3 space-y-2">
                {config.input_files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{file}</span>
                    </div>
                    <button
                      onClick={() => removeFile(file)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Advanced Configuration */}
          <div>
            <button
              onClick={() => setIsConfigExpanded(!isConfigExpanded)}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <Settings className="w-4 h-4" />
              <span>Advanced Configuration</span>
              {isConfigExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {isConfigExpanded && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timeout (seconds)</label>
                    <input
                      type="number"
                      min="30"
                      max="3600"
                      defaultValue="300"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Retry Count</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      defaultValue="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Environment Variables</label>
                  <textarea
                    placeholder="KEY1=value1&#10;KEY2=value2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Run Button */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              Save Configuration
            </button>
            <button
              onClick={handleRun}
              disabled={selectedTests.length === 0}
              className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4 mr-2" />
              Run Tests ({selectedTests.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestExecutionModal;