'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  MapPin, 
  Activity, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Signal,
  Wifi,
  Navigation
} from 'lucide-react';

interface V2xVehicle {
  id: string;
  type: 'vehicle' | 'pedestrian' | 'infrastructure';
  position: { x: number; y: number };
  speed: number;
  direction: number;
  status: 'active' | 'inactive' | 'warning';
  lastUpdate: Date;
  messages: number;
}

interface V2xMessage {
  id: string;
  type: 'BSM' | 'PSM' | 'SSM' | 'MAP' | 'SPAT';
  source: string;
  destination: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
  content: any;
}

interface V2xOverviewProps {
  executionId: string;
  testCaseId: string;
  userId: string;
}

const V2xOverview: React.FC<V2xOverviewProps> = ({ 
  executionId, 
  testCaseId, 
  userId 
}) => {
  const [v2xStatus, setV2xStatus] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    totalMessages: 0,
    averageLatency: 0,
    coverageArea: 0,
    safetyAlerts: 0
  });

  const [vehicles, setVehicles] = useState<V2xVehicle[]>([]);
  const [messages, setMessages] = useState<V2xMessage[]>([]);

  useEffect(() => {
    const simulateData = () => {
      const vehicleTypes = ['vehicle', 'pedestrian', 'infrastructure'];
      
      const mockVehicles: V2xVehicle[] = Array.from({ length: 12 }, (_, index) => ({
        id: `v2x-${index}`,
        type: vehicleTypes[index % 3] as any,
        position: { 
          x: Math.random() * 1000, 
          y: Math.random() * 1000 
        },
        speed: Math.random() * 120,
        direction: Math.random() * 360,
        status: Math.random() > 0.2 ? 'active' : 'inactive',
        lastUpdate: new Date(),
        messages: Math.floor(Math.random() * 100)
      }));

      const messageTypes = ['BSM', 'PSM', 'SSM', 'MAP', 'SPAT'];
      const mockMessages: V2xMessage[] = Array.from({ length: 8 }, (_, index) => ({
        id: `msg-${index}`,
        type: messageTypes[index % 5] as any,
        source: `vehicle-${Math.floor(Math.random() * 10)}`,
        destination: 'broadcast',
        timestamp: new Date(),
        priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as any,
        content: {
          speed: Math.random() * 100,
          position: { lat: Math.random() * 180 - 90, lng: Math.random() * 360 - 180 }
        }
      }));

      setVehicles(mockVehicles);
      setMessages(mockMessages);

      const activeVehicles = mockVehicles.filter(v => v.status === 'active').length;
      const safetyAlerts = mockMessages.filter(m => m.priority === 'high').length;

      setV2xStatus({
        totalVehicles: mockVehicles.length,
        activeVehicles: activeVehicles,
        totalMessages: mockMessages.length,
        averageLatency: Math.random() * 50 + 10,
        coverageArea: Math.random() * 5 + 2,
        safetyAlerts: safetyAlerts
      });
    };

    simulateData();
    const interval = setInterval(simulateData, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'inactive':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'inactive':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getVehicleTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'vehicle': 'bg-blue-100 text-blue-800',
      'pedestrian': 'bg-green-100 text-green-800',
      'infrastructure': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getMessageTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'BSM': 'bg-blue-100 text-blue-800',
      'PSM': 'bg-green-100 text-green-800',
      'SSM': 'bg-yellow-100 text-yellow-800',
      'MAP': 'bg-purple-100 text-purple-800',
      'SPAT': 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Car className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">V2X Network Overview</h1>
            <p className="text-sm text-gray-600">Vehicle-to-Everything communication monitoring</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">V2X Network Active</span>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Vehicles</h3>
              <Car className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600">{v2xStatus.totalVehicles}</div>
            <p className="text-sm text-gray-500 mt-1">{v2xStatus.activeVehicles} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Messages</h3>
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600">{v2xStatus.totalMessages}</div>
            <p className="text-sm text-gray-500 mt-1">per minute</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Avg Latency</h3>
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-600">{v2xStatus.averageLatency.toFixed(1)}</div>
            <p className="text-sm text-gray-500 mt-1">ms</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Safety Alerts</h3>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-red-600">{v2xStatus.safetyAlerts}</div>
            <p className="text-sm text-gray-500 mt-1">high priority</p>
          </CardContent>
        </Card>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* V2X Vehicles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Car className="w-5 h-5 mr-2" />
              V2X Vehicles & Infrastructure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vehicles.slice(0, 6).map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${vehicle.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <div className="font-medium text-gray-900">{vehicle.id}</div>
                      <div className="text-sm text-gray-500">
                        Speed: {vehicle.speed.toFixed(1)} km/h • {vehicle.messages} msgs
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getVehicleTypeColor(vehicle.type)}>
                      {vehicle.type}
                    </Badge>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${getStatusColor(vehicle.status)}`}>
                      {getStatusIcon(vehicle.status)}
                      <span>{vehicle.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* V2X Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent V2X Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {messages.slice(0, 6).map((message) => (
                <div key={message.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <div>
                      <div className="font-medium text-gray-900">{message.type}</div>
                      <div className="text-sm text-gray-500">
                        From: {message.source} • {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getMessageTypeColor(message.type)}>
                      {message.type}
                    </Badge>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${getPriorityColor(message.priority)}`}>
                      <span>{message.priority}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* V2X Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Navigation className="w-5 h-5 mr-2" />
            V2X Safety Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold text-green-800">Forward Collision Warning</div>
              <div className="text-sm text-green-600">Active monitoring</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="font-semibold text-yellow-800">Emergency Brake Alert</div>
              <div className="text-sm text-yellow-600">2 vehicles detected</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Signal className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold text-blue-800">Intersection Safety</div>
              <div className="text-sm text-blue-600">Traffic light coordination</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default V2xOverview;