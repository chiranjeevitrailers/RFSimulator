'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, BarChart3, Settings, Shield, Database, Monitor, MessageSquare,
  Layers, Wifi, Cloud, Play, Pause, Square, Eye, Download, Upload,
  RefreshCw, Plus, Search, Filter, Calendar, Clock, TrendingUp,
  AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronRight,
  Satellite, Network, Server, Phone, MapPin, Wave, FileText, Gear,
  QuestionMark, Export, Import, Info
} from 'lucide-react';

// Import DataFormatAdapter integration
import { useDataFormatAdapter } from '@/utils/DataFormatAdapterIntegration';
import LogViewerWithAdapter from '@/components/logs/LogViewerWithAdapter';
import PhyLayerViewWithAdapter from '@/components/views/PhyLayerViewWithAdapter';

// Enhanced 5GLabX Platform with DataFormatAdapter integration
const FiveGLabXPlatformWithAdapter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [logs, setLogs] = useState<any[]>([]);
  const [layerData, setLayerData] = useState<Record<string, any>>({});
  const [playbackService, setPlaybackService] = useState<any>(null);
  
  // Use DataFormatAdapter hook
  const { processLogs, processLayerData, validateData, getSupportedLayers } = useDataFormatAdapter();

  useEffect(() => {
    // Initialize TestCasePlaybackService with DataFormatAdapter
    if (typeof window !== 'undefined' && window.TestCasePlaybackService) {
      const service = new window.TestCasePlaybackService({
        databaseService: window.DatabaseService,
        websocketBroadcast: (type: string, source: string, data: any) => {
          if (type === 'log') {
            setLogs(prev => [...prev, data]);
          }
        },
        fetchImpl: fetch,
        dataFormatAdapter: window.DataFormatAdapter
      });
      setPlaybackService(service);
    }
  }, []);

  // Dashboard View Component
  const DashboardView: React.FC = () => {
    const stats = {
      totalMessages: logs.length,
      errorRate: logs.filter(log => log.level === 'error' || log.level === 'critical').length / Math.max(logs.length, 1) * 100,
      avgThroughput: layerData.PHY?.metrics?.throughput || 0,
      successRate: 100 - (logs.filter(log => log.level === 'error' || log.level === 'critical').length / Math.max(logs.length, 1) * 100)
    };

    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">5GLabX Protocol Analyzer Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Messages</h3>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats.totalMessages}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Avg Throughput</h3>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.avgThroughput.toFixed(1)} Kbps</p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Error Rate</h3>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.errorRate.toFixed(1)}%</p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-600">{stats.successRate.toFixed(1)}%</p>
          </div>
        </div>

        {/* Layer Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Message Distribution by Layer</h3>
            <div className="space-y-3">
              {getSupportedLayers().map(layer => {
                const count = logs.filter(log => log.layer === layer).length;
                return (
                  <div key={layer} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{layer}</span>
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Data Format Adapter Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Adapter Available</span>
                <span className={`text-sm px-2 py-1 rounded ${dataFormatAdapter ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {dataFormatAdapter ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Supported Layers</span>
                <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{getSupportedLayers().length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processed Logs</span>
                <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{logs.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Test Management View Component
  const TestManagementView: React.FC = () => {
    const [selectedTestCase, setSelectedTestCase] = useState<string>('');
    const [isPlaying, setIsPlaying] = useState(false);

    const handleStartTest = async () => {
      if (!playbackService || !selectedTestCase) return;
      
      try {
        setIsPlaying(true);
        const result = await playbackService.startPlayback({
          testCaseId: selectedTestCase,
          runId: `run_${Date.now()}`,
          speed: 1.0
        });
        console.log('Test started:', result);
      } catch (error) {
        console.error('Failed to start test:', error);
        setIsPlaying(false);
      }
    };

    const handleStopTest = async () => {
      if (!playbackService) return;
      
      try {
        await playbackService.stopPlayback();
        setIsPlaying(false);
      } catch (error) {
        console.error('Failed to stop test:', error);
      }
    };

    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Test Management</h1>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Test Case Execution</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Test Case
              </label>
              <select
                value={selectedTestCase}
                onChange={(e) => setSelectedTestCase(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a test case...</option>
                <option value="NR-IA-F1">5G NR Initial Access - Free User</option>
                <option value="NR-IA-P1">5G NR Initial Access - Pro User</option>
                <option value="NR-IA-E1">5G NR Initial Access - Enterprise</option>
                <option value="LTE-IA-F1">LTE Initial Access - Free User</option>
                <option value="VOLTE-CALL-F1">VoLTE Call Setup - Free User</option>
              </select>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={handleStartTest}
                disabled={!selectedTestCase || isPlaying}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Test
              </button>
              
              <button
                onClick={handleStopTest}
                disabled={!isPlaying}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop Test
              </button>
            </div>
            
            {playbackService && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Playback Status</h4>
                <div className="text-sm text-gray-600">
                  <p>Service Available: {playbackService.isDataFormatAdapterAvailable() ? 'Yes' : 'No'}</p>
                  <p>Supported Layers: {playbackService.getSupportedLayers().join(', ')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Platform Analysis View Component
  const PlatformAnalysisView: React.FC = () => {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">5GLabX Platform Analysis</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Log Viewer */}
          <div className="lg:col-span-2">
            <LogViewerWithAdapter
              rawLogs={logs}
              onLogSelect={(log) => console.log('Selected log:', log)}
              showFilters={true}
              showExport={true}
              maxHeight="400px"
            />
          </div>
          
          {/* Layer Views */}
          <div>
            <h3 className="text-lg font-semibold mb-4">PHY Layer Analysis</h3>
            <PhyLayerViewWithAdapter />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Data Processing Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Logs Processed</span>
                <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{logs.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Data Format Adapter</span>
                <span className={`text-sm px-2 py-1 rounded ${dataFormatAdapter ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {dataFormatAdapter ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Playback Service</span>
                <span className={`text-sm px-2 py-1 rounded ${playbackService ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {playbackService ? 'Ready' : 'Not Available'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Settings View Component
  const SettingsView: React.FC = () => {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Data Format Adapter Configuration</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Adapter Status</span>
              <span className={`text-sm px-2 py-1 rounded ${dataFormatAdapter ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {dataFormatAdapter ? 'Available' : 'Not Available'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Supported Layers</span>
              <span className="text-sm text-gray-600">{getSupportedLayers().length} layers</span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supported Protocol Layers
              </label>
              <div className="grid grid-cols-3 gap-2">
                {getSupportedLayers().map(layer => (
                  <span key={layer} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {layer}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">5GLabX Platform</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${dataFormatAdapter ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">Data Adapter</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${playbackService ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">Playback Service</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <nav className="px-6">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'test-management', label: 'Test Management', icon: Settings },
              { id: 'platform-analysis', label: 'Platform Analysis', icon: Monitor },
              { id: 'settings', label: 'Settings', icon: Gear }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab === 'overview' && <DashboardView />}
        {activeTab === 'test-management' && <TestManagementView />}
        {activeTab === 'platform-analysis' && <PlatformAnalysisView />}
        {activeTab === 'settings' && <SettingsView />}
      </div>
    </div>
  );
};

export default FiveGLabXPlatformWithAdapter;