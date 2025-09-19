'use client';

import React, { useState } from 'react';
import { 
  Activity, BarChart3, Settings, Shield, Database, Monitor, MessageSquare,
  Layers, Wifi, Cloud, Play, Pause, Square, Eye, Download, Upload,
  RefreshCw, Plus, Search, Filter, Calendar, Clock, TrendingUp,
  AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronRight,
  Satellite, Network, Server, Phone, MapPin, FileText, HelpCircle
} from 'lucide-react';

// Import existing components from codebase
import LogsView from './views/LogsView';
import TestSuitesView from './views/TestSuitesView';
import AnalyticsView from './views/AnalyticsView';
import CallFlowView from './views/CallFlowView';
import LayerTraceView from './views/LayerTraceView';
import EnhancedLogsView from './views/EnhancedLogsView';

// Import all view wrappers
import {
  // O-RAN Views
  OranOverviewView, OranInterfacesView, OranCuAnalysisView, OranDuAnalysisView,
  OranE1InterfaceView, OranF1InterfaceView, OranPerformanceView, OranXappsView, OranSmoView,
  
  // NB-IoT Views
  NBIoTOverviewView, NBIoTCallFlowView, NBIoTAnalyticsView, NBIoTPhyLayerView,
  NBIoTMacLayerView, NBIoTRrcLayerView, NBIoTTestingView,
  
  // V2X Views
  V2xOverviewView, V2xSidelinkView, V2xAnalyticsView, V2xPhyLayerView,
  V2xMacLayerView, V2xTestingView, V2xScenariosView,
  
  // NTN Views
  NtnOverviewView, NtnSatellitesView, NtnAnalyticsView, NtnSib19View,
  NtnTimingView, NtnDopplerView, NtnScenariosView,
  
  // Protocol Layer Views
  PhyLayerView, MacLayerView, RlcLayerView, PdcpLayerView,
  RrcLayerView, NasLayerView, ImsLayerView,
  
  // Core Network Views
  AmfAnalyzerView, SmfAnalyzerView, UpfAnalyzerView, AusfAnalyzerView,
  UdmAnalyzerView, ConfigManagerView,
  
  // 4G Legacy Views
  MmeAnalyzerView, SgwAnalyzerView, PgwAnalyzerView,
  
  // Utility Views
  ReportGeneratorView, ExportManagerView, HelpSupportView,
  
  // CLI Monitor View
  CLIMonitorView,
  
  // Enhanced Views
  EnhancedOranOverviewView,
  
  // User Dashboard View
  UserDashboardView
} from './views/ViewWrappers';

// Import service integration
import ServiceIntegration from './services/ServiceIntegration';
import { DataFlowProvider } from './services/DataFlowIntegration';
import { APIProvider } from './services/APIIntegration';

// Load services script
if (typeof window !== 'undefined') {
  import('./scripts/loadServices.js').then(() => {
    console.log('5GLabX services loading initiated');
  }).catch(error => {
    console.warn('Failed to load 5GLabX services:', error);
  });
}

// Import components
import TestCaseDataFlow from './components/TestCaseDataFlow';

// Enhanced Dashboard View
const DashboardView: React.FC = () => {
  const [testManagerData, setTestManagerData] = React.useState<any>(null);
  const [lastUpdate, setLastUpdate] = React.useState<Date | null>(null);

  React.useEffect(() => {
    // Listen for test manager execution events
    const handleTestCaseExecution = (event: CustomEvent) => {
      setTestManagerData(event.detail);
      setLastUpdate(new Date());
    };

    // Listen for test data broadcasts
    const handlePostMessage = (event: MessageEvent) => {
      if (event.data.type === '5GLABX_TEST_DATA') {
        setTestManagerData(event.data);
        setLastUpdate(new Date());
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('testCaseExecutionStarted', handleTestCaseExecution as EventListener);
      window.addEventListener('message', handlePostMessage);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('testCaseExecutionStarted', handleTestCaseExecution as EventListener);
        window.removeEventListener('message', handlePostMessage);
      }
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">5GLabX Protocol Analyzer Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">System Online</span>
          </div>
          {testManagerData && (
            <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-700">Live Test Data</span>
            </div>
          )}
        </div>
      </div>
      
      {testManagerData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-blue-900">🔗 Test Manager Integration</h3>
            <span className="text-sm text-blue-600">
              Last Update: {lastUpdate?.toLocaleTimeString()}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-600 font-medium">Test Case:</span>
              <div className="text-blue-900">{testManagerData.testCaseId || 'N/A'}</div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Messages:</span>
              <div className="text-blue-900">{testManagerData.testCaseData?.expectedMessages?.length || 0}</div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">IEs:</span>
              <div className="text-blue-900">{testManagerData.testCaseData?.expectedInformationElements?.length || 0}</div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Layer Params:</span>
              <div className="text-blue-900">{testManagerData.testCaseData?.expectedLayerParameters?.length || 0}</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Messages</h3>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">1,247</p>
          <p className="text-xs text-gray-500 mt-1">+12% from last hour</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Avg Throughput</h3>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">156.7 Mbps</p>
          <p className="text-xs text-gray-500 mt-1">Peak: 234.2 Mbps</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Error Rate</h3>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600">0.02%</p>
          <p className="text-xs text-gray-500 mt-1">-0.01% from last hour</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-600">99.98%</p>
          <p className="text-xs text-gray-500 mt-1">+0.01% from last hour</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Message Distribution by Component</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">PHY Layer</span>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">456</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">MAC Layer</span>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">RLC Layer</span>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">189</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">RRC Layer</span>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">156</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">NAS Layer</span>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">98</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">IMS Layer</span>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">114</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Protocol Message Types</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium">PDSCH</span>
              </div>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">234</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">DL PDU</span>
              </div>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">189</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm font-medium">RRC Setup</span>
              </div>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">156</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm font-medium">NAS Attach</span>
              </div>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">98</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium">SIP INVITE</span>
              </div>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">114</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">New UE attached - IMSI: 310150123456789</span>
            <span className="text-xs text-gray-400 ml-auto">2 minutes ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">RRC Connection established - Cell ID: 12345</span>
            <span className="text-xs text-gray-400 ml-auto">5 minutes ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Handover completed - Target Cell: 12346</span>
            <span className="text-xs text-gray-400 ml-auto">8 minutes ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};


// All wrapper components are now imported from ViewWrappers.tsx

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
    { id: 'test-case-data-flow', label: 'Test Case Data Flow', icon: Database },
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
    { id: 'ntn-doppler', label: 'Doppler Analysis', icon: Activity },
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
    { id: 'config-manager', label: 'Config Manager', icon: Settings }
  ];

  const legacy4G = [
    { id: 'mme-analyzer', label: 'MME Analyzer', icon: Server },
    { id: 'sgw-analyzer', label: 'SGW Analyzer', icon: Server },
    { id: 'pgw-analyzer', label: 'PGW Analyzer', icon: Server }
  ];

  const utilities = [
    { id: 'report-generator', label: 'Report Generator', icon: FileText },
    { id: 'export-manager', label: 'Export Manager', icon: Download },
    { id: 'help-support', label: 'Help & Support', icon: HelpCircle }
  ];

  const testSuites = [
    { id: 'test-suites', label: 'Test Suites', icon: Shield }
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

        {/* Test Suites */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">TEST SUITES</h3>
          <div className="space-y-1">
            {testSuites.map(renderMenuItem)}
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
      case 'test-case-data-flow':
        return <TestCaseDataFlow />;
      case 'logs':
        return <LogsView appState={{}} onStateChange={() => {}} />;
      case 'enhanced-logs':
        return <EnhancedLogsView appState={{}} onStateChange={() => {}} />;
      case 'test-suites':
        return <TestSuitesView appState={{}} onStateChange={() => {}} />;
      case 'layer-trace':
        return <LayerTraceView appState={{}} onStateChange={() => {}} />;
      case 'callflow':
        return <CallFlowView appState={{}} onStateChange={() => {}} />;
      case 'analytics':
        return <AnalyticsView appState={{}} onStateChange={() => {}} />;
      case 'oran-overview':
        return <OranOverviewView appState={{}} onStateChange={() => {}} />;
      case 'oran-interfaces':
        return <OranInterfacesView appState={{}} onStateChange={() => {}} />;
      case 'oran-cu-analysis':
        return <OranCuAnalysisView appState={{}} onStateChange={() => {}} />;
      case 'oran-du-analysis':
        return <OranDuAnalysisView appState={{}} onStateChange={() => {}} />;
      case 'oran-e1-interface':
        return <OranE1InterfaceView appState={{}} onStateChange={() => {}} />;
      case 'oran-f1-interface':
        return <OranF1InterfaceView appState={{}} onStateChange={() => {}} />;
      case 'oran-performance':
        return <OranPerformanceView appState={{}} onStateChange={() => {}} />;
      case 'oran-xapps':
        return <OranXappsView appState={{}} onStateChange={() => {}} />;
      case 'oran-smo':
        return <OranSmoView appState={{}} onStateChange={() => {}} />;
      case 'nbiot-overview':
        return <NBIoTOverviewView appState={{}} onStateChange={() => {}} />;
      case 'nbiot-callflow':
        return <NBIoTCallFlowView appState={{}} onStateChange={() => {}} />;
      case 'nbiot-analytics':
        return <NBIoTAnalyticsView appState={{}} onStateChange={() => {}} />;
      case 'nbiot-phy-layer':
        return <NBIoTPhyLayerView appState={{}} onStateChange={() => {}} />;
      case 'nbiot-mac-layer':
        return <NBIoTMacLayerView appState={{}} onStateChange={() => {}} />;
      case 'nbiot-rrc-layer':
        return <NBIoTRrcLayerView appState={{}} onStateChange={() => {}} />;
      case 'nbiot-testing':
        return <NBIoTTestingView appState={{}} onStateChange={() => {}} />;
      case 'v2x-overview':
        return <V2xOverviewView appState={{}} onStateChange={() => {}} />;
      case 'v2x-sidelink':
        return <V2xSidelinkView appState={{}} onStateChange={() => {}} />;
      case 'v2x-analytics':
        return <V2xAnalyticsView appState={{}} onStateChange={() => {}} />;
      case 'v2x-phy-layer':
        return <V2xPhyLayerView appState={{}} onStateChange={() => {}} />;
      case 'v2x-mac-layer':
        return <V2xMacLayerView appState={{}} onStateChange={() => {}} />;
      case 'v2x-testing':
        return <V2xTestingView appState={{}} onStateChange={() => {}} />;
      case 'v2x-scenarios':
        return <V2xScenariosView appState={{}} onStateChange={() => {}} />;
      case 'ntn-overview':
        return <NtnOverviewView appState={{}} onStateChange={() => {}} />;
      case 'ntn-satellites':
        return <NtnSatellitesView appState={{}} onStateChange={() => {}} />;
      case 'ntn-analytics':
        return <NtnAnalyticsView appState={{}} onStateChange={() => {}} />;
      case 'ntn-sib19':
        return <NtnSib19View appState={{}} onStateChange={() => {}} />;
      case 'ntn-timing':
        return <NtnTimingView appState={{}} onStateChange={() => {}} />;
      case 'ntn-doppler':
        return <NtnDopplerView appState={{}} onStateChange={() => {}} />;
      case 'ntn-scenarios':
        return <NtnScenariosView appState={{}} onStateChange={() => {}} />;
      case 'phy-layer':
        return <PhyLayerView appState={{}} onStateChange={() => {}} />;
      case 'mac-layer':
        return <MacLayerView appState={{}} onStateChange={() => {}} />;
      case 'rlc-layer':
        return <RlcLayerView appState={{}} onStateChange={() => {}} />;
      case 'pdcp-layer':
        return <PdcpLayerView appState={{}} onStateChange={() => {}} />;
      case 'rrc-layer':
        return <RrcLayerView appState={{}} onStateChange={() => {}} />;
      case 'nas-layer':
        return <NasLayerView appState={{}} onStateChange={() => {}} />;
      case 'ims-layer':
        return <ImsLayerView appState={{}} onStateChange={() => {}} />;
      case 'amf-analyzer':
        return <AmfAnalyzerView appState={{}} onStateChange={() => {}} />;
      case 'smf-analyzer':
        return <SmfAnalyzerView appState={{}} onStateChange={() => {}} />;
      case 'upf-analyzer':
        return <UpfAnalyzerView appState={{}} onStateChange={() => {}} />;
      case 'ausf-analyzer':
        return <AusfAnalyzerView appState={{}} onStateChange={() => {}} />;
      case 'udm-analyzer':
        return <UdmAnalyzerView appState={{}} onStateChange={() => {}} />;
      case 'config-manager':
        return <ConfigManagerView appState={{}} onStateChange={() => {}} />;
      case 'mme-analyzer':
        return <MmeAnalyzerView appState={{}} onStateChange={() => {}} />;
      case 'sgw-analyzer':
        return <SgwAnalyzerView appState={{}} onStateChange={() => {}} />;
      case 'pgw-analyzer':
        return <PgwAnalyzerView appState={{}} onStateChange={() => {}} />;
      case 'report-generator':
        return <ReportGeneratorView appState={{}} onStateChange={() => {}} />;
      case 'export-manager':
        return <ExportManagerView appState={{}} onStateChange={() => {}} />;
      case 'help-support':
        return <HelpSupportView appState={{}} onStateChange={() => {}} />;
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
    <APIProvider>
      <DataFlowProvider>
        <ServiceIntegration>
          <div className="h-screen flex bg-gray-50">
            <Sidebar currentView={currentView} onNavigate={navigate} />
            <div className="flex-1 overflow-auto">
              {renderCurrentView()}
            </div>
          </div>
        </ServiceIntegration>
      </DataFlowProvider>
    </APIProvider>
  );
};

export default FiveGLabXPlatformMinimal;