'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Clock,
  Layers,
  TrendingUp,
  Download,
  Filter,
  Eye,
  Maximize2,
  Minimize2
} from 'lucide-react';

// Import professional analysis components
import ProfessionalLogViewer from './ProfessionalLogViewer';
import CallFlowVisualization from './CallFlowVisualization';
import LayerParameterAnalyzer from './LayerParameterAnalyzer';

interface ProfessionalAnalysisPlatformProps {
  executionId?: string | null;
  platform: '5GLABX' | 'UE_ANALYSIS';
}

const ProfessionalAnalysisPlatform: React.FC<ProfessionalAnalysisPlatformProps> = ({ 
  executionId, 
  platform 
}) => {
  const [currentView, setCurrentView] = useState('logs');
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [statistics, setStatistics] = useState({
    totalMessages: 0,
    totalParameters: 0,
    errorCount: 0,
    warningCount: 0,
    criticalCount: 0,
    activeConnections: 0
  });

  // Menu items for professional analysis
  const menuItems = [
    { 
      id: 'logs', 
      label: 'Professional Log Viewer', 
      icon: FileText, 
      description: 'Advanced log analysis with filtering and search',
      badge: statistics.totalMessages > 0 ? statistics.totalMessages.toString() : null
    },
    { 
      id: 'callflow', 
      label: 'Call Flow Visualization', 
      icon: Network, 
      description: 'Interactive call flow with step-by-step analysis',
      badge: 'LIVE'
    },
    { 
      id: 'parameters', 
      label: 'Layer Parameter Analyzer', 
      icon: Layers, 
      description: 'Real-time parameter monitoring and analysis',
      badge: statistics.totalParameters > 0 ? statistics.totalParameters.toString() : null
    },
    { 
      id: 'analytics', 
      label: 'Advanced Analytics', 
      icon: BarChart3, 
      description: 'Statistical analysis and performance metrics',
      badge: 'LIVE'
    },
    { 
      id: 'correlation', 
      label: 'Cross-Layer Correlation', 
      icon: TrendingUp, 
      description: 'Correlate events across protocol layers',
      badge: 'NEW'
    },
    { 
      id: 'export', 
      label: 'Export & Reports', 
      icon: Download, 
      description: 'Export data and generate analysis reports',
      badge: null
    }
  ];

  // Platform-specific menu items
  const platformSpecificItems = platform === 'UE_ANALYSIS' ? [
    { 
      id: 'ue-identity', 
      label: 'UE Identity Analysis', 
      icon: Phone, 
      description: 'UE identity and capability analysis',
      badge: 'UE'
    },
    { 
      id: 'ue-mobility', 
      label: 'UE Mobility Analysis', 
      icon: Activity, 
      description: 'UE mobility and handover analysis',
      badge: 'LIVE'
    },
    { 
      id: 'ue-performance', 
      label: 'UE Performance Analysis', 
      icon: BarChart3, 
      description: 'UE performance metrics and KPIs',
      badge: 'LIVE'
    }
  ] : [
    { 
      id: 'network-topology', 
      label: 'Network Topology', 
      icon: Network, 
      description: 'Network topology and element analysis',
      badge: '5G'
    },
    { 
      id: 'protocol-stack', 
      label: 'Protocol Stack Analysis', 
      icon: Layers, 
      description: 'Complete protocol stack analysis',
      badge: 'LIVE'
    },
    { 
      id: 'network-performance', 
      label: 'Network Performance', 
      icon: BarChart3, 
      description: 'Network performance metrics and KPIs',
      badge: 'LIVE'
    }
  ];

  // All menu items
  const allMenuItems = [...menuItems, ...platformSpecificItems];

  // Simulate real-time statistics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStatistics(prev => ({
        totalMessages: prev.totalMessages + Math.floor(Math.random() * 5),
        totalParameters: prev.totalParameters + Math.floor(Math.random() * 3),
        errorCount: prev.errorCount + (Math.random() > 0.9 ? 1 : 0),
        warningCount: prev.warningCount + (Math.random() > 0.8 ? 1 : 0),
        criticalCount: prev.criticalCount + (Math.random() > 0.95 ? 1 : 0),
        activeConnections: Math.floor(Math.random() * 10) + 1
      }));
      setLastUpdate(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Set connection status
  useEffect(() => {
    setIsConnected(true);
  }, []);

  const renderMenuItem = (item: any) => {
    const Icon = item.icon;
    return (
      <button
        key={item.id}
        onClick={() => setCurrentView(item.id)}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all ${
          currentView === item.id
            ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">{item.label}</div>
            <div className="text-xs text-gray-500">{item.description}</div>
          </div>
        </div>
        {item.badge && (
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            item.badge === 'LIVE' ? 'bg-red-500 text-white animate-pulse' : 
            item.badge === 'NEW' ? 'bg-green-500 text-white' :
            'bg-gray-200 text-gray-700'
          }`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'logs':
        return <ProfessionalLogViewer executionId={executionId} platform={platform} />;
      case 'callflow':
        return <CallFlowVisualization executionId={executionId} platform={platform} />;
      case 'parameters':
        return <LayerParameterAnalyzer executionId={executionId} platform={platform} />;
      case 'analytics':
        return (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-gray-500">Advanced analytics view coming soon...</p>
            </div>
          </div>
        );
      case 'correlation':
        return (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Cross-Layer Correlation</h3>
              <p className="text-gray-500">Cross-layer correlation analysis coming soon...</p>
            </div>
          </div>
        );
      case 'export':
        return (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Download className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Export & Reports</h3>
              <p className="text-gray-500">Export and reporting features coming soon...</p>
            </div>
          </div>
        );
      case 'ue-identity':
        return (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Phone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">UE Identity Analysis</h3>
              <p className="text-gray-500">UE identity analysis coming soon...</p>
            </div>
          </div>
        );
      case 'ue-mobility':
        return (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">UE Mobility Analysis</h3>
              <p className="text-gray-500">UE mobility analysis coming soon...</p>
            </div>
          </div>
        );
      case 'ue-performance':
        return (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">UE Performance Analysis</h3>
              <p className="text-gray-500">UE performance analysis coming soon...</p>
            </div>
          </div>
        );
      case 'network-topology':
        return (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Network className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Network Topology</h3>
              <p className="text-gray-500">Network topology analysis coming soon...</p>
            </div>
          </div>
        );
      case 'protocol-stack':
        return (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Protocol Stack Analysis</h3>
              <p className="text-gray-500">Protocol stack analysis coming soon...</p>
            </div>
          </div>
        );
      case 'network-performance':
        return (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Network Performance</h3>
              <p className="text-gray-500">Network performance analysis coming soon...</p>
            </div>
          </div>
        );
      default:
        return <ProfessionalLogViewer executionId={executionId} platform={platform} />;
    }
  };

  return (
    <div className={`h-full flex flex-col bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Professional Analysis Platform
                </h1>
                <p className="text-sm text-gray-500">
                  {platform === 'UE_ANALYSIS' ? 'UE Log Analysis Suite' : '5GLabX Network Analysis Suite'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${
                isConnected ? 'text-green-600' : 'text-red-600'
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`} />
                <span className="text-sm font-medium">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              {lastUpdate && (
                <span className="text-xs text-gray-500">
                  Last update: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="bg-gray-100 border-b border-gray-200 p-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Messages: {statistics.totalMessages}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Parameters: {statistics.totalParameters}</span>
            </div>
            <div className="flex items-center space-x-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-600">Errors: {statistics.errorCount}</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-600">Warnings: {statistics.warningCount}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-red-600" />
              <span className="text-red-800">Critical: {statistics.criticalCount}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600">Live Analysis</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis Tools</h2>
            
            {/* Core Analysis Tools */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Core Analysis</h3>
              <div className="space-y-1">
                {menuItems.map(renderMenuItem)}
              </div>
            </div>

            {/* Platform-Specific Tools */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                {platform === 'UE_ANALYSIS' ? 'UE Analysis' : 'Network Analysis'}
              </h3>
              <div className="space-y-1">
                {platformSpecificItems.map(renderMenuItem)}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh Data</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                  <Download className="w-4 h-4" />
                  <span>Export All Data</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                  <Filter className="w-4 h-4" />
                  <span>Advanced Filters</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalAnalysisPlatform;