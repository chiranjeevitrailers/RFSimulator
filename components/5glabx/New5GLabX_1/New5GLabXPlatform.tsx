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
  HardDrive
} from 'lucide-react';
import { dataFlowManager, DataFlowEvent } from '@/utils/DataFlowManager';

// Import all view components
import LogsViewer from './views/LogsViewer';
import EnhancedLogs from './views/EnhancedLogs';
import LayerTraceView from './views/LayerTraceView';
import CallFlowView from './views/CallFlowView';
import AnalyticsView from './views/AnalyticsView';

// Import professional analysis components
import ProfessionalAnalysisPlatform from '../professional-log-analysis/ProfessionalAnalysisPlatform';

// O-RAN Analysis Views
import OranOverview from './views/oran/OranOverview';
import InterfacesView from './views/oran/InterfacesView';
import CuAnalysis from './views/oran/CuAnalysis';
import DuAnalysis from './views/oran/DuAnalysis';
import E1Interface from './views/oran/E1Interface';
import F1Interface from './views/oran/F1Interface';
import OranPerformance from './views/oran/OranPerformance';
import XAppsView from './views/oran/XAppsView';
import SmoAnalysis from './views/oran/SmoAnalysis';

// NB-IoT Analysis Views
import NbiotOverview from './views/nbiot/NbiotOverview';
import NbiotCallFlow from './views/nbiot/NbiotCallFlow';
import NbiotAnalytics from './views/nbiot/NbiotAnalytics';
import NbiotPhy from './views/nbiot/NbiotPhy';
import NbiotMac from './views/nbiot/NbiotMac';
import NbiotRrc from './views/nbiot/NbiotRrc';
import NbiotTesting from './views/nbiot/NbiotTesting';

// C-V2X Analysis Views
import V2xOverview from './views/v2x/V2xOverview';
import Pc5Sidelink from './views/v2x/Pc5Sidelink';
import V2xAnalytics from './views/v2x/V2xAnalytics';
import V2xPhy from './views/v2x/V2xPhy';
import V2xMac from './views/v2x/V2xMac';
import V2xTesting from './views/v2x/V2xTesting';
import TestScenarios from './views/v2x/TestScenarios';

// NTN Analysis Views
import NtnOverview from './views/ntn/NtnOverview';
import SatelliteLinks from './views/ntn/SatelliteLinks';
import NtnAnalytics from './views/ntn/NtnAnalytics';
import Sib19Analysis from './views/ntn/Sib19Analysis';
import TimingDelay from './views/ntn/TimingDelay';
import DopplerAnalysis from './views/ntn/DopplerAnalysis';
import NtnScenarios from './views/ntn/NtnScenarios';

// Protocol Layers Views
import PhyLayerView from './views/protocol/PhyLayerView';
import MacLayerView from './views/protocol/MacLayerView';
import RlcLayerView from './views/protocol/RlcLayerView';
import PdcpLayerView from './views/protocol/PdcpLayerView';
import RrcLayerView from './views/protocol/RrcLayerView';
import NasLayerView from './views/protocol/NasLayerView';
import ImsAnalysis from './views/protocol/ImsAnalysis';

// Core Network Views
import AmfAnalyzer from './views/core/AmfAnalyzer';
import SmfAnalyzer from './views/core/SmfAnalyzer';
import UpfAnalyzer from './views/core/UpfAnalyzer';
import AusfAnalyzer from './views/core/AusfAnalyzer';
import UdmAnalyzer from './views/core/UdmAnalyzer';
import ConfigManager from './views/core/ConfigManager';

// 4G Legacy Views
import MmeAnalyzer from './views/legacy/MmeAnalyzer';
import SgwAnalyzer from './views/legacy/SgwAnalyzer';
import PgwAnalyzer from './views/legacy/PgwAnalyzer';

interface New5GLabXPlatformProps {
  className?: string;
}

const New5GLabXPlatform: React.FC<New5GLabXPlatformProps> = ({ className = '' }) => {
  const [currentView, setCurrentView] = useState('logs');
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
          console.log(`📡 New5GLabX received event: ${event.type} from ${event.source}`);
          setReceivedEvents(prev => [event, ...prev.slice(0, 49)]); // Keep last 50 events
          setLastUpdate(new Date());
          
          // Handle specific events
          if (event.type === 'TEST_EXECUTION_STARTED' || event.type === 'MESSAGE_TO_5GLABX') {
            setExecutionId(event.executionId || null);
            setIsConnected(true);
            console.log(`🔥 New5GLabX: Processing ${event.type} event`);
          }
        });

        setDataFlowStatus('connected');
        console.log('✅ New5GLabX: DataFlowManager connected successfully');
        
        return unsubscribe;
      } catch (error) {
        console.error('❌ Error initializing DataFlowManager in New5GLabX:', error);
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
        console.log('🔥 New5GLabX: Received legacy test execution event:', event.detail);
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
    { id: 'logs', label: 'Logs Viewer', icon: FileText },
    { id: 'enhanced-logs', label: 'Enhanced Logs', icon: Search },
    { id: 'layer-trace', label: 'Layer Trace', icon: Network },
    { id: 'callflow', label: 'Call Flow', icon: Phone },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: 'LIVE' },
  ];

  const oranViews = [
    { id: 'oran-overview', label: 'O-RAN Overview', icon: Network },
    { id: 'oran-interfaces', label: 'Interfaces', icon: ChevronRight },
    { id: 'oran-cu-analysis', label: 'CU Analysis', icon: Server },
    { id: 'oran-du-analysis', label: 'DU Analysis', icon: Database },
    { id: 'oran-e1-interface', label: 'E1 Interface', icon: ChevronRight },
    { id: 'oran-f1-interface', label: 'F1 Interface', icon: ChevronRight },
    { id: 'oran-performance', label: 'Performance', icon: BarChart3, badge: 'LIVE' },
    { id: 'oran-xapps', label: 'xApps', icon: Settings },
    { id: 'oran-smo', label: 'SMO Analysis', icon: Settings }
  ];

  const nbiotViews = [
    { id: 'nbiot-overview', label: 'NB-IoT Overview', icon: Wifi },
    { id: 'nbiot-callflow', label: 'NB-IoT Call Flow', icon: Phone },
    { id: 'nbiot-analytics', label: 'NB-IoT Analytics', icon: BarChart3, badge: 'LIVE' },
    { id: 'nbiot-phy-layer', label: 'NB-IoT PHY', icon: Wifi },
    { id: 'nbiot-mac-layer', label: 'NB-IoT MAC', icon: Network },
    { id: 'nbiot-rrc-layer', label: 'NB-IoT RRC', icon: Settings },
    { id: 'nbiot-testing', label: 'NB-IoT Testing', icon: CheckCircle }
  ];

  const v2xViews = [
    { id: 'v2x-overview', label: 'V2X Overview', icon: Network },
    { id: 'v2x-sidelink', label: 'PC5 Sidelink', icon: Wifi },
    { id: 'v2x-analytics', label: 'V2X Analytics', icon: BarChart3, badge: 'LIVE' },
    { id: 'v2x-phy-layer', label: 'V2X PHY', icon: Wifi },
    { id: 'v2x-mac-layer', label: 'V2X MAC', icon: Network },
    { id: 'v2x-testing', label: 'V2X Testing', icon: CheckCircle },
    { id: 'v2x-scenarios', label: 'Test Scenarios', icon: FileText }
  ];

  const ntnViews = [
    { id: 'ntn-overview', label: 'NTN Overview', icon: Network },
    { id: 'ntn-satellites', label: 'Satellite Links', icon: Wifi },
    { id: 'ntn-analytics', label: 'NTN Analytics', icon: BarChart3, badge: 'LIVE' },
    { id: 'ntn-sib19', label: 'SIB19 Analysis', icon: FileText },
    { id: 'ntn-timing', label: 'Timing & Delay', icon: Clock },
    { id: 'ntn-doppler', label: 'Doppler Analysis', icon: Activity },
    { id: 'ntn-scenarios', label: 'NTN Scenarios', icon: FileText }
  ];

  const protocolLayers = [
    { id: 'phy-layer', label: 'PHY Layer', icon: Wifi },
    { id: 'mac-layer', label: 'MAC Layer', icon: Network },
    { id: 'rlc-layer', label: 'RLC Layer', icon: Layers },
    { id: 'pdcp-layer', label: 'PDCP Layer', icon: FileText },
    { id: 'rrc-layer', label: 'RRC Layer', icon: Network },
    { id: 'nas-layer', label: 'NAS Layer', icon: Server },
    { id: 'ims-analysis', label: 'IMS Analysis', icon: Phone }
  ];

  const coreNetwork = [
    { id: 'amf-analyzer', label: 'AMF Analyzer', icon: Database },
    { id: 'smf-analyzer', label: 'SMF Analyzer', icon: Server },
    { id: 'upf-analyzer', label: 'UPF Analyzer', icon: Network },
    { id: 'ausf-analyzer', label: 'AUSF Analyzer', icon: Shield },
    { id: 'udm-analyzer', label: 'UDM Analyzer', icon: Settings },
    { id: 'config-manager', label: 'Config Manager', icon: Settings }
  ];

  const legacyNetwork = [
    { id: 'mme-analyzer', label: 'MME Analyzer', icon: Database },
    { id: 'sgw-analyzer', label: 'SGW Analyzer', icon: Server },
    { id: 'pgw-analyzer', label: 'PGW Analyzer', icon: Network }
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
        return <ProfessionalAnalysisPlatform executionId={executionId} platform="5GLABX" />;
      case 'logs':
        return <LogsViewer executionId={executionId} />;
      case 'enhanced-logs':
        return <EnhancedLogs executionId={executionId} />;
      case 'layer-trace':
        return <LayerTraceView executionId={executionId} />;
      case 'callflow':
        return <CallFlowView executionId={executionId} />;
      case 'analytics':
        return <AnalyticsView executionId={executionId} />;

      // O-RAN Analysis
      case 'oran-overview':
        return <OranOverview executionId={executionId} />;
      case 'oran-interfaces':
        return <InterfacesView executionId={executionId} />;
      case 'oran-cu-analysis':
        return <CuAnalysis executionId={executionId} />;
      case 'oran-du-analysis':
        return <DuAnalysis executionId={executionId} />;
      case 'oran-e1-interface':
        return <E1Interface executionId={executionId} />;
      case 'oran-f1-interface':
        return <F1Interface executionId={executionId} />;
      case 'oran-performance':
        return <OranPerformance executionId={executionId} />;
      case 'oran-xapps':
        return <XAppsView executionId={executionId} />;
      case 'oran-smo':
        return <SmoAnalysis executionId={executionId} />;

      // NB-IoT Analysis
      case 'nbiot-overview':
        return <NbiotOverview executionId={executionId} />;
      case 'nbiot-callflow':
        return <NbiotCallFlow executionId={executionId} />;
      case 'nbiot-analytics':
        return <NbiotAnalytics executionId={executionId} />;
      case 'nbiot-phy-layer':
        return <NbiotPhy executionId={executionId} />;
      case 'nbiot-mac-layer':
        return <NbiotMac executionId={executionId} />;
      case 'nbiot-rrc-layer':
        return <NbiotRrc executionId={executionId} />;
      case 'nbiot-testing':
        return <NbiotTesting executionId={executionId} />;

      // C-V2X Analysis
      case 'v2x-overview':
        return <V2xOverview executionId={executionId} />;
      case 'v2x-sidelink':
        return <Pc5Sidelink executionId={executionId} />;
      case 'v2x-analytics':
        return <V2xAnalytics executionId={executionId} />;
      case 'v2x-phy-layer':
        return <V2xPhy executionId={executionId} />;
      case 'v2x-mac-layer':
        return <V2xMac executionId={executionId} />;
      case 'v2x-testing':
        return <V2xTesting executionId={executionId} />;
      case 'v2x-scenarios':
        return <TestScenarios executionId={executionId} />;

      // NTN Analysis
      case 'ntn-overview':
        return <NtnOverview executionId={executionId} />;
      case 'ntn-satellites':
        return <SatelliteLinks executionId={executionId} />;
      case 'ntn-analytics':
        return <NtnAnalytics executionId={executionId} />;
      case 'ntn-sib19':
        return <Sib19Analysis executionId={executionId} />;
      case 'ntn-timing':
        return <TimingDelay executionId={executionId} />;
      case 'ntn-doppler':
        return <DopplerAnalysis executionId={executionId} />;
      case 'ntn-scenarios':
        return <NtnScenarios executionId={executionId} />;

      // Protocol Layers
      case 'phy-layer':
        return <PhyLayerView executionId={executionId} />;
      case 'mac-layer':
        return <MacLayerView executionId={executionId} />;
      case 'rlc-layer':
        return <RlcLayerView executionId={executionId} />;
      case 'pdcp-layer':
        return <PdcpLayerView executionId={executionId} />;
      case 'rrc-layer':
        return <RrcLayerView executionId={executionId} />;
      case 'nas-layer':
        return <NasLayerView executionId={executionId} />;
      case 'ims-analysis':
        return <ImsAnalysis executionId={executionId} />;

      // Core Network
      case 'amf-analyzer':
        return <AmfAnalyzer executionId={executionId} />;
      case 'smf-analyzer':
        return <SmfAnalyzer executionId={executionId} />;
      case 'upf-analyzer':
        return <UpfAnalyzer executionId={executionId} />;
      case 'ausf-analyzer':
        return <AusfAnalyzer executionId={executionId} />;
      case 'udm-analyzer':
        return <UdmAnalyzer executionId={executionId} />;
      case 'config-manager':
        return <ConfigManager executionId={executionId} />;

      // 4G Legacy
      case 'mme-analyzer':
        return <MmeAnalyzer executionId={executionId} />;
      case 'sgw-analyzer':
        return <SgwAnalyzer executionId={executionId} />;
      case 'pgw-analyzer':
        return <PgwAnalyzer executionId={executionId} />;

      default:
        return <LogsViewer executionId={executionId} />;
    }
  };

  return (
    <div className={`flex h-full ${className}`}>
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-blue-600" />
            <h1 className="text-lg font-bold text-gray-900">5GLabX Analysis</h1>
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

          {/* O-RAN Analysis */}
          {renderCollapsibleSection('O-RAN Analysis', oranViews)}

          {/* NB-IoT Analysis */}
          {renderCollapsibleSection('NB-IoT Analysis', nbiotViews)}

          {/* C-V2X Analysis */}
          {renderCollapsibleSection('C-V2X Analysis', v2xViews)}

          {/* NTN Analysis */}
          {renderCollapsibleSection('NTN Analysis', ntnViews)}

          {/* Protocol Layers */}
          {renderCollapsibleSection('Protocol Layers', protocolLayers)}

          {/* Core Network */}
          {renderCollapsibleSection('Core Network', coreNetwork)}

          {/* 4G Legacy */}
          {renderCollapsibleSection('4G Legacy', legacyNetwork)}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default New5GLabXPlatform;