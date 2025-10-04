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
  Satellite,
  Car,
  Zap,
  Layers,
  Globe,
  Cpu,
  HardDrive,
  Smartphone,
  Signal,
  Battery,
  MapPin,
  Users,
  MessageSquare,
  Mic,
  Camera,
  Headphones
} from 'lucide-react';
import { dataFlowManager, DataFlowEvent } from '@/utils/DataFlowManager';

// Import all UE view components
import UELogsViewer from './views/UELogsViewer';
import UEEnhancedLogs from './views/UEEnhancedLogs';
import UELayerTraceView from './views/UELayerTraceView';
import UECallFlowView from './views/UECallFlowView';
import UEAnalyticsView from './views/UEAnalyticsView';

// Import professional analysis components
import ProfessionalAnalysisPlatform from '../professional-log-analysis/ProfessionalAnalysisPlatform';

// UE Protocol Stack Views
import UEApplicationLayer from './views/protocol/UEApplicationLayer';
import UEIMSLayer from './views/protocol/UEIMSLayer';
import UENASLayer from './views/protocol/UENASLayer';
import UERRCLayer from './views/protocol/UERRCLayer';
import UEPDCPLayer from './views/protocol/UEPDCPLayer';
import UERLCLayer from './views/protocol/UERLCLayer';
import UEMACLayer from './views/protocol/UEMACLayer';
import UEPHYLayer from './views/protocol/UEPHYLayer';

// UE Performance Views
import UEPerformanceAnalysis from './views/performance/UEPerformanceAnalysis';
import UEMobilityAnalysis from './views/performance/UEMobilityAnalysis';
import UESecurityAnalysis from './views/security/UESecurityAnalysis';
import UECallFlowAnalysis from './views/performance/UECallFlowAnalysis';

// UE Technology Views
import UE5GNR from './views/technology/UE5GNR';
import UE4GLTE from './views/technology/UE4GLTE';
import UEOran from './views/technology/UEOran';
import UENbiot from './views/technology/UENbiot';
import UEV2x from './views/technology/UEV2x';
import UENTN from './views/technology/UENTN';

// UE Device Views
import UEDeviceInfo from './views/device/UEDeviceInfo';
import UECapabilities from './views/device/UECapabilities';
import UEStatus from './views/device/UEStatus';
import UELocation from './views/device/UELocation';

interface NewUEAnalysisPlatformProps {
  className?: string;
}

const NewUEAnalysisPlatform: React.FC<NewUEAnalysisPlatformProps> = ({ className = '' }) => {
  const [currentView, setCurrentView] = useState('ue-logs');
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [dataFlowStatus, setDataFlowStatus] = useState<string>('disconnected');
  const [receivedEvents, setReceivedEvents] = useState<DataFlowEvent[]>([]);

  // Initialize DataFlowManager
  useEffect(() => {
    const initializeDataFlow = () => {
      try {
        // Subscribe to data flow events
        const unsubscribe = dataFlowManager.subscribe('ALL', (event: DataFlowEvent) => {
          console.log(`📡 NewUEAnalysis received event: ${event.type} from ${event.source}`);
          setReceivedEvents(prev => [event, ...prev.slice(0, 49)]); // Keep last 50 events
          setLastUpdate(new Date());
          
          // Handle specific events
          if (event.type === 'TEST_EXECUTION_STARTED' || event.type === 'MESSAGE_TO_UE_ANALYSIS') {
            setExecutionId(event.executionId || null);
            setIsConnected(true);
            console.log(`🔥 NewUEAnalysis: Processing ${event.type} event`);
          }
        });

        setDataFlowStatus('connected');
        console.log('✅ NewUEAnalysis: DataFlowManager connected successfully');
        
        return unsubscribe;
      } catch (error) {
        console.error('❌ Error initializing DataFlowManager in NewUEAnalysis:', error);
        setDataFlowStatus('error');
      }
    };

    const unsubscribe = initializeDataFlow();
    return unsubscribe;
  }, []);

  // Listen for legacy test execution events (backward compatibility)
  useEffect(() => {
    const handleTestExecution = (event: any) => {
      if (event.type === '5GLABX_TEST_EXECUTION' && event.detail?.testCaseData) {
        console.log('🔥 NewUEAnalysis: Received legacy test execution event:', event.detail);
        setExecutionId(event.detail.executionId);
        setIsConnected(true);
        setLastUpdate(new Date());
      }
    };

    window.addEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
    return () => window.removeEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
  }, []);

  // Menu items with exact structure as specified
  const menuItems = [
    { id: 'professional', label: 'Professional Analysis', icon: Activity, badge: 'NEW' },
    { id: 'ue-logs', label: 'UE Logs Viewer', icon: FileText },
    { id: 'ue-enhanced-logs', label: 'UE Enhanced Logs', icon: Search },
    { id: 'ue-layer-trace', label: 'UE Layer Trace', icon: Network },
    { id: 'ue-callflow', label: 'UE Call Flow', icon: Phone },
    { id: 'ue-analytics', label: 'UE Analytics', icon: BarChart3, badge: 'LIVE' },
  ];

  const ueProtocolLayers = [
    { id: 'ue-application-layer', label: 'Application Layer', icon: Smartphone },
    { id: 'ue-ims-layer', label: 'IMS Layer', icon: Phone },
    { id: 'ue-nas-layer', label: 'NAS Layer', icon: Server },
    { id: 'ue-rrc-layer', label: 'RRC Layer', icon: Network },
    { id: 'ue-pdcp-layer', label: 'PDCP Layer', icon: FileText },
    { id: 'ue-rlc-layer', label: 'RLC Layer', icon: Layers },
    { id: 'ue-mac-layer', label: 'MAC Layer', icon: Network },
    { id: 'ue-phy-layer', label: 'PHY Layer', icon: Wifi }
  ];

  const uePerformanceViews = [
    { id: 'ue-performance', label: 'UE Performance', icon: BarChart3, badge: 'LIVE' },
    { id: 'ue-mobility', label: 'UE Mobility', icon: Globe },
    { id: 'ue-security', label: 'UE Security', icon: Shield },
    { id: 'ue-call-flow', label: 'UE Call Flow', icon: Phone }
  ];

  const ueTechnologyViews = [
    { id: 'ue-5gnr', label: '5G NR UE', icon: Wifi },
    { id: 'ue-4glte', label: '4G LTE UE', icon: Network },
    { id: 'ue-oran', label: 'O-RAN UE', icon: Server },
    { id: 'ue-nbiot', label: 'NB-IoT UE', icon: Wifi },
    { id: 'ue-v2x', label: 'C-V2X UE', icon: Car },
    { id: 'ue-ntn', label: 'NTN UE', icon: Satellite }
  ];

  const ueDeviceViews = [
    { id: 'ue-device-info', label: 'Device Information', icon: Smartphone },
    { id: 'ue-capabilities', label: 'UE Capabilities', icon: Settings },
    { id: 'ue-status', label: 'UE Status', icon: Activity },
    { id: 'ue-location', label: 'UE Location', icon: MapPin }
  ];

  const renderMenuItem = (item: any) => {
    const Icon = item.icon;
    return (
      <button
        key={item.id}
        onClick={() => setCurrentView(item.id)}
        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          currentView === item.id
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

  const renderCollapsibleSection = (title: string, items: any[], defaultCollapsed = false) => {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
    
    return (
      <div key={title} className="mb-6">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3 hover:text-gray-700 transition-colors"
        >
          <span>{title}</span>
          <ChevronRight className={`w-4 h-4 transition-transform ${isCollapsed ? '' : 'rotate-90'}`} />
        </button>
        {!isCollapsed && (
          <div className="space-y-1">
            {items.map(renderMenuItem)}
          </div>
        )}
      </div>
    );
  };

  const renderCurrentView = () => {
    switch (currentView) {
      // Main Views
      case 'professional':
        return <ProfessionalAnalysisPlatform executionId={executionId} platform="UE_ANALYSIS" />;
      case 'ue-logs':
        return <UELogsViewer executionId={executionId} />;
      case 'ue-enhanced-logs':
        return <UEEnhancedLogs executionId={executionId} />;
      case 'ue-layer-trace':
        return <UELayerTraceView executionId={executionId} />;
      case 'ue-callflow':
        return <UECallFlowView executionId={executionId} />;
      case 'ue-analytics':
        return <UEAnalyticsView executionId={executionId} />;

      // UE Protocol Layers
      case 'ue-application-layer':
        return <UEApplicationLayer executionId={executionId} />;
      case 'ue-ims-layer':
        return <UEIMSLayer executionId={executionId} />;
      case 'ue-nas-layer':
        return <UENASLayer executionId={executionId} />;
      case 'ue-rrc-layer':
        return <UERRCLayer executionId={executionId} />;
      case 'ue-pdcp-layer':
        return <UEPDCPLayer executionId={executionId} />;
      case 'ue-rlc-layer':
        return <UERLCLayer executionId={executionId} />;
      case 'ue-mac-layer':
        return <UEMACLayer executionId={executionId} />;
      case 'ue-phy-layer':
        return <UEPHYLayer executionId={executionId} />;

      // UE Performance Views
      case 'ue-performance':
        return <UEPerformanceAnalysis executionId={executionId} />;
      case 'ue-mobility':
        return <UEMobilityAnalysis executionId={executionId} />;
      case 'ue-security':
        return <UESecurityAnalysis executionId={executionId} />;
      case 'ue-call-flow':
        return <UECallFlowAnalysis executionId={executionId} />;

      // UE Technology Views
      case 'ue-5gnr':
        return <UE5GNR executionId={executionId} />;
      case 'ue-4glte':
        return <UE4GLTE executionId={executionId} />;
      case 'ue-oran':
        return <UEOran executionId={executionId} />;
      case 'ue-nbiot':
        return <UENbiot executionId={executionId} />;
      case 'ue-v2x':
        return <UEV2x executionId={executionId} />;
      case 'ue-ntn':
        return <UENTN executionId={executionId} />;

      // UE Device Views
      case 'ue-device-info':
        return <UEDeviceInfo executionId={executionId} />;
      case 'ue-capabilities':
        return <UECapabilities executionId={executionId} />;
      case 'ue-status':
        return <UEStatus executionId={executionId} />;
      case 'ue-location':
        return <UELocation executionId={executionId} />;

      default:
        return <UELogsViewer executionId={executionId} />;
    }
  };

  return (
    <div className={`flex h-full ${className}`}>
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-6 h-6 text-blue-600" />
            <h1 className="text-lg font-bold text-gray-900">UE Analysis</h1>
          </div>
          <div className="mt-2 flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
            <span className="text-xs text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            {lastUpdate && (
              <span className="text-xs text-gray-500">
                {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Main Views */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Main Views
            </h3>
            <div className="space-y-1">
              {menuItems.map(renderMenuItem)}
            </div>
          </div>

          {/* UE Protocol Stack */}
          {renderCollapsibleSection('UE Protocol Stack', ueProtocolLayers)}

          {/* UE Performance */}
          {renderCollapsibleSection('UE Performance', uePerformanceViews)}

          {/* UE Technologies */}
          {renderCollapsibleSection('UE Technologies', ueTechnologyViews)}

          {/* UE Device */}
          {renderCollapsibleSection('UE Device', ueDeviceViews)}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default NewUEAnalysisPlatform;