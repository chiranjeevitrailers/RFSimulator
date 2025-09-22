'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, BarChart3, TrendingUp, TrendingDown, Signal, 
  Radio, Layers, Package2, Shield, Smartphone, User,
  Monitor, Zap, Eye, RefreshCw, Clock, CheckCircle, XCircle,
  AlertTriangle, Info, Database, Wifi, Network, Server
} from 'lucide-react';

interface LayerStats {
  layer: string;
  messageCount: number;
  successRate: number;
  errorRate: number;
  avgProcessingTime: number;
  throughput: number;
  lastUpdate: number;
  parameters: {
    [key: string]: {
      value: number | string;
      unit?: string;
      trend: 'up' | 'down' | 'stable';
      status: 'good' | 'warning' | 'error';
    };
  };
  recentMessages: Array<{
    id: string;
    timestamp: number;
    type: string;
    direction: string;
    status: 'success' | 'error' | 'warning';
    processingTime: number;
  }>;
}

const LayerStatisticsDashboard: React.FC<{
  testCaseData?: any;
}> = ({ testCaseData }) => {
  const [layerStats, setLayerStats] = useState<Record<string, LayerStats>>({});
  const [selectedLayer, setSelectedLayer] = useState<string>('ALL');
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Initialize layer statistics
  useEffect(() => {
    const initializeLayerStats = () => {
      const initialStats: Record<string, LayerStats> = {
        PHY: {
          layer: 'PHY',
          messageCount: 0,
          successRate: 100,
          errorRate: 0,
          avgProcessingTime: 0,
          throughput: 0,
          lastUpdate: Date.now(),
          parameters: {
            'SS-RSRP': { value: -85, unit: 'dBm', trend: 'stable', status: 'good' },
            'SS-RSRQ': { value: -10, unit: 'dB', trend: 'stable', status: 'good' },
            'SS-SINR': { value: 15, unit: 'dB', trend: 'stable', status: 'good' },
            'Bandwidth': { value: 100, unit: 'MHz', trend: 'stable', status: 'good' },
            'MIMO-Layers': { value: 4, unit: 'layers', trend: 'stable', status: 'good' }
          },
          recentMessages: []
        },
        MAC: {
          layer: 'MAC',
          messageCount: 0,
          successRate: 100,
          errorRate: 0,
          avgProcessingTime: 0,
          throughput: 0,
          lastUpdate: Date.now(),
          parameters: {
            'DL-Throughput': { value: 0, unit: 'Mbps', trend: 'stable', status: 'good' },
            'UL-Throughput': { value: 0, unit: 'Mbps', trend: 'stable', status: 'good' },
            'HARQ-Processes': { value: 8, unit: 'processes', trend: 'stable', status: 'good' },
            'Scheduling-Blocks': { value: 0, unit: 'blocks', trend: 'stable', status: 'good' },
            'Error-Rate': { value: 0, unit: '%', trend: 'stable', status: 'good' }
          },
          recentMessages: []
        },
        RLC: {
          layer: 'RLC',
          messageCount: 0,
          successRate: 100,
          errorRate: 0,
          avgProcessingTime: 0,
          throughput: 0,
          lastUpdate: Date.now(),
          parameters: {
            'TX-PDUs': { value: 0, unit: 'PDUs', trend: 'stable', status: 'good' },
            'RX-PDUs': { value: 0, unit: 'PDUs', trend: 'stable', status: 'good' },
            'Retransmissions': { value: 0, unit: 'count', trend: 'stable', status: 'good' },
            'Buffer-Status': { value: 0, unit: '%', trend: 'stable', status: 'good' },
            'Window-Size': { value: 512, unit: 'PDUs', trend: 'stable', status: 'good' }
          },
          recentMessages: []
        },
        PDCP: {
          layer: 'PDCP',
          messageCount: 0,
          successRate: 100,
          errorRate: 0,
          avgProcessingTime: 0,
          throughput: 0,
          lastUpdate: Date.now(),
          parameters: {
            'Sequence-Number': { value: 0, unit: 'count', trend: 'stable', status: 'good' },
            'Compression-Ratio': { value: 0, unit: '%', trend: 'stable', status: 'good' },
            'Ciphering-Status': { value: 'Active', trend: 'stable', status: 'good' },
            'Integrity-Status': { value: 'Active', trend: 'stable', status: 'good' },
            'PDU-Count': { value: 0, unit: 'PDUs', trend: 'stable', status: 'good' }
          },
          recentMessages: []
        },
        RRC: {
          layer: 'RRC',
          messageCount: 0,
          successRate: 100,
          errorRate: 0,
          avgProcessingTime: 0,
          throughput: 0,
          lastUpdate: Date.now(),
          parameters: {
            'Transaction-ID': { value: 0, unit: 'ID', trend: 'stable', status: 'good' },
            'SRB-Count': { value: 0, unit: 'SRBs', trend: 'stable', status: 'good' },
            'DRB-Count': { value: 0, unit: 'DRBs', trend: 'stable', status: 'good' },
            'Connection-Status': { value: 'Idle', trend: 'stable', status: 'good' },
            'State-Changes': { value: 0, unit: 'changes', trend: 'stable', status: 'good' }
          },
          recentMessages: []
        },
        NAS: {
          layer: 'NAS',
          messageCount: 0,
          successRate: 100,
          errorRate: 0,
          avgProcessingTime: 0,
          throughput: 0,
          lastUpdate: Date.now(),
          parameters: {
            'Key-Set-ID': { value: 0, unit: 'ID', trend: 'stable', status: 'good' },
            'PDU-Session-Count': { value: 0, unit: 'sessions', trend: 'stable', status: 'good' },
            'Registration-Status': { value: 'Not-Registered', trend: 'stable', status: 'good' },
            'Security-Context': { value: 'None', trend: 'stable', status: 'good' },
            'Authentication-Status': { value: 'Pending', trend: 'stable', status: 'good' }
          },
          recentMessages: []
        }
      };
      
      setLayerStats(initialStats);
    };

    initializeLayerStats();
  }, []);

  // Listen for test case data and update layer statistics
  useEffect(() => {
    const handleTestCaseData = (event: MessageEvent) => {
      if (event.data && event.data.type === '5GLABX_TEST_EXECUTION') {
        console.log('📊 Layer Statistics Dashboard: Received test data:', event.data.testCaseId);
        setIsLiveTracking(true);
        setLastUpdate(new Date());
        
        const { testCaseData } = event.data;
        
        if (testCaseData && testCaseData.expectedMessages) {
          // Process each message for layer statistics updates
          testCaseData.expectedMessages.forEach((message: any, index: number) => {
            setTimeout(() => {
              updateLayerStatistics(message, index);
            }, index * 1000); // Update every second
          });
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('message', handleTestCaseData);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', handleTestCaseData);
      }
    };
  }, []);

  const updateLayerStatistics = (message: any, messageIndex: number) => {
    const timestamp = Date.now() + messageIndex * 1000;
    const layer = message.layer;
    
    if (!layerStats[layer]) return;

    setLayerStats(prev => {
      const updated = { ...prev };
      const layerStat = { ...updated[layer] };
      
      // Update message count
      layerStat.messageCount += 1;
      
      // Simulate processing time and success/error rates
      const processingTime = Math.random() * 50 + 10; // 10-60ms
      const isSuccess = Math.random() > 0.05; // 95% success rate
      
      // Update success/error rates
      if (isSuccess) {
        layerStat.successRate = Math.min(100, layerStat.successRate + 0.1);
        layerStat.errorRate = Math.max(0, layerStat.errorRate - 0.1);
      } else {
        layerStat.successRate = Math.max(0, layerStat.successRate - 0.5);
        layerStat.errorRate = Math.min(100, layerStat.errorRate + 0.5);
      }
      
      // Update average processing time
      layerStat.avgProcessingTime = (layerStat.avgProcessingTime + processingTime) / 2;
      
      // Update throughput (simulate based on message type)
      const throughputIncrease = Math.random() * 10 + 5; // 5-15 Mbps
      layerStat.throughput += throughputIncrease;
      
      // Update layer-specific parameters
      updateLayerParameters(layerStat, message, messageIndex);
      
      // Add recent message
      const recentMessage = {
        id: `${layer}_${messageIndex}_${timestamp}`,
        timestamp,
        type: message.messageType,
        direction: message.direction,
        status: isSuccess ? 'success' : 'error',
        processingTime
      };
      
      layerStat.recentMessages = [recentMessage, ...layerStat.recentMessages].slice(0, 10); // Keep last 10
      layerStat.lastUpdate = timestamp;
      
      updated[layer] = layerStat;
      return updated;
    });
  };

  const updateLayerParameters = (layerStat: LayerStats, message: any, messageIndex: number) => {
    const layer = layerStat.layer;
    
    switch (layer) {
      case 'PHY':
        // Update PHY parameters
        layerStat.parameters['SS-RSRP'].value = -85 + (Math.random() - 0.5) * 10;
        layerStat.parameters['SS-RSRQ'].value = -10 + (Math.random() - 0.5) * 6;
        layerStat.parameters['SS-SINR'].value = 15 + (Math.random() - 0.5) * 8;
        layerStat.parameters['SS-RSRP'].trend = Math.random() > 0.5 ? 'up' : 'down';
        layerStat.parameters['SS-RSRQ'].trend = Math.random() > 0.5 ? 'up' : 'down';
        layerStat.parameters['SS-SINR'].trend = Math.random() > 0.5 ? 'up' : 'down';
        break;
        
      case 'MAC':
        // Update MAC parameters
        layerStat.parameters['DL-Throughput'].value = Math.floor(85.5 + (Math.random() - 0.5) * 30);
        layerStat.parameters['UL-Throughput'].value = Math.floor(42.3 + (Math.random() - 0.5) * 20);
        layerStat.parameters['HARQ-Processes'].value = Math.floor(4 + Math.random() * 12);
        layerStat.parameters['Scheduling-Blocks'].value = Math.floor(Math.random() * 100);
        layerStat.parameters['Error-Rate'].value = Math.random() * 2;
        break;
        
      case 'RLC':
        // Update RLC parameters
        layerStat.parameters['TX-PDUs'].value = Math.floor(1250 + messageIndex * 50 + Math.random() * 100);
        layerStat.parameters['RX-PDUs'].value = Math.floor(1200 + messageIndex * 45 + Math.random() * 90);
        layerStat.parameters['Retransmissions'].value = Math.floor(15 + Math.random() * 10);
        layerStat.parameters['Buffer-Status'].value = Math.floor(Math.random() * 100);
        break;
        
      case 'PDCP':
        // Update PDCP parameters
        layerStat.parameters['Sequence-Number'].value = Math.floor(2048 + messageIndex * 10 + Math.random() * 20);
        layerStat.parameters['Compression-Ratio'].value = Math.floor(15.2 + (Math.random() - 0.5) * 5);
        layerStat.parameters['PDU-Count'].value = Math.floor(1000 + messageIndex * 25 + Math.random() * 50);
        break;
        
      case 'RRC':
        // Update RRC parameters
        if (message.messageType === 'RRCSetupRequest') {
          layerStat.parameters['Transaction-ID'].value = Math.floor(Math.random() * 4);
          layerStat.parameters['Connection-Status'].value = 'Connecting';
        } else if (message.messageType === 'RRCSetup') {
          layerStat.parameters['Connection-Status'].value = 'Connected';
          layerStat.parameters['SRB-Count'].value = 2;
        }
        layerStat.parameters['State-Changes'].value = Math.floor(Math.random() * 10);
        break;
        
      case 'NAS':
        // Update NAS parameters
        if (message.messageType === 'RegistrationRequest') {
          layerStat.parameters['Key-Set-ID'].value = Math.floor(Math.random() * 8);
          layerStat.parameters['Registration-Status'].value = 'Registering';
          layerStat.parameters['Security-Context'].value = 'Established';
        }
        layerStat.parameters['PDU-Session-Count'].value = Math.floor(Math.random() * 5);
        break;
    }
  };

  const getLayerIcon = (layer: string) => {
    switch (layer) {
      case 'PHY': return <Radio className="w-5 h-5" />;
      case 'MAC': return <Layers className="w-5 h-5" />;
      case 'RLC': return <Package2 className="w-5 h-5" />;
      case 'PDCP': return <Shield className="w-5 h-5" />;
      case 'RRC': return <Smartphone className="w-5 h-5" />;
      case 'NAS': return <User className="w-5 h-5" />;
      default: return <Monitor className="w-5 h-5" />;
    }
  };

  const getLayerColor = (layer: string) => {
    switch (layer) {
      case 'PHY': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MAC': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'RLC': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PDCP': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'RRC': return 'bg-red-100 text-red-800 border-red-200';
      case 'NAS': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredLayers = Object.values(layerStats).filter(layer => 
    selectedLayer === 'ALL' || layer.layer === selectedLayer
  );

  const layers = ['ALL', 'PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'];

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Layer Statistics Dashboard
        </h3>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {isLiveTracking ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">Live Tracking</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Waiting for Test Data</span>
              </>
            )}
          </div>
          {lastUpdate && (
            <div className="text-xs text-gray-500">
              Last Update: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
          <select
            value={selectedLayer}
            onChange={(e) => setSelectedLayer(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            {layers.map(layer => (
              <option key={layer} value={layer}>{layer}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLayers.map((layer) => (
          <div key={layer.layer} className={`border-2 rounded-lg p-4 ${getLayerColor(layer.layer)}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getLayerIcon(layer.layer)}
                <span className="font-semibold text-lg">{layer.layer} Layer</span>
              </div>
              <div className="text-xs text-gray-600">
                {new Date(layer.lastUpdate).toLocaleTimeString()}
              </div>
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white bg-opacity-50 rounded p-2">
                <div className="text-xs text-gray-600">Messages</div>
                <div className="text-lg font-bold">{layer.messageCount}</div>
              </div>
              <div className="bg-white bg-opacity-50 rounded p-2">
                <div className="text-xs text-gray-600">Success Rate</div>
                <div className="text-lg font-bold text-green-600">{layer.successRate.toFixed(1)}%</div>
              </div>
              <div className="bg-white bg-opacity-50 rounded p-2">
                <div className="text-xs text-gray-600">Throughput</div>
                <div className="text-lg font-bold">{layer.throughput.toFixed(1)} Mbps</div>
              </div>
              <div className="bg-white bg-opacity-50 rounded p-2">
                <div className="text-xs text-gray-600">Avg Time</div>
                <div className="text-lg font-bold">{layer.avgProcessingTime.toFixed(1)}ms</div>
              </div>
            </div>

            {/* Layer Parameters */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Key Parameters</h4>
              <div className="space-y-1">
                {Object.entries(layer.parameters).slice(0, 3).map(([key, param]) => (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <span className="truncate">{key}</span>
                    <div className="flex items-center space-x-1">
                      <span className="font-mono">
                        {typeof param.value === 'number' ? param.value.toFixed(1) : param.value}
                        {param.unit && ` ${param.unit}`}
                      </span>
                      {getTrendIcon(param.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Messages */}
            <div>
              <h4 className="text-sm font-medium mb-2">Recent Messages</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {layer.recentMessages.slice(0, 5).map((msg) => (
                  <div key={msg.id} className="flex items-center justify-between text-xs bg-white bg-opacity-30 rounded p-1">
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(msg.status)}
                      <span className="truncate">{msg.type}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-600">{msg.direction}</span>
                      <span className="font-mono">{msg.processingTime.toFixed(1)}ms</span>
                    </div>
                  </div>
                ))}
                {layer.recentMessages.length === 0 && (
                  <div className="text-xs text-gray-500 text-center py-2">
                    No messages yet
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLayers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Monitor className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No layer statistics available for selected layer</p>
          <p className="text-sm">Run a test case to see live layer statistics</p>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {filteredLayers.reduce((sum, layer) => sum + layer.messageCount, 0)}
            </div>
            <div className="text-gray-600">Total Messages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredLayers.length > 0 ? 
                (filteredLayers.reduce((sum, layer) => sum + layer.successRate, 0) / filteredLayers.length).toFixed(1) : 0}%
            </div>
            <div className="text-gray-600">Avg Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {filteredLayers.reduce((sum, layer) => sum + layer.throughput, 0).toFixed(1)}
            </div>
            <div className="text-gray-600">Total Throughput (Mbps)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {filteredLayers.length > 0 ? 
                (filteredLayers.reduce((sum, layer) => sum + layer.avgProcessingTime, 0) / filteredLayers.length).toFixed(1) : 0}ms
            </div>
            <div className="text-gray-600">Avg Processing Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayerStatisticsDashboard;