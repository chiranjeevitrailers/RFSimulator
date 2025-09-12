'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wifi, 
  Battery, 
  Activity, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Signal,
  Zap,
  Database
} from 'lucide-react';

interface NbiotDevice {
  id: string;
  type: 'sensor' | 'meter' | 'tracker' | 'monitor';
  batteryLevel: number;
  signalStrength: number;
  status: 'active' | 'sleep' | 'offline';
  lastTransmission: Date;
  dataRate: number;
  coverage: 'good' | 'fair' | 'poor';
}

interface NbiotMessage {
  id: string;
  deviceId: string;
  messageType: 'data' | 'control' | 'alarm';
  size: number;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
  retransmissions: number;
  success: boolean;
}

interface NbiotOverviewProps {
  executionId: string;
  testCaseId: string;
  userId: string;
}

const NbiotOverview: React.FC<NbiotOverviewProps> = ({ 
  executionId, 
  testCaseId, 
  userId 
}) => {
  const [nbiotStatus, setNbiotStatus] = useState({
    totalDevices: 0,
    activeDevices: 0,
    totalMessages: 0,
    averageLatency: 0,
    batteryLevel: 0,
    coverageQuality: 0
  });

  const [devices, setDevices] = useState<NbiotDevice[]>([]);
  const [messages, setMessages] = useState<NbiotMessage[]>([]);

  useEffect(() => {
    const simulateData = () => {
      const deviceTypes = ['sensor', 'meter', 'tracker', 'monitor'];
      
      const mockDevices: NbiotDevice[] = Array.from({ length: 15 }, (_, index) => ({
        id: `nbiot-${index}`,
        type: deviceTypes[index % 4] as any,
        batteryLevel: Math.random() * 100,
        signalStrength: Math.random() * 100,
        status: Math.random() > 0.3 ? 'active' : Math.random() > 0.5 ? 'sleep' : 'offline',
        lastTransmission: new Date(Date.now() - Math.random() * 3600000),
        dataRate: Math.random() * 1000 + 100,
        coverage: ['good', 'fair', 'poor'][Math.floor(Math.random() * 3)] as any
      }));

      const messageTypes = ['data', 'control', 'alarm'];
      const mockMessages: NbiotMessage[] = Array.from({ length: 10 }, (_, index) => ({
        id: `msg-${index}`,
        deviceId: `nbiot-${Math.floor(Math.random() * 15)}`,
        messageType: messageTypes[index % 3] as any,
        size: Math.floor(Math.random() * 200) + 50,
        timestamp: new Date(Date.now() - Math.random() * 1800000),
        priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as any,
        retransmissions: Math.floor(Math.random() * 3),
        success: Math.random() > 0.1
      }));

      setDevices(mockDevices);
      setMessages(mockMessages);

      const activeDevices = mockDevices.filter(d => d.status === 'active').length;
      const avgBattery = mockDevices.reduce((sum, d) => sum + d.batteryLevel, 0) / mockDevices.length;
      const goodCoverage = mockDevices.filter(d => d.coverage === 'good').length;
      const avgLatency = Math.random() * 1000 + 500;

      setNbiotStatus({
        totalDevices: mockDevices.length,
        activeDevices: activeDevices,
        totalMessages: mockMessages.length,
        averageLatency: avgLatency,
        batteryLevel: avgBattery,
        coverageQuality: (goodCoverage / mockDevices.length) * 100
      });
    };

    simulateData();
    const interval = setInterval(simulateData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'sleep':
        return 'text-yellow-600 bg-yellow-100';
      case 'offline':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'sleep':
        return <Clock className="w-4 h-4" />;
      case 'offline':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getDeviceTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'sensor': 'bg-blue-100 text-blue-800',
      'meter': 'bg-green-100 text-green-800',
      'tracker': 'bg-purple-100 text-purple-800',
      'monitor': 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getCoverageColor = (coverage: string) => {
    switch (coverage) {
      case 'good':
        return 'text-green-600 bg-green-100';
      case 'fair':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMessageTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'data': 'bg-blue-100 text-blue-800',
      'control': 'bg-green-100 text-green-800',
      'alarm': 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Wifi className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">NB-IoT Network Overview</h1>
            <p className="text-sm text-gray-600">Narrowband Internet of Things monitoring</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">NB-IoT Network Active</span>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Devices</h3>
              <Wifi className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600">{nbiotStatus.totalDevices}</div>
            <p className="text-sm text-gray-500 mt-1">{nbiotStatus.activeDevices} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Messages</h3>
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600">{nbiotStatus.totalMessages}</div>
            <p className="text-sm text-gray-500 mt-1">per hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Avg Battery</h3>
              <Battery className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-600">{nbiotStatus.batteryLevel.toFixed(0)}%</div>
            <p className="text-sm text-gray-500 mt-1">device battery</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Coverage</h3>
              <Signal className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-orange-600">{nbiotStatus.coverageQuality.toFixed(0)}%</div>
            <p className="text-sm text-gray-500 mt-1">good coverage</p>
          </CardContent>
        </Card>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NB-IoT Devices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wifi className="w-5 h-5 mr-2" />
              NB-IoT Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {devices.slice(0, 8).map((device) => (
                <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${device.status === 'active' ? 'bg-green-500' : device.status === 'sleep' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    <div>
                      <div className="font-medium text-gray-900">{device.id}</div>
                      <div className="text-sm text-gray-500">
                        Battery: {device.batteryLevel.toFixed(0)}% • Signal: {device.signalStrength.toFixed(0)} dBm
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getDeviceTypeColor(device.type)}>
                      {device.type}
                    </Badge>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${getCoverageColor(device.coverage)}`}>
                      <span>{device.coverage}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* NB-IoT Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {messages.slice(0, 8).map((message) => (
                <div key={message.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${message.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <div className="font-medium text-gray-900">{message.deviceId}</div>
                      <div className="text-sm text-gray-500">
                        Size: {message.size} bytes • {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getMessageTypeColor(message.messageType)}>
                      {message.messageType}
                    </Badge>
                    {message.retransmissions > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {message.retransmissions} retx
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NB-IoT Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            NB-IoT Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">99.8%</div>
              <div className="text-sm text-gray-600">Message Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">250 kbps</div>
              <div className="text-sm text-gray-600">Peak Data Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">10 years</div>
              <div className="text-sm text-gray-600">Battery Life</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">15 km</div>
              <div className="text-sm text-gray-600">Coverage Range</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NB-IoT Use Cases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            NB-IoT Use Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold text-blue-800">Smart Meters</div>
              <div className="text-sm text-blue-600">Energy monitoring</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Wifi className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold text-green-800">Environmental Sensors</div>
              <div className="text-sm text-green-600">Air quality monitoring</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Signal className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="font-semibold text-purple-800">Asset Tracking</div>
              <div className="text-sm text-purple-600">Fleet management</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Battery className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="font-semibold text-orange-800">Smart Agriculture</div>
              <div className="text-sm text-orange-600">Soil monitoring</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NbiotOverview;