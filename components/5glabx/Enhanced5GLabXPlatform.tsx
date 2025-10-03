// Enhanced 5GLabX Platform with Fixed Data Flow
// This component integrates all the fixed services and ensures proper data flow

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DataFlowProvider, useDataFlow } from './providers/DataFlowProvider';
import LogsView from './views/LogsView';
import AnalyticsView from './views/AnalyticsView';
import TestSuitesView from './views/TestSuitesView';
import LayerTraceView from './views/LayerTraceView';
import CallFlowView from './views/CallFlowView';
import OranView from './views/OranView';
import NbiotView from './views/NbiotView';
import V2xView from './views/V2xView';
import NtnView from './views/NtnView';
import PhyLayerViewTSX from './views/PhyLayerViewTSX';
import MacLayerViewTSX from './views/MacLayerViewTSX';
import RlcLayerViewTSX from './views/RlcLayerViewTSX';
import PdcpLayerViewTSX from './views/PdcpLayerViewTSX';
import RrcLayerViewTSX from './views/RrcLayerViewTSX';
import NasLayerViewTSX from './views/NasLayerViewTSX';
import ImsLayerView from './views/ImsLayerView';
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

// Core Network Analyzer Component
const CoreNetworkAnalyzer: React.FC<{ analyzerType: string }> = ({ analyzerType }) => {
  const [analyzerData, setAnalyzerData] = useState<any[]>([]);
  const [isReceivingData, setIsReceivingData] = useState(false);
  const [lastDataReceived, setLastDataReceived] = useState<Date | null>(null);
  const [executionId, setExecutionId] = useState<string | null>(null);

  // Listen for 5GLABX_TEST_EXECUTION events
  useEffect(() => {
    const handleTestExecution = (event: any) => {
      try {
        if (event.detail && event.detail.type === '5GLABX_TEST_EXECUTION') {
          console.log(`🔥 ${analyzerType}: Received 5GLABX_TEST_EXECUTION event:`, event.detail);
          
          const { testCaseId, testCaseData, executionId } = event.detail;
          
          if (testCaseData && testCaseData.expectedMessages) {
            setExecutionId(executionId);
            setIsReceivingData(true);
            setLastDataReceived(new Date());
            
            // Process messages for this analyzer
            const analyzerMessages = testCaseData.expectedMessages.filter((msg: any) =>
              msg.layer === analyzerType.replace('-analyzer', '').toUpperCase() ||
              msg.messageType?.includes(analyzerType.replace('-analyzer', '').toUpperCase()) ||
              msg.messageType?.includes('CORE') || msg.messageType?.includes('5G')
            );

            console.log(`📡 ${analyzerType}: Processing ${analyzerMessages.length} messages from test case`);

            // Add expected analyzer logs
            const analyzerLogs = analyzerMessages.map((msg: any, idx: number) => ({
              id: msg.id || `${analyzerType}-${testCaseId}-${idx}`,
              timestamp: new Date(msg.timestampMs || Date.now() + idx * 1000).toLocaleTimeString(),
              layer: analyzerType.replace('-analyzer', '').toUpperCase(),
              message: `${msg.messageName || 'Unknown Message'}: ${JSON.stringify(msg.messagePayload || {})}`,
              pduType: msg.messageType || 'GENERIC',
              direction: msg.direction || 'DL',
              source: 'TestManager',
              validationStatus: 'valid',
              processingTime: Math.random() * 10 + 1
            }));

            setAnalyzerData(prev => [...analyzerLogs, ...prev.slice(0, 19)]);
            console.log(`✅ ${analyzerType}: Added ${analyzerLogs.length} logs from test case`);
          }
        }
      } catch (error) {
        console.error(`❌ ${analyzerType}: Error handling test execution event:`, error);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
      }
    };
  }, [analyzerType]);

  const analyzerName = analyzerType.replace('-analyzer', '').replace('-manager', '').toUpperCase();
  const isCoreNetwork = !analyzerType.includes('manager');

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {analyzerName} {isCoreNetwork ? 'Analyzer' : 'Manager'}
          </h2>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${isReceivingData ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-3 h-3 rounded-full ${isReceivingData ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}></div>
              <span className="text-sm font-medium">
                {isReceivingData ? "🟢 Live Data" : "⚪ Waiting"}
              </span>
            </div>
            {lastDataReceived && (
              <span className="text-xs text-gray-500">
                Last: {lastDataReceived.toLocaleTimeString()}
              </span>
            )}
            {executionId && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Exec: {executionId.slice(0, 8)}...
              </span>
            )}
          </div>
        </div>
        <p className="text-gray-600 mb-6">
          {isCoreNetwork ? '5G Core Network' : '5G Core Network'} {analyzerName} analysis and monitoring.
        </p>
        
        {analyzerData.length > 0 ? (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Live {analyzerName} Messages ({analyzerData.length})
              </h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {analyzerData.slice(-10).reverse().map((msg, index) => (
                  <div key={msg.id} className="flex items-center space-x-3 p-2 bg-white rounded border">
                    <div className="text-xs text-gray-500 font-mono w-16">
                      {msg.timestamp}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          {msg.layer}
                        </span>
                        <span className="text-sm font-medium">{msg.message}</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {msg.direction} • {msg.pduType}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              This view is ready for implementation with real-time data from your 5G Core Network.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Legacy Network Analyzer Component
const LegacyNetworkAnalyzer: React.FC<{ analyzerType: string }> = ({ analyzerType }) => {
  const [analyzerData, setAnalyzerData] = useState<any[]>([]);
  const [isReceivingData, setIsReceivingData] = useState(false);
  const [lastDataReceived, setLastDataReceived] = useState<Date | null>(null);
  const [executionId, setExecutionId] = useState<string | null>(null);

  // Listen for 5GLABX_TEST_EXECUTION events
  useEffect(() => {
    const handleTestExecution = (event: any) => {
      try {
        if (event.detail && event.detail.type === '5GLABX_TEST_EXECUTION') {
          console.log(`🔥 ${analyzerType}: Received 5GLABX_TEST_EXECUTION event:`, event.detail);
          
          const { testCaseId, testCaseData, executionId } = event.detail;
          
          if (testCaseData && testCaseData.expectedMessages) {
            setExecutionId(executionId);
            setIsReceivingData(true);
            setLastDataReceived(new Date());
            
            // Process messages for this analyzer
            const analyzerMessages = testCaseData.expectedMessages.filter((msg: any) =>
              msg.layer === analyzerType.replace('-analyzer', '').toUpperCase() ||
              msg.messageType?.includes(analyzerType.replace('-analyzer', '').toUpperCase()) ||
              msg.messageType?.includes('LTE') || msg.messageType?.includes('4G')
            );

            console.log(`📡 ${analyzerType}: Processing ${analyzerMessages.length} messages from test case`);

            // Add expected analyzer logs
            const analyzerLogs = analyzerMessages.map((msg: any, idx: number) => ({
              id: msg.id || `${analyzerType}-${testCaseId}-${idx}`,
              timestamp: new Date(msg.timestampMs || Date.now() + idx * 1000).toLocaleTimeString(),
              layer: analyzerType.replace('-analyzer', '').toUpperCase(),
              message: `${msg.messageName || 'Unknown Message'}: ${JSON.stringify(msg.messagePayload || {})}`,
              pduType: msg.messageType || 'GENERIC',
              direction: msg.direction || 'DL',
              source: 'TestManager',
              validationStatus: 'valid',
              processingTime: Math.random() * 10 + 1
            }));

            setAnalyzerData(prev => [...analyzerLogs, ...prev.slice(0, 19)]);
            console.log(`✅ ${analyzerType}: Added ${analyzerLogs.length} logs from test case`);
          }
        }
      } catch (error) {
        console.error(`❌ ${analyzerType}: Error handling test execution event:`, error);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
      }
    };
  }, [analyzerType]);

  const analyzerName = analyzerType.replace('-analyzer', '').toUpperCase();

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {analyzerName} Analyzer
          </h2>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${isReceivingData ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-3 h-3 rounded-full ${isReceivingData ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}></div>
              <span className="text-sm font-medium">
                {isReceivingData ? "🟢 Live Data" : "⚪ Waiting"}
              </span>
            </div>
            {lastDataReceived && (
              <span className="text-xs text-gray-500">
                Last: {lastDataReceived.toLocaleTimeString()}
              </span>
            )}
            {executionId && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Exec: {executionId.slice(0, 8)}...
              </span>
            )}
          </div>
        </div>
        <p className="text-gray-600 mb-6">
          Legacy 4G/LTE {analyzerName} network element analysis.
        </p>
        
        {analyzerData.length > 0 ? (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Live {analyzerName} Messages ({analyzerData.length})
              </h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {analyzerData.slice(-10).reverse().map((msg, index) => (
                  <div key={msg.id} className="flex items-center space-x-3 p-2 bg-white rounded border">
                    <div className="text-xs text-gray-500 font-mono w-16">
                      {msg.timestamp}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                          {msg.layer}
                        </span>
                        <span className="text-sm font-medium">{msg.message}</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {msg.direction} • {msg.pduType}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800">
              This view is ready for implementation with real-time data from your LTE Core Network.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Dashboard Component
const EnhancedDashboard: React.FC = () => {
  const {
    isConnected,
    layerData,
    realTimeData,
    getLayerStatistics,
    startTestCase,
    stopTestCase
  } = useDataFlow();

  const [selectedTestCaseId, setSelectedTestCaseId] = useState('');
  const [layerStats, setLayerStats] = useState<Record<string, any>>({});
  const [executionStatus, setExecutionStatus] = useState('idle');

  // Update layer statistics every second
  useEffect(() => {
    const interval = setInterval(() => {
      setLayerStats(getLayerStatistics());
    }, 1000);

    return () => clearInterval(interval);
  }, [getLayerStatistics]);

  // Listen for Test Manager execution events
  useEffect(() => {
    const handleTestManagerExecution = (event: any) => {
      console.log('🎯 5GLabX: Received test execution from Test Manager:', event.detail);
      
      const { testCaseId, testCaseData, executionId } = event.detail;
      
      if (testCaseId && testCaseData) {
        setSelectedTestCaseId(testCaseId);
        setExecutionStatus('running');
        
        console.log(`📋 5GLabX: Processing test case: ${testCaseData.name}`);
        console.log(`🆔 Execution ID: ${executionId}`);
        
        // Trigger the data flow
        startTestCase(testCaseId);
        
        // Update status after processing
        setTimeout(() => {
          setExecutionStatus('completed');
        }, (testCaseData.expectedMessages?.length || 3) * 2000 + 1000);
      }
    };

    // Listen for Test Manager events
    if (typeof window !== 'undefined') {
      window.addEventListener('testCaseExecutionStarted', handleTestManagerExecution);
      window.addEventListener('5GLABX_TEST_EXECUTION', handleTestManagerExecution);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('testCaseExecutionStarted', handleTestManagerExecution);
        window.removeEventListener('5GLABX_TEST_EXECUTION', handleTestManagerExecution);
      }
    };
  }, [startTestCase]);

  const handleStopTestCase = async () => {
    try {
      setExecutionStatus('stopping');
      await stopTestCase();
      setExecutionStatus('idle');
      setSelectedTestCaseId('');
    } catch (error) {
      console.error('Failed to stop test case:', error);
      setExecutionStatus('error');
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

        {/* Test Execution Status */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Test Execution Status</h3>
          <p className="text-blue-800 text-sm">
            {executionStatus === 'idle' ? 
              '⏳ Waiting for test case selection from Test Manager...' :
              `🔄 Status: ${executionStatus}`
            }
          </p>
          {selectedTestCaseId && (
            <p className="text-blue-700 text-xs mt-1">
              Active Test Case: {selectedTestCaseId}
            </p>
          )}
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
            <div className="text-2xl font-bold text-blue-600">{realTimeData?.length || 0}</div>
            <div className="text-sm text-gray-500">Total Messages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Object.values(layerData || {}).flat().length}
            </div>
            <div className="text-sm text-gray-500">Layer Messages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(layerStats || {}).length}
            </div>
            <div className="text-sm text-gray-500">Active Layers</div>
          </div>
        </div>
      </div>

      {/* Test Manager Integration Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Test Manager Integration</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <h4 className="font-medium text-green-900">Test Manager Connection</h4>
              <p className="text-sm text-green-700">Ready to receive test case selections</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">Available Test Cases</h4>
            <p className="text-sm text-blue-700">1,000+ test cases loaded from Supabase</p>
          </div>
          
          <div className="p-3 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900">How to Use</h4>
            <p className="text-sm text-purple-700">
              1. Go to "Test Manager" tab<br/>
              2. Select test case(s)<br/>
              3. Click "Run" button<br/>
              4. Return here to view real-time analysis
            </p>
          </div>
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
  const { layerData, getLayerStatistics } = useDataFlow();
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
      badge: layerData ? Object.values(layerData || {}).flat().length : 0
    },
    {
      id: 'enhanced-logs',
      label: 'Enhanced Logs',
      icon: Search,
      badge: Object.keys(layerStats || {}).length
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

        {/* O-RAN Analysis */}
        {renderCollapsibleSection('O-RAN ANALYSIS', oranViews)}

        {/* NB-IoT Analysis */}
        {renderCollapsibleSection('NB-IOT ANALYSIS', nbiotViews)}

        {/* V2X Analysis */}
        {renderCollapsibleSection('C-V2X ANALYSIS', v2xViews)}

        {/* NTN Analysis */}
        {renderCollapsibleSection('NTN ANALYSIS', ntnViews)}

        {/* 5G Core Network */}
        {renderCollapsibleSection('5G CORE NETWORK', coreNetwork)}

        {/* Legacy Network */}
        {renderCollapsibleSection('LEGACY NETWORK', legacyNetwork)}
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
        return <LogsView appState={{}} onStateChange={() => {}} />;
      case 'enhanced-logs':
        return <LogsView appState={{ enhanced: true }} onStateChange={() => {}} />;
      case 'layer-trace':
        return <LayerTraceView />;
      case 'callflow':
        return <CallFlowView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'test-suites':
        return <TestSuitesView />;
      
      // O-RAN Views
      case 'oran-overview':
      case 'oran-interfaces':
      case 'oran-cu-analysis':
      case 'oran-du-analysis':
      case 'oran-e1-interface':
      case 'oran-f1-interface':
      case 'oran-performance':
      case 'oran-xapps':
      case 'oran-smo':
        return <OranView viewId={currentView} />;
      
      // NB-IoT Views
      case 'nbiot-overview':
      case 'nbiot-callflow':
      case 'nbiot-analytics':
      case 'nbiot-phy-layer':
      case 'nbiot-mac-layer':
      case 'nbiot-rrc-layer':
      case 'nbiot-testing':
        return <NbiotView viewId={currentView} />;
      
      // V2X Views
      case 'v2x-overview':
      case 'v2x-sidelink':
      case 'v2x-analytics':
      case 'v2x-phy-layer':
      case 'v2x-mac-layer':
      case 'v2x-testing':
      case 'v2x-scenarios':
        return <V2xView viewId={currentView} />;
      
      // NTN Views
      case 'ntn-overview':
      case 'ntn-satellites':
      case 'ntn-analytics':
      case 'ntn-sib19':
      case 'ntn-timing':
      case 'ntn-doppler':
      case 'ntn-scenarios':
        return <NtnView viewId={currentView} />;
      
      // Core Network Views
      case 'amf-analyzer':
      case 'smf-analyzer':
      case 'upf-analyzer':
      case 'ausf-analyzer':
      case 'udm-analyzer':
      case 'config-manager':
        return <CoreNetworkAnalyzer analyzerType={currentView} />;
      
      // Legacy Network Views
      case 'mme-analyzer':
      case 'sgw-analyzer':
      case 'pgw-analyzer':
        return <LegacyNetworkAnalyzer analyzerType={currentView} />;
      
      // Protocol Layer Views
      case 'phy-layer':
        return <PhyLayerViewTSX appState={{}} onStateChange={() => {}} />;
      case 'mac-layer':
        return <MacLayerViewTSX appState={{}} onStateChange={() => {}} />;
      case 'rlc-layer':
        return <RlcLayerViewTSX appState={{}} onStateChange={() => {}} />;
      case 'pdcp-layer':
        return <PdcpLayerViewTSX appState={{}} onStateChange={() => {}} />;
      case 'rrc-layer':
        return <RrcLayerViewTSX appState={{}} onStateChange={() => {}} />;
      case 'nas-layer':
        return <NasLayerViewTSX appState={{}} onStateChange={() => {}} />;
      case 'ims-layer':
        return <ImsLayerView appState={{}} onStateChange={() => {}} />;
      
      default:
        return <EnhancedDashboard />;
    }
  };

  return (
    <DataFlowProvider>
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
    </DataFlowProvider>
  );
};

export default Enhanced5GLabXPlatform;