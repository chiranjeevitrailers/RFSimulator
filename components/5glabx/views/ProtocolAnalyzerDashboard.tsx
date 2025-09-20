'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { 
  Play, 
  Pause, 
  Square, 
  RefreshCw, 
  Activity, 
  Signal, 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Layers,
  Wifi,
  Smartphone,
  Server,
  BarChart3
} from 'lucide-react';
import { protocolAnalyzerSimulator, ProtocolMessage, ProtocolStats, LayerSpecificStats } from '../services/ProtocolAnalyzerSimulator';
import ProtocolMessageDecoder from '../components/ProtocolMessageDecoder';

const ProtocolAnalyzerDashboard: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<ProtocolMessage[]>([]);
  const [stats, setStats] = useState<ProtocolStats>({
    totalMessages: 0,
    messagesPerSecond: 0,
    errorRate: 0,
    averageLatency: 0,
    throughput: 0,
    activeUEs: 0,
    cellLoad: 0
  });
  const [layerStats, setLayerStats] = useState<LayerSpecificStats | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ProtocolMessage | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning) {
        const newMessages = protocolAnalyzerSimulator.getMessages();
        const newStats = protocolAnalyzerSimulator.getStats();
        const newLayerStats = protocolAnalyzerSimulator.getLayerStats();
        
        setMessages(newMessages.slice(-100)); // Keep last 100 messages
        setStats(newStats);
        setLayerStats(newLayerStats);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const startAnalysis = () => {
    protocolAnalyzerSimulator.startSimulation();
    setIsRunning(true);
  };

  const stopAnalysis = () => {
    protocolAnalyzerSimulator.stopSimulation();
    setIsRunning(false);
  };

  const clearData = () => {
    protocolAnalyzerSimulator.clearMessages();
    setMessages([]);
    setSelectedMessage(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'invalid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLayerColor = (layer: string) => {
    switch (layer) {
      case 'PHY': return 'bg-blue-100 text-blue-800';
      case 'MAC': return 'bg-green-100 text-green-800';
      case 'RLC': return 'bg-yellow-100 text-yellow-800';
      case 'PDCP': return 'bg-purple-100 text-purple-800';
      case 'RRC': return 'bg-red-100 text-red-800';
      case 'NAS': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'UL': return '↗️';
      case 'DL': return '↘️';
      case 'BIDIRECTIONAL': return '↔️';
      default: return '↔️';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">5G Protocol Analyzer</h1>
          <p className="text-gray-600 mt-1">Real-time 5G NR Protocol Analysis & Monitoring</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {isRunning ? 'LIVE ANALYSIS' : 'STOPPED'}
            </span>
          </div>
          <Button
            onClick={isRunning ? stopAnalysis : startAnalysis}
            className={isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? 'Stop Analysis' : 'Start Analysis'}
          </Button>
          <Button onClick={clearData} variant="outline">
            <Square className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMessages.toLocaleString()}</p>
              </div>
              <Database className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">
                {stats.messagesPerSecond.toFixed(1)} msg/s
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active UEs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUEs}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-blue-600">
                Cell Load: {(stats.cellLoad * 100).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Throughput</p>
                <p className="text-2xl font-bold text-gray-900">{stats.throughput.toFixed(1)}</p>
                <p className="text-xs text-gray-500">Mbps</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">
                Latency: {stats.averageLatency.toFixed(1)}ms
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Error Rate</p>
                <p className="text-2xl font-bold text-gray-900">{(stats.errorRate * 100).toFixed(2)}%</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-gray-600">
                {stats.errorRate < 0.01 ? 'Excellent' : stats.errorRate < 0.05 ? 'Good' : 'Poor'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Layer Statistics */}
      {layerStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layers className="w-5 h-5 mr-2" />
                Layer Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Wifi className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium">PHY Layer</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">RSRP: {layerStats.phy.rsrp.toFixed(1)} dBm</p>
                  <p className="text-sm text-gray-600">SINR: {layerStats.phy.sinr.toFixed(1)} dB</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <Layers className="w-4 h-4 mr-2 text-green-600" />
                  <span className="font-medium">MAC Layer</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Scheduled UEs: {layerStats.mac.scheduledUEs}</p>
                  <p className="text-sm text-gray-600">HARQ Retx: {layerStats.mac.harqRetransmissions}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <Smartphone className="w-4 h-4 mr-2 text-red-600" />
                  <span className="font-medium">RRC Layer</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Connected UEs: {layerStats.rrc.connectedUEs}</p>
                  <p className="text-sm text-gray-600">Handovers: {layerStats.rrc.handovers}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                <div className="flex items-center">
                  <Server className="w-4 h-4 mr-2 text-indigo-600" />
                  <span className="font-medium">NAS Layer</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Registrations: {layerStats.nas.registrations}</p>
                  <p className="text-sm text-gray-600">PDU Sessions: {layerStats.nas.pduSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Real-time Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>PHY Throughput</span>
                    <span>{layerStats.phy.pdschThroughput.toFixed(1)} Mbps</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(layerStats.phy.pdschThroughput, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>MAC Efficiency</span>
                    <span>{((1 - layerStats.mac.harqRetransmissions / 100) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${Math.max(0, (1 - layerStats.mac.harqRetransmissions / 100) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>RRC Success Rate</span>
                    <span>{((layerStats.rrc.connectedUEs / (layerStats.rrc.connectedUEs + layerStats.rrc.connectionReleases)) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (layerStats.rrc.connectedUEs / (layerStats.rrc.connectedUEs + layerStats.rrc.connectionReleases)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Message List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Protocol Messages ({messages.length})
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Live
              </Badge>
              <Button size="sm" variant="outline" onClick={() => setMessages(protocolAnalyzerSimulator.getMessages().slice(-100))}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {messages.slice(-50).reverse().map((message) => (
              <div
                key={message.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getDirectionIcon(message.direction)}</span>
                    <Badge className={getLayerColor(message.layer)}>
                      {message.layer}
                    </Badge>
                    <span className="font-medium text-gray-900">{message.messageName}</span>
                    <span className="text-sm text-gray-500">{message.messageType}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                    <Badge className={getStatusColor(message.validationStatus)}>
                      {message.validationStatus}
                    </Badge>
                    <span className="text-sm text-gray-500">{message.messageSize} bytes</span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">RNTI:</span> {message.rnti} | 
                  <span className="font-medium ml-2">UE ID:</span> {message.ueId} | 
                  <span className="font-medium ml-2">Cell ID:</span> {message.cellId}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message Details */}
      {selectedMessage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Message Details
              </div>
              <Button size="sm" variant="outline" onClick={() => setSelectedMessage(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Message Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Message ID:</span>
                    <span className="font-mono">{selectedMessage.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timestamp:</span>
                    <span>{new Date(selectedMessage.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Layer:</span>
                    <Badge className={getLayerColor(selectedMessage.layer)}>
                      {selectedMessage.layer}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Protocol:</span>
                    <span>{selectedMessage.protocol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Direction:</span>
                    <span>{selectedMessage.direction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span>{selectedMessage.messageSize} bytes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Time:</span>
                    <span>{selectedMessage.processingTime} ms</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Information Elements</h4>
                <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
                  {Object.entries(selectedMessage.informationElements).map(([ieName, ieData]: [string, any]) => (
                    <div key={ieName} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium">{ieName}:</span>
                      <span className="font-mono text-xs">{JSON.stringify(ieData.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Raw Hex Data</h4>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                {selectedMessage.rawHex}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message Decoder Modal */}
      {selectedMessage && (
        <ProtocolMessageDecoder
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </div>
  );
};

export default ProtocolAnalyzerDashboard;