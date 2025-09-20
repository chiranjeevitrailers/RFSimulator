'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, TrendingUp, TrendingDown, BarChart3, 
  Radio, Layers, Package2, Shield, Smartphone, User,
  Monitor, Zap, Signal, Eye, RefreshCw
} from 'lucide-react';

interface LayerParameter {
  name: string;
  value: number | string;
  unit?: string;
  range?: string;
  reference?: string;
  layer: string;
  timestamp: number;
  trend?: 'up' | 'down' | 'stable';
  previousValue?: number | string;
}

interface LayerParameterHistory {
  [parameterName: string]: LayerParameter[];
}

const LayerParametersTracker: React.FC<{
  testCaseData?: any;
}> = ({ testCaseData }) => {
  const [parameterHistory, setParameterHistory] = useState<LayerParameterHistory>({});
  const [currentParameters, setCurrentParameters] = useState<Record<string, LayerParameter>>({});
  const [selectedLayer, setSelectedLayer] = useState<string>('ALL');
  const [isLiveTracking, setIsLiveTracking] = useState(false);

  // Initialize with sample parameters
  useEffect(() => {
    const initializeParameters = () => {
      const initialParams: Record<string, LayerParameter> = {
        // PHY Layer Parameters
        'SS-RSRP': {
          name: 'SS-RSRP',
          value: -85,
          unit: 'dBm',
          range: '(-156, -31)',
          reference: 'TS 38.215 5.1.1',
          layer: 'PHY',
          timestamp: Date.now(),
          trend: 'stable'
        },
        'SS-RSRQ': {
          name: 'SS-RSRQ', 
          value: -10,
          unit: 'dB',
          range: '(-43, 20)',
          reference: 'TS 38.215 5.1.2',
          layer: 'PHY',
          timestamp: Date.now(),
          trend: 'stable'
        },
        'SS-SINR': {
          name: 'SS-SINR',
          value: 15,
          unit: 'dB',
          range: '(-23, 40)',
          reference: 'TS 38.215 5.1.3',
          layer: 'PHY',
          timestamp: Date.now(),
          trend: 'stable'
        },
        
        // MAC Layer Parameters
        'HARQ-Processes': {
          name: 'HARQ-Processes',
          value: 8,
          range: '1..16',
          reference: 'TS 38.321 5.4.2',
          layer: 'MAC',
          timestamp: Date.now(),
          trend: 'stable'
        },
        'DL-Throughput': {
          name: 'DL-Throughput',
          value: 85.5,
          unit: 'Mbps',
          reference: 'TS 38.321',
          layer: 'MAC',
          timestamp: Date.now(),
          trend: 'up'
        },
        'UL-Throughput': {
          name: 'UL-Throughput',
          value: 42.3,
          unit: 'Mbps', 
          reference: 'TS 38.321',
          layer: 'MAC',
          timestamp: Date.now(),
          trend: 'stable'
        },
        
        // RLC Layer Parameters
        'AM-TX-PDUs': {
          name: 'AM-TX-PDUs',
          value: 1250,
          reference: 'TS 38.322 5.2.1',
          layer: 'RLC',
          timestamp: Date.now(),
          trend: 'up'
        },
        'AM-Retransmissions': {
          name: 'AM-Retransmissions',
          value: 15,
          range: '0..infinity',
          reference: 'TS 38.322 5.2.1',
          layer: 'RLC',
          timestamp: Date.now(),
          trend: 'down'
        },
        
        // PDCP Layer Parameters
        'PDCP-Sequence-Number': {
          name: 'PDCP-Sequence-Number',
          value: 2048,
          range: '0..4095',
          reference: 'TS 38.323 5.1',
          layer: 'PDCP',
          timestamp: Date.now(),
          trend: 'up'
        },
        'Compression-Ratio': {
          name: 'Compression-Ratio',
          value: 15.2,
          unit: '%',
          reference: 'TS 38.323',
          layer: 'PDCP',
          timestamp: Date.now(),
          trend: 'stable'
        },
        
        // RRC Layer Parameters
        'Transaction-ID': {
          name: 'Transaction-ID',
          value: 2,
          range: '0..3',
          reference: 'TS 38.331 6.3.2',
          layer: 'RRC',
          timestamp: Date.now(),
          trend: 'stable'
        },
        'SRB-Count': {
          name: 'SRB-Count',
          value: 2,
          range: '1..3',
          reference: 'TS 38.331',
          layer: 'RRC',
          timestamp: Date.now(),
          trend: 'stable'
        },
        'DRB-Count': {
          name: 'DRB-Count',
          value: 1,
          range: '0..32',
          reference: 'TS 38.331',
          layer: 'RRC',
          timestamp: Date.now(),
          trend: 'stable'
        },
        
        // NAS Layer Parameters
        'Key-Set-Identifier': {
          name: 'Key-Set-Identifier',
          value: 7,
          range: '0..7',
          reference: 'TS 24.501 9.11.3.32',
          layer: 'NAS',
          timestamp: Date.now(),
          trend: 'stable'
        },
        'PDU-Session-Count': {
          name: 'PDU-Session-Count',
          value: 1,
          range: '0..16',
          reference: 'TS 24.501',
          layer: 'NAS',
          timestamp: Date.now(),
          trend: 'stable'
        }
      };
      
      setCurrentParameters(initialParams);
      
      // Initialize history
      const history: LayerParameterHistory = {};
      Object.values(initialParams).forEach(param => {
        history[param.name] = [param];
      });
      setParameterHistory(history);
    };

    initializeParameters();
  }, []);

  // Listen for test case data and update parameters
  useEffect(() => {
    const handleTestCaseData = (event: MessageEvent) => {
      if (event.data && event.data.type === '5GLABX_TEST_EXECUTION') {
        console.log('📊 Layer Parameters Tracker: Received test data:', event.data.testCaseId);
        setIsLiveTracking(true);
        
        const { testCaseData } = event.data;
        
        if (testCaseData && testCaseData.expectedMessages) {
          // Process each message for layer parameter updates
          testCaseData.expectedMessages.forEach((message: any, index: number) => {
            setTimeout(() => {
              updateLayerParameters(message, index);
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

  const updateLayerParameters = (message: any, messageIndex: number) => {
    const timestamp = Date.now() + messageIndex * 1000;
    
    // Generate realistic parameter variations based on message and layer
    const parameterUpdates: Record<string, Partial<LayerParameter>> = {};
    
    if (message.layer === 'PHY' || message.layer === 'RRC') {
      // PHY parameters vary with signal conditions
      parameterUpdates['SS-RSRP'] = {
        value: -85 + (Math.random() - 0.5) * 10, // ±5 dBm variation
        timestamp,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      };
      
      parameterUpdates['SS-RSRQ'] = {
        value: -10 + (Math.random() - 0.5) * 6, // ±3 dB variation
        timestamp,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      };
      
      parameterUpdates['SS-SINR'] = {
        value: 15 + (Math.random() - 0.5) * 8, // ±4 dB variation
        timestamp,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      };
    }
    
    if (message.layer === 'MAC') {
      // MAC parameters vary with traffic
      parameterUpdates['DL-Throughput'] = {
        value: 85.5 + (Math.random() - 0.5) * 30, // ±15 Mbps variation
        timestamp,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      };
      
      parameterUpdates['UL-Throughput'] = {
        value: 42.3 + (Math.random() - 0.5) * 20, // ±10 Mbps variation
        timestamp,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      };
      
      parameterUpdates['HARQ-Processes'] = {
        value: Math.floor(4 + Math.random() * 12), // 4-16 processes
        timestamp,
        trend: 'stable'
      };
    }
    
    if (message.layer === 'RLC') {
      // RLC parameters increase with data transmission
      parameterUpdates['AM-TX-PDUs'] = {
        value: Math.floor(1250 + messageIndex * 50 + Math.random() * 100),
        timestamp,
        trend: 'up'
      };
      
      parameterUpdates['AM-Retransmissions'] = {
        value: Math.floor(15 + Math.random() * 10),
        timestamp,
        trend: Math.random() > 0.7 ? 'up' : 'down'
      };
    }
    
    if (message.layer === 'PDCP') {
      // PDCP sequence numbers increment
      parameterUpdates['PDCP-Sequence-Number'] = {
        value: Math.floor(2048 + messageIndex * 10 + Math.random() * 20),
        timestamp,
        trend: 'up'
      };
      
      parameterUpdates['Compression-Ratio'] = {
        value: 15.2 + (Math.random() - 0.5) * 5, // ±2.5% variation
        timestamp,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      };
    }
    
    if (message.layer === 'RRC') {
      // RRC parameters change with procedures
      if (message.messageType === 'RRCSetupRequest') {
        parameterUpdates['Transaction-ID'] = {
          value: Math.floor(Math.random() * 4), // 0-3
          timestamp,
          trend: 'stable'
        };
      }
    }
    
    if (message.layer === 'NAS') {
      // NAS parameters change with registration
      if (message.messageType === 'RegistrationRequest') {
        parameterUpdates['Key-Set-Identifier'] = {
          value: Math.floor(Math.random() * 8), // 0-7
          timestamp,
          trend: 'stable'
        };
      }
    }
    
    // Apply updates
    setCurrentParameters(prev => {
      const updated = { ...prev };
      
      Object.entries(parameterUpdates).forEach(([paramName, update]) => {
        if (updated[paramName]) {
          const previousValue = updated[paramName].value;
          updated[paramName] = {
            ...updated[paramName],
            ...update,
            previousValue
          };
        }
      });
      
      return updated;
    });
    
    // Update history
    setParameterHistory(prev => {
      const updated = { ...prev };
      
      Object.entries(parameterUpdates).forEach(([paramName, update]) => {
        if (updated[paramName] && currentParameters[paramName]) {
          const newEntry = {
            ...currentParameters[paramName],
            ...update,
            previousValue: currentParameters[paramName].value
          };
          
          updated[paramName] = [...(updated[paramName] || []), newEntry].slice(-20); // Keep last 20 entries
        }
      });
      
      return updated;
    });
  };

  const getLayerIcon = (layer: string) => {
    switch (layer) {
      case 'PHY': return <Radio className="w-4 h-4" />;
      case 'MAC': return <Layers className="w-4 h-4" />;
      case 'RLC': return <Package2 className="w-4 h-4" />;
      case 'PDCP': return <Shield className="w-4 h-4" />;
      case 'RRC': return <Smartphone className="w-4 h-4" />;
      case 'NAS': return <User className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const getLayerColor = (layer: string) => {
    switch (layer) {
      case 'PHY': return 'bg-blue-100 text-blue-800';
      case 'MAC': return 'bg-purple-100 text-purple-800';
      case 'RLC': return 'bg-yellow-100 text-yellow-800';
      case 'PDCP': return 'bg-indigo-100 text-indigo-800';
      case 'RRC': return 'bg-red-100 text-red-800';
      case 'NAS': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredParameters = Object.values(currentParameters).filter(param => 
    selectedLayer === 'ALL' || param.layer === selectedLayer
  );

  const layers = ['ALL', 'PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'];

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Layer Parameters Variation Tracker
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredParameters.map((param) => (
          <div key={param.name} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getLayerIcon(param.layer)}
                <span className={`px-2 py-1 rounded text-xs font-medium ${getLayerColor(param.layer)}`}>
                  {param.layer}
                </span>
              </div>
              {getTrendIcon(param.trend || 'stable')}
            </div>
            
            <div className="mb-2">
              <h4 className="font-medium text-gray-900 text-sm">{param.name}</h4>
              <div className="flex items-baseline space-x-1">
                <span className="text-lg font-bold text-gray-900">
                  {typeof param.value === 'number' ? param.value.toFixed(1) : param.value}
                </span>
                {param.unit && (
                  <span className="text-sm text-gray-600">{param.unit}</span>
                )}
              </div>
            </div>
            
            {param.previousValue !== undefined && param.previousValue !== param.value && (
              <div className="text-xs text-gray-500 mb-2">
                Previous: {typeof param.previousValue === 'number' ? param.previousValue.toFixed(1) : param.previousValue}
                {param.unit && ` ${param.unit}`}
              </div>
            )}
            
            {param.range && (
              <div className="text-xs text-gray-500 mb-1">
                Range: <span className="font-mono">{param.range}</span>
              </div>
            )}
            
            {param.reference && (
              <div className="text-xs text-blue-600">
                {param.reference}
              </div>
            )}
            
            <div className="mt-2 text-xs text-gray-400">
              Updated: {new Date(param.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {filteredParameters.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Monitor className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No parameters available for selected layer</p>
          <p className="text-sm">Run a test case to see live parameter variations</p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total Parameters: {filteredParameters.length}</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span>Increasing: {filteredParameters.filter(p => p.trend === 'up').length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span>Decreasing: {filteredParameters.filter(p => p.trend === 'down').length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Activity className="w-4 h-4 text-gray-600" />
              <span>Stable: {filteredParameters.filter(p => p.trend === 'stable').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayerParametersTracker;