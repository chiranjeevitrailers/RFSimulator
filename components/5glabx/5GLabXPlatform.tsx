'use client';

import React, { useState, useEffect, useRef } from 'react';
import LogsView from './views/LogsView';
import AnalyticsView from './views/AnalyticsView';
import TestSuitesView from './views/TestSuitesView';
import LayerTraceView from './views/LayerTraceView';
import CallFlowView from './views/CallFlowView';
import { useTestExecutionWebSocket } from './services/TestExecutionWebSocketService';
import {
  Activity,
  BarChart3,
  Settings,
  LogOut,
  User,
  Bell,
  HelpCircle,
  Shield,
  Database,
  Monitor,
  MessageSquare,
  Layers,
  Wifi,
  Cloud,
  Play,
  Pause,
  Square,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  Satellite,
  Network,
  Server,
  Phone,
  MapPin,
  Wave,
  FileText,
  Gear,
  QuestionMark,
  Export,
  Import
} from 'lucide-react';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if ((this.state as any).hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-red-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h2>
            <p className="text-red-500">Please refresh the page to try again</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Sidebar Component
const Sidebar: React.FC<{
  appState: any;
  onNavigate: (viewId: string) => void;
}> = ({ appState, onNavigate }) => {
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
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Activity,
      active: appState.currentView === 'dashboard'
    },
    {
      id: 'logs',
      label: 'Logs Viewer',
      icon: FileText
    },
    {
      id: 'enhanced-logs',
      label: 'Enhanced Logs',
      icon: Search
    },
    {
      id: 'layer-trace',
      label: 'Layer Trace',
      icon: Network
    },
    {
      id: 'callflow',
      label: 'Call Flow',
      icon: Phone
    },
    {
      id: 'test-suites',
      label: 'Test Suites',
      icon: Shield
    }
  ];

  const analyticsItems = [
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: 'LIVE'
    },
    {
      section: 'oran-analysis',
      label: 'O-RAN ANALYSIS',
      icon: ChevronDown,
      collapsed: collapsedSections['oran-analysis'],
      children: [
        { id: 'oran-overview', label: 'O-RAN Overview', icon: Network },
        { id: 'oran-interfaces', label: 'O-RAN Interfaces', icon: Network },
        { id: 'oran-cu-analysis', label: 'CU Analysis', icon: Server },
        { id: 'oran-du-analysis', label: 'DU Analysis', icon: Server },
        { id: 'oran-e1-interface', label: 'E1 Interface', icon: Network },
        { id: 'oran-f1-interface', label: 'F1 Interface', icon: Network },
        { id: 'oran-performance', label: 'Performance', icon: TrendingUp },
        { id: 'oran-xapps', label: 'xApps', icon: Cloud },
        { id: 'oran-smo', label: 'SMO', icon: Settings }
      ]
    },
    {
      section: 'nbiot-analysis',
      label: 'NB-IOT ANALYSIS',
      icon: ChevronDown,
      collapsed: collapsedSections['nbiot-analysis'],
      children: [
        { id: 'nbiot-overview', label: 'NB-IoT Overview', icon: Network },
        { id: 'nbiot-callflow', label: 'Call Flow', icon: Phone },
        { id: 'nbiot-analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'nbiot-phy-layer', label: 'PHY Layer', icon: Wifi },
        { id: 'nbiot-mac-layer', label: 'MAC Layer', icon: Network },
        { id: 'nbiot-rrc-layer', label: 'RRC Layer', icon: Network },
        { id: 'nbiot-testing', label: 'Testing', icon: Shield }
      ]
    },
    {
      section: 'v2x-analysis',
      label: 'C-V2X ANALYSIS',
      icon: ChevronDown,
      collapsed: collapsedSections['v2x-analysis'],
      children: [
        { id: 'v2x-overview', label: 'V2X Overview', icon: Network },
        { id: 'v2x-sidelink', label: 'Sidelink', icon: Network },
        { id: 'v2x-analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'v2x-phy-layer', label: 'PHY Layer', icon: Wifi },
        { id: 'v2x-mac-layer', label: 'MAC Layer', icon: Network },
        { id: 'v2x-testing', label: 'Testing', icon: Shield },
        { id: 'v2x-scenarios', label: 'Scenarios', icon: MapPin }
      ]
    },
    {
      section: 'ntn-analysis',
      label: 'NTN ANALYSIS',
      icon: ChevronDown,
      collapsed: collapsedSections['ntn-analysis'],
      children: [
        { id: 'ntn-overview', label: 'NTN Overview', icon: Satellite },
        { id: 'ntn-satellites', label: 'Satellite Links', icon: Satellite },
        { id: 'ntn-analytics', label: 'NTN Analytics', icon: BarChart3, badge: 'LIVE' },
        { id: 'ntn-sib19', label: 'SIB19 Analysis', icon: FileText },
        { id: 'ntn-timing', label: 'Timing & Delay', icon: Clock },
        { id: 'ntn-doppler', label: 'Doppler Analysis', icon: Wave },
        { id: 'ntn-scenarios', label: 'NTN Scenarios', icon: MapPin }
      ]
    }
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

  const renderSection = (section: any) => {
    if (section.children) {
      return (
        <div key={section.section} className="mb-2">
          <button
            onClick={() => toggleSection(section.section)}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <ChevronRight className={`w-4 h-4 mr-3 transition-transform ${section.collapsed ? 'rotate-0' : 'rotate-90'}`} />
            <span className="flex-1 text-left">{section.label}</span>
          </button>
          {!section.collapsed && (
            <div className="ml-4 mt-1 space-y-1">
              {section.children.map((child: any) => renderMenuItem(child))}
            </div>
          )}
        </div>
      );
    }
    return renderMenuItem(section);
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
            {analyticsItems.map(renderSection)}
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

// Dashboard View Component
const DashboardView: React.FC<{
  appState: any;
  onStateChange: (state: any) => void;
}> = ({ appState, onStateChange }) => {
  const [analysisData, setAnalysisData] = useState<any>(null);

  useEffect(() => {
    // Simulate analyzed messages
    const sampleMessages = [
      { component: 'PHY', type: 'PDSCH', timestamp: '931.6', level: 'I' },
      { component: 'MAC', type: 'DL PDU', timestamp: '938.5', level: 'I' },
      { component: 'RLC', type: 'TX PDU', timestamp: '940.1', level: 'I' },
      { component: 'PHY', type: 'PUCCH', timestamp: '932.1', level: 'E' },
      { component: 'SCHED', type: 'Scheduling', timestamp: '933.2', level: 'W' }
    ];
    
    const analysis = {
      total: 5,
      byComponent: {
        'PHY': 2,
        'MAC': 1,
        'RLC': 1,
        'SCHED': 1
      },
      byType: {
        'PDSCH': 1,
        'DL PDU': 1,
        'TX PDU': 1,
        'PUCCH': 1,
        'Scheduling': 1
      },
      kpis: {
        errorRate: '20.00',
        avgThroughput: '0',
        successRate: '80.00'
      }
    };
    
    setAnalysisData(analysis);
  }, []);

  const stats = {
    totalMessages: analysisData?.total || 0,
    errorRate: analysisData?.kpis?.errorRate || '0',
    avgThroughput: analysisData?.kpis?.avgThroughput || '0',
    successRate: analysisData?.kpis?.successRate || '0'
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">5GLabX Protocol Analyzer Dashboard</h1>

      {/* KPI Cards */}
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

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Message Distribution by Component</h3>
          {analysisData?.byComponent && (
            <div className="space-y-3">
              {Object.entries(analysisData.byComponent).map(([component, count]) => (
                <div key={component} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{component}</span>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {count as number}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Message Types Analysis</h3>
          {analysisData?.byType && (
            <div className="space-y-3">
              {Object.entries(analysisData.byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium">{type}</span>
                  </div>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {count as number}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// Main 5GLabX Platform Component
const FiveGLabXPlatform: React.FC = () => {
  const [appState, setAppState] = useState({
    currentView: 'dashboard',
    sidebarCollapsed: false,
    logs: [],
    selectedLog: null,
    filters: {
      level: 'all',
      component: 'all',
      timeRange: 'all'
    },
    searchQuery: '',
    realTimeEnabled: false,
    darkMode: false,
    isMonitoring: false,
    currentExecutionId: null as string | null,
    testExecutionStatus: null as string | null,
    executionResult: null as any,
    executionError: null as string | null,
    websocketConfig: null as any,
    testExecutionActive: false,
    executionMessages: [] as any[]
  });

  // Load services script on component mount
  useEffect(() => {
    const loadServices = async () => {
      console.log('🚀 Starting to load 5GLabX services...');

      try {
        // Load the services script that makes TestCasePlaybackService available
        const script = document.createElement('script');
        script.src = '/scripts/loadServices.js';
        script.async = true;
        script.onload = () => {
          console.log('✅ Services script loaded successfully');
          // Check if TestCasePlaybackService is available with multiple attempts
          checkTestCasePlaybackServiceAvailability();
        };
        script.onerror = (error) => {
          console.error('❌ Failed to load services script:', error);
          // Try alternative loading methods
          loadServicesFallback();
        };
        document.head.appendChild(script);

        // Also load the service directly as a script tag (more reliable)
        const directScript = document.createElement('script');
        directScript.src = '/services/TestCasePlaybackService.js';
        directScript.async = true;
        directScript.onload = () => {
          console.log('✅ TestCasePlaybackService loaded directly');
          // Check availability immediately after loading
          if (window.TestCasePlaybackService) {
            console.log('✅ TestCasePlaybackService now available after direct load');
          }
        };
        directScript.onerror = () => {
          console.warn('⚠️  Direct TestCasePlaybackService load failed');
        };
        document.head.appendChild(directScript);

        // Also try to load it directly if the script path doesn't work
        try {
          await import('/scripts/loadServices.js');
          console.log('✅ Services script loaded via import');
        } catch (e) {
          console.warn('Could not load services script via import, TestCasePlaybackService may not be available');
        }

        // Enhanced service availability checking
        checkTestCasePlaybackServiceAvailability();

        // Set up emergency data injection trigger
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            // Auto-trigger emergency injection if data is available
            window.autoEmergencyInjection = () => {
              console.log('🔥 AUTO-EMERGENCY INJECTION TRIGGERED');

              // Try all injection methods
              if (window.injectTestDataGlobally) {
                console.log('🚀 Using global injection');
                window.injectTestDataGlobally({
                  testCaseId: 'auto-injection-test',
                  testCaseData: {
                    id: 'auto-injection-test',
                    name: 'Auto Emergency Injection Test',
                    description: 'Test data injected via emergency mechanism',
                    protocol: '5G_NR',
                    category: '5G_NR',
                    expectedMessages: [
                      {
                        id: 'auto_msg_1',
                        stepOrder: 1,
                        timestampMs: Date.now(),
                        direction: 'UL',
                        layer: 'RRC',
                        protocol: '5G_NR',
                        messageType: 'RRCSetupRequest',
                        messageName: 'RRC Setup Request',
                        messageDescription: 'Emergency injection test message',
                        messagePayload: { test: 'emergency_injection' },
                        informationElements: { 'Test IE': 'Emergency' },
                        layerParameters: { 'Injection': 'Active' },
                        standardReference: 'Emergency Test'
                      }
                    ]
                  }
                });
              }
            };

            console.log('✅ Auto-emergency injection mechanism ready');
          }
        }, 2000);

      } catch (error) {
        console.warn('Failed to load services script:', error);
        loadServicesFallback();
      }
    };

    const checkTestCasePlaybackServiceAvailability = () => {
      let attempts = 0;
      const maxAttempts = 10;

      const checkService = () => {
        attempts++;

        if (window.TestCasePlaybackService) {
          console.log('✅ TestCasePlaybackService is available on window object');
          console.log('📊 Service type:', typeof window.TestCasePlaybackService);
          console.log('📊 Service constructor:', window.TestCasePlaybackService.constructor?.name || 'Unknown');

          // Verify it's a class with expected methods
          if (typeof window.TestCasePlaybackService === 'function' && window.TestCasePlaybackService.prototype) {
            const methods = Object.getOwnPropertyNames(window.TestCasePlaybackService.prototype);
            console.log('📊 Available methods:', methods.filter(name => typeof window.TestCasePlaybackService.prototype[name] === 'function'));

            if (methods.includes('startPlayback') && methods.includes('stopPlayback')) {
              console.log('✅ TestCasePlaybackService has expected methods');
            } else {
              console.warn('⚠️  TestCasePlaybackService missing expected methods');
            }
          }

          // Test if the service can be instantiated
          try {
            const serviceInstance = new window.TestCasePlaybackService({});
            console.log('✅ TestCasePlaybackService can be instantiated');
            console.log('📊 Instance type:', serviceInstance.constructor.name);
          } catch (error) {
            console.warn('⚠️  TestCasePlaybackService instantiation failed:', error);
          }
        } else {
          console.log('❌ TestCasePlaybackService not found on window object');

          // Check if it's available as TestCasePlaybackServiceClass
          if ((window as any).TestCasePlaybackServiceClass) {
            console.log('🔄 Found TestCasePlaybackService as TestCasePlaybackServiceClass');
            window.TestCasePlaybackService = (window as any).TestCasePlaybackServiceClass;
            console.log('✅ TestCasePlaybackService reassigned from TestCasePlaybackServiceClass');
          }

          // Check if checkTestCasePlaybackService function is available
          if (window.checkTestCasePlaybackService) {
            console.log('🔄 Running service availability check...');
            window.checkTestCasePlaybackService();
          }
        } else if (attempts < maxAttempts) {
          console.log(`🔄 Checking for TestCasePlaybackService... (attempt ${attempts}/${maxAttempts})`);
          setTimeout(checkService, 1000);
        } else {
          console.warn('⚠️  TestCasePlaybackService not available after multiple attempts');
          console.log('🔄 Trying fallback loading methods...');
          loadServicesFallback();
        }
      };

      checkService();
    };

    const loadServicesFallback = () => {
      console.log('🔄 Attempting fallback service loading...');

      // Try loading the service directly
      const loadServiceDirectly = async () => {
        try {
          console.log('🔄 Loading TestCasePlaybackService directly...');
          const response = await fetch('/services/TestCasePlaybackService.js');
          const scriptText = await response.text();

          // Execute the script in global scope
          const script = document.createElement('script');
          script.textContent = scriptText;
          document.head.appendChild(script);

          console.log('✅ TestCasePlaybackService script injected directly');

          // Check again after injection
          setTimeout(() => {
            if (window.TestCasePlaybackService) {
              console.log('✅ TestCasePlaybackService now available after direct injection');
            } else {
              console.warn('⚠️  TestCasePlaybackService still not available after direct injection');

              // Try to load it manually by creating a script element
              console.log('🔄 Attempting manual service loading...');
              try {
                const manualScript = document.createElement('script');
                manualScript.textContent = `
                  console.log('🚀 Manual service loading attempt...');
                  if (typeof TestCasePlaybackService !== 'undefined') {
                    window.TestCasePlaybackService = TestCasePlaybackService;
                    console.log('✅ TestCasePlaybackService loaded manually');
                  } else {
                    console.log('❌ TestCasePlaybackService not found for manual loading');
                  }
                `;
                document.head.appendChild(manualScript);
              } catch (manualError) {
                console.error('❌ Manual loading failed:', manualError);
              }
            }
          }, 500);

        } catch (error) {
          console.error('❌ Fallback service loading failed:', error);
        }
      };

      loadServiceDirectly();
    };

    loadServices();
  }, []);

  // WebSocket connection for test execution
  const wsConfig = appState.websocketConfig ? {
    url: appState.websocketConfig.url,
    executionId: appState.websocketConfig.executionId,
  } : null;

  const {
    isConnected: wsConnected,
    messages: wsMessages,
    connectionError: wsError,
    sendMessage: sendWsMessage,
    getMessagesByType,
    getMessagesByLayer,
    clearMessages: clearWsMessages,
  } = useTestExecutionWebSocket(wsConfig);

  const navigate = (viewId: string) => {
    setAppState(prev => ({
      ...prev,
      currentView: viewId
    }));
  };

  // Update execution messages when WebSocket receives new messages
  useEffect(() => {
    if (wsMessages.length > 0) {
      setAppState(prev => ({
        ...prev,
        executionMessages: [...prev.executionMessages, ...wsMessages].slice(-1000), // Keep last 1000 messages
      }));
    }
  }, [wsMessages]);

  // Update state when WebSocket connects/disconnects
  useEffect(() => {
    setAppState(prev => ({
      ...prev,
      websocketConnected: wsConnected,
      websocketError: wsError?.message || null,
    }));
  }, [wsConnected, wsError]);

  const handleStateChange = (newState: any) => {
    setAppState(prev => ({ ...prev, ...newState }));
  };

  const renderCurrentView = () => {
    const updatedAppState = {
      ...appState,
      wsConnected,
      wsMessages,
      wsError,
      sendWsMessage,
      getMessagesByType,
      getMessagesByLayer,
      clearWsMessages,
    };

    switch (appState.currentView) {
      case 'dashboard':
        return <DashboardView appState={updatedAppState} onStateChange={handleStateChange} />;
      case 'logs':
        return <LogsView appState={updatedAppState} onStateChange={handleStateChange} />;
      case 'analytics':
        return <AnalyticsView appState={updatedAppState} onStateChange={handleStateChange} />;
      case 'layer-trace':
        return <LayerTraceView appState={updatedAppState} onStateChange={handleStateChange} />;
      case 'callflow':
        return <CallFlowView appState={updatedAppState} onStateChange={handleStateChange} />;
      case 'test-suites':
        return <TestSuitesView appState={updatedAppState} onStateChange={handleStateChange} />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">View Not Found</h2>
              <p className="text-gray-600">View "{appState.currentView}" is not available</p>
            </div>
          </div>
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="h-screen flex bg-gray-50">
        <Sidebar appState={appState} onNavigate={navigate} />
        <div className="flex-1 overflow-auto">
          {renderCurrentView()}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default FiveGLabXPlatform;