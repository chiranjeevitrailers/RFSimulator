'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, BarChart3, Settings, Shield, Database, Monitor, MessageSquare,
  Layers, Wifi, Cloud, Play, Pause, Square, Eye, Download, Upload,
  RefreshCw, Plus, Search, Filter, Calendar, Clock, TrendingUp,
  AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronRight,
  Satellite, Network, Server, Phone, MapPin, FileText, HelpCircle,
  Radio, Package2, User, Smartphone
} from 'lucide-react';

// Import existing components from codebase
import LogsView from './views/LogsView';
import TestSuitesView from './views/TestSuitesView';
import AnalyticsView from './views/AnalyticsView';
import CallFlowView from './views/CallFlowView';
import LayerTraceView from './views/LayerTraceView';
// Removed duplicate EnhancedLogs main view import; using enhanced views under Enhanced Views section

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
  
  // Protocol Layer Views (removed non-TSX layer views to avoid duplication)
  
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
import { APIProvider } from './services/APIIntegration';

// Services are loaded via DataFlowProvider - no need for separate script loading

// Import components
import TestManagerDataDebug from './components/TestManagerDataDebug';
import DirectDataInjector from './components/DirectDataInjector';
import SimpleDataDisplay from './components/SimpleDataDisplay';
import ThreeGPPComplianceDashboard from './components/ThreeGPPComplianceDashboard';
import LayerParametersTracker from './components/LayerParametersTracker';
import ChannelParametersTracker from './components/ChannelParametersTracker';
import LayerStatisticsDashboard from './components/LayerStatisticsDashboard';

// Make SimpleDataDisplay available globally for testing
declare global {
  interface Window {
    SimpleDataDisplay?: any;
  }
}
if (typeof window !== 'undefined') {
  window.SimpleDataDisplay = SimpleDataDisplay;
}

// Import working TSX layer views
import PhyLayerViewTSX from './views/PhyLayerViewTSX';
import MacLayerViewTSX from './views/MacLayerViewTSX';
import RlcLayerViewTSX from './views/RlcLayerViewTSX';
import PdcpLayerViewTSX from './views/PdcpLayerViewTSX';
import RrcLayerViewTSX from './views/RrcLayerViewTSX';
import NasLayerViewTSX from './views/NasLayerViewTSX';

// Import protocol layer data test component
import ProtocolLayerDataTest from './components/ProtocolLayerDataTest';
import DataFlowDebugger from './components/DataFlowDebugger';
import TestDataGenerator from './components/TestDataGenerator';
import IntegrationTester from './components/IntegrationTester';
import EnhancedLogsViewAdvanced from './views/EnhancedLogsViewAdvanced';
import PhyLayerViewEnhanced from './views/PhyLayerViewEnhanced';
// import { DataFlowProvider } from './providers/DataFlowProvider'; // Temporarily disabled to isolate React hooks issue


// Enhanced Dashboard View
const DashboardView: React.FC = () => {
  const [testManagerData, setTestManagerData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Fallback function to check for active test executions
  const checkForActiveExecutions = async () => {
    try {
      console.log('🔍 5GLabX: Checking for active test executions...');
      const response = await fetch('/api/tests/runs/active');
      if (response.ok) {
        const activeRun = await response.json();
        if (activeRun?.execution_id) {
          console.log('📊 5GLabX: Found active execution:', activeRun.execution_id);
          // Subscribe to Supabase realtime for this execution
          subscribeToExecutionData(activeRun.execution_id);
        }
      }
    } catch (error) {
      console.log('ℹ️ 5GLabX: No active executions found or API unavailable');
    }
  };

  // Subscribe to Supabase realtime for execution data
  const subscribeToExecutionData = async (executionId: string) => {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

        const channel = supabase.channel('execution-data')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'decoded_messages',
            filter: `test_run_id=eq.${executionId}`
          }, (payload) => {
          console.log('📊 5GLabX: Received realtime data:', payload.new);
          // Process the incoming message data
          if (payload.new) {
            setTestManagerData(prev => ({
              ...prev,
              realtimeMessages: [...(prev?.realtimeMessages || []), payload.new]
            }));
            setLastUpdate(new Date());
          }
        })
        .subscribe();

      console.log('✅ 5GLabX: Subscribed to Supabase realtime for execution:', executionId);
    } catch (error) {
      console.error('❌ 5GLabX: Failed to subscribe to Supabase realtime:', error);
    }
  };

  useEffect(() => {
    // Listen for test manager execution events
    const handleTestCaseExecution = (event: CustomEvent) => {
      setTestManagerData(event.detail);
      setLastUpdate(new Date());
    };

    // Listen for test data broadcasts
    const handlePostMessage = (event: MessageEvent) => {
      if (event.data.type === '5GLABX_TEST_DATA' || 
          event.data.type === '5GLABX_TEST_EXECUTION' ||
          event.data.type === '5GLABX_WEBSOCKET_DATA') {
        console.log('🎯 5GLabX Dashboard received test data:', {
          type: event.data.type,
          testCaseId: event.data.testCaseId,
          testCaseName: event.data.testCaseData?.testCase?.name,
          messageCount: event.data.testCaseData?.expectedMessages?.length || 0,
          dataSource: event.data.dataSource,
          timestamp: new Date().toLocaleTimeString()
        });
        setTestManagerData(event.data);
        setLastUpdate(new Date());
        
        // Show detailed information about received data
        if (event.data.type === '5GLABX_TEST_EXECUTION') {
          console.log('📊 Test execution data details:', {
            testCaseId: event.data.testCaseId,
            messagesCount: event.data.testCaseData?.expectedMessages?.length || 0,
            iesCount: event.data.testCaseData?.expectedInformationElements?.length || 0,
            layerParamsCount: event.data.testCaseData?.expectedLayerParameters?.length || 0
          });
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('testCaseExecutionStarted', handleTestCaseExecution as EventListener);
      window.addEventListener('message', handlePostMessage);
      
      // Fallback: Check for active test executions on mount
      checkForActiveExecutions();
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

      {/* Test Case Data Display Component - Only shows real data from Test Manager */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔥 Real Test Case Data Display</h3>
          <SimpleDataDisplay />
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
      
      {/* Debug Component */}
      <TestManagerDataDebug />
      
      {/* Direct Data Injector */}
      <DirectDataInjector />
      
      {/* 3GPP Compliance Dashboard */}
      <ThreeGPPComplianceDashboard testCaseData={testManagerData} />
      
      {/* Layer Statistics Dashboard */}
      <LayerStatisticsDashboard testCaseData={testManagerData} />
      
      {/* Layer Parameters Variation Tracker */}
      <LayerParametersTracker testCaseData={testManagerData} />
      
      {/* Channel Parameters Variation Tracker */}
      <ChannelParametersTracker testCaseData={testManagerData} />
      
      {/* Removed duplicate SimpleDataDisplay - already rendered above */}
      
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
    { id: 'logs', label: 'Logs Viewer', icon: FileText },
    { id: 'layer-trace', label: 'Layer Trace', icon: Network },
    { id: 'callflow', label: 'Call Flow', icon: Phone }
  ];

    const analyticsItems = [
      { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: 'LIVE' },
      { id: 'protocol-layer-test', label: 'Protocol Layer Test', icon: Activity, badge: 'NEW' },
      { id: 'data-flow-debugger', label: 'Data Flow Debugger', icon: Activity, badge: 'DEBUG' },
      { id: 'test-data-generator', label: 'Test Data Generator', icon: Database, badge: 'GEN' },
      { id: 'integration-tester', label: 'Integration Tester', icon: CheckCircle, badge: 'TEST' }
    ];

    const enhancedViewsItems = [
      { id: 'logs-advanced', label: 'Advanced Logs', icon: FileText, badge: 'ADVANCED' },
      { id: 'phy-enhanced', label: 'Enhanced PHY', icon: Radio, badge: 'ENHANCED' }
    ];

  // Removed duplicate layerItems; using unified protocolLayers section below

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
    { id: 'nas-layer', label: 'NAS Layer', icon: Server }
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

        {/* Enhanced Views */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">ENHANCED VIEWS</h3>
          <div className="space-y-1">
            {enhancedViewsItems.map(renderMenuItem)}
          </div>
        </div>

        {/* Protocol Layers (single source of truth defined later) */}

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
      case 'logs':
        return <LogsView appState={{}} onStateChange={() => {}} />;
      // Removed duplicate enhanced-logs main view; use Enhanced Views -> logs-enhanced
      case 'test-suites':
        return <TestSuitesView appState={{}} onStateChange={() => {}} />;
      case 'layer-trace':
        return <LayerTraceView appState={{}} onStateChange={() => {}} />;
      case 'callflow':
        return <CallFlowView appState={{}} onStateChange={() => {}} />;
      case 'analytics':
        return <AnalyticsView appState={{}} onStateChange={() => {}} />;
      case 'protocol-layer-test':
        return <ProtocolLayerDataTest />;
      case 'data-flow-debugger':
        return <DataFlowDebugger />;
      case 'test-data-generator':
        return <TestDataGenerator />;
      case 'integration-tester':
        return <IntegrationTester />;
      case 'logs-advanced':
        return <EnhancedLogsViewAdvanced />;
      case 'phy-enhanced':
        return <PhyLayerViewEnhanced />;
      case 'phy-layer':
        return <PhyLayerViewTSX />;
      case 'mac-layer':
        return <MacLayerViewTSX />;
      case 'rlc-layer':
        return <RlcLayerViewTSX />;
      case 'pdcp-layer':
        return <PdcpLayerViewTSX />;
      case 'rrc-layer':
        return <RrcLayerViewTSX />;
      case 'nas-layer':
        return <NasLayerViewTSX />;
      case 'oran-overview':
        return <OranOverviewView />;
      case 'oran-interfaces':
        return <OranInterfacesView />;
      case 'oran-cu-analysis':
        return <OranCuAnalysisView />;
      case 'oran-du-analysis':
        return <OranDuAnalysisView />;
      case 'oran-e1-interface':
        return <OranE1InterfaceView />;
      case 'oran-f1-interface':
        return <OranF1InterfaceView />;
      case 'oran-performance':
        return <OranPerformanceView />;
      case 'oran-xapps':
        return <OranXappsView />;
      case 'oran-smo':
        return <OranSmoView />;
      case 'nbiot-overview':
        return <NBIoTOverviewView />;
      case 'nbiot-callflow':
        return <NBIoTCallFlowView />;
      case 'nbiot-analytics':
        return <NBIoTAnalyticsView />;
      case 'nbiot-phy-layer':
        return <NBIoTPhyLayerView />;
      case 'nbiot-mac-layer':
        return <NBIoTMacLayerView />;
      case 'nbiot-rrc-layer':
        return <NBIoTRrcLayerView />;
      case 'nbiot-testing':
        return <NBIoTTestingView />;
      case 'v2x-overview':
        return <V2xOverviewView />;
      case 'v2x-sidelink':
        return <V2xSidelinkView />;
      case 'v2x-analytics':
        return <V2xAnalyticsView />;
      case 'v2x-phy-layer':
        return <V2xPhyLayerView />;
      case 'v2x-mac-layer':
        return <V2xMacLayerView />;
      case 'v2x-testing':
        return <V2xTestingView />;
      case 'v2x-scenarios':
        return <V2xScenariosView />;
      case 'ntn-overview':
        return <NtnOverviewView />;
      case 'ntn-satellites':
        return <NtnSatellitesView />;
      case 'ntn-analytics':
        return <NtnAnalyticsView />;
      case 'ntn-sib19':
        return <NtnSib19View />;
      case 'ntn-timing':
        return <NtnTimingView />;
      case 'ntn-doppler':
        return <NtnDopplerView />;
      case 'ntn-scenarios':
        return <NtnScenariosView />;
      // Removed duplicate non-TSX protocol layer views; using TSX implementations above
      case 'ims-layer':
        return <ImsLayerView />;
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
      <ServiceIntegration>
        <div className="h-screen flex bg-gray-50">
          <Sidebar currentView={currentView} onNavigate={navigate} />
          <div className="flex-1 overflow-auto">
            {renderCurrentView()}
          </div>
        </div>
      </ServiceIntegration>
    </APIProvider>
  );
};

export default FiveGLabXPlatformMinimal;