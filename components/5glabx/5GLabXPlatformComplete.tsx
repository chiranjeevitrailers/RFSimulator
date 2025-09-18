'use client';

import React, { useState } from 'react';
import { 
  Activity, BarChart3, Settings, Shield, Database, Monitor, MessageSquare,
  Layers, Wifi, Cloud, Play, Pause, Square, Eye, Download, Upload,
  RefreshCw, Plus, Search, Filter, Calendar, Clock, TrendingUp,
  AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronRight,
  Satellite, Network, Server, Phone, MapPin, Wave, FileText, Gear,
  QuestionMark, Export, Import, Info
} from 'lucide-react';
import LogViewer from '@/components/logs/LogViewer';

// Dashboard View Component
const DashboardView: React.FC = () => {
  const stats = {
    totalMessages: 5,
    errorRate: '20.00',
    avgThroughput: '0',
    successRate: '80.00'
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
          <p className="text-3xl font-bold text-green-600">{stats.avgThroughput} Kbps</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Error Rate</h3>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600">{stats.errorRate}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-600">{stats.successRate}%</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Message Distribution by Component</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">PHY</span>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">MAC</span>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">RLC</span>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">SCHED</span>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">1</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Message Types Analysis</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium">PDSCH</span>
              </div>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">1</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">DL PDU</span>
              </div>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Logs View Component
const EnhancedLogsView: React.FC = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">Enhanced Logs</h1>
    <div className="bg-white p-6 rounded-lg border">
      <p className="text-gray-600">Enhanced logs viewer with advanced filtering and analysis capabilities.</p>
    </div>
  </div>
);

// Layer Trace View Component
const LayerTraceView: React.FC = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">Layer Trace</h1>
    <div className="bg-white p-6 rounded-lg border">
      <p className="text-gray-600">Protocol layer message flow and timing analysis.</p>
    </div>
  </div>
);

// Call Flow View Component
const CallFlowView: React.FC = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">Call Flow</h1>
    <div className="bg-white p-6 rounded-lg border">
      <p className="text-gray-600">Protocol message sequences and call flow analysis.</p>
    </div>
  </div>
);

// Analytics View Component
const AnalyticsView: React.FC = () => (
  <div className="p-6 space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-600">LIVE</span>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg border">
      <p className="text-gray-600">Real-time analytics and performance monitoring.</p>
    </div>
  </div>
);

// O-RAN Analysis Views
const OranOverviewView: React.FC = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">O-RAN Overview</h1>
    <div className="bg-white p-6 rounded-lg border">
      <p className="text-gray-600">O-RAN architecture overview and analysis.</p>
    </div>
  </div>
);

const OranInterfacesView: React.FC = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">O-RAN Interfaces</h1>
    <div className="bg-white p-6 rounded-lg border">
      <p className="text-gray-600">O-RAN interface analysis and monitoring.</p>
    </div>
  </div>
);

// NTN Analysis Views
const NtnOverviewView: React.FC = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">NTN Overview</h1>
    <div className="bg-white p-6 rounded-lg border">
      <p className="text-gray-600">Non-Terrestrial Network overview and analysis.</p>
    </div>
  </div>
);

const NtnSatellitesView: React.FC = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">Satellite Links</h1>
    <div className="bg-white p-6 rounded-lg border">
      <p className="text-gray-600">Satellite link analysis and monitoring.</p>
    </div>
  </div>
);

const NtnAnalyticsView: React.FC = () => (
  <div className="p-6 space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">NTN Analytics</h1>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-600">LIVE</span>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg border">
      <p className="text-gray-600">NTN analytics and performance monitoring.</p>
    </div>
  </div>
);

// Protocol Layer Views
const PhyLayerView: React.FC = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">PHY Layer</h1>
    <div className="bg-white p-6 rounded-lg border">
      <p className="text-gray-600">Physical layer analysis and monitoring.</p>
    </div>
  </div>
);

const MacLayerView: React.FC = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">MAC Layer</h1>
    <div className="bg-white p-6 rounded-lg border">
      <p className="text-gray-600">MAC layer analysis and monitoring.</p>
    </div>
  </div>
);

// Core Network Views
const AmfAnalyzerView: React.FC = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">AMF Analyzer</h1>
    <div className="bg-white p-6 rounded-lg border">
      <p className="text-gray-600">Access and Mobility Management Function analyzer.</p>
    </div>
  </div>
);

const SmfAnalyzerView: React.FC = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">SMF Analyzer</h1>
    <div className="bg-white p-6 rounded-lg border">
      <p className="text-gray-600">Session Management Function analyzer.</p>
    </div>
  </div>
);

// Utilities Views
const ReportGeneratorView: React.FC = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">Report Generator</h1>
    <div className="bg-white p-6 rounded-lg border">
      <p className="text-gray-600">Generate comprehensive analysis reports.</p>
    </div>
  </div>
);

const ExportManagerView: React.FC = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">Export Manager</h1>
    <div className="bg-white p-6 rounded-lg border">
      <p className="text-gray-600">Export data and analysis results.</p>
    </div>
  </div>
);

// Sidebar Component with all navigation items
const Sidebar: React.FC<{
  currentView: string;
  onNavigate: (viewId: string) => void;
}> = ({ currentView, onNavigate }) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    'oran-analysis': false,
    'nbiot-analysis': false,
    'v2x-analysis': false,
    'ntn-analysis': false
  });

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, active: currentView === 'dashboard' },
    { id: 'logs', label: 'Logs Viewer', icon: FileText },
    { id: 'enhanced-logs', label: 'Enhanced Logs', icon: Search },
    { id: 'layer-trace', label: 'Layer Trace', icon: Network },
    { id: 'callflow', label: 'Call Flow', icon: Phone }
  ];

  const analyticsItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: 'LIVE' }
  ];

  const oranItems = [
    { id: 'oran-overview', label: 'O-RAN Overview', icon: Network },
    { id: 'oran-interfaces', label: 'O-RAN Interfaces', icon: Network }
  ];

  const ntnItems = [
    { id: 'ntn-overview', label: 'NTN Overview', icon: Satellite },
    { id: 'ntn-satellites', label: 'Satellite Links', icon: Satellite },
    { id: 'ntn-analytics', label: 'NTN Analytics', icon: BarChart3, badge: 'LIVE' },
    { id: 'ntn-sib19', label: 'SIB19 Analysis', icon: FileText },
    { id: 'ntn-timing', label: 'Timing & Delay', icon: Clock },
    { id: 'ntn-doppler', label: 'Doppler Analysis', icon: Wave },
    { id: 'ntn-scenarios', label: 'NTN Scenarios', icon: MapPin }
  ];

  const protocolLayers = [
    { id: 'phy-layer', label: 'PHY Layer', icon: Wifi },
    { id: 'mac-layer', label: 'MAC Layer', icon: Network },
    { id: 'rlc-layer', label: 'RLC Layer', icon: Network },
    { id: 'pdcp-layer', label: 'PDCP Layer', icon: FileText },
    { id: 'rrc-layer', label: 'RRC Layer', icon: Network },
    { id: 'nas-layer', label: 'NAS Layer', icon: Server },
    { id: 'ims-layer', label: 'IMS Analysis', icon: Phone }
  ];

  const coreNetwork = [
    { id: 'amf-analyzer', label: 'AMF Analyzer', icon: Server },
    { id: 'smf-analyzer', label: 'SMF Analyzer', icon: Server },
    { id: 'upf-analyzer', label: 'UPF Analyzer', icon: Server },
    { id: 'ausf-analyzer', label: 'AUSF Analyzer', icon: Server },
    { id: 'udm-analyzer', label: 'UDM Analyzer', icon: Database },
    { id: 'config-manager', label: 'Config Manager', icon: Gear }
  ];

  const legacy4G = [
    { id: 'mme-analyzer', label: 'MME Analyzer', icon: Server },
    { id: 'sgw-analyzer', label: 'SGW Analyzer', icon: Server },
    { id: 'pgw-analyzer', label: 'PGW Analyzer', icon: Server }
  ];

  const utilities = [
    { id: 'report-generator', label: 'Report Generator', icon: FileText },
    { id: 'export-manager', label: 'Export Manager', icon: Export },
    { id: 'help-support', label: 'Help & Support', icon: QuestionMark }
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
          <span className="ml-2 px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full animate-pulse">
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  const renderSection = (section: any, items: any[], title: string) => {
    const isCollapsed = collapsedSections[section];
    return (
      <div className="mb-2">
        <button
          onClick={() => toggleSection(section)}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md"
        >
          <ChevronRight className={`w-4 h-4 mr-3 transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-90'}`} />
          <span className="flex-1 text-left">{title}</span>
        </button>
        {!isCollapsed && (
          <div className="ml-4 mt-1 space-y-1">
            {items.map((item: any) => renderMenuItem(item))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-900">5GLabX</h1>
      </div>
      
      <nav className="px-4 space-y-2">
        {/* Main Views */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">MAIN VIEWS</h3>
          <div className="space-y-1">
            {menuItems.map(renderMenuItem)}
          </div>
        </div>

        {/* Analytics */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">ANALYTICS</h3>
          <div className="space-y-1">
            {analyticsItems.map(renderMenuItem)}
          </div>
        </div>

        {/* O-RAN Analysis */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">O-RAN ANALYSIS</h3>
          <div className="space-y-1">
            {renderSection('oran-analysis', oranItems, 'O-RAN ANALYSIS')}
          </div>
        </div>

        {/* NTN Analysis */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">NTN ANALYSIS</h3>
          <div className="space-y-1">
            {renderSection('ntn-analysis', ntnItems, 'NTN ANALYSIS')}
          </div>
        </div>

        {/* Protocol Layers */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">PROTOCOL LAYERS</h3>
          <div className="space-y-1">
            {protocolLayers.map(renderMenuItem)}
          </div>
        </div>

        {/* Core Network */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">CORE NETWORK</h3>
          <div className="space-y-1">
            {coreNetwork.map(renderMenuItem)}
          </div>
        </div>

        {/* 4G Legacy */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">4G LEGACY</h3>
          <div className="space-y-1">
            {legacy4G.map(renderMenuItem)}
          </div>
        </div>

        {/* Utilities */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">UTILITIES</h3>
          <div className="space-y-1">
            {utilities.map(renderMenuItem)}
          </div>
        </div>
      </nav>
    </div>
  );
};

// Main 5GLabX Platform Component
const FiveGLabXPlatformComplete: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const navigate = (viewId: string) => {
    setCurrentView(viewId);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'logs':
        return (
          <div className="p-4 h-full overflow-hidden">
            <LogViewer executionId="live" testCaseId="" userId="demo" mode="basic" />
          </div>
        );
      case 'enhanced-logs':
        return (
          <div className="p-4 h-full overflow-hidden">
            <LogViewer executionId="live" testCaseId="" userId="demo" mode="enhanced" />
          </div>
        );
      case 'layer-trace':
        return <LayerTraceView />;
      case 'callflow':
        return <CallFlowView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'oran-overview':
        return <OranOverviewView />;
      case 'oran-interfaces':
        return <OranInterfacesView />;
      case 'ntn-overview':
        return <NtnOverviewView />;
      case 'ntn-satellites':
        return <NtnSatellitesView />;
      case 'ntn-analytics':
        return <NtnAnalyticsView />;
      case 'phy-layer':
        return <PhyLayerView />;
      case 'mac-layer':
        return <MacLayerView />;
      case 'amf-analyzer':
        return <AmfAnalyzerView />;
      case 'smf-analyzer':
        return <SmfAnalyzerView />;
      case 'report-generator':
        return <ReportGeneratorView />;
      case 'export-manager':
        return <ExportManagerView />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">View Not Found</h2>
              <p className="text-gray-600">View "{currentView}" is not available</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar currentView={currentView} onNavigate={navigate} />
      <div className="flex-1 overflow-auto">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default FiveGLabXPlatformComplete;