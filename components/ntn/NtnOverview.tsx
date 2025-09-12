'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Satellite, 
  Globe, 
  Activity, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Signal,
  MapPin,
  Navigation
} from 'lucide-react';

interface NtnSatellite {
  id: string;
  name: string;
  type: 'LEO' | 'MEO' | 'GEO';
  altitude: number;
  inclination: number;
  status: 'active' | 'inactive' | 'maintenance';
  coverage: number;
  lastUpdate: Date;
  users: number;
}

interface NtnConnection {
  id: string;
  satelliteId: string;
  userId: string;
  signalStrength: number;
  dopplerShift: number;
  latency: number;
  status: 'connected' | 'connecting' | 'disconnected';
  timestamp: Date;
}

interface NtnOverviewProps {
  executionId: string;
  testCaseId: string;
  userId: string;
}

const NtnOverview: React.FC<NtnOverviewProps> = ({ 
  executionId, 
  testCaseId, 
  userId 
}) => {
  const [ntnStatus, setNtnStatus] = useState({
    totalSatellites: 0,
    activeSatellites: 0,
    totalConnections: 0,
    averageLatency: 0,
    coverageArea: 0,
    dopplerShifts: 0
  });

  const [satellites, setSatellites] = useState<NtnSatellite[]>([]);
  const [connections, setConnections] = useState<NtnConnection[]>([]);

  useEffect(() => {
    const simulateData = () => {
      const satelliteTypes = ['LEO', 'MEO', 'GEO'];
      
      const mockSatellites: NtnSatellite[] = Array.from({ length: 8 }, (_, index) => ({
        id: `sat-${index}`,
        name: `Satellite-${index + 1}`,
        type: satelliteTypes[index % 3] as any,
        altitude: [550, 20000, 35786][index % 3],
        inclination: Math.random() * 90,
        status: Math.random() > 0.2 ? 'active' : 'inactive',
        coverage: Math.random() * 1000 + 500,
        lastUpdate: new Date(),
        users: Math.floor(Math.random() * 1000)
      }));

      const mockConnections: NtnConnection[] = Array.from({ length: 12 }, (_, index) => ({
        id: `conn-${index}`,
        satelliteId: `sat-${Math.floor(Math.random() * 8)}`,
        userId: `user-${index}`,
        signalStrength: Math.random() * 100,
        dopplerShift: (Math.random() - 0.5) * 20,
        latency: Math.random() * 100 + 50,
        status: ['connected', 'connecting', 'disconnected'][Math.floor(Math.random() * 3)] as any,
        timestamp: new Date()
      }));

      setSatellites(mockSatellites);
      setConnections(mockConnections);

      const activeSatellites = mockSatellites.filter(s => s.status === 'active').length;
      const activeConnections = mockConnections.filter(c => c.status === 'connected').length;
      const avgLatency = mockConnections.reduce((sum, c) => sum + c.latency, 0) / mockConnections.length;

      setNtnStatus({
        totalSatellites: mockSatellites.length,
        activeSatellites: activeSatellites,
        totalConnections: activeConnections,
        averageLatency: avgLatency,
        coverageArea: mockSatellites.reduce((sum, s) => sum + s.coverage, 0),
        dopplerShifts: mockConnections.filter(c => Math.abs(c.dopplerShift) > 5).length
      });
    };

    simulateData();
    const interval = setInterval(simulateData, 4000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
        return 'text-green-600 bg-green-100';
      case 'connecting':
        return 'text-yellow-600 bg-yellow-100';
      case 'inactive':
      case 'disconnected':
        return 'text-red-600 bg-red-100';
      case 'maintenance':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
        return <CheckCircle className="w-4 h-4" />;
      case 'connecting':
        return <Clock className="w-4 h-4" />;
      case 'inactive':
      case 'disconnected':
        return <XCircle className="w-4 h-4" />;
      case 'maintenance':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getSatelliteTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'LEO': 'bg-blue-100 text-blue-800',
      'MEO': 'bg-green-100 text-green-800',
      'GEO': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getAltitudeColor = (altitude: number) => {
    if (altitude < 2000) return 'text-blue-600';
    if (altitude < 30000) return 'text-green-600';
    return 'text-purple-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Satellite className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Non-Terrestrial Network (NTN)</h1>
            <p className="text-sm text-gray-600">Satellite communication monitoring and analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">NTN Network Active</span>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Satellites</h3>
              <Satellite className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600">{ntnStatus.totalSatellites}</div>
            <p className="text-sm text-gray-500 mt-1">{ntnStatus.activeSatellites} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Active Connections</h3>
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600">{ntnStatus.totalConnections}</div>
            <p className="text-sm text-gray-500 mt-1">users connected</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Avg Latency</h3>
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-600">{ntnStatus.averageLatency.toFixed(0)}</div>
            <p className="text-sm text-gray-500 mt-1">ms</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Doppler Shifts</h3>
              <Signal className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-orange-600">{ntnStatus.dopplerShifts}</div>
            <p className="text-sm text-gray-500 mt-1">significant shifts</p>
          </CardContent>
        </Card>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NTN Satellites */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Satellite className="w-5 h-5 mr-2" />
              Satellite Constellation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {satellites.map((satellite) => (
                <div key={satellite.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${satellite.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <div className="font-medium text-gray-900">{satellite.name}</div>
                      <div className="text-sm text-gray-500">
                        Altitude: {satellite.altitude.toLocaleString()} km • {satellite.users} users
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSatelliteTypeColor(satellite.type)}>
                      {satellite.type}
                    </Badge>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${getStatusColor(satellite.status)}`}>
                      {getStatusIcon(satellite.status)}
                      <span>{satellite.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* NTN Connections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Active Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {connections.slice(0, 6).map((connection) => (
                <div key={connection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${connection.status === 'connected' ? 'bg-green-500' : connection.status === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    <div>
                      <div className="font-medium text-gray-900">{connection.userId}</div>
                      <div className="text-sm text-gray-500">
                        Signal: {connection.signalStrength.toFixed(1)} dBm • Doppler: {connection.dopplerShift.toFixed(1)} Hz
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-600">
                      {connection.latency.toFixed(0)}ms
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${getStatusColor(connection.status)}`}>
                      {getStatusIcon(connection.status)}
                      <span>{connection.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NTN Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            NTN Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">99.2%</div>
              <div className="text-sm text-gray-600">Network Availability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2.1 Mbps</div>
              <div className="text-sm text-gray-600">Average Throughput</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">±15 Hz</div>
              <div className="text-sm text-gray-600">Doppler Range</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">85%</div>
              <div className="text-sm text-gray-600">Coverage Efficiency</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NTN Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            NTN Communication Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Satellite className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold text-blue-800">LEO Constellation</div>
              <div className="text-sm text-blue-600">Low latency, high mobility</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Globe className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold text-green-800">GEO Coverage</div>
              <div className="text-sm text-green-600">Wide area, stable coverage</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Navigation className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="font-semibold text-purple-800">Handover Management</div>
              <div className="text-sm text-purple-600">Seamless satellite switching</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NtnOverview;