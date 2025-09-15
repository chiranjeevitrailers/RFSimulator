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

// Simple Dashboard View
const DashboardView: React.FC = () => {
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
          <p className="text-3xl font-bold text-blue-600">5</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Avg Throughput</h3>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">0 Kbps</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Error Rate</h3>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600">20.00%</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-purple-600" />
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

// Generic View Component
const GenericView: React.FC<{ title: string; description: string; badge?: string }> = ({ title, description, badge }) => (
  <div className="p-6 space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {badge && (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">{badge}</span>
        </div>
      )}
    </div>
    <div className="bg-white p-6 rounded-lg border">
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

// Sidebar Component
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

  // Menu items
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
    { id: 'oran-interfaces', label: 'O-RAN Interfaces', icon: Network },
    { id: 'oran-cu-analysis', label: 'O-RAN CU Analysis', icon: Server },
    { id: 'oran-du-analysis', label: 'O-RAN DU Analysis', icon: Server },
    { id: 'oran-e1-interface', label: 'O-RAN E1 Interface', icon: Network },
    { id: 'oran-f1-interface', label: 'O-RAN F1 Interface', icon: Network },
    { id: 'oran-performance', label: 'O-RAN Performance', icon: TrendingUp },
    { id: 'oran-xapps', label: 'O-RAN xApps', icon: Cloud },
    { id: 'oran-smo', label: 'O-RAN SMO', icon: Settings }
  ];

  const nbiotItems = [
    { id: 'nbiot-overview', label: 'NB-IoT Overview', icon: Network },
    { id: 'nbiot-callflow', label: 'NB-IoT Call Flow', icon: Phone },
    { id: 'nbiot-analytics', label: 'NB-IoT Analytics', icon: BarChart3 },
    { id: 'nbiot-phy-layer', label: 'NB-IoT PHY Layer', icon: Wifi },
    { id: 'nbiot-mac-layer', label: 'NB-IoT MAC Layer', icon: Network },
    { id: 'nbiot-rrc-layer', label: 'NB-IoT RRC Layer', icon: Network },
    { id: 'nbiot-testing', label: 'NB-IoT Testing', icon: Shield }
  ];

  const v2xItems = [
    { id: 'v2x-overview', label: 'V2X Overview', icon: Network },
    { id: 'v2x-sidelink', label: 'V2X Sidelink', icon: Network },
    { id: 'v2x-analytics', label: 'V2X Analytics', icon: BarChart3 },
    { id: 'v2x-phy-layer', label: 'V2X PHY Layer', icon: Wifi },
    { id: 'v2x-mac-layer', label: 'V2X MAC Layer', icon: Network },
    { id: 'v2x-testing', label: 'V2X Testing', icon: Shield },
    { id: 'v2x-scenarios', label: 'V2X Scenarios', icon: MapPin }
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

        {/* NB-IoT Analysis */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">NB-IOT ANALYSIS</h3>
          <div className="space-y-1">
            {renderSection('nbiot-analysis', nbiotItems, 'NB-IOT ANALYSIS')}
          </div>
        </div>

        {/* C-V2X Analysis */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">C-V2X ANALYSIS</h3>
          <div className="space-y-1">
            {renderSection('v2x-analysis', v2xItems, 'C-V2X ANALYSIS')}
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
const FiveGLabXPlatformMinimal: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const navigate = (viewId: string) => {
    setCurrentView(viewId);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'logs':
        return <GenericView title="Logs Viewer" description="Protocol log analysis and monitoring." />;
      case 'enhanced-logs':
        return <GenericView title="Enhanced Logs" description="Advanced log filtering and analysis capabilities." />;
      case 'layer-trace':
        return <GenericView title="Layer Trace" description="Protocol layer message flow and timing analysis." />;
      case 'callflow':
        return <GenericView title="Call Flow" description="Protocol message sequences and call flow analysis." />;
      case 'analytics':
        return <GenericView title="Analytics" description="Real-time analytics and performance monitoring." badge="LIVE" />;
      case 'oran-overview':
        return <GenericView title="O-RAN Overview" description="O-RAN architecture overview and analysis." />;
      case 'oran-interfaces':
        return <GenericView title="O-RAN Interfaces" description="O-RAN interface analysis and monitoring." />;
      case 'oran-cu-analysis':
        return <GenericView title="O-RAN CU Analysis" description="Central Unit analysis and monitoring." />;
      case 'oran-du-analysis':
        return <GenericView title="O-RAN DU Analysis" description="Distributed Unit analysis and monitoring." />;
      case 'oran-e1-interface':
        return <GenericView title="O-RAN E1 Interface" description="E1 interface analysis and monitoring." />;
      case 'oran-f1-interface':
        return <GenericView title="O-RAN F1 Interface" description="F1 interface analysis and monitoring." />;
      case 'oran-performance':
        return <GenericView title="O-RAN Performance" description="O-RAN performance analysis and monitoring." />;
      case 'oran-xapps':
        return <GenericView title="O-RAN xApps" description="xApps analysis and management." />;
      case 'oran-smo':
        return <GenericView title="O-RAN SMO" description="Service Management and Orchestration analysis." />;
      case 'nbiot-overview':
        return <GenericView title="NB-IoT Overview" description="NB-IoT network overview and analysis." />;
      case 'nbiot-callflow':
        return <GenericView title="NB-IoT Call Flow" description="NB-IoT call flow analysis and monitoring." />;
      case 'nbiot-analytics':
        return <GenericView title="NB-IoT Analytics" description="NB-IoT analytics and performance monitoring." />;
      case 'nbiot-phy-layer':
        return <GenericView title="NB-IoT PHY Layer" description="NB-IoT physical layer analysis." />;
      case 'nbiot-mac-layer':
        return <GenericView title="NB-IoT MAC Layer" description="NB-IoT MAC layer analysis." />;
      case 'nbiot-rrc-layer':
        return <GenericView title="NB-IoT RRC Layer" description="NB-IoT RRC layer analysis." />;
      case 'nbiot-testing':
        return <GenericView title="NB-IoT Testing" description="NB-IoT test management and execution." />;
      case 'v2x-overview':
        return <GenericView title="V2X Overview" description="Vehicle-to-everything communication overview." />;
      case 'v2x-sidelink':
        return <GenericView title="V2X Sidelink" description="V2X sidelink communication analysis." />;
      case 'v2x-analytics':
        return <GenericView title="V2X Analytics" description="V2X analytics and performance monitoring." />;
      case 'v2x-phy-layer':
        return <GenericView title="V2X PHY Layer" description="V2X physical layer analysis." />;
      case 'v2x-mac-layer':
        return <GenericView title="V2X MAC Layer" description="V2X MAC layer analysis." />;
      case 'v2x-testing':
        return <GenericView title="V2X Testing" description="V2X test management and execution." />;
      case 'v2x-scenarios':
        return <GenericView title="V2X Scenarios" description="V2X scenario analysis and testing." />;
      case 'ntn-overview':
        return <GenericView title="NTN Overview" description="Non-Terrestrial Network overview and analysis." />;
      case 'ntn-satellites':
        return <GenericView title="Satellite Links" description="Satellite link analysis and monitoring." />;
      case 'ntn-analytics':
        return <GenericView title="NTN Analytics" description="NTN analytics and performance monitoring." badge="LIVE" />;
      case 'ntn-sib19':
        return <GenericView title="SIB19 Analysis" description="System Information Block 19 analysis." />;
      case 'ntn-timing':
        return <GenericView title="Timing & Delay" description="NTN timing and delay analysis." />;
      case 'ntn-doppler':
        return <GenericView title="Doppler Analysis" description="Doppler effect analysis for NTN." />;
      case 'ntn-scenarios':
        return <GenericView title="NTN Scenarios" description="NTN scenario analysis and testing." />;
      case 'phy-layer':
        return <GenericView title="PHY Layer" description="Physical layer analysis and monitoring." />;
      case 'mac-layer':
        return <GenericView title="MAC Layer" description="MAC layer analysis and monitoring." />;
      case 'rlc-layer':
        return <GenericView title="RLC Layer" description="RLC layer analysis and monitoring." />;
      case 'pdcp-layer':
        return <GenericView title="PDCP Layer" description="PDCP layer analysis and monitoring." />;
      case 'rrc-layer':
        return <GenericView title="RRC Layer" description="RRC layer analysis and monitoring." />;
      case 'nas-layer':
        return <GenericView title="NAS Layer" description="NAS layer analysis and monitoring." />;
      case 'ims-layer':
        return <GenericView title="IMS Analysis" description="IMS protocol analysis and monitoring." />;
      case 'amf-analyzer':
        return <GenericView title="AMF Analyzer" description="Access and Mobility Management Function analyzer." />;
      case 'smf-analyzer':
        return <GenericView title="SMF Analyzer" description="Session Management Function analyzer." />;
      case 'upf-analyzer':
        return <GenericView title="UPF Analyzer" description="User Plane Function analyzer." />;
      case 'ausf-analyzer':
        return <GenericView title="AUSF Analyzer" description="Authentication Server Function analyzer." />;
      case 'udm-analyzer':
        return <GenericView title="UDM Analyzer" description="Unified Data Management analyzer." />;
      case 'config-manager':
        return <GenericView title="Config Manager" description="Configuration management and monitoring." />;
      case 'mme-analyzer':
        return <GenericView title="MME Analyzer" description="Mobility Management Entity analyzer." />;
      case 'sgw-analyzer':
        return <GenericView title="SGW Analyzer" description="Serving Gateway analyzer." />;
      case 'pgw-analyzer':
        return <GenericView title="PGW Analyzer" description="Packet Data Network Gateway analyzer." />;
      case 'report-generator':
        return <GenericView title="Report Generator" description="Generate comprehensive analysis reports." />;
      case 'export-manager':
        return <GenericView title="Export Manager" description="Export data and analysis results." />;
      case 'help-support':
        return <GenericView title="Help & Support" description="User support and documentation." />;
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

export default FiveGLabXPlatformMinimal;