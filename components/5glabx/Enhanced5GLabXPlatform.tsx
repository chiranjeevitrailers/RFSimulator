// Enhanced 5GLabX Platform with Fixed Data Flow
// This component integrates all the fixed services and ensures proper data flow

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import EnhancedServiceIntegration from './services/EnhancedServiceIntegration';
import { EnhancedDataFlowProvider, useEnhancedDataFlow } from './services/EnhancedDataFlowIntegration';
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
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

// Enhanced Dashboard Component
const EnhancedDashboard: React.FC = () => {
  const {
    isConnected,
    executionStatus,
    layerData,
    realTimeData,
    getLayerStatistics,
    startTestCase,
    stopTestCase,
    clearData
  } = useEnhancedDataFlow();

  const [selectedTestCaseId, setSelectedTestCaseId] = useState('');
  const [layerStats, setLayerStats] = useState<Record<string, any>>({});

  // Update layer statistics every second
  useEffect(() => {
    const interval = setInterval(() => {
      setLayerStats(getLayerStatistics());
    }, 1000);

    return () => clearInterval(interval);
  }, [getLayerStatistics]);

  const handleStartTestCase = async () => {
    if (!selectedTestCaseId) {
      alert('Please select a test case ID');
      return;
    }

    try {
      await startTestCase(selectedTestCaseId);
    } catch (error) {
      console.error('Failed to start test case:', error);
      alert('Failed to start test case execution');
    }
  };

  const handleStopTestCase = async () => {
    try {
      await stopTestCase();
    } catch (error) {
      console.error('Failed to stop test case:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-600';
      case 'stopping': case 'starting': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return CheckCircle;
      case 'stopping': case 'starting': return Clock;
      case 'error': return XCircle;
      default: return AlertTriangle;
    }
  };

  const StatusIcon = getStatusIcon(executionStatus);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">5GLabX Enhanced Dashboard</h2>

        {/* Connection Status */}
        <div className="flex items-center space-x-4 mb-6">
          <div className={`flex items-center space-x-2 ${
            isConnected ? 'text-green-600' : 'text-red-600'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`} />
            <span className="font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <div className={`flex items-center space-x-2 ${getStatusColor(executionStatus)}`}>
            <StatusIcon className="w-4 h-4" />
            <span className="font-medium">Status: {executionStatus}</span>
          </div>
        </div>

        {/* Test Case Controls */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Enter Test Case ID (e.g., 2fac4988-2313-4197-bc7e-39d3a66f23c1)"
            value={selectedTestCaseId}
            onChange={(e) => setSelectedTestCaseId(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleStartTestCase}
            disabled={!isConnected || executionStatus === 'running'}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            <span>Start</span>
          </button>

          <button
            onClick={handleStopTestCase}
            disabled={executionStatus !== 'running'}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Square className="w-4 h-4" />
            <span>Stop</span>
          </button>

          <button
            onClick={clearData}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Layer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(layerStats).map(([layer, stats]) => (
          <div key={layer} className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">{layer} Layer</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">{stats.totalCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Errors:</span>
                <span className={`font-medium ${
                  stats.errorCount > 0 ? 'text-red-600' : 'text-green-600'
                }`}>{stats.errorCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Per Min:</span>
                <span className="font-medium">{stats.messagesPerMinute || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Data Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Real-time Data Flow</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{realTimeData.length}</div>
            <div className="text-sm text-gray-500">Total Messages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Object.values(layerData).flat().length}
            </div>
            <div className="text-sm text-gray-500">Layer Messages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(layerStats).length}
            </div>
            <div className="text-sm text-gray-500">Active Layers</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Test Cases</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              setSelectedTestCaseId('2fac4988-2313-4197-bc7e-39d3a66f23c1');
              setTimeout(handleStartTestCase, 100);
            }}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <h4 className="font-medium">MO Data End-to-End</h4>
            <p className="text-sm text-gray-500 mt-1">PDP Activation → Data Transfer</p>
          </button>

          <button
            onClick={() => {
              setSelectedTestCaseId('da690637-519e-4dec-89b4-6dfe74d4e5dd');
              setTimeout(handleStartTestCase, 100);
            }}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <h4 className="font-medium">MT Data End-to-End</h4>
            <p className="text-sm text-gray-500 mt-1">Paging → Data Delivery</p>
          </button>

          <button
            onClick={() => {
              setSelectedTestCaseId('84618fcb-aee1-4c12-a179-939f6decc04c');
              setTimeout(handleStartTestCase, 100);
            }}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <h4 className="font-medium">MT CSFB End-to-End</h4>
            <p className="text-sm text-gray-500 mt-1">Voice Call → Fallback</p>
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Sidebar Component
const EnhancedSidebar: React.FC<{
  currentView: string;
  onNavigate: (viewId: string) => void;
}> = ({ currentView, onNavigate }) => {
  const { layerData, getLayerStatistics } = useEnhancedDataFlow();
  const [layerStats, setLayerStats] = useState<Record<string, any>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setLayerStats(getLayerStatistics());
    }, 1000);

    return () => clearInterval(interval);
  }, [getLayerStatistics]);

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
      badge: layerData ? Object.values(layerData).flat().length : 0
    },
    {
      id: 'enhanced-logs',
      label: 'Enhanced Logs',
      icon: Search,
      badge: Object.keys(layerStats).length
    },
    {
      id: 'layer-trace',
      label: 'Layer Trace',
      icon: Network,
      badge: 'LIVE'
    },
    {
      id: 'callflow',
      label: 'Call Flow',
      icon: Phone
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
    { id: 'nas-layer', label: 'NAS Layer', icon: Server, count: layerStats.NAS?.totalCount || 0 },
    { id: 'ims-layer', label: 'IMS Analysis', icon: Phone, count: layerStats.IMS?.totalCount || 0 }
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
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-900">5GLabX Enhanced</h1>
      </div>

      <nav className="px-4 space-y-2">
        {/* Main Views */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">MAIN VIEWS</h3>
          <div className="space-y-1">
            {menuItems.map(renderMenuItem)}
          </div>
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

// Main Enhanced Platform Component
const Enhanced5GLabXPlatform: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <EnhancedDashboard />;
      case 'logs':
        return <LogsView />;
      case 'enhanced-logs':
        return <LogsView enhanced={true} />;
      case 'layer-trace':
        return <LayerTraceView />;
      case 'callflow':
        return <CallFlowView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'test-suites':
        return <TestSuitesView />;
      default:
        return <EnhancedDashboard />;
    }
  };

  return (
    <EnhancedDataFlowProvider>
      <EnhancedServiceIntegration>
        <div className="flex h-screen bg-gray-100">
          {/* Enhanced Sidebar */}
          <EnhancedSidebar
            currentView={currentView}
            onNavigate={setCurrentView}
          />

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <header className="bg-white shadow-sm border-b border-gray-200">
              <div className="px-6 py-4">
                <h1 className="text-lg font-semibold text-gray-900">
                  Enhanced 5GLabX Platform - {currentView.replace('-', ' ').toUpperCase()}
                </h1>
              </div>
            </header>

            <main className="p-6">
              {renderCurrentView()}
            </main>
          </div>
        </div>
      </EnhancedServiceIntegration>
    </EnhancedDataFlowProvider>
  );
};

export default Enhanced5GLabXPlatform;