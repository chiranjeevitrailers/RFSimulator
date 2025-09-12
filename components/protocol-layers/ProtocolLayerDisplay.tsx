'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity,
  BarChart3,
  Settings,
  Eye,
  EyeOff,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Database,
  Network,
  Layers,
  MessageSquare,
  Code,
  Shield,
  Target,
  Award,
  Monitor,
  Smartphone,
  Wifi,
  Signal,
  Battery,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Filter,
  Search,
  Download,
  Upload
} from 'lucide-react';

interface LayerData {
  layer: string;
  protocol: string;
  status: 'active' | 'inactive' | 'error' | 'warning';
  messageCount: number;
  errorCount: number;
  successRate: number;
  averageLatency: number;
  throughput: number;
  parameters: any;
  capabilities: any;
  performance: any;
  statistics: any;
  configuration: any;
  lastActivity: Date;
  messages: LayerMessage[];
}

interface LayerMessage {
  id: string;
  timestamp: Date;
  direction: 'UL' | 'DL' | 'BIDIRECTIONAL';
  messageType: string;
  messageName: string;
  size: number;
  status: 'success' | 'error' | 'warning';
  latency: number;
  rawData: string;
  decodedData: any;
  informationElements: any[];
  validationResult: any;
}

interface ProtocolLayerDisplayProps {
  executionId: string;
  testCaseId: string;
  userId: string;
  selectedLayers: string[];
}

const ProtocolLayerDisplay: React.FC<ProtocolLayerDisplayProps> = ({ 
  executionId, 
  testCaseId, 
  userId, 
  selectedLayers 
}) => {
  const [layerData, setLayerData] = useState<LayerData[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string>('PHY');
  const [viewMode, setViewMode] = useState<'overview' | 'messages' | 'parameters' | 'performance'>('overview');
  const [isRealTime, setIsRealTime] = useState(true);
  const [showRawData, setShowRawData] = useState(false);
  const [showDecodedData, setShowDecodedData] = useState(true);
  const [showInformationElements, setShowInformationElements] = useState(true);
  const [timeRange, setTimeRange] = useState<'1m' | '5m' | '15m' | '1h' | 'all'>('1m');

  useEffect(() => {
    // Simulate layer data
    const mockLayerData: LayerData[] = [
      {
        layer: 'PHY',
        protocol: 'NR-PHY',
        status: 'active',
        messageCount: 45,
        errorCount: 2,
        successRate: 95.6,
        averageLatency: 1.2,
        throughput: 150.5,
        parameters: {
          dl_arfcn: 3732480,
          ul_arfcn: 3732480,
          bandwidth: 100,
          subcarrier_spacing: 30,
          pci: 123,
          cell_id: 123456
        },
        capabilities: {
          max_bandwidth: 100,
          max_mimo_layers: 4,
          supported_modulations: ['QPSK', '16QAM', '64QAM', '256QAM'],
          carrier_aggregation: true
        },
        performance: {
          rsrp: -85,
          rsrq: -12,
          sinr: 18,
          cqi: 13,
          mcs: 20,
          bler: 0.01
        },
        statistics: {
          total_packets: 1000,
          successful_packets: 956,
          failed_packets: 44,
          retransmissions: 12,
          out_of_order: 3
        },
        configuration: {
          harq_enabled: true,
          scheduling_algorithm: 'proportional_fair',
          max_retransmissions: 3
        },
        lastActivity: new Date(),
        messages: []
      },
      {
        layer: 'MAC',
        protocol: 'NR-MAC',
        status: 'active',
        messageCount: 38,
        errorCount: 1,
        successRate: 97.4,
        averageLatency: 2.1,
        throughput: 148.2,
        parameters: {
          harq_enabled: true,
          scheduling_algorithm: 'proportional_fair',
          max_retransmissions: 3,
          max_harq_processes: 16
        },
        capabilities: {
          max_harq_processes: 16,
          max_logical_channels: 32,
          scheduling_modes: ['dynamic', 'semi-persistent', 'configured']
        },
        performance: {
          harq_processes: 8,
          sched_requests: 2,
          buffer_status_reports: 1,
          random_access_attempts: 1
        },
        statistics: {
          total_packets: 800,
          successful_packets: 779,
          failed_packets: 21,
          retransmissions: 8,
          out_of_order: 1
        },
        configuration: {
          harq_enabled: true,
          scheduling_algorithm: 'proportional_fair',
          max_retransmissions: 3
        },
        lastActivity: new Date(),
        messages: []
      },
      {
        layer: 'RLC',
        protocol: 'NR-RLC',
        status: 'active',
        messageCount: 42,
        errorCount: 0,
        successRate: 100,
        averageLatency: 3.5,
        throughput: 145.8,
        parameters: {
          rlc_mode: 'AM',
          max_retransmissions: 3,
          polling_interval: 100,
          window_size: 1024
        },
        capabilities: {
          modes: ['AM', 'UM', 'TM'],
          max_sequence_number: 4095,
          segmentation: true
        },
        performance: {
          tx_pdus: 50,
          rx_pdus: 50,
          retransmissions: 2,
          out_of_order: 0
        },
        statistics: {
          total_packets: 600,
          successful_packets: 600,
          failed_packets: 0,
          retransmissions: 5,
          out_of_order: 0
        },
        configuration: {
          rlc_mode: 'AM',
          max_retransmissions: 3,
          polling_interval: 100
        },
        lastActivity: new Date(),
        messages: []
      },
      {
        layer: 'PDCP',
        protocol: 'NR-PDCP',
        status: 'active',
        messageCount: 40,
        errorCount: 0,
        successRate: 100,
        averageLatency: 4.2,
        throughput: 142.3,
        parameters: {
          pdcp_mode: 'AM',
          security_enabled: true,
          integrity_protection: true,
          ciphering: true
        },
        capabilities: {
          max_sequence_number: 4095,
          security_algorithms: ['AES-128', 'AES-256'],
          compression: true
        },
        performance: {
          tx_packets: 100,
          rx_packets: 100,
          dropped_packets: 0,
          duplicate_packets: 0
        },
        statistics: {
          total_packets: 500,
          successful_packets: 500,
          failed_packets: 0,
          retransmissions: 0,
          out_of_order: 0
        },
        configuration: {
          pdcp_mode: 'AM',
          security_enabled: true,
          integrity_protection: true
        },
        lastActivity: new Date(),
        messages: []
      },
      {
        layer: 'RRC',
        protocol: 'NR-RRC',
        status: 'active',
        messageCount: 15,
        errorCount: 0,
        successRate: 100,
        averageLatency: 8.5,
        throughput: 140.1,
        parameters: {
          rrc_state: 'RRC_CONNECTED',
          security_activated: true,
          mobility_management: 'enabled'
        },
        capabilities: {
          states: ['RRC_IDLE', 'RRC_INACTIVE', 'RRC_CONNECTED'],
          security_algorithms: ['AES-128', 'AES-256']
        },
        performance: {
          rrc_setup_requests: 1,
          rrc_setup_complete: 1,
          rrc_reconfigurations: 0
        },
        statistics: {
          total_packets: 200,
          successful_packets: 200,
          failed_packets: 0,
          retransmissions: 0,
          out_of_order: 0
        },
        configuration: {
          rrc_state: 'RRC_CONNECTED',
          security_activated: true,
          mobility_management: 'enabled'
        },
        lastActivity: new Date(),
        messages: []
      },
      {
        layer: 'NAS',
        protocol: '5G-NAS',
        status: 'active',
        messageCount: 8,
        errorCount: 0,
        successRate: 100,
        averageLatency: 15.2,
        throughput: 138.7,
        parameters: {
          nas_state: 'REGISTERED',
          security_context: 'activated',
          mobility_management: 'enabled'
        },
        capabilities: {
          states: ['DEREGISTERED', 'REGISTERED', 'DEREGISTERED_INITIATED'],
          security_algorithms: ['AES-128', 'AES-256']
        },
        performance: {
          registration_requests: 1,
          registration_accepts: 1,
          pdu_session_requests: 1
        },
        statistics: {
          total_packets: 100,
          successful_packets: 100,
          failed_packets: 0,
          retransmissions: 0,
          out_of_order: 0
        },
        configuration: {
          nas_state: 'REGISTERED',
          security_context: 'activated',
          mobility_management: 'enabled'
        },
        lastActivity: new Date(),
        messages: []
      }
    ];

    setLayerData(mockLayerData);
  }, [executionId, testCaseId]);

  const getLayerColor = (layer: string) => {
    const colors: Record<string, string> = {
      'PHY': 'bg-red-100 text-red-800 border-red-200',
      'MAC': 'bg-orange-100 text-orange-800 border-orange-200',
      'RLC': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'PDCP': 'bg-green-100 text-green-800 border-green-200',
      'RRC': 'bg-blue-100 text-blue-800 border-blue-200',
      'NAS': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[layer] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'inactive': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'UL': return '⬆️';
      case 'DL': return '⬇️';
      case 'BIDIRECTIONAL': return '↕️';
      default: return '↔️';
    }
  };

  const selectedLayerData = layerData.find(layer => layer.layer === selectedLayer);

  return (
    <div className="protocol-layer-display">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Protocol Layer Display</h2>
              <Badge variant="outline" className="text-xs">
                {selectedLayers.length} layers
              </Badge>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant={isRealTime ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsRealTime(!isRealTime)}
              >
                <Activity className="w-4 h-4 mr-1" />
                Real-time
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="1m">Last 1 minute</option>
              <option value="5m">Last 5 minutes</option>
              <option value="15m">Last 15 minutes</option>
              <option value="1h">Last 1 hour</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Layer Selection Panel */}
        <div className="w-80 border-r border-gray-200 bg-gray-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-sm">Protocol Layers</h3>
          </div>
          <div className="p-4 space-y-3">
            {layerData.map((layer) => (
              <Card 
                key={layer.layer}
                className={`cursor-pointer transition-all ${
                  selectedLayer === layer.layer ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedLayer(layer.layer)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge className={getLayerColor(layer.layer)}>
                        {layer.layer}
                      </Badge>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${getStatusColor(layer.status)}`}>
                        {getStatusIcon(layer.status)}
                        <span>{layer.status}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{layer.messageCount}</div>
                      <div className="text-xs text-gray-600">messages</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Success Rate</span>
                      <span className="font-medium">{layer.successRate}%</span>
                    </div>
                    <Progress value={layer.successRate} className="h-1" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Avg Latency</span>
                      <span className="font-medium">{layer.averageLatency}ms</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Throughput</span>
                      <span className="font-medium">{layer.throughput} Mbps</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-600">
                    Protocol: {layer.protocol}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedLayerData && (
            <>
              {/* Layer Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Badge className={getLayerColor(selectedLayerData.layer)}>
                      {selectedLayerData.layer}
                    </Badge>
                    <div>
                      <h3 className="font-semibold">{selectedLayerData.protocol}</h3>
                      <p className="text-sm text-gray-600">
                        Last activity: {selectedLayerData.lastActivity.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-1 px-3 py-1 rounded text-sm ${getStatusColor(selectedLayerData.status)}`}>
                      {getStatusIcon(selectedLayerData.status)}
                      <span>{selectedLayerData.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex-1">
                <Tabs value={viewMode} onValueChange={setViewMode}>
                  <div className="border-b border-gray-200">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="messages">Messages</TabsTrigger>
                      <TabsTrigger value="parameters">Parameters</TabsTrigger>
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Statistics */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <BarChart3 className="w-5 h-5 mr-2" />
                            Statistics
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total Messages</span>
                            <span className="font-medium">{selectedLayerData.messageCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Error Count</span>
                            <span className="font-medium text-red-600">{selectedLayerData.errorCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Success Rate</span>
                            <span className="font-medium text-green-600">{selectedLayerData.successRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Average Latency</span>
                            <span className="font-medium">{selectedLayerData.averageLatency}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Throughput</span>
                            <span className="font-medium">{selectedLayerData.throughput} Mbps</span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Performance Metrics */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Performance
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {Object.entries(selectedLayerData.performance).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-sm text-gray-600 capitalize">
                                {key.replace('_', ' ')}
                              </span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Capabilities */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Shield className="w-5 h-5 mr-2" />
                            Capabilities
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {Object.entries(selectedLayerData.capabilities).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-sm text-gray-600 capitalize">
                                {key.replace('_', ' ')}:
                              </span>
                              <div className="text-sm font-medium mt-1">
                                {Array.isArray(value) ? value.join(', ') : value.toString()}
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Messages Tab */}
                  <TabsContent value="messages" className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Layer Messages</h3>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant={showRawData ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setShowRawData(!showRawData)}
                          >
                            Raw Data
                          </Button>
                          <Button
                            variant={showDecodedData ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setShowDecodedData(!showDecodedData)}
                          >
                            Decoded
                          </Button>
                          <Button
                            variant={showInformationElements ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setShowInformationElements(!showInformationElements)}
                          >
                            IEs
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-center text-gray-500 py-8">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No messages available for this layer</p>
                        <p className="text-sm">Messages will appear here during test execution</p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Parameters Tab */}
                  <TabsContent value="parameters" className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Settings className="w-5 h-5 mr-2" />
                            Layer Parameters
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {Object.entries(selectedLayerData.parameters).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-sm text-gray-600 capitalize">
                                  {key.replace('_', ' ')}
                                </span>
                                <span className="font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Database className="w-5 h-5 mr-2" />
                            Configuration
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {Object.entries(selectedLayerData.configuration).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-sm text-gray-600 capitalize">
                                  {key.replace('_', ' ')}
                                </span>
                                <span className="font-medium">{value.toString()}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Performance Tab */}
                  <TabsContent value="performance" className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Activity className="w-5 h-5 mr-2" />
                            Real-time Metrics
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Message Count</span>
                            <span className="font-medium">{selectedLayerData.messageCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Error Rate</span>
                            <span className="font-medium text-red-600">
                              {((selectedLayerData.errorCount / selectedLayerData.messageCount) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Success Rate</span>
                            <span className="font-medium text-green-600">{selectedLayerData.successRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Average Latency</span>
                            <span className="font-medium">{selectedLayerData.averageLatency}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Throughput</span>
                            <span className="font-medium">{selectedLayerData.throughput} Mbps</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <BarChart3 className="w-5 h-5 mr-2" />
                            Statistics
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {Object.entries(selectedLayerData.statistics).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-sm text-gray-600 capitalize">
                                {key.replace('_', ' ')}
                              </span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProtocolLayerDisplay;