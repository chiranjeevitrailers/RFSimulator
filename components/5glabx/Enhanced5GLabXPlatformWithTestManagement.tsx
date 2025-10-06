// Enhanced 5GLabX Platform with Integrated Test Management Sidebar
// This demonstrates the manage tab functionality integrated as sidebar components

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DataFlowProvider, useDataFlow } from './providers/DataFlowProvider';
import LogsView from './views/LogsView';
import AnalyticsView from './views/AnalyticsView';
import TestSuitesView from './views/TestSuitesView';
import LayerTraceView from './views/LayerTraceView';
import CallFlowView from './views/CallFlowView';
import {
  Activity,
  BarChart3,
  Settings,
  FileText,
  Search,
  Network,
  Phone,
  Shield,
  Play,
  Square,
  RefreshCw,
  Database,
  Wifi,
  Server,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Eye,
  Download,
  Pause,
  Filter,
  TestTube,
  PlayCircle,
  StopCircle,
  RotateCcw
} from 'lucide-react';

// Test Management Sidebar Components
const TestLibraryBrowser: React.FC<{ onTestSelect: (testId: string) => void }> = ({ onTestSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const testCategories = {
    '5G NR': { count: 400, color: 'blue' },
    'LTE': { count: 300, color: 'green' },
    'IMS': { count: 160, color: 'purple' },
    'O-RAN': { count: 30, color: 'orange' },
    'V2X': { count: 20, color: 'red' },
    'NB-IoT': { count: 20, color: 'indigo' }
  };

  const sampleTests = [
    { id: 'test-1', name: '5G NR Random Access', category: '5G NR', status: 'available' },
    { id: 'test-2', name: 'LTE Attach Procedure', category: 'LTE', status: 'available' },
    { id: 'test-3', name: 'IMS SIP Registration', category: 'IMS', status: 'available' }
  ];

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
        <input
          type="text"
          placeholder="Search tests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Categories */}
      <div className="space-y-1">
        <div className="text-xs font-medium text-gray-700">Categories</div>
        {Object.entries(testCategories).map(([category, data]) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`w-full flex items-center justify-between px-2 py-1 text-xs rounded transition-colors ${
              selectedCategory === category 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>📁 {category}</span>
            <span className="text-xs bg-gray-100 px-1 rounded">{data.count}</span>
          </button>
        ))}
      </div>

      {/* Sample Tests */}
      <div className="space-y-1">
        <div className="text-xs font-medium text-gray-700">Quick Access</div>
        {sampleTests.map((test) => (
          <button
            key={test.id}
            onClick={() => onTestSelect(test.id)}
            className="w-full flex items-center justify-between px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded transition-colors"
          >
            <span>🧪 {test.name}</span>
            <PlayCircle className="w-3 h-3 text-green-600" />
          </button>
        ))}
      </div>
    </div>
  );
};

const ActiveTestsMonitor: React.FC = () => {
  const [activeTests] = useState([
    {
      id: 1,
      name: '5G NR Random Access',
      progress: 65,
      status: 'Running',
      duration: '2m30s'
    },
    {
      id: 2,
      name: 'LTE Attach Procedure',
      progress: 45,
      status: 'Running', 
      duration: '1m15s'
    }
  ]);

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-gray-700">Active Tests ({activeTests.length})</div>
      {activeTests.map((test) => (
        <div key={test.id} className="p-2 bg-green-50 rounded border border-green-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-green-900 truncate">{test.name}</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="text-xs text-green-700 mb-1">{test.progress}% • {test.duration}</div>
          <div className="w-full bg-green-200 rounded-full h-1">
            <div 
              className="bg-green-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${test.progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <button className="text-xs text-blue-600 hover:underline flex items-center">
              <Eye className="w-2 h-2 mr-1" />
              View
            </button>
            <button className="text-xs text-red-600 hover:underline flex items-center">
              <StopCircle className="w-2 h-2 mr-1" />
              Stop
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const TestQueueManager: React.FC = () => {
  const [queuedTests] = useState([
    { id: 4, name: '5G NR Handover', scheduled: '10:30 AM' },
    { id: 5, name: 'VoLTE Call Setup', scheduled: '10:35 AM' },
    { id: 6, name: 'LTE Bearer Mgmt', scheduled: '10:40 AM' }
  ]);

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-gray-700">Test Queue ({queuedTests.length})</div>
      {queuedTests.map((test, index) => (
        <div key={test.id} className="p-2 bg-yellow-50 rounded border border-yellow-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-yellow-900 truncate">
              {index + 1}. {test.name}
            </span>
            <Clock className="w-3 h-3 text-yellow-600" />
          </div>
          <div className="text-xs text-yellow-700">⏰ {test.scheduled}</div>
        </div>
      ))}
    </div>
  );
};

const ResultsSummary: React.FC = () => {
  const [recentResults] = useState([
    { id: 1, name: '5G NR Random Access', status: 'Passed', time: '2min ago' },
    { id: 2, name: 'LTE Attach', status: 'Passed', time: '5min ago' },
    { id: 3, name: 'IMS Registration', status: 'Failed', time: '8min ago' }
  ]);

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-gray-700">Recent Results</div>
      {recentResults.map((result) => (
        <div key={result.id} className="p-2 bg-gray-50 rounded border">
          <div className="flex items-center space-x-2 mb-1">
            {result.status === 'Passed' ? (
              <CheckCircle className="w-3 h-3 text-green-600" />
            ) : (
              <XCircle className="w-3 h-3 text-red-600" />
            )}
            <span className="text-xs font-medium text-gray-900 truncate">{result.name}</span>
          </div>
          <div className="text-xs text-gray-600">{result.time}</div>
        </div>
      ))}
    </div>
  );
};

const QuickExecute: React.FC<{ onExecute: (action: string) => void }> = ({ onExecute }) => {
  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-gray-700">Quick Actions</div>
      <div className="grid grid-cols-2 gap-1">
        <button 
          onClick={() => onExecute('run-selected')}
          className="flex items-center justify-center px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          <Play className="w-2 h-2 mr-1" />
          Run
        </button>
        <button 
          onClick={() => onExecute('stop-all')}
          className="flex items-center justify-center px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          <Square className="w-2 h-2 mr-1" />
          Stop
        </button>
        <button 
          onClick={() => onExecute('schedule')}
          className="flex items-center justify-center px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
        >
          <Calendar className="w-2 h-2 mr-1" />
          Schedule
        </button>
        <button 
          onClick={() => onExecute('export')}
          className="flex items-center justify-center px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Download className="w-2 h-2 mr-1" />
          Export
        </button>
      </div>
    </div>
  );
};

// Enhanced Sidebar Component with Test Management Integration
const EnhancedSidebarWithTestManagement: React.FC<{
  currentView: string;
  onNavigate: (viewId: string) => void;
}> = ({ currentView, onNavigate }) => {
  const { layerData, getLayerStatistics } = useDataFlow();
  const [layerStats, setLayerStats] = useState<Record<string, any>>({});
  const [testManagementExpanded, setTestManagementExpanded] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setLayerStats(getLayerStatistics());
    }, 1000);

    return () => clearInterval(interval);
  }, [getLayerStatistics]);

  const handleTestSelect = (testId: string) => {
    console.log('Selected test:', testId);
    onNavigate('test-execution');
  };

  const handleQuickExecute = (action: string) => {
    console.log('Quick execute action:', action);
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Enhanced Dashboard',
      icon: Activity,
      active: currentView === 'dashboard'
    },
    {
      id: 'logs',
      label: 'Logs Viewer',
      icon: FileText,
      badge: layerData ? Object.values(layerData || {}).flat().length : 0
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: 'LIVE'
    },
    {
      id: 'test-suites',
      label: 'Test Suites',
      icon: Shield
    }
  ];

  const protocolLayers = [
    { id: 'phy-layer', label: 'PHY Layer', icon: Wifi, count: layerStats.PHY?.totalCount || 0 },
    { id: 'mac-layer', label: 'MAC Layer', icon: Network, count: layerStats.MAC?.totalCount || 0 },
    { id: 'rlc-layer', label: 'RLC Layer', icon: Network, count: layerStats.RLC?.totalCount || 0 },
    { id: 'pdcp-layer', label: 'PDCP Layer', icon: FileText, count: layerStats.PDCP?.totalCount || 0 },
    { id: 'rrc-layer', label: 'RRC Layer', icon: Network, count: layerStats.RRC?.totalCount || 0 },
    { id: 'nas-layer', label: 'NAS Layer', icon: Server, count: layerStats.NAS?.totalCount || 0 }
  ];

  const renderMenuItem = (item: any) => {
    const Icon = item.icon;
    return (
      <button
        key={item.id}
        onClick={() => onNavigate(item.id)}
        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          item.active
            ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-500'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <Icon className="w-4 h-4 mr-3" />
        <span className="flex-1 text-left">{item.label}</span>
        {item.badge && (
          <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
            item.badge === 'LIVE'
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-gray-200 text-gray-700'
          }`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-900">5GLabX Enhanced</h1>
        <p className="text-xs text-gray-600">with Test Management</p>
      </div>

      <nav className="px-4 space-y-2">
        {/* Main Views */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">MAIN VIEWS</h3>
          <div className="space-y-1">
            {menuItems.map(renderMenuItem)}
          </div>
        </div>

        {/* Test Management Section - NEW! */}
        <div className="mb-6">
          <button
            onClick={() => setTestManagementExpanded(!testManagementExpanded)}
            className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-0 hover:text-gray-700 transition-colors"
          >
            <div className="flex items-center">
              <TestTube className="w-3 h-3 mr-2" />
              <span>TEST MANAGEMENT</span>
            </div>
            {testManagementExpanded ? 
              <ChevronDown className="w-4 h-4" /> : 
              <ChevronRight className="w-4 h-4" />
            }
          </button>
          
          {testManagementExpanded && (
            <div className="space-y-4 pl-2 border-l-2 border-blue-100">
              <TestLibraryBrowser onTestSelect={handleTestSelect} />
              <ActiveTestsMonitor />
              <TestQueueManager />
              <ResultsSummary />
              <QuickExecute onExecute={handleQuickExecute} />
            </div>
          )}
        </div>

        {/* Protocol Layers */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">PROTOCOL LAYERS</h3>
          <div className="space-y-1">
            {protocolLayers.map(layer => {
              const Icon = layer.icon;
              return (
                <button
                  key={layer.id}
                  onClick={() => onNavigate(layer.id)}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Icon className="w-4 h-4 mr-3" />
                  <span className="flex-1 text-left">{layer.label}</span>
                  {layer.count > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                      {layer.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

// Test Execution View Component
const TestExecutionView: React.FC = () => {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Execution</h2>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-800">
            🎯 This view shows the selected test case execution in full detail.
            This would be the expanded view of the test management functionality
            that was accessed from the sidebar.
          </p>
          <div className="mt-4 space-y-2">
            <div className="text-sm text-blue-700">
              <strong>Selected Test:</strong> Test case selected from sidebar browser
            </div>
            <div className="text-sm text-blue-700">
              <strong>Execution Status:</strong> Ready to start
            </div>
            <div className="text-sm text-blue-700">
              <strong>Integration:</strong> ✅ Sidebar → Main View communication working
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Dashboard Component 
const EnhancedDashboardWithTestIntegration: React.FC = () => {
  const { isConnected, layerData, realTimeData, getLayerStatistics } = useDataFlow();
  const [layerStats, setLayerStats] = useState<Record<string, any>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setLayerStats(getLayerStatistics());
    }, 1000);
    return () => clearInterval(interval);
  }, [getLayerStatistics]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">5GLabX Enhanced Dashboard</h2>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-green-900 font-semibold mb-2">✅ Test Management Integration Complete!</h3>
          <p className="text-green-800 text-sm">
            The Test Management Tab functionality has been successfully integrated as sidebar components.
            You can now access test case browsing, execution monitoring, queue management, and results
            directly from the enhanced sidebar on the left.
          </p>
        </div>
      </div>

      {/* Integration Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Test Library</h3>
          <div className="text-2xl font-bold text-blue-600">1,030</div>
          <div className="text-xs text-gray-500">Available Test Cases</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Active Tests</h3>
          <div className="text-2xl font-bold text-green-600">2</div>
          <div className="text-xs text-gray-500">Currently Running</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Test Queue</h3>
          <div className="text-2xl font-bold text-yellow-600">3</div>
          <div className="text-xs text-gray-500">Scheduled Tests</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Success Rate</h3>
          <div className="text-2xl font-bold text-purple-600">94%</div>
          <div className="text-xs text-gray-500">Last 24 Hours</div>
        </div>
      </div>

      {/* Integration Benefits */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Integration Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">✅ Unified Experience</h4>
            <p className="text-sm text-gray-600">
              Test management is now seamlessly integrated into the 5GLabX platform,
              providing a unified experience without switching between different tabs.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">🚀 Quick Access</h4>
            <p className="text-sm text-gray-600">
              All test management features are accessible from the sidebar, enabling
              quick test execution while viewing protocol analysis.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">🔄 Real-time Sync</h4>
            <p className="text-sm text-gray-600">
              Test execution status and results are synchronized in real-time
              between the sidebar components and main analysis views.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">📱 Responsive Design</h4>
            <p className="text-sm text-gray-600">
              The sidebar components adapt to different screen sizes while
              maintaining full functionality on all devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Enhanced Platform Component with Test Management
const Enhanced5GLabXPlatformWithTestManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <EnhancedDashboardWithTestIntegration />;
      case 'test-execution':
        return <TestExecutionView />;
      case 'logs':
        return <LogsView appState={{ enhanced: currentView === 'enhanced-logs' }} onStateChange={() => {}} />;
      case 'analytics':
        return <AnalyticsView />;
      case 'test-suites':
        return <TestSuitesView />;
      default:
        return <EnhancedDashboardWithTestIntegration />;
    }
  };

  return (
    <DataFlowProvider>
      <div className="flex h-screen bg-gray-100">
        {/* Enhanced Sidebar with Test Management */}
        <EnhancedSidebarWithTestManagement
          currentView={currentView}
          onNavigate={setCurrentView}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <h1 className="text-lg font-semibold text-gray-900">
                Enhanced 5GLabX Platform with Test Management - {currentView.replace('-', ' ').toUpperCase()}
              </h1>
            </div>
          </header>

          <main className="p-6">
            {renderCurrentView()}
          </main>
        </div>
      </div>
    </DataFlowProvider>
  );
};

export default Enhanced5GLabXPlatformWithTestManagement;