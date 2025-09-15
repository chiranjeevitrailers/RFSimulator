'use client';

import React, { useState } from 'react';

// Very simple Dashboard View
const DashboardView: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">5GLabX Protocol Analyzer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Messages</h3>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600">📊</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">5</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Avg Throughput</h3>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600">📈</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">0 Kbps</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Error Rate</h3>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600">⚠️</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600">20.00%</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600">✅</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-600">80.00%</p>
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

// Simple Generic View
const SimpleView: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    <div className="bg-white p-6 rounded-lg border">
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

// Simple Sidebar
const SimpleSidebar: React.FC<{
  currentView: string;
  onNavigate: (viewId: string) => void;
}> = ({ currentView, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', active: currentView === 'dashboard' },
    { id: 'logs', label: 'Logs Viewer' },
    { id: 'enhanced-logs', label: 'Enhanced Logs' },
    { id: 'layer-trace', label: 'Layer Trace' },
    { id: 'callflow', label: 'Call Flow' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'oran-overview', label: 'O-RAN Overview' },
    { id: 'oran-interfaces', label: 'O-RAN Interfaces' },
    { id: 'ntn-overview', label: 'NTN Overview' },
    { id: 'ntn-satellites', label: 'Satellite Links' },
    { id: 'ntn-analytics', label: 'NTN Analytics' },
    { id: 'phy-layer', label: 'PHY Layer' },
    { id: 'mac-layer', label: 'MAC Layer' },
    { id: 'rlc-layer', label: 'RLC Layer' },
    { id: 'pdcp-layer', label: 'PDCP Layer' },
    { id: 'rrc-layer', label: 'RRC Layer' },
    { id: 'nas-layer', label: 'NAS Layer' },
    { id: 'ims-layer', label: 'IMS Analysis' },
    { id: 'amf-analyzer', label: 'AMF Analyzer' },
    { id: 'smf-analyzer', label: 'SMF Analyzer' },
    { id: 'upf-analyzer', label: 'UPF Analyzer' },
    { id: 'ausf-analyzer', label: 'AUSF Analyzer' },
    { id: 'udm-analyzer', label: 'UDM Analyzer' },
    { id: 'config-manager', label: 'Config Manager' },
    { id: 'mme-analyzer', label: 'MME Analyzer' },
    { id: 'sgw-analyzer', label: 'SGW Analyzer' },
    { id: 'pgw-analyzer', label: 'PGW Analyzer' },
    { id: 'report-generator', label: 'Report Generator' },
    { id: 'export-manager', label: 'Export Manager' },
    { id: 'help-support', label: 'Help & Support' }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-900">5GLabX</h1>
      </div>
      
      <nav className="px-4 space-y-2">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">MAIN VIEWS</h3>
          <div className="space-y-1">
            {menuItems.slice(0, 5).map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.active
                    ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">ANALYTICS</h3>
          <div className="space-y-1">
            {menuItems.slice(5, 6).map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.active
                    ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="flex-1 text-left">{item.label}</span>
                <span className="ml-2 px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full animate-pulse">
                  LIVE
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">O-RAN ANALYSIS</h3>
          <div className="space-y-1">
            {menuItems.slice(6, 8).map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.active
                    ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">NTN ANALYSIS</h3>
          <div className="space-y-1">
            {menuItems.slice(8, 11).map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.active
                    ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === 'ntn-analytics' && (
                  <span className="ml-2 px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full animate-pulse">
                    LIVE
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">PROTOCOL LAYERS</h3>
          <div className="space-y-1">
            {menuItems.slice(11, 18).map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.active
                    ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">CORE NETWORK</h3>
          <div className="space-y-1">
            {menuItems.slice(18, 24).map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.active
                    ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">4G LEGACY</h3>
          <div className="space-y-1">
            {menuItems.slice(24, 27).map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.active
                    ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">UTILITIES</h3>
          <div className="space-y-1">
            {menuItems.slice(27).map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.active
                    ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

// Main Component
const FiveGLabXPlatformBasic: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const navigate = (viewId: string) => {
    setCurrentView(viewId);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'logs':
        return <SimpleView title="Logs Viewer" description="Protocol log analysis and monitoring." />;
      case 'enhanced-logs':
        return <SimpleView title="Enhanced Logs" description="Advanced log filtering and analysis capabilities." />;
      case 'layer-trace':
        return <SimpleView title="Layer Trace" description="Protocol layer message flow and timing analysis." />;
      case 'callflow':
        return <SimpleView title="Call Flow" description="Protocol message sequences and call flow analysis." />;
      case 'analytics':
        return <SimpleView title="Analytics" description="Real-time analytics and performance monitoring." />;
      case 'oran-overview':
        return <SimpleView title="O-RAN Overview" description="O-RAN architecture overview and analysis." />;
      case 'oran-interfaces':
        return <SimpleView title="O-RAN Interfaces" description="O-RAN interface analysis and monitoring." />;
      case 'ntn-overview':
        return <SimpleView title="NTN Overview" description="Non-Terrestrial Network overview and analysis." />;
      case 'ntn-satellites':
        return <SimpleView title="Satellite Links" description="Satellite link analysis and monitoring." />;
      case 'ntn-analytics':
        return <SimpleView title="NTN Analytics" description="NTN analytics and performance monitoring." />;
      case 'phy-layer':
        return <SimpleView title="PHY Layer" description="Physical layer analysis and monitoring." />;
      case 'mac-layer':
        return <SimpleView title="MAC Layer" description="MAC layer analysis and monitoring." />;
      case 'rlc-layer':
        return <SimpleView title="RLC Layer" description="RLC layer analysis and monitoring." />;
      case 'pdcp-layer':
        return <SimpleView title="PDCP Layer" description="PDCP layer analysis and monitoring." />;
      case 'rrc-layer':
        return <SimpleView title="RRC Layer" description="RRC layer analysis and monitoring." />;
      case 'nas-layer':
        return <SimpleView title="NAS Layer" description="NAS layer analysis and monitoring." />;
      case 'ims-layer':
        return <SimpleView title="IMS Analysis" description="IMS protocol analysis and monitoring." />;
      case 'amf-analyzer':
        return <SimpleView title="AMF Analyzer" description="Access and Mobility Management Function analyzer." />;
      case 'smf-analyzer':
        return <SimpleView title="SMF Analyzer" description="Session Management Function analyzer." />;
      case 'upf-analyzer':
        return <SimpleView title="UPF Analyzer" description="User Plane Function analyzer." />;
      case 'ausf-analyzer':
        return <SimpleView title="AUSF Analyzer" description="Authentication Server Function analyzer." />;
      case 'udm-analyzer':
        return <SimpleView title="UDM Analyzer" description="Unified Data Management analyzer." />;
      case 'config-manager':
        return <SimpleView title="Config Manager" description="Configuration management and monitoring." />;
      case 'mme-analyzer':
        return <SimpleView title="MME Analyzer" description="Mobility Management Entity analyzer." />;
      case 'sgw-analyzer':
        return <SimpleView title="SGW Analyzer" description="Serving Gateway analyzer." />;
      case 'pgw-analyzer':
        return <SimpleView title="PGW Analyzer" description="Packet Data Network Gateway analyzer." />;
      case 'report-generator':
        return <SimpleView title="Report Generator" description="Generate comprehensive analysis reports." />;
      case 'export-manager':
        return <SimpleView title="Export Manager" description="Export data and analysis results." />;
      case 'help-support':
        return <SimpleView title="Help & Support" description="User support and documentation." />;
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
      <SimpleSidebar currentView={currentView} onNavigate={navigate} />
      <div className="flex-1 overflow-auto">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default FiveGLabXPlatformBasic;